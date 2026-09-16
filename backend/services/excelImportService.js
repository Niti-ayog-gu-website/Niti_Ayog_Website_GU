// services/excelImportService.js
const XLSX = require('xlsx');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const AdmissionRecord = require('../models/AdmissionRecord');
const {
  FIELD_MAP,
  REQUIRED_FIELDS,
  ARRAY_FIELDS,
  UNIQUE_KEY_FIELDS,
  EXTRA_FIELD_MARKER,
} = require('../constants/columnMap');

const MODEL_BY_TYPE = {
  student: Student,
  alumni: Alumni,
  admission: AdmissionRecord,
};

// ── helpers ──────────────────────────────────────────────────────────
const normalize = (str) =>
  (str || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Splits "MS Office (Word, Excel), Python" on commas outside parentheses —
// same rule your Google Sheets sync already uses for skills fields.
const parseCommaList = (val) => {
  if (val === undefined || val === null) return [];
  const str = val.toString();
  const results = [];
  let depth = 0, current = '';
  for (const ch of str) {
    if (ch === '(') { depth++; current += ch; }
    else if (ch === ')') { depth--; current += ch; }
    else if (ch === ',' && depth === 0) {
      const t = current.trim();
      if (t) results.push(t);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) results.push(current.trim());
  return results;
};

// Mongoose returns Map fields as plain objects when using .lean(), but be
// defensive in case a future mongoose version doesn't.
const toPlainObject = (val) => {
  if (!val) return {};
  if (val instanceof Map) return Object.fromEntries(val);
  return val;
};

// ── 1. Parse workbook → headers + rows ──────────────────────────────
const parseWorkbook = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('Workbook has no sheets');

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

  if (!rows.length) throw new Error('No data rows found in the sheet');

  const headers = Object.keys(rows[0]);
  return { headers, rows };
};

// ── 2. Suggest a mapping for the given headers ──────────────────────
// Every header gets EITHER a predefined field match, OR null (meaning:
// "no confident match" — the frontend should let the admin choose a
// predefined field, mark it as extra, or ignore it).
const suggestMapping = (headers, type) => {
  const fields = FIELD_MAP[type];
  if (!fields) throw new Error(`Unknown type: ${type}`);

  const aliasLookup = {};
  Object.entries(fields).forEach(([targetField, aliases]) => {
    aliases.forEach((alias) => {
      aliasLookup[normalize(alias)] = targetField;
    });
    aliasLookup[normalize(targetField)] = targetField; // field name itself counts
  });

  return headers.map((header) => {
    const normHeader = normalize(header);

    if (aliasLookup[normHeader]) {
      return { header, suggestedField: aliasLookup[normHeader], confidence: 'high' };
    }

    // Loose match: compare whole words, not raw substrings. Raw substring
    // matching is unsafe here — e.g. "ou" (alias for ou_name) is a
    // substring of "group" ("blood gr-OU-p"), which would wrongly match
    // a totally unrelated "Blood Group" column. Requiring every alias
    // word to appear as a whole word in the header avoids that class of
    // false positive on any future/unpredicted column name too.
    const headerTokens = new Set(normHeader.split(' ').filter(Boolean));
    let bestMatch = null;
    let bestSpecificity = 0;
    for (const [alias, targetField] of Object.entries(aliasLookup)) {
      const aliasTokens = alias.split(' ').filter(Boolean);
      const allTokensPresent = aliasTokens.every((t) => headerTokens.has(t));
      if (allTokensPresent && aliasTokens.length > bestSpecificity) {
        bestSpecificity = aliasTokens.length;
        bestMatch = targetField;
      }
    }
    if (bestMatch) {
      return { header, suggestedField: bestMatch, confidence: 'medium' };
    }

    // Unrecognized column — not an error. The admin decides at confirm
    // time whether to map it to a predefined field, keep it as extra
    // data, or ignore it.
    return { header, suggestedField: null, confidence: 'none' };
  });
};

// ── 3. Apply a confirmed mapping and save ───────────────────────────
// mapping: { originalHeader: targetFieldName | EXTRA_FIELD_MARKER | null }
const applyMapping = async (filePath, mapping, type) => {
  const model = MODEL_BY_TYPE[type];
  if (!model) throw new Error(`Unknown type: ${type}`);

  const { rows } = parseWorkbook(filePath);
  const arrayFields = ARRAY_FIELDS[type] || [];
  const requiredFields = REQUIRED_FIELDS[type] || [];
  const keyField = UNIQUE_KEY_FIELDS[type];
  if (!keyField) throw new Error(`No unique key configured for type: ${type}`);

  let inserted = 0, updated = 0, skipped = 0;
  const errors = [];
  const unmappedHeadersSeen = new Set();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +1 for header row, +1 for 0-index

    try {
      const payload = {};
      const extra = {};

      Object.entries(mapping).forEach(([header, targetField]) => {
        if (!targetField) return; // admin chose to ignore this column
        const rawValue = row[header];
        const value = (rawValue ?? '').toString().trim();
        if (value === '') return;

        if (targetField === EXTRA_FIELD_MARKER) {
          extra[header] = value;
          unmappedHeadersSeen.add(header);
          return;
        }

        if (arrayFields.includes(targetField)) {
          const arr = parseCommaList(rawValue);
          if (arr.length) payload[targetField] = arr;
        } else {
          payload[targetField] = value;
        }
      });

      if (Object.keys(extra).length) payload.extra_fields = extra;

      // year_of_passing is numeric on schemas that have it
      if (payload.year_of_passing !== undefined) {
        const years = payload.year_of_passing.toString().match(/\d{4}/g);
        payload.year_of_passing = years ? Number(years[years.length - 1]) : undefined;
        if (!payload.year_of_passing) delete payload.year_of_passing;
      }

      if (keyField === 'email' && payload.email) {
        payload.email = payload.email.toLowerCase();
      }

      const missingRequired = requiredFields.filter((f) => !payload[f]);
      if (missingRequired.length) {
        skipped++;
        errors.push(`Row ${rowNum}: missing required field(s) ${missingRequired.join(', ')}`);
        continue;
      }

      const result = await model.findOneAndUpdate(
        { [keyField]: payload[keyField] },
        { $set: payload },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true, rawResult: true }
      );

      if (result.lastErrorObject?.upserted) inserted++;
      else updated++;
    } catch (err) {
      skipped++;
      errors.push(`Row ${rowNum}: ${err.message}`);
    }
  }

  return {
    totalRows: rows.length,
    inserted,
    updated,
    skipped,
    errors,
    // headers that were stored as extra_fields rather than a predefined
    // column — useful for deciding whether to promote one to a real field
    extraColumnsSaved: Array.from(unmappedHeadersSeen),
  };
};

// ── 4. Export normalized data for the statistics team ───────────────
// Includes predefined columns first, then any extra_fields keys found
// across the records, so nothing captured via "extra" is left out.
const exportToExcel = async (type, filters = {}) => {
  const model = MODEL_BY_TYPE[type];
  if (!model) throw new Error(`Unknown type: ${type}`);

  const predefinedFields = Object.keys(FIELD_MAP[type]);
  const docs = await model.find(filters).lean();

  const extraKeysSet = new Set();
  docs.forEach((doc) => {
    Object.keys(toPlainObject(doc.extra_fields)).forEach((k) => extraKeysSet.add(k));
  });
  const extraKeys = Array.from(extraKeysSet);
  const allFields = [...predefinedFields, ...extraKeys];

  const rows = docs.map((doc) => {
    const row = {};
    predefinedFields.forEach((field) => {
      const val = doc[field];
      row[field] = Array.isArray(val) ? val.join(', ') : (val ?? '');
    });
    const extra = toPlainObject(doc.extra_fields);
    extraKeys.forEach((key) => {
      row[key] = extra[key] ?? '';
    });
    return row;
  });

  const sheet = XLSX.utils.json_to_sheet(rows, { header: allFields });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, type);

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

module.exports = {
  parseWorkbook,
  suggestMapping,
  applyMapping,
  exportToExcel,
};
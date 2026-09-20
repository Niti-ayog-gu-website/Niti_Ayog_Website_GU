// controllers/uploadController.js
const crypto = require('crypto');
const { parseWorkbook, suggestMapping, applyMapping, exportToExcel } = require('../services/excelImportService');
const { FIELD_MAP, REQUIRED_FIELDS } = require('../constants/columnMap');
const uploadStore = require('../utils/uploadStore');

const VALID_TYPES = Object.keys(FIELD_MAP); // ['student', 'alumni', 'admission']

// POST /api/upload/preview  (multipart, field name "file", body.type = student|alumni|admission)
const previewUpload = async (req, res) => {
  try {
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: `type must be one of: ${VALID_TYPES.join(', ')}` });
    }

    const { headers, rows } = parseWorkbook(req.file.path);
    const suggestedMapping = suggestMapping(headers, type);
    const uploadId = crypto.randomUUID();

    uploadStore.create(uploadId, { filePath: req.file.path, type, headers });

    return res.json({
      success: true,
      uploadId,
      type,
      headers,
      suggestedMapping,
      sampleRows: rows.slice(0, 5),
      targetFields: Object.keys(FIELD_MAP[type]),
      requiredFields: REQUIRED_FIELDS[type],
    });
  } catch (err) {
    console.error('previewUpload error:', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Failed to parse file' });
  }
};

// POST /api/upload/confirm  { uploadId, mapping: { header: targetField | "__extra__" | null } }
const confirmUpload = async (req, res) => {
  try {
    const { uploadId, mapping } = req.body;

    if (!uploadId || !mapping) {
      return res.status(400).json({ success: false, message: 'uploadId and mapping are required' });
    }

    const pending = uploadStore.get(uploadId);
    if (!pending) {
      return res.status(410).json({ success: false, message: 'Upload session not found or expired. Please re-upload the file.' });
    }

    const requiredFields = REQUIRED_FIELDS[pending.type] || [];
    const mappedTargets = Object.values(mapping).filter(Boolean);
    const missingRequired = requiredFields.filter((f) => !mappedTargets.includes(f));
    if (missingRequired.length) {
      return res.status(400).json({
        success: false,
        message: `Mapping is missing required field(s): ${missingRequired.join(', ')}`,
      });
    }

    const summary = await applyMapping(pending.filePath, mapping, pending.type);
    uploadStore.remove(uploadId); // cleans up the temp file too

    return res.json({ success: true, type: pending.type, ...summary });
  } catch (err) {
    console.error('confirmUpload error:', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Failed to save data' });
  }
};

// GET /api/export/:type
const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: `type must be one of: ${VALID_TYPES.join(', ')}` });
    }

    const buffer = await exportToExcel(type, {});
    const filename = `${type}_export_${Date.now()}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    console.error('exportData error:', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Failed to export data' });
  }
};

module.exports = { previewUpload, confirmUpload, exportData };
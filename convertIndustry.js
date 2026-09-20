// Run once from your project root:
// node convertIndustry.js
// Output: src/data/industryData.json

const xlsx = require("xlsx");
const fs   = require("fs");

const workbook = xlsx.readFile("NITI Aayog Project (New (FI) - Industry Perspective) (Responses).xlsx");
const sheet    = workbook.Sheets[workbook.SheetNames[0]];
const raw      = xlsx.utils.sheet_to_json(sheet);

console.log("Total rows:", raw.length);
console.log("Sample headers:", Object.keys(raw[0]).slice(0, 12));

// Helper — find column by keyword(s), returns first match
function find(row, ...keywords) {
  const key = Object.keys(row).find(k =>
    keywords.every(kw => k.toLowerCase().includes(kw.toLowerCase()))
  );
  return key ? String(row[key] ?? "").trim() : null;
}

// Helper — extract numeric prefix from Likert strings like "3. Moderate" → 3
function likert(val) {
  if (!val) return null;
  const m = String(val).match(/^(\d)/);
  return m ? Number(m[1]) : null;
}

const cleaned = raw.map(row => ({
  // ── Demographic / org fields ──────────────────────────────────
  Experience:    find(row, "Years of Professional"),
  DecisionLevel: find(row, "Decision-Making Involvement"),
  OrgType:       find(row, "Type of Organization"),
  IndustrySector:find(row, "Industry Sector"),
  OrgSize:       find(row, "Size of the Organization"),
  YearsOperation:find(row, "Years of Operation"),
  Department:    find(row, "Department", "Functional"),

  // ── Skill Importance ratings (employer expectation) ───────────
  Imp_Communication:     find(row, "Skill", "Communication Skills]"),
  Imp_Technical:         find(row, "Skill", "Technical and Domain"),
  Imp_ProblemSolving:    find(row, "Skill", "Analytical"),
  Imp_Teamwork:          find(row, "Skill", "Teamwork"),
  Imp_Adaptability:      find(row, "Skill", "Adaptability"),
  Imp_SelfOrganization:  find(row, "Skill", "Self-organization"),
  Imp_DigitalLiteracy:   find(row, "Skill", "Computer and Digital"),
  Imp_Leadership:        find(row, "Skill", "Leadership"),
  Imp_ProfEthics:        find(row, "Skill", "Professional Ethics"),
}));

const filtered = cleaned.filter(r =>
  Object.values(r).some(v => v !== null && v !== "")
);

const path = require("path");

const filePath = path.join(__dirname, "frontend/src/data/industryData.json");

fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));console.log(`✅ industryData.json created with ${filtered.length} rows`);
console.log("Sample row:", filtered[0]);
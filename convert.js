const xlsx = require("xlsx");
const fs = require("fs");

// Load Excel
const workbook = xlsx.readFile("FinalAlumniData.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const raw = xlsx.utils.sheet_to_json(sheet);

// Debug headers
console.log("HEADERS:", Object.keys(raw[0]));

// Helper: find column by keyword
function findField(row, keyword) {
  const key = Object.keys(row).find(k =>
    k.toLowerCase().includes(keyword)
  );
  return key ? row[key] : null;
}

// Clean data
const cleaned = raw.map(row => ({
  Gender: findField(row, "gender"),
  Age: findField(row, "age"),
  Education: findField(row, "education"),
  Year: findField(row, "year"),
  Income: findField(row, "income"),
  Location: findField(row, "residence"),
  MainActivity: findField(row, "activity"),
  Worked365: findField(row, "365"),
  WorkStatus: findField(row, "status")
}));

// Remove empty rows
const filtered = cleaned.filter(r =>
  Object.values(r).some(v => v !== null && v !== "")
);

// Save JSON
fs.writeFileSync("data.json", JSON.stringify(filtered, null, 2));

console.log("✅ Clean data.json created!");
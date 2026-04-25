

const xlsx = require("xlsx");
const fs = require("fs");

const workbook = xlsx.readFile("FinalAlumniData.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const raw = xlsx.utils.sheet_to_json(sheet);

console.log("HEADERS:", Object.keys(raw[0]));

function findField(row, keyword) {
  const key = Object.keys(row).find(k =>
    k.toLowerCase().includes(keyword)
  );
  return key ? row[key] : null;
}

const cleaned = raw.map(row => ({
  Gender:        findField(row, "gender"),
  Age:           findField(row, "age"),
  Education:     findField(row, "education"),
  Year:          findField(row, "year"),
  Income:        findField(row, "income"),
  Location:      findField(row, "residence"),
  MainActivity:  findField(row, "activity"),
  // FIX: use more specific keywords so they don't cross-match
  Worked365:     findField(row, "365"),
  WorkStatus:    findField(row, "last 7") ?? findField(row, "7 day") ?? findField(row, "current status") ?? findField(row, "employ"),
}));

const filtered = cleaned.filter(r =>
  Object.values(r).some(v => v !== null && v !== "")
);

// Debug: print first row so you can verify
console.log("FIRST ROW:", filtered[0]);

fs.writeFileSync("data.json", JSON.stringify(filtered, null, 2));
console.log(`✅ data.json created with ${filtered.length} rows`);
// src/hooks/useIndustryData.js
import { useMemo } from "react";
import raw from "../data/industryData.json";

function toCounts(arr) {
  const map = {};
  arr.forEach(v => {
    const key = String(v ?? "").trim();
    if (!key || key === "null" || key === "undefined" || key === "") return;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => b.count - a.count);
}

// Convert importance strings → numeric avg per skill
// "5. Extremely Important" → 5, "4. Very important" → 4, etc.
function toNumeric(val) {
  if (!val) return null;
  const m = String(val).match(/^(\d)/);
  return m ? Number(m[1]) : null;
}

function avgScore(arr) {
  const nums = arr.map(toNumeric).filter(v => v !== null);
  if (!nums.length) return 0;
  return (nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function useIndustryData() {
  return useMemo(() => {
    // ── Categorical charts ───────────────────────────────────────
    const experienceData    = toCounts(raw.map(r => r.Experience));
    const decisionData      = toCounts(raw.map(r => r.DecisionLevel));
    const orgTypeData       = toCounts(raw.map(r => r.OrgType));
    const sectorData        = toCounts(raw.map(r => r.IndustrySector));
    const orgSizeData       = toCounts(raw.map(r => r.OrgSize));
    const yearsOpData       = toCounts(raw.map(r => r.YearsOperation));
    const departmentData    = toCounts(raw.map(r => r.Department));

    // ── Skill importance avg scores (employer expectation) ───────
    const skillImportance = [
      { name: "Communication",      value: avgScore(raw.map(r => r.Imp_Communication)) },
      { name: "Technical/Domain",   value: avgScore(raw.map(r => r.Imp_Technical)) },
      { name: "Problem Solving",    value: avgScore(raw.map(r => r.Imp_ProblemSolving)) },
      { name: "Teamwork",           value: avgScore(raw.map(r => r.Imp_Teamwork)) },
      { name: "Adaptability",       value: avgScore(raw.map(r => r.Imp_Adaptability)) },
      { name: "Self-Organization",  value: avgScore(raw.map(r => r.Imp_SelfOrganization)) },
      { name: "Digital Literacy",   value: avgScore(raw.map(r => r.Imp_DigitalLiteracy)) },
      { name: "Leadership",         value: avgScore(raw.map(r => r.Imp_Leadership)) },
      { name: "Prof. Ethics",       value: avgScore(raw.map(r => r.Imp_ProfEthics)) },
    ].sort((a, b) => b.value - a.value);

    // ── Experience sorted ────────────────────────────────────────
    const EXP_ORDER = ["Less than 5 years","5–10 years","11–20 years","More than 20 years"];
    const experienceDataSorted = [...experienceData].sort(
      (a, b) => (EXP_ORDER.indexOf(a._id) + 99) % 99 - (EXP_ORDER.indexOf(b._id) + 99) % 99
    );

    // ── KPIs ─────────────────────────────────────────────────────
    const total          = raw.length;
    const privateCount   = raw.filter(r => r.OrgType === "Private Sector").length;
    const govCount       = raw.filter(r =>
      r.OrgType === "Government / PSU" || r.OrgType === "Public Sector"
    ).length;
    const topSector      = sectorData[0]?._id ?? "—";
    const topDept        = departmentData[0]?._id ?? "—";

    return {
      experienceData: experienceDataSorted,
      decisionData,
      orgTypeData,
      sectorData,
      orgSizeData,
      yearsOpData,
      departmentData,
      skillImportance,
      total,
      privateCount,
      govCount,
      topSector,
      topDept,
    };
  }, []);
}
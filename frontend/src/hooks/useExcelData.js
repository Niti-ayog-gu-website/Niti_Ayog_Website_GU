


// src/hooks/useExcelData.js
import { useMemo } from "react";
import raw from "../data/surveyData.json";

// Count occurrences of each unique value in an array
// Returns [{ _id: "X", count: N }, ...] — compatible with normalise() in dashboard
function toCounts(arr) {
  const map = {};
  arr.forEach(v => {
    const key = String(v ?? "").trim();
    if (!key || key === "null" || key === "undefined") return;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).map(([_id, count]) => ({ _id, count }));
}

export function useExcelData() {
  return useMemo(() => {
    // ── These field names confirmed from raw[0] console output ──
    // Gender, Age, Education, Year, Income, Location, MainActivity,
    // Worked365, WorkStatus  ← note: WorkStatus & Worked365 may be swapped
    // in the JSON due to convert.js bug — we handle both possibilities here

    const genderData    = toCounts(raw.map(r => r.Gender));
    const ageData       = toCounts(raw.map(r => r.Age));
    const educationData = toCounts(raw.map(r => r.Education));
    const locationData  = toCounts(raw.map(r => r.Location));
    const incomeData    = toCounts(raw.map(r => r.Income));

    // MainActivity — confirmed field name
    const activityData  = toCounts(raw.map(r => r.MainActivity));

    // Worked365 — in the buggy JSON this field actually has MainActivity values,
    // but after the convert.js fix & regeneration it will have Yes/No values.
    // We detect which is which and assign correctly:
    const w365Raw  = raw.map(r => r.Worked365);
    const wStatRaw = raw.map(r => r.WorkStatus);

    // Heuristic: Worked365 should have short Yes/No style values, not long sentences.
    // If the first non-null value is longer than 20 chars, the fields are still swapped.
    const firstW365 = w365Raw.find(v => v);
    const fieldsSwapped = firstW365 && String(firstW365).length > 20;

    const work365Data = fieldsSwapped
      ? toCounts(wStatRaw)   // use WorkStatus field when swapped
      : toCounts(w365Raw);

    const workData = fieldsSwapped
      ? toCounts(w365Raw)    // use Worked365 field when swapped
      : toCounts(wStatRaw);

    // Year — convert to string so toCounts buckets correctly
    const yearData = toCounts(raw.map(r => r.Year != null ? String(r.Year) : null));

    // ── Age sorted by bracket order ──────────────────────────────
    const AGE_ORDER = ["18-20","21-23","24-26","27-28","Above 28"];
    const ageDataSorted = [...ageData].sort(
      (a, b) => {
        const ai = AGE_ORDER.indexOf(a._id);
        const bi = AGE_ORDER.indexOf(b._id);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      }
    );

    // ── Income sorted by bracket order ───────────────────────────
    const INCOME_ORDER = ["Below 10,000","10,001 - 25,000","25,001 - 50,000","Above 50,000"];
    const incomeDataSorted = [...incomeData].sort(
      (a, b) => {
        const ai = INCOME_ORDER.indexOf(a._id);
        const bi = INCOME_ORDER.indexOf(b._id);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      }
    );

    // ── Year sorted ascending ────────────────────────────────────
    const yearDataSorted = [...yearData].sort((a, b) => Number(a._id) - Number(b._id));

    // ── KPI counts ───────────────────────────────────────────────
    const total           = raw.length;
    const femaleCount     = raw.filter(r => String(r.Gender ?? "").toLowerCase() === "female").length;
    const ruralCount      = raw.filter(r => String(r.Location ?? "").toLowerCase() === "rural").length;
    const unemployedCount = raw.filter(r =>
      String(r.MainActivity ?? "").toLowerCase().includes("unemployed") ||
      String(r.MainActivity ?? "").toLowerCase().includes("seeking")
    ).length;

    return {
      genderData,
      ageData: ageDataSorted,
      educationData,
      locationData,
      incomeData: incomeDataSorted,
      activityData,
      work365Data,
      workData,
      yearData: yearDataSorted,
      total,
      femaleCount,
      ruralCount,
      unemployedCount,
    };
  }, []);
}
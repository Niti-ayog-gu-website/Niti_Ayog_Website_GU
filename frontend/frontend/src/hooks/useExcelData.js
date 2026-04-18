// useExcelData.js
// Drop this in src/hooks/
// Usage: const { genderData, ageData, ... } = useExcelData()
//
// SETUP (one time):
//   1. Run convert.js → generates data.json
//   2. Move data.json → src/data/surveyData.json
//   3. Import this hook wherever needed

import { useMemo } from "react";
import raw from "../data/surveyData.json";

// Counts values in an array → [{ _id: "X", count: N }, ...]
function toCounts(arr) {
  const map = {};
  arr.forEach(v => {
    if (v == null || v === "") return;
    map[v] = (map[v] || 0) + 1;
  });
  return Object.entries(map).map(([_id, count]) => ({ _id, count }));
}

export function useExcelData() {
  return useMemo(() => {
    const genderData    = toCounts(raw.map(r => r.Gender));
    const ageData       = toCounts(raw.map(r => r.Age));
    const educationData = toCounts(raw.map(r => r.Education));
    const locationData  = toCounts(raw.map(r => r.Location));
    const incomeData    = toCounts(raw.map(r => r.Income));
    const activityData  = toCounts(raw.map(r => r.MainActivity));
    const work365Data   = toCounts(raw.map(r => r.Worked365));
    const workData      = toCounts(raw.map(r => r.WorkStatus));
    const yearData      = toCounts(raw.map(r => String(r.Year)));

    // Income sorted by bracket order
    const INCOME_ORDER = ["Below 10,000","10,001 - 25,000","25,001 - 50,000","Above 50,000"];
    const incomeDataSorted = [...incomeData].sort(
      (a, b) => INCOME_ORDER.indexOf(a._id) - INCOME_ORDER.indexOf(b._id)
    );

    // Age sorted by bracket order
    const AGE_ORDER = ["18-20","21-23","24-26","27-28","Above 28"];
    const ageDataSorted = [...ageData].sort(
      (a, b) => AGE_ORDER.indexOf(a._id) - AGE_ORDER.indexOf(b._id)
    );

    // Year sorted ascending
    const yearDataSorted = [...yearData].sort((a, b) => a._id - b._id);

    // Summary counts for KPI cards
    const total         = raw.length;
    const femaleCount   = raw.filter(r => r.Gender === "Female").length;
    const ruralCount    = raw.filter(r => r.Location === "Rural").length;
    const unemployedCount = raw.filter(r =>
      r.WorkStatus?.toLowerCase().includes("unemployed") ||
      r.WorkStatus?.toLowerCase().includes("seeking")
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
      // KPI helpers
      total,
      femaleCount,
      ruralCount,
      unemployedCount,
    };
  }, []);
}
// // SkillGapChart.js
// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// const SkillGapChart = ({ alumni }) => {
//   const counts = {
//     "Yes significant gap": 0,
//     "Somewhat": 0,
//     "No well prepared": 0,
//   };

//   alumni.forEach((a) => {
//     if (counts[a.skill_gap_perceived] !== undefined) {
//       counts[a.skill_gap_perceived]++;
//     }
//   });

//   const data = Object.keys(counts).map((key) => ({
//     name: key,
//     value: counts[key],
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <BarChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="value" fill="
// #6366F1" radius={[10, 10, 0, 0]} />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default SkillGapChart;       



import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const LABELS = ["Yes, significant gap", "Somewhat", "No, well prepared"];
const COLORS = ["#E11D48", "#D97706", "#0D9488"];

const SkillGapChart = ({ alumni }) => {
  const counts = {};
  LABELS.forEach((l) => (counts[l] = 0));

  alumni.forEach((a) => {
    if (counts[a.skill_gap_perceived] !== undefined) {
      counts[a.skill_gap_perceived]++;
    }
  });

  const data = LABELS.map((key, i) => ({ name: key, value: counts[key], color: COLORS[i] }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }}
          cursor={{ fill: "#F8FAFC" }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SkillGapChart;
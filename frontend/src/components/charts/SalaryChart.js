//  // SalaryChart.js
// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const getSalaryRange = (salary) => {
//   if (!salary) return "Unknown";
//   if (salary < 300000) return "<3L";
//   if (salary < 600000) return "3-6L";
//   if (salary < 1000000) return "6-10L";
//   return "10L+";
// };

// const SalaryChart = ({ alumni }) => {
//   const counts = {};

//   alumni.forEach((a) => {
//     const range = getSalaryRange(a.salary);
//     counts[range] = (counts[range] || 0) + 1;
//   });

//   const data = Object.keys(counts).map((key) => ({
//     name: key,
//     value: counts[key],
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <BarChart data={data}>
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="value" fill="
// #22C55E" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default SalaryChart; 


import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const ORDER = ["<3L", "3-6L", "6-10L", "10L+"];
const COLORS = ["#6366F1", "#0EA5E9", "#22C55E", "#F97316"];

const SalaryChart = ({ alumni }) => {
  const counts = {};

  alumni.forEach((a) => {
    const val = a.salary || "Unknown";
    counts[val] = (counts[val] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const ai = ORDER.indexOf(a.name);
      const bi = ORDER.indexOf(b.name);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} cursor={{ fill: "#F8FAFC" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalaryChart;
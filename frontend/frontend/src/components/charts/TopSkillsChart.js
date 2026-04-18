// // TopSkillsChart.js
// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const TopSkillsChart = ({ alumni }) => {
//   const skillCount = {};

//   alumni.forEach((a) => {
//     (a.skills_used || []).forEach((skill) => {
//       skillCount[skill] = (skillCount[skill] || 0) + 1;
//     });
//   });

//   const data = Object.entries(skillCount)
//     .map(([key, value]) => ({ name: key, value }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 10);

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart data={data} layout="vertical">
//         <XAxis type="number" />
//         <YAxis type="category" dataKey="name" width={120} />
//         <Tooltip />
//         <Bar dataKey="value" fill="
// #A855F7" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default TopSkillsChart;       

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TopSkillsChart = ({ alumni }) => {
  const skillCount = {};

  alumni.forEach((a) => {
    (a.skills_used || []).forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  const data = Object.entries(skillCount)
    .map(([key, value]) => ({ name: key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "#64748B" }} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} cursor={{ fill: "#F8FAFC" }} />
        <Bar dataKey="value" fill="#A855F7" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopSkillsChart;
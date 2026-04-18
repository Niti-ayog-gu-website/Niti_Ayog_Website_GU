// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#14B8A6", "#A855F7"];

// const SectorDonutChart = ({ alumni }) => {
//   const sectorCount = alumni.reduce((acc, curr) => {
//     const sector = curr.sector || "Unknown";
//     acc[sector] = (acc[sector] || 0) + 1;
//     return acc;
//   }, {});

//   const data = Object.keys(sectorCount).map((key) => ({
//     name: key,
//     value: sectorCount[key],
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <PieChart>
//         <Pie
//           data={data}
//           innerRadius={80}
//           outerRadius={120}
//           paddingAngle={3}
//           dataKey="value"
//           label
//         >
//           {data.map((entry, index) => (
//             <Cell key={index} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// export default SectorDonutChart;



import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#14B8A6", "#A855F7"];

const SectorDonutChart = ({ alumni }) => {
  const sectorCount = alumni.reduce((acc, curr) => {
    const sector = curr.sector || "Unknown";
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(sectorCount).map((key) => ({
    name: key,
    value: sectorCount[key],
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SectorDonutChart;
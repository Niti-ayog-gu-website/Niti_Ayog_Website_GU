// // LocationChart.js
// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const COLORS = ["#0EA5E9", "#F97316"];

// const LocationChart = ({ alumni }) => {
//   const counts = {
//     Goa: 0,
//     Outside: 0,
//   };

//   alumni.forEach((a) => {
//     if (a.location?.toLowerCase().includes("goa")) {
//       counts.Goa++;
//     } else {
//       counts.Outside++;
//     }
//   });

//   const data = Object.keys(counts).map((key) => ({
//     name: key,
//     value: counts[key],
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <PieChart>
//         <Pie data={data} dataKey="value" outerRadius={100} label>
//           {data.map((entry, index) => (
//             <Cell key={index} fill={COLORS[index]} />
//           ))}
//         </Pie>
//         <Tooltip />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// export default LocationChart;



import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0EA5E9", "#F97316"];

const LocationChart = ({ alumni }) => {
  const counts = { Goa: 0, Outside: 0 };

  alumni.forEach((a) => {
    if (a.location?.toLowerCase().includes("goa")) {
      counts.Goa++;
    } else {
      counts.Outside++;
    }
  });

  const data = Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={85} innerRadius={45}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LocationChart;
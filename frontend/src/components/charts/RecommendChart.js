// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const COLORS = ["#22C55E", "#F59E0B", "#EF4444"];

// const RecommendChart = ({ alumni }) => {
//   const counts = { Yes: 0, No: 0, Maybe: 0 };

//   alumni.forEach((a) => {
//     if (counts[a.would_recommend_goa_jobs] !== undefined) {
//       counts[a.would_recommend_goa_jobs]++;
//     }
//   });

//   const data = Object.keys(counts).map((key) => ({
//     name: key,
//     value: counts[key],
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <PieChart>
//         <Pie data={data} dataKey="value" innerRadius={60} outerRadius={100}>
//           {data.map((entry, index) => (
//             <Cell key={index} fill={COLORS[index]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// export default RecommendChart;



import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#22C55E", "#F59E0B", "#EF4444"];

const RecommendChart = ({ alumni }) => {
  const counts = { Yes: 0, No: 0, Maybe: 0 };

  alumni.forEach((a) => {
    if (counts[a.would_recommend_goa_jobs] !== undefined) {
      counts[a.would_recommend_goa_jobs]++;
    }
  });

  const data = Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={45} outerRadius={85}>
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

export default RecommendChart;
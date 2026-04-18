// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// const COLORS =
// {
//   Female:"#EC4899",
//   Male:"#6366F1",
//   Other:"#10B981"
// };

// const GenderChart = ({ students }) => {
//   const safeStudents = Array.isArray(students) ? students : [];

//   const count = {};

//   safeStudents.forEach((s) => {
//     const key = s?.gender?.trim() || "Other";
//     count[key] = (count[key] || 0) + 1;
//   });

//   const data = Object.keys(count).map((key) => ({
//     name: key,
//     value: count[key],
//   }));

//   return (
//     <div style={{ width: "10%", height: 350 }}>
//       <h3>Gender distribution</h3>
//       <ResponsiveContainer>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
            
//             outerRadius={110}
//             innerRadius={60}
//             dataKey="value"
//             paddingAngle={4}
//           >
//              {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[entry.name] || "#999999"}
//               />
//             ))}
//           </Pie>

//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default GenderChart;



import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = { Female:"#EC4899", Male:"#6366F1", Other:"#10B981" };
const tooltip = { background:"white", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" };

export default function GenderChart({ students = [] }) {
  const count = {};
  students.forEach(s => { const k = s?.gender?.trim()||"Other"; count[k]=(count[k]||0)+1; });
  const data = Object.entries(count).map(([name,value]) => ({ name, value }));

  return (
    <div style={{ background:"white", borderRadius:20, padding:24, border:"1.5px solid #E2E8F0" }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Gender Distribution</div>
      <div style={{ fontSize:11, color:"#94A3B8", marginBottom:20 }}>Breakdown by gender identity</div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={85} innerRadius={48} dataKey="value" paddingAngle={3}>
            {data.map((e,i) => <Cell key={i} fill={COLORS[e.name]||"#94A3B8"} />)}
          </Pie>
          <Tooltip contentStyle={tooltip} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
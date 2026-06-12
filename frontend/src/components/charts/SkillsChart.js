// import React from "react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Cell,
//   LabelList
// } from "recharts";

// const SkillsChart = ({ students }) => {
//   let allSkills = [];

//   students.forEach((s) => {
//     if (s.technical_skills) {
//       allSkills = [...allSkills, ...s.technical_skills];
//     }
//   });

//   const count = {};

//   allSkills.forEach((skill) => {
//     count[skill] = (count[skill] || 0) + 1;
//   });

//   let data = Object.keys(count).map((key) => ({
//     skill: key,
//     count: count[key],
//   }));

//   // sort descending
//   data.sort((a, b) => b.count - a.count);

//   // top 10
//   data = data.slice(0, 10);

//   const COLORS = [
//     "#ba4848", "#c75a1b", "#818b2e", "#0b5227", "#85a993",
//     "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#F59E0B"
//   ];

//   return (
//     <div
//       style={{
//         width: "40%",
//         height: 350,
//         background: "#fff",
//         borderRadius: "12px",
//         padding: "10px",
//       }}
//     >
//       <h3 style={{ textAlign: "left" }}>
//         Top Skills
//       </h3>

//       <ResponsiveContainer width="40%" height="90%">
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis
//             dataKey="skill"
//             tick={{ fill: "#000000" }}
//           />

//           <YAxis tick={{ fill: "#000000" }} />

//           <Tooltip
//             contentStyle={{
//               backgroundColor: "#fff",
//               borderRadius: "10px",
//               border: "1px solid #ddd",
//             }}
//           />

//           <Bar dataKey="count" radius={[4, 4, 0, 0]}>
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}

//             <LabelList dataKey="count" position="top" />
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SkillsChart;



import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0D9488","#F97316","#7C3AED","#0891B2","#16A34A","#EC4899","#6366F1","#D97706","#E11D48","#059669"];
const tooltip = { background:"white", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" };

export default function SkillsChart({ students = [] }) {
  const count = {};
  students.forEach(s => {
    [...(s.technical_skills||[]), ...(s.soft_skills||[]), ...(s.domain_specific||[])].forEach(sk => {
      count[sk] = (count[sk]||0)+1;
    });
  });
  const data = Object.entries(count).map(([name,value]) => ({ name, value }))
    .sort((a,b) => b.value-a.value).slice(0,10);

  return (
    <div style={{ background:"white", borderRadius:20, padding:24, border:"1.5px solid #E2E8F0" }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Top 10 Skills</div>
      <div style={{ fontSize:11, color:"#94A3B8", marginBottom:20 }}>Most common skills possessed by students</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top:4, right:24, left:8, bottom:4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={150} tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltip} />
          <Bar dataKey="value" radius={[0,6,6,0]} barSize={18}>
            {data.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
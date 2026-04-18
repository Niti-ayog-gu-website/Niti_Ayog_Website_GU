// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend,
//   Cell
// } from "recharts";

// const DisciplineChart = ({ students }) => {
//   if (!students || students.length === 0) {
//     return <p>No data available</p>;
//   }

//   const count = {};

//   students.forEach((s) => {
//     const key = s.discipline?.trim() || "Unknown";
//     count[key] = (count[key] || 0) + 1;
//   });

//   const data = Object.keys(count).map((key) => ({
//     discipline: key,
//     count: count[key],
//   }));

//   const COLORS = [
//     "#660e60", "#893f71", "#ac6f82", "#cfa093",
//     "#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"
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
//         Discipline-wise Enrollment
//       </h3>

//       <ResponsiveContainer width="40%" height="90%">
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis
//             dataKey="discipline"
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

//           <Legend />

//           <Bar dataKey="count" radius={[4, 4, 0, 0]}>
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default DisciplineChart;



import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#F97316","#0D9488","#7C3AED","#0891B2","#16A34A","#EC4899","#6366F1","#D97706"];
const tooltip = { background:"white", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" };

export default function DisciplineChart({ students = [] }) {
  const count = {};
  students.forEach(s => { const k = s.discipline?.trim()||"Unknown"; count[k]=(count[k]||0)+1; });
  const data = Object.entries(count).map(([discipline,count]) => ({ discipline, count }));

  return (
    <div style={{ background:"white", borderRadius:20, padding:24, border:"1.5px solid #E2E8F0" }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Discipline-wise Enrolment</div>
      <div style={{ fontSize:11, color:"#94A3B8", marginBottom:20 }}>Number of students per academic discipline</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:8, right:8, left:-16, bottom:40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="discipline" tick={{ fontSize:11, fill:"#64748B" }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
          <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltip} />
          <Bar dataKey="count" radius={[6,6,0,0]} barSize={52}>
            {data.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
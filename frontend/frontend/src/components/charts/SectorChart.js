
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   ResponsiveContainer, CartesianGrid, LabelList, Cell
// } from "recharts";

// const SectorChart = ({ students }) => {
//   const count = {};

//   students.forEach((s) => {
//     count[s.aspirational_sector] =
//       (count[s.aspirational_sector] || 0) + 1;
//   });

//   const data = Object.keys(count).map((key) => ({
//     name: key,
//     value: count[key],
//   }));

//   const colors = [
//   "#778f76",
//   "#42826c",
//   "#254e40",
//   "#142f25",
//   "#05120d",
//   "#a05195"
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
//       <h3 style={{ textAlign: "left" }}>Aspirational Sector</h3>

//       <ResponsiveContainer width="40%" height="90%">
//         <BarChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 50 }}>
//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis dataKey="name" />
//           <YAxis />

//           <Tooltip />

//           <Bar dataKey="value" barSize={80}>
//             {data.map((entry, index) => (
//               <Cell key={index} fill={colors[index % colors.length]} />
//             ))}
//             <LabelList dataKey="value" position="top" />
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SectorChart;



import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0D9488","#F97316","#7C3AED","#0891B2","#16A34A","#EC4899","#6366F1","#D97706"];
const tooltip = { background:"white", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" };

export default function SectorChart({ students = [] }) {
  const count = {};
  students.forEach(s => { if(s.aspirational_sector) count[s.aspirational_sector]=(count[s.aspirational_sector]||0)+1; });
  const data = Object.entries(count).map(([name,value]) => ({ name, value })).sort((a,b) => b.value-a.value);

  return (
    <div style={{ background:"white", borderRadius:20, padding:24, border:"1.5px solid #E2E8F0" }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Aspirational Sectors</div>
      <div style={{ fontSize:11, color:"#94A3B8", marginBottom:20 }}>Where students want to work</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:8, right:8, left:-16, bottom:50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize:10, fill:"#64748B" }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" />
          <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltip} />
          <Bar dataKey="value" radius={[6,6,0,0]} barSize={44}>
            {data.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
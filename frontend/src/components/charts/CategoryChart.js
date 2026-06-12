// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Cell,
//   Legend
// } from "recharts";
// // import { BarStackClipLayer } from "recharts/types/cartesian/BarStack";

// const COLORS = ["#3D45AA", "#16476A", "#3B9797", "#FDB5CE","#132440"]; 


// const CategoryChart = ({ students = [] }) => {
//   const count = {};

//   students.forEach((s) => {
//     count[s.category] = (count[s.category] || 0) + 1;
//   });

//   const data = Object.keys(count).map((key) => ({
//     name: key,
//     value: count[key],
//   }));

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
//       <h3 style={{ textAlign: "Left" }}>Category Breakdown</h3>

//       <ResponsiveContainer width="40%" height="90%">
//         <BarChart data={data} margin={{top:20,right:30,left:50,bottom:50}}>
//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis dataKey="name" tick={{ fill: "#000000" }} label={{ value:"Category", position:"insideBottom" , offset: -2
//           }} />
//            <legend/>
//           <YAxis tick={{ fill: "#000000" }} />
         

//           <Tooltip />

//           <Bar dataKey="value" barSize={80} >
//             {data.map((entry, index) => (
//               <Cell key={index} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default CategoryChart;



import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#1D4ED8","#C2410C","#7C3AED","#16A34A"];
const tooltip = { background:"white", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif" };

export default function CategoryChart({ students = [] }) {
  const count = {};
  students.forEach(s => { if(s.category) count[s.category] = (count[s.category]||0)+1; });
  const data = Object.entries(count).map(([name,value]) => ({ name, value }));

  return (
    <div style={{ background:"white", borderRadius:20, padding:24, border:"1.5px solid #E2E8F0" }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Category Breakdown</div>
      <div style={{ fontSize:11, color:"#94A3B8", marginBottom:20 }}>Students by reservation category</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:8, right:8, left:-16, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize:12, fill:"#64748B" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltip} />
          <Bar dataKey="value" radius={[6,6,0,0]} barSize={48}>
            {data.map((e,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
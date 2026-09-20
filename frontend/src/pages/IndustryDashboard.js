// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useIndustryData } from "../hooks/useIndustryData";

// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
//   ResponsiveContainer, Cell, PieChart, Pie, RadarChart,
//   Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
// } from "recharts";

// // ── CSS (same design language as ResearchDashboard) ──────────────
// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
//   .id-root{font-family:'Plus Jakarta Sans',sans-serif;}
//   .id-header{background:linear-gradient(135deg,#064E3B 0%,#065F46 55%,#0891B2 100%);padding:32px 0 56px;position:relative;overflow:hidden;}
//   .id-header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 30%,rgba(16,185,129,.2) 0%,transparent 50%),radial-gradient(circle at 10% 80%,rgba(6,182,212,.15) 0%,transparent 40%);}
//   .id-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;background:#F1F5F9;clip-path:ellipse(55% 100% at 50% 100%);}
//   .id-crumb{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
//   .id-crumb span{color:rgba(255,255,255,.35);}
//   .id-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,42px);font-weight:800;color:white;line-height:1.1;margin-bottom:8px;}
//   .id-sub{font-size:14px;color:rgba(255,255,255,.65);}
//   .id-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.8);margin-bottom:18px;}
//   .id-body{background:#F1F5F9;min-height:100vh;}
//   .id-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
//   .id-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#10B981,#0891B2);}
//   .cc{background:white;border-radius:20px;padding:24px;border:1.5px solid #E2E8F0;box-shadow:0 1px 4px rgba(15,23,42,.04);}
//   .ct{font-size:14px;font-weight:700;color:#0F172A;margin-bottom:2px;}
//   .cs{font-size:11px;color:#94A3B8;margin-bottom:6px;}
//   .ctotal{font-size:12px;color:#64748B;margin-bottom:16px;}
//   .tab{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;border:1.5px solid #E2E8F0;background:white;color:#64748B;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;}
//   .tab.active{background:#10B981;color:white;border-color:#10B981;}
//   .tab:hover:not(.active){border-color:#10B981;color:#10B981;}
// `;

// // ── Same colour palette as friend's PieChartCard ─────────────────
// const COLORS = [
//   "#4F46E5","#06B6D4","#10B981","#F59E0B","#EF4444",
//   "#8B5CF6","#EC4899","#14B8A6","#F97316","#3B82F6","#84CC16","#6366F1",
//   "#0EA5E9","#D946EF"
// ];

// const TT_STYLE = {
//   background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"12px",
//   padding:"10px 14px", boxShadow:"0 8px 24px rgba(15,23,42,.08)",
//   fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif",
// };

// // ── Normalise → [{ name, value }] ────────────────────────────────
// function normalise(arr) {
//   if (!Array.isArray(arr)) return [];
//   return arr
//     .map(r => ({
//       name:  String(r.name ?? r._id ?? r.label ?? "—"),
//       value: Number(r.value ?? r.count ?? 0),
//     }))
//     .filter(r => r.name && r.value > 0);
// }

// // ── Custom tooltip ────────────────────────────────────────────────
// function CustomTooltip({ active, payload, total }) {
//   if (!active || !payload?.length) return null;
//   const val = payload[0].value || 0;
//   const pct = total ? ((val / total) * 100).toFixed(1) : "0.0";
//   return (
//     <div style={TT_STYLE}>
//       <div style={{ fontWeight:700, color:"#0f172a", marginBottom:4 }}>{payload[0].name}</div>
//       <div style={{ color:"#475569", fontSize:13 }}>Count: <strong>{val}</strong></div>
//       <div style={{ color:"#475569", fontSize:13 }}>Share: <strong>{pct}%</strong></div>
//     </div>
//   );
// }

// // ── Outer % label ─────────────────────────────────────────────────
// function PieLabel({ percent, cx, cy, midAngle, outerRadius }) {
//   if (!percent || percent < 0.035) return null;
//   const R = Math.PI / 180;
//   const r = outerRadius + 22;
//   const x = cx + r * Math.cos(-midAngle * R);
//   const y = cy + r * Math.sin(-midAngle * R);
//   return (
//     <text x={x} y={y} fill="#0f172a"
//       textAnchor={x > cx ? "start" : "end"} dominantBaseline="central"
//       style={{ fontSize:12, fontWeight:700 }}>
//       {(percent * 100).toFixed(1)}%
//     </text>
//   );
// }

// // ── PieChartCard (friend's exact style) ──────────────────────────
// function PieChartCard({ title, subtitle, rawData }) {
//   const data  = normalise(rawData);
//   const total = data.reduce((s, d) => s + d.value, 0);

//   return (
//     <div className="cc">
//       <div className="ct">{title}</div>
//       <div className="cs">{subtitle}</div>
//       <div className="ctotal">Total <strong>{total}</strong></div>

//       {data.length === 0 ? (
//         <div style={{ color:"#94A3B8", fontSize:13, padding:"40px 0", textAlign:"center" }}>
//           No data available
//         </div>
//       ) : (
//         <>
//           <ResponsiveContainer width="100%" height={330}>
//             <PieChart>
//               <Pie
//                 data={data} dataKey="value" nameKey="name"
//                 cx="50%" cy="45%"
//                 outerRadius={100} innerRadius={48}
//                 label={PieLabel} labelLine={false}
//               >
//                 {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//               </Pie>
//               <Tooltip content={<CustomTooltip total={total} />} />
//             </PieChart>
//           </ResponsiveContainer>

//           {/* Legend list */}
//           <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:14 }}>
//             {data.map((item, i) => (
//               <div key={item.name}
//                 style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
//                   <span style={{ width:10, height:10, borderRadius:"50%",
//                     background:COLORS[i % COLORS.length], flexShrink:0 }} />
//                   <span style={{ color:"#475569", overflow:"hidden",
//                     textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
//                     {item.name}
//                   </span>
//                 </div>
//                 <span style={{ fontWeight:700, color:"#0F172A", marginLeft:12, flexShrink:0 }}>
//                   {item.value} ({total ? ((item.value/total)*100).toFixed(1) : 0}%)
//                 </span>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ── Horizontal bar card ───────────────────────────────────────────
// function BarCard({ title, subtitle, rawData }) {
//   const data  = normalise(rawData);
//   const total = data.reduce((s, d) => s + d.value, 0);

//   return (
//     <div className="cc">
//       <div className="ct">{title}</div>
//       <div className="cs">{subtitle}</div>
//       <div className="ctotal">Total <strong>{total}</strong></div>

//       {data.length === 0 ? (
//         <div style={{ color:"#94A3B8", fontSize:13, padding:"40px 0", textAlign:"center" }}>
//           No data available
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height={Math.max(200, data.length * 44)}>
//           <BarChart data={data} layout="vertical" margin={{ top:4, right:52, left:8, bottom:4 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
//             <XAxis type="number" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
//             <YAxis type="category" dataKey="name" width={172}
//               tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false} />
//             <Tooltip contentStyle={TT_STYLE} />
//             <Bar dataKey="value" radius={[0,6,6,0]} barSize={26}>
//               {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }

// // // ── Skill Importance Radar + Bar (full width) ────────────────────
// // function SkillImportanceCard({ data }) {
// //   const sorted = [...data].sort((a, b) => b.value - a.value);
// //   return (
// //     <div className="cc" style={{ gridColumn:"1 / -1" }}>
// //       <div className="ct">Skill Importance Ratings by Employers</div>
// //       <div className="cs">Average importance score (1 = Not Important → 5 = Extremely Important)</div>
// //       <div className="ctotal">{data.length} skill categories · 55 respondents</div>

// //       <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
// //         {/* Horizontal bar */}
// //         <ResponsiveContainer width="100%" height={320}>
// //           <BarChart data={sorted} layout="vertical" margin={{ top:4, right:52, left:8, bottom:4 }}>
// //             <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
// //             <XAxis type="number" domain={[0,5]} tick={{ fontSize:11, fill:"#94A3B8" }}
// //               axisLine={false} tickLine={false} />
// //             <YAxis type="category" dataKey="name" width={130}
// //               tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false} />
// //             <Tooltip contentStyle={TT_STYLE}
// //               formatter={v => [v.toFixed(2), "Avg Importance"]} />
// //             <Bar dataKey="value" radius={[0,6,6,0]} barSize={24}>
// //               {sorted.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
// //             </Bar>
// //           </BarChart>
// //         </ResponsiveContainer>

// //         {/* Radar */}
// //         <ResponsiveContainer width="100%" height={320}>
// //           <RadarChart data={data}>
// //             <PolarGrid stroke="#E2E8F0" />
// //             <PolarAngleAxis dataKey="name"
// //               tick={{ fontSize:10, fill:"#64748B" }} />
// //             <PolarRadiusAxis domain={[0,5]}
// //               tick={{ fontSize:9, fill:"#94A3B8" }} tickCount={4} />
// //             <Radar name="Importance" dataKey="value"
// //               stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
// //             <Legend wrapperStyle={{ fontSize:12 }} />
// //             <Tooltip contentStyle={TT_STYLE}
// //               formatter={v => [v.toFixed(2), "Score"]} />
// //           </RadarChart>
// //         </ResponsiveContainer>
// //       </div>

// //       {/* Score legend */}
// //       <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:16 }}>
// //         {sorted.map((item, i) => (
// //           <div key={item.name}
// //             style={{ display:"flex", alignItems:"center", gap:6,
// //               padding:"4px 12px", borderRadius:100,
// //               background:COLORS[i % COLORS.length]+"14",
// //               border:`1px solid ${COLORS[i % COLORS.length]}30` }}>
// //             <span style={{ width:8, height:8, borderRadius:"50%",
// //               background:COLORS[i % COLORS.length], flexShrink:0 }} />
// //             <span style={{ fontSize:11, color:"#475569" }}>{item.name}</span>
// //             <span style={{ fontSize:12, fontWeight:700, color:COLORS[i % COLORS.length] }}>
// //               {item.value.toFixed(2)}
// //             </span>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // ── Locked ────────────────────────────────────────────────────────
// function Locked() {
//   return (
//     <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
//       justifyContent:"center", background:"#F1F5F9",
//       fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
//       <div style={{ textAlign:"center" }}>
//         <div style={{ width:80, height:80, borderRadius:24,
//           background:"linear-gradient(135deg,#ECFDF5,#D1FAE5)",
//           display:"flex", alignItems:"center", justifyContent:"center",
//           margin:"0 auto 20px", border:"2px solid rgba(16,185,129,.2)" }}>
//           <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
//             stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect x="3" y="11" width="18" height="11" rx="2"/>
//             <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//           </svg>
//         </div>
//         <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:800,
//           color:"#0F172A", marginBottom:8 }}>Admin Access Required</h2>
//         <p style={{ fontSize:14, color:"#64748B" }}>
//           Please log in to view the industry dashboard.
//         </p>
//       </div>
//     </div>
//   );
// }

// // ── Main ──────────────────────────────────────────────────────────
// export default function IndustryDashboard() {
//   const { isAdmin } = useAuth();
//   const [tab, setTab] = useState("demographics");

//   const {
//     experienceData, decisionData, orgTypeData, sectorData,
//     orgSizeData, yearsOpData, departmentData, skillImportance,
//     total, privateCount, govCount, topSector, topDept,
//   } = useIndustryData();

//   if (!isAdmin) return <Locked />;

//   return (
//     <div className="id-root">
//       <style>{CSS}</style>

//       {/* ── Header ── */}
//       <div className="id-header">
//         <div style={{ maxWidth:1200, margin:"0 auto", padding:"68px 5vw 0",
//           position:"relative", zIndex:1 }}>
//           <div className="id-crumb">
//             Admin <span>/</span> Dashboards <span>/</span> Industry Perspective
//           </div>
//           <div className="id-badge">
//             <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
//               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
//             </svg>
//             Industry Survey · {total} Respondents
//           </div>
//           <h1 className="id-title">Industry Perspective<br/>Skill Gap </h1>
//           <p className="id-sub">
//             Employer insights on skill expectations & gaps · NITI Aayog SSM 2025-26 · Goa
//           </p>
//         </div>
//       </div>

//       <div className="id-body">
//         <br />
//         <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 5vw 60px" }}>

//           {/* ── KPI Cards ── */}
//           <div style={{ display:"grid",
//             gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",
//             gap:14, marginTop:-28, marginBottom:32 }}>
//             {[
//               { label:"Total Respondents",  value:total,         color:"#10B981",
//                 icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
//               { label:"Private Sector",     value:privateCount,  color:"#4F46E5",
//                 icon:<><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/></> },
//               { label:"Govt / Public",      value:govCount,      color:"#0891B2",
//                 icon:<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></> },
//               { label:"Top Sector",         value:topSector,     color:"#F59E0B", isText:true,
//                 icon:<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></> },
//               { label:"Top Department",     value:topDept,       color:"#8B5CF6", isText:true,
//                 icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></> },
//               { label:"Skill Categories",   value:9,             color:"#EC4899",
//                 icon:<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></> },
//             ].map((c, i) => (
//               <div key={i}
//                 style={{ background:"white", borderRadius:20, padding:"22px 24px",
//                   border:"1.5px solid #E2E8F0", transition:"all .3s" }}
//                 onMouseEnter={e => {
//                   e.currentTarget.style.borderColor = c.color;
//                   e.currentTarget.style.transform   = "translateY(-4px)";
//                   e.currentTarget.style.boxShadow   = `0 16px 40px ${c.color}22`;
//                 }}
//                 onMouseLeave={e => {
//                   e.currentTarget.style.borderColor = "#E2E8F0";
//                   e.currentTarget.style.transform   = "none";
//                   e.currentTarget.style.boxShadow   = "none";
//                 }}>
//                 <div style={{ width:44, height:44, borderRadius:12,
//                   background:c.color+"18", display:"flex", alignItems:"center",
//                   justifyContent:"center", marginBottom:16 }}>
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
//                     stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     {c.icon}
//                   </svg>
//                 </div>
//                 <div style={{
//                   fontFamily: c.isText ? "'Plus Jakarta Sans',sans-serif" : "'Fraunces',serif",
//                   fontSize: c.isText ? 14 : 34,
//                   fontWeight:800, color:c.color, lineHeight:1.2, marginBottom:6
//                 }}>{c.value}</div>
//                 <div style={{ fontSize:13, fontWeight:600, color:"#64748B" }}>{c.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* ── Tabs ── */}
//           <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap" }}>
//             {[
//               ["demographics", "Organisation Profile"],
//             //   ["skills",       "Skill Importance"],
//             ].map(([id, label]) => (
//               <button key={id}
//                 className={`tab${tab === id ? " active" : ""}`}
//                 onClick={() => setTab(id)}>
//                 {label}
//               </button>
//             ))}
//           </div>

//           {/* ── Organisation Profile Tab ── */}
//           {tab === "demographics" && (
//             <>
//               <div className="id-sl">Organisation Profile</div>
//               <div style={{ display:"grid",
//                 gridTemplateColumns:"repeat(auto-fit,minmax(420px,1fr))",
//                 gap:20, marginBottom:32 }}>

//                 <PieChartCard
//                   title="Industry Sector"
//                   subtitle="Distribution by industry sector"
//                   rawData={sectorData} />

//                 <PieChartCard
//                   title="Type of Organisation"
//                   subtitle="Private, Government or Public sector"
//                   rawData={orgTypeData} />

//                 <PieChartCard
//                   title="Organisation Size"
//                   subtitle="Distribution by number of employees"
//                   rawData={orgSizeData} />

//                 <PieChartCard
//                   title="Years of Operation"
//                   subtitle="How long the organisation has been running"
//                   rawData={yearsOpData} />

//                 <PieChartCard
//                   title="Years of Experience"
//                   subtitle="Respondent's professional experience"
//                   rawData={experienceData} />

//                 <PieChartCard
//                   title="Decision-Making Level"
//                   subtitle="Respondent's involvement in recruitment/training"
//                   rawData={decisionData} />

//                 {/* Department — horizontal bar, full width */}
//                 <div style={{ gridColumn:"1 / -1" }}>
//                   <BarCard
//                     title="Department / Functional Area"
//                     subtitle="Distribution by respondent's department"
//                     rawData={departmentData} />
//                 </div>

//               </div>
//             </>
//           )}

//           {/* ── Skill Importance Tab ── */}
//           {tab === "skills" && (
//             <>
//               <div className="id-sl">Employer Skill Importance Ratings</div>
//               <div style={{ display:"grid", gridTemplateColumns:"1fr",
//                 gap:20, marginBottom:32 }}>
//                 {/* <SkillImportanceCard data={skillImportance} /> */}
//               </div>
//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useIndustryData } from "../hooks/useIndustryData";
import { downloadChartsZip } from "../utils/downloadChartsZip";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
  .id-root{font-family:'Plus Jakarta Sans',sans-serif;}
  .id-header{background:linear-gradient(135deg,#064E3B 0%,#065F46 55%,#0891B2 100%);padding:32px 0 56px;position:relative;overflow:hidden;}
  .id-header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 30%,rgba(16,185,129,.2) 0%,transparent 50%),radial-gradient(circle at 10% 80%,rgba(6,182,212,.15) 0%,transparent 40%);}
  .id-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;background:#F1F5F9;clip-path:ellipse(55% 100% at 50% 100%);}
  .id-crumb{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
  .id-crumb span{color:rgba(255,255,255,.35);}
  .id-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,42px);font-weight:800;color:white;line-height:1.1;margin-bottom:8px;}
  .id-sub{font-size:14px;color:rgba(255,255,255,.65);}
  .id-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.8);margin-bottom:18px;}
  .id-body{background:#F1F5F9;min-height:100vh;}
  .id-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
  .id-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#10B981,#0891B2);}
  .cc{background:white;border-radius:20px;padding:24px;border:1.5px solid #E2E8F0;box-shadow:0 1px 4px rgba(15,23,42,.04);}
  .ct{font-size:14px;font-weight:700;color:#0F172A;margin-bottom:2px;}
  .cs{font-size:11px;color:#94A3B8;margin-bottom:6px;}
  .ctotal{font-size:12px;color:#64748B;margin-bottom:16px;}
  .tab{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;border:1.5px solid #E2E8F0;background:white;color:#64748B;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;}
  .tab.active{background:#10B981;color:white;border-color:#10B981;}
  .tab:hover:not(.active){border-color:#10B981;color:#10B981;}
`;

const COLORS = [
  "#4F46E5","#06B6D4","#10B981","#F59E0B","#EF4444",
  "#8B5CF6","#EC4899","#14B8A6","#F97316","#3B82F6","#84CC16","#6366F1",
  "#0EA5E9","#D946EF"
];

const TT_STYLE = {
  background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"12px",
  padding:"10px 14px", boxShadow:"0 8px 24px rgba(15,23,42,.08)",
  fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif",
};

function normalise(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(r => ({
      name:  String(r.name ?? r._id ?? r.label ?? "—"),
      value: Number(r.value ?? r.count ?? 0),
    }))
    .filter(r => r.name && r.value > 0);
}

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value || 0;
  const pct = total ? ((val / total) * 100).toFixed(1) : "0.0";
  return (
    <div style={TT_STYLE}>
      <div style={{ fontWeight:700, color:"#0f172a", marginBottom:4 }}>{payload[0].name}</div>
      <div style={{ color:"#475569", fontSize:13 }}>Count: <strong>{val}</strong></div>
      <div style={{ color:"#475569", fontSize:13 }}>Share: <strong>{pct}%</strong></div>
    </div>
  );
}

function PieLabel({ percent, cx, cy, midAngle, outerRadius }) {
  if (!percent || percent < 0.035) return null;
  const R = Math.PI / 180;
  const r = outerRadius + 22;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return (
    <text x={x} y={y} fill="#0f172a"
      textAnchor={x > cx ? "start" : "end"} dominantBaseline="central"
      style={{ fontSize:12, fontWeight:700 }}>
      {(percent * 100).toFixed(1)}%
    </text>
  );
}

// ── PieChartCard ─────────────────────────────────────────────────
function PieChartCard({ title, subtitle, rawData }) {
  const data  = normalise(rawData);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="cc">
      <div className="ct">{title}</div>
      <div className="cs">{subtitle}</div>
      <div className="ctotal">Total <strong>{total}</strong></div>

      {data.length === 0 ? (
        <div style={{ color:"#94A3B8", fontSize:13, padding:"40px 0", textAlign:"center" }}>
          No data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie
                data={data} dataKey="value" nameKey="name"
                cx="50%" cy="45%"
                outerRadius={100} innerRadius={48}
                label={PieLabel} labelLine={false}
              >
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>

          <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:14 }}>
            {data.map((item, i) => (
              <div key={item.name}
                style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", fontSize:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                  <span style={{ width:10, height:10, borderRadius:"50%",
                    background:COLORS[i % COLORS.length], flexShrink:0 }} />
                  <span style={{ color:"#475569", overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontWeight:700, color:"#0F172A", marginLeft:12, flexShrink:0 }}>
                  {item.value} ({total ? ((item.value/total)*100).toFixed(1) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Locked ────────────────────────────────────────────────────────
function Locked() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", background:"#F1F5F9",
      fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:24,
          background:"linear-gradient(135deg,#ECFDF5,#D1FAE5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", border:"2px solid rgba(16,185,129,.2)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:800,
          color:"#0F172A", marginBottom:8 }}>Admin Access Required</h2>
        <p style={{ fontSize:14, color:"#64748B" }}>
          Please log in to view the industry dashboard.
        </p>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function IndustryDashboard() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("demographics");

  const {
    experienceData, decisionData, orgTypeData, sectorData,
    orgSizeData, yearsOpData, departmentData, skillImportance,
    total, privateCount, govCount, topSector, topDept,
  } = useIndustryData();

  if (!isAdmin) return <Locked />;

  return (
    <div className="id-root">
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div className="id-header">
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"68px 5vw 0",
          position:"relative", zIndex:1 }}>
          <div className="id-crumb">
            Admin <span>/</span> Dashboards <span>/</span> Industry Perspective
          </div>
          <div className="id-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Industry Survey · {total} Respondents
          </div>
          <h1 className="id-title">Industry Perspective<br/>Skill Gap</h1>
          <p className="id-sub">
            Employer insights on skill expectations &amp; gaps · NITI Aayog SSM 2025-26 · Goa
          </p>
        </div>
      </div>

      <div className="id-body">
        <br />
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 5vw 60px" }}>

          {/* ── KPI Cards ── */}
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",
            gap:14, marginTop:-28, marginBottom:32 }}>
            {[
              { label:"Total Respondents", value:total,        color:"#10B981",
                icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
              { label:"Private Sector",    value:privateCount, color:"#4F46E5",
                icon:<><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/></> },
              { label:"Govt / Public",     value:govCount,     color:"#0891B2",
                icon:<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></> },
              { label:"Top Sector",        value:topSector,    color:"#F59E0B", isText:true,
                icon:<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></> },
              { label:"Top Department",    value:topDept,      color:"#8B5CF6", isText:true,
                icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></> },
              { label:"Skill Categories",  value:9,            color:"#EC4899",
                icon:<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></> },
            ].map((c, i) => (
              <div key={i}
                style={{ background:"white", borderRadius:20, padding:"22px 24px",
                  border:"1.5px solid #E2E8F0", transition:"all .3s" }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = c.color;
                  e.currentTarget.style.transform   = "translateY(-4px)";
                  e.currentTarget.style.boxShadow   = `0 16px 40px ${c.color}22`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.transform   = "none";
                  e.currentTarget.style.boxShadow   = "none";
                }}>
                <div style={{ width:44, height:44, borderRadius:12,
                  background:c.color+"18", display:"flex", alignItems:"center",
                  justifyContent:"center", marginBottom:16 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {c.icon}
                  </svg>
                </div>
                <div style={{
                  fontFamily: c.isText ? "'Plus Jakarta Sans',sans-serif" : "'Fraunces',serif",
                  fontSize: c.isText ? 14 : 34,
                  fontWeight:800, color:c.color, lineHeight:1.2, marginBottom:6
                }}>{c.value}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#64748B" }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* ── Tabs + Download (identical pattern to ResearchDashboard) ── */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:12, marginBottom:24 }}>
            <div style={{ display:"flex", gap:10 }}>
              <button
                className={`tab${tab === "demographics" ? " active" : ""}`}
                onClick={() => setTab("demographics")}>
                Organisation Profile
              </button>
            </div>
            <button
              onClick={downloadChartsZip}
              style={{ display:"inline-flex", alignItems:"center", gap:8,
                padding:"8px 18px", borderRadius:100, border:"1.5px solid #E2E8F0",
                background:"white", fontSize:13, fontWeight:700, cursor:"pointer",
                color:"#0F172A", fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#10B981"; e.currentTarget.style.color="#10B981"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.color="#0F172A"; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Charts (ZIP)
            </button>
          </div>

          {/* ── Organisation Profile Tab ── */}
          {tab === "demographics" && (
            <>
              <div className="id-sl">Organisation Profile</div>
              <div style={{ display:"grid",
                gridTemplateColumns:"repeat(auto-fit,minmax(420px,1fr))",
                gap:20, marginBottom:32 }}>

                <PieChartCard
                  title="Industry Sector"
                  subtitle="Distribution by industry sector"
                  rawData={sectorData} />

                <PieChartCard
                  title="Type of Organisation"
                  subtitle="Private, Government or Public sector"
                  rawData={orgTypeData} />

                <PieChartCard
                  title="Organisation Size"
                  subtitle="Distribution by number of employees"
                  rawData={orgSizeData} />

                <PieChartCard
                  title="Years of Operation"
                  subtitle="How long the organisation has been running"
                  rawData={yearsOpData} />

                <PieChartCard
                  title="Years of Experience"
                  subtitle="Respondent's professional experience"
                  rawData={experienceData} />

                <PieChartCard
                  title="Decision-Making Level"
                  subtitle="Respondent's involvement in recruitment / training"
                  rawData={decisionData} />

                {/* ── Department — now PieChartCard, full width ── */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <PieChartCard
                    title="Department / Functional Area"
                    subtitle="Distribution by respondent's department"
                    rawData={departmentData} />
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
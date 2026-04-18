// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import DataTable, { Badge } from "../components/DataTable";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
//   ResponsiveContainer, Cell, PieChart, Pie, Legend
// } from "recharts";

// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
//   .sd-root{font-family:'Plus Jakarta Sans',sans-serif;}
//   .sd-header{background:linear-gradient(135deg,#0D9488 0%,#0F766E 60%,#0E7490 100%);padding:32px 0 56px;position:relative;overflow:hidden;}
//   .sd-header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 50%,rgba(249,115,22,.15) 0%,transparent 50%),radial-gradient(circle at 10% 80%,rgba(255,255,255,.06) 0%,transparent 40%);}
//   .sd-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;background:#F1F5F9;clip-path:ellipse(55% 100% at 50% 100%);}
//   .sd-crumb{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
//   .sd-crumb span{color:rgba(255,255,255,.35);}
//   .sd-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,42px);font-weight:800;color:white;line-height:1.1;margin-bottom:8px;}
//   .sd-sub{font-size:14px;color:rgba(255,255,255,.65);}
//   .sd-body{background:#F1F5F9;min-height:100vh;}
//   .sd-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
//   .sd-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#0D9488,#F97316);}
//   .stag{display:inline-flex;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;background:#F0FDFA;color:#0F766E;border:1px solid rgba(13,148,136,.15);margin:2px;}
//   .mo{position:fixed;inset:0;z-index:999;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:moF .2s ease both;}
//   @keyframes moF{from{opacity:0}to{opacity:1}}
//   @keyframes moS{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
//   .mo-card{background:white;border-radius:24px;width:100%;max-width:580px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(15,23,42,.18);animation:moS .28s cubic-bezier(.22,1,.36,1) both;}
//   .mo-strip{height:5px;background:linear-gradient(90deg,#0D9488,#F97316);}
//   .mo-body{padding:28px 32px 32px;}
//   .mo-sec{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94A3B8;margin:22px 0 12px;display:flex;align-items:center;gap:10px;}
//   .mo-sec::after{content:'';flex:1;height:1px;background:#F1F5F9;}
//   .mo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
//   .mo-f{background:#F8FAFC;border-radius:12px;padding:12px 16px;}
//   .mo-fl{font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
//   .mo-fv{font-size:14px;font-weight:600;color:#0F172A;}
//   .mo-close{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;background:white;color:#475569;border:1.5px solid #E2E8F0;cursor:pointer;transition:all .2s;margin-top:20px;}
//   .mo-close:hover{background:#F8FAFC;color:#0F172A;}
//   .cat-General{background:#EFF6FF;color:#1D4ED8;border:1px solid rgba(29,78,216,.15);}
//   .cat-OBC{background:#FFF7ED;color:#C2410C;border:1px solid rgba(194,65,12,.15);}
//   .cat-SC{background:#F5F3FF;color:#7C3AED;border:1px solid rgba(124,58,237,.15);}
//   .cat-ST{background:#F0FDF4;color:#16A34A;border:1px solid rgba(22,163,74,.15);}
//   .sd-loading{display:flex;align-items:center;justify-content:center;padding:80px 20px;flex-direction:column;gap:16px;}
//   .sd-spinner{width:40px;height:40px;border:3px solid #E2E8F0;border-top-color:#0D9488;border-radius:50%;animation:spin .8s linear infinite;}
//   .chart-card{background:white;border-radius:20px;padding:24px;border:1.5px solid #E2E8F0;}
//   .chart-title{font-size:13px;font-weight:700;color:#0F172A;margin-bottom:4px;}
//   .chart-sub{font-size:11px;color:#94A3B8;margin-bottom:20px;}
//   @keyframes spin{to{transform:rotate(360deg)}}
// `;

// // ── Chart components ─────────────────

// const CHART_COLORS = {
//   teal:   "#0D9488",
//   orange: "#F97316",
//   purple: "#7C3AED",
//   blue:   "#0891B2",
//   green:  "#16A34A",
//   pink:   "#EC4899",
//   indigo: "#6366F1",
//   amber:  "#D97706",
// };
// const COLOR_LIST = Object.values(CHART_COLORS);

// const customTooltipStyle = {
//   background: "white",
//   border: "1.5px solid #E2E8F0",
//   borderRadius: 12,
//   fontSize: 12,
//   fontFamily: "'Plus Jakarta Sans', sans-serif",
//   boxShadow: "0 4px 20px rgba(0,0,0,.08)",
// };

// // Gender donut
// function GenderChart({ students }) {
//   const count = {};
//   students.forEach(s => {
//     const k = s?.gender?.trim() || "Other";
//     count[k] = (count[k] || 0) + 1;
//   });
//   const data = Object.entries(count).map(([name, value]) => ({ name, value }));
//   const COLORS = { Female:"#EC4899", Male:"#6366F1", Other:"#10B981" };
//   return (
//     <div className="chart-card">
//       <div className="chart-title">Gender Distribution</div>
//       <div className="chart-sub">Breakdown by gender identity</div>
//       <ResponsiveContainer width="100%" height={240}>
//         <PieChart>
//           <Pie data={data} cx="50%" cy="50%" outerRadius={90} innerRadius={52} dataKey="value" paddingAngle={3}>
//             {data.map((e,i) => <Cell key={i} fill={COLORS[e.name] || "#94A3B8"} />)}
//           </Pie>
//           <Tooltip contentStyle={customTooltipStyle} />
//           <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // Category bar
// function CategoryChart({ students }) {
//   const count = {};
//   students.forEach(s => { if(s.category) count[s.category] = (count[s.category]||0)+1; });
//   const data = Object.entries(count).map(([name,value]) => ({ name, value }));
//   const COLORS = { General:"#1D4ED8", OBC:"#C2410C", SC:"#7C3AED", ST:"#16A34A" };
//   return (
//     <div className="chart-card">
//       <div className="chart-title">Category Breakdown</div>
//       <div className="chart-sub">Students by reservation category</div>
//       <ResponsiveContainer width="100%" height={240}>
//         <BarChart data={data} margin={{ top:8, right:8, left:-16, bottom:0 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
//           <XAxis dataKey="name" tick={{ fontSize:12, fill:"#64748B" }} axisLine={false} tickLine={false} />
//           <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={customTooltipStyle} />
//           <Bar dataKey="value" radius={[6,6,0,0]} barSize={48}>
//             {data.map((e,i) => <Cell key={i} fill={COLORS[e.name] || "#0D9488"} />)}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // Discipline bar
// function DisciplineChart({ students }) {
//   const count = {};
//   students.forEach(s => { const k = s.discipline?.trim()||"Unknown"; count[k]=(count[k]||0)+1; });
//   const data = Object.entries(count).map(([discipline,count]) => ({ discipline, count }));
//   return (
//     <div className="chart-card">
//       <div className="chart-title">Discipline-wise Enrolment</div>
//       <div className="chart-sub">Number of students per academic discipline</div>
//       <ResponsiveContainer width="100%" height={240}>
//         <BarChart data={data} margin={{ top:8, right:8, left:-16, bottom:40 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
//           <XAxis dataKey="discipline" tick={{ fontSize:11, fill:"#64748B" }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
//           <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={customTooltipStyle} />
//           <Bar dataKey="count" radius={[6,6,0,0]} barSize={52}>
//             {data.map((e,i) => <Cell key={i} fill={COLOR_LIST[i % COLOR_LIST.length]} />)}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // Aspirational sector bar
// function SectorChart({ students }) {
//   const count = {};
//   students.forEach(s => { if(s.aspirational_sector) count[s.aspirational_sector]=(count[s.aspirational_sector]||0)+1; });
//   const data = Object.entries(count).map(([name,value]) => ({ name, value })).sort((a,b)=>b.value-a.value);
//   return (
//     <div className="chart-card">
//       <div className="chart-title">Aspirational Sectors</div>
//       <div className="chart-sub">Where students want to work</div>
//       <ResponsiveContainer width="100%" height={240}>
//         <BarChart data={data} margin={{ top:8, right:8, left:-16, bottom:50 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
//           <XAxis dataKey="name" tick={{ fontSize:10, fill:"#64748B" }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" />
//           <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={customTooltipStyle} />
//           <Bar dataKey="value" radius={[6,6,0,0]} barSize={44}>
//             {data.map((e,i) => <Cell key={i} fill={COLOR_LIST[i % COLOR_LIST.length]} />)}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // Top skills horizontal bar
// function SkillsChart({ students }) {
//   const count = {};
//   students.forEach(s => {
//     [...(s.technical_skills||[]), ...(s.soft_skills||[]), ...(s.domain_specific||[])].forEach(sk => {
//       count[sk] = (count[sk]||0)+1;
//     });
//   });
//   const data = Object.entries(count).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value).slice(0,10);
//   return (
//     <div className="chart-card">
//       <div className="chart-title">Top 10 Skills</div>
//       <div className="chart-sub">Most common skills possessed by students</div>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data} layout="vertical" margin={{ top:4, right:24, left:8, bottom:4 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
//           <XAxis type="number" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
//           <YAxis type="category" dataKey="name" width={140} tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={customTooltipStyle} />
//           <Bar dataKey="value" radius={[0,6,6,0]} barSize={18}>
//             {data.map((e,i) => <Cell key={i} fill={COLOR_LIST[i % COLOR_LIST.length]} />)}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // ── Helpers ───────────────────────────────────────────────────────
// function CatBadge({ val }) {
//   return <span className={`stag cat-${val}`} style={{ borderRadius:100 }}>{val}</span>;
// }
// function SkillTags({ arr }) {
//   if (!arr || arr.length === 0) return <span style={{ color:"#CBD5E1", fontSize:12 }}>—</span>;
//   return <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>{arr.map((s,i)=><span key={i} className="stag">{s}</span>)}</div>;
// }
// function EntBadge({ val }) {
//   if (val === "Yes") return <span style={{ fontSize:12,fontWeight:700,color:"#F97316",background:"#FFF7ED",padding:"3px 10px",borderRadius:100,border:"1px solid rgba(249,115,22,.2)" }}>✓ Yes</span>;
//   return <span style={{ fontSize:12,fontWeight:700,color:"#94A3B8",background:"#F8FAFC",padding:"3px 10px",borderRadius:100,border:"1px solid #E2E8F0" }}>No</span>;
// }

// function Locked() {
//   return (
//     <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F1F5F9",paddingTop:80,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
//       <div style={{ textAlign:"center" }}>
//         <div style={{ width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#F0FDFA,#CCFBF1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",border:"2px solid rgba(13,148,136,.15)" }}>
//           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
//         </div>
//         <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:800,color:"#0F172A",marginBottom:8 }}>Admin Access Required</h2>
//         <p style={{ fontSize:14,color:"#64748B" }}>Please log in to view the student dashboard.</p>
//       </div>
//     </div>
//   );
// }

// function StudentModal({ student, onClose }) {
//   if (!student) return null;
//   const age = student.dob ? new Date().getFullYear() - new Date(student.dob).getFullYear() : "—";
//   const allSkills = [...(student.technical_skills||[]),...(student.soft_skills||[]),...(student.domain_specific||[])];
//   return (
//     <div className="mo" onClick={onClose}>
//       <div className="mo-card" onClick={e=>e.stopPropagation()}>
//         <div className="mo-strip"/>
//         <div className="mo-body">
//           <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:4 }}>
//             <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#0D9488,#0891B2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"white",flexShrink:0 }}>
//               {(student.student_name||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}
//             </div>
//             <div style={{ flex:1 }}>
//               <div style={{ fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:800,color:"#0F172A" }}>{student.student_name}</div>
//               <div style={{ fontSize:13,color:"#64748B",marginTop:2 }}>{[student.enrollment_no,student.course,student.year_of_passing].filter(Boolean).join(" · ")}</div>
//             </div>
//             {student.category && <CatBadge val={student.category}/>}
//           </div>
//           <div className="mo-sec">Personal Information</div>
//           <div className="mo-grid">
//             {[["Full Name",student.student_name||"—"],["Email",student.email||"—"],["Phone",student.phone||"—"],["Gender",student.gender||"—"],["Date of Birth",student.dob?new Date(student.dob).toLocaleDateString():"—"],["Age",age!=="—"?`${age} yrs`:"—"],["Category",student.category||"—"],["Taluka",student.taluka||"—"],["District",student.district||"—"]].map(([l,v])=>(
//               <div key={l} className="mo-f"><div className="mo-fl">{l}</div><div className="mo-fv">{v}</div></div>
//             ))}
//           </div>
//           <div className="mo-sec">Academic Details</div>
//           <div className="mo-grid">
//             {[["Enrollment No.",student.enrollment_no||"—"],["Degree Type",student.degree_type||"—"],["School",student.school||"—"],["Discipline",student.discipline||"—"],["Course",student.course||"—"],["Year of Passing",student.year_of_passing||"—"]].map(([l,v])=>(
//               <div key={l} className="mo-f"><div className="mo-fl">{l}</div><div className="mo-fv">{v}</div></div>
//             ))}
//           </div>
//           <div className="mo-sec">Research Variables</div>
//           <div className="mo-grid">
//             <div className="mo-f"><div className="mo-fl">Aspirational Sector</div><div className="mo-fv" style={{ color:"#7C3AED",fontWeight:700 }}>{student.aspirational_sector||"—"}</div></div>
//             <div className="mo-f"><div className="mo-fl">Entrepreneurship</div><div className="mo-fv"><EntBadge val={student.entrepreneurship_inclination}/></div></div>
//           </div>
//           {allSkills.length > 0 && (
//             <>
//               <div className="mo-sec">Skills Possessed</div>
//               <div style={{ background:"#F8FAFC",borderRadius:14,padding:"14px 16px" }}><SkillTags arr={allSkills}/></div>
//             </>
//           )}
//           <button className="mo-close" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const COLUMNS = [
//   { key:"enrollment_no", label:"Enroll No.", render:v=><span style={{ fontSize:12,fontFamily:"monospace",color:"#0D9488",fontWeight:700 }}>{v||"—"}</span> },
//   { key:"student_name",  label:"Name",       render:v=><span style={{ fontWeight:700,color:"#0F172A" }}>{v||"—"}</span> },
//   { key:"phone",         label:"Phone",      render:v=><span style={{ fontSize:12,color:"#475569" }}>{v||"—"}</span> },
//   { key:"gender",        label:"Gender",     render:v=>v?<Badge label={v}/>:<span style={{color:"#CBD5E1"}}>—</span> },
//   { key:"category",      label:"Category",   render:v=>v?<CatBadge val={v}/>:<span style={{color:"#CBD5E1"}}>—</span> },
//   { key:"district",      label:"District",   render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
//   { key:"degree_type",   label:"Degree",     render:v=>v?<span style={{ fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#EFF6FF",color:"#1D4ED8" }}>{v}</span>:<span style={{color:"#CBD5E1"}}>—</span> },
//   { key:"school",        label:"School",     render:v=><span style={{ fontSize:12,color:"#475569",maxWidth:160,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }} title={v}>{v||"—"}</span> },
//   { key:"discipline",    label:"Discipline", render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
//   { key:"course",        label:"Course",     render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
//   { key:"year_of_passing",label:"Year",      render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
//   { key:"aspirational_sector",label:"Aspiration",render:v=><span style={{ fontSize:12,color:"#7C3AED",fontWeight:600 }}>{v||"—"}</span> },
//   { key:"entrepreneurship_inclination",label:"Entrepreneur?",render:v=><EntBadge val={v}/> },
// ];

// const STAT_CARDS = (students, entrepreneurs) => [
//   { label:"Total Enrolled",  value:students.length, color:"#0D9488",
//     iconPath:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
//   { label:"UG Students",     value:students.filter(s=>s.degree_type==="UG").length, color:"#0891B2",
//     iconPath:<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></> },
//   { label:"PG Students",     value:students.filter(s=>s.degree_type==="PG").length, color:"#7C3AED",
//     iconPath:<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></> },
//   { label:"Entrepreneurs",   value:entrepreneurs, color:"#F97316",
//     iconPath:<><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></> },
//   { label:"North Goa",       value:students.filter(s=>s.district==="North Goa").length, color:"#0D9488",
//     iconPath:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
//   { label:"South Goa",       value:students.filter(s=>s.district==="South Goa").length, color:"#059669",
//     iconPath:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
// ];

// export default function StudentDashboard() {
//   const { isAdmin, authFetch } = useAuth();
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState("");
//   const [selected, setSelected] = useState(null);
//   const [syncing, setSyncing]   = useState(false);

//   const handleSync = async () => {
//     try {
//       setSyncing(true);
//       const data = await authFetch("/students/sync", { method:"POST" });
//       if (data.success) {
//         alert(`✓ ${data.message}`);
//         const fresh = await authFetch("/students?limit=100&page=1");
//         if (fresh.success) setStudents(fresh.data);
//       }
//     } catch (err) { alert("Sync failed: " + err.message); }
//     finally { setSyncing(false); }
//   };

//   useEffect(() => {
//     if (!isAdmin) return;
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await authFetch("/students?limit=100&page=1");
//         if (data.success) setStudents(data.data);
//         else setError(data.message || "Failed to load students.");
//       } catch (err) { setError(err.message || "Network error."); }
//       finally { setLoading(false); }
//     };
//     load();
//   }, [isAdmin]);

//   if (!isAdmin) return <Locked/>;

//   const entrepreneurs = students.filter(s => s.entrepreneurship_inclination === "Yes").length;

//   const STUDENT_FILTERS = [
//     { key:"degree_type",  label:"Degree Type", options:[...new Set(students.map(s=>s.degree_type).filter(Boolean))] },
//     { key:"school",       label:"School",       options:[...new Set(students.map(s=>s.school).filter(Boolean))] },
//     { key:"discipline",   label:"Discipline",   options:[...new Set(students.map(s=>s.discipline).filter(Boolean))] },
//     { key:"course",       label:"Course",       options:[...new Set(students.map(s=>s.course).filter(Boolean))].sort() },
//     { key:"district",     label:"District",     options:[...new Set(students.map(s=>s.district).filter(Boolean))] },
//     { key:"taluka",       label:"Taluka",       options:[...new Set(students.map(s=>s.taluka).filter(Boolean))] },
//     { key:"gender",       label:"Gender",       options:[...new Set(students.map(s=>s.gender).filter(Boolean))] },
//     { key:"category",     label:"Category",     options:[...new Set(students.map(s=>s.category).filter(Boolean))] },
//     { key:"aspirational_sector",          label:"Aspiration",   options:[...new Set(students.map(s=>s.aspirational_sector).filter(Boolean))] },
//     { key:"entrepreneurship_inclination", label:"Entrepreneur?",options:["Yes","No"] },
//   ];

//   return (
//     <div className="sd-root">
//       <style>{CSS}</style>

//       <div className="sd-header">
//         <div style={{ maxWidth:1200,margin:"0 auto",padding:"68px 5vw 0",position:"relative",zIndex:1 }}>
//           <div className="sd-crumb">Admin <span>/</span> Dashboards <span>/</span> Students</div>
//           <h1 className="sd-title">Student Registry</h1>
//           <p className="sd-sub">Goa University · Live data from Google Sheets via API sync</p>
//           <button onClick={handleSync} disabled={syncing}
//             style={{ marginTop:20,padding:"8px 20px",borderRadius:100,background:"white",border:"1.5px solid rgba(255,255,255,.25)",color:"#0F172A",fontSize:13,fontWeight:700,cursor:syncing?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:8,opacity:syncing?0.7:1 }}>
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
//               <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
//             </svg>
//             {syncing ? "Syncing..." : "Sync from Sheets"}
//           </button>
//         </div>
//       </div>

//       <div className="sd-body">
//         <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 5vw 60px" }}>
//           {loading ? (
//             <div className="sd-loading">
//               <div className="sd-spinner"/>
//               <p style={{ fontSize:14,color:"#94A3B8",fontFamily:"inherit" }}>Loading student data...</p>
//             </div>
//           ) : error ? (
//             <div style={{ textAlign:"center",padding:"60px 20px" }}>
//               <div style={{ width:56,height:56,borderRadius:16,background:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
//               </div>
//               <div style={{ fontSize:15,fontWeight:600,color:"#E11D48",marginBottom:8 }}>{error}</div>
//             </div>
//           ) : (
//             <>
//               {/* Stat cards */}
//               <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginTop:-28,marginBottom:32 }}>
//                 {STAT_CARDS(students, entrepreneurs).map((c,i) => (
//                   <div key={i}
//                     style={{ background:"white",borderRadius:20,padding:"22px 24px",border:"1.5px solid #E2E8F0",transition:"all .3s" }}
//                     onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 16px 40px ${c.color}18`;}}
//                     onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}
//                   >
//                     <div style={{ width:44,height:44,borderRadius:12,background:c.color+"15",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.iconPath}</svg>
//                     </div>
//                     <div style={{ fontFamily:"'Fraunces',serif",fontSize:34,fontWeight:800,color:c.color,lineHeight:1,marginBottom:6 }}>{c.value}</div>
//                     <div style={{ fontSize:13,fontWeight:600,color:"#64748B" }}>{c.label}</div>
//                   </div>
//                 ))}
//               </div>

//               {/* Charts — from teammate */}
//               <div className="sd-sl">Data Visualizations</div>
//               <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:16 }}>
//                 <GenderChart students={students}/>
//                 <CategoryChart students={students}/>
//                 <DisciplineChart students={students}/>
//               </div>
//               <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:32 }}>
//                 <SectorChart students={students}/>
//                 <SkillsChart students={students}/>
//               </div>

//               {/* Table */}
//               <div className="sd-sl">All Student Records</div>
//               <DataTable
//                 columns={COLUMNS}
//                 rows={students}
//                 filters={STUDENT_FILTERS}
//                 searchKeys={["student_name","course","district","taluka","school","discipline","enrollment_no","aspirational_sector","email","phone"]}
//                 onRowClick={setSelected}
//                 footer={`${students.length} records loaded from MongoDB · Click any row to view full profile`}
//               />
//             </>
//           )}
//         </div>
//       </div>
//       <StudentModal student={selected} onClose={()=>setSelected(null)}/>
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DataTable, { Badge } from "../components/DataTable";
import CategoryChart  from "../components/charts/CategoryChart";
import DisciplineChart from "../components/charts/DisciplineChart";
import GenderChart    from "../components/charts/GenderChart";
import SectorChart    from "../components/charts/SectorChart";
import SkillsChart    from "../components/charts/SkillsChart";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
  .sd-root{font-family:'Plus Jakarta Sans',sans-serif;}
  .sd-header{background:linear-gradient(135deg,#0D9488 0%,#0F766E 60%,#0E7490 100%);padding:32px 0 56px;position:relative;overflow:hidden;}
  .sd-header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 50%,rgba(249,115,22,.15) 0%,transparent 50%),radial-gradient(circle at 10% 80%,rgba(255,255,255,.06) 0%,transparent 40%);}
  .sd-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;background:#F1F5F9;clip-path:ellipse(55% 100% at 50% 100%);}
  .sd-crumb{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
  .sd-crumb span{color:rgba(255,255,255,.35);}
  .sd-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,42px);font-weight:800;color:white;line-height:1.1;margin-bottom:8px;}
  .sd-sub{font-size:14px;color:rgba(255,255,255,.65);}
  .sd-body{background:#F1F5F9;min-height:100vh;}
  .sd-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .sd-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#0D9488,#F97316);}
  .stag{display:inline-flex;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;background:#F0FDFA;color:#0F766E;border:1px solid rgba(13,148,136,.15);margin:2px;}
  .mo{position:fixed;inset:0;z-index:999;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:moF .2s ease both;}
  @keyframes moF{from{opacity:0}to{opacity:1}}
  @keyframes moS{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  .mo-card{background:white;border-radius:24px;width:100%;max-width:580px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(15,23,42,.18);animation:moS .28s cubic-bezier(.22,1,.36,1) both;}
  .mo-strip{height:5px;background:linear-gradient(90deg,#0D9488,#F97316);}
  .mo-body{padding:28px 32px 32px;}
  .mo-sec{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94A3B8;margin:22px 0 12px;display:flex;align-items:center;gap:10px;}
  .mo-sec::after{content:'';flex:1;height:1px;background:#F1F5F9;}
  .mo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .mo-f{background:#F8FAFC;border-radius:12px;padding:12px 16px;}
  .mo-fl{font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
  .mo-fv{font-size:14px;font-weight:600;color:#0F172A;}
  .mo-close{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;background:white;color:#475569;border:1.5px solid #E2E8F0;cursor:pointer;transition:all .2s;margin-top:20px;}
  .mo-close:hover{background:#F8FAFC;color:#0F172A;}
  .cat-General{background:#EFF6FF;color:#1D4ED8;border:1px solid rgba(29,78,216,.15);}
  .cat-OBC{background:#FFF7ED;color:#C2410C;border:1px solid rgba(194,65,12,.15);}
  .cat-SC{background:#F5F3FF;color:#7C3AED;border:1px solid rgba(124,58,237,.15);}
  .cat-ST{background:#F0FDF4;color:#16A34A;border:1px solid rgba(22,163,74,.15);}
  .sd-loading{display:flex;align-items:center;justify-content:center;padding:80px 20px;flex-direction:column;gap:16px;}
  .sd-spinner{width:40px;height:40px;border:3px solid #E2E8F0;border-top-color:#0D9488;border-radius:50%;animation:spin .8s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

function CatBadge({ val }) {
  return <span className={`stag cat-${val}`} style={{ borderRadius:100 }}>{val}</span>;
}
function SkillTags({ arr }) {
  if (!arr || arr.length === 0) return <span style={{ color:"#CBD5E1", fontSize:12 }}>—</span>;
  return <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>{arr.map((s,i) => <span key={i} className="stag">{s}</span>)}</div>;
}
function EntBadge({ val }) {
  if (val === "Yes") return <span style={{ fontSize:12,fontWeight:700,color:"#F97316",background:"#FFF7ED",padding:"3px 10px",borderRadius:100,border:"1px solid rgba(249,115,22,.2)" }}>✓ Yes</span>;
  return <span style={{ fontSize:12,fontWeight:700,color:"#94A3B8",background:"#F8FAFC",padding:"3px 10px",borderRadius:100,border:"1px solid #E2E8F0" }}>No</span>;
}

function Locked() {
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F1F5F9",paddingTop:80,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#F0FDFA,#CCFBF1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",border:"2px solid rgba(13,148,136,.15)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:800,color:"#0F172A",marginBottom:8 }}>Admin Access Required</h2>
        <p style={{ fontSize:14,color:"#64748B" }}>Please log in to view the student dashboard.</p>
      </div>
    </div>
  );
}

function StudentModal({ student, onClose }) {
  if (!student) return null;
  const age = student.dob ? new Date().getFullYear() - new Date(student.dob).getFullYear() : "—";
  const allSkills = [...(student.technical_skills||[]),...(student.soft_skills||[]),...(student.domain_specific||[])];
  return (
    <div className="mo" onClick={onClose}>
      <div className="mo-card" onClick={e => e.stopPropagation()}>
        <div className="mo-strip"/>
        <div className="mo-body">
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:4 }}>
            <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#0D9488,#0891B2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"white",flexShrink:0 }}>
              {(student.student_name||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:800,color:"#0F172A" }}>{student.student_name}</div>
              <div style={{ fontSize:13,color:"#64748B",marginTop:2 }}>{[student.enrollment_no,student.course,student.year_of_passing].filter(Boolean).join(" · ")}</div>
            </div>
            {student.category && <CatBadge val={student.category}/>}
          </div>
          <div className="mo-sec">Personal Information</div>
          <div className="mo-grid">
            {[["Full Name",student.student_name||"—"],["Email",student.email||"—"],["Phone",student.phone||"—"],["Gender",student.gender||"—"],["Date of Birth",student.dob?new Date(student.dob).toLocaleDateString():"—"],["Age",age!=="—"?`${age} yrs`:"—"],["Category",student.category||"—"],["Taluka",student.taluka||"—"],["District",student.district||"—"]].map(([l,v])=>(
              <div key={l} className="mo-f"><div className="mo-fl">{l}</div><div className="mo-fv">{v}</div></div>
            ))}
          </div>
          <div className="mo-sec">Academic Details</div>
          <div className="mo-grid">
            {[["Enrollment No.",student.enrollment_no||"—"],["Degree Type",student.degree_type||"—"],["School",student.school||"—"],["Discipline",student.discipline||"—"],["Course",student.course||"—"],["Year of Passing",student.year_of_passing||"—"]].map(([l,v])=>(
              <div key={l} className="mo-f"><div className="mo-fl">{l}</div><div className="mo-fv">{v}</div></div>
            ))}
          </div>
          <div className="mo-sec">Research Variables</div>
          <div className="mo-grid">
            <div className="mo-f"><div className="mo-fl">Aspirational Sector</div><div className="mo-fv" style={{ color:"#7C3AED",fontWeight:700 }}>{student.aspirational_sector||"—"}</div></div>
            <div className="mo-f"><div className="mo-fl">Entrepreneurship</div><div className="mo-fv"><EntBadge val={student.entrepreneurship_inclination}/></div></div>
          </div>
          {allSkills.length > 0 && (
            <>
              <div className="mo-sec">Skills Possessed</div>
              <div style={{ background:"#F8FAFC",borderRadius:14,padding:"14px 16px" }}><SkillTags arr={allSkills}/></div>
            </>
          )}
          <button className="mo-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const COLUMNS = [
  { key:"enrollment_no", label:"Enroll No.", render:v=><span style={{ fontSize:12,fontFamily:"monospace",color:"#0D9488",fontWeight:700 }}>{v||"—"}</span> },
  { key:"student_name",  label:"Name",       render:v=><span style={{ fontWeight:700,color:"#0F172A" }}>{v||"—"}</span> },
  { key:"phone",         label:"Phone",      render:v=><span style={{ fontSize:12,color:"#475569" }}>{v||"—"}</span> },
  { key:"gender",        label:"Gender",     render:v=>v?<Badge label={v}/>:<span style={{color:"#CBD5E1"}}>—</span> },
  { key:"category",      label:"Category",   render:v=>v?<CatBadge val={v}/>:<span style={{color:"#CBD5E1"}}>—</span> },
  { key:"district",      label:"District",   render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
  { key:"degree_type",   label:"Degree",     render:v=>v?<span style={{ fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#EFF6FF",color:"#1D4ED8" }}>{v}</span>:<span style={{color:"#CBD5E1"}}>—</span> },
  { key:"school",        label:"School",     render:v=><span style={{ fontSize:12,color:"#475569",maxWidth:160,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }} title={v}>{v||"—"}</span> },
  { key:"discipline",    label:"Discipline", render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
  { key:"course",        label:"Course",     render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
  { key:"year_of_passing",label:"Year",      render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
  { key:"aspirational_sector",label:"Aspiration",render:v=><span style={{ fontSize:12,color:"#7C3AED",fontWeight:600 }}>{v||"—"}</span> },
  { key:"entrepreneurship_inclination",label:"Entrepreneur?",render:v=><EntBadge val={v}/> },
];

const STAT_CARDS = (students, entrepreneurs) => [
  { label:"Total Enrolled", value:students.length, color:"#0D9488",
    iconPath:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { label:"UG Students", value:students.filter(s=>s.degree_type==="UG").length, color:"#0891B2",
    iconPath:<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></> },
  { label:"PG Students", value:students.filter(s=>s.degree_type==="PG").length, color:"#7C3AED",
    iconPath:<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></> },
  { label:"Entrepreneurs", value:entrepreneurs, color:"#F97316",
    iconPath:<><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></> },
  { label:"North Goa", value:students.filter(s=>s.district==="North Goa").length, color:"#0D9488",
    iconPath:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
  { label:"South Goa", value:students.filter(s=>s.district==="South Goa").length, color:"#059669",
    iconPath:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
];

export default function StudentDashboard() {
  const { isAdmin, authFetch } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing]   = useState(false);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const data = await authFetch("/students/sync", { method:"POST" });
      if (data.success) {
        alert(`✓ ${data.message}`);
        const fresh = await authFetch("/students?limit=100&page=1");
        if (fresh.success) setStudents(fresh.data);
      }
    } catch (err) { alert("Sync failed: " + err.message); }
    finally { setSyncing(false); }
  };

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await authFetch("/students?limit=100&page=1");
        if (data.success) setStudents(data.data);
        else setError(data.message || "Failed to load students.");
      } catch (err) { setError(err.message || "Network error."); }
      finally { setLoading(false); }
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) return <Locked/>;

  const entrepreneurs = students.filter(s => s.entrepreneurship_inclination === "Yes").length;

  const STUDENT_FILTERS = [
    { key:"degree_type",  label:"Degree Type", options:[...new Set(students.map(s=>s.degree_type).filter(Boolean))] },
    { key:"school",       label:"School",       options:[...new Set(students.map(s=>s.school).filter(Boolean))] },
    { key:"discipline",   label:"Discipline",   options:[...new Set(students.map(s=>s.discipline).filter(Boolean))] },
    { key:"course",       label:"Course",       options:[...new Set(students.map(s=>s.course).filter(Boolean))].sort() },
    { key:"district",     label:"District",     options:[...new Set(students.map(s=>s.district).filter(Boolean))] },
    { key:"taluka",       label:"Taluka",       options:[...new Set(students.map(s=>s.taluka).filter(Boolean))] },
    { key:"gender",       label:"Gender",       options:[...new Set(students.map(s=>s.gender).filter(Boolean))] },
    { key:"category",     label:"Category",     options:[...new Set(students.map(s=>s.category).filter(Boolean))] },
    { key:"aspirational_sector",          label:"Aspiration",   options:[...new Set(students.map(s=>s.aspirational_sector).filter(Boolean))] },
    { key:"entrepreneurship_inclination", label:"Entrepreneur?",options:["Yes","No"] },
  ];

  return (
    <div className="sd-root">
      <style>{CSS}</style>

      <div className="sd-header">
        
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"68px 5vw 0",position:"relative",zIndex:1 }}>
          
          <div className="sd-crumb">Admin <span>/</span> Dashboards <span>/</span> Students</div>
          <h1 className="sd-title">Student Registry</h1>
          <p className="sd-sub">Goa University · Student Records</p>
          <button onClick={handleSync} disabled={syncing}
            style={{ marginTop:20,padding:"8px 20px",borderRadius:100,background:"white",border:"1.5px solid rgba(255,255,255,.25)",color:"#0F172A",fontSize:13,fontWeight:700,cursor:syncing?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:8,opacity:syncing?0.7:1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {syncing ? "Syncing..." : "Sync from Sheets"}
          </button>
        </div>
      </div>

      <div className="sd-body">
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 5vw 60px" }}>
          <br></br>
          {loading ? (
            <div className="sd-loading">
              <div className="sd-spinner"/>
              <p style={{ fontSize:14,color:"#94A3B8",fontFamily:"inherit" }}>Loading student data...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign:"center",padding:"60px 20px" }}>
              <div style={{ width:56,height:56,borderRadius:16,background:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div style={{ fontSize:15,fontWeight:600,color:"#E11D48",marginBottom:8 }}>{error}</div>
              
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginTop:-28,marginBottom:32 }}>
                
                {STAT_CARDS(students, entrepreneurs).map((c,i) => (
                  <div key={i}
                    style={{ background:"white",borderRadius:20,padding:"22px 24px",border:"1.5px solid #E2E8F0",transition:"all .3s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 16px 40px ${c.color}18`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                    <div style={{ width:44,height:44,borderRadius:12,background:c.color+"15",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.iconPath}</svg>
                    </div>
                    <div style={{ fontFamily:"'Fraunces',serif",fontSize:34,fontWeight:800,color:c.color,lineHeight:1,marginBottom:6 }}>{c.value}</div>
                    <div style={{ fontSize:13,fontWeight:600,color:"#64748B" }}>{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts — imported from components/charts */}
              <div style={{ marginBottom:8 }} className="sd-sl">Data Visualizations</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:16 }}>
                <GenderChart    students={students}/>
                <CategoryChart  students={students}/>
                <DisciplineChart students={students}/>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:32 }}>
                <SectorChart students={students}/>
                <SkillsChart students={students}/>
              </div>

              {/* Table */}
              <div className="sd-sl">All Student Records</div>
              <DataTable
                columns={COLUMNS}
                rows={students}
                filters={STUDENT_FILTERS}
                searchKeys={["student_name","course","district","taluka","school","discipline","enrollment_no","aspirational_sector","email","phone"]}
                onRowClick={setSelected}
                footer={`${students.length} records loaded from MongoDB · Click any row to view full profile`}
              />
            </>
          )}
        </div>
      </div>
      <StudentModal student={selected} onClose={() => setSelected(null)}/>
    </div>
  );
}
// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import DataTable, { Badge } from "../components/DataTable";
// import LocationChart    from "../components/charts/LocationChart";
// import TopSkillsChart   from "../components/charts/TopSkillsChart";
// import SkillGapChart    from "../components/charts/SkillGapChart";
// import SectorDonutChart from "../components/charts/SectorDonutChart";
// import SalaryChart      from "../components/charts/SalaryChart";
// import RecommendChart   from "../components/charts/RecommendChart";
// const CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
//   .ad-root{font-family:'Plus Jakarta Sans',sans-serif;}
//   .ad-header{background:linear-gradient(135deg,#F97316 0%,#EA580C 55%,#DC2626 100%);padding:32px 0 56px;position:relative;overflow:hidden;}
//   .ad-header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 50%,rgba(255,255,255,.08) 0%,transparent 50%),radial-gradient(circle at 10% 80%,rgba(13,148,136,.1) 0%,transparent 40%);}
//   .ad-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;background:#F1F5F9;clip-path:ellipse(55% 100% at 50% 100%);}
//   .ad-crumb{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
//   .ad-crumb span{color:rgba(255,255,255,.35);}
//   .ad-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,42px);font-weight:800;color:white;line-height:1.1;margin-bottom:8px;}
//   .ad-sub{font-size:14px;color:rgba(255,255,255,.65);}
//   .ad-body{background:#F1F5F9;min-height:100vh;}
//   .ad-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
//   .ad-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#F97316,#0D9488);}
//   .atag{display:inline-flex;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;background:#FFF7ED;color:#C2410C;border:1px solid rgba(249,115,22,.18);margin:2px;}
//   .am{position:fixed;inset:0;z-index:999;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:amF .2s ease both;}
//   @keyframes amF{from{opacity:0}to{opacity:1}}
//   @keyframes amS{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
//   .am-card{background:white;border-radius:24px;width:100%;max-width:620px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(15,23,42,.18);animation:amS .28s cubic-bezier(.22,1,.36,1) both;}
//   .am-strip{height:5px;background:linear-gradient(90deg,#F97316,#0D9488);}
//   .am-body{padding:28px 32px 32px;}
//   .am-sec{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94A3B8;margin:22px 0 12px;display:flex;align-items:center;gap:10px;}
//   .am-sec::after{content:'';flex:1;height:1px;background:#F1F5F9;}
//   .am-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
//   .am-f{background:#F8FAFC;border-radius:12px;padding:12px 16px;}
//   .am-fl{font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
//   .am-fv{font-size:14px;font-weight:600;color:#0F172A;}
//   .am-feedback{background:#FFF7ED;border:1.5px solid rgba(249,115,22,.2);border-radius:14px;padding:16px;font-size:14px;color:#7C2D12;line-height:1.75;font-style:italic;}
//   .am-close{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;background:white;color:#475569;border:1.5px solid #E2E8F0;cursor:pointer;transition:all .2s;margin-top:20px;}
//   .am-close:hover{background:#F8FAFC;color:#0F172A;}
//   .ad-loading{display:flex;align-items:center;justify-content:center;padding:80px 20px;flex-direction:column;gap:16px;}
//   .ad-spinner{width:40px;height:40px;border:3px solid #E2E8F0;border-top-color:#F97316;border-radius:50%;animation:spin .8s linear infinite;}
//   @keyframes spin{to{transform:rotate(360deg)}}
// `;

// const SECTOR_COLORS = {
//   IT:                  { bg:"#EFF6FF", tc:"#1D4ED8" },
//   Research:            { bg:"#F5F3FF", tc:"#7C3AED" },
//   Tourism:             { bg:"#F0FDFA", tc:"#0F766E" },
//   "Tourism & Hospitality": { bg:"#F0FDFA", tc:"#0F766E" },
//   Finance:             { bg:"#FFF7ED", tc:"#C2410C" },
//   Manufacturing:       { bg:"#F8FAFC", tc:"#475569" },
//   Education:           { bg:"#FDF4FF", tc:"#9333EA" },
//   Healthcare:          { bg:"#FFF1F2", tc:"#BE123C" },
//   Government:          { bg:"#F0FDF4", tc:"#16A34A" },
//   "Human Resources":   { bg:"#FEF3C7", tc:"#D97706" },
// };

// function SkillTags({ arr }) {
//   if (!arr || arr.length === 0) return <span style={{ color:"#CBD5E1", fontSize:12 }}>—</span>;
//   return (
//     <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
//       {arr.map((s,i) => <span key={i} className="atag">{s}</span>)}
//     </div>
//   );
// }

// function GapBadge({ val }) {
//   const map = {
//     "Yes, significant gap": { bg:"#FFF1F2", c:"#BE123C" },
//     "Somewhat":             { bg:"#FFF7ED", c:"#C2410C" },
//     "No, well prepared":    { bg:"#F0FDFA", c:"#0F766E" },
//   };
//   const s = map[val] || { bg:"#F8FAFC", c:"#64748B" };
//   return <span style={{ fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:100,background:s.bg,color:s.c }}>{val||"—"}</span>;
// }

// function RecBadge({ val }) {
//   const map = {
//     "Yes":   { bg:"#F0FDFA", c:"#0D9488" },
//     "No":    { bg:"#FFF1F2", c:"#E11D48" },
//     "Maybe": { bg:"#FFF7ED", c:"#D97706" },
//   };
//   const s = map[val] || { bg:"#F8FAFC", c:"#64748B" };
//   return <span style={{ fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:100,background:s.bg,color:s.c }}>{val||"—"}</span>;
// }

// // ── SVG Stat Card ─────────────────────────────────────────────────
// function StatCard({ label, value, color, sublabel, iconPath }) {
//   return (
//     <div
//       style={{ background:"white",borderRadius:20,padding:"22px 24px",border:"1.5px solid #E2E8F0",transition:"all .3s" }}
//       onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 16px 40px ${color}18`; }}
//       onMouseLeave={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
//     >
//       <div style={{ width:44,height:44,borderRadius:12,background:color+"15",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           {iconPath}
//         </svg>
//       </div>
//       <div style={{ fontFamily:"'Fraunces',serif",fontSize:34,fontWeight:800,color,lineHeight:1,marginBottom:4 }}>{value}</div>
//       <div style={{ fontSize:13,fontWeight:600,color:"#0F172A",marginBottom:sublabel?2:0 }}>{label}</div>
//       {sublabel && <div style={{ fontSize:11,color:"#94A3B8" }}>{sublabel}</div>}
//     </div>
//   );
// }

// function Locked() {
//   return (
//     <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F1F5F9",paddingTop:80,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
//       <div style={{ textAlign:"center" }}>
//         <div style={{ width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#FFF7ED,#FFEDD5)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",border:"2px solid rgba(249,115,22,.15)" }}>
//           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
//             <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//           </svg>
//         </div>
//         <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:800,color:"#0F172A",marginBottom:8 }}>Admin Access Required</h2>
//         <p style={{ fontSize:14,color:"#64748B" }}>Please log in to view the alumni dashboard.</p>
//       </div>
//     </div>
//   );
// }

// function AlumniModal({ alumni, onClose }) {
//   if (!alumni) return null;
//   const sc = SECTOR_COLORS[alumni.sector] || { bg:"#F8FAFC", tc:"#475569" };
//   return (
//     <div className="am" onClick={onClose}>
//       <div className="am-card" onClick={e => e.stopPropagation()}>
//         <div className="am-strip" />
//         <div className="am-body">
//           <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:4 }}>
//             <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#F97316,#EA580C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"white",flexShrink:0 }}>
//               {(alumni.name||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}
//             </div>
//             <div style={{ flex:1 }}>
//               <div style={{ fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:800,color:"#0F172A" }}>{alumni.name}</div>
//               <div style={{ fontSize:13,color:"#64748B",marginTop:2 }}>
//                 {[alumni.enrollment_no, alumni.course, alumni.year_of_passing ? `Batch ${alumni.year_of_passing}` : null].filter(Boolean).join(" · ")}
//               </div>
//             </div>
//             <span style={{ fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,background:sc.bg,color:sc.tc }}>{alumni.sector||"—"}</span>
//           </div>

//           <div className="am-sec">Personal Information</div>
//           <div className="am-grid">
//             {[["Email",alumni.email||"—"],["Phone",alumni.phone||"—"],["Gender",alumni.gender||"—"],["Enrollment No.",alumni.enrollment_no||"—"]].map(([l,v])=>(
//               <div key={l} className="am-f"><div className="am-fl">{l}</div><div className="am-fv">{v}</div></div>
//             ))}
//           </div>

//           <div className="am-sec">Academic Details</div>
//           <div className="am-grid">
//             {[["Degree Type",alumni.degree_type||"—"],["School",alumni.school||"—"],["Discipline",alumni.discipline||"—"],["Course",alumni.course||"—"],["Year of Passing",alumni.year_of_passing||"—"]].map(([l,v])=>(
//               <div key={l} className="am-f"><div className="am-fl">{l}</div><div className="am-fv">{v}</div></div>
//             ))}
//           </div>

//           <div className="am-sec">Professional Details</div>
//           <div className="am-grid">
//             {[["Current Role",alumni.current_role||"—"],["Organisation",alumni.company||"—"],["Sector",alumni.sector||"—"],["Employment Type",alumni.employment_type||"—"],["Salary Range",alumni.salary||"—"],["Location",alumni.location||"—"],["Experience",alumni.years_of_experience||"—"],["Currently Employed",alumni.currently_employed||"—"]].map(([l,v])=>(
//               <div key={l} className="am-f"><div className="am-fl">{l}</div><div className="am-fv">{v}</div></div>
//             ))}
//           </div>

//           <div className="am-sec">Further Education</div>
//           <div className="am-grid">
//             <div className="am-f">
//               <div className="am-fl">Pursued Higher Education</div>
//               <div className="am-fv">
//                 <span style={{ fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:100,background:alumni.higher_education==="Yes"?"#F0FDFA":"#F8FAFC",color:alumni.higher_education==="Yes"?"#0D9488":"#94A3B8" }}>
//                   {alumni.higher_education||"—"}
//                 </span>
//               </div>
//             </div>
//             {alumni.higher_education === "Yes" && alumni.higher_education_detail && (
//               <div className="am-f"><div className="am-fl">Details</div><div className="am-fv">{alumni.higher_education_detail}</div></div>
//             )}
//           </div>

//           <div className="am-sec">Research Variables</div>
//           <div className="am-grid" style={{ marginBottom:12 }}>
//             <div className="am-f"><div className="am-fl">Skill Gap Perceived</div><div className="am-fv"><GapBadge val={alumni.skill_gap_perceived}/></div></div>
//             <div className="am-f"><div className="am-fl">Recommend Goa Jobs</div><div className="am-fv"><RecBadge val={alumni.would_recommend_goa_jobs}/></div></div>
//           </div>

//           {alumni.skills_used && alumni.skills_used.length > 0 && (
//             <div className="am-f" style={{ marginBottom:12 }}>
//               <div className="am-fl" style={{ marginBottom:8 }}>Skills Used at Work</div>
//               <SkillTags arr={alumni.skills_used} />
//             </div>
//           )}

//           {alumni.industry_feedback && (
//             <>
//               <div className="am-fl" style={{ marginBottom:8,fontSize:11,fontWeight:700,color:"#94A3B8",letterSpacing:".06em",textTransform:"uppercase" }}>Industry Feedback</div>
//               <div className="am-feedback">"{alumni.industry_feedback}"</div>
//             </>
//           )}

//           <button className="am-close" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Location donut — unchanged, already clean
// // function LocationDonut({ data }) {
// //   const inGoa = data.filter(a => a.location === "Goa").length;
// //   const out   = data.length - inGoa;
// //   const total = data.length || 1;
// //   const SIZE=90, CX=45, CY=45, R=32;
// //   const segs = [
// //     { value:inGoa, color:"#0D9488", label:"Stayed in Goa" },
// //     { value:out,   color:"#F97316", label:"Migrated out"  },
// //   ];
// //   let angle=-90;
// //   const arcs = segs.map(s => {
// //     const sweep=(s.value/total)*360, start=angle; angle+=sweep;
// //     if(sweep>=360) return {...s,d:`M ${CX} ${CY-R} A ${R} ${R} 0 1 1 ${CX-.01} ${CY-R} Z`};
// //     const r=d=>(d*Math.PI)/180;
// //     const sx=CX+R*Math.cos(r(start)),sy=CY+R*Math.sin(r(start));
// //     const ex=CX+R*Math.cos(r(start+sweep)),ey=CY+R*Math.sin(r(start+sweep));
// //     return {...s,d:`M ${sx} ${sy} A ${R} ${R} 0 ${sweep>180?1:0} 1 ${ex} ${ey} L ${CX} ${CY} Z`};
// //   });
// //   return (
// //     <div style={{ background:"white",border:"1.5px solid #E2E8F0",borderRadius:20,padding:22 }}>
// //       <div style={{ fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#64748B",marginBottom:16 }}>Location Distribution</div>
// //       <div style={{ display:"flex",alignItems:"center",gap:20 }}>
// //         <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
// //           {arcs.map((a,i)=><path key={i} d={a.d} fill={a.color} opacity={.9}/>)}
// //           <circle cx={CX} cy={CY} r={20} fill="white"/>
// //           <text x={CX} y={CY+4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A">{data.length}</text>
// //         </svg>
// //         <div style={{ flex:1 }}>
// //           {arcs.map(a=>(
// //             <div key={a.label} style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#475569",marginBottom:8 }}>
// //               <span style={{ width:10,height:10,borderRadius:"50%",background:a.color,flexShrink:0 }}/>
// //               {a.label}: <strong style={{ color:"#0F172A",marginLeft:2 }}>{a.value}</strong>
// //               <span style={{ marginLeft:"auto",fontSize:11,color:"#94A3B8" }}>{Math.round((a.value/total)*100)}%</span>
// //             </div>
// //           ))}
// //           <div style={{ height:4,borderRadius:100,overflow:"hidden",background:"#F1F5F9",marginTop:4 }}>
// //             <div style={{ height:"100%",width:`${(inGoa/total)*100}%`,background:"linear-gradient(90deg,#0D9488,#F97316)",borderRadius:100 }}/>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// function ChartCard({ title, children }) {
//   return (
//     <div style={{ background:"white",border:"1.5px solid #E2E8F0",borderRadius:20,padding:"22px 24px" }}>
//       <div style={{ fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#64748B",marginBottom:16 }}>{title}</div>
//       {children}
//     </div>
//   );
// }
// // function SkillGapSummary({ data }) {
// //   const counts = {
// //     "Yes, significant gap": data.filter(a=>a.skill_gap_perceived==="Yes, significant gap").length,
// //     "Somewhat":             data.filter(a=>a.skill_gap_perceived==="Somewhat").length,
// //     "No, well prepared":    data.filter(a=>a.skill_gap_perceived==="No, well prepared").length,
// //   };
// //   const total  = data.length || 1;
// //   const colors = { "Yes, significant gap":"#E11D48","Somewhat":"#D97706","No, well prepared":"#0D9488" };
// //   return (
// //     <div style={{ background:"white",border:"1.5px solid #E2E8F0",borderRadius:20,padding:22 }}>
// //       <div style={{ fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#64748B",marginBottom:16 }}>Skill Gap Perception</div>
// //       {Object.entries(counts).map(([label,count])=>(
// //         <div key={label} style={{ marginBottom:12 }}>
// //           <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
// //             <span style={{ fontSize:12,fontWeight:600,color:"#475569" }}>{label}</span>
// //             <span style={{ fontSize:12,fontWeight:800,color:colors[label] }}>{count}</span>
// //           </div>
// //           <div style={{ height:6,borderRadius:100,background:"#F1F5F9",overflow:"hidden" }}>
// //             <div style={{ height:"100%",width:`${(count/total)*100}%`,background:colors[label],borderRadius:100 }}/>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// const COLUMNS = [
//   { key:"enrollment_no", label:"Enroll No.", render:v=><span style={{ fontSize:12,fontFamily:"monospace",color:"#F97316",fontWeight:700 }}>{v||"—"}</span> },
//   { key:"name",          label:"Name",       render:v=><span style={{ fontWeight:700,color:"#0F172A" }}>{v||"—"}</span> },
//   { key:"gender",        label:"Gender",     render:v=>v?<Badge label={v}/>:<span style={{color:"#CBD5E1"}}>—</span> },
//   { key:"degree_type",   label:"Degree",     render:v=>v?<span style={{ fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#FFF7ED",color:"#C2410C" }}>{v}</span>:<span style={{color:"#CBD5E1"}}>—</span> },
//   { key:"discipline",    label:"Discipline", render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
//   { key:"course",        label:"Course",     render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
//   { key:"year_of_passing",label:"Year",      render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
//   { key:"current_role",  label:"Role",       render:v=><span style={{color:"#0F172A",fontWeight:600}}>{v||"—"}</span> },
//   { key:"company",       label:"Organisation",render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
//   { key:"sector",        label:"Sector",     render:v=>{ const s=SECTOR_COLORS[v]||{bg:"#F8FAFC",tc:"#475569"}; return <span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:s.bg,color:s.tc }}>{v||"—"}</span>; }},
//   { key:"employment_type",label:"Emp. Type", render:v=><span style={{ fontSize:11,color:"#475569" }}>{v||"—"}</span> },
//   { key:"salary",        label:"Salary",     render:v=><span style={{ fontSize:12,fontWeight:600,color:"#F97316" }}>{v||"—"}</span> },
//   { key:"location",      label:"Location",   render:v=><span style={{ fontSize:12,fontWeight:600,color:v==="Goa"?"#0D9488":"#64748B" }}>{v||"—"}</span> },
//   { key:"skill_gap_perceived",      label:"Skill Gap",    render:v=><GapBadge val={v}/> },
//   { key:"would_recommend_goa_jobs", label:"Recommend Goa",render:v=><RecBadge val={v}/> },
// ];

// // Alumni stat cards config
// const ALUMNI_STAT_CARDS = (alumni, inGoa, higherEd, sigGap) => [
//   {
//     label: "Total Alumni", value: alumni.length, color: "#F97316",
//     iconPath: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
//   },
//   {
//     label: "Placed in Goa", value: inGoa, color: "#0D9488", sublabel: "Retained talent",
//     iconPath: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
//   },
//   {
//     label: "Pursued Higher Ed", value: higherEd, color: "#7C3AED",
//     iconPath: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
//   },
//   {
//     label: "Report Skill Gap", value: sigGap, color: "#E11D48", sublabel: "Significant gap",
//     iconPath: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
//   },
// ];

// export default function AlumniDashboard() {
//   const { isAdmin, authFetch } = useAuth();
//   const [alumni, setAlumni]     = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState("");
//   const [selected, setSelected] = useState(null);
//   const [syncing, setSyncing]   = useState(false);

//   useEffect(() => {
//     if (!isAdmin) return;
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await authFetch("/alumni?limit=100&page=1");
//         if (data.success) setAlumni(data.data);
//         else setError(data.message || "Failed to load alumni.");
//       } catch (err) {
//         setError(err.message || "Network error. Is the backend running?");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [isAdmin]);

//   if (!isAdmin) return <Locked />;

//   const handleSync = async () => {
//     try {
//       setSyncing(true);
//       const data = await authFetch("/alumni/sync", { method: "POST" });
//       if (data.success) {
//         alert(`✓ ${data.message}`);
//         const fresh = await authFetch("/alumni?limit=100&page=1");
//         if (fresh.success) setAlumni(fresh.data);
//       }
//     } catch (err) {
//       alert("Sync failed: " + err.message);
//     } finally {
//       setSyncing(false);
//     }
//   };

//   const inGoa    = alumni.filter(a => a.location === "Goa").length;
//   const higherEd = alumni.filter(a => a.higher_education === "Yes").length;
//   const sigGap   = alumni.filter(a => a.skill_gap_perceived === "Yes, significant gap").length;

//   const ALUMNI_FILTERS = [
//     { key:"sector",          label:"Sector",       options:[...new Set(alumni.map(a=>a.sector).filter(Boolean))] },
//     { key:"degree_type",     label:"Degree Type",  options:[...new Set(alumni.map(a=>a.degree_type).filter(Boolean))] },
//     { key:"discipline",      label:"Discipline",   options:[...new Set(alumni.map(a=>a.discipline).filter(Boolean))] },
//     { key:"course",          label:"Course",       options:[...new Set(alumni.map(a=>a.course).filter(Boolean))].sort() },
//     { key:"employment_type", label:"Emp. Type",    options:[...new Set(alumni.map(a=>a.employment_type).filter(Boolean))] },
//     { key:"location",        label:"Location",     options:[...new Set(alumni.map(a=>a.location).filter(Boolean))] },
//     { key:"gender",          label:"Gender",       options:[...new Set(alumni.map(a=>a.gender).filter(Boolean))] },
//     { key:"higher_education",label:"Higher Ed",    options:["Yes","No"] },
//     { key:"skill_gap_perceived",      label:"Skill Gap",    options:["Yes, significant gap","Somewhat","No, well prepared"] },
//     { key:"would_recommend_goa_jobs", label:"Recommend Goa",options:["Yes","No","Maybe"] },
//   ];

//   return (
//     <div className="ad-root">
//       <style>{CSS}</style>

//       {/* Header */}
//       <div className="ad-header">
//         <div style={{ maxWidth:1200,margin:"0 auto",padding:"68px 5vw 0",position:"relative",zIndex:1 }}>
//           <div className="ad-crumb">Admin <span>/</span> Dashboards <span>/</span> Alumni</div>
//           <h1 className="ad-title">Alumni Network</h1>
//           <p className="ad-sub">Goa University · Career outcomes, skill gap analysis & industry feedback</p>
//           <button
//             onClick={handleSync}
//             disabled={syncing}
//             style={{ marginTop:20,padding:"8px 20px",borderRadius:100,background:"white",border:"1.5px solid rgba(255,255,255,.25)",color:"#0F172A",fontSize:13,fontWeight:700,cursor:syncing?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:8,opacity:syncing?0.7:1,transition:"all .2s" }}
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
//               <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
//             </svg>
//             {syncing ? "Syncing..." : "Sync from Sheets"}
//           </button>
//         </div>
//       </div>

//       <div className="ad-body">
//         <br/>
//         <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 5vw 60px" }}>

//           {loading ? (
//             <div className="ad-loading">
//               <div className="ad-spinner" />
//               <p style={{ fontSize:14,color:"#94A3B8",fontFamily:"inherit" }}>Loading alumni data...</p>
//             </div>
//           ) : error ? (
//             <div style={{ textAlign:"center",padding:"60px 20px" }}>
//               <div style={{ width:56,height:56,borderRadius:16,background:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
//                 </svg>
//               </div>
//               <div style={{ fontSize:15,fontWeight:600,color:"#E11D48",marginBottom:8 }}>{error}</div>
//               <div style={{ fontSize:13,color:"#94A3B8" }}>Make sure the backend is running on <code>http://localhost:5000</code></div>
//             </div>
//           ) : (
//             <>
//               {/* Stat cards */}
//               <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginTop:-28,marginBottom:32 }}>
//                 {ALUMNI_STAT_CARDS(alumni, inGoa, higherEd, sigGap).map((c,i) => (
//                   <StatCard key={i} {...c} />
//                 ))}
//               </div>

//               {/* Charts */}
//               <div className="ad-sl">Analytics Overview</div>
//               <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginBottom:32 }}>
//                 {/* <StreamChart data={alumni.map(a=>({course:a.sector}))} color="#F97316" title="Alumni by Sector" />
//                 <LocationDonut data={alumni} />
//                 <SkillGapSummary data={alumni} /> */}
//                 {/* ── Row 1: Sector donut + Location pie ── */}
// <div className="ad-sl">Sector & Location Breakdown</div>
// <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:32 }}>
//   <ChartCard title="Alumni by Sector">
//     <SectorDonutChart alumni={alumni} />
//   </ChartCard>
//   <ChartCard title="Location Distribution">
//     <LocationChart alumni={alumni} />
//   </ChartCard>
// </div>

// {/* ── Row 2: Skill gap + Recommend Goa ── */}
// <div className="ad-sl">Research Variables</div>
// <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:32 }}>
//   <ChartCard title="Skill Gap Perception">
//     <SkillGapChart alumni={alumni} />
//   </ChartCard>
//   <ChartCard title="Would Recommend Goa Jobs">
//     <RecommendChart alumni={alumni} />
//   </ChartCard>
// </div>

// {/* ── Row 3: Top skills + Salary ── */}
// <div className="ad-sl">Skills & Compensation</div>
// <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16,marginBottom:32 }}>
//   <ChartCard title="Top Skills Used at Work">
//     <TopSkillsChart alumni={alumni} />
//   </ChartCard>
//   <ChartCard title="Salary Distribution">
//     <SalaryChart alumni={alumni} />
//   </ChartCard>
// </div>
//               </div>

//               {/* Industry feedback */}
//               {alumni.filter(a=>a.industry_feedback).length > 0 && (
//                 <>
//                   <div className="ad-sl">Industry Feedback Highlights</div>
//                   <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:32 }}>
//                     {alumni.filter(a=>a.industry_feedback).map((a,i)=>(
//                       <div key={i}
//                         style={{ background:"white",border:"1.5px solid #E2E8F0",borderRadius:16,padding:"20px 22px",transition:"all .3s",cursor:"pointer" }}
//                         onMouseEnter={e=>{e.currentTarget.style.borderColor="#F97316";e.currentTarget.style.boxShadow="0 8px 24px rgba(249,115,22,.1)";}}
//                         onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.boxShadow="none";}}
//                         onClick={()=>setSelected(a)}
//                       >
//                         {/* Quote mark as SVG */}
//                         <svg width="20" height="16" viewBox="0 0 20 16" fill="#F97316" style={{ marginBottom:10, opacity:.6 }}>
//                           <path d="M0 16V9.818C0 4.91 3.197 1.636 9.59 0l1.046 1.818C7.19 2.91 5.476 4.788 5.216 7.273H8V16H0zm12 0V9.818C12 4.91 15.197 1.636 21.59 0l1.046 1.818c-3.446 1.092-5.16 2.97-5.42 5.455H20V16h-8z"/>
//                         </svg>
//                         <p style={{ fontSize:13,color:"#475569",lineHeight:1.7,marginBottom:14,fontStyle:"italic" }}>{a.industry_feedback}</p>
//                         <div style={{ display:"flex",alignItems:"center",gap:10 }}>
//                           <div style={{ width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#F97316,#EA580C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",flexShrink:0 }}>
//                             {(a.name||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}
//                           </div>
//                           <div style={{ flex:1,minWidth:0 }}>
//                             <div style={{ fontSize:13,fontWeight:700,color:"#0F172A" }}>{a.name}</div>
//                             <div style={{ fontSize:11,color:"#94A3B8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{[a.current_role,a.company].filter(Boolean).join(" · ")}</div>
//                           </div>
//                           <GapBadge val={a.skill_gap_perceived} />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}

//               {/* Table */}
//               <div className="ad-sl">All Alumni Records</div>
//               <DataTable
//                 columns={COLUMNS}
//                 rows={alumni}
//                 filters={ALUMNI_FILTERS}
//                 searchKeys={["name","course","discipline","current_role","company","location","enrollment_no"]}
//                 onRowClick={setSelected}
//                 footer={`${alumni.length} records loaded from MongoDB · Click any row to view full profile`}
//               />
//             </>
//           )}
//         </div>
//       </div>

//       <AlumniModal alumni={selected} onClose={() => setSelected(null)} />
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DataTable, { Badge } from "../components/DataTable";
import LocationChart    from "../components/charts/LocationChart";
import TopSkillsChart   from "../components/charts/TopSkillsChart";
import SkillGapChart    from "../components/charts/SkillGapChart";
import SectorDonutChart from "../components/charts/SectorDonutChart";
import SalaryChart      from "../components/charts/SalaryChart";
import RecommendChart   from "../components/charts/RecommendChart";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
  .ad-root{font-family:'Plus Jakarta Sans',sans-serif;}
  .ad-header{background:linear-gradient(135deg,#F97316 0%,#EA580C 55%,#DC2626 100%);padding:32px 0 56px;position:relative;overflow:hidden;}
  .ad-header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 50%,rgba(255,255,255,.08) 0%,transparent 50%),radial-gradient(circle at 10% 80%,rgba(13,148,136,.1) 0%,transparent 40%);}
  .ad-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;background:#F1F5F9;clip-path:ellipse(55% 100% at 50% 100%);}
  .ad-crumb{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
  .ad-crumb span{color:rgba(255,255,255,.35);}
  .ad-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,42px);font-weight:800;color:white;line-height:1.1;margin-bottom:8px;}
  .ad-sub{font-size:14px;color:rgba(255,255,255,.65);}
  .ad-body{background:#F1F5F9;min-height:100vh;}
  .ad-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .ad-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#F97316,#0D9488);}
  .atag{display:inline-flex;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600;background:#FFF7ED;color:#C2410C;border:1px solid rgba(249,115,22,.18);margin:2px;}
  .am{position:fixed;inset:0;z-index:999;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:amF .2s ease both;}
  @keyframes amF{from{opacity:0}to{opacity:1}}
  @keyframes amS{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  .am-card{background:white;border-radius:24px;width:100%;max-width:620px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(15,23,42,.18);animation:amS .28s cubic-bezier(.22,1,.36,1) both;}
  .am-strip{height:5px;background:linear-gradient(90deg,#F97316,#0D9488);}
  .am-body{padding:28px 32px 32px;}
  .am-sec{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94A3B8;margin:22px 0 12px;display:flex;align-items:center;gap:10px;}
  .am-sec::after{content:'';flex:1;height:1px;background:#F1F5F9;}
  .am-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .am-f{background:#F8FAFC;border-radius:12px;padding:12px 16px;}
  .am-fl{font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
  .am-fv{font-size:14px;font-weight:600;color:#0F172A;}
  .am-feedback{background:#FFF7ED;border:1.5px solid rgba(249,115,22,.2);border-radius:14px;padding:16px;font-size:14px;color:#7C2D12;line-height:1.75;font-style:italic;}
  .am-close{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;background:white;color:#475569;border:1.5px solid #E2E8F0;cursor:pointer;transition:all .2s;margin-top:20px;}
  .am-close:hover{background:#F8FAFC;color:#0F172A;}
  .ad-loading{display:flex;align-items:center;justify-content:center;padding:80px 20px;flex-direction:column;gap:16px;}
  .ad-spinner{width:40px;height:40px;border:3px solid #E2E8F0;border-top-color:#F97316;border-radius:50%;animation:spin .8s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

const SECTOR_COLORS = {
  IT:                      { bg:"#EFF6FF", tc:"#1D4ED8" },
  Research:                { bg:"#F5F3FF", tc:"#7C3AED" },
  Tourism:                 { bg:"#F0FDFA", tc:"#0F766E" },
  "Tourism & Hospitality": { bg:"#F0FDFA", tc:"#0F766E" },
  Finance:                 { bg:"#FFF7ED", tc:"#C2410C" },
  Manufacturing:           { bg:"#F8FAFC", tc:"#475569" },
  Education:               { bg:"#FDF4FF", tc:"#9333EA" },
  Healthcare:              { bg:"#FFF1F2", tc:"#BE123C" },
  Government:              { bg:"#F0FDF4", tc:"#16A34A" },
  "Human Resources":       { bg:"#FEF3C7", tc:"#D97706" },
};

function SkillTags({ arr }) {
  if (!arr || arr.length === 0) return <span style={{ color:"#CBD5E1", fontSize:12 }}>—</span>;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
      {arr.map((s,i) => <span key={i} className="atag">{s}</span>)}
    </div>
  );
}

function GapBadge({ val }) {
  const map = {
    "Yes, significant gap": { bg:"#FFF1F2", c:"#BE123C" },
    "Somewhat":             { bg:"#FFF7ED", c:"#C2410C" },
    "No, well prepared":    { bg:"#F0FDFA", c:"#0F766E" },
  };
  const s = map[val] || { bg:"#F8FAFC", c:"#64748B" };
  return <span style={{ fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:100,background:s.bg,color:s.c }}>{val||"—"}</span>;
}

function RecBadge({ val }) {
  const map = {
    "Yes":   { bg:"#F0FDFA", c:"#0D9488" },
    "No":    { bg:"#FFF1F2", c:"#E11D48" },
    "Maybe": { bg:"#FFF7ED", c:"#D97706" },
  };
  const s = map[val] || { bg:"#F8FAFC", c:"#64748B" };
  return <span style={{ fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:100,background:s.bg,color:s.c }}>{val||"—"}</span>;
}

function StatCard({ label, value, color, sublabel, iconPath }) {
  return (
    <div
      style={{ background:"white",borderRadius:20,padding:"22px 24px",border:"1.5px solid #E2E8F0",transition:"all .3s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 16px 40px ${color}18`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
    >
      <div style={{ width:44,height:44,borderRadius:12,background:color+"15",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {iconPath}
        </svg>
      </div>
      <div style={{ fontFamily:"'Fraunces',serif",fontSize:34,fontWeight:800,color,lineHeight:1,marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:13,fontWeight:600,color:"#0F172A",marginBottom:sublabel?2:0 }}>{label}</div>
      {sublabel && <div style={{ fontSize:11,color:"#94A3B8" }}>{sublabel}</div>}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={{ background:"white",border:"1.5px solid #E2E8F0",borderRadius:20,padding:"22px 24px" }}>
      <div style={{ fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#64748B",marginBottom:16 }}>{title}</div>
      {children}
    </div>
  );
}

function Locked() {
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F1F5F9",paddingTop:80,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#FFF7ED,#FFEDD5)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",border:"2px solid rgba(249,115,22,.15)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:800,color:"#0F172A",marginBottom:8 }}>Admin Access Required</h2>
        <p style={{ fontSize:14,color:"#64748B" }}>Please log in to view the alumni dashboard.</p>
      </div>
    </div>
  );
}

function AlumniModal({ alumni, onClose }) {
  if (!alumni) return null;
  const sc = SECTOR_COLORS[alumni.sector] || { bg:"#F8FAFC", tc:"#475569" };
  return (
    <div className="am" onClick={onClose}>
      <div className="am-card" onClick={e => e.stopPropagation()}>
        <div className="am-strip" />
        <div className="am-body">
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:4 }}>
            <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#F97316,#EA580C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"white",flexShrink:0 }}>
              {(alumni.name||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:800,color:"#0F172A" }}>{alumni.name}</div>
              <div style={{ fontSize:13,color:"#64748B",marginTop:2 }}>
                {[alumni.enrollment_no, alumni.course, alumni.year_of_passing ? `Batch ${alumni.year_of_passing}` : null].filter(Boolean).join(" · ")}
              </div>
            </div>
            <span style={{ fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:100,background:sc.bg,color:sc.tc }}>{alumni.sector||"—"}</span>
          </div>

          <div className="am-sec">Personal Information</div>
          <div className="am-grid">
            {[["Email",alumni.email||"—"],["Phone",alumni.phone||"—"],["Gender",alumni.gender||"—"],["Enrollment No.",alumni.enrollment_no||"—"]].map(([l,v])=>(
              <div key={l} className="am-f"><div className="am-fl">{l}</div><div className="am-fv">{v}</div></div>
            ))}
          </div>

          <div className="am-sec">Academic Details</div>
          <div className="am-grid">
            {[["Degree Type",alumni.degree_type||"—"],["School",alumni.school||"—"],["Discipline",alumni.discipline||"—"],["Course",alumni.course||"—"],["Year of Passing",alumni.year_of_passing||"—"]].map(([l,v])=>(
              <div key={l} className="am-f"><div className="am-fl">{l}</div><div className="am-fv">{v}</div></div>
            ))}
          </div>

          {/* <div className="am-sec">Professional Details</div>
          <div className="am-grid">
            {[["Current Role",alumni.current_role||"—"],["Organisation",alumni.company||"—"],["Sector",alumni.sector||"—"],["Employment Type",alumni.employment_type||"—"],["Salary Range",alumni.salary||"—"],["Location",alumni.location||"—"],["Experience",alumni.years_of_experience||"—"],["Currently Employed",alumni.currently_employed||"—"]].map(([l,v])=>(
              <div key={l} className="am-f"><div className="am-fl">{l}</div><div className="am-fv">{v}</div></div>
            ))}
          </div> */}

          <div className="am-sec">Professional Details</div>
<div className="am-grid">
  {[
    ["Currently Employed", alumni.currently_employed || "—"],

    ...( (alumni.currently_employed || "").trim() === "Yes" ? [
      ["Current Role", alumni.current_role],
      ["Organisation", alumni.company],
      ["Sector", alumni.sector],
      ["Employment Type", alumni.employment_type],
      ["Salary Range", alumni.salary],
      ["Location", alumni.location],
      ["Experience", alumni.years_of_experience],
    ] : [
      ["Status", "Currently Not Employed"]
    ])
  ].map(([l, v]) => (
    <div key={l} className="am-f">
      <div className="am-fl">{l}</div>
      <div className="am-fv">{v || "—"}</div>
    </div>
  ))}
</div>

          <div className="am-sec">Further Education</div>
          <div className="am-grid">
            <div className="am-f">
              <div className="am-fl">Pursued Higher Education</div>
              <div className="am-fv">
                <span style={{ fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:100,background:alumni.higher_education==="Yes"?"#F0FDFA":"#F8FAFC",color:alumni.higher_education==="Yes"?"#0D9488":"#94A3B8" }}>
                  {alumni.higher_education||"—"}
                </span>
              </div>
            </div>
            {alumni.higher_education === "Yes" && alumni.higher_education_detail && (
              <div className="am-f"><div className="am-fl">Details</div><div className="am-fv">{alumni.higher_education_detail}</div></div>
            )}
          </div>

          <div className="am-sec">Research Variables</div>
          <div className="am-grid" style={{ marginBottom:12 }}>
            <div className="am-f"><div className="am-fl">Skill Gap Perceived</div><div className="am-fv"><GapBadge val={alumni.skill_gap_perceived}/></div></div>
            <div className="am-f"><div className="am-fl">Recommend Goa Jobs</div><div className="am-fv"><RecBadge val={alumni.would_recommend_goa_jobs}/></div></div>
          </div>

          {alumni.skills_used && alumni.skills_used.length > 0 && (
            <div className="am-f" style={{ marginBottom:12 }}>
              <div className="am-fl" style={{ marginBottom:8 }}>Skills Used at Work</div>
              <SkillTags arr={alumni.skills_used} />
            </div>
          )}

          {alumni.industry_feedback && (
            <>
              <div className="am-fl" style={{ marginBottom:8,fontSize:11,fontWeight:700,color:"#94A3B8",letterSpacing:".06em",textTransform:"uppercase" }}>Industry Feedback</div>
              <div className="am-feedback">"{alumni.industry_feedback}"</div>
            </>
          )}

          <button className="am-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const COLUMNS = [
  { key:"enrollment_no",            label:"Enroll No.",   render:v=><span style={{ fontSize:12,fontFamily:"monospace",color:"#F97316",fontWeight:700 }}>{v||"—"}</span> },
  { key:"name",                     label:"Name",         render:v=><span style={{ fontWeight:700,color:"#0F172A" }}>{v||"—"}</span> },
  { key:"gender",                   label:"Gender",       render:v=>v?<Badge label={v}/>:<span style={{color:"#CBD5E1"}}>—</span> },
  { key:"degree_type",              label:"Degree",       render:v=>v?<span style={{ fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:100,background:"#FFF7ED",color:"#C2410C" }}>{v}</span>:<span style={{color:"#CBD5E1"}}>—</span> },
  { key:"discipline",               label:"Discipline",   render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
  { key:"course",                   label:"Course",       render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
  { key:"year_of_passing",          label:"Year",         render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
  { key:"current_role",             label:"Role",         render:v=><span style={{color:"#0F172A",fontWeight:600}}>{v||"—"}</span> },
  {
  key: "currently_employed",
  label: "Employed",
  render: v => {
    if (!v) return <span style={{ color:"#CBD5E1" }}>—</span>;

    const val = v.trim();
    return (
      <Badge label={val === "Yes" ? "Employed" : "Unemployed"} />
    );
  }
},
  { key:"company",                  label:"Organisation", render:v=><span style={{color:"#475569"}}>{v||"—"}</span> },
  { key:"sector",                   label:"Sector",       render:v=>{ const s=SECTOR_COLORS[v]||{bg:"#F8FAFC",tc:"#475569"}; return <span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:s.bg,color:s.tc }}>{v||"—"}</span>; }},
  { key:"employment_type",          label:"Emp. Type",    render:v=><span style={{ fontSize:11,color:"#475569" }}>{v||"—"}</span> },
  { key:"salary",                   label:"Salary",       render:v=><span style={{ fontSize:12,fontWeight:600,color:"#F97316" }}>{v||"—"}</span> },
  { key:"location",                 label:"Location",     render:v=><span style={{ fontSize:12,fontWeight:600,color:v==="Goa"?"#0D9488":"#64748B" }}>{v||"—"}</span> },
  { key:"skill_gap_perceived",      label:"Skill Gap",    render:v=><GapBadge val={v}/> },
  { key:"would_recommend_goa_jobs", label:"Recommend Goa",render:v=><RecBadge val={v}/> },
];

const ALUMNI_STAT_CARDS = (alumni, inGoa, higherEd, sigGap) => [
  {
    label:"Total Alumni", value:alumni.length, color:"#F97316",
    iconPath:<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
  },
  {
    label:"Placed in Goa", value:inGoa, color:"#0D9488", sublabel:"Retained talent",
    iconPath:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  },
  {
    label:"Pursued Higher Ed", value:higherEd, color:"#7C3AED",
    iconPath:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
  },
  {
    label:"Report Skill Gap", value:sigGap, color:"#E11D48", sublabel:"Significant gap",
    iconPath:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  },
];

export default function AlumniDashboard() {
  const { isAdmin, authFetch } = useAuth();
  const [alumni, setAlumni]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [selected, setSelected] = useState(null);
  const [syncing, setSyncing]   = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await authFetch("/alumni?limit=100&page=1");
        if (data.success) setAlumni(data.data);
        else setError(data.message || "Failed to load alumni.");
      } catch (err) {
        setError(err.message || "Network error. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) return <Locked />;

  const handleSync = async () => {
    try {
      setSyncing(true);
      const data = await authFetch("/alumni/sync", { method: "POST" });
      if (data.success) {
        alert(`✓ ${data.message}`);
        const fresh = await authFetch("/alumni?limit=100&page=1");
        if (fresh.success) setAlumni(fresh.data);
      }
    } catch (err) {
      alert("Sync failed: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const inGoa    = alumni.filter(a => a.location === "Goa").length;
  const higherEd = alumni.filter(a => a.higher_education === "Yes").length;
  const sigGap   = alumni.filter(a => a.skill_gap_perceived === "Yes, significant gap").length;

  const ALUMNI_FILTERS = [
    { key:"sector",                   label:"Sector",       options:[...new Set(alumni.map(a=>a.sector).filter(Boolean))] },
    { key:"degree_type",              label:"Degree Type",  options:[...new Set(alumni.map(a=>a.degree_type).filter(Boolean))] },
    { key:"discipline",               label:"Discipline",   options:[...new Set(alumni.map(a=>a.discipline).filter(Boolean))] },
    { key:"course",                   label:"Course",       options:[...new Set(alumni.map(a=>a.course).filter(Boolean))].sort() },
    { key:"employment_type",          label:"Emp. Type",    options:[...new Set(alumni.map(a=>a.employment_type).filter(Boolean))] },
    { key:"location",                 label:"Location",     options:[...new Set(alumni.map(a=>a.location).filter(Boolean))] },
    { key:"gender",                   label:"Gender",       options:[...new Set(alumni.map(a=>a.gender).filter(Boolean))] },
    { key:"higher_education",         label:"Higher Ed",    options:["Yes","No"] },
    { key:"skill_gap_perceived",      label:"Skill Gap",    options:["Yes, significant gap","Somewhat","No, well prepared"] },
    { key:"would_recommend_goa_jobs", label:"Recommend Goa",options:["Yes","No","Maybe"] },
    {
  key: "currently_employed",
  label: "Employed",
  options: ["Yes", "No"]
},
  ];

  return (
    <div className="ad-root">
      <style>{CSS}</style>

      {/* Header */}
      <div className="ad-header">
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"68px 5vw 0",position:"relative",zIndex:1 }}>
          <div className="ad-crumb">Admin <span>/</span> Dashboards <span>/</span> Alumni</div>
          <h1 className="ad-title">Alumni Network</h1>
          <p className="ad-sub">Goa University · Career outcomes, skill gap analysis & industry feedback</p>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{ marginTop:20,padding:"8px 20px",borderRadius:100,background:"white",border:"1.5px solid rgba(255,255,255,.25)",color:"#0F172A",fontSize:13,fontWeight:700,cursor:syncing?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:8,opacity:syncing?0.7:1,transition:"all .2s" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {syncing ? "Syncing..." : "Sync from Sheets"}
          </button>
        </div>
      </div>

      <div className="ad-body">
        <br></br>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"32px 5vw 60px" }}>

          {loading ? (
            <div className="ad-loading">
              <div className="ad-spinner" />
              <p style={{ fontSize:14,color:"#94A3B8",fontFamily:"inherit" }}>Loading alumni data...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign:"center",padding:"60px 20px" }}>
              <div style={{ width:56,height:56,borderRadius:16,background:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div style={{ fontSize:15,fontWeight:600,color:"#E11D48",marginBottom:8 }}>{error}</div>
              <div style={{ fontSize:13,color:"#94A3B8" }}>Make sure the backend is running on <code>http://localhost:5000</code></div>
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginTop:-28,marginBottom:40 }}>
                {ALUMNI_STAT_CARDS(alumni, inGoa, higherEd, sigGap).map((c,i) => (
                  <StatCard key={i} {...c} />
                ))}
              </div>

              {/* Row 1 — Sector + Location */}
              <div className="ad-sl">Sector & Location Breakdown</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:32 }}>
                <ChartCard title="Alumni by Sector">
                  <SectorDonutChart alumni={alumni} />
                </ChartCard>
                <ChartCard title="Location Distribution">
                  <LocationChart alumni={alumni} />
                </ChartCard>
              </div>

              {/* Row 2 — Skill Gap + Recommend */}
              <div className="ad-sl">Research Variables</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:32 }}>
                <ChartCard title="Skill Gap Perception">
                  <SkillGapChart alumni={alumni} />
                </ChartCard>
                <ChartCard title="Would Recommend Goa Jobs">
                  <RecommendChart alumni={alumni} />
                </ChartCard>
              </div>

              {/* Row 3 — Skills + Salary */}
              <div className="ad-sl">Skills & Compensation</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16,marginBottom:40 }}>
                <ChartCard title="Top Skills Used at Work">
                  <TopSkillsChart alumni={alumni} />
                </ChartCard>
                <ChartCard title="Salary Distribution">
                  <SalaryChart alumni={alumni} />
                </ChartCard>
              </div>

              {/* Industry feedback */}
              {alumni.filter(a=>a.industry_feedback).length > 0 && (
                <>
                  <div className="ad-sl">Industry Feedback Highlights</div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:40 }}>
                    {alumni.filter(a=>a.industry_feedback).map((a,i)=>(
                      <div key={i}
                        style={{ background:"white",border:"1.5px solid #E2E8F0",borderRadius:16,padding:"20px 22px",transition:"all .3s",cursor:"pointer" }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="#F97316";e.currentTarget.style.boxShadow="0 8px 24px rgba(249,115,22,.1)";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.boxShadow="none";}}
                        onClick={()=>setSelected(a)}
                      >
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="#F97316" style={{ marginBottom:10,opacity:.6 }}>
                          <path d="M0 16V9.818C0 4.91 3.197 1.636 9.59 0l1.046 1.818C7.19 2.91 5.476 4.788 5.216 7.273H8V16H0zm12 0V9.818C12 4.91 15.197 1.636 21.59 0l1.046 1.818c-3.446 1.092-5.16 2.97-5.42 5.455H20V16h-8z"/>
                        </svg>
                        <p style={{ fontSize:13,color:"#475569",lineHeight:1.7,marginBottom:14,fontStyle:"italic" }}>{a.industry_feedback}</p>
                        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#F97316,#EA580C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",flexShrink:0 }}>
                            {(a.name||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ fontSize:13,fontWeight:700,color:"#0F172A" }}>{a.name}</div>
                            <div style={{ fontSize:11,color:"#94A3B8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{[a.current_role,a.company].filter(Boolean).join(" · ")}</div>
                          </div>
                          <GapBadge val={a.skill_gap_perceived} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Table */}
              <div className="ad-sl">All Alumni Records</div>
              <DataTable
                columns={COLUMNS}
                rows={alumni}
                filters={ALUMNI_FILTERS}
                searchKeys={["name","course","discipline","current_role","company","location","enrollment_no"]}
                onRowClick={setSelected}
                footer={`${alumni.length} records loaded from MongoDB · Click any row to view full profile`}
              />
            </>
          )}
        </div>
      </div>

      <AlumniModal alumni={selected} onClose={() => setSelected(null)} />
    </div>
  );
}






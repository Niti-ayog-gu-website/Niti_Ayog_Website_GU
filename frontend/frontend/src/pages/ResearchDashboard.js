

//below gautamis integrated  + u hv added high level visualization 

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useExcelData } from "../hooks/useExcelData";
import { downloadChartsZip } from "../utils/downloadChartsZip";


// ── Teammate's chart components ───────────────────────────────────
import AgeChart       from "../components/charts/nitialumnicharts/AgeChart";
import GenderChart    from "../components/charts/nitialumnicharts/GenderChart";
import EducationChart from "../components/charts/nitialumnicharts/EducationChart";
import LocationChart  from "../components/charts/nitialumnicharts/LocationChart";
import IncomeChart    from "../components/charts/nitialumnicharts/IncomeChart";
import ActivityChart  from "../components/charts/nitialumnicharts/ActivityChart";
import Work365Chart   from "../components/charts/nitialumnicharts/Work365Chart";
import WorkChart      from "../components/charts/nitialumnicharts/WorkChart";
import YearChart      from "../components/charts/nitialumnicharts/YearChart";





// ── Skill gap charts (no replacement provided) ────────────────────
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ReferenceLine
} from "recharts";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
  .rd-root{font-family:'Plus Jakarta Sans',sans-serif;}
  .rd-header{background:linear-gradient(135deg,#1E1B4B 0%,#312E81 55%,#1D4ED8 100%);padding:32px 0 56px;position:relative;overflow:hidden;}
  .rd-header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 30%,rgba(99,102,241,.25) 0%,transparent 50%),radial-gradient(circle at 10% 80%,rgba(249,115,22,.1) 0%,transparent 40%);}
  .rd-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;background:#F1F5F9;clip-path:ellipse(55% 100% at 50% 100%);}
  .rd-crumb{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
  .rd-crumb span{color:rgba(255,255,255,.35);}
  .rd-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,42px);font-weight:800;color:white;line-height:1.1;margin-bottom:8px;}
  .rd-sub{font-size:14px;color:rgba(255,255,255,.65);}
  .rd-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.8);margin-bottom:18px;}
  .rd-body{background:#F1F5F9;min-height:100vh;}
  .rd-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .rd-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#6366F1,#F97316);}
  .cc{background:white;border-radius:20px;padding:24px;border:1.5px solid #E2E8F0;}
  .ct{font-size:13px;font-weight:700;color:#0F172A;margin-bottom:4px;}
  .cs{font-size:11px;color:#94A3B8;margin-bottom:20px;}
  .rd-loading{display:flex;align-items:center;justify-content:center;padding:80px 20px;flex-direction:column;gap:16px;}
  .rd-spinner{width:40px;height:40px;border:3px solid #E2E8F0;border-top-color:#6366F1;border-radius:50%;animation:spin .8s linear infinite;}
  .tab{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;border:1.5px solid #E2E8F0;background:white;color:#64748B;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;}
  .tab.active{background:#6366F1;color:white;border-color:#6366F1;}
  .tab:hover:not(.active){border-color:#6366F1;color:#6366F1;}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

const TT = {
  background:"white", border:"1.5px solid #E2E8F0", borderRadius:12,
  fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif",
  boxShadow:"0 4px 20px rgba(0,0,0,.08)"
};

// ── Access guard ──────────────────────────────────────────────────
function Locked() {
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F1F5F9",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#EEF2FF,#E0E7FF)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",border:"2px solid rgba(99,102,241,.2)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:800,color:"#0F172A",marginBottom:8 }}>Admin Access Required</h2>
        <p style={{ fontSize:14,color:"#64748B" }}>Please log in to view the research dashboard.</p>
      </div>
    </div>
  );
}

// ── Skill Gap charts ──────────────────────────────────────────────
function SkillGapChart({ data }) {
  const chartData = data.map(d => ({
    name: d.label.length > 22 ? d.label.slice(0,20)+"…" : d.label,
    fullName: d.label, Youth: d.youth, Employer: d.employer,
  }));
  return (
    <div className="cc" style={{ gridColumn:"1 / -1" }}>
      <div className="ct">Youth Skill Proficiency vs Employer Expectation</div>
      <div className="cs">Scores out of 5 — higher gap = more intervention needed</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top:8,right:20,left:-8,bottom:60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize:10,fill:"#64748B" }} angle={-20} textAnchor="end" axisLine={false} tickLine={false} />
          <YAxis domain={[0,5]} tick={{ fontSize:11,fill:"#94A3B8" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TT} formatter={(v,n) => [v.toFixed(2), n]} labelFormatter={(_,p) => p[0]?.payload?.fullName||""} />
          <Legend wrapperStyle={{ fontSize:12 }} />
          <Bar dataKey="Youth"    name="Youth (Self-rated)"  fill="#6366F1" radius={[4,4,0,0]} barSize={20} />
          <Bar dataKey="Employer" name="Employer (Expected)" fill="#F97316" radius={[4,4,0,0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// function GapMagnitudeChart({ data }) {
//   const sorted = [...data].sort((a,b) => b.gap - a.gap);
//   return (
//     <div className="cc">
//       <div className="ct">Skill Gap Magnitude</div>
//       <div className="cs">Employer expectation minus youth proficiency</div>
//       <ResponsiveContainer width="100%" height={280}>
//         <BarChart data={sorted} layout="vertical" margin={{ top:4,right:40,left:8,bottom:4 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
//           <XAxis type="number" domain={[0,0.5]} tick={{ fontSize:11,fill:"#94A3B8" }} axisLine={false} tickLine={false} />
//           <YAxis type="category" dataKey="label" width={170} tick={{ fontSize:11,fill:"#475569" }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={TT} formatter={v => [v.toFixed(2),"Gap Score"]} />
//           <ReferenceLine x={0.15} stroke="#E11D48" strokeDasharray="4 4" label={{ value:"Critical threshold",position:"top",fontSize:10,fill:"#E11D48" }} />
//           <Bar dataKey="gap" radius={[0,6,6,0]} barSize={18}>
//             {sorted.map((e,i) => <Cell key={i} fill={e.gap >= 0.15 ? "#E11D48" : e.gap >= 0.08 ? "#F97316" : "#22C55E"} />)}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//       <div style={{ display:"flex",gap:16,marginTop:12,flexWrap:"wrap" }}>
//         {[["#E11D48","≥ 0.15 — Critical"],["#F97316","0.08–0.14 — Moderate"],["#22C55E","< 0.08 — Minimal"]].map(([c,l]) => (
//           <div key={l} style={{ display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#64748B" }}>
//             <span style={{ width:10,height:10,borderRadius:3,background:c,flexShrink:0 }}/>{l}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function SkillRadar({ data }) {
//   const radarData = data.map(d => ({
//     subject: d.label.split(' ')[0], Youth: d.youth, Employer: d.employer,
//   }));
//   return (
//     <div className="cc">
//       <div className="ct">Skill Profile Radar</div>
//       <div className="cs">Youth vs employer across all skill dimensions</div>
//       <ResponsiveContainer width="100%" height={280}>
//         <RadarChart data={radarData}>
//           <PolarGrid stroke="#E2E8F0" />
//           <PolarAngleAxis dataKey="subject" tick={{ fontSize:11,fill:"#64748B" }} />
//           <PolarRadiusAxis domain={[0,5]} tick={{ fontSize:9,fill:"#94A3B8" }} tickCount={4} />
//           <Radar name="Youth"    dataKey="Youth"    stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
//           <Radar name="Employer" dataKey="Employer" stroke="#F97316" fill="#F97316" fillOpacity={0.15} strokeWidth={2} />
//           <Legend wrapperStyle={{ fontSize:12 }} />
//           <Tooltip contentStyle={TT} formatter={v=>[v.toFixed(2)]} />
//         </RadarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// function ConstructsChart({ data }) {
//   const d = [...data].sort((a,b) => a.avg - b.avg);
//   return (
//     <div className="cc" style={{ gridColumn:"1 / -1" }}>
//       <div className="ct">Research Construct Scores (out of 5)</div>
//       <div className="cs">Average Likert scale scores — midpoint = 3.0</div>
//       <ResponsiveContainer width="100%" height={260}>
//         <BarChart data={d} layout="vertical" margin={{ top:4,right:60,left:8,bottom:4 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
//           <XAxis type="number" domain={[0,5]} tick={{ fontSize:11,fill:"#94A3B8" }} axisLine={false} tickLine={false} />
//           <YAxis type="category" dataKey="label" width={190} tick={{ fontSize:11,fill:"#475569" }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={TT} formatter={v=>[v.toFixed(2),"Avg Score"]}
//             content={({ active, payload }) => {
//               if (!active || !payload?.length) return null;
//               const item = data.find(d => d.label === payload[0]?.payload?.label);
//               return (
//                 <div style={{ ...TT, padding:"12px 16px", maxWidth:240 }}>
//                   <div style={{ fontWeight:700,color:"#0F172A",marginBottom:4 }}>{item?.label}</div>
//                   <div style={{ fontSize:11,color:"#64748B",marginBottom:8,lineHeight:1.5 }}>{item?.desc}</div>
//                   <div style={{ fontSize:13,fontWeight:700,color:"#6366F1" }}>Score: {payload[0]?.value?.toFixed(2)} / 5.00</div>
//                 </div>
//               );
//             }}
//           />
//           <ReferenceLine x={3} stroke="#94A3B8" strokeDasharray="4 4" label={{ value:"Midpoint (3.0)",position:"top",fontSize:10,fill:"#94A3B8" }} />
//           <Bar dataKey="avg" radius={[0,6,6,0]} barSize={22}>
//             {d.map((e,i) => <Cell key={i} fill={e.avg >= 3.4 ? "#6366F1" : e.avg >= 3.2 ? "#8B5CF6" : "#A855F7"} />)}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// ── Main Dashboard ────────────────────────────────────────────────
export default function ResearchDashboard() {
  const { isAdmin, authFetch } = useAuth();

  // ── Excel/JSON data 
  const {
    genderData, ageData, educationData, locationData,
    incomeData, activityData, work365Data, workData, yearData,
    total, femaleCount, ruralCount, unemployedCount,
  } = useExcelData();

  // ── Skill gap + constructs still come from your API ──────────────
  const [skillgap, setSkillgap]   = useState(null);
  const [constructs, setConstructs] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState("skillgap");

  // useEffect(() => {
  //   if (!isAdmin) return;
  //   const load = async () => {
  //     try {
  //       setLoading(true);
  //       const [sg, ov] = await Promise.all([
  //         authFetch("/research/skillgap"),
  //         authFetch("/research/overview"),
  //       ]);
  //       if (sg.success) setSkillgap(sg.data);
  //       if (ov.success) setConstructs(ov.data?.constructs);
  //     } catch (err) { console.error(err); }
  //     finally { setLoading(false); }
  //   };
  //   load();
  // }, [isAdmin]);
  useEffect(() => {
  setLoading(false);
}, []);

  if (!isAdmin) return <Locked />;

  const sg     = skillgap?.skillGap;
  const topGap = sg ? [...sg].sort((a,b) => b.gap - a.gap)[0] : null;

  return (
    <div className="rd-root">
      <style>{CSS}</style>

      {/* Header */}
      <div className="rd-header">
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"68px 5vw 0",position:"relative",zIndex:1 }}>
          <div className="rd-crumb">Admin <span>/</span> Dashboards <span>/</span> Research</div>
          <div className="rd-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Primary Survey Data · {total} Respondents
          </div>
          <h1 className="rd-title">Unemployment–Skill Gap<br/>Research </h1>
          <p className="rd-sub">Mapping perceived skill gaps of educated unemployed youth in Goa · NITI Aayog SSM 2025-26</p>
        </div>
      </div>

      <div className="rd-body">
        <br />
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 5vw 60px" }}>

          {/* KPI Cards — counts now come from Excel data directly */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginTop:-28,marginBottom:32 }}>
            {[
              { label:"Total Respondents",       value: total,           color:"#6366F1",
                iconPath:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
            //   { label:"Actively Unemployed",     value: unemployedCount,  color:"#E11D48",
            //     iconPath:<><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> },
             //{
//   label: "Employment Rate",
//   value: total ? (((total - unemployedCount) / total) * 100).toFixed(1) + "%" : "—",
//   color: "#10B981",
//   isText: true,
//   iconPath: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>
// },
,
              { label:"Avg Skill Score (Youth)", value: sg ? (sg.reduce((a,b)=>a+b.youth,0)/sg.length).toFixed(2) : "—", color:"#8B5CF6", isText:true,
                iconPath:<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></> },
              { label:"Rural Respondents",       value: ruralCount,       color:"#22C55E",
                iconPath:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
                {
  label: "Urban Respondents",
  value: total - ruralCount,
  color: "#0EA5E9",
  iconPath: <><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/></>
},
              { label:"Female Respondents",      value: femaleCount,      color:"#EC4899",
                iconPath:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
                {
  label: "Male Respondents",
  value: total - femaleCount,
  color: "#3B82F6",
  iconPath: <><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>
}
            ].map((c,i) => (
              <div key={i}
                style={{ background:"white",borderRadius:20,padding:"22px 24px",border:"1.5px solid #E2E8F0",transition:"all .3s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 16px 40px ${c.color}18`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{ width:44,height:44,borderRadius:12,background:c.color+"15",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.iconPath}</svg>
                </div>
                <div style={{ fontFamily:c.isText?"'Plus Jakarta Sans',sans-serif":"'Fraunces',serif",fontSize:c.isText?18:34,fontWeight:800,color:c.color,lineHeight:1,marginBottom:6 }}>{c.value}</div>
                <div style={{ fontSize:13,fontWeight:600,color:"#64748B" }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex",gap:10,marginBottom:24,flexWrap:"wrap" }}>
            {[
            //   ["skillgap",     "Skill Gap Analysis"],
              ["demographics", "Demographics"],
            //   ["constructs",   "Research Constructs"],
            ].map(([id,label]) => (
              <button key={id} className={`tab${tab===id?" active":""}`} onClick={() => setTab(id)}>{label}</button>
            ))}
          </div>

          {/* ── Skill Gap Tab — still from API ── */}
          {/* {tab === "skillgap" && (
            loading ? (
              <div className="rd-loading"><div className="rd-spinner"/></div>
            ) : sg ? (
              <>
                <div className="rd-sl">Skill Gap Overview</div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:16 }}>
                  <SkillGapChart data={sg} />
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginBottom:32 }}>
                  <GapMagnitudeChart data={sg} />
                  <SkillRadar data={sg} />
                </div>
                <div className="rd-sl">Detailed Skill Gap Table</div>
                <div className="cc" style={{ marginBottom:32 }}>
                  <div className="ct">Skill-by-skill Comparison</div>
                  <div className="cs">Youth self-assessment vs employer expectation · Scale 1–5</div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                      <thead>
                        <tr style={{ borderBottom:"2px solid #F1F5F9" }}>
                          {["Skill Category","Youth Score","Employer Score","Gap","Severity"].map(h => (
                            <th key={h} style={{ padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:".06em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...sg].sort((a,b) => b.gap - a.gap).map((row,i) => {
                          const sev = row.gap >= 0.15 ? {label:"Critical",bg:"#FFF1F2",c:"#E11D48"} : row.gap >= 0.08 ? {label:"Moderate",bg:"#FFF7ED",c:"#F97316"} : {label:"Minimal",bg:"#F0FDF4",c:"#16A34A"};
                          return (
                            <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                              onMouseLeave={e=>e.currentTarget.style.background="white"}>
                              <td style={{ padding:"12px",fontWeight:600,color:"#0F172A" }}>{row.label}</td>
                              <td style={{ padding:"12px" }}>
                                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                                  <div style={{ flex:1,height:6,borderRadius:100,background:"#F1F5F9",overflow:"hidden" }}>
                                    <div style={{ height:"100%",width:`${(row.youth/5)*100}%`,background:"#6366F1",borderRadius:100 }}/>
                                  </div>
                                  <span style={{ fontSize:12,fontWeight:700,color:"#6366F1",width:32,textAlign:"right" }}>{row.youth}</span>
                                </div>
                              </td>
                              <td style={{ padding:"12px" }}>
                                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                                  <div style={{ flex:1,height:6,borderRadius:100,background:"#F1F5F9",overflow:"hidden" }}>
                                    <div style={{ height:"100%",width:`${(row.employer/5)*100}%`,background:"#F97316",borderRadius:100 }}/>
                                  </div>
                                  <span style={{ fontSize:12,fontWeight:700,color:"#F97316",width:32,textAlign:"right" }}>{row.employer}</span>
                                </div>
                              </td>
                              <td style={{ padding:"12px",fontWeight:700,color:sev.c }}>+{row.gap.toFixed(2)}</td>
                              <td style={{ padding:"12px" }}>
                                <span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:sev.bg,color:sev.c }}>{sev.label}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : <p style={{ color:"#94A3B8",fontSize:14 }}>No skill gap data available.</p>
          )} */}

          {/* ── Demographics Tab — 100% from Excel/JSON, zero API ── */}
          {tab === "demographics" && (
            <>
              <div className="rd-sl">Survey Demographics</div>
  <button
    onClick={downloadChartsZip}
    style={{
      padding:"10px 18px",
      borderRadius:999,
      border:"1.5px solid #E2E8F0",
      background:"white",
      fontWeight:700,
      cursor:"pointer"
    }}
  >
    ⬇ Download Charts (ZIP)
  </button>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(420px,1fr))",gap:16,marginBottom:32 }}>

                <div className="cc">
                  <div className="ct">Gender Distribution</div>
                  <div className="cs">Survey respondents by gender</div>
                  <GenderChart data={genderData} />
                </div>

                <div className="cc">
                  <div className="ct">Age Distribution</div>
                  <div className="cs">Unemployed youth by age group</div>
                  <AgeChart data={ageData} />
                </div>

                <div className="cc">
                  <div className="ct">Education Level</div>
                  <div className="cs">Highest qualification of respondents</div>
                  <EducationChart data={educationData} />
                </div>

                <div className="cc">
                  <div className="ct">Urban vs Rural</div>
                  <div className="cs">Geographic distribution of respondents</div>
                  <LocationChart data={locationData} />
                </div>

                <div className="cc">
                  <div className="ct">Family Income Distribution</div>
                  <div className="cs">Monthly household income (₹)</div>
                  <IncomeChart data={incomeData} />
                </div>

                <div className="cc">
                  <div className="ct">Main Activity Status</div>
                  <div className="cs">Primary occupation category of respondents</div>
                  <ActivityChart data={activityData} />
                </div>

                <div className="cc">
                  <div className="ct">Worked Full Year (365 days)</div>
                  <div className="cs">Whether respondent worked continuously for a year</div>
                  <Work365Chart data={work365Data} />
                </div>

                <div className="cc">
                  <div className="ct">Employment Status</div>
                  <div className="cs">Current labour market status of respondents</div>
                  <WorkChart data={workData} />
                </div>

                <div className="cc" style={{ gridColumn:"1 / -1" }}>
                  <div className="ct">Respondents by Year</div>
                  <div className="cs">Survey / graduation year trend</div>
                  <YearChart data={yearData} />
                </div>

              </div>
            </>
          )}

          {/* ── Constructs Tab — from API ── */}
          {/* {tab === "constructs" && (
            loading ? (
              <div className="rd-loading"><div className="rd-spinner"/></div>
            ) : constructs ? (
              <>
                <div className="rd-sl">Research Model Constructs</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr",gap:16,marginBottom:16 }}>
                  <ConstructsChart data={constructs} />
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:32 }}>
                  {constructs.map((c,i) => (
                    <div key={i} className="cc" style={{ transition:"all .3s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366F1";e.currentTarget.style.boxShadow="0 8px 24px rgba(99,102,241,.1)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.boxShadow="none";}}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                        <div>
                          <div style={{ fontSize:11,fontWeight:700,color:"#6366F1",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4 }}>{c.key}</div>
                          <div style={{ fontSize:15,fontWeight:700,color:"#0F172A" }}>{c.label}</div>
                        </div>
                        <div style={{ fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:800,color:c.avg>=3.4?"#6366F1":c.avg>=3.2?"#8B5CF6":"#A855F7" }}>{c.avg}</div>
                      </div>
                      <p style={{ fontSize:12,color:"#64748B",lineHeight:1.6,marginBottom:16 }}>{c.desc}</p>
                      <div style={{ height:8,borderRadius:100,background:"#F1F5F9",overflow:"hidden" }}>
                        <div style={{ height:"100%",width:`${(c.avg/5)*100}%`,background:"linear-gradient(90deg,#6366F1,#8B5CF6)",borderRadius:100 }}/>
                      </div>
                      <div style={{ display:"flex",justifyContent:"space-between",marginTop:6 }}>
                        <span style={{ fontSize:10,color:"#CBD5E1" }}>0</span>
                        <span style={{ fontSize:10,color:"#CBD5E1" }}>5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : <p style={{ color:"#94A3B8",fontSize:14 }}>No constructs data available.</p>
          )} */}

        </div>
      </div>
    </div>
  );
}



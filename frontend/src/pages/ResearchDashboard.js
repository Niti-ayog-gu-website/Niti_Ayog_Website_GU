

// //below gautamis integrated full piechart

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useExcelData } from "../hooks/useExcelData";
import { downloadChartsZip } from "../utils/downloadChartsZip";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

// ── CSS ───────────────────────────────────────────────────────────
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
  .rd-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
  .rd-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#6366F1,#F97316);}
  .cc{background:white;border-radius:20px;padding:24px;border:1.5px solid #E2E8F0;box-shadow:0 1px 4px rgba(15,23,42,.04);}
  .ct{font-size:14px;font-weight:700;color:#0F172A;margin-bottom:2px;}
  .cs{font-size:11px;color:#94A3B8;margin-bottom:6px;}
  .ctotal{font-size:12px;color:#64748B;margin-bottom:16px;}
  .tab{padding:8px 18px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;border:1.5px solid #E2E8F0;background:white;color:#64748B;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s;}
  .tab.active{background:#6366F1;color:white;border-color:#6366F1;}
  .tab:hover:not(.active){border-color:#6366F1;color:#6366F1;}
`;

// ── Colour palette (matches Dashboard.js) ────────────────────────
const COLORS = [
  "#4F46E5","#06B6D4","#10B981","#F59E0B","#EF4444",
  "#8B5CF6","#EC4899","#14B8A6","#F97316","#3B82F6","#84CC16","#6366F1"
];

const TT_STYLE = {
  background:"#ffffff", border:"1px solid #e2e8f0", borderRadius:"12px",
  padding:"10px 14px", boxShadow:"0 8px 24px rgba(15,23,42,.08)",
  fontSize:12, fontFamily:"'Plus Jakarta Sans',sans-serif",
};

// ── Normalise any data shape → [{ name, value }] ─────────────────
function normalise(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(r => ({
      name:  String(r.name ?? r._id ?? r.label ?? "—"),
      value: Number(r.value ?? r.count ?? r.total ?? 0),
    }))
    .filter(r => r.name && r.value > 0);
}

// ── Custom tooltip ────────────────────────────────────────────────
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

// ── Outer percentage label ────────────────────────────────────────
function PieLabel({ percent, cx, cy, midAngle, outerRadius }) {
  if (!percent || percent < 0.04) return null;
  const R  = Math.PI / 180;
  const r  = outerRadius + 22;
  const x  = cx + r * Math.cos(-midAngle * R);
  const y  = cy + r * Math.sin(-midAngle * R);
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
      <div className="ctotal">Total: <strong>{total}</strong></div>

      {data.length === 0 ? (
        <div style={{ color:"#94A3B8", fontSize:13, padding:"40px 0", textAlign:"center" }}>
          No data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data} dataKey="value" nameKey="name"
                cx="50%" cy="46%"
                outerRadius={95} innerRadius={44}
                label={PieLabel} labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:14 }}>
            {data.map((item, i) => (
              <div key={item.name}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:COLORS[i % COLORS.length], flexShrink:0 }} />
                  <span style={{ color:"#475569", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {item.name}
                  </span>
                </div>
                <span style={{ fontWeight:700, color:"#0F172A", marginLeft:12, flexShrink:0 }}>
                  {item.value} ({total ? ((item.value / total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── BarCard (horizontal or vertical) ─────────────────────────────
function BarCard({ title, subtitle, rawData, layout = "horizontal" }) {
  const data  = normalise(rawData);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="cc">
      <div className="ct">{title}</div>
      <div className="cs">{subtitle}</div>
      <div className="ctotal">Total: <strong>{total}</strong></div>

      {data.length === 0 ? (
        <div style={{ color:"#94A3B8", fontSize:13, padding:"40px 0", textAlign:"center" }}>
          No data available
        </div>
      ) : layout === "horizontal" ? (
        // Horizontal bars — Age, Income
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 42)}>
          <BarChart data={data} layout="vertical" margin={{ top:4, right:52, left:8, bottom:4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={168}
              tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TT_STYLE} />
            <Bar dataKey="value" radius={[0,6,6,0]} barSize={24}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        // Vertical bars with angled labels — Year trend (full width)
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top:8, right:8, left:-8, bottom:52 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize:10, fill:"#64748B" }}
              angle={-35} textAnchor="end" axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TT_STYLE} />
            <Bar dataKey="value" radius={[4,4,0,0]} fill="#4F46E5" barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ── Locked screen ─────────────────────────────────────────────────
function Locked() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", background:"#F1F5F9",
      fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:24,
          background:"linear-gradient(135deg,#EEF2FF,#E0E7FF)",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", border:"2px solid rgba(99,102,241,.2)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:800,
          color:"#0F172A", marginBottom:8 }}>Admin Access Required</h2>
        <p style={{ fontSize:14, color:"#64748B" }}>
          Please log in to view the research dashboard.
        </p>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function ResearchDashboard() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState("demographics");

  const {
    genderData, ageData, educationData, locationData,
    incomeData, activityData, work365Data, workData, yearData,
    total, femaleCount, ruralCount, unemployedCount,
  } = useExcelData();

  if (!isAdmin) return <Locked />;

  const maleCount   = total - femaleCount;
  const urbanCount  = total - ruralCount;

  return (
    <div className="rd-root">
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div className="rd-header">
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"68px 5vw 0",
          position:"relative", zIndex:1 }}>
          <div className="rd-crumb">
            Admin <span>/</span> Dashboards <span>/</span> Research
          </div>
          <div className="rd-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Primary Survey Data · {total} Respondents
          </div>
          <h1 className="rd-title">Unemployment–Skill Gap<br/>Research</h1>
          <p className="rd-sub">
            Mapping perceived skill gaps of educated unemployed youth in Goa · NITI Aayog SSM 2025-26
          </p>
        </div>
      </div>

      <div className="rd-body">
        <br />
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 5vw 60px" }}>

          {/* ── KPI Cards ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",
            gap:14, marginTop:-28, marginBottom:32 }}>
            {[
              { label:"Total Respondents",     value:total,           color:"#6366F1",
                icon:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
              { label:"Unemployed (Seeking)",  value:unemployedCount, color:"#E11D48",
                icon:<><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> },
              { label:"Rural Respondents",     value:ruralCount,      color:"#22C55E",
                icon:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
              { label:"Urban Respondents",     value:urbanCount,      color:"#0EA5E9",
                icon:<><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/></> },
              { label:"Female Respondents",    value:femaleCount,     color:"#EC4899",
                icon:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
              { label:"Male Respondents",      value:maleCount,       color:"#3B82F6",
                icon:<><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></> },
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
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:34, fontWeight:800,
                  color:c.color, lineHeight:1, marginBottom:6 }}>{c.value}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#64748B" }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* ── Tab bar + Download ── */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:12, marginBottom:24 }}>
            <div style={{ display:"flex", gap:10 }}>
              <button
                className={`tab${tab === "demographics" ? " active" : ""}`}
                onClick={() => setTab("demographics")}>
                Demographics
              </button>
            </div>
            <button
              onClick={downloadChartsZip}
              style={{ display:"inline-flex", alignItems:"center", gap:8,
                padding:"8px 18px", borderRadius:100, border:"1.5px solid #E2E8F0",
                background:"white", fontSize:13, fontWeight:700, cursor:"pointer",
                color:"#0F172A", fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#6366F1"; e.currentTarget.style.color="#6366F1"; }}
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

          {/* ── Demographics Tab ── */}
          {tab === "demographics" && (
            <>
              <div className="rd-sl">Survey Demographics</div>
              <div style={{ display:"grid",
                gridTemplateColumns:"repeat(auto-fit,minmax(420px,1fr))",
                gap:20, marginBottom:32 }}>

                {/* Row 1 */}
                <PieChartCard
                  title="Gender Distribution"
                  subtitle="Distribution by gender"
                  rawData={genderData} />

                <PieChartCard
                  title="Age Distribution"
                  subtitle="Distribution by age group"
                  rawData={ageData} />

                {/* Row 2 */}
                <PieChartCard
                  title="Education Level"
                  subtitle="Distribution by education level"
                  rawData={educationData} />

                <PieChartCard
                  title="Income Distribution"
                  subtitle="Distribution by income band"
                  rawData={incomeData} />

                {/* Row 3 */}
                <PieChartCard
                  title="Location"
                  subtitle="Distribution by location"
                  rawData={locationData} />

                <PieChartCard
                  title="Main Activity"
                  subtitle="Distribution by main activity"
                  rawData={activityData} />

                {/* Row 4 */}
                <PieChartCard
                  title="Worked 365 Days"
                  subtitle="Worked in last 365 days"
                  rawData={work365Data} />

                <PieChartCard
                  title="Last 7 Day Status"
                  subtitle="Status in the last 7 days"
                  rawData={workData} />

                {/* Row 5 — full width year trend */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <BarCard
                    title="Respondents by Year"
                    subtitle="Survey / graduation year trend"
                    rawData={yearData}
                    layout="vertical-x" />
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { useAuth, BASE_URL } from "../context/AuthContext";
import DataTable, { Badge } from "../components/DataTable";
import * as XLSX from "xlsx";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

// ── Category normalizer ───────────────────────────────────────────
const normalizeCategory = (raw) => {
  if (!raw) return "Unknown";

  const v = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  // GENERAL
  if (
    [
      "general",
      "general/unreserved",
      "unreserved",
      "ur",
      "gneral/unreserved",
      "general/ unreserved",
      "open",
      "open/general"
    ].includes(v)
  ) {
    return "General";
  }

  // OBC
  if (
    [
      "obc-ncl",
      "obc ncl",
      "other backward class",
      "obc",
      "obc-nc",
      "other backward caste",
      "obc(ncl)",
      "obc - ncl"
    ].includes(v)
  ) {
    return "OBC";
  }

  // ST
  if (
    [
      "scheduled tribe",
      "scheduled tribe (st)",
      "st",
      "s.t.",
      "tribal",
      "schedule tribe"
    ].includes(v)
  ) {
    return "ST";
  }

  // SC
  if (
    [
      "scheduled caste",
      "scheduled caste (sc)",
      "sc",
      "s.c.",
      "schedule caste"
    ].includes(v)
  ) {
    return "SC";
  }

  // EWS
  if (
    [
      "ews",
      "e.w.s.",
      "economically weaker section",
      "economically weaker sections",
      "economically weaker section (ews)",
      "economically weak sec",
      "economically weaker"
    ].includes(v)
  ) {
    return "EWS";
  }

  // PWD
  if (
    [
      "pwd",
      "person with disability",
      "person with disabilities",
      "person with disability/pwd",
      "person with disabilities/pwd",
      "divyang",
      "physically handicapped",
      "ph",
      "differently abled"
    ].includes(v)
  ) {
    return "PWD";
  }

  // NT / VJNT
  if (
    [
      "nt",
      "nomadic tribe",
      "nomadic tribes",
      "denotified tribe",
      "vjnt"
    ].includes(v)
  ) {
    return "NT/VJNT";
  }

  // SBC
  if (
    [
      "sbc",
      "special backward class",
      "special backward caste"
    ].includes(v)
  ) {
    return "SBC";
  }

  return raw.trim();
};
const GENDER_COLORS  = ["#6366F1","#22D3EE","#F472B6"];
const CAT_COLORS     = ["#6366F1","#F97316","#10B981","#F59E0B","#EF4444","#8B5CF6","#0EA5E9","#EC4899"];
const PROG_COLORS    = ["#6366F1","#22D3EE","#F97316","#10B981","#F59E0B","#EF4444","#8B5CF6","#0EA5E9","#EC4899","#14B8A6"];
const BATCH_COLOR    = "#6366F1";

// ── Reusable chart card shell — compact preview, expands on hover ───
function ChartCard({ title, subtitle, total, previewHeight = 160, fullHeight = 420, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        border: `1.5px solid ${hovered ? "#6366F1" : "#E2E8F0"}`,
        borderRadius: 20,
        padding: "20px 24px",
        transition: "border-color .3s, box-shadow .3s, transform .3s",
        boxShadow: hovered ? "0 20px 60px rgba(99,102,241,.15)" : "none",
        transform: hovered ? "translateY(-3px)" : "none",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
        <div>
          <div style={{ fontSize:14,fontWeight:800,color:"#0F172A",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{title}</div>
          {subtitle && <div style={{ fontSize:11,color:"#94A3B8",marginTop:2 }}>{subtitle}</div>}
          {total !== undefined && (
            <div style={{ fontSize:11,color:"#64748B",marginTop:2 }}>
              Total: <strong style={{ color:"#0F172A" }}>{total}</strong>
            </div>
          )}
        </div>
        <span style={{
          fontSize:10,fontWeight:700,letterSpacing:".04em",
          color: hovered ? "#6366F1" : "#94A3B8",
          background: hovered ? "#EEF2FF" : "#F8FAFC",
          padding:"3px 9px", borderRadius:100,
          transition:"all .25s", whiteSpace:"nowrap", flexShrink:0,
          fontFamily:"'Plus Jakarta Sans',sans-serif",
        }}>
          {hovered ? "▲ less" : "hover for more"}
        </span>
      </div>

      {/* Chart — animates between preview and full height */}
      <div style={{
        height: hovered ? fullHeight : previewHeight,
        overflow: "hidden",
        transition: "height .4s cubic-bezier(.22,1,.36,1)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Custom legend row ─────────────────────────────────────────────
function LegendRow({ name, value, total, color }) {
  const pct = total ? ((value / total) * 100).toFixed(1) : 0;
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #F8FAFC" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
        <span style={{ width:10,height:10,borderRadius:"50%",background:color,flexShrink:0,display:"inline-block" }}/>
        <span style={{ fontSize:13,color:"#475569",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{name}</span>
      </div>
      <span style={{ fontSize:13,fontWeight:700,color:"#0F172A",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        {value} <span style={{ color:"#94A3B8",fontWeight:400 }}>({pct}%)</span>
      </span>
    </div>
  );
}

// ── Custom donut label ────────────────────────────────────────────
const renderDonutLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5 + 16;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#0F172A" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize:12, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

// ── Charts component ──────────────────────────────────────────────
function GUCharts({ records }) {
  const total = records.length;

  // 1. Gender
  const genderMap = {};
  records.forEach(r => {
    const g = r.gender || "Unknown";
    genderMap[g] = (genderMap[g] || 0) + 1;
  });
  const genderData = Object.entries(genderMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 2. Category (skip Unknown)
const catMap = {};

records.forEach(r => {
  const c = normalizeCategory(r.category);

  if (c === "Unknown") return;

  catMap[c] = (catMap[c] || 0) + 1;
});
  const catData = Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 3. Top 10 programmes (horizontal bar)
  const progMap = {};
  records.forEach(r => {
    const p = (r.programme || "Unknown").trim();
    progMap[p] = (progMap[p] || 0) + 1;
  });
  const progData = Object.entries(progMap)
    .map(([name, value]) => ({ name: name.length > 32 ? name.slice(0, 30) + "…" : name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 4. Batch-wise enrollment (bar)
  const batchMap = {};
  records.forEach(r => {
    const b = (r.admission_batch || "Unknown").trim();
    batchMap[b] = (batchMap[b] || 0) + 1;
  });
  const batchData = Object.entries(batchMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const customTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    const pct = total ? ((value / total) * 100).toFixed(1) : 0;
    return (
      <div style={{ background:"white",border:"1.5px solid #E2E8F0",borderRadius:12,padding:"10px 16px",boxShadow:"0 8px 24px rgba(15,23,42,.1)",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <div style={{ fontSize:13,fontWeight:700,color:"#0F172A",marginBottom:3 }}>{name}</div>
        <div style={{ fontSize:13,color:"#4F46E5",fontWeight:800 }}>{value} students</div>
        <div style={{ fontSize:11,color:"#94A3B8" }}>{pct}% of total</div>
      </div>
    );
  };

  const barTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"white",border:"1.5px solid #E2E8F0",borderRadius:12,padding:"10px 16px",boxShadow:"0 8px 24px rgba(15,23,42,.1)",fontFamily:"'Plus Jakarta Sans',sans-serif",maxWidth:260 }}>
        <div style={{ fontSize:12,fontWeight:700,color:"#0F172A",marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:13,color:"#4F46E5",fontWeight:800 }}>{payload[0].value} students</div>
      </div>
    );
  };

  return (
    <div>
      {/* Row 1 — Gender + Category donuts */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:16,marginBottom:16 }}>

        {/* Gender donut */}
        <ChartCard title="Gender Distribution" subtitle="Distribution by gender" total={total}
          previewHeight={200} fullHeight={420}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                dataKey="value" labelLine={false} label={renderDonutLabel}>
                {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop:8 }}>
            {genderData.map((d, i) => (
              <LegendRow key={d.name} name={d.name} value={d.value} total={total} color={GENDER_COLORS[i % GENDER_COLORS.length]} />
            ))}
          </div>
        </ChartCard>

        {/* Category donut */}
<ChartCard
  title="Category Distribution"
  subtitle="Distribution by reservation category"
  total={total}
  previewHeight={560}
  fullHeight={560}>
            <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                dataKey="value" labelLine={false} label={renderDonutLabel}>
                {catData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop:8 }}>
            {catData.map((d, i) => (
              <LegendRow key={d.name} name={d.name} value={d.value} total={total} color={CAT_COLORS[i % CAT_COLORS.length]} />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Row 2 — Top Programmes + Batch Enrollment */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:16,marginBottom:16 }}>

        {/* Top programmes horizontal bar */}
        <ChartCard title="Top 10 Programmes" subtitle="By number of enrolled students"
          previewHeight={160} fullHeight={340}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={progData} layout="vertical" margin={{ top:0,right:16,bottom:0,left:8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize:11,fill:"#94A3B8",fontFamily:"'Plus Jakarta Sans',sans-serif" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={160}
                tick={{ fontSize:11,fill:"#475569",fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                axisLine={false} tickLine={false} />
              <Tooltip content={barTooltip} />
              <Bar dataKey="value" radius={[0,6,6,0]}>
                {progData.map((_, i) => <Cell key={i} fill={PROG_COLORS[i % PROG_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Batch-wise enrollment bar */}
        <ChartCard title="Batch-wise Enrollment" subtitle="Number of students per admission batch"
          previewHeight={160} fullHeight={340}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={batchData} margin={{ top:0,right:16,bottom:40,left:0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name"
                tick={{ fontSize:11,fill:"#475569",fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize:11,fill:"#94A3B8",fontFamily:"'Plus Jakarta Sans',sans-serif" }} axisLine={false} tickLine={false} />
              <Tooltip content={barTooltip} />
              <Bar dataKey="value" fill={BATCH_COLOR} radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

// ── CSS ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
  .gu-root{font-family:'Plus Jakarta Sans',sans-serif;}
  .gu-header{background:linear-gradient(135deg,#4F46E5 0%,#4338CA 60%,#1D4ED8 100%);padding:32px 0 56px;position:relative;overflow:hidden;}
  .gu-header::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 80% 50%,rgba(99,102,241,.25) 0%,transparent 50%),radial-gradient(circle at 10% 80%,rgba(255,255,255,.06) 0%,transparent 40%);}
  .gu-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;background:#F1F5F9;clip-path:ellipse(55% 100% at 50% 100%);}
  .gu-crumb{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:10px;display:flex;align-items:center;gap:8px;}
  .gu-crumb span{color:rgba(255,255,255,.35);}
  .gu-title{font-family:'Fraunces',serif;font-size:clamp(28px,4vw,42px);font-weight:800;color:white;line-height:1.1;margin-bottom:8px;}
  .gu-sub{font-size:14px;color:rgba(255,255,255,.65);}
  .gu-body{background:#F1F5F9;min-height:100vh;}
  .gu-sl{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748B;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .gu-sl::before{content:'';width:16px;height:2px;border-radius:2px;background:linear-gradient(90deg,#4F46E5,#1D4ED8);}
  .gu-loading{display:flex;align-items:center;justify-content:center;padding:80px 20px;flex-direction:column;gap:16px;}
  .gu-spinner{width:40px;height:40px;border:3px solid #E2E8F0;border-top-color:#4F46E5;border-radius:50%;animation:guSpin .8s linear infinite;}
  @keyframes guSpin{to{transform:rotate(360deg)}}

  /* ── Header action buttons ── */
  .gu-hdr-btn{padding:8px 20px;border-radius:100px;background:white;border:1.5px solid rgba(255,255,255,.25);font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif;}
  .gu-hdr-btn:hover{background:rgba(255,255,255,.95);transform:translateY(-1px);}
  .gu-hdr-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
  .gu-hdr-btn.primary{background:linear-gradient(135deg,#6366F1,#4F46E5);color:white;border-color:transparent;box-shadow:0 4px 14px rgba(79,70,229,.4);}
  .gu-hdr-btn.primary:hover{box-shadow:0 6px 20px rgba(79,70,229,.5);background:linear-gradient(135deg,#818CF8,#6366F1);}

  /* ── Upload wizard overlay ── */
  .uw-overlay{position:fixed;inset:0;z-index:998;background:rgba(15,23,42,.55);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:uwFade .2s ease both;}
  @keyframes uwFade{from{opacity:0}to{opacity:1}}
  @keyframes uwSlide{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  .uw-card{background:white;border-radius:28px;width:100%;max-width:720px;max-height:90vh;overflow-y:auto;box-shadow:0 40px 100px rgba(15,23,42,.22);animation:uwSlide .3s cubic-bezier(.22,1,.36,1) both;}
  .uw-strip{height:5px;background:linear-gradient(90deg,#4F46E5,#1D4ED8);}
  .uw-body{padding:32px 36px 36px;}
  .uw-title{font-family:'Fraunces',serif;font-size:22px;font-weight:800;color:#0F172A;margin-bottom:4px;}
  .uw-sub{font-size:13px;color:#64748B;margin-bottom:28px;}

  /* Steps indicator */
  .uw-steps{display:flex;align-items:center;gap:0;margin-bottom:32px;}
  .uw-step{display:flex;align-items:center;gap:8px;flex:1;}
  .uw-step-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;transition:all .3s;}
  .uw-step-dot.done{background:#4F46E5;color:white;}
  .uw-step-dot.active{background:#4F46E5;color:white;box-shadow:0 0 0 4px rgba(79,70,229,.18);}
  .uw-step-dot.idle{background:#F1F5F9;color:#94A3B8;border:1.5px solid #E2E8F0;}
  .uw-step-label{font-size:12px;font-weight:700;color:#64748B;}
  .uw-step-label.active{color:#4F46E5;}
  .uw-step-line{flex:1;height:2px;background:#E2E8F0;margin:0 8px;}
  .uw-step-line.done{background:#4F46E5;}

  /* Drop zone */
  .uw-drop{border:2px dashed #C7D2FE;border-radius:20px;padding:48px 32px;text-align:center;transition:all .2s;cursor:pointer;background:#FAFBFF;}
  .uw-drop:hover,.uw-drop.drag{border-color:#4F46E5;background:#EEF2FF;}
  .uw-drop-icon{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#EEF2FF,#E0E7FF);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
  .uw-drop-text{font-size:15px;font-weight:700;color:#0F172A;margin-bottom:6px;}
  .uw-drop-hint{font-size:12px;color:#94A3B8;}
  .uw-file-pill{display:inline-flex;align-items:center;gap:10px;background:#EEF2FF;border:1.5px solid rgba(79,70,229,.2);border-radius:100px;padding:10px 20px;font-size:13px;font-weight:700;color:#4338CA;margin-top:16px;}

  /* Mapping table */
  .uw-map-table{width:100%;border-collapse:collapse;font-size:13px;}
  .uw-map-table th{padding:10px 12px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94A3B8;background:#F8FAFC;border-bottom:1px solid #F1F5F9;}
  .uw-map-table td{padding:10px 12px;border-bottom:1px solid #F8FAFC;vertical-align:middle;}
  .uw-map-table tr:last-child td{border-bottom:none;}
  .uw-conf-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;}
  .uw-conf-high{background:#DCFCE7;color:#16A34A;}
  .uw-conf-med{background:#FEF9C3;color:#A16207;}
  .uw-conf-none{background:#F1F5F9;color:#94A3B8;}
  .uw-map-select{padding:7px 28px 7px 10px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:12px;font-family:'Plus Jakarta Sans',sans-serif;color:#0F172A;background:white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 8px center;appearance:none;-webkit-appearance:none;outline:none;transition:all .2s;width:100%;}
  .uw-map-select:focus{border-color:#4F46E5;box-shadow:0 0 0 3px rgba(79,70,229,.1);}
  .uw-map-select.mapped{border-color:#4F46E5;background-color:#EEF2FF;color:#4338CA;}
  .uw-map-select.extra{border-color:#F59E0B;background-color:#FFFBEB;color:#92400E;}
  .uw-map-select.ignore{border-color:#E2E8F0;color:#94A3B8;}

  /* Sample rows preview */
  .uw-sample{font-size:11px;color:#94A3B8;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

  /* Result screen */
  .uw-result-stat{display:flex;align-items:center;gap:14px;padding:16px 20px;border-radius:16px;margin-bottom:10px;}
  .uw-result-stat.inserted{background:#F0FDF4;border:1.5px solid rgba(22,163,74,.15);}
  .uw-result-stat.updated{background:#EFF6FF;border:1.5px solid rgba(29,78,216,.15);}
  .uw-result-stat.skipped{background:#FFF7ED;border:1.5px solid rgba(249,115,22,.2);}
  .uw-result-num{font-family:'Fraunces',serif;font-size:28px;font-weight:800;line-height:1;}
  .uw-result-label{font-size:13px;font-weight:600;color:#475569;}

  /* Wizard action buttons */
  .uw-actions{display:flex;gap:10px;margin-top:24px;justify-content:flex-end;}
  .uw-btn{padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
  .uw-btn.primary{background:linear-gradient(135deg,#6366F1,#4F46E5);color:white;border:none;box-shadow:0 6px 18px rgba(79,70,229,.3);}
  .uw-btn.primary:hover{box-shadow:0 8px 24px rgba(79,70,229,.4);transform:translateY(-1px);}
  .uw-btn.primary:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none;}
  .uw-btn.secondary{background:white;color:#475569;border:1.5px solid #E2E8F0;}
  .uw-btn.secondary:hover{background:#F8FAFC;color:#0F172A;}
  .uw-btn.danger{background:white;color:#E11D48;border:1.5px solid rgba(225,29,72,.25);}
  .uw-btn.danger:hover{background:#FFF1F2;}

  /* Error list */
  .uw-errors{margin-top:16px;max-height:160px;overflow-y:auto;border:1px solid #FED7AA;border-radius:12px;padding:12px 16px;background:#FFF7ED;}
  .uw-error-item{font-size:12px;color:#C2410C;padding:3px 0;border-bottom:1px solid #FEE2B3;}
  .uw-error-item:last-child{border-bottom:none;}

  /* Extra fields saved notice */
  .uw-extra-notice{margin-top:12px;padding:12px 16px;background:#FFFBEB;border:1.5px solid rgba(245,158,11,.25);border-radius:12px;font-size:12px;color:#92400E;}
  .uw-extra-tag{display:inline-block;padding:2px 8px;background:#FEF3C7;border-radius:100px;font-size:11px;font-weight:600;color:#B45309;margin:2px;}

  /* Modal for record detail */
  .mo{position:fixed;inset:0;z-index:999;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:moF .2s ease both;}
  @keyframes moF{from{opacity:0}to{opacity:1}}
  @keyframes moS{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  .mo-card{background:white;border-radius:24px;width:100%;max-width:580px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(15,23,42,.18);animation:moS .28s cubic-bezier(.22,1,.36,1) both;}
  .mo-strip{height:5px;background:linear-gradient(90deg,#4F46E5,#1D4ED8);}
  .mo-body{padding:28px 32px 32px;}
  .mo-sec{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94A3B8;margin:22px 0 12px;display:flex;align-items:center;gap:10px;}
  .mo-sec::after{content:'';flex:1;height:1px;background:#F1F5F9;}
  .mo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .mo-f{background:#F8FAFC;border-radius:12px;padding:12px 16px;}
  .mo-fl{font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
  .mo-fv{font-size:14px;font-weight:600;color:#0F172A;}
  .mo-close{width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;background:white;color:#475569;border:1.5px solid #E2E8F0;cursor:pointer;transition:all .2s;margin-top:20px;}
  .mo-close:hover{background:#F8FAFC;color:#0F172A;}

  /* Category badges */
  .cat-General{background:#EFF6FF;color:#1D4ED8;border:1px solid rgba(29,78,216,.15);}
  .cat-OBC{background:#FFF7ED;color:#C2410C;border:1px solid rgba(194,65,12,.15);}
  .cat-SC{background:#F5F3FF;color:#7C3AED;border:1px solid rgba(124,58,237,.15);}
  .cat-ST{background:#F0FDF4;color:#16A34A;border:1px solid rgba(22,163,74,.15);}
  .cat-EWS{background:#FFF7ED;color:#B45309;border:1px solid rgba(180,83,9,.15);}
  .cat-NT{background:#F0FDF4;color:#0F766E;border:1px solid rgba(13,148,136,.15);}
  .cat-OBC-NC{background:#FFF7ED;color:#C2410C;border:1px solid rgba(194,65,12,.15);}
  .cat-SBC{background:#F5F3FF;color:#7C3AED;border:1px solid rgba(124,58,237,.15);}
`;

// ── Badge helpers ──────────────────────────────────────────────────
function CatBadge({ val }) {
  const key = (val || "").replace(/\s+/g, "-");
  return (
    <span className={`stag cat-${key}`}
      style={{ display:"inline-flex",padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:600,margin:2 }}>
      {val || "—"}
    </span>
  );
}

function GenderBadge({ val }) {
  const palette = {
    Male:   { bg:"#EFF6FF", c:"#1D4ED8" },
    Female: { bg:"#FDF4FF", c:"#9333EA" },
    Other:  { bg:"#F8FAFC", c:"#475569" },
  };
  const s = palette[val] || { bg:"#F8FAFC", c:"#64748B" };
  return val
    ? <span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100,background:s.bg,color:s.c }}>{val}</span>
    : <span style={{ color:"#CBD5E1",fontSize:12 }}>—</span>;
}

// ── Locked screen ──────────────────────────────────────────────────
function Locked() {
  return (
    <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F1F5F9",paddingTop:80,fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#EEF2FF,#E0E7FF)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",border:"2px solid rgba(79,70,229,.15)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 style={{ fontFamily:"'Fraunces',serif",fontSize:24,fontWeight:800,color:"#0F172A",marginBottom:8 }}>Admin Access Required</h2>
        <p style={{ fontSize:14,color:"#64748B" }}>Please log in to view the GU Students dashboard.</p>
      </div>
    </div>
  );
}

// ── Record detail modal ────────────────────────────────────────────
function RecordModal({ record, onClose }) {
  if (!record) return null;
  const extraFields = record.extra_fields
    ? Object.entries(record.extra_fields instanceof Map
        ? Object.fromEntries(record.extra_fields)
        : record.extra_fields)
    : [];

  return (
    <div className="mo" onClick={onClose}>
      <div className="mo-card" onClick={e => e.stopPropagation()}>
        <div className="mo-strip" />
        <div className="mo-body">
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:4 }}>
            <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#4F46E5,#1D4ED8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"white",flexShrink:0 }}>
              {(record.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:800,color:"#0F172A" }}>{record.name}</div>
              <div style={{ fontSize:13,color:"#64748B",marginTop:2 }}>
                {[record.enrollment_no, record.programme, record.admission_batch].filter(Boolean).join(" · ")}
              </div>
            </div>
            {record.category && <CatBadge val={record.category} />}
          </div>

          <div className="mo-sec">Enrollment Details</div>
          <div className="mo-grid">
            {[
              ["Full Name",      record.name || "—"],
              ["Enrollment No.", record.enrollment_no || "—"],
              ["Roll Number",    record.roll_number || "—"],
              ["Admission Batch",record.admission_batch || "—"],
              ["Programme Code", record.programme_code || "—"],
              ["Programme",      record.programme || "—"],
              ["OU Name",        record.ou_name || "—"],
              ["Validity Start", record.validity_start || "—"],
              ["Category",       record.category || "—"],
              ["Gender",         record.gender || "—"],
              ["PWD Applicable", record.pwd_applicable || "—"],
            ].map(([l, v]) => (
              <div key={l} className="mo-f">
                <div className="mo-fl">{l}</div>
                <div className="mo-fv">{v}</div>
              </div>
            ))}
          </div>

          {extraFields.length > 0 && (
            <>
              <div className="mo-sec">Additional Fields</div>
              <div className="mo-grid">
                {extraFields.map(([k, v]) => (
                  <div key={k} className="mo-f">
                    <div className="mo-fl">{k}</div>
                    <div className="mo-fv">{v || "—"}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <button className="mo-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Stat cards config ──────────────────────────────────────────────
function buildStatCards(records) {
  const programmes = [...new Set(records.map(r => r.programme).filter(Boolean))];
  const batches    = [...new Set(records.map(r => r.admission_batch).filter(Boolean))];
  return [
    {
      label: "Total Records", value: records.length, color: "#4F46E5",
      iconPath: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    },
    {
      label: "Programmes", value: programmes.length, color: "#0891B2",
      iconPath: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    },
    {
      label: "Batches", value: batches.length, color: "#7C3AED",
      iconPath: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    },
    {
      label: "PWD Students", value: records.filter(r => (r.pwd_applicable || "").toLowerCase() === "yes").length, color: "#0D9488",
      iconPath: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>,
    },
  ];
}

// ── Table columns ──────────────────────────────────────────────────
const COLUMNS = [
  { key:"enrollment_no", label:"Enroll No.",  render:v=><span style={{ fontSize:12,fontFamily:"monospace",color:"#4F46E5",fontWeight:700 }}>{v||"—"}</span> },
  { key:"name",          label:"Name",        render:v=><span style={{ fontWeight:700,color:"#0F172A" }}>{v||"—"}</span> },
  { key:"roll_number",   label:"Roll No.",    render:v=><span style={{ fontSize:12,color:"#475569" }}>{v||"—"}</span> },
  { key:"admission_batch",label:"Batch",      render:v=><span style={{ fontSize:12,fontWeight:600,color:"#0891B2" }}>{v||"—"}</span> },
  { key:"programme_code",label:"Prog. Code",  render:v=><span style={{ fontSize:11,fontFamily:"monospace",color:"#475569" }}>{v||"—"}</span> },
  { key:"programme",     label:"Programme",   render:v=><span style={{ fontSize:12,color:"#475569",maxWidth:160,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }} title={v}>{v||"—"}</span> },
  { key:"ou_name",       label:"OU Name",     render:v=><span style={{ fontSize:12,color:"#475569" }}>{v||"—"}</span> },
  { key:"category",      label:"Category",    render:v=>v?<CatBadge val={v}/>:<span style={{color:"#CBD5E1"}}>—</span> },
  { key:"gender",        label:"Gender",      render:v=><GenderBadge val={v}/> },
  { key:"pwd_applicable",label:"PWD",         render:v=>{
    if (!v) return <span style={{color:"#CBD5E1"}}>—</span>;
    const yes = v.toLowerCase()==="yes";
    return <span style={{ fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:100,background:yes?"#DCFCE7":"#F1F5F9",color:yes?"#16A34A":"#94A3B8" }}>{v}</span>;
  }},
];

// ────────────────────────────────────────────────────────────────────
// ── Upload Wizard ──────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────

const EXTRA_FIELD_MARKER = "__extra__";

// The predefined admission fields (mirrors ADMISSION_FIELDS in columnMap.js)
const ADMISSION_TARGET_FIELDS = [
  "name", "enrollment_no", "roll_number", "admission_batch",
  "programme_code", "programme", "ou_name", "validity_start",
  "category", "gender", "pwd_applicable",
];

function UploadWizard({ onClose, onSuccess }) {
  const { authFetch } = useAuth();
  const fileInputRef  = useRef(null);

  const [step,       setStep]       = useState(1); // 1=upload, 2=mapping, 3=result
  const [dragging,   setDragging]   = useState(false);
  const [file,       setFile]       = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [preview,    setPreview]    = useState(null);  // { uploadId, headers, suggestedMapping, sampleRows }
  const [mapping,    setMapping]    = useState({});    // { header: targetField | "__extra__" | null }
  const [confirming, setConfirming] = useState(false);
  const [result,     setResult]     = useState(null);  // { inserted, updated, skipped, errors, extraColumnsSaved }
  const [error,      setError]      = useState("");

  // ── Step 1: handle file pick / drop ─────────────────────────────
  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["xlsx","xls","csv"].includes(ext)) {
      setError("Only .xlsx, .xls or .csv files are allowed.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── Step 1 → 2: upload for preview ──────────────────────────────
  const handlePreview = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const token = localStorage.getItem("skillmap_token");
      const form  = new FormData();
      form.append("file", file);
      form.append("type", "admission");

      const res  = await fetch(
        `${BASE_URL}/upload/preview`,
        { method:"POST", headers:{ Authorization:`Bearer ${token}` }, body:form }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Build initial mapping from suggestions
      const initMap = {};
      data.suggestedMapping.forEach(({ header, suggestedField }) => {
        initMap[header] = suggestedField || EXTRA_FIELD_MARKER;
      });

      setPreview(data);
      setMapping(initMap);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to parse file.");
    } finally {
      setUploading(false);
    }
  };

  // ── Step 2 → 3: confirm mapping ─────────────────────────────────
  const handleConfirm = async () => {
    setConfirming(true);
    setError("");
    try {
      // Convert null-string back to actual null for ignored columns
      const finalMapping = {};
      Object.entries(mapping).forEach(([h, v]) => {
        finalMapping[h] = v === "null" ? null : v;
      });

      const data = await authFetch("/upload/confirm", {
        method: "POST",
        body: JSON.stringify({ uploadId: preview.uploadId, mapping: finalMapping }),
      });
      if (!data.success) throw new Error(data.message);
      setResult(data);
      setStep(3);
    } catch (err) {
      setError(err.message || "Failed to save data.");
    } finally {
      setConfirming(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────
  const confClass = (confidence) => {
    if (confidence === "high")   return "uw-conf-badge uw-conf-high";
    if (confidence === "medium") return "uw-conf-badge uw-conf-med";
    return "uw-conf-badge uw-conf-none";
  };

  const selectClass = (val) => {
    if (!val || val === "null") return "uw-map-select ignore";
    if (val === EXTRA_FIELD_MARKER) return "uw-map-select extra";
    return "uw-map-select mapped";
  };

  return (
    <div className="uw-overlay" onClick={onClose}>
      <div className="uw-card" onClick={e => e.stopPropagation()}>
        <div className="uw-strip" />
        <div className="uw-body">
          <div className="uw-title">Import GU Student Data</div>
          <div className="uw-sub">Upload an Excel or CSV file with admission records</div>

          {/* Steps */}
          <div className="uw-steps">
            {["Upload File","Map Columns","Done"].map((label, idx) => {
              const n = idx + 1;
              const dotState = step > n ? "done" : step === n ? "active" : "idle";
              return (
                <div key={label} className="uw-step" style={{ flex: idx < 2 ? "1" : "0" }}>
                  <div className={`uw-step-dot ${dotState}`}>
                    {step > n
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : n
                    }
                  </div>
                  <div className={`uw-step-label ${step === n ? "active" : ""}`}>{label}</div>
                  {idx < 2 && <div className={`uw-step-line ${step > n ? "done" : ""}`} />}
                </div>
              );
            })}
          </div>

          {/* ── Step 1: Drop zone ── */}
          {step === 1 && (
            <>
              <div
                className={`uw-drop ${dragging ? "drag" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="uw-drop-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div className="uw-drop-text">Drop your Excel / CSV here</div>
                <div className="uw-drop-hint">or click to browse — .xlsx, .xls, .csv · max 10 MB</div>
                {file && (
                  <div className="uw-file-pill" onClick={e => e.stopPropagation()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    {file.name}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                style={{ display:"none" }}
                onChange={e => handleFile(e.target.files[0])}
              />

              {error && (
                <div style={{ marginTop:14,padding:"10px 16px",background:"#FFF1F2",border:"1px solid rgba(225,29,72,.2)",borderRadius:12,fontSize:13,color:"#E11D48" }}>
                  {error}
                </div>
              )}

              <div className="uw-actions">
                <button className="uw-btn secondary" onClick={onClose}>Cancel</button>
                <button className="uw-btn primary" onClick={handlePreview} disabled={!file || uploading}>
                  {uploading
                    ? <><span style={{ width:14,height:14,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",display:"inline-block",animation:"guSpin .7s linear infinite" }}/> Parsing...</>
                    : <>Next: Map Columns <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></>
                  }
                </button>
              </div>
            </>
          )}

          {/* ── Step 2: Column mapping ── */}
          {step === 2 && preview && (
            <>
              <div style={{ fontSize:13,color:"#64748B",marginBottom:16 }}>
                Found <strong style={{ color:"#0F172A" }}>{preview.headers.length}</strong> columns in your file.
                For each column, choose the database field it maps to, mark it as <strong style={{ color:"#92400E" }}>Extra</strong> to keep without a fixed field, or <strong style={{ color:"#94A3B8" }}>Ignore</strong> to discard.
              </div>

              <div style={{ overflowX:"auto",borderRadius:16,border:"1.5px solid #E2E8F0" }}>
                <table className="uw-map-table">
                  <thead>
                    <tr>
                      <th style={{ width:"30%" }}>Your Column Header</th>
                      <th style={{ width:"35%" }}>Map To Field</th>
                      <th style={{ width:"15%" }}>Confidence</th>
                      <th style={{ width:"20%" }}>Sample Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.suggestedMapping.map(({ header, suggestedField, confidence }) => (
                      <tr key={header}>
                        <td>
                          <span style={{ fontWeight:600,color:"#0F172A",fontSize:13 }}>{header}</span>
                        </td>
                        <td>
                          <select
                            className={selectClass(mapping[header])}
                            value={mapping[header] ?? EXTRA_FIELD_MARKER}
                            onChange={e => setMapping(prev => ({ ...prev, [header]: e.target.value }))}
                          >
                            <option value="null">— Ignore this column —</option>
                            <option value={EXTRA_FIELD_MARKER}>Keep as extra data</option>
                            <optgroup label="Predefined Fields">
                              {ADMISSION_TARGET_FIELDS.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </optgroup>
                          </select>
                        </td>
                        <td>
                          <span className={confClass(confidence)}>
                            {confidence === "high" ? "✓ High" : confidence === "medium" ? "~ Med" : "? None"}
                          </span>
                        </td>
                        <td>
                          <span className="uw-sample" title={preview.sampleRows[0]?.[header] ?? ""}>
                            {preview.sampleRows[0]?.[header] || <span style={{ color:"#CBD5E1" }}>—</span>}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {error && (
                <div style={{ marginTop:14,padding:"10px 16px",background:"#FFF1F2",border:"1px solid rgba(225,29,72,.2)",borderRadius:12,fontSize:13,color:"#E11D48" }}>
                  {error}
                </div>
              )}

              <div style={{ marginTop:14,padding:"10px 16px",background:"#EEF2FF",border:"1px solid rgba(79,70,229,.15)",borderRadius:12,fontSize:12,color:"#4338CA" }}>
                <strong>Required fields:</strong> name, enrollment_no — these must be mapped to proceed.
              </div>

              <div className="uw-actions">
                <button className="uw-btn secondary" onClick={() => { setStep(1); setError(""); }}>← Back</button>
                <button className="uw-btn primary" onClick={handleConfirm} disabled={confirming}>
                  {confirming
                    ? <><span style={{ width:14,height:14,border:"2px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",display:"inline-block",animation:"guSpin .7s linear infinite" }}/> Saving...</>
                    : <>Confirm &amp; Import <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></>
                  }
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Result ── */}
          {step === 3 && result && (
            <>
              <div style={{ textAlign:"center",marginBottom:24 }}>
                <div style={{ width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,#DCFCE7,#BBF7D0)",border:"2px solid rgba(22,163,74,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:800,color:"#0F172A",marginBottom:4 }}>Import Complete</div>
                <div style={{ fontSize:13,color:"#64748B" }}>
                  {result.totalRows} rows processed from your file
                </div>
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16 }}>
                {[
                  { label:"New Records", value:result.inserted, type:"inserted", color:"#16A34A" },
                  { label:"Updated",     value:result.updated,  type:"updated",  color:"#1D4ED8" },
                  { label:"Skipped",     value:result.skipped,  type:"skipped",  color:"#F97316" },
                ].map(s => (
                  <div key={s.type} className={`uw-result-stat ${s.type}`}>
                    <div style={{ flex:1 }}>
                      <div className="uw-result-num" style={{ color:s.color }}>{s.value}</div>
                      <div className="uw-result-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {result.extraColumnsSaved?.length > 0 && (
                <div className="uw-extra-notice">
                  <strong>Extra columns saved:</strong> these didn't match a predefined field but were stored under <code>extra_fields</code>:
                  <div style={{ marginTop:6 }}>
                    {result.extraColumnsSaved.map(col => <span key={col} className="uw-extra-tag">{col}</span>)}
                  </div>
                </div>
              )}

              {result.errors?.length > 0 && (
                <div className="uw-errors">
                  <div style={{ fontSize:12,fontWeight:700,color:"#C2410C",marginBottom:8 }}>
                    {result.errors.length} row(s) skipped — details:
                  </div>
                  {result.errors.map((e, i) => <div key={i} className="uw-error-item">{e}</div>)}
                </div>
              )}

              <div className="uw-actions">
                <button className="uw-btn secondary" onClick={() => { setStep(1); setFile(null); setPreview(null); setResult(null); setError(""); }}>
                  Upload Another File
                </button>
                <button className="uw-btn primary" onClick={() => onSuccess()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Done — Refresh Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// ── Main Dashboard Component ───────────────────────────────────────
// ────────────────────────────────────────────────────────────────────
export default function GUStudentsDashboard() {
  const { isAdmin, authFetch } = useAuth();
  const [records,       setRecords]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [selected,      setSelected]      = useState(null);
  const [showWizard,    setShowWizard]     = useState(false);
  const [exporting,     setExporting]     = useState(false);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("skillmap_token");
      const res = await fetch(`${BASE_URL}/export/admission`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) {
        // No records yet — not an error
        setRecords([]);
        return;
      }
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setRecords(rows);
    } catch (err) {
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadRecords();
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("skillmap_token");
      const res   = await fetch(`${BASE_URL}/export/admission`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `gu_students_${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleWizardSuccess = () => {
    setShowWizard(false);
    loadRecords();
  };

  if (!isAdmin) return <Locked />;

  const normalized = records.map(r => ({
    ...r,
    gender:   r.gender   ? r.gender.charAt(0).toUpperCase() + r.gender.slice(1).toLowerCase() : r.gender,
    category: normalizeCategory(r.category),
  }));

  const statCards = buildStatCards(normalized);

  const FILTERS = [
    { key:"programme",      label:"Programme",   options:[...new Set(normalized.map(r=>r.programme).filter(Boolean))].sort() },
    { key:"admission_batch",label:"Batch",       options:[...new Set(normalized.map(r=>r.admission_batch).filter(Boolean))].sort() },
    { key:"ou_name",        label:"School Name", options:[...new Set(normalized.map(r=>r.ou_name).filter(Boolean))].sort() },
    { key:"category",       label:"Category",    options:[...new Set(normalized.map(r=>r.category).filter(Boolean))].sort() },
    { key:"gender",         label:"Gender",      options:["Male","Female","Other"] },
    { key:"pwd_applicable", label:"PWD",         options:[...new Set(normalized.map(r=>r.pwd_applicable).filter(Boolean))] },
  ];

  return (
    <div className="gu-root">
      <style>{CSS}</style>

      {/* Header */}
      <div className="gu-header">
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"68px 5vw 0",position:"relative",zIndex:1 }}>
          <div className="gu-crumb">Admin <span>/</span> Dashboards <span>/</span> GU Students</div>
          <h1 className="gu-title">GU Student Registry</h1>
          <p className="gu-sub">Goa University · Official Admission Records</p>

          <div style={{ display:"flex",gap:10,marginTop:20,flexWrap:"wrap" }}>
            <button className="gu-hdr-btn primary" onClick={() => setShowWizard(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Excel / CSV
            </button>
            <button className="gu-hdr-btn" onClick={handleExport} disabled={exporting || records.length === 0}
              style={{ color:"#0F172A" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {exporting ? "Exporting..." : "Export to Excel"}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="gu-body">
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 5vw 60px" }}>
          <br />

          {loading ? (
            <div className="gu-loading">
              <div className="gu-spinner" />
              <p style={{ fontSize:14,color:"#94A3B8",fontFamily:"inherit" }}>Loading admission records...</p>
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
              {/* Stat Cards */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginTop:-28,marginBottom:32 }}>
                {statCards.map((c, i) => (
                  <div key={i}
                    style={{ background:"white",borderRadius:20,padding:"22px 24px",border:"1.5px solid #E2E8F0",transition:"all .3s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=c.color; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 16px 40px ${c.color}18`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                    <div style={{ width:44,height:44,borderRadius:12,background:c.color+"15",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.iconPath}</svg>
                    </div>
                    <div style={{ fontFamily:"'Fraunces',serif",fontSize:34,fontWeight:800,color:c.color,lineHeight:1,marginBottom:6 }}>{c.value}</div>
                    <div style={{ fontSize:13,fontWeight:600,color:"#64748B" }}>{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Empty state when no data yet */}
              {records.length === 0 && (
                <div style={{ textAlign:"center",padding:"60px 20px",background:"white",borderRadius:24,border:"1.5px dashed #C7D2FE",marginBottom:32 }}>
                  <div style={{ width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#EEF2FF,#E0E7FF)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px" }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <div style={{ fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:800,color:"#0F172A",marginBottom:8 }}>No Records Yet</div>
                  <div style={{ fontSize:14,color:"#64748B",marginBottom:20 }}>Upload your first Excel or CSV file to get started.</div>
                  <button
                    onClick={() => setShowWizard(true)}
                    style={{ padding:"10px 28px",borderRadius:100,background:"linear-gradient(135deg,#6366F1,#4F46E5)",color:"white",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:"0 6px 18px rgba(79,70,229,.3)" }}>
                    Upload Excel / CSV
                  </button>
                </div>
              )}

              {normalized.length > 0 && (
                <>
                  {/* ── Charts ── */}
                  <div className="gu-sl" style={{ marginBottom:16 }}>Data Visualizations</div>
                  <GUCharts records={normalized} />

                  {/* ── Table ── */}
                  <div className="gu-sl" style={{ marginTop:32 }}>All GU Student Records</div>
                  <DataTable
                    columns={COLUMNS}
                    rows={normalized}
                    filters={FILTERS}
                    searchKeys={["name","enrollment_no","roll_number","programme","ou_name","category","admission_batch"]}
                    onRowClick={setSelected}
                    footer={`${normalized.length} records loaded · Click any row to view full profile`}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Wizard */}
      {showWizard && (
        <UploadWizard
          onClose={() => setShowWizard(false)}
          onSuccess={handleWizardSuccess}
        />
      )}

      {/* Record detail modal */}
      <RecordModal record={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
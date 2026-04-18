import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
:root{--teal:#0D9488;--teal2:#0F766E;--teal3:#CCFBF1;--orange:#F97316;--orange2:#EA580C;--orange3:#FFF7ED;--navy:#0F172A;--ink:#1E293B;--muted:#64748B;--border:#E2E8F0;--white:#FFFFFF;--bg:#F8FAFC;}
.hr{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--ink);overflow-x:hidden;}
.fraunces{font-family:'Fraunces',serif!important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes shimmer{from{background-position:200% center}to{background-position:-200% center}}
@keyframes scalePop{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}
.rev{opacity:0;transform:translateY(36px);transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1);}
.rev.on{opacity:1;transform:translateY(0);}
.rev.d1{transition-delay:.08s}.rev.d2{transition-delay:.16s}.rev.d3{transition-delay:.24s}.rev.d4{transition-delay:.32s}.rev.d5{transition-delay:.4s}
.badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:var(--teal3);color:var(--teal2);border:1.5px solid rgba(13,148,136,.18);margin-bottom:18px;}
.badge-o{background:var(--orange3);color:var(--orange2);border-color:rgba(249,115,22,.18);}
.scard{background:var(--white);border:1.5px solid var(--border);border-radius:20px;padding:28px 24px;transition:all .3s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden;cursor:default;}
.scard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--teal),var(--orange));transform:scaleX(0);transform-origin:left;transition:transform .35s;}
.scard:hover{transform:translateY(-8px) scale(1.02);border-color:var(--teal);box-shadow:0 20px 60px rgba(13,148,136,.12);}
.scard:hover::before{transform:scaleX(1);}
.scard-acc{background:linear-gradient(135deg,var(--teal) 0%,var(--teal2) 100%);border-color:transparent;color:white;}
.scard-acc:hover{border-color:transparent;box-shadow:0 20px 60px rgba(13,148,136,.35);}
.ocard{background:var(--white);border:1.5px solid var(--border);border-radius:24px;padding:32px;transition:all .3s;position:relative;overflow:hidden;}
.ocard:hover{border-color:var(--teal);box-shadow:0 16px 48px rgba(13,148,136,.1);transform:translateY(-4px);}
.onum{font-family:'Fraunces',serif;font-size:80px;font-weight:800;line-height:1;position:absolute;right:16px;top:12px;color:transparent;-webkit-text-stroke:1.5px rgba(13,148,136,.1);transition:all .3s;pointer-events:none;}
.ocard:hover .onum{-webkit-text-stroke-color:rgba(13,148,136,.22);}
.mpill{display:flex;align-items:center;gap:14px;padding:14px 18px;background:var(--white);border:1.5px solid var(--border);border-radius:14px;transition:all .3s;}
.mpill:hover{border-color:var(--teal);background:#F0FDFA;transform:translateX(6px);}
.sdgcard{display:flex;align-items:center;gap:16px;padding:18px 22px;background:var(--white);border:1.5px solid var(--border);border-radius:16px;transition:all .3s;cursor:default;}
.sdgcard:hover{border-color:var(--orange);box-shadow:0 8px 32px rgba(249,115,22,.1);transform:translateX(8px);}
.tcard{background:var(--white);border:1.5px solid var(--border);border-radius:20px;padding:28px 20px;text-align:center;transition:all .3s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden;}
.tcard:hover{transform:translateY(-10px) scale(1.03);border-color:var(--teal);box-shadow:0 20px 50px rgba(13,148,136,.12);}
.tcard-pi{border-color:var(--teal);background:linear-gradient(145deg,#F0FDFA,#fff);}
.avatar{width:60px;height:60px;border-radius:16px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;}
.cta-bg{background:linear-gradient(135deg,#0D9488 0%,#0F766E 40%,#0E7490 100%);position:relative;overflow:hidden;}
.cta-bg::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 20% 50%,rgba(255,255,255,.07) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(249,115,22,.15) 0%,transparent 40%);}
.btn-teal{display:inline-flex;align-items:center;gap:10px;padding:15px 32px;border-radius:100px;font-weight:700;font-size:15px;background:var(--teal);color:white;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .25s;box-shadow:0 4px 20px rgba(13,148,136,.3);}
.btn-teal:hover{background:var(--teal2);transform:scale(1.05);box-shadow:0 8px 32px rgba(13,148,136,.4);}
.btn-orange{display:inline-flex;align-items:center;gap:10px;padding:15px 32px;border-radius:100px;font-weight:700;font-size:15px;background:var(--orange);color:white;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .25s;box-shadow:0 4px 20px rgba(249,115,22,.3);}
.btn-orange:hover{background:var(--orange2);transform:scale(1.05);box-shadow:0 8px 32px rgba(249,115,22,.4);}
.btn-outline{display:inline-flex;align-items:center;gap:10px;padding:15px 32px;border-radius:100px;font-weight:700;font-size:15px;background:transparent;color:white;border:2px solid rgba(255,255,255,.4);cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .25s;}
.btn-outline:hover{background:rgba(255,255,255,.1);border-color:white;transform:scale(1.04);}
.btn-white{display:inline-flex;align-items:center;gap:10px;padding:15px 32px;border-radius:100px;font-weight:700;font-size:15px;background:white;color:var(--teal2);border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .25s;box-shadow:0 4px 20px rgba(0,0,0,.1);}
.btn-white:hover{transform:scale(1.05);box-shadow:0 8px 32px rgba(0,0,0,.15);}
.mqrow{animation:marquee 28s linear infinite;white-space:nowrap;display:inline-flex;}
.mqrow:hover{animation-play-state:paused;}
.float1{animation:float 6s ease-in-out infinite;}
.float2{animation:float 8s ease-in-out infinite 1s;}
.float3{animation:float 7s ease-in-out infinite 2s;}
.shimmer{background:linear-gradient(90deg,var(--teal) 0%,var(--orange) 40%,var(--teal) 80%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite;}
.pbar{height:6px;background:#E2E8F0;border-radius:100px;overflow:hidden;}
.pbar-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,var(--teal),var(--orange));transition:width 1.5s cubic-bezier(.22,1,.36,1);}
.dots-bg{background-image:radial-gradient(circle,rgba(13,148,136,.12) 1.5px,transparent 1.5px);background-size:28px 28px;}
.blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.18;pointer-events:none;}
`;

// ── SVG Icon components ───────────────────────────────────────────
const Icon = ({ children, color = "#0D9488", bg = "#F0FDFA", size = 40 }) => (
  <div style={{ width:size, height:size, borderRadius:size*0.3, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
    <svg width={size*0.5} height={size*0.5} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </div>
);

// Individual icons
const IconSurvey   = ({ size=40 }) => <Icon color="#0D9488" bg="#F0FDFA" size={size}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></Icon>;
const IconFocus    = ({ size=40 }) => <Icon color="#7C3AED" bg="#F5F3FF" size={size}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const IconAnalysis = ({ size=40 }) => <Icon color="#0891B2" bg="#EFF6FF" size={size}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></Icon>;
const IconStats    = ({ size=40 }) => <Icon color="#F97316" bg="#FFF7ED" size={size}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6"  y1="20" x2="6"  y2="14"/></Icon>;
const IconPolicy   = ({ size=40 }) => <Icon color="#16A34A" bg="#F0FDF4" size={size}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Icon>;

// SDG icons
const IconEducation  = () => <Icon color="#DC2626" bg="#FEE2E2" size={52}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>;
const IconWork       = () => <Icon color="#D97706" bg="#FEF3C7" size={52}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Icon>;
const IconInnovation = () => <Icon color="#2563EB" bg="#DBEAFE" size={52}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>;
const IconEquality   = () => <Icon color="#9333EA" bg="#F3E8FF" size={52}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6"  x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></Icon>;

// Stat card icons
const IconUnemployment = () => <Icon color="#F97316" bg="#FFF7ED" size={48}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></Icon>;
const IconYouth        = () => <Icon color="#0D9488" bg="#F0FDFA" size={48}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const IconGraduation   = () => <Icon color="#7C3AED" bg="#F5F3FF" size={48}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></Icon>;
const IconGER          = () => <Icon color="#0891B2" bg="#EFF6FF" size={48}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Icon>;
const IconLiteracy     = () => <Icon color="#16A34A" bg="#F0FDF4" size={48}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>;
const IconSurveyCount  = () => <Icon color="#6366F1" bg="#EEF2FF" size={48}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;

function Counter({ to, suffix = "", dec = 0, delay = 0 }) {
  const [n, setN] = useState(0);
  const [fired, setFired] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || fired) return;
      setFired(true); obs.disconnect();
      setTimeout(() => {
        let s = null;
        const tick = ts => {
          if (!s) s = ts;
          const p = Math.min((ts - s) / 1800, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setN(+(ease * to).toFixed(dec));
          if (p < 1) requestAnimationFrame(tick); else setN(to);
        };
        requestAnimationFrame(tick);
      }, delay);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, dec, delay, fired]);
  return <span ref={ref}>{n.toFixed(dec)}{suffix}</span>;
}

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".rev").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function ProgressBar({ pct, delay = 0 }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      setTimeout(() => setW(pct), delay);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return <div ref={ref} className="pbar"><div className="pbar-fill" style={{ width: `${w}%` }} /></div>;
}

const STATS = [
  { to:8.7,  suf:"%", dec:1, label:"Goa Unemployment",     sub:"vs 4.9% national avg",          acc:true,  IconComp: IconUnemployment },
  { to:45,   suf:"%", dec:0, label:"Youth Jobless 25-29",  sub:"Peak 2020-21 · CMIE data",                  IconComp: IconYouth        },
  { to:65,   suf:"%", dec:0, label:"Educated Unemployed",  sub:"Graduates share, up from 54%",              IconComp: IconGraduation   },
  { to:35.8, suf:"%", dec:1, label:"Goa Higher Ed GER",    sub:"Above national 28.4%",                      IconComp: IconGER          },
  { to:93.6, suf:"%", dec:1, label:"Literacy Rate",        sub:"Yet unemployment is double",                IconComp: IconLiteracy     },
  { to:500,  suf:"+", dec:0, label:"Youth to be Surveyed", sub:"Stratified random sample",                  IconComp: IconSurveyCount  },
];

const OBJECTIVES = [
  { n:"01", title:"Root Causes",   body:"Analyse why educated graduates in Goa remain unemployed despite high qualifications.", dot:"#0D9488",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { n:"02", title:"Skill Gaps",    body:"Map employer-perceived gaps in technical, soft, and digital literacy among youth.",    dot:"#F97316",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { n:"03", title:"Aspirations",   body:"Understand what unemployed youth want and the motivations shaping their job search.",  dot:"#6366F1",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { n:"04", title:"Interventions", body:"Propose curriculum reforms, upskilling programs, and entrepreneurship policy layers.", dot:"#EC4899",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
];

const METHODS = [
  { IconComp: IconSurvey,   label:"Quantitative Survey",     detail:"400-500 unemployed youth · Stratified random sampling" },
  { IconComp: IconFocus,    label:"Focus Group Discussions",  detail:"Industry reps, entrepreneurs, NGOs, HR professionals"  },
  { IconComp: IconAnalysis, label:"Thematic Analysis",        detail:"Braun & Clarke (2006) · NVivo qualitative software"    },
  { IconComp: IconStats,    label:"Statistical Testing",      detail:"Regression, ANOVA, Factor Analysis · SPSS/JAMOVI"      },
];

const SDGs = [
  { n:"04", title:"Quality Education",     IconComp: IconEducation  },
  { n:"08", title:"Decent Work & Growth",  IconComp: IconWork       },
  { n:"09", title:"Industry & Innovation", IconComp: IconInnovation },
  { n:"10", title:"Reduced Inequalities",  IconComp: IconEquality   },
];

const SDG_COLORS = {
  "04": "#DC2626",
  "08": "#D97706",
  "09": "#2563EB",
  "10": "#9333EA",
};

const TEAM = [
  { name:"Dr. Nirmala R",     role:"Principal Investigator",  dept:"Management Studies",      init:"NR", pi:true, bg:"linear-gradient(135deg,#0D9488,#0891B2)", tc:"white"   },
  { name:"Dr. Suraj Velip",   role:"Co-Investigator",         dept:"Quantitative Research",   init:"SV",          bg:"#EFF6FF", tc:"#1D4ED8" },
  { name:"Dr. Priyanka Naik", role:"Co-Investigator",         dept:"Secondary Data Research", init:"PN",          bg:"#FFF7ED", tc:"#C2410C" },
  { name:"Mr. H.H. Redkar",   role:"Co-Investigator",         dept:"Computer Science",        init:"HR",          bg:"#F0FDF4", tc:"#16A34A" },
  { name:"Ms. Ankita Chari",  role:"Co-Investigator",         dept:"Economics",               init:"AC",          bg:"#FDF4FF", tc:"#9333EA" },
];

const MQ = ["VIKSIT BHARAT 2047","VIKSIT GOA 2037","SKILL GAP RESEARCH","YOUTH EMPOWERMENT","NITI AAYOG SSM 2025","MIXED METHODS","GOA UNIVERSITY","INDUSTRY-ACADEMIA","SDG 4 · 8 · 9 · 10","EDUCATED UNEMPLOYMENT"];

export default function Home({ setPage }) {
  useReveal();
  const { isAdmin } = useAuth();
  const F    = { fontFamily:"'Fraunces',serif" };
  const navy = { color:"#0F172A" };

  return (
    <div className="hr">
      <style>{CSS}</style>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden", background:"linear-gradient(145deg,#F0FDFA 0%,#ECFDF5 35%,#FFF7ED 70%,#FFFBEB 100%)", paddingTop:80 }}>
        <div className="dots-bg" style={{ position:"absolute", inset:0, opacity:0.5 }} />
        <div className="blob" style={{ width:600, height:600, background:"#0D9488", top:"-20%", right:"-10%" }} />
        <div className="blob" style={{ width:400, height:400, background:"#F97316", bottom:"-5%", left:"-5%", opacity:0.12 }} />
        <div className="float1" style={{ position:"absolute", top:"15%", right:"8%", width:80, height:80, borderRadius:20, background:"linear-gradient(135deg,#0D9488,#0891B2)", opacity:.15, transform:"rotate(20deg)" }} />
        <div className="float2" style={{ position:"absolute", top:"62%", right:"18%", width:50, height:50, borderRadius:"50%", background:"#F97316", opacity:.18 }} />
        <div className="float3" style={{ position:"absolute", top:"25%", left:"3%", width:36, height:36, background:"#0D9488", opacity:.2, transform:"rotate(45deg)" }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"80px 6vw", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5vw", alignItems:"center" }}>
          <div>
            <div style={{ animation:"fadeIn .6s ease .1s both" }}>
              <span className="badge">NITI Aayog · SSM 2025-26</span>
            </div>
            <h1 style={{ ...F, fontSize:"clamp(38px,5.5vw,70px)", fontWeight:800, lineHeight:1.05, ...navy, marginBottom:12, animation:"fadeUp .8s ease .2s both" }}>
              Mapping<br /><span style={{ color:"#0D9488" }}>Unemployment</span><br />in Educated<br /><span style={{ color:"#F97316", fontStyle:"italic" }}>Youth of Goa</span>
            </h1>
            <p style={{ fontSize:"clamp(15px,1.4vw,17px)", lineHeight:1.8, color:"#64748B", maxWidth:480, marginBottom:40, animation:"fadeUp .8s ease .4s both" }}>
              A NITI Aayog-funded study identifying the skill gap between Goa's educated youth and industry demands — powering <strong style={{ color:"#0D9488", fontWeight:600 }}>Viksit Goa @ 2037</strong>.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", animation:"fadeUp .8s ease .55s both" }}>
              <button className="btn-teal" onClick={() => setPage("Students")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Explore Data
              </button>
              <button className="btn-orange" onClick={() => setPage(isAdmin ? "Students" : "Login")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                {isAdmin ? "Go to Dashboard" : "Admin Login"}
              </button>
            </div>
            <div style={{ display:"flex", gap:28, marginTop:48, animation:"fadeUp .8s ease .7s both" }}>
              {[["8.7%","Goa Unemployment","#F97316"],["500+","Youth Surveyed","#0D9488"],["4","SDGs Aligned","#6366F1"]].map(([v,l,c],i)=>(
                <div key={i}>
                  <div style={{ ...F, fontSize:26, fontWeight:800, color:c }}>{v}</div>
                  <div style={{ fontSize:11, color:"#64748B", fontWeight:500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero right card */}
          <div style={{ animation:"scalePop .8s cubic-bezier(.34,1.56,.64,1) .3s both" }}>
            <div style={{ background:"white", borderRadius:28, padding:"36px 32px", boxShadow:"0 32px 80px rgba(13,148,136,.15), 0 8px 24px rgba(0,0,0,.06)", border:"1.5px solid rgba(13,148,136,.12)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"#0D9488", letterSpacing:".06em", textTransform:"uppercase" }}>Research at a Glance</span>
              </div>
              {[
                { label:"Unemployment Rate — Goa",      val:"8.7%",  sub:"2× national average",  color:"#F97316",
                  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg> },
                { label:"Youth Unemployed (25-29 yrs)", val:"45%",   sub:"CMIE data 2020-21",     color:"#E74C3C",
                  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
                { label:"Higher Education GER",         val:"35.8%", sub:"Above national 28.4%",  color:"#0D9488",
                  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
                { label:"Graduate Unemployment Share",  val:"65%",   sub:"Up from 54% in 2000",   color:"#8B5CF6",
                  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
              ].map((r,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:i<3?"1px solid #F1F5F9":"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:"#F8FAFC", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{r.icon}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, ...navy }}>{r.label}</div>
                      <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{r.sub}</div>
                    </div>
                  </div>
                  <div style={{ ...F, fontSize:22, fontWeight:800, color:r.color, marginLeft:12 }}>{r.val}</div>
                </div>
              ))}
              <div style={{ marginTop:24, padding:16, background:"linear-gradient(135deg,#F0FDFA,#FFF7ED)", borderRadius:16, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#0D9488,#F97316)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, ...navy }}>Target: Viksit Goa @ 2037</div>
                  <div style={{ fontSize:11, color:"#64748B" }}>Ahead of national target by 10 years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────── */}
      <div style={{ overflow:"hidden", background:"#0F766E", padding:"14px 0" }}>
        <div className="mqrow">
          {[...MQ,...MQ].map((t,i)=>(
            <span key={i} style={{ fontSize:11, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(255,255,255,.7)", padding:"0 32px" }}>
              {t}<span style={{ color:"rgba(255,255,255,.3)", marginLeft:32 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section style={{ padding:"100px 6vw", background:"white" }}>
        <div className="rev" style={{ textAlign:"center", marginBottom:64 }}>
          <span className="badge badge-o">Key Statistics</span>
          <h2 style={{ ...F, fontSize:"clamp(28px,4vw,52px)", fontWeight:800, ...navy, lineHeight:1.15 }}>
            The Numbers That <span className="shimmer">Demand Action</span>
          </h2>
          <p style={{ fontSize:15, color:"#64748B", maxWidth:480, margin:"14px auto 0", lineHeight:1.75 }}>
            Data sourced from CMIE, PLFS, AISHE, and ILO reports.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, maxWidth:1200, margin:"0 auto" }}>
          {STATS.map((s,i)=>(
            <div key={i} className={`scard rev d${(i%4)+1} ${s.acc?"scard-acc":""}`}>
              <div style={{ marginBottom:16 }}>
                {s.acc
                  ? <div style={{ width:48, height:48, borderRadius:14, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    </div>
                  : <s.IconComp />
                }
              </div>
              <div style={{ ...F, fontSize:"clamp(44px,5vw,62px)", fontWeight:800, lineHeight:1, color:s.acc?"white":"#0D9488", marginBottom:10 }}>
                <Counter to={s.to} suffix={s.suf} dec={s.dec} delay={i*120} />
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:s.acc?"rgba(255,255,255,.9)":"#1E293B", marginBottom:5 }}>{s.label}</div>
              <div style={{ fontSize:12, color:s.acc?"rgba(255,255,255,.6)":"#64748B", lineHeight:1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OBJECTIVES ───────────────────────────────────────────── */}
      <section style={{ padding:"100px 6vw", background:"#F8FAFC" }}>
        <div className="rev" style={{ textAlign:"center", marginBottom:64 }}>
          <span className="badge">Research Design</span>
          <h2 style={{ ...F, fontSize:"clamp(28px,4vw,52px)", fontWeight:800, ...navy, lineHeight:1.15 }}>Four Core Objectives</h2>
          <p style={{ fontSize:16, color:"#64748B", maxWidth:520, margin:"14px auto 0", lineHeight:1.7 }}>Each objective maps to measurable outcomes and policy interventions for Goa's youth.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:18, maxWidth:1200, margin:"0 auto" }}>
          {OBJECTIVES.map((o,i)=>(
            <div key={i} className={`ocard rev d${(i%4)+1}`}>
              <div className="onum">{o.n}</div>
              <div style={{ width:44, height:44, borderRadius:13, background:o.dot+"15", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                {o.icon}
              </div>
              <div style={{ ...F, fontSize:22, fontWeight:800, ...navy, marginBottom:10 }}>{o.title}</div>
              <p style={{ fontSize:14, color:"#64748B", lineHeight:1.75 }}>{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT + METHODS ──────────────────────────────────────── */}
      <section style={{ padding:"100px 6vw", background:"white" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"7vw", alignItems:"center" }}>
          <div className="rev">
            <span className="badge">Why Goa?</span>
            <h2 style={{ ...F, fontSize:"clamp(26px,3.5vw,46px)", fontWeight:800, ...navy, lineHeight:1.2, marginBottom:20 }}>
              A Literacy Paradox<br /><span style={{ color:"#F97316", fontStyle:"italic" }}>Demanding Research</span>
            </h2>
            <p style={{ fontSize:15, color:"#64748B", lineHeight:1.8, marginBottom:28 }}>
              Literacy rate of <strong style={{ color:"#0D9488", fontWeight:700 }}>93.6%</strong> and GER of <strong style={{ color:"#0D9488", fontWeight:700 }}>35.8%</strong> — yet unemployment is <strong style={{ color:"#F97316", fontWeight:700 }}>double the national figure</strong>. This paradox is the core motivation.
            </p>
            {[
              { label:"Goa Unemployment", pct:87,  val:"8.7%", c:"#F97316" },
              { label:"National Average",  pct:49,  val:"4.9%", c:"#0D9488" },
              { label:"Youth (25-29) Goa", pct:100, val:"45%+", c:"#E74C3C" },
            ].map((b,i)=>(
              <div key={i} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:600, ...navy }}>{b.label}</span>
                  <span style={{ fontSize:13, fontWeight:800, color:b.c }}>{b.val}</span>
                </div>
                <ProgressBar pct={b.pct} delay={i*200} />
              </div>
            ))}
          </div>

          <div className="rev d2">
            <span className="badge badge-o">Methodology</span>
            <h2 style={{ ...F, fontSize:"clamp(24px,2.8vw,38px)", fontWeight:800, ...navy, lineHeight:1.25, marginBottom:24 }}>Mixed Methods<br />Research Approach</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {METHODS.map((m,i)=>(
                <div key={i} className="mpill">
                  <m.IconComp size={40} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, ...navy, marginBottom:2 }}>{m.label}</div>
                    <div style={{ fontSize:11, color:"#64748B" }}>{m.detail}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SDGs ─────────────────────────────────────────────────── */}
      <section style={{ padding:"100px 6vw", background:"linear-gradient(135deg,#F0FDFA 0%,#FFF7ED 100%)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:"6vw", alignItems:"center" }}>
          <div className="rev">
            <span className="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              UN Agenda 2030
            </span>
            <h2 style={{ ...F, fontSize:"clamp(26px,3.5vw,46px)", fontWeight:800, ...navy, lineHeight:1.2, marginBottom:18 }}>
              Aligned with<br /><span style={{ color:"#0D9488" }}>Global Goals</span>
            </h2>
            <p style={{ fontSize:15, color:"#64748B", lineHeight:1.8 }}>This research directly addresses four SDGs by connecting education outcomes to employment realities.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {SDGs.map((s,i)=>(
              <div key={i} className={`sdgcard rev d${i+1}`}>
                <s.IconComp />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:SDG_COLORS[s.n], letterSpacing:".1em", textTransform:"uppercase", marginBottom:2 }}>SDG {s.n}</div>
                  <div style={{ fontSize:15, fontWeight:700, ...navy }}>{s.title}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────── */}
      <section style={{ padding:"100px 6vw", background:"white" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="rev" style={{ textAlign:"center", marginBottom:64 }}>
            <span className="badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Research Team
            </span>
            <h2 style={{ ...F, fontSize:"clamp(28px,4vw,52px)", fontWeight:800, ...navy, lineHeight:1.15 }}>Meet the Investigators</h2>
            <p style={{ fontSize:15, color:"#64748B", maxWidth:480, margin:"14px auto 0", lineHeight:1.75 }}>
              An interdisciplinary team from Goa University spanning Management, Economics and Computer Science.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:16 }}>
            {TEAM.map((m,i)=>(
              <div key={i} className={`tcard rev d${(i%5)+1} ${m.pi?"tcard-pi":""}`}>
                {m.pi && (
                  <div style={{ position:"absolute", top:14, right:14, fontSize:9, fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"#0F766E", background:"#CCFBF1", padding:"3px 8px", borderRadius:100, display:"flex", alignItems:"center", gap:4 }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    PI
                  </div>
                )}
                <div className="avatar" style={{ background:m.bg, color:m.tc }}>{m.init}</div>
                <div style={{ fontSize:14, fontWeight:700, ...navy, marginBottom:4 }}>{m.name}</div>
                <div style={{ fontSize:12, color:"#0D9488", fontWeight:600, marginBottom:4 }}>{m.role}</div>
                <div style={{ fontSize:11, color:"#94A3B8", lineHeight:1.5 }}>{m.dept}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="cta-bg" style={{ padding:"100px 6vw", textAlign:"center" }}>
        <div style={{ position:"relative", zIndex:1 }} className="rev">
          <span style={{ fontSize:12, fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", color:"rgba(255,255,255,.65)", display:"block", marginBottom:20 }}>Ready to Explore?</span>
          <h2 style={{ ...F, fontSize:"clamp(32px,5.5vw,72px)", fontWeight:800, color:"white", lineHeight:1.1, marginBottom:20 }}>
            Access the<br /><span style={{ color:"#FDE68A", fontStyle:"italic" }}>Research Portal</span>
          </h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.65)", maxWidth:480, margin:"0 auto 44px", lineHeight:1.75 }}>
            Log in to view student and alumni dashboards, data visualizations, and track research progress.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-white" onClick={() => setPage(isAdmin ? "Students" : "Login")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              {isAdmin ? "Go to Dashboard →" : "Admin Login →"}
            </button>
            <button className="btn-outline" onClick={() => setPage("Students")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              View Data
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ background:"#0F172A", padding:"44px 6vw", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:800, color:"white" }}>SkillMap <span style={{ color:"#FCD34D" }}>Goa</span></span>
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.38)" }}>NITI Aayog · Goa University · State Support Mission 2025-26</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"flex-end" }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
            {["SDG 04","SDG 08","SDG 09","SDG 10"].map(s=>(
              <span key={s} style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.45)", padding:"5px 12px", borderRadius:100, border:"1px solid rgba(255,255,255,.1)" }}>{s}</span>
            ))}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.2)" }}>Viksit Goa @ 2037 · Viksit Bharat @ 2047</div>
        </div>
      </footer>
    </div>
  );
}
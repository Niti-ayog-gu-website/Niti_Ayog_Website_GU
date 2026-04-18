import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:5000/api";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,800;1,9..144,700&display=swap');
.lp{font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;display:grid;grid-template-columns:1fr 1fr;}
@media(max-width:768px){.lp{grid-template-columns:1fr;}.lp-left{display:none!important;}}

/* ── Left panel ── */
.lp-left{
  background:linear-gradient(155deg,#0D9488 0%,#0F766E 50%,#0C4A6E 100%);
  padding:64px 60px;
  display:flex;flex-direction:column;justify-content:space-between;
  position:relative;overflow:hidden;
}
.lp-left::before{
  content:'';position:absolute;inset:0;
  background-image:
    radial-gradient(circle at 90% 10%,rgba(249,115,22,.12) 0%,transparent 50%),
    radial-gradient(circle at 0% 100%,rgba(255,255,255,.05) 0%,transparent 45%);
  pointer-events:none;
}
/* subtle grid lines */
.lp-left::after{
  content:'';position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size:48px 48px;
  pointer-events:none;
}
.lp-logo{display:flex;align-items:center;gap:12px;position:relative;z-index:1;}
.lp-logo-icon{width:40px;height:40px;border-radius:11px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.2);}
.lp-logo-text{font-size:18px;font-weight:800;color:white;letter-spacing:-.01em;}
.lp-logo-text span{color:#FDE68A;}

.lp-center{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;padding:48px 0;}
.lp-eyebrow{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:20px;display:flex;align-items:center;gap:8px;}
.lp-eyebrow::before{content:'';width:24px;height:1.5px;background:rgba(255,255,255,.3);border-radius:2px;}
.lp-quote{font-family:'Fraunces',serif;font-size:clamp(26px,3vw,38px);font-weight:800;color:white;line-height:1.2;margin-bottom:24px;}
.lp-quote em{color:#FDE68A;font-style:italic;}
.lp-desc{font-size:15px;color:rgba(255,255,255,.55);line-height:1.85;max-width:340px;}

.lp-footer{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;}
.lp-footer-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:100px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);font-size:11px;font-weight:600;color:rgba(255,255,255,.6);}
.lp-footer-dot{width:6px;height:6px;border-radius:50%;background:#4ADE80;flex-shrink:0;box-shadow:0 0 6px #4ADE80;}

/* ── Right panel ── */
.lp-right{background:#F8FAFC;display:flex;align-items:center;justify-content:center;padding:48px 52px;}
.lp-form-wrap{width:100%;max-width:400px;}
.lp-fi{margin-bottom:20px;}
.lp-label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748B;margin-bottom:8px;}
.lp-input-wrap{position:relative;}
.lp-input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#CBD5E1;display:flex;}
.lp-input-icon svg{width:16px;height:16px;}
.lp-input{width:100%;padding:13px 14px 13px 42px;border:1.5px solid #E2E8F0;border-radius:12px;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#0F172A;background:white;outline:none;transition:all .2s;box-sizing:border-box;}
.lp-input:focus{border-color:#0D9488;box-shadow:0 0 0 3px rgba(13,148,136,.08);}
.lp-input::placeholder{color:#CBD5E1;}
.lp-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94A3B8;padding:0;display:flex;align-items:center;transition:color .2s;}
.lp-eye:hover{color:#0D9488;}
.lp-eye svg{width:16px;height:16px;}
.lp-forgot{text-align:right;margin-top:8px;}
.lp-forgot button{background:none;border:none;font-size:13px;font-weight:600;color:#0D9488;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;padding:0;}
.lp-forgot button:hover{color:#F97316;}
.lp-err{background:#FFF1F2;border:1.5px solid rgba(225,29,72,.18);border-radius:12px;padding:12px 16px;font-size:13px;font-weight:600;color:#BE123C;margin-bottom:18px;display:flex;align-items:center;gap:10px;}
.lp-err svg{width:16px;height:16px;flex-shrink:0;}
.lp-btn{width:100%;padding:14px;border-radius:12px;font-size:15px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;background:linear-gradient(135deg,#0D9488,#0F766E);color:white;border:none;cursor:pointer;transition:all .25s;box-shadow:0 4px 16px rgba(13,148,136,.25);display:flex;align-items:center;justify-content:center;gap:8px;}
.lp-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(13,148,136,.35);}
.lp-btn:disabled{opacity:.65;cursor:not-allowed;transform:none;}
.lp-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:lp-spin .7s linear infinite;flex-shrink:0;}
@keyframes lp-spin{to{transform:rotate(360deg)}}
.lp-icon-box{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;}
.lp-divider{height:1px;background:#F1F5F9;margin:28px 0;}
`;

export default function Login({ setPage }) {
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const [forgot, setForgot]       = useState(false);
  const [fpEmail, setFpEmail]     = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpSuccess, setFpSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
      setPage("Students");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!fpEmail) return;
    setFpLoading(true);
    try {
      await fetch(`${BASE_URL}/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim().toLowerCase() }),
      });
    } catch (_) {}
    setFpLoading(false);
    setFpSuccess(true);
  };

  const resetForgot = () => { setForgot(false); setFpSuccess(false); setFpEmail(""); };

  return (
    <div className="lp">
      <style>{CSS}</style>

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="lp-left">

        {/* Logo */}
        <div className="lp-logo">
          <div className="lp-logo-icon">
            <img
  src="/goa-uni-logo.png"
  alt="Goa University"
  style={{
    width: 56,
    height: 66,
    objectFit: "contain",
  }}
/>  
          </div>
          <span className="lp-logo-text">SkillMap <span>Goa</span></span>
        </div>

        {/* Main message */}
        <div className="lp-center">
          <div className="lp-eyebrow">Research Portal</div>
          <h2 className="lp-quote">
            Bridging the gap between <em>education</em> and <em>opportunity</em> in Goa.
          </h2>
          <p className="lp-desc">
            A NITI Aayog State Support Mission study mapping skill gaps among educated youth — powering Viksit Goa @ 2037.
          </p>
        </div>

        {/* Footer */}
        <div className="lp-footer">
          <span className="lp-footer-badge">
            <span className="lp-footer-dot" />
            NITI Aayog · SSM 2025-26
          </span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,.25)", fontWeight:600 }}>Goa University</span>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────── */}
      <div className="lp-right">
        <div className="lp-form-wrap">

          {/* Forgot password */}
          {forgot ? (
            fpSuccess ? (
              <div style={{ textAlign:"center" }}>
                <div style={{ width:64, height:64, borderRadius:20, background:"#F0FDFA", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", border:"1.5px solid rgba(13,148,136,.15)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:800, color:"#0F172A", marginBottom:8 }}>Check Your Email</h2>
                <p style={{ fontSize:14, color:"#64748B", marginBottom:8, lineHeight:1.7 }}>
                  If <strong style={{ color:"#0F172A" }}>{fpEmail}</strong> is a registered admin account, you'll receive reset instructions shortly.
                </p>
                <p style={{ fontSize:12, color:"#94A3B8", marginBottom:28 }}>Don't see it? Check your spam folder.</p>
                <button className="lp-btn" onClick={resetForgot}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <button onClick={resetForgot} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8", fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:32, padding:0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Back
                </button>
                <div className="lp-icon-box" style={{ background:"#FFF7ED", border:"1.5px solid rgba(249,115,22,.15)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:800, color:"#0F172A", marginBottom:6 }}>Reset Password</h2>
                <p style={{ fontSize:14, color:"#64748B", marginBottom:28, lineHeight:1.7 }}>Enter your admin email and we'll send reset instructions.</p>
                <form onSubmit={handleForgot}>
                  <div className="lp-fi">
                    <label className="lp-label">Email Address</label>
                    <div className="lp-input-wrap">
                      <span className="lp-input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg></span>
                      <input className="lp-input" type="email" placeholder="admin@goauniversity.edu.in" value={fpEmail} onChange={e => setFpEmail(e.target.value)} autoFocus />
                    </div>
                  </div>
                  <button type="submit" className="lp-btn" disabled={fpLoading || !fpEmail}>
                    {fpLoading
                      ? <><span className="lp-spinner"/> Sending...</>
                      : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Reset Link</>
                    }
                  </button>
                </form>
              </>
            )
          ) : (
            /* ── Login form ── */
            <>
              <div className="lp-icon-box" style={{ background:"linear-gradient(135deg,#F0FDFA,#CCFBF1)", border:"1.5px solid rgba(13,148,136,.12)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:800, color:"#0F172A", marginBottom:4 }}>Welcome back</h2>
              <p style={{ fontSize:14, color:"#94A3B8", marginBottom:32, lineHeight:1.7 }}>Sign in to access the research dashboard.</p>

              {error && (
                <div className="lp-err">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="lp-fi">
                  <label className="lp-label">Email Address</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                    </span>
                    <input className="lp-input" type="email" placeholder="admin@goauniversity.edu.in" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                  </div>
                </div>

                <div className="lp-fi">
                  <label className="lp-label">Password</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <input className="lp-input" type={showPwd ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" style={{ paddingRight:42 }} />
                    <button type="button" className="lp-eye" onClick={() => setShowPwd(p => !p)} tabIndex={-1}>
                      {showPwd
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  <div className="lp-forgot">
                    <button type="button" onClick={() => setForgot(true)}>Forgot password?</button>
                  </div>
                </div>

                <button type="submit" className="lp-btn" disabled={loading}>
                  {loading
                    ? <><span className="lp-spinner"/> Signing in...</>
                    : <>Sign In <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg></>
                  }
                </button>
              </form>

              <div className="lp-divider" />
              <p style={{ textAlign:"center", fontSize:12, color:"#CBD5E1", lineHeight:1.6 }}>
                SkillMap Goa · NITI Aayog SSM 2025-26<br/>Admin access only
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
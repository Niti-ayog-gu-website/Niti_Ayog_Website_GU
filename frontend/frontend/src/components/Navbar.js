import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_PUBLIC = ["Home", "Login"];
const NAV_ADMIN  = ["Home", "Students", "Alumni", "Research"];

export default function Navbar({ currentPage, setPage }) {
  // state variables
  const { isAdmin, logout } = useAuth();
  const [scrolled, setScrolled]       = useState(false); // for navbar style changing ok
  const [menuOpen, setMenuOpen]       = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // logout confirmation popup

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);  //if scroll more than 20px down -scrolled becomes true
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showLogoutModal ? "hidden" : ""; // sets ,overflow: hidden on the body — so the page behind can't scroll while the modal is up
    return () => { document.body.style.overflow = ""; };
  }, [showLogoutModal]);

  const isHero = currentPage === "Home";
  const solid  = scrolled || !isHero; // navbar becomes solid white if you've scrolled
  const links  = isAdmin ? NAV_ADMIN : NAV_PUBLIC;

  const handleNav = (label) => {
    setMenuOpen(false);
    setPage(label);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    setPage("Home");
  };

  return (
    <>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

        .nav-root {
          position:fixed; top:0; left:0; right:0; z-index:100;
          transition:all .35s cubic-bezier(.22,1,.36,1);
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .nav-root.solid {
          background:rgba(255,255,255,0.96);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(13,148,136,.1);
          box-shadow:0 4px 24px rgba(13,148,136,.07);
        }
        .nav-root.transparent { background:transparent; border-bottom:none; box-shadow:none; }

        .nav-inner {
          max-width:1200px; margin:0 auto; padding:0 5vw;
          height:68px; display:flex; align-items:center; justify-content:space-between;
        }

        .nav-logo { display:flex; align-items:center; gap:10px; background:none; border:none; cursor:pointer; padding:0; }
        .nav-logo-icon {
          width:36px; height:36px; border-radius:10px;
          background:linear-gradient(135deg,#0D9488,#0891B2);
          display:flex; align-items:center; justify-content:center;
          font-size:13px; font-weight:800; color:white;
          box-shadow:0 4px 12px rgba(13,148,136,.35); flex-shrink:0;
          transition:transform .2s, box-shadow .2s;
        }
        .nav-logo:hover .nav-logo-icon { transform:scale(1.08); box-shadow:0 6px 18px rgba(13,148,136,.45); }
        .nav-logo-text { font-size:15px; font-weight:800; letter-spacing:-.02em; transition:color .3s; }
        .nav-logo-text .org { color:#F97316; }

        .nav-links { display:flex; align-items:center; gap:4px; }

        .nav-link {
          padding:8px 16px; border-radius:100px; font-size:14px; font-weight:600;
          border:none; cursor:pointer; background:none;
          font-family:'Plus Jakarta Sans',sans-serif; transition:all .22s; white-space:nowrap;
        }
        .nav-link.active-s  { background:linear-gradient(135deg,#0D9488,#0F766E); color:white; box-shadow:0 4px 14px rgba(13,148,136,.35); }
        .nav-link.active-s:hover { box-shadow:0 6px 20px rgba(13,148,136,.45); transform:translateY(-1px); }
        .nav-link.inactive-s { color:#475569; }
        .nav-link.inactive-s:hover { color:#0D9488; background:rgba(13,148,136,.08); }
        .nav-link.active-t  { background:rgba(255,255,255,.2); color:white; backdrop-filter:blur(8px); }
        .nav-link.inactive-t { color:rgba(15,23,42,.75); }
        .nav-link.inactive-t:hover { color:#0D9488; background:rgba(255,255,255,.55); }

        .nav-admin-badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 10px; border-radius:100px; font-size:10px; font-weight:800;
          letter-spacing:.06em; text-transform:uppercase;
          background:#CCFBF1; color:#0F766E; border:1px solid rgba(13,148,136,.2); margin-right:8px;
        }
        .nav-admin-badge .adot { width:5px; height:5px; border-radius:50%; background:#0D9488; animation:abdot 2s ease infinite; }
        @keyframes abdot { 0%,100%{opacity:1} 50%{opacity:.3} }

        .nav-dot { width:4px; height:4px; border-radius:50%; background:rgba(13,148,136,.3); margin:0 2px; }

        .nav-logout-btn {
          margin-left:6px; padding:7px 14px; border-radius:100px;
          font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
          display:flex; align-items:center; gap:6px;
          color:#64748B; border:1.5px solid #E2E8F0;
          background:none; cursor:pointer; transition:all .22s;
        }
        .nav-logout-btn:hover {
          color:#E11D48; border-color:rgba(225,29,72,.3);
          background:#FFF1F2; transform:scale(1.04);
        }
        .nav-logout-btn svg { width:13px; height:13px; }

        /* ── Mobile ── */
        @media (max-width:640px) { .nav-links{display:none;} .nav-mob-btn{display:flex;} }
        @media (min-width:641px) { .nav-mob-btn{display:none;} .nav-mob-menu{display:none;} }
        .nav-mob-btn {
          background:none; border:none; cursor:pointer; padding:6px; border-radius:8px;
          flex-direction:column; gap:4px; align-items:center; justify-content:center; transition:background .2s;
        }
        .nav-mob-btn:hover { background:rgba(13,148,136,.08); }
        .nav-mob-btn span { display:block; width:20px; height:2px; border-radius:2px; background:#0D9488; transition:all .25s; }
        .nav-mob-menu {
          position:absolute; top:68px; left:0; right:0;
          background:rgba(255,255,255,.97); backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(13,148,136,.1);
          box-shadow:0 16px 40px rgba(13,148,136,.1); padding:12px 20px 20px;
        }
        .nav-mob-link {
          display:block; width:100%; text-align:left; padding:12px 16px; border-radius:12px;
          font-size:15px; font-weight:600; background:none; border:none; cursor:pointer;
          font-family:'Plus Jakarta Sans',sans-serif; color:#475569; transition:all .2s; margin-bottom:4px;
        }
        .nav-mob-link:hover { background:rgba(13,148,136,.08); color:#0D9488; }
        .nav-mob-link.active { background:linear-gradient(135deg,#0D9488,#0F766E); color:white; }

        /* 
           LOGOUT MODAL
         */
        .lm-overlay {
          position:fixed; inset:0; z-index:999;
          background:rgba(15,23,42,.45);
          backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center; padding:20px;
          animation:lmFadeIn .2s ease both;
        }
        @keyframes lmFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes lmSlideUp { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .lm-card {
          background:white; border-radius:24px; width:100%; max-width:400px;
          box-shadow:0 32px 80px rgba(15,23,42,.18), 0 8px 24px rgba(0,0,0,.06);
          overflow:hidden;
          animation:lmSlideUp .28s cubic-bezier(.22,1,.36,1) both;
        }

        /* Coloured top strip */
        .lm-strip {
          height:5px;
          background:linear-gradient(90deg, #0D9488, #F97316);
        }

        .lm-body { padding:32px 32px 28px; }

        .lm-icon-wrap {
          width:56px; height:56px; border-radius:16px; margin-bottom:20px;
          background:linear-gradient(135deg,#FFF1F2,#FFE4E6);
          border:1.5px solid rgba(225,29,72,.12);
          display:flex; align-items:center; justify-content:center;
        }
        .lm-icon-wrap svg { width:24px; height:24px; color:#E11D48; }

        .lm-title {
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:20px; font-weight:800; color:#0F172A; margin-bottom:8px;
        }
        .lm-desc {
          font-size:14px; color:#64748B; line-height:1.7; margin-bottom:28px;
        }
        .lm-desc strong { color:#0F172A; font-weight:700; }

        /* Session info pill */
        .lm-session {
          display:flex; align-items:center; gap:10px;
          padding:12px 16px; border-radius:12px;
          background:#F8FAFC; border:1.5px solid #F1F5F9;
          margin-bottom:28px;
        }
        .lm-session-dot { width:8px; height:8px; border-radius:50%; background:#0D9488; box-shadow:0 0 0 3px rgba(13,148,136,.15); flex-shrink:0; }
        .lm-session-text { font-size:13px; color:#475569; }
        .lm-session-text strong { color:#0F172A; font-weight:700; }

        .lm-actions { display:flex; gap:10px; }

        .lm-btn-cancel {
          flex:1; padding:13px; border-radius:12px; font-size:14px; font-weight:700;
          font-family:'Plus Jakarta Sans',sans-serif;
          background:white; color:#475569;
          border:1.5px solid #E2E8F0; cursor:pointer; transition:all .2s;
        }
        .lm-btn-cancel:hover { background:#F8FAFC; border-color:#CBD5E1; color:#0F172A; }
        .lm-btn-cancel:active { transform:scale(.97); }

        .lm-btn-logout {
          flex:1.4; padding:13px; border-radius:12px; font-size:14px; font-weight:700;
          font-family:'Plus Jakarta Sans',sans-serif;
          background:linear-gradient(135deg,#E11D48,#BE123C);
          color:white; border:none; cursor:pointer;
          box-shadow:0 6px 18px rgba(225,29,72,.28); transition:all .2s;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .lm-btn-logout:hover { box-shadow:0 8px 24px rgba(225,29,72,.4); transform:translateY(-1px); }
        .lm-btn-logout:active { transform:scale(.97); }
        .lm-btn-logout svg { width:15px; height:15px; }
      `}</style>

      {/*  Navbar  */}
      <nav className={`nav-root ${solid ? "solid" : "transparent"}`}>
        <div className="nav-inner">

          <button className="nav-logo" onClick={() => handleNav("Home")}>
<img
  src="/goa-uni-logo.png"
  alt="Goa University"
  style={{
    width: 56,
    height: 66,
    objectFit: "contain",
  }}
/>  



          <span className="nav-logo-text" style={{ color: solid ? "#0F172A" : "#0F172A" }}>
              SkillMap<span className="org"> Goa</span>
            </span>
          </button>

          <div className="nav-links">
            {isAdmin && (
              <span className="nav-admin-badge">
                <span className="adot" /> Admin
              </span>
            )}





            {links.map(label => {
              const active = currentPage === label;
              let cls = "nav-link ";
              if (active)  cls += solid ? "active-s"   : "active-t";
              else         cls += solid ? "inactive-s"  : "inactive-t";
              return (
                <button key={label} className={cls} onClick={() => handleNav(label)}>{label}</button>
              );
            })}

            {isAdmin && (
              <>
                <div className="nav-dot" />
                <button
                  className="nav-logout-btn"
                  onClick={() => setShowLogoutModal(true)}
                  title="Sign out"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="nav-mob-btn" onClick={() => setMenuOpen(o => !o)}>
            <span style={menuOpen ? { transform:"rotate(45deg) translate(4px,4px)" } : {}} />
            <span style={menuOpen ? { opacity:0 } : {}} />
            <span style={menuOpen ? { transform:"rotate(-45deg) translate(4px,-4px)" } : {}} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="nav-mob-menu">
            {links.map(label => (
              <button key={label} className={`nav-mob-link ${currentPage===label?"active":""}`} onClick={() => handleNav(label)}>
                {label}
              </button>
            ))}
            {isAdmin && (
              <button
                className="nav-mob-link"
                style={{ color:"#E11D48", marginTop:8, borderTop:"1px solid #F1F5F9", paddingTop:16 }}
                onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </nav>

      {/* 
          LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="lm-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="lm-card" onClick={e => e.stopPropagation()}>

            <div className="lm-strip" />

            <div className="lm-body">
              {/* Icon */}
              <div className="lm-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>

              <div className="lm-title">Sign out of SkillMap Goa?</div>
              <p className="lm-desc">
                You're about to end your admin session. Any <strong>unsaved changes</strong> will be lost.
                You can sign back in at any time.
              </p>

              {/* Active session indicator */}
              <div className="lm-session">
                <span className="lm-session-dot" />
                <span className="lm-session-text">
                  Signed in as <strong>admin</strong> · Session active
                </span>
              </div>

              {/* Actions */}
              <div className="lm-actions">
                <button className="lm-btn-cancel" onClick={() => setShowLogoutModal(false)}>
                  Stay signed in
                </button>
                <button className="lm-btn-logout" onClick={confirmLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Yes, sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

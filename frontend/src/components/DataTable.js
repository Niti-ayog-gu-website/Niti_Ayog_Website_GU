import { useState, useMemo } from "react"; //memo for cache

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .dt-root { font-family:'Plus Jakarta Sans',sans-serif; }
  .dt-filterbar { background:white;border:1.5px solid #E2E8F0;border-radius:20px;padding:20px 24px;margin-bottom:16px; }
  .dt-filter-top { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px; }
  .dt-filter-title { font-size:13px;font-weight:700;color:#0F172A;display:flex;align-items:center;gap:8px; }
  .dt-filter-title svg { width:15px;height:15px;color:#0D9488; }
  .dt-filter-actions { display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
  .dt-search-wrap { position:relative; }
  .dt-search-icon { position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94A3B8; }
  .dt-search-icon svg { width:14px;height:14px; }
  .dt-search { padding:9px 14px 9px 36px;border:1.5px solid #E2E8F0;border-radius:100px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:#0F172A;outline:none;width:220px;background:white;transition:all .2s; }
  .dt-search:focus { border-color:#0D9488;box-shadow:0 0 0 3px rgba(13,148,136,.08);width:260px; }
  .dt-search::placeholder { color:#CBD5E1; }
  .dt-clear { padding:9px 16px;border-radius:100px;font-size:12px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;color:#E11D48;border:1.5px solid rgba(225,29,72,.2);background:#FFF1F2;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px; }
  .dt-clear:hover { background:#FFE4E6;border-color:rgba(225,29,72,.4); }
  .dt-clear svg { width:12px;height:12px; }
  .dt-toggle-filters { padding:9px 16px;border-radius:100px;font-size:12px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;color:#0D9488;border:1.5px solid rgba(13,148,136,.25);background:#F0FDFA;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px; }
  .dt-toggle-filters:hover { background:#CCFBF1; }
  .dt-toggle-filters svg { width:13px;height:13px; }
  .dt-filter-count { display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:800;background:#0D9488;color:white; }
  .dt-filters-panel { margin-top:16px;padding-top:16px;border-top:1px solid #F1F5F9;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px; }
  .dt-filter-group { display:flex;flex-direction:column;gap:5px; }
  .dt-filter-label { font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94A3B8; }
  .dt-filter-select { padding:9px 32px 9px 12px;border:1.5px solid #E2E8F0;border-radius:10px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;color:#0F172A;background:white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 10px center;appearance:none;-webkit-appearance:none;outline:none;cursor:pointer;transition:all .2s; }
  .dt-filter-select:focus { border-color:#0D9488;box-shadow:0 0 0 3px rgba(13,148,136,.08); }
  .dt-filter-select.active { border-color:#0D9488;background-color:#F0FDFA;color:#0F766E;font-weight:600; }
  .dt-chips { display:flex;flex-wrap:wrap;gap:6px;margin-top:12px; }
  .dt-chip { display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:100px;font-size:12px;font-weight:600;background:#F0FDFA;color:#0F766E;border:1px solid rgba(13,148,136,.2); }
  .dt-chip-x { background:none;border:none;cursor:pointer;color:#0D9488;display:flex;align-items:center;padding:0;font-size:14px;line-height:1;transition:color .2s; }
  .dt-chip-x:hover { color:#E11D48; }

  /* Table */
  .dt-table-wrap { background:white;border:1.5px solid #E2E8F0;border-radius:20px;overflow:hidden; }
  .dt-table-header { padding:16px 24px;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px; }
  .dt-result-count { font-size:13px;color:#64748B; }
  .dt-result-count strong { color:#0F172A;font-weight:700; }
  .dt-table { width:100%;border-collapse:collapse;font-size:13px; }
  .dt-table thead tr { background:#F8FAFC; }
  .dt-table thead th { padding:12px 16px;text-align:left;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94A3B8;white-space:nowrap;border-bottom:1px solid #F1F5F9; }
  .dt-table tbody tr { border-bottom:1px solid #F8FAFC;transition:background .15s;cursor:pointer; }
  .dt-table tbody tr:hover { background:#F0FDFA; }
  .dt-table tbody tr:last-child { border-bottom:none; }
  .dt-table td { padding:13px 16px;vertical-align:middle; }
  .dt-num { font-size:11px;color:#CBD5E1;font-family:monospace; }
  .dt-empty { text-align:center;padding:60px 20px;color:#CBD5E1;font-size:14px; }
  .dt-empty-icon { font-size:40px;display:block;margin-bottom:12px; }
  @keyframes rowIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .dt-row-anim { animation:rowIn .25s ease both; }

  /* ── Pagination ── */
  .dt-pagination {
    padding:16px 24px;
    border-top:1px solid #F1F5F9;
    display:flex;
    align-items:center;
    justify-content:space-between;
    flex-wrap:wrap;
    gap:12px;
  }
  .dt-page-info { font-size:12px;color:#94A3B8; }
  .dt-page-info strong { color:#0F172A;font-weight:700; }
  .dt-page-controls { display:flex;align-items:center;gap:4px; }
  .dt-page-btn {
    min-width:36px;height:36px;border-radius:10px;
    display:inline-flex;align-items:center;justify-content:center;
    font-size:13px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;
    border:1.5px solid #E2E8F0;background:white;color:#475569;
    cursor:pointer;transition:all .2s;padding:0 10px;
  }
  .dt-page-btn:hover:not(:disabled) { border-color:#0D9488;color:#0D9488;background:#F0FDFA; }
  .dt-page-btn:disabled { opacity:.35;cursor:not-allowed; }
  .dt-page-btn.active { background:linear-gradient(135deg,#0D9488,#0F766E);color:white;border-color:transparent;box-shadow:0 4px 12px rgba(13,148,136,.25); }
  .dt-page-btn.active:hover { background:linear-gradient(135deg,#0D9488,#0F766E); }
  .dt-page-ellipsis { font-size:13px;color:#CBD5E1;padding:0 4px;user-select:none; }
  .dt-page-nav {
    display:inline-flex;align-items:center;gap:6px;
    padding:8px 16px;border-radius:100px;
    font-size:13px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;
    border:1.5px solid #E2E8F0;background:white;color:#475569;
    cursor:pointer;transition:all .2s;
  }
  .dt-page-nav:hover:not(:disabled) { border-color:#0D9488;color:#0D9488;background:#F0FDFA;transform:translateY(-1px); }
  .dt-page-nav:disabled { opacity:.35;cursor:not-allowed; }
  .dt-page-nav svg { width:14px;height:14px; }

  /* Footer */
  .dt-footer { padding:10px 24px;font-size:11px;color:#94A3B8;border-top:1px solid #F8FAFC; }

  /* Modal */
  .dt-modal-overlay { position:fixed;inset:0;z-index:999;background:rgba(15,23,42,.5);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:dtFade .2s ease both; }
  @keyframes dtFade  { from{opacity:0}to{opacity:1} }
  @keyframes dtSlide { from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)} }
  .dt-modal-card { background:white;border-radius:24px;width:100%;max-width:520px;max-height:88vh;overflow-y:auto;box-shadow:0 32px 80px rgba(15,23,42,.18);animation:dtSlide .28s cubic-bezier(.22,1,.36,1) both; }
  .dt-modal-strip { height:5px;background:linear-gradient(90deg,#0D9488,#F97316); }
  .dt-modal-body { padding:28px 32px 32px; }
  .dt-modal-close { width:100%;padding:13px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;background:white;color:#475569;border:1.5px solid #E2E8F0;cursor:pointer;transition:all .2s;margin-top:20px; }
  .dt-modal-close:hover { background:#F8FAFC;color:#0F172A; }
`;

const PAGE_SIZE = 5; //shows 5 rows per page

export function Badge({ label }) {
  const palette = {
    Unemployed:    { bg:"#FFF1F2", c:"#BE123C", b:"rgba(225,29,72,.15)"  },
    Employed:      { bg:"#F0FDF4", c:"#16A34A", b:"rgba(22,163,74,.15)"  },
    Underemployed: { bg:"#FFF7ED", c:"#C2410C", b:"rgba(249,115,22,.2)"  },
    Female:        { bg:"#FDF4FF", c:"#9333EA", b:"rgba(147,51,234,.15)" },
    Male:          { bg:"#EFF6FF", c:"#1D4ED8", b:"rgba(29,78,216,.15)"  },
    Other:         { bg:"#F8FAFC", c:"#475569", b:"#E2E8F0"              },
    Technology:    { bg:"#EFF6FF", c:"#1D4ED8", b:"rgba(29,78,216,.15)"  },
    Research:      { bg:"#F5F3FF", c:"#7C3AED", b:"rgba(124,58,237,.15)" },
    Tourism:       { bg:"#F0FDFA", c:"#0F766E", b:"rgba(13,148,136,.15)" },
    Finance:       { bg:"#FFF7ED", c:"#C2410C", b:"rgba(249,115,22,.2)"  },
    Manufacturing: { bg:"#F8FAFC", c:"#475569", b:"#E2E8F0"              },
    Education:     { bg:"#FDF4FF", c:"#9333EA", b:"rgba(147,51,234,.15)" },
  };
  const s = palette[label] || { bg:"#F8FAFC", c:"#64748B", b:"#E2E8F0" };
  return (
    <span style={{ display:"inline-flex", padding:"3px 10px", borderRadius:100, fontSize:12, fontWeight:700, background:s.bg, color:s.c, border:`1px solid ${s.b}` }}>
      {label}
    </span>
  );
}

function MultiFilter({ filters, activeFilters, onFilterChange, onClear, search, onSearch }) {
  const [open, setOpen] = useState(true);
  const activeCount = Object.values(activeFilters).filter(v => v !== "All").length;
  return (
    <div className="dt-filterbar">
      <div className="dt-filter-top">
        <div className="dt-filter-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filters {activeCount > 0 && <span className="dt-filter-count">{activeCount}</span>}
        </div>
        <div className="dt-filter-actions">
          <div className="dt-search-wrap">
            <span className="dt-search-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
            <input className="dt-search" placeholder="Search records..." value={search} onChange={e => onSearch(e.target.value)} />
          </div>
          <button className="dt-toggle-filters" onClick={() => setOpen(o => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{open ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}</svg>
            {open ? "Hide" : "Show"} Filters
          </button>
          {(activeCount > 0 || search) && (
            <button className="dt-clear" onClick={onClear}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Clear All
            </button>
          )}
        </div>
      </div>
      {open && (
        <div className="dt-filters-panel">
          {filters.map(f => (
            <div key={f.key} className="dt-filter-group">
              <label className="dt-filter-label">{f.label}</label>
              <select className={`dt-filter-select ${activeFilters[f.key] !== "All" ? "active" : ""}`} value={activeFilters[f.key]} onChange={e => onFilterChange(f.key, e.target.value)}>
                <option value="All">All {f.label}s</option>
                {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
      {activeCount > 0 && (
        <div className="dt-chips">
          {filters.filter(f => activeFilters[f.key] !== "All").map(f => (
            <span key={f.key} className="dt-chip">
              <span style={{ color:"#94A3B8", fontSize:10, fontWeight:700, textTransform:"uppercase" }}>{f.label}:</span>
              {activeFilters[f.key]}
              <button className="dt-chip-x" onClick={() => onFilterChange(f.key, "All")}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page number buttons 
function PageNumbers({ current, total, onChange }) {
  if (total <= 1) return null;

  const pages = [];

  if (total <= 7) {
    // Show all pages
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    // Smart truncation — always show first, last, current ±1
    const show = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total));
    const sorted = [...show].sort((a, b) => a - b);

    for (let i = 0; i < sorted.length; i++) {
      pages.push(sorted[i]);
      if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
        pages.push("…");
      }
    }
  }

  return (
    <div className="dt-page-controls">
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} className="dt-page-ellipsis">…</span>
          : (
            <button
              key={p}
              className={`dt-page-btn ${current === p ? "active" : ""}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          )
      )}
    </div>
  );
}

// ── Main DataTable 
export default function DataTable({ columns, rows, filters = [], searchKeys = [], onRowClick, footer }) {
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage]         = useState(1);

  const initFilters = useMemo(() => {
    const obj = {};
    filters.forEach(f => { obj[f.key] = "All"; });
    return obj;
  }, [filters]);

  const [activeFilters, setActiveFilters] = useState(initFilters);

  const handleFilterChange = (key, val) => {
    setActiveFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const handleClear = () => {
    setActiveFilters(initFilters);
    setSearch("");
    setPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const filtered = useMemo(() => {
    return rows.filter(row => {
      const passFilters = filters.every(f => {
        if (activeFilters[f.key] === "All") return true;
        return String(row[f.key]) === activeFilters[f.key];
      });
      if (!passFilters) return false;
      if (!search.trim()) return true;
      return searchKeys.some(k => String(row[k] ?? "").toLowerCase().includes(search.toLowerCase()));
    });
  }, [rows, activeFilters, search, filters, searchKeys]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const start       = (safePage - 1) * PAGE_SIZE;
  const displayed   = filtered.slice(start, start + PAGE_SIZE);
  const from        = filtered.length === 0 ? 0 : start + 1;
  const to          = Math.min(start + PAGE_SIZE, filtered.length);

  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)));

  const handleRowClick = (row) => {
    if (onRowClick) onRowClick(row);
    else setSelected(row);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="dt-root">

        {(filters.length > 0 || searchKeys.length > 0) && (
          <MultiFilter
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClear={handleClear}
            search={search}
            onSearch={handleSearch}
          />
        )}

        <div className="dt-table-wrap">
          {/* Header */}
          <div className="dt-table-header">
            <div className="dt-result-count">
              {filtered.length === 0
                ? "No records found"
                : <>Showing <strong>{from}–{to}</strong> of <strong>{filtered.length}</strong> records</>
              }
              {filtered.length !== rows.length && (
                <span style={{ marginLeft:8, fontSize:11, color:"#0D9488", fontWeight:600 }}>
                  ({rows.length - filtered.length} filtered out)
                </span>
              )}
            </div>
            {/* Per-page info */}
            {filtered.length > 0 && (
              <span style={{ fontSize:12, color:"#94A3B8" }}>
                Page <strong style={{ color:"#0F172A" }}>{safePage}</strong> of <strong style={{ color:"#0F172A" }}>{totalPages}</strong>
              </span>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX:"auto" }}>
            <table className="dt-table">
              <thead>
                <tr>
                  <th>#</th>
                  {columns.map(col => <th key={col.key}>{col.label}</th>)}
                  <th />
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 2} className="dt-empty">
                      <span className="dt-empty-icon">🔍</span>
                      No records match your filters.
                      <br />
                      <button onClick={handleClear} style={{ marginTop:12, padding:"8px 20px", borderRadius:100, border:"1.5px solid #E2E8F0", background:"white", fontSize:13, fontWeight:600, color:"#0D9488", cursor:"pointer", fontFamily:"inherit" }}>
                        Clear all filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  displayed.map((row, i) => (
                    <tr
                      key={row.id ?? i}
                      className="dt-row-anim"
                      style={{ animationDelay:`${i * 40}ms` }}
                      onClick={() => handleRowClick(row)}
                    >
                      <td className="dt-num">{String(start + i + 1).padStart(2, "0")}</td>
                      {columns.map(col => (
                        <td key={col.key}>
                          {col.render
                            ? col.render(row[col.key], row)
                            : <span style={{ color:"#475569" }}>{row[col.key]}</span>
                          }
                        </td>
                      ))}
                      <td style={{ color:"#0D9488", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>View →</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination bar ── */}
          {filtered.length > PAGE_SIZE && (
            <div className="dt-pagination">
              {/* Previous */}
              <button
                className="dt-page-nav"
                onClick={() => goTo(safePage - 1)}
                disabled={safePage === 1}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Previous
              </button>

              {/* Page numbers */}
              <PageNumbers current={safePage} total={totalPages} onChange={goTo} />

              {/* Next */}
              <button
                className="dt-page-nav"
                onClick={() => goTo(safePage + 1)}
                disabled={safePage === totalPages}
              >
                Next
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          )}

          {footer && <div className="dt-footer">{footer}</div>}
        </div>
      </div>

      {/* Default modal */}
      {!onRowClick && selected && (
        <div className="dt-modal-overlay" onClick={() => setSelected(null)}>
          <div className="dt-modal-card" onClick={e => e.stopPropagation()}>
            <div className="dt-modal-strip" />
            <div className="dt-modal-body">
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#0D9488,#0891B2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"white", flexShrink:0 }}>
                  {(selected.name ?? "?").split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <div style={{ fontWeight:800, color:"#0F172A", fontSize:17 }}>{selected.name}</div>
                  <div style={{ fontSize:13, color:"#64748B" }}>{selected.email ?? ""}</div>
                </div>
              </div>
              {columns.map(col => (
                <div key={col.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid #F8FAFC" }}>
                  <span style={{ fontSize:12, color:"#94A3B8", fontWeight:600 }}>{col.label}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#0F172A", textAlign:"right", maxWidth:"60%" }}>
                    {col.render ? col.render(selected[col.key], selected) : selected[col.key]}
                  </span>
                </div>
              ))}
              <button className="dt-modal-close" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// pages/PlacementPrep.jsx — Backend connected · UI unchanged
// Replaces: hardcoded POPULAR_COMPANIES from placementData.js
// Now fetches: GET /api/placement/popular/
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout";
import { fetchPopularCompanies } from "../services/placementService";

export default function PlacementPrep() {
  const navigate = useNavigate();
  const [query, setQuery]     = useState("");
  const [focused, setFocused] = useState(false);
  const [companies, setCompanies] = useState([]);   // ← from backend
  const [loading, setLoading]     = useState(true);
  const inputRef = useRef(null);

  // Fetch popular companies on mount
  useEffect(() => {
    fetchPopularCompanies()
      .then(setCompanies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim().length > 0
    ? companies.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSearch = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = trimmed.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    navigate(`/PlacementPrep/${id}`);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSearch(query); };

  return (
    <PageLayout activeRoute="/PlacementPrep">
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn    { from{opacity:0;transform:scale(0.97) translateY(-6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .pp-page { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .search-wrapper { position: relative; max-width: 620px; margin: 0 auto; }
        .search-input {
          width: 100%; background: #161616; border: 1.5px solid #2a2a2a;
          border-radius: 16px; padding: 16px 56px 16px 52px;
          color: #fff; font-size: 16px; outline: none; font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus { border-color: rgba(255,214,0,0.6); box-shadow: 0 0 0 3px rgba(255,214,0,0.08), 0 8px 30px rgba(0,0,0,0.4); }
        .search-input::placeholder { color: #3a3a3a; }
        .search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #444; pointer-events: none; }
        .search-go-btn {
          position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
          background: #FFD600; color: #000; border: none; border-radius: 10px;
          padding: 8px 16px; font-weight: 800; font-size: 13px; cursor: pointer;
          transition: all 0.18s; font-family: 'Inter', sans-serif;
        }
        .search-go-btn:hover { background: #ffe033; box-shadow: 0 0 14px rgba(255,214,0,0.4); }
        .search-go-btn:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }
        .dropdown-list {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          background: #161616; border: 1px solid #2a2a2a; border-radius: 14px;
          overflow: hidden; z-index: 50; box-shadow: 0 20px 50px rgba(0,0,0,0.7);
          animation: popIn 0.2s ease forwards;
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; cursor: pointer; transition: background 0.15s;
          border-bottom: 1px solid #1e1e1e;
        }
        .dropdown-item:last-child { border-bottom: none; }
        .dropdown-item:hover { background: rgba(255,214,0,0.06); }
        .popular-chip {
          display: flex; align-items: center; gap: 8px;
          background: #111; border: 1px solid #1f1f1f; border-radius: 12px;
          padding: 10px 16px; cursor: pointer; transition: all 0.18s;
          font-size: 13px; font-weight: 600; color: #888;
        }
        .popular-chip:hover { border-color: rgba(255,214,0,0.3); color: #FFD600; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
        .stat-chip { background: #111; border: 1px solid #1f1f1f; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; }
        .chip-skeleton { height: 44px; border-radius: 12px; background: linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      <div className="pp-page">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40, paddingTop: 16 }}>
          <span style={{ fontSize: 40, display: "block", marginBottom: 14 }}>🎯</span>
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.08em", marginBottom: 10 }}>
            PLACEMENT PREP
          </h1>
          <p style={{ color: "#555", fontSize: 14, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Search any company to get a complete interview guide — rounds, syllabus, PYQs, and tips.
          </p>
        </div>

        {/* Search bar */}
        <div className="search-wrapper" style={{ marginBottom: 48 }}>
          <span className="search-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth={2} />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeWidth={2} />
            </svg>
          </span>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search any company — Google, TCS, Startup..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={handleKey}
            autoComplete="off"
          />
          <button className="search-go-btn" disabled={!query.trim()} onClick={() => handleSearch(query)}>
            Go →
          </button>

          {/* Autocomplete dropdown — from real backend companies */}
          {focused && filtered.length > 0 && (
            <div className="dropdown-list">
              {filtered.map(c => (
                <div key={c.id} className="dropdown-item" onMouseDown={() => handleSearch(c.name)}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${c.color}18`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: c.color, fontWeight: 900, fontSize: 13 }}>{c.logo}</span>
                  </div>
                  <span style={{ color: "#ccc", fontSize: 14 }}>{c.name}</span>
                  <span style={{ marginLeft: "auto", color: "#444", fontSize: 12 }}>View Guide →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12, marginBottom: 40, maxWidth: 700, margin: "0 auto 40px" }}>
          {[["🏢","Any","Company"],["🔄","3–5","Avg Rounds"],["📝","PYQs","Included"],["💡","Tips","Per Company"]].map(([icon,val,lbl]) => (
            <div key={lbl} className="stat-chip">
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div>
                <p style={{ color: "#FFD600", fontWeight: 800, fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>{val}</p>
                <p style={{ color: "#444", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{lbl}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Popular companies — real data or skeletons */}
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16, textAlign: "center" }}>
            Popular Searches
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {loading
              ? Array(12).fill(0).map((_, i) => <div key={i} className="chip-skeleton" style={{ width: 100 }} />)
              : companies.map(c => (
                  <div key={c.id} className="popular-chip" onClick={() => handleSearch(c.name)}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: `${c.color}18`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: c.color, fontWeight: 900, fontSize: 10 }}>{c.logo}</span>
                    </div>
                    {c.name}
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
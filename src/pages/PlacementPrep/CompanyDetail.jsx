// pages/PlacementPrep/CompanyDetail.jsx — Backend connected · UI unchanged
// Replaces: getCompanyDetail() / generateGenericDetail() from placementData.js
// Now fetches: GET /api/placement/company/:companyId/  (Gemini-generated, cached)
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../PageLayout";
import { fetchCompanyGuide } from "../../services/placementService";

const TABS = [
  { id: "overview",  label: "Overview",   icon: "🏢" },
  { id: "rounds",    label: "Rounds",     icon: "🔄" },
  { id: "pyqs",      label: "PYQs",       icon: "📝" },
  { id: "tips",      label: "Tips",       icon: "💡" },
  { id: "resources", label: "Resources",  icon: "🔗" },
];

const diffColor  = { Easy: "#1dd1a1", Medium: "#ff9f43", Hard: "#ff6b6b" };
const typeColor  = { OA: "#54a0ff", Technical: "#FFD600", Behavioral: "#a29bfe", HR: "#1dd1a1", System: "#ff9f43" };
const freqColor  = { High: "#FFD600", Medium: "#ff9f43", Low: "#555" };

// Skeleton block
const Sk = ({ w = "100%", h = 14, mb = 0, radius = 6 }) => (
  <div style={{ width: w, height: h, marginBottom: mb, borderRadius: radius, background: "linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
);

export default function CompanyDetail() {
  const { companyId } = useParams();
  const navigate      = useNavigate();
  const [activeTab, setActiveTab]   = useState("overview");
  const [pyqFilter, setPyqFilter]   = useState("All");
  const [guide, setGuide]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchCompanyGuide(companyId)
      .then(setGuide)
      .catch(err => setError(err?.response?.data?.detail || "Failed to load company guide."))
      .finally(() => setLoading(false));
  }, [companyId]);

  const color = "#FFD600"; // fallback until guide loads

  // ── Loading state ──────────────────────────────────────────
  if (loading) return (
    <PageLayout activeRoute="/PlacementPrep">
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Sk w={160} h={32} mb={24} />
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 22, padding: 28 }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <Sk w={68} h={68} radius={20} />
            <div style={{ flex: 1 }}>
              <Sk h={24} mb={10} w="40%" />
              <Sk h={14} mb={8} w="70%" />
              <Sk h={14} w="50%" />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>{Array(5).fill(0).map((_,i) => <Sk key={i} w={90} h={36} radius={10} />)}</div>
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 16, padding: 22 }}>
          {Array(4).fill(0).map((_,i) => <Sk key={i} h={14} mb={12} w={i % 2 === 0 ? "80%" : "60%"} />)}
        </div>
      </div>
    </PageLayout>
  );

  // ── Error state ────────────────────────────────────────────
  if (error) return (
    <PageLayout activeRoute="/PlacementPrep">
      <button onClick={() => navigate("/PlacementPrep")} style={{ background: "#161616", border: "1px solid #2a2a2a", color: "#666", borderRadius: 9, padding: "7px 14px", fontSize: 12, cursor: "pointer", marginBottom: 20 }}>
        ← Back
      </button>
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>😕</p>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Couldn't load guide</p>
        <p style={{ fontSize: 13, marginBottom: 20 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ background: "#FFD600", color: "#000", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>
          Try Again
        </button>
      </div>
    </PageLayout>
  );

  // ── Map backend response fields ────────────────────────────
  const name       = guide.name || companyId;
  const gColor     = "#FFD600";
  const tagline    = guide.tagline || "";
  const about      = guide.about || "";
  const rounds     = guide.rounds_detail_list || [];
  const pyqs       = guide.pyqs || [];
  const tips       = guide.tips || [];
  const resources  = guide.resources || [];
  const roles      = guide.roles || [];
  const difficulty = guide.difficulty || "Medium";
  const pkg        = guide.package || "";

  const pyqTags     = ["All", ...new Set(pyqs.map(p => p.tag))];
  const filteredPyqs = pyqs.filter(p => pyqFilter === "All" || p.tag === pyqFilter);

  return (
    <PageLayout activeRoute="/PlacementPrep">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .cd-page { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .crumb-btn { display: inline-flex; align-items: center; gap: 6px; background: #161616; border: 1px solid #2a2a2a; color: #666; border-radius: 9px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif; }
        .crumb-btn:hover { border-color: rgba(255,214,0,0.35); color: #FFD600; background: rgba(255,214,0,0.06); }
        .tab-btn { display: flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; border: 1px solid #2a2a2a; background: #161616; color: #666; transition: all 0.18s; white-space: nowrap; font-family: 'Inter', sans-serif; }
        .tab-btn:hover { border-color: rgba(255,214,0,0.3); color: #FFD600; background: rgba(255,214,0,0.06); }
        .tab-btn.active { background: #FFD600; color: #000; border-color: #FFD600; box-shadow: 0 0 14px rgba(255,214,0,0.3); }
        .section-card { background: #111; border: 1px solid #1f1f1f; border-radius: 16px; padding: 22px; }
        .section-label { color: #555; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 14px; }
        .round-card { background: #0e0e0e; border: 1px solid #1f1f1f; border-radius: 14px; padding: 20px; transition: border-color 0.2s; margin-bottom: 10px; }
        .round-card:hover { border-color: rgba(255,214,0,0.2); }
        .round-card:last-child { margin-bottom: 0; }
        .pyq-card { background: #0e0e0e; border: 1px solid #1f1f1f; border-radius: 12px; padding: 16px 18px; transition: border-color 0.2s; margin-bottom: 8px; }
        .pyq-card:hover { border-color: rgba(255,214,0,0.2); }
        .pyq-card:last-child { margin-bottom: 0; }
        .filter-pill { padding: 5px 14px; border-radius: 99px; font-size: 11px; font-weight: 700; cursor: pointer; border: 1px solid #2a2a2a; background: #161616; color: #666; transition: all 0.15s; font-family: 'Inter', sans-serif; }
        .filter-pill:hover { color: #FFD600; border-color: rgba(255,214,0,0.3); }
        .filter-pill.active { background: #FFD600; color: #000; border-color: #FFD600; }
        .tip-item { display: flex; gap: 12px; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #1a1a1a; }
        .tip-item:last-child { border-bottom: none; padding-bottom: 0; }
        .resource-row { display: flex; align-items: center; gap: 14px; background: #0e0e0e; border: 1px solid #1f1f1f; border-radius: 12px; padding: 15px 18px; cursor: pointer; transition: all 0.18s; margin-bottom: 8px; }
        .resource-row:hover { border-color: rgba(255,214,0,0.25); transform: translateX(4px); }
        .resource-row:last-child { margin-bottom: 0; }
      `}</style>

      <div className="cd-page">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button className="crumb-btn" onClick={() => navigate("/PlacementPrep")}>🎯 Search</button>
          <span style={{ color: "#2a2a2a" }}>›</span>
          <span style={{ color: gColor, fontSize: 13, fontWeight: 700 }}>{name}</span>
        </div>

        {/* Hero banner */}
        <div style={{ background: "#111", border: `1px solid ${gColor}22`, borderRadius: 22, padding: "28px 28px 24px", marginBottom: 24, boxShadow: `0 0 50px ${gColor}08` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, background: `${gColor}18`, border: `2px solid ${gColor}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 20px ${gColor}15` }}>
              <span style={{ color: gColor, fontWeight: 900, fontSize: 22 }}>{name[0]}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 24, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em" }}>{name}</h1>
                <span style={{ background: "rgba(255,214,0,0.1)", color: "#FFD600", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(255,214,0,0.2)" }}>{difficulty}</span>
              </div>
              <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6, marginBottom: 16, maxWidth: 560, fontStyle: "italic" }}>{tagline}</p>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[["🔄", `${rounds.length} Rounds`], ["💰", pkg], ["🎯", difficulty]].filter(([,v]) => v).map(([icon, val]) => (
                  <div key={val} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ color: "#bbb", fontSize: 13, fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Roles */}
          {roles.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #1a1a1a" }}>
              <p style={{ color: "#444", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Hiring For</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {roles.map(r => (
                  <span key={r} style={{ background: `${gColor}10`, color: gColor, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 7, border: `1px solid ${gColor}22` }}>{r}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="section-card">
              <p className="section-label">About</p>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.85 }}>{about}</p>
            </div>
            {rounds.length > 0 && (
              <div className="section-card">
                <p className="section-label">Interview Rounds at a Glance</p>
                {rounds.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: i < rounds.length - 1 ? 16 : 0, marginBottom: i < rounds.length - 1 ? 16 : 0, borderBottom: i < rounds.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: `${gColor}15`, border: `1px solid ${gColor}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: gColor, fontWeight: 900, fontSize: 13, fontFamily: "'Bebas Neue',sans-serif" }}>{i + 1}</span>
                      </div>
                      {i < rounds.length - 1 && <div style={{ width: 2, flex: 1, background: "#1e1e1e", marginTop: 6, minHeight: 16 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{r.name}</p>
                        <span style={{ background: `${typeColor[r.type] || "#888"}18`, color: typeColor[r.type] || "#888", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5 }}>{r.type}</span>
                        {r.duration && <span style={{ color: "#444", fontSize: 11 }}>⏱ {r.duration}</span>}
                      </div>
                      <p style={{ color: "#666", fontSize: 12, lineHeight: 1.65 }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ROUNDS ── */}
        {activeTab === "rounds" && (
          <div>
            <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>Detailed breakdown of each interview round.</p>
            {rounds.map((r, i) => (
              <div key={i} className="round-card">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${gColor}15`, border: `1px solid ${gColor}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: gColor, fontWeight: 900, fontSize: 15, fontFamily: "'Bebas Neue',sans-serif" }}>R{i + 1}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <p style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{r.name}</p>
                      <span style={{ background: `${typeColor[r.type] || "#888"}18`, color: typeColor[r.type] || "#888", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5 }}>{r.type}</span>
                      {r.duration && <span style={{ color: "#444", fontSize: 11 }}>⏱ {r.duration}</span>}
                    </div>
                  </div>
                </div>
                <p style={{ color: "#777", fontSize: 13, lineHeight: 1.75, borderLeft: `3px solid ${gColor}35`, paddingLeft: 14 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── PYQs ── */}
        {activeTab === "pyqs" && (
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {pyqTags.map(tag => (
                <button key={tag} className={`filter-pill ${pyqFilter === tag ? "active" : ""}`} onClick={() => setPyqFilter(tag)}>{tag}</button>
              ))}
            </div>
            {filteredPyqs.length === 0
              ? <p style={{ color: "#444", textAlign: "center", padding: "40px 0", fontSize: 13 }}>No PYQs for this filter.</p>
              : filteredPyqs.map((p, i) => (
                <div key={i} className="pyq-card">
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ color: "#444", fontSize: 13, fontWeight: 800, flexShrink: 0, fontFamily: "'Bebas Neue',sans-serif", marginTop: 1 }}>Q{i + 1}</span>
                    <p style={{ color: "#ddd", fontSize: 14, fontWeight: 600, lineHeight: 1.55 }}>{p.q}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingLeft: 22 }}>
                    {p.tag && <span style={{ background: `${gColor}12`, color: gColor, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 5, border: `1px solid ${gColor}22` }}>{p.tag}</span>}
                    {p.difficulty && <span style={{ background: `${diffColor[p.difficulty] || "#888"}14`, color: diffColor[p.difficulty] || "#888", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 5 }}>{p.difficulty}</span>}
                    {p.freq && <span style={{ background: `${freqColor[p.freq] || "#888"}14`, color: freqColor[p.freq] || "#888", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 5 }}>🔥 {p.freq}</span>}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── TIPS ── */}
        {activeTab === "tips" && (
          <div className="section-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,214,0,0.1)", border: "1px solid rgba(255,214,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💡</div>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Insider Tips for {name}</p>
                <p style={{ color: "#555", fontSize: 12, marginTop: 2 }}>Curated advice from interview experiences</p>
              </div>
            </div>
            {tips.length === 0
              ? <p style={{ color: "#444", fontSize: 13 }}>No tips available.</p>
              : tips.map((tip, i) => (
                <div key={i} className="tip-item">
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFD600", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                  <p style={{ color: "#999", fontSize: 13, lineHeight: 1.75 }}>{tip}</p>
                </div>
              ))
            }
          </div>
        )}

        {/* ── RESOURCES ── */}
        {activeTab === "resources" && (
          <div>
            <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>Curated resources to prepare for {name} interviews.</p>
            {resources.length === 0
              ? <p style={{ color: "#444", fontSize: 13 }}>No resources available.</p>
              : resources.map((r, i) => (
                <div key={i} className="resource-row">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${gColor}12`, border: `1px solid ${gColor}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {r.type === "Practice" ? "💻" : r.type === "Book" ? "📚" : r.type === "Guide" ? "📖" : r.type === "PYQ" ? "📝" : "🔗"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{r.title}</p>
                    <p style={{ color: "#444", fontSize: 11, marginTop: 2, fontWeight: 600 }}>{r.type}</p>
                  </div>
                  <span style={{ color: gColor, fontSize: 18 }}>→</span>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </PageLayout>
  );
}
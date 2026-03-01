import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout";
import { fetchTopics, generateTest } from "../services/skilltestService";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const diffColor = { Easy: "#1dd1a1", Medium: "#ff9f43", Hard: "#ff6b6b" };

// Skeleton card
const SkeletonCard = () => (
  <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 18, padding: 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={sk(80, 24, 7)} />
      <div style={sk(70, 24, 7)} />
    </div>
    <div style={sk("100%", 18, 6, 10)} />
    <div style={sk("70%", 14, 6, 16)} />
    <div style={{ height: 1, background: "#1a1a1a", margin: "12px 0" }} />
    <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
      <div style={sk(100, 14, 6)} />
      <div style={sk(80, 14, 6)} />
    </div>
    <div style={sk("100%", 44, 12)} />
  </div>
);
const sk = (w, h, radius = 6, mb = 0) => ({
  width: w, height: h, borderRadius: radius, marginBottom: mb,
  background: "linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%)",
  backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
});

export default function SkillTest() {
  const navigate = useNavigate();
  const [topics, setTopics]           = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [activeFilter, setActiveFilter]   = useState("All");
  const [generating, setGenerating]       = useState(null); // topic id being generated
  const [genError, setGenError]           = useState("");

  useEffect(() => {
    fetchTopics()
      .then(setTopics)
      .catch(console.error)
      .finally(() => setLoadingTopics(false));
  }, []);

  // Filter by tag using topic labels
  const allTags  = ["All", ...topics.map(t => t.id)];
  const filtered = activeFilter === "All" ? topics : topics.filter(t => t.id === activeFilter);

  // Click "Start Test" → generate session → navigate carrying session data
  const handleStart = async (topic, difficulty = "Medium", count = 10) => {
    setGenError("");
    setGenerating(topic.id);
    try {
      const session = await generateTest({ topic: topic.id, difficulty, count });
      // Pass session via navigation state so MCQPage can use it directly
      navigate(`/skillTest/${topic.id}`, { state: { session } });
    } catch (err) {
      setGenError(`Failed to generate test for ${topic.label}. Please try again.`);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <PageLayout activeRoute="/skillTest">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skill-page { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .test-card { background: #111; border: 1px solid #1f1f1f; border-radius: 18px; padding: 24px; transition: all 0.22s; display: flex; flex-direction: column; }
        .test-card:hover { border-color: rgba(255,214,0,0.3); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,214,0,0.08); }
        .start-btn { width: 100%; padding: 12px; background: #FFD600; color: #000; font-weight: 800; font-size: 14px; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s; margin-top: auto; padding-top: 12px; letter-spacing: 0.02em; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .start-btn:hover { background: #ffe033; box-shadow: 0 0 20px rgba(255,214,0,0.45), 0 4px 14px rgba(255,214,0,0.2); }
        .start-btn:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
        .filter-pill { padding: 7px 18px; border-radius: 99px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid #2a2a2a; background: #161616; color: #666; transition: all 0.18s; }
        .filter-pill:hover { border-color: rgba(255,214,0,0.35); color: #FFD600; background: rgba(255,214,0,0.06); }
        .filter-pill.active { background: #FFD600; color: #000; border-color: #FFD600; box-shadow: 0 0 12px rgba(255,214,0,0.3); }
        .stat-card { background: #111; border: 1px solid #1f1f1f; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; }
        .diff-pill { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
      `}</style>

      <div className="skill-page">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>⚡</span>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em" }}>
              TEST YOUR SKILL
            </h1>
          </div>
          <p style={{ color: "#555", fontSize: 13, maxWidth: 480 }}>
            Pick a topic, choose difficulty, and answer AI-generated MCQs. Full breakdown shown after submission.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            ["📝", loadingTopics ? "—" : `${topics.length * 10}+`, "Questions"],
            ["🎯", loadingTopics ? "—" : String(topics.length), "Topics"],
            ["⏱",  "5–10", "Mins / Test"],
            ["🏆", "Instant", "Results"],
          ].map(([icon, val, lbl]) => (
            <div key={lbl} className="stat-card">
              <span style={{ fontSize: 24 }}>{icon}</span>
              <div>
                <p style={{ color: "#FFD600", fontWeight: 800, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>{val}</p>
                <p style={{ color: "#444", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{lbl}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Error banner */}
        {genError && (
          <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#ff6b6b", fontSize: 13 }}>
            ⚠️ {genError}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {(loadingTopics ? ["All"] : allTags).map(f => (
            <button key={f} className={`filter-pill ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Topic cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {loadingTopics
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((topic, i) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onStart={handleStart}
                isGenerating={generating === topic.id}
                animDelay={i * 0.06}
              />
            ))
          }
        </div>
      </div>
    </PageLayout>
  );
}

// ── Individual topic card with difficulty selector ─────────────────────────
function TopicCard({ topic, onStart, isGenerating, animDelay }) {
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount]           = useState(10);

  return (
    <div className="test-card" style={{ animationDelay: `${animDelay}s` }}>
      {/* Header badges */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ background: `${topic.color}18`, color: topic.color, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 7, border: `1px solid ${topic.color}33` }}>
          {topic.icon} {topic.id}
        </span>
        <span style={{ color: "#555", fontSize: 13 }}>AI-Generated</span>
      </div>

      {/* Title */}
      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 10, lineHeight: 1.4 }}>
        {topic.label}
      </h3>

      <div style={{ height: 1, background: "#1a1a1a", margin: "12px 0" }} />

      {/* Difficulty selector */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ color: "#444", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Difficulty</p>
        <div style={{ display: "flex", gap: 6 }}>
          {["Easy", "Medium", "Hard"].map(d => (
            <button key={d} className="diff-pill"
              onClick={() => setDifficulty(d)}
              style={{
                background: difficulty === d ? `${diffColor[d]}20` : "#161616",
                color: difficulty === d ? diffColor[d] : "#555",
                borderColor: difficulty === d ? `${diffColor[d]}50` : "#2a2a2a",
              }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Question count selector */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
          <span style={{ fontSize: 15 }}>📝</span>
          <select value={count} onChange={e => setCount(Number(e.target.value))}
            style={{ background: "#161616", border: "1px solid #2a2a2a", color: "#888", borderRadius: 6, padding: "2px 6px", fontSize: 12, outline: "none", cursor: "pointer" }}>
            <option value={5}>5 Qs</option>
            <option value={10}>10 Qs</option>
            <option value={15}>15 Qs</option>
          </select>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
          <span style={{ fontSize: 15 }}>⏱</span> ~{Math.ceil(count * 0.5)} min
        </span>
      </div>

      {/* CTA */}
      <button className="start-btn" disabled={isGenerating} onClick={() => onStart(topic, difficulty, count)}>
        {isGenerating
          ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTop: "2px solid #000", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Generating...</>
          : <>Start Test →</>
        }
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
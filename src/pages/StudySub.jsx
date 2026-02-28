import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout";
import { SUBJECTS, MODULES } from "./studySub/SubjectsData";

export default function StudySub() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const totalLessons    = 158;
  const completedLessons = 94;
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <PageLayout activeRoute="/StudySub">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .study-page { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .subject-card { background: #111; border-radius: 20px; padding: 24px; transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s; cursor: pointer; display: flex; flex-direction: column; gap: 0; border: 1px solid #1f1f1f; }
        .subject-card:hover { transform: translateY(-4px); }
        .progress-track { background: #1e1e1e; border-radius: 99px; height: 6px; overflow: hidden; }
        .progress-fill  { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
        .explore-btn { width: 100%; padding: 11px; font-size: 13px; font-weight: 700; border-radius: 11px; cursor: pointer; transition: all 0.2s; margin-top: 16px; border: none; letter-spacing: 0.02em; }
        .stat-chip { background: #111; border: 1px solid #1f1f1f; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; }
      `}</style>

      <div className="study-page">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 30 }}>📚</span>
            <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em" }}>STUDY SUBJECTS</h1>
          </div>
          <p style={{ color: "#555", fontSize: 13 }}>Structured modules, notes and practice problems for every core subject.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            ["📚", "6", "Subjects"],
            ["🧩", "38", "Modules"],
            ["📝", `${completedLessons}/${totalLessons}`, "Lessons Done"],
            ["🔥", `${overallProgress}%`, "Overall Progress"],
          ].map(([icon, val, lbl]) => (
            <div key={lbl} className="stat-chip">
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div>
                <p style={{ color: "#FFD600", fontWeight: 800, fontSize: 17, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>{val}</p>
                <p style={{ color: "#444", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{lbl}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Subject cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
          {SUBJECTS.map((s, i) => {
            const isHov = hovered === s.id;
            return (
              <div key={s.id} className="subject-card"
                style={{ borderColor: isHov ? `${s.color}45` : `${s.color}18`, boxShadow: isHov ? `0 16px 42px rgba(0,0,0,0.55), 0 0 0 1px ${s.color}20` : "none", animationDelay: `${i * 0.07}s` }}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(`/StudySub/${s.id}`)}>

                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 16, background: `${s.color}18`, border: `1px solid ${s.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{s.name}</p>
                    <p style={{ color: "#444", fontSize: 11, marginTop: 3 }}>
                      {(MODULES[s.id] || []).length || "—"} Modules
                    </p>
                  </div>
                  <span style={{ color: s.color, fontWeight: 800, fontSize: 20, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", flexShrink: 0 }}>
                    {s.progress}%
                  </span>
                </div>

                <p style={{ color: "#555", fontSize: 12, lineHeight: 1.65, marginBottom: 14 }}>{s.desc}</p>

                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${s.progress}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
                </div>
                <p style={{ color: "#333", fontSize: 10, marginTop: 6, fontWeight: 600 }}>{s.progress}% complete</p>

                <button className="explore-btn"
                  style={{ background: isHov ? s.color : `${s.color}15`, color: isHov ? "#000" : s.color, border: `1px solid ${s.color}30` }}
                  onClick={e => { e.stopPropagation(); navigate(`/StudySub/${s.id}`); }}>
                  Explore Modules →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
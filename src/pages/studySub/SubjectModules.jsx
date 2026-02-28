import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../PageLayout";
import { SUBJECTS, MODULES, diffColor } from "./subjectsData";

export default function SubjectModules() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const subject = SUBJECTS.find(s => s.id === subjectId);
  const modules = MODULES[subjectId] || [];

  if (!subject) {
    return (
      <PageLayout activeRoute="/StudySub">
        <div style={{ textAlign: "center", paddingTop: 80 }}>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Subject not found.</p>
          <button onClick={() => navigate("/StudySub")}
            style={{ padding: "10px 24px", background: "#FFD600", color: "#000", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
            ← Back to Subjects
          </button>
        </div>
      </PageLayout>
    );
  }

  const totalLessons = modules.reduce((a, m) => a + m.lessons, 0);
  const doneLessons  = modules.reduce((a, m) => a + m.done, 0);
  const overallPct   = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  const byDifficulty = (d) => modules.filter(m => m.difficulty === d);

  return (
    <PageLayout activeRoute="/StudySub">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .mod-page { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mod-card { background: #111; border: 1px solid #1f1f1f; border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.22s; display: flex; flex-direction: column; gap: 12; }
        .mod-card:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(0,0,0,0.5); }
        .progress-track { background: #1e1e1e; border-radius: 99px; height: 5px; overflow: hidden; }
        .progress-fill  { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
        .crumb-btn { display: inline-flex; align-items: center; gap: 6px; background: #161616; border: 1px solid #2a2a2a; color: #666; border-radius: 9px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: 'Inter',sans-serif; }
        .crumb-btn:hover { border-color: rgba(255,214,0,0.35); color: #FFD600; background: rgba(255,214,0,0.06); }
        .diff-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #444; margin: 20px 0 12px; display: flex; align-items: center; gap: 8; }
        .diff-section-title::after { content: ''; flex: 1; height: 1px; background: #1e1e1e; }
      `}</style>

      <div className="mod-page">

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button className="crumb-btn" onClick={() => navigate("/StudySub")}>📚 Subjects</button>
          <span style={{ color: "#2a2a2a", fontSize: 14 }}>›</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: subject.color, fontSize: 13, fontWeight: 700 }}>
            <span>{subject.icon}</span> {subject.name}
          </span>
        </div>

        {/* Subject hero */}
        <div style={{ background: "#111", border: `1px solid ${subject.color}25`, borderRadius: 20, padding: "28px 28px 24px", marginBottom: 28, boxShadow: `0 0 40px ${subject.color}10` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: `${subject.color}18`, border: `2px solid ${subject.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
              {subject.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em", marginBottom: 4 }}>{subject.name}</h1>
              <p style={{ color: "#555", fontSize: 13, marginBottom: 16 }}>{subject.desc}</p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[[modules.length,"Modules"],[totalLessons,"Lessons"],[doneLessons,"Completed"],[`${overallPct}%`,"Progress"]].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p style={{ color: subject.color, fontWeight: 800, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>{val}</p>
                    <p style={{ color: "#444", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${subject.color}14`, border: `3px solid ${subject.color}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${subject.color}25` }}>
                <span style={{ color: subject.color, fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: "0.03em" }}>{overallPct}%</span>
              </div>
              <p style={{ color: "#444", fontSize: 10, marginTop: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Done</p>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${overallPct}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}77)` }} />
            </div>
          </div>
        </div>

        {/* Modules grouped by difficulty */}
        {["Easy", "Medium", "Hard"].map(diff => {
          const mods = byDifficulty(diff);
          if (!mods.length) return null;
          return (
            <div key={diff}>
              <div className="diff-section-title">
                <span style={{ color: diffColor[diff] }}>{diff === "Easy" ? "🟢" : diff === "Medium" ? "🟡" : "🔴"}</span>
                <span style={{ color: diffColor[diff] }}>{diff}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {mods.map((mod) => {
                  const pct       = mod.lessons ? Math.round((mod.done / mod.lessons) * 100) : 0;
                  const isDone    = mod.done === mod.lessons;
                  const isStarted = mod.done > 0;
                  return (
                    <div key={mod.id} className="mod-card"
                      style={{ borderColor: isDone ? `${subject.color}35` : "#1f1f1f" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${subject.color}40`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = isDone ? `${subject.color}35` : "#1f1f1f"}
                      onClick={() => navigate(`/StudySub/${subjectId}/${mod.id}`)}>

                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 13, background: `${subject.color}15`, border: `1px solid ${subject.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                            {mod.icon}
                          </div>
                          <div>
                            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{mod.title}</p>
                            <p style={{ color: "#444", fontSize: 11, marginTop: 3 }}>{mod.lessons} lessons</p>
                          </div>
                        </div>
                        {isDone && <span style={{ fontSize: 18, flexShrink: 0 }}>✅</span>}
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ color: "#444", fontSize: 11 }}>{mod.done}/{mod.lessons} done</span>
                          <span style={{ color: isDone ? subject.color : "#555", fontSize: 11, fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: isDone ? `linear-gradient(90deg, ${subject.color}, ${subject.color}88)` : `linear-gradient(90deg, ${subject.color}88, ${subject.color}44)` }} />
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: isDone ? `${subject.color}18` : isStarted ? "rgba(255,159,67,0.12)" : "#1a1a1a", color: isDone ? subject.color : isStarted ? "#ff9f43" : "#444", border: isDone ? `1px solid ${subject.color}30` : isStarted ? "1px solid rgba(255,159,67,0.25)" : "1px solid #2a2a2a" }}>
                          {isDone ? "✓ Completed" : isStarted ? "▶ In Progress" : "◯ Not Started"}
                        </span>
                        <span style={{ color: subject.color, fontSize: 12, fontWeight: 700 }}>Open →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
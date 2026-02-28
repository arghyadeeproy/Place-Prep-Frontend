import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../PageLayout";
import { SUBJECTS, MODULES, getLessons, diffColor } from "./SubjectsData";

const LESSON_CONTENT = {
  "intro": {
    theory: `A Binary Tree is a hierarchical data structure where each node has at most two children — left and right.\n\nKey properties:\n• Root: The topmost node\n• Leaf: A node with no children\n• Height: Longest path from root to leaf\n• Depth: Distance from root to a given node\n\nCommon types:\n→ Full Binary Tree — every node has 0 or 2 children\n→ Complete Binary Tree — all levels filled except possibly the last\n→ Perfect Binary Tree — all leaves at same level\n→ Balanced Binary Tree — height is O(log n)`,
    example: `// Binary Tree Node in Java\nclass TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) {\n        this.val = val;\n        left = right = null;\n    }\n}`,
  },
  default: {
    theory: `This lesson covers fundamental concepts that build the foundation for this module.\n\nKey takeaways:\n• Understand the core definition and motivation\n• Learn the most important properties\n• See how this concept appears in interviews\n• Practice with real examples\n\nInterview tips:\n→ Always clarify constraints before solving\n→ Think aloud to show your reasoning\n→ Start with brute force, then optimize`,
    example: `// Pseudocode template\nfunction solve(input) {\n    // 1. Edge cases\n    if (!input) return null;\n    \n    // 2. Core logic\n    // ...\n    \n    // 3. Return result\n    return result;\n}`,
  },
};

export default function ModuleDetail() {
  const { subjectId, moduleId } = useParams();
  const navigate = useNavigate();

  const subject = SUBJECTS.find(s => s.id === subjectId);
  const modList = MODULES[subjectId] || [];
  const module  = modList.find(m => m.id === moduleId);
  const lessons = getLessons(subjectId, moduleId);

  const [activeLesson, setActiveLesson] = useState(0);
  const [completedMap, setCompletedMap] = useState(() => {
    const init = {};
    lessons.forEach((l, i) => { init[i] = l.done; });
    return init;
  });
  const [activeTab, setActiveTab] = useState("notes");

  if (!subject || !module) {
    return (
      <PageLayout activeRoute="/StudySub">
        <div style={{ textAlign: "center", paddingTop: 80 }}>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Module not found.</p>
          <button onClick={() => navigate(`/StudySub/${subjectId}`)}
            style={{ padding: "10px 24px", background: "#FFD600", color: "#000", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
            ← Back to Modules
          </button>
        </div>
      </PageLayout>
    );
  }

  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const progressPct    = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const currentLesson  = lessons[activeLesson];
  const content        = LESSON_CONTENT[currentLesson?.id] || LESSON_CONTENT.default;

  const markDone = (idx) => {
    setCompletedMap(prev => ({ ...prev, [idx]: true }));
    if (idx < lessons.length - 1) setTimeout(() => setActiveLesson(idx + 1), 300);
  };

  const modIdx  = modList.indexOf(module);
  const prevMod = modList[modIdx - 1];
  const nextMod = modList[modIdx + 1];

  return (
    <PageLayout activeRoute="/StudySub">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .mod-detail-page { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .crumb-btn { display: inline-flex; align-items: center; gap: 6px; background: #161616; border: 1px solid #2a2a2a; color: #666; border-radius: 9px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif; }
        .crumb-btn:hover { border-color: rgba(255,214,0,0.35); color: #FFD600; background: rgba(255,214,0,0.06); }
        .lesson-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 11px; cursor: pointer; transition: all 0.18s; border: 1px solid transparent; }
        .lesson-item:hover { background: rgba(255,255,255,0.03); border-color: #2a2a2a; }
        .lesson-item.active { background: rgba(255,214,0,0.07); border-color: rgba(255,214,0,0.25); }
        .tab-btn { padding: 8px 18px; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; border: 1px solid #2a2a2a; background: #161616; color: #666; transition: all 0.18s; font-family: 'Inter', sans-serif; }
        .tab-btn:hover { border-color: rgba(255,214,0,0.3); color: #FFD600; }
        .tab-btn.active { background: #FFD600; color: #000; border-color: #FFD600; }
        .content-card { background: #111; border: 1px solid #1f1f1f; border-radius: 16px; padding: 24px; }
        .code-block { background: #0e0e0e; border: 1px solid #1e1e1e; border-radius: 12px; padding: 18px 20px; font-family: 'Courier New', monospace; font-size: 13px; color: #a8ff78; line-height: 1.75; white-space: pre-wrap; overflow-x: auto; }
        .progress-track { background: #1e1e1e; border-radius: 99px; height: 5px; overflow: hidden; }
        .progress-fill  { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
        .nav-mod-btn { flex: 1; padding: 11px 16px; background: #161616; border: 1px solid #2a2a2a; color: #666; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif; }
        .nav-mod-btn:hover { border-color: rgba(255,214,0,0.35); color: #FFD600; }
        .nav-mod-btn:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>

      <div className="mod-detail-page">

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button className="crumb-btn" onClick={() => navigate("/StudySub")}>📚 Subjects</button>
          <span style={{ color: "#2a2a2a" }}>›</span>
          <button className="crumb-btn" onClick={() => navigate(`/StudySub/${subjectId}`)}>
            {subject.icon} {subject.short}
          </button>
          <span style={{ color: "#2a2a2a" }}>›</span>
          <span style={{ color: subject.color, fontSize: 13, fontWeight: 700 }}>{module.icon} {module.title}</span>
        </div>

        {/* Module header */}
        <div style={{ background: "#111", border: `1px solid ${subject.color}22`, borderRadius: 18, padding: "22px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 15, background: `${subject.color}18`, border: `1px solid ${subject.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {module.icon}
              </div>
              <div>
                <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>{module.title}</h2>
                <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                  <span style={{ background: `${subject.color}18`, color: subject.color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5 }}>{subject.short}</span>
                  <span style={{ background: `${diffColor[module.difficulty]}18`, color: diffColor[module.difficulty], fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5 }}>{module.difficulty}</span>
                  <span style={{ color: "#444", fontSize: 11, fontWeight: 600 }}>{lessons.length} lessons</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: subject.color, fontWeight: 800, fontSize: 24, fontFamily: "'Bebas Neue',sans-serif" }}>{progressPct}%</p>
              <p style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Complete</p>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${subject.color}, ${subject.color}77)` }} />
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, alignItems: "start" }}>

          {/* Sidebar */}
          <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 16, padding: "16px 12px", position: "sticky", top: 80 }}>
            <p style={{ color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12, paddingLeft: 4 }}>
              Lessons · {completedCount}/{lessons.length}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {lessons.map((lesson, i) => {
                const done = completedMap[i];
                const isActive = i === activeLesson;
                return (
                  <div key={lesson.id} className={`lesson-item ${isActive ? "active" : ""}`} onClick={() => setActiveLesson(i)}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: done ? subject.color : isActive ? `${subject.color}22` : "#1a1a1a", color: done ? "#000" : isActive ? subject.color : "#444", border: done ? "none" : isActive ? `1px solid ${subject.color}50` : "1px solid #2a2a2a" }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: isActive ? "#fff" : done ? "#bbb" : "#777", fontSize: 12, fontWeight: 600, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {lesson.title}
                      </p>
                      <span style={{ fontSize: 10, color: "#444", marginTop: 2, display: "block" }}>
                        {lesson.type === "practice" ? "✏️ Practice" : "📖 Theory"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Lesson title bar */}
            <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 16, padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ background: "#1a1a1a", color: "#555", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5 }}>
                      Lesson {activeLesson + 1} of {lessons.length}
                    </span>
                    <span style={{ background: currentLesson?.type === "practice" ? "rgba(84,160,255,0.12)" : "rgba(255,214,0,0.1)", color: currentLesson?.type === "practice" ? "#54a0ff" : "#FFD600", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5 }}>
                      {currentLesson?.type === "practice" ? "✏️ Practice" : "📖 Theory"}
                    </span>
                    {completedMap[activeLesson] && (
                      <span style={{ background: "rgba(29,209,161,0.12)", color: "#1dd1a1", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5 }}>✓ Completed</span>
                    )}
                  </div>
                  <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>{currentLesson?.title}</h3>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setActiveLesson(i => Math.max(0, i - 1))} disabled={activeLesson === 0}
                    style={{ padding: "8px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: activeLesson === 0 ? "not-allowed" : "pointer", opacity: activeLesson === 0 ? 0.4 : 1, fontFamily: "Inter,sans-serif" }}>
                    ← Prev
                  </button>
                  <button onClick={() => setActiveLesson(i => Math.min(lessons.length - 1, i + 1))} disabled={activeLesson === lessons.length - 1}
                    style={{ padding: "8px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: activeLesson === lessons.length - 1 ? "not-allowed" : "pointer", opacity: activeLesson === lessons.length - 1 ? 0.4 : 1, fontFamily: "Inter,sans-serif" }}>
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 8 }}>
              {["notes", "code", "tips"].map(t => (
                <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                  {t === "notes" ? "📖 Notes" : t === "code" ? "💻 Code" : "💡 Tips"}
                </button>
              ))}
            </div>

            {activeTab === "notes" && (
              <div className="content-card">
                <p style={{ color: "#888", fontSize: 14, lineHeight: 1.85, whiteSpace: "pre-line" }}>{content.theory}</p>
              </div>
            )}
            {activeTab === "code" && (
              <div className="content-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <p style={{ color: "#FFD600", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Code Example</p>
                  <span style={{ color: "#444", fontSize: 11, background: "#1a1a1a", padding: "3px 10px", borderRadius: 6, border: "1px solid #2a2a2a" }}>Java / Pseudocode</span>
                </div>
                <div className="code-block">{content.example}</div>
              </div>
            )}
            {activeTab === "tips" && (
              <div className="content-card">
                <p style={{ color: "#FFD600", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Interview Tips</p>
                {["Always start by clarifying the problem constraints and edge cases.", "Think out loud — interviewers value your reasoning process, not just the answer.", "Start with a brute force solution, then optimize step by step.", "Dry-run your code with a simple example before writing final code.", "Know the time and space complexity of your solution.", "Practice explaining this concept in 30 seconds — common in rapid-fire rounds."].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(255,214,0,0.12)", border: "1px solid rgba(255,214,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFD600", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    <p style={{ color: "#888", fontSize: 13, lineHeight: 1.65 }}>{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Mark complete */}
            <button disabled={!!completedMap[activeLesson]} onClick={() => markDone(activeLesson)}
              style={{ width: "100%", padding: "12px", flex: 2, background: completedMap[activeLesson] ? "#1a1a1a" : "#FFD600", color: completedMap[activeLesson] ? "#444" : "#000", cursor: completedMap[activeLesson] ? "not-allowed" : "pointer", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 14, fontFamily: "Inter,sans-serif", boxShadow: completedMap[activeLesson] ? "none" : "0 0 20px rgba(255,214,0,0.4)", transition: "all 0.2s" }}>
              {completedMap[activeLesson] ? "✓ Already Completed" : activeLesson === lessons.length - 1 ? "✓ Complete Module" : "✓ Mark as Done & Next"}
            </button>

            {/* Prev / Next module */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="nav-mod-btn" disabled={!prevMod} onClick={() => navigate(`/StudySub/${subjectId}/${prevMod?.id}`)}>
                ← {prevMod ? prevMod.title : "No previous"}
              </button>
              <button className="nav-mod-btn" disabled={!nextMod} onClick={() => navigate(`/StudySub/${subjectId}/${nextMod?.id}`)} style={{ textAlign: "right" }}>
                {nextMod ? nextMod.title : "No next"} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
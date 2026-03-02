// pages/studySub/ModuleDetail.jsx — Backend connected
// Replaces: getLessons() from SubjectsData.js (static/generated locally)
// Now fetches: GET /api/study/<subject_id>/<module_id>/
//   → Groq AI generates lessons on first request and stores in Firestore
//   → subsequent calls return cached lessons instantly
// Mark complete: POST /api/study/<module_id>/complete/ { lesson_order: <1-indexed> }
//
// Backend lesson shape: { title, type, content, order }
// Progress comes from module.completed_lessons (array of completed order ints)
//
// UI is pixel-identical to original ModuleDetail.jsx — only data source changed.

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate }            from "react-router-dom";
import PageLayout                            from "../../PageLayout";
import { SUBJECTS, diffColor }               from "./SubjectsData";
import { fetchModuleDetail, markLessonComplete } from "../../services/studyservice";

// ── Skeleton helper ────────────────────────────────────────────
const Sk = ({ w = "100%", h = 14, r = 6, mb = 0 }) => (
  <div style={{
    width: w, height: h, borderRadius: r, marginBottom: mb,
    background: "linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
  }} />
);

export default function ModuleDetail() {
  const { subjectId, moduleId } = useParams();
  const navigate                = useNavigate();

  const subject = SUBJECTS.find(s => s.id === subjectId);

  // ── Remote data ────────────────────────────────────────────────
  const [modMeta, setModMeta]   = useState(null);   // { id, title, icon, difficulty, lesson_count, ... }
  const [lessons, setLessons]   = useState([]);      // normalised lesson objects
  const [loading, setLoading]   = useState(true);
  const [aiWait, setAiWait]     = useState(false);   // Groq is generating (slow first call)
  const [error, setError]       = useState("");

  // ── Local UI state ─────────────────────────────────────────────
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedMap, setCompletedMap] = useState({});   // { lessonIndex: true }
  const [activeTab, setActiveTab]       = useState("notes");
  const [saving, setSaving]             = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!subject) return;
    setLoading(true);
    setError("");
    setAiWait(false);
    setActiveLesson(0);
    setActiveTab("notes");

    // Show "AI generating" toast after 2s if still waiting
    const toastTimer = setTimeout(() => setAiWait(true), 2000);

    fetchModuleDetail(subjectId, moduleId)
      .then(({ module: mod, lessons: raw }) => {
        clearTimeout(toastTimer);
        setAiWait(false);
        setModMeta(mod);

        // Normalise lessons to 0-indexed UI format
        const sorted = (raw || [])
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((l, i) => ({
            id:      l.order ?? i + 1,      // keep backend 1-indexed id for submit
            index:   i,                     // 0-indexed position
            title:   l.title   || `Lesson ${i + 1}`,
            type:    l.type    || "theory",
            content: l.content || "",
          }));
        setLessons(sorted);

        // Init completedMap from backend's completed_lessons list
        const done = new Set(mod?.completed_lessons ?? []);
        const init = {};
        sorted.forEach(l => { if (done.has(l.id)) init[l.index] = true; });
        setCompletedMap(init);
      })
      .catch(err => {
        clearTimeout(toastTimer);
        setAiWait(false);
        setError(err?.response?.data?.detail || "Failed to load lessons.");
      })
      .finally(() => setLoading(false));
  }, [subjectId, moduleId]);

  // ── Mark lesson complete ───────────────────────────────────────
  const handleMarkDone = useCallback(async (idx) => {
    if (saving || completedMap[idx]) return;
    setSaving(true);

    // Optimistic update
    setCompletedMap(prev => ({ ...prev, [idx]: true }));
    if (idx < lessons.length - 1) {
      setTimeout(() => { setActiveLesson(idx + 1); setActiveTab("notes"); }, 300);
    }

    try {
      const lesson = lessons[idx];
      await markLessonComplete(moduleId, lesson.id); // lesson.id is 1-indexed order
    } catch {
      // Revert on failure
      setCompletedMap(prev => { const n = { ...prev }; delete n[idx]; return n; });
    } finally {
      setSaving(false);
    }
  }, [saving, completedMap, lessons, moduleId]);

  // ── Derived ────────────────────────────────────────────────────
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const progressPct    = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const currentLesson  = lessons[activeLesson];

  // ── Subject not found ──────────────────────────────────────────
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

  // ── Loading skeleton ───────────────────────────────────────────
  if (loading) return (
    <PageLayout activeRoute="/StudySub">
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Sk w={320} h={32} mb={24} />
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 18, padding: 24 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
            <Sk w={48} h={48} r={15} />
            <div style={{ flex: 1 }}><Sk h={20} w="50%" mb={10} /><Sk h={12} w="30%" /></div>
          </div>
          <Sk h={5} r={99} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
          <Sk h={400} r={16} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Sk h={100} r={16} />
            <Sk h={300} r={16} />
          </div>
        </div>
      </div>

      {/* AI generating toast */}
      {aiWait && (
        <div style={{ position: "fixed", bottom: 28, right: 28, background: "#111", border: "1px solid rgba(255,214,0,0.3)", borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 100, boxShadow: "0 8px 30px rgba(0,0,0,0.7)", animation: "none" }}>
          <div style={{ width: 20, height: 20, border: "2px solid #333", borderTopColor: "#FFD600", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <div>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>AI Generating Lessons</p>
            <p style={{ color: "#555", fontSize: 11 }}>Groq is crafting your module content…</p>
          </div>
        </div>
      )}
    </PageLayout>
  );

  // ── Error state ────────────────────────────────────────────────
  if (error) return (
    <PageLayout activeRoute="/StudySub">
      <button className="crumb-btn" onClick={() => navigate(`/StudySub/${subjectId}`)}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#161616", border: "1px solid #2a2a2a", color: "#666", borderRadius: 9, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 20 }}>
        ← Back to Modules
      </button>
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>😕</p>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Couldn't load lessons</p>
        <p style={{ fontSize: 13, marginBottom: 20 }}>{error}</p>
        <button onClick={() => window.location.reload()}
          style={{ background: "#FFD600", color: "#000", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>
          Try Again
        </button>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout activeRoute="/StudySub">
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        .mod-detail-page { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .crumb-btn { display:inline-flex; align-items:center; gap:6px; background:#161616; border:1px solid #2a2a2a; color:#666; border-radius:9px; padding:7px 14px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; }
        .crumb-btn:hover { border-color:rgba(255,214,0,0.35); color:#FFD600; background:rgba(255,214,0,0.06); }
        .lesson-item { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:11px; cursor:pointer; transition:all 0.18s; border:1px solid transparent; }
        .lesson-item:hover { background:rgba(255,255,255,0.03); border-color:#2a2a2a; }
        .lesson-item.active { background:rgba(255,214,0,0.07); border-color:rgba(255,214,0,0.25); }
        .tab-btn { padding:8px 18px; border-radius:9px; font-size:13px; font-weight:700; cursor:pointer; border:1px solid #2a2a2a; background:#161616; color:#666; transition:all 0.18s; font-family:'Inter',sans-serif; }
        .tab-btn:hover { border-color:rgba(255,214,0,0.3); color:#FFD600; }
        .tab-btn.active { background:#FFD600; color:#000; border-color:#FFD600; }
        .content-card { background:#111; border:1px solid #1f1f1f; border-radius:16px; padding:24px; }
        .progress-track { background:#1e1e1e; border-radius:99px; height:5px; overflow:hidden; }
        .progress-fill  { height:100%; border-radius:99px; transition:width 0.6s ease; }
        .nav-mod-btn { flex:1; padding:11px 16px; background:#161616; border:1px solid #2a2a2a; color:#666; border-radius:12px; font-weight:700; font-size:13px; cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; }
        .nav-mod-btn:hover { border-color:rgba(255,214,0,0.35); color:#FFD600; }
        .nav-mod-btn:disabled { opacity:0.3; cursor:not-allowed; }
      `}</style>

      <div className="mod-detail-page">

        {/* ── Breadcrumb ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button className="crumb-btn" onClick={() => navigate("/StudySub")}>📚 Subjects</button>
          <span style={{ color: "#2a2a2a" }}>›</span>
          <button className="crumb-btn" onClick={() => navigate(`/StudySub/${subjectId}`)}>
            {subject.icon} {subject.short}
          </button>
          <span style={{ color: "#2a2a2a" }}>›</span>
          <span style={{ color: subject.color, fontSize: 13, fontWeight: 700 }}>
            {modMeta?.icon || "📖"} {modMeta?.title || moduleId}
          </span>
        </div>

        {/* ── Module header ── */}
        <div style={{ background: "#111", border: `1px solid ${subject.color}22`, borderRadius: 18, padding: "22px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 15, background: `${subject.color}18`, border: `1px solid ${subject.color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {modMeta?.icon || "📖"}
              </div>
              <div>
                <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>
                  {modMeta?.title || moduleId}
                </h2>
                <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                  <span style={{ background: `${subject.color}18`, color: subject.color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5 }}>{subject.short}</span>
                  {modMeta?.difficulty && (
                    <span style={{ background: `${diffColor[modMeta.difficulty] || "#888"}18`, color: diffColor[modMeta.difficulty] || "#888", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5 }}>
                      {modMeta.difficulty}
                    </span>
                  )}
                  <span style={{ color: "#444", fontSize: 11, fontWeight: 600 }}>{lessons.length} lessons</span>
                  <span style={{ background: "rgba(255,214,0,0.08)", color: "#FFD600", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5, border: "1px solid rgba(255,214,0,0.15)" }}>✨ AI Generated</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: subject.color, fontWeight: 800, fontSize: 24, fontFamily: "'Bebas Neue',sans-serif" }}>{progressPct}%</p>
              <p style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Complete</p>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%`, background: `linear-gradient(90deg,${subject.color},${subject.color}77)` }} />
          </div>
        </div>

        {/* ── Main layout: sidebar + content ── */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, alignItems: "start" }}>

          {/* ── Sidebar ── */}
          <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 16, padding: "16px 12px", position: "sticky", top: 80 }}>
            <p style={{ color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12, paddingLeft: 4 }}>
              Lessons · {completedCount}/{lessons.length}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {lessons.map((lesson, i) => {
                const done     = !!completedMap[i];
                const isActive = i === activeLesson;
                return (
                  <div
                    key={lesson.id}
                    className={`lesson-item ${isActive ? "active" : ""}`}
                    onClick={() => { setActiveLesson(i); setActiveTab("notes"); }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700,
                      background: done ? subject.color : isActive ? `${subject.color}22` : "#1a1a1a",
                      color:      done ? "#000"         : isActive ? subject.color        : "#444",
                      border:     done ? "none"         : isActive ? `1px solid ${subject.color}50` : "1px solid #2a2a2a",
                    }}>
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

          {/* ── Content panel ── */}
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
                  <button
                    onClick={() => setActiveLesson(i => Math.max(0, i - 1))}
                    disabled={activeLesson === 0}
                    style={{ padding: "8px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: activeLesson === 0 ? "not-allowed" : "pointer", opacity: activeLesson === 0 ? 0.4 : 1, fontFamily: "Inter,sans-serif" }}>
                    ← Prev
                  </button>
                  <button
                    onClick={() => setActiveLesson(i => Math.min(lessons.length - 1, i + 1))}
                    disabled={activeLesson === lessons.length - 1}
                    style={{ padding: "8px 14px", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#555", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: activeLesson === lessons.length - 1 ? "not-allowed" : "pointer", opacity: activeLesson === lessons.length - 1 ? 0.4 : 1, fontFamily: "Inter,sans-serif" }}>
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["notes", "📖 Notes"],
                ["tips",  "💡 Tips"],
              ].map(([id, label]) => (
                <button key={id} className={`tab-btn ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── NOTES tab — real AI content from backend ── */}
            {activeTab === "notes" && (
              <div className="content-card">
                {currentLesson?.content
                  ? <p style={{ color: "#888", fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{currentLesson.content}</p>
                  : <p style={{ color: "#444", fontSize: 13, fontStyle: "italic" }}>No content available for this lesson.</p>
                }
              </div>
            )}

            {/* ── TIPS tab — static interview tips (no code tab needed; content has code) ── */}
            {activeTab === "tips" && (
              <div className="content-card">
                <p style={{ color: "#FFD600", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Interview Tips</p>
                {[
                  "Always start by clarifying the problem constraints and edge cases.",
                  "Think out loud — interviewers value your reasoning process, not just the answer.",
                  "Start with a brute force solution, then optimize step by step.",
                  "Dry-run your code with a simple example before writing final code.",
                  "Know the time and space complexity of your solution.",
                  "Practice explaining this concept in 30 seconds — common in rapid-fire rounds.",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(255,214,0,0.12)", border: "1px solid rgba(255,214,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFD600", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    <p style={{ color: "#888", fontSize: 13, lineHeight: 1.65 }}>{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Mark done button ── */}
            <button
              disabled={!!completedMap[activeLesson] || saving}
              onClick={() => handleMarkDone(activeLesson)}
              style={{
                width: "100%", padding: "12px", border: "none", borderRadius: 12,
                fontWeight: 800, fontSize: 14, fontFamily: "Inter,sans-serif",
                transition: "all 0.2s",
                background: completedMap[activeLesson] ? "#1a1a1a" : "#FFD600",
                color:      completedMap[activeLesson] ? "#444"    : "#000",
                cursor:     completedMap[activeLesson] || saving ? "not-allowed" : "pointer",
                boxShadow:  completedMap[activeLesson] ? "none" : "0 0 20px rgba(255,214,0,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
              {saving
                ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTop: "2px solid #000", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Saving…</>
                : completedMap[activeLesson]
                  ? "✓ Already Completed"
                  : activeLesson === lessons.length - 1
                    ? "✓ Complete Module"
                    : "✓ Mark as Done & Next"
              }
            </button>

            {/* Next lesson hint */}
            {!completedMap[activeLesson] && activeLesson < lessons.length - 1 && (
              <p style={{ color: "#333", fontSize: 11, textAlign: "center" }}>
                Up next: {lessons[activeLesson + 1]?.title}
              </p>
            )}

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
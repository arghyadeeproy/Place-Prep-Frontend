// pages/skillTest/MCQPage.jsx — Backend connected · Same quiz UI
// Session data arrives via router state from SkillTest page.
// On submit → POST /api/skilltest/submit/:session_id/ → shows real results
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { submitTest } from "../../services/skilltestService";

// ─── Static styles ──────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: #0a0a0a; font-family: 'Inter', sans-serif; }
  .mcq-grid-dots { background-image: radial-gradient(circle, rgba(255,214,0,0.06) 1px, transparent 1px); background-size: 30px 30px; position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .mcq-orb-1 { position: fixed; top: -180px; right: -180px; width: 560px; height: 560px; border-radius: 50%; pointer-events: none; z-index: 0; background: radial-gradient(circle, rgba(255,214,0,0.08), transparent 70%); filter: blur(90px); animation: mcqPulse 6s ease-in-out infinite; }
  .mcq-orb-2 { position: fixed; bottom: -120px; left: -120px; width: 420px; height: 420px; border-radius: 50%; pointer-events: none; z-index: 0; background: radial-gradient(circle, rgba(255,214,0,0.06), transparent 70%); filter: blur(80px); animation: mcqPulse 8s ease-in-out infinite 3s; }
  @keyframes mcqPulse { 0%,100%{opacity:.4} 50%{opacity:.75} }
  @keyframes mcqFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mcqPopIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  @keyframes mcqExplainIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to { transform: rotate(360deg); } }
  .mcq-fade-up   { animation: mcqFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .mcq-pop-in    { animation: mcqPopIn  0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
  .mcq-explain   { animation: mcqExplainIn 0.3s ease forwards; }
  .mcq-opt-btn { all: unset; cursor: pointer; display: block; width: 100%; }
  .mcq-opt-btn:disabled { cursor: default; }
  .mcq-opt-btn:not(:disabled):hover .mcq-opt-inner { border-color: rgba(255,214,0,0.4) !important; color: #FFD600 !important; background: rgba(255,214,0,0.05) !important; }
  .mcq-back-btn { display: inline-flex; align-items: center; gap: 7px; background: #161616; border: 1px solid #2a2a2a; color: #777; border-radius: 10px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif; }
  .mcq-back-btn:hover { border-color: rgba(255,214,0,0.35); color: #FFD600; background: rgba(255,214,0,0.06); }
  .mcq-dot { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s, color 0.15s, box-shadow 0.15s; border: 1px solid #2a2a2a; font-family: 'Inter', sans-serif; user-select: none; }
  .mcq-action-btn { flex: 1; padding: 13px; border: none; border-radius: 13px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; letter-spacing: 0.02em; }
  .mcq-btn-sec { background: #1a1a1a; color: #777; border: 1px solid #2a2a2a !important; }
  .mcq-btn-sec:hover { border-color: rgba(255,214,0,0.3) !important; color: #FFD600; }
  .mcq-btn-pri { background: #FFD600; color: #000; box-shadow: 0 0 18px rgba(255,214,0,0.3); }
  .mcq-btn-pri:hover { background: #ffe033; box-shadow: 0 0 28px rgba(255,214,0,0.5); }
  .mcq-review-card { background: #111; border: 1px solid #1f1f1f; border-radius: 14px; padding: 20px; margin-bottom: 10px; }
`;

const McqBg = memo(() => (
  <>
    <div className="mcq-grid-dots" />
    <div className="mcq-orb-1" />
    <div className="mcq-orb-2" />
  </>
));

// ─── Timer ───────────────────────────────────────────────────────────────────
const TimerDisplay = memo(({ initialSeconds, running, onExpire }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const ref = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!running) { clearInterval(ref.current); return; }
    ref.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(ref.current); onExpireRef.current(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  const fmt    = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const danger = (seconds / initialSeconds) < 0.25;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#111", border: `1px solid ${danger ? "rgba(255,107,107,0.5)" : "#2a2a2a"}`, borderRadius: 12, padding: "8px 16px" }}>
      <svg width="14" height="14" fill="none" stroke={danger ? "#ff6b6b" : "#FFD600"} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeWidth={2} />
      </svg>
      <span style={{ color: danger ? "#ff6b6b" : "#fff", fontWeight: 800, fontSize: 15, fontFamily: "monospace" }}>{fmt}</span>
      {danger && <span style={{ fontSize: 12, color: "#ff6b6b", fontWeight: 700 }}>⚠</span>}
    </div>
  );
});

const diffColor = { Easy: "#1dd1a1", Medium: "#ff9f43", Hard: "#ff6b6b" };

// ─── Main MCQ Page ───────────────────────────────────────────────────────────
export default function MCQPage() {
  const { testId }  = useParams();
  const navigate    = useNavigate();
  const location    = useLocation();

  // Session data comes from SkillTest page via navigation state
  const session   = location.state?.session;
  const questions = session?.questions || [];

  const [current, setCurrent]       = useState(0);
  const [selected, setSelected]     = useState(() => Array(questions.length).fill(null));
  const [showExplain, setShowExplain] = useState(false);
  const [phase, setPhase]           = useState("quiz"); // "quiz" | "submitting" | "results"
  const [results, setResults]       = useState(null);   // backend submit response
  const [submitError, setSubmitError] = useState("");
  const [timerExpired, setTimerExpired] = useState(false);
  const startTime = useRef(Date.now());

  // If no session data (e.g. direct URL access), redirect back
  if (!session || questions.length === 0) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>No active test session.</p>
          <p style={{ color: "#555", fontSize: 13 }}>Please start a test from the SkillTest page.</p>
          <button className="mcq-btn-pri mcq-action-btn" style={{ maxWidth: 200 }} onClick={() => navigate("/skillTest")}>← Back to Tests</button>
        </div>
      </>
    );
  }

  const q         = questions[current];
  const isAnswered = selected[current] !== null;

  const choose = (idx) => {
    if (isAnswered) return;
    setSelected(prev => { const n = [...prev]; n[current] = idx; return n; });
    setShowExplain(false); // don't show explain until submitted
  };

  const goNext = () => {
    setShowExplain(false);
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else handleSubmit();
  };

  // ── Submit to backend ──────────────────────────────────────
  const handleSubmit = async () => {
    setPhase("submitting");
    setSubmitError("");
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);

    // Build answers map: { "0": idx, "1": idx, ... }  — skip nulls (skipped = absent)
    const answers = {};
    selected.forEach((ans, i) => { if (ans !== null) answers[String(i)] = ans; });

    try {
      const data = await submitTest(session.session_id, {
        answers,
        time_taken_seconds: timeTaken,
      });
      setResults(data);
      setPhase("results");
    } catch (err) {
      setSubmitError("Failed to submit. Please try again.");
      setPhase("quiz");
    }
  };

  const handleExpire = useCallback(() => {
    setTimerExpired(true);
    handleSubmit();
  }, [selected]);

  const retry = () => navigate("/skillTest");

  // Option style — during quiz no correct/wrong shown, after submit backend provides answer
  const optStyle = (idx) => {
    const base = { width: "100%", padding: "14px 18px", borderRadius: 14, fontSize: 14, fontWeight: 500, border: "1px solid #2a2a2a", background: "#161616", color: "#bbb", textAlign: "left", transition: "border-color 0.15s, background 0.15s, color 0.15s", display: "flex", alignItems: "center", gap: 14 };
    // During quiz — just highlight chosen
    if (selected[current] === null) return base;
    if (idx === selected[current]) return { ...base, background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.4)", color: "#FFD600" };
    return { ...base, opacity: 0.35 };
  };

  // ── SUBMITTING ─────────────────────────────────────────────
  if (phase === "submitting") return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <McqBg />
        <div style={{ width: 44, height: 44, border: "3px solid #222", borderTopColor: "#FFD600", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <p style={{ color: "#888", fontSize: 14, fontFamily: "Inter, sans-serif" }}>Submitting your answers...</p>
      </div>
    </>
  );

  // ── RESULTS (from backend) ─────────────────────────────────
  if (phase === "results" && results) {
    const { correct, wrong, skipped, score_pct, grade, total, results: reviewList } = results;
    const gradeStyle = score_pct >= 80
      ? { emoji: "🏆", color: "#FFD600" }
      : score_pct >= 60
      ? { emoji: "👍", color: "#ff9f43" }
      : { emoji: "💪", color: "#ff6b6b" };

    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <div style={{ position: "fixed", inset: 0, background: "#0a0a0a", overflowY: "auto" }}>
          <McqBg />
          <div style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto", padding: "28px 20px 60px" }}>
            <div className="mcq-fade-up">
              <button className="mcq-back-btn" style={{ marginBottom: 28 }} onClick={() => navigate("/skillTest")}>← Back to Tests</button>

              {/* Score card */}
              <div className="mcq-pop-in" style={{ background: "#111", border: `1px solid ${gradeStyle.color}30`, borderRadius: 22, padding: "36px 28px", textAlign: "center", marginBottom: 28, boxShadow: `0 0 50px ${gradeStyle.color}12` }}>
                {timerExpired && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, padding: "4px 14px", marginBottom: 16 }}>
                    <span style={{ fontSize: 14 }}>⏰</span>
                    <span style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700 }}>Time Expired</span>
                  </div>
                )}
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: `${gradeStyle.color}18`, border: `3px solid ${gradeStyle.color}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 0 28px ${gradeStyle.color}30` }}>
                  <span style={{ color: gradeStyle.color, fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: "0.05em" }}>{score_pct}%</span>
                </div>
                <p style={{ fontSize: 32, marginBottom: 6 }}>{gradeStyle.emoji}</p>
                <h2 style={{ color: gradeStyle.color, fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: "0.1em", marginBottom: 8 }}>{grade}</h2>
                <p style={{ color: "#666", fontSize: 14 }}>
                  You scored <span style={{ color: "#fff", fontWeight: 700 }}>{correct}</span> out of <span style={{ color: "#fff", fontWeight: 700 }}>{total}</span> in <span style={{ color: "#fff", fontWeight: 700 }}>{session.topic} · {session.difficulty}</span>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 28 }}>
                  {[["✅", correct, "#1dd1a1", "Correct"], ["❌", wrong, "#ff6b6b", "Wrong"], ["⏭️", skipped, "#888", "Skipped"]].map(([ic, val, col, lbl]) => (
                    <div key={lbl} style={{ background: "#1a1a1a", borderRadius: 14, padding: "14px 8px" }}>
                      <p style={{ fontSize: 22, marginBottom: 4 }}>{ic}</p>
                      <p style={{ color: col, fontWeight: 800, fontSize: 24, fontFamily: "'Bebas Neue',sans-serif" }}>{val}</p>
                      <p style={{ color: "#444", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{lbl}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Answer review — with real correct answers + explanations from backend */}
              <p style={{ color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Answer Review</p>
              {reviewList.map((r, i) => {
                const correct_ans = r.correct_answer;
                const user_ans    = r.user_answer; // null if skipped
                const verdict     = r.verdict;     // "correct" | "wrong" | "skipped"
                return (
                  <div key={i} className="mcq-review-card">
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{verdict === "skipped" ? "⏭️" : verdict === "correct" ? "✅" : "❌"}</span>
                      <p style={{ color: "#ddd", fontSize: 14, fontWeight: 600, lineHeight: 1.55 }}>
                        <span style={{ color: "#FFD600", fontWeight: 800 }}>Q{i + 1}.</span> {r.question}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingLeft: 28, marginBottom: 10 }}>
                      {verdict !== "skipped" && (
                        <span style={{ background: verdict === "correct" ? "rgba(29,209,161,0.12)" : "rgba(255,107,107,0.12)", color: verdict === "correct" ? "#1dd1a1" : "#ff6b6b", fontSize: 12, padding: "3px 10px", borderRadius: 6, fontWeight: 600 }}>
                          Your answer: {r.options[user_ans]}
                        </span>
                      )}
                      {verdict !== "correct" && (
                        <span style={{ background: "rgba(29,209,161,0.12)", color: "#1dd1a1", fontSize: 12, padding: "3px 10px", borderRadius: 6, fontWeight: 600 }}>
                          Correct: {r.options[correct_ans]}
                        </span>
                      )}
                    </div>
                    {r.explanation && (
                      <p style={{ color: "#555", fontSize: 12, paddingLeft: 28, lineHeight: 1.65 }}>💡 {r.explanation}</p>
                    )}
                  </div>
                );
              })}

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="mcq-action-btn mcq-btn-sec" onClick={() => navigate("/skillTest")}>← All Topics</button>
                <button className="mcq-action-btn mcq-btn-pri" onClick={retry}>New Test ↺</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── QUIZ UI (unchanged) ────────────────────────────────────
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ position: "fixed", inset: 0, background: "#0a0a0a", overflowY: "auto" }}>
        <McqBg />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto", padding: "28px 20px 60px" }}>
          <div className="mcq-fade-up">

            {/* Top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button className="mcq-back-btn" onClick={() => navigate("/skillTest")}>← Exit</button>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "rgba(255,214,0,0.12)", color: "#FFD600", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,214,0,0.25)" }}>{session.topic}</span>
                  <span style={{ color: "#444", fontSize: 13, fontWeight: 600 }}>{session.difficulty}</span>
                </div>
              </div>
              <TimerDisplay initialSeconds={(session.time_minutes || 10) * 60} running={phase === "quiz"} onExpire={handleExpire} />
            </div>

            {/* Error */}
            {submitError && (
              <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#ff6b6b", fontSize: 13 }}>
                ⚠️ {submitError}
              </div>
            )}

            {/* Progress */}
            <div style={{ background: "#1a1a1a", borderRadius: 99, height: 5, marginBottom: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((current + 1) / questions.length) * 100}%`, background: "linear-gradient(90deg, #FFD600, #ff9f43)", borderRadius: 99, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <span style={{ color: "#444", fontSize: 12 }}>Question {current + 1} / {questions.length}</span>
              <span style={{ color: "#444", fontSize: 12 }}>{questions.length - current - 1} remaining</span>
            </div>

            {/* Question card */}
            <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 20, padding: "28px 28px 24px", marginBottom: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.45)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <span style={{ color: "#333", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Bebas Neue',sans-serif" }}>Q{current + 1}</span>
                {q.difficulty && <span style={{ background: `${diffColor[q.difficulty] || "#888"}18`, color: diffColor[q.difficulty] || "#888", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>{q.difficulty}</span>}
                {q.tag && <span style={{ background: "rgba(255,214,0,0.1)", color: "#FFD600", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>{q.tag}</span>}
              </div>

              <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, lineHeight: 1.7, marginBottom: 26 }}>{q.question}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, idx) => (
                  <button key={idx} className="mcq-opt-btn" disabled={isAnswered} onClick={() => choose(idx)}>
                    <div className="mcq-opt-inner" style={optStyle(idx)}>
                      <span style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: selected[current] === idx ? "rgba(255,214,0,0.2)" : "#1e1e1e", color: selected[current] === idx ? "#FFD600" : "#555", border: "1px solid #2a2a2a", transition: "background 0.15s" }}>
                        {["A","B","C","D"][idx]}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Note: explanation only shown in results, not during quiz */}
              {isAnswered && (
                <div className="mcq-explain" style={{ marginTop: 20, background: "#0e0e0e", border: "1px solid rgba(255,214,0,0.12)", borderRadius: 14, padding: "12px 16px" }}>
                  <p style={{ color: "#666", fontSize: 12 }}>Answer locked ✓ &nbsp;— Correct answer revealed after submission.</p>
                </div>
              )}
            </div>

            {/* Dot navigator */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
              {questions.map((_, i) => {
                const done  = selected[i] !== null;
                const isCur = i === current;
                return (
                  <div key={i} className="mcq-dot"
                    style={{ background: isCur ? "#FFD600" : done ? "rgba(255,214,0,0.15)" : "#161616", color: isCur ? "#000" : done ? "#FFD600" : "#444", border: isCur ? "1px solid #FFD600" : "1px solid #2a2a2a", boxShadow: isCur ? "0 0 12px rgba(255,214,0,0.45)" : "none" }}
                    onClick={() => { setCurrent(i); }}>
                    {i + 1}
                  </div>
                );
              })}
            </div>

            {/* Next / Submit */}
            <button
              disabled={!isAnswered}
              onClick={goNext}
              style={{ width: "100%", padding: "15px", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: isAnswered ? "pointer" : "not-allowed", transition: "background 0.2s, box-shadow 0.2s", fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em", background: isAnswered ? "#FFD600" : "#1a1a1a", color: isAnswered ? "#000" : "#333", boxShadow: isAnswered ? "0 0 22px rgba(255,214,0,0.4)" : "none" }}>
              {!isAnswered ? "Select an answer to continue" : current === questions.length - 1 ? "Submit & See Results ✓" : "Next Question →"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
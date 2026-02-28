// pages/skillTest/MCQPage.jsx — Backend connected
// Features: prev/next nav, tab-switch "Test Ended" overlay, early submit with confirm modal
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
  @keyframes modalIn { from{opacity:0;transform:scale(0.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
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
  .nav-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border-radius: 11px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif; border: 1px solid #2a2a2a; background: #161616; color: #666; }
  .nav-btn:hover:not(:disabled) { border-color: rgba(255,214,0,0.35); color: #FFD600; background: rgba(255,214,0,0.06); }
  .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .early-submit-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.18s; font-family: 'Inter', sans-serif; border: 1px solid rgba(255,80,80,0.25); background: rgba(255,80,80,0.08); color: #ff6b6b; }
  .early-submit-btn:hover { border-color: rgba(255,80,80,0.5); background: rgba(255,80,80,0.14); }
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

// ─── Submit Confirm Modal ─────────────────────────────────────────────────────
function SubmitConfirmModal({ open, answered, total, onConfirm, onCancel }) {
  if (!open) return null;
  const skipped = total - answered;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 20, padding: 26, width: "100%", maxWidth: 360, boxShadow: "0 30px 80px rgba(0,0,0,0.8)", animation: "modalIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,214,0,0.1)", border: "1px solid rgba(255,214,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📋</div>
        </div>
        {/* Text */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em", marginBottom: 10 }}>SUBMIT TEST?</h2>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
            <span style={{ background: "rgba(29,209,161,0.1)", color: "#1dd1a1", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 7, border: "1px solid rgba(29,209,161,0.2)" }}>
              ✅ {answered} Answered
            </span>
            {skipped > 0 && (
              <span style={{ background: "rgba(136,136,136,0.1)", color: "#888", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 7, border: "1px solid rgba(136,136,136,0.2)" }}>
                ⏭ {skipped} Skipped
              </span>
            )}
          </div>
          {skipped > 0 && (
            <p style={{ color: "#444", fontSize: 12 }}>
              Skipped questions will be marked as <span style={{ color: "#888", fontWeight: 700 }}>unattempted</span>.
            </p>
          )}
        </div>
        {/* Actions */}
        <div style={{ display: "flex", gap: 9 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", background: "#1a1a1a", color: "#666", border: "1px solid #2a2a2a", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.18s", fontFamily: "Inter,sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#666"; }}>
            Keep Going
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px 0", background: "#FFD600", color: "#000", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all 0.18s", fontFamily: "Inter,sans-serif", boxShadow: "0 0 14px rgba(255,214,0,0.3)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ffe033"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#FFD600"; }}>
            Yes, Submit ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Switch "Test Ended" Overlay ─────────────────────────────────────────
function TabSwitchOverlay({ count, onDismissAndSubmit }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(12px)" }}>
      <div style={{ background: "#111", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 22, padding: 32, width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,80,80,0.1)", animation: "modalIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards" }}>
        {/* Icon */}
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 18px" }}>⚠️</div>
        <h2 style={{ color: "#ff6b6b", fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: "0.08em", marginBottom: 8 }}>TAB SWITCH DETECTED</h2>
        <p style={{ color: "#555", fontSize: 13, lineHeight: 1.7, marginBottom: 6 }}>
          You switched away from this tab.
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: 8, padding: "5px 14px", marginBottom: 18 }}>
          <span style={{ color: "#ff6b6b", fontWeight: 800, fontSize: 14 }}>
            Violation #{count}
          </span>
        </div>
        <p style={{ color: "#444", fontSize: 12, marginBottom: 24 }}>
          Your test has been <span style={{ color: "#ff6b6b", fontWeight: 700 }}>ended automatically</span>. Results will reflect answers submitted so far.
        </p>
        <button
          onClick={onDismissAndSubmit}
          style={{ width: "100%", padding: "13px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "Inter,sans-serif", transition: "all 0.2s", boxShadow: "0 0 18px rgba(255,107,107,0.3)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#ff5252"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#ff6b6b"; }}
        >
          View My Results →
        </button>
      </div>
    </div>
  );
}

const diffColor = { Easy: "#1dd1a1", Medium: "#ff9f43", Hard: "#ff6b6b" };

// ─── Main MCQ Page ───────────────────────────────────────────────────────────
export default function MCQPage() {
  const { testId }  = useParams();
  const navigate    = useNavigate();
  const location    = useLocation();

  const session   = location.state?.session;
  const questions = session?.questions || [];

  const [current, setCurrent]           = useState(0);
  const [selected, setSelected]         = useState(() => Array(questions.length).fill(null));
  const [phase, setPhase]               = useState("quiz"); // "quiz" | "submitting" | "results"
  const [results, setResults]           = useState(null);
  const [submitError, setSubmitError]   = useState("");
  const [timerExpired, setTimerExpired] = useState(false);

  // Tab switch
  const [tabSwitchCount, setTabSwitchCount]   = useState(0);
  const [showTabOverlay, setShowTabOverlay]   = useState(false);
  const tabSwitchTriggered                    = useRef(false);

  // Submit confirm modal
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const startTime = useRef(Date.now());
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  // ── Tab visibility detection ───────────────────────────────
  useEffect(() => {
    if (phase !== "quiz") return;
    const handler = () => {
      if (document.hidden && !tabSwitchTriggered.current) {
        tabSwitchTriggered.current = true;
        setTabSwitchCount(c => c + 1);
        setShowTabOverlay(true);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [phase]);

  // If no session data, redirect back
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

  const q          = questions[current];
  const isAnswered = selected[current] !== null;
  const answeredCount = selected.filter(s => s !== null).length;

  const choose = (idx) => {
    setSelected(prev => { const n = [...prev]; n[current] = idx; return n; });
  };

  const goPrev = () => { if (current > 0) setCurrent(c => c - 1); };
  const goNext = () => { if (current < questions.length - 1) setCurrent(c => c + 1); };

  // ── Submit to backend ──────────────────────────────────────
  const handleSubmit = useCallback(async (forceSelected) => {
    setPhase("submitting");
    setSubmitError("");
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    const src = forceSelected || selectedRef.current;
    const answers = {};
    src.forEach((ans, i) => { if (ans !== null) answers[String(i)] = ans; });
    try {
      const data = await submitTest(session.session_id, { answers, time_taken_seconds: timeTaken });
      setResults(data);
      setPhase("results");
    } catch {
      setSubmitError("Failed to submit. Please try again.");
      setPhase("quiz");
    }
  }, [session]);

  const handleExpire = useCallback(() => {
    setTimerExpired(true);
    handleSubmit();
  }, [handleSubmit]);

  // Tab switch → auto submit
  const handleTabSubmit = () => {
    setShowTabOverlay(false);
    handleSubmit();
  };

  // Early submit (from button) → show confirm first
  const requestEarlySubmit = () => setShowSubmitConfirm(true);
  const confirmEarlySubmit = () => { setShowSubmitConfirm(false); handleSubmit(); };
  const cancelEarlySubmit  = () => setShowSubmitConfirm(false);

  // On last question next = submit confirm
  const handleNextOrSubmit = () => {
    if (current === questions.length - 1) {
      setShowSubmitConfirm(true);
    } else {
      goNext();
    }
  };

  const optStyle = (idx) => {
    const base = { width: "100%", padding: "14px 18px", borderRadius: 14, fontSize: 14, fontWeight: 500, border: "1px solid #2a2a2a", background: "#161616", color: "#bbb", textAlign: "left", transition: "border-color 0.15s, background 0.15s, color 0.15s", display: "flex", alignItems: "center", gap: 14 };
    if (idx === selected[current]) return { ...base, background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.4)", color: "#FFD600" };
    return base;
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

  // ── RESULTS ────────────────────────────────────────────────
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

              <div className="mcq-pop-in" style={{ background: "#111", border: `1px solid ${gradeStyle.color}30`, borderRadius: 22, padding: "36px 28px", textAlign: "center", marginBottom: 28, boxShadow: `0 0 50px ${gradeStyle.color}12` }}>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
                  {timerExpired && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, padding: "4px 14px" }}>
                      <span style={{ fontSize: 13 }}>⏰</span>
                      <span style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700 }}>Time Expired</span>
                    </div>
                  )}
                  {tabSwitchCount > 0 && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: 8, padding: "4px 14px" }}>
                      <span style={{ fontSize: 13 }}>⚠️</span>
                      <span style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700 }}>Tab Switch Violation</span>
                    </div>
                  )}
                </div>

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

              <p style={{ color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 16 }}>Answer Review</p>
              {reviewList.map((r, i) => {
                const correct_ans = r.correct_answer;
                const user_ans    = r.user_answer;
                const verdict     = r.verdict;
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
                <button className="mcq-action-btn mcq-btn-pri" onClick={() => navigate("/skillTest")}>New Test ↺</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── QUIZ UI ────────────────────────────────────────────────
  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* Tab switch overlay — renders on top of everything */}
      {showTabOverlay && (
        <TabSwitchOverlay count={tabSwitchCount} onDismissAndSubmit={handleTabSubmit} />
      )}

      {/* Submit confirmation modal */}
      <SubmitConfirmModal
        open={showSubmitConfirm}
        answered={answeredCount}
        total={questions.length}
        onConfirm={confirmEarlySubmit}
        onCancel={cancelEarlySubmit}
      />

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
              <span style={{ color: "#444", fontSize: 12 }}>{answeredCount} / {questions.length} answered</span>
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
                  <button key={idx} className="mcq-opt-btn" onClick={() => choose(idx)}>
                    <div className="mcq-opt-inner" style={optStyle(idx)}>
                      <span style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, background: selected[current] === idx ? "rgba(255,214,0,0.2)" : "#1e1e1e", color: selected[current] === idx ? "#FFD600" : "#555", border: "1px solid #2a2a2a", transition: "background 0.15s" }}>
                        {["A","B","C","D"][idx]}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>


            </div>

            {/* Dot navigator */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
              {questions.map((_, i) => {
                const done  = selected[i] !== null;
                const isCur = i === current;
                return (
                  <div key={i} className="mcq-dot"
                    style={{ background: isCur ? "#FFD600" : done ? "rgba(255,214,0,0.15)" : "#161616", color: isCur ? "#000" : done ? "#FFD600" : "#444", border: isCur ? "1px solid #FFD600" : "1px solid #2a2a2a", boxShadow: isCur ? "0 0 12px rgba(255,214,0,0.45)" : "none" }}
                    onClick={() => setCurrent(i)}>
                    {i + 1}
                  </div>
                );
              })}
            </div>

            {/* Prev / Next row */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              {/* Prev */}
              <button className="nav-btn" disabled={current === 0} onClick={goPrev}>
                ← Prev
              </button>

              {/* Next or Submit */}
              <button
                onClick={handleNextOrSubmit}
                disabled={!isAnswered}
                style={{
                  flex: 1, padding: "13px", border: "none", borderRadius: 13, fontWeight: 800, fontSize: 14,
                  cursor: isAnswered ? "pointer" : "not-allowed", transition: "background 0.2s, box-shadow 0.2s",
                  fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em",
                  background: isAnswered ? "#FFD600" : "#1a1a1a",
                  color: isAnswered ? "#000" : "#333",
                  boxShadow: isAnswered ? "0 0 22px rgba(255,214,0,0.4)" : "none"
                }}>
                {!isAnswered
                  ? "Select an answer to continue"
                  : current === questions.length - 1
                  ? "Submit & See Results ✓"
                  : "Next Question →"}
              </button>
            </div>

            {/* Early submit — separated at bottom to avoid accidental click */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 8, borderTop: "1px solid #161616" }}>
              <button className="early-submit-btn" onClick={requestEarlySubmit}>
                ⏹ End Test Early ({answeredCount}/{questions.length} answered)
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
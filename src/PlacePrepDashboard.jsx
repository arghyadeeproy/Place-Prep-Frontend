import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { useAuth } from "./AuthContext";
import { fetchDashboard } from "./services/dashboardService";
import PageLayout from "./PageLayout";

// ── Tooltip ───────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 14px" }}>
        <p style={{ color: "#FFD600", fontWeight: 700, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: "#ccc", fontSize: 12 }}>{p.name}: <span style={{ color: "#FFD600" }}>{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

const tagColor = (tag) => {
  const map = { DSA: "#FFD600", DBMS: "#ff9f43", OS: "#54a0ff", Aptitude: "#5f27cd", CN: "#00d2d3", OOPs: "#ff6b81", SQL: "#1dd1a1", Python: "#6c5ce7", Java: "#e17055" };
  return map[tag] || "#FFD600";
};

// ─────────────────────────────────────────────────────────────────────────────
export default function PlacePrepDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchDashboard();
        setDashboard(data);
      } catch (err) {
        setDataError("Failed to load dashboard. Please refresh.");
        console.error("[Dashboard]", err);
      } finally {
        setDataLoading(false);
      }
    })();
  }, []);

  const stats       = dashboard?.stats          || {};
  const scoreTrend  = dashboard?.score_trend    || [];
  const tagPerf     = dashboard?.tag_performance || {};
  const recentTests = dashboard?.recent_attempts?.slice(0, 4) || [];

  const weeklyData = scoreTrend.slice(-7).map((s) => ({
    day:       s.date,
    score:     s.score,
    questions: Math.round((s.score / 100) * 5) || 1,
  }));

  const subjectData = Object.entries(tagPerf).map(([subject, score]) => ({ subject, score }));
  const readiness   = stats.accuracy_pct || 0;
  const radialData  = [{ name: "Progress", value: readiness, fill: "#FFD600" }];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <PageLayout activeRoute="/dashboard">
      <style>{`
        .stat-card { background: #111; border: 1px solid #1f1f1f; border-radius: 16px; padding: 20px; transition: all 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .stat-card:hover { border-color: rgba(255,214,0,0.2); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,214,0,0.08); }
        .chart-card { background: #111; border: 1px solid #1f1f1f; border-radius: 16px; padding: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .progress-bar-bg { background: #1e1e1e; border-radius: 99px; height: 6px; overflow: hidden; }
        .progress-bar-fill { height: 100%; border-radius: 99px; transition: width 1s ease; }
        .score-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
        .skeleton { background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .fade-in { animation: fade-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes fade-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Error banner */}
      {dataError && (
        <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#ff6b6b", fontSize: 13 }}>
          ⚠️ {dataError}
        </div>
      )}

      <div className="fade-in">
        {/* Greeting */}
        <div className="mb-6">
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
            {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
          </h2>
          <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>Here's your placement prep summary for today.</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Accuracy",    value: dataLoading ? "—" : `${stats.accuracy_pct ?? 0}%`,  sub: `${stats.correct_answers ?? 0} correct answers`, icon: "🎯", color: "#FFD600" },
            { label: "Tests Taken", value: dataLoading ? "—" : String(stats.tests_taken ?? 0), sub: `${stats.tests_this_week ?? 0} this week`,        icon: "📝", color: "#54a0ff" },
            { label: "Best Score",  value: dataLoading ? "—" : `${stats.best_score ?? 0}%`,    sub: `Avg: ${stats.avg_score ?? 0}%`,                  icon: "⚡", color: "#ff9f43" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              {dataLoading ? (
                <>
                  <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 28, width: "40%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 11, width: "70%" }} />
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <span style={{ fontSize: 10, color: "#444", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{s.sub}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ── My Progress section (anchor target) ── */}
        <div id="my-progress">
          {/* Charts row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div className="chart-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Score Trend</p>
                  <p style={{ color: "#555", fontSize: 11, marginTop: 2 }}>Recent attempts</p>
                </div>
                <span style={{ background: "rgba(255,214,0,0.1)", color: "#FFD600", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(255,214,0,0.2)" }}>Live</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weeklyData.length ? weeklyData : [{ day: "—", score: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                  <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" name="Score" stroke="#FFD600" strokeWidth={2.5} dot={{ fill: "#FFD600", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Questions Attempted</p>
                  <p style={{ color: "#555", fontSize: 11, marginTop: 2 }}>Per session</p>
                </div>
                <span style={{ background: "rgba(84,160,255,0.1)", color: "#54a0ff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(84,160,255,0.2)" }}>{stats.total_questions_attempted ?? 0} Total</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData.length ? weeklyData : [{ day: "—", questions: 0 }]} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                  <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="questions" name="Questions" fill="#FFD600" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="chart-card">
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Subject Analysis</p>
              <p style={{ color: "#555", fontSize: 11, marginTop: 2 }}>Accuracy by topic</p>
            </div>
            {subjectData.length === 0 ? (
              <p style={{ color: "#444", fontSize: 13, textAlign: "center", marginTop: 30 }}>No data yet — take a test!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {subjectData.map((s) => (
                  <div key={s.subject}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "#bbb", fontWeight: 600 }}>{s.subject}</span>
                      <span style={{ fontSize: 12, color: s.score >= 75 ? "#FFD600" : s.score >= 60 ? "#ff9f43" : "#ff6b6b", fontWeight: 700 }}>{s.score}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{
                        width: `${s.score}%`,
                        background: s.score >= 75 ? "linear-gradient(90deg,#FFD600,#ffaa00)" : s.score >= 60 ? "linear-gradient(90deg,#ff9f43,#ee5a24)" : "linear-gradient(90deg,#ff6b6b,#ee5a24)"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* ── Achievements section (anchor target) ── */}
            <div id="achievements" className="chart-card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 100, height: 100, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: "#1e1e1e" }} dataKey="value" angleAxisId={0} cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p style={{ color: "#555", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Placement Readiness</p>
                <p style={{ color: "#FFD600", fontSize: 32, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", lineHeight: 1.1 }}>{readiness}%</p>
                <p style={{ color: "#555", fontSize: 11, marginTop: 4 }}>
                  {readiness >= 80 ? "You're ready! 🎉" : readiness >= 60 ? "Almost there! 🚀" : "Keep going! 💪"}
                </p>
              </div>
            </div>

            <div className="chart-card" style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Recent Tests</p>
              {recentTests.length === 0 ? (
                <p style={{ color: "#444", fontSize: 13, textAlign: "center", marginTop: 20 }}>No tests yet — try SkillTest!</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recentTests.map((t) => (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#ccc", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.topic} · {t.difficulty}
                        </p>
                        <p style={{ color: "#444", fontSize: 10, marginTop: 2 }}>{t.correct}/{t.total_questions} correct</p>
                      </div>
                      <span className="score-badge" style={{ background: `${tagColor(t.topic)}18`, color: tagColor(t.topic), border: `1px solid ${tagColor(t.topic)}33` }}>
                        {t.topic}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: t.score_pct >= 75 ? "#FFD600" : t.score_pct >= 60 ? "#ff9f43" : "#ff6b6b", minWidth: 40, textAlign: "right" }}>
                        {t.score_pct}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
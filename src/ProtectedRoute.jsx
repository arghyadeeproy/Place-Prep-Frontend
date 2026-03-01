import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading)     return <AuthLoadingScreen />;
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

export function PublicRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading)    return <AuthLoadingScreen />;
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return children;
}

// ── Full-screen spinner shown only during the ~50ms Firebase startup ─────────
function AuthLoadingScreen() {
  return (
    <div style={{
      height: "100vh", width: "100%", background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 16,
    }}>
      <style>{`
        @keyframes pp-spin { to { transform: rotate(360deg); } }
        .pp-spinner {
          width: 40px; height: 40px; border-radius: 50%;
          border: 3px solid #1e1e1e; border-top-color: #FFD600;
          animation: pp-spin 0.7s linear infinite;
        }
      `}</style>
      <div className="pp-spinner" />
      <p style={{ color: "#333", fontSize: 12, fontFamily: "Inter, sans-serif", letterSpacing: "0.05em" }}>
        PLACE-PREP
      </p>
    </div>
  );
}
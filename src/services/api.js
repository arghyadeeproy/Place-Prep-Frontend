import axios from "axios";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://place-prep-backend.onrender.com/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30_000, // 30 s — Gemini calls can be slow
});

// ── Attach fresh Firebase ID token to every request ───────────
api.interceptors.request.use(
  async (config) => {
    try {
      if (auth.currentUser) {
        // true = force-refresh if token expired (Firebase handles timing)
        const token = await auth.currentUser.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("[api] getIdToken failed:", err.message);
      await _forceLogout();
      return Promise.reject(err);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// ── Handle auth errors from backend ──────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      await _forceLogout();
    }
    return Promise.reject(err);
  }
);

async function _forceLogout() {
  try { await signOut(auth); } catch (_) {}
  window.location.href = "/"; // hard redirect — clears all React state
}

export default api;
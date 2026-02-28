// services/authService.js
// ─────────────────────────────────────────────────────────────────────────────
// All Firebase Auth operations. Components never import Firebase directly —
// they call these functions.
// ─────────────────────────────────────────────────────────────────────────────
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import api from "./api";

// ── Register (email / password) ───────────────────────────────────────────────
export async function registerWithEmail({ name, email, password, college = "", branch = "", year = 1 }) {
  // 1. Create Firebase Auth user
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  // 2. Set display name so AuthContext can read it immediately
  await updateProfile(credential.user, { displayName: name });
  // 3. Create Firestore profile via backend — token attached automatically
  await api.post("/auth/register/", { name, email, password, college, branch, year });
  return credential.user;
}

// ── Login (email / password) ──────────────────────────────────────────────────
export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ── Google Sign-In ─────────────────────────────────────────────────────────────
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user   = result.user;

  // Ensure backend Firestore profile exists (no-op for returning users)
  try {
    await api.post("/auth/register/", {
      name:     user.displayName || "User",
      email:    user.email,
      password: `google_${user.uid}`, // placeholder — backend ignores for existing accounts
    });
  } catch (err) {
    // 400 "account already exists" → perfectly fine for returning users
    if (err.response?.status !== 400) throw err;
  }

  return user;
}

// ── Forgot password ───────────────────────────────────────────────────────────
export async function sendResetEmail(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ── Map Firebase error codes → friendly UI messages ───────────────────────────
export function friendlyFirebaseError(err) {
  const code = err?.code || "";
  const map  = {
    "auth/invalid-credential":     "Invalid email or password.",
    "auth/user-not-found":         "No account found with this email.",
    "auth/wrong-password":         "Incorrect password.",
    "auth/email-already-in-use":   "An account with this email already exists.",
    "auth/weak-password":          "Password must be at least 6 characters.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/popup-closed-by-user":   "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/too-many-requests":      "Too many attempts. Please try again later.",
  };
  return map[code] || err?.response?.data?.detail || err?.message || "Something went wrong.";
}
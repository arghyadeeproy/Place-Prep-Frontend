// services/authService.js
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

export async function registerWithEmail({ name, email, password, college = "", branch = "", year = 1 }) {
  // 1. Create Firebase Auth user client-side
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  // 2. Set display name immediately
  await updateProfile(credential.user, { displayName: name });
  // 3. Create Firestore profile via backend (backend uses get_user_by_email, NOT create_user)
  await api.post("/auth/register/", { name, email, password, college, branch, year });
  return credential.user;
}

export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  // ✅ No backend call needed here — FirebaseAuthentication middleware in
  // authentication.py auto-creates the Firestore doc on the first authenticated request.
  return result.user;
}

export async function sendResetEmail(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function logout() {
  await signOut(auth);
}

export function friendlyFirebaseError(err) {
  const code = err?.code || "";
  const map = {
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
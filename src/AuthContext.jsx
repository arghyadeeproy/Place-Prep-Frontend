// AuthContext.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Wraps Firebase's onAuthStateChanged so every component reacts to
// login / logout instantly with zero extra code.
//
// Provides:
//   user        → { uid, name, email, initials, photoURL } or null
//   loading     → true while Firebase resolves the initial auth state
//   isLoggedIn  → boolean shorthand
//   logout()    → Firebase sign-out (AuthContext updates automatically)
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { logout as firebaseLogout } from "./services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading]           = useState(true); // true until Firebase resolves

  useEffect(() => {
    // Firebase fires this immediately with the cached session — no flicker
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup listener on unmount
  }, []);

  const logout = async () => {
    await firebaseLogout();
    // onAuthStateChanged above fires → firebaseUser → null automatically
  };

  // Derive a clean display object for the UI
  const user = firebaseUser
    ? {
        uid:      firebaseUser.uid,
        name:     firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        email:    firebaseUser.email || "",
        initials: _initials(firebaseUser.displayName || firebaseUser.email || "U"),
        photoURL: firebaseUser.photoURL || null,
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!firebaseUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function _initials(name) {
  return (
    name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() || "").join("").slice(0, 2) || "??"
  );
}
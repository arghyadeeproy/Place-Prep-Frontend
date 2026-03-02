import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { logout as firebaseLogout } from "./services/authService";
import api from "./services/api";

const AuthContext = createContext(null);

function _initials(name) {
  return (
    name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() || "").join("").slice(0, 2) || "??"
  );
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile]           = useState(null); // full Firestore doc
  const [loading, setLoading]           = useState(true);

  // Fetch full Firestore profile from backend
  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/auth/profile/");
      setProfile(res.data?.data || null);
    } catch {
      setProfile(null);
    }
  }, []);

  // Called after PATCH /auth/profile/ to update local state immediately
  const refreshUser = useCallback((updatedFields) => {
    setProfile(prev => prev ? { ...prev, ...updatedFields } : updatedFields);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Wait for token to be ready then fetch Firestore profile
        await fetchProfile();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchProfile]);

  const logout = async () => {
    await firebaseLogout();
    setProfile(null);
  };

  // Merge Firebase Auth fields with Firestore profile
  // Firestore profile wins for all fields it has
  const user = firebaseUser
    ? {
        // From Firebase Auth (always available)
        uid:      firebaseUser.uid,
        email:    firebaseUser.email || "",

        // From Firestore profile (preferred) — fallback to Firebase Auth
        name:     profile?.name     || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        initials: profile?.name
                    ? _initials(profile.name)
                    : _initials(firebaseUser.displayName || firebaseUser.email || "U"),
        photoURL: profile?.photoURL || firebaseUser.photoURL || null,

        // Firestore-only fields (not in Firebase Auth)
        bio:      profile?.bio      || "",
        dob:      profile?.dob      || "",
        college:  profile?.college  || "",
        branch:   profile?.branch   || "",
        year:     profile?.year     || 1,
        linkedin: profile?.linkedin || "",
        github:   profile?.github   || "",
        resume:   profile?.resume   || "",
        targets:  profile?.targets  || [],
        stats:    profile?.stats    || {
          tests_taken: 0, total_score: 0,
          posts: 0, comments: 0, modules_done: 0,
        },
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!firebaseUser, logout, refreshUser, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
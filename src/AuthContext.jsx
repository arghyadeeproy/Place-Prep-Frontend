import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { logout as firebaseLogout } from "./services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading]           = useState(true); 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await firebaseLogout();
  };
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
// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebaseConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);   // "admin" | "customer" | null
  const [loading, setLoading] = useState(true);

  // Crea el doc en Firestore si no existe y devuelve el rol
  const ensureUserDoc = async (firebaseUser, extraFields = {}) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      const defaultRole = "customer";
      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        role: defaultRole,
        ...extraFields,
      });
      return defaultRole;
    } else {
      const data = snap.data();
      return data.role || "customer";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);

          let currentRole = "customer";
          if (snap.exists()) {
            const data = snap.data();
            currentRole = data.role || "customer";
          } else {
            currentRole = await ensureUserDoc(firebaseUser);
          }

          setUser(firebaseUser);
          setRole(currentRole);
        } catch (error) {
          console.error("Error obteniendo rol del usuario:", error);
          setUser(firebaseUser);
          setRole("customer");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    const defaultRole = "customer";
    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      displayName: displayName || "",
      role: defaultRole,
    });

    setUser(cred.user);
    setRole(defaultRole);
    return cred.user;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const currentRole = await ensureUserDoc(cred.user);
    setUser(cred.user);
    setRole(currentRole);
    return cred.user;
  };

  const logout = () => signOut(auth);

  const value = {
    user,
    role,
    isAdmin: role === "admin",
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

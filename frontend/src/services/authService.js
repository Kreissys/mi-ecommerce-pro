// src/services/authService.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

// Registrar usuario con correo y contraseña
export const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login con correo y contraseña
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Login con Google
export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Cerrar sesión
export const logout = () => {
  return signOut(auth);
};

// Escuchar cambios de sesión (usuario conectado / desconectado)
export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";   // <-- IMPORTANTE
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAbGvDu8yLqp1qep1PTev8OBtw8c7UThd0",
  authDomain: "ecomerce-pro-9d54b.firebaseapp.com",
  projectId: "ecomerce-pro-9d54b",
  storageBucket: "gs://ecomerce-pro-9d54b.firebasestorage.app",
  messagingSenderId: "877894840276",
  appId: "1:877894840276:web:27629d8907bb42ccffb041",
  measurementId: "G-F70LSWXSL1"
};

const app = initializeApp(firebaseConfig);

// Autenticación
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Storage (subida de fotos)
export const storage = getStorage(app);   // <-- ESTA LÍNEA ES OBLIGATORIA
export const db = getFirestore(app);
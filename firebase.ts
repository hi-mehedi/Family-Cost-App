import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * FIREBASE CONFIGURATION (Using your provided keys)
 */
export const firebaseConfig = {
  apiKey: "AIzaSyA861qpuy78qoMt3BR5Lit3tWkugam1tb8",
  authDomain: "my-familycost.firebaseapp.com",
  projectId: "my-familycost",
  storageBucket: "my-familycost.firebasestorage.app",
  messagingSenderId: "1033739236290",
  appId: "1:1033739236290:web:af90ca86c7b036e2b09c5b",
  measurementId: "G-01QVGS5H8H"
};

// Singleton pattern for Firebase initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services with the shared app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseConfigured = () => true;
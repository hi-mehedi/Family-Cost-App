import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Safe environment variable retrieval
const getEnv = (key: string) => {
  try {
    // Check multiple locations for keys
    const env = (import.meta as any).env || (window as any).process?.env || (typeof process !== 'undefined' ? process.env : {});
    return env[key];
  } catch (e) {
    return undefined;
  }
};

/**
 * FIREBASE CONFIGURATION
 */
export const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || "AIzaSyAs-Placeholder-Key",
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || "family-cost-tracker.firebaseapp.com",
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || "family-cost-tracker",
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || "family-cost-tracker.appspot.com",
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || "123456789",
  appId: getEnv('VITE_FIREBASE_APP_ID') || "1:123456789:web:abcdef"
};

// Singleton pattern for Firebase initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services with the shared app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseConfigured = () => {
  const key = firebaseConfig.apiKey;
  return key && 
         key !== "AIzaSyAs-Placeholder-Key" && 
         key.startsWith("AIza") && 
         !key.includes("Placeholder");
};
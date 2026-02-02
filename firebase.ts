
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * FIREBASE CONFIGURATION
 * To use Cloud Sync on Vercel:
 * 1. Go to Vercel Dashboard > Settings > Environment Variables
 * 2. Add these keys:
 *    VITE_FIREBASE_API_KEY
 *    VITE_FIREBASE_AUTH_DOMAIN
 *    VITE_FIREBASE_PROJECT_ID
 *    VITE_FIREBASE_STORAGE_BUCKET
 *    VITE_FIREBASE_MESSAGING_SENDER_ID
 *    VITE_FIREBASE_APP_ID
 */
export const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyAs-Placeholder-Key",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "family-cost-tracker.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "family-cost-tracker",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "family-cost-tracker.appspot.com",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Utility to check if real credentials are being used.
 * Prevents app crashes if Vercel environment variables aren't set yet.
 */
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "AIzaSyAs-Placeholder-Key" && 
         firebaseConfig.apiKey.startsWith("AIza") &&
         !firebaseConfig.apiKey.includes("Placeholder");
};


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace these with your actual Firebase project config from the Firebase Console
// Project Settings > General > Your apps > Web app (</>)
export const firebaseConfig = {
  apiKey: "AIzaSyAs-Placeholder-Key",
  authDomain: "family-cost-tracker.firebaseapp.com",
  projectId: "family-cost-tracker",
  storageBucket: "family-cost-tracker.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "AIzaSyAs-Placeholder-Key";
};

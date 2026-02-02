import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyA861qpuy78qoMt3BR5Lit3tWkugam1tb8",
  authDomain: "my-familycost.firebaseapp.com",
  projectId: "my-familycost",
  storageBucket: "my-familycost.firebasestorage.app",
  messagingSenderId: "1033739236290",
  appId: "1:1033739236290:web:af90ca86c7b036e2b09c5b",
  measurementId: "G-01QVGS5H8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);
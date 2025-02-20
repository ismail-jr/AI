import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase Configuration (Environment Variables for Security)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // Optional
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, // Optional
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID, // Optional
};

// ✅ Initialize Firebase App (Prevent re-initialization in SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Authentication Providers (Google & GitHub)
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

// ✅ Export Services & Providers
export { auth, db, googleProvider, githubProvider, app };

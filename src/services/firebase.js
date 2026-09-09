// Firebase Web Client Initialization for Saptaganga Matrimony
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (process?.env || {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForSaptagangaMatrimony",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "saptaganga-matrimony.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "saptaganga-matrimony",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "saptaganga-matrimony.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109602848366",
  appId: env.VITE_FIREBASE_APP_ID || "1:109602848366:web:saptagangaApp"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Auth, Firestore Database, Storage & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const isFirebaseConfigured = () => {
  const key = env.VITE_FIREBASE_API_KEY;
  return !!(key && key !== "your_api_key_here" && !key.includes("Dummy"));
};

export default app;

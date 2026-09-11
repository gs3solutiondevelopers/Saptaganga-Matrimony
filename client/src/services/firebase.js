// Firebase Web Client Initialization for Saptaganga Matrimony
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (process?.env || {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyD3MFarH7DNU8gP106i-PEo4momatd_c2c",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "saptaganga-matrimony.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "saptaganga-matrimony",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "saptaganga-matrimony.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1013178564357",
  appId: env.VITE_FIREBASE_APP_ID || "1:1013178564357:web:542951230a171e52cd816c"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Auth, Firestore Database, Storage & Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const isFirebaseConfigured = () => {
  const key = firebaseConfig.apiKey;
  return !!(key && key !== "your_api_key_here" && !key.includes("Dummy"));
};

export default app;

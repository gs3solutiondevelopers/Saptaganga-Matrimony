import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'saptaganga-matrimony.firebasestorage.app';

  // 1. Try local serviceAccountKey.json path if provided or exists
  const candidatePaths = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    path.resolve(__dirname, '../../credencial/serviceAccountKey.json'),
    path.resolve(__dirname, '../credencial/serviceAccountKey.json')
  ].filter(Boolean);

  let keyPathFound = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      keyPathFound = p;
      break;
    }
  }

  if (keyPathFound) {
    console.log(`[Firebase Admin] Initializing with local service account key: ${keyPathFound}`);
    const serviceAccount = JSON.parse(fs.readFileSync(keyPathFound, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket
    });
  } else {
    // 2. Production (Google Cloud Run / GCP): Use Application Default Credentials (ADC)
    console.log('[Firebase Admin] Initializing with Cloud Application Default Credentials (ADC)');
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket
    });
  }

  return admin.app();
};

const firebaseApp = initializeFirebaseAdmin();
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage().bucket();
export default admin;

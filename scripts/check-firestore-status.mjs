import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyPath = path.resolve(__dirname, '../serviceAccountKey.json');

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function checkStatus() {
  console.log('=== SAPTAGANGA FIRESTORE LIVE STATUS ===');
  console.log('Project ID:', serviceAccount.project_id);
  console.log('Client Email:', serviceAccount.client_email);
  console.log('----------------------------------------');

  const collections = ['profiles', 'stories', 'membership_plans', 'users', 'inquiries', 'interests', 'approval_requests', 'payments'];
  for (const col of collections) {
    try {
      const snap = await db.collection(col).get();
      console.log(`📁 Collection [${col}]: ${snap.size} document(s)`);
      if (snap.size > 0) {
        snap.forEach(doc => {
          const d = doc.data();
          const label = d.name || d.coupleNames || d.title || d.fullName || d.email || d.subject || doc.id;
          const extra = d.profession ? `(${d.profession})` : (d.price ? `(${d.price})` : '');
          console.log(`   └─ [${doc.id}]: ${label} ${extra}`);
        });
      }
    } catch (err) {
      console.log(`❌ Collection [${col}]: Error - ${err.message}`);
    }
  }
}

checkStatus().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

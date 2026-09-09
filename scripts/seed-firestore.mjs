// Automated Firestore Seeder for Saptaganga Matrimony
// Uses Firebase Admin SDK with serviceAccountKey.json

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MOCK_PROFILES, MOCK_STORIES, MEMBERSHIP_PLANS } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyPath = path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.error("❌ serviceAccountKey.json not found in root directory!");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedDatabase() {
  console.log("🚀 Initializing Saptaganga Matrimony Firestore Database Seeding...");
  console.log(`📌 Project ID: ${serviceAccount.project_id}\n`);

  try {
    // 1. Seed Verified Profiles
    console.log("🌸 Seeding Matrimonial Profiles...");
    for (const profile of MOCK_PROFILES) {
      await db.collection('profiles').doc(profile.id).set({
        ...profile,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`  ✓ Added Profile: ${profile.name} (${profile.id}) - ${profile.profession}`);
    }

    // 2. Seed Success Stories
    console.log("\n💍 Seeding Success Stories...");
    for (const story of MOCK_STORIES) {
      const docId = `story-${story.id}`;
      await db.collection('stories').doc(docId).set({
        ...story,
        id: docId,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`  ✓ Added Story: ${story.coupleNames} (${story.marriageYear})`);
    }

    // 3. Seed Membership Plans
    console.log("\n💎 Seeding Membership Plans...");
    for (const plan of MEMBERSHIP_PLANS) {
      const docId = String(plan.id);
      await db.collection('membership_plans').doc(docId).set({
        ...plan,
        id: docId,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`  ✓ Added Plan: ${plan.name} (${plan.price})`);
    }

    console.log("\n✨ Saptaganga Matrimony Firestore database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

seedDatabase();

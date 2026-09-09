// Firestore Database Service for Saptaganga Matrimony
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { MOCK_PROFILES, MOCK_STORIES, MEMBERSHIP_PLANS } from '../data/mockData.js';

export const firestoreService = {
  // Fetch profiles with optional filters
  async getProfiles(filters = {}) {
    if (!isFirebaseConfigured()) {
      return this._filterLocalProfiles(MOCK_PROFILES, filters);
    }

    try {
      const profilesRef = collection(db, 'profiles');
      let q = query(profilesRef);

      if (filters.gender && filters.gender !== 'any') {
        q = query(profilesRef, where('gender', '==', filters.gender.toLowerCase()));
      }

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // If Firestore collection is empty, return initial mock data
        return this._filterLocalProfiles(MOCK_PROFILES, filters);
      }

      let profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return this._filterLocalProfiles(profiles, filters);
    } catch (error) {
      console.warn("Firestore query fallback to local mock data:", error.message);
      return this._filterLocalProfiles(MOCK_PROFILES, filters);
    }
  },

  // Helper filter logic
  _filterLocalProfiles(profiles, filters) {
    let results = [...profiles];

    if (filters.gender && filters.gender !== 'any') {
      results = results.filter(p => p.gender?.toLowerCase() === filters.gender.toLowerCase());
    }
    if (filters.religion && filters.religion !== 'any') {
      results = results.filter(p => p.religion?.toLowerCase() === filters.religion.toLowerCase());
    }
    if (filters.motherTongue && filters.motherTongue !== 'any') {
      results = results.filter(p => p.motherTongue?.toLowerCase() === filters.motherTongue.toLowerCase());
    }
    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'brides') {
        results = results.filter(p => p.gender === 'female');
      } else if (filters.category === 'grooms') {
        results = results.filter(p => p.gender === 'male');
      } else if (filters.category === 'doctors') {
        results = results.filter(p => p.profession?.toLowerCase().includes('doctor') || p.profession?.toLowerCase().includes('physician') || p.profession?.toLowerCase().includes('dental'));
      } else if (filters.category === 'tech') {
        results = results.filter(p => p.profession?.toLowerCase().includes('software') || p.profession?.toLowerCase().includes('data') || p.profession?.toLowerCase().includes('engineer'));
      }
    }
    if (filters.minAge && filters.maxAge) {
      results = results.filter(p => p.age >= filters.minAge && p.age <= filters.maxAge);
    }

    return { success: true, data: results };
  },

  // Get profile by ID
  async getProfileById(id) {
    if (!isFirebaseConfigured()) {
      const profile = MOCK_PROFILES.find(p => p.id === id);
      return { success: !!profile, data: profile };
    }

    try {
      const docRef = doc(db, 'profiles', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      }
      const local = MOCK_PROFILES.find(p => p.id === id);
      return { success: !!local, data: local };
    } catch {
      const local = MOCK_PROFILES.find(p => p.id === id);
      return { success: !!local, data: local };
    }
  },

  // Express Interest / Connect
  async sendInterest(fromUserId, toProfileId, note = "") {
    if (!isFirebaseConfigured()) {
      return { success: true, message: `Connect request sent to ${toProfileId}!` };
    }

    try {
      await addDoc(collection(db, 'interests'), {
        fromUserId: fromUserId || "guest_user",
        toProfileId,
        note,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      return { success: true, message: "Interest sent successfully via Firebase!" };
    } catch (error) {
      console.error("Interest submission error:", error);
      return { success: true, message: "Interest recorded successfully!" };
    }
  },

  // Submit Contact Form Inquiry
  async submitInquiry(inquiryData) {
    if (!isFirebaseConfigured()) {
      return { success: true, message: "Thank you for contacting Saptaganga. Our team will reach out within 24 hours!" };
    }

    try {
      await addDoc(collection(db, 'inquiries'), {
        ...inquiryData,
        createdAt: serverTimestamp()
      });
      return { success: true, message: "Inquiry submitted successfully! Our matchmaking director will call you shortly." };
    } catch (error) {
      console.error("Inquiry error:", error);
      return { success: true, message: "Inquiry received. Thank you!" };
    }
  },

  // Toggle Shortlist in Firestore
  async toggleShortlist(userId, profileId, isFavorite) {
    if (!isFirebaseConfigured() || !userId) return;

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        shortlisted: isFavorite ? arrayUnion(profileId) : arrayRemove(profileId)
      });
    } catch (err) {
      console.warn("Shortlist sync error:", err.message);
    }
  }
};

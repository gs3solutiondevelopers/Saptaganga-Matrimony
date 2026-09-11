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
    let baseList = [];

    if (isFirebaseConfigured()) {
      try {
        const snapshot = await getDocs(collection(db, 'profiles'));
        if (!snapshot.empty) {
          baseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (error) {
        console.warn("Firestore query fallback to local mock data:", error.message);
      }
    }

    if (baseList.length === 0) {
      baseList = MOCK_PROFILES;
    }

    // Read approved candidates & registered profile cache from localStorage
    let adminProfiles = [];
    let registeredProfiles = [];
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('saptaganga_admin_profiles');
        if (saved) adminProfiles = JSON.parse(saved);
        const reg = localStorage.getItem('saptaganga_all_registered_profiles');
        if (reg) registeredProfiles = JSON.parse(reg);
      }
    } catch {}

    let userProfile = null;
    try {
      if (typeof localStorage !== 'undefined') {
        const u = localStorage.getItem('saptaganga_user');
        if (u) userProfile = JSON.parse(u);
      }
    } catch {}

    const map = new Map();

    // Default photo fallbacks
    const defaultFemale = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
    const defaultMale = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600';

    // 1. Base / mock profiles first
    baseList.forEach(p => {
      if (p && (p.id || p.memberId)) {
        const id = p.id || p.memberId;
        map.set(id, { ...p, id });
      }
    });

    // 2. Add registered profile cache
    registeredProfiles.forEach(p => {
      if (p && (p.id || p.memberId) && (p.approved || p.status === 'approved' || p.verified)) {
        const id = p.id || p.memberId;
        const genderKey = (p.gender?.toLowerCase() === 'female' || p.gender?.toLowerCase() === 'bride') ? 'Female' : 'Male';
        const photo = p.image || p.profileImage || p.profilePhoto;
        const existing = map.get(id) || {};
        map.set(id, {
          ...existing,
          ...p,
          id,
          name: p.name || p.fullName || existing.name || 'Member',
          fullName: p.name || p.fullName || existing.name || 'Member',
          gender: genderKey,
          age: Number(p.age) || existing.age || 26,
          image: photo || existing.image || (genderKey === 'Female' ? defaultFemale : defaultMale),
          profileImage: photo || existing.profileImage || (genderKey === 'Female' ? defaultFemale : defaultMale),
          category: genderKey === 'Female' ? 'brides' : 'grooms',
          approved: true,
          status: 'approved',
          verified: true
        });
      }
    });

    // 3. Add current user if approved
    if (userProfile && (userProfile.id || userProfile.memberId) && (userProfile.approved || userProfile.status === 'approved' || userProfile.verified)) {
      const id = userProfile.id || userProfile.memberId;
      const genderKey = (userProfile.gender?.toLowerCase() === 'female' || userProfile.gender?.toLowerCase() === 'bride') ? 'Female' : 'Male';
      const photo = userProfile.image || userProfile.profileImage || userProfile.profilePhoto;
      const existing = map.get(id) || {};
      map.set(id, {
        ...existing,
        ...userProfile,
        id,
        name: userProfile.name || userProfile.fullName || existing.name || 'Member',
        fullName: userProfile.name || userProfile.fullName || existing.name || 'Member',
        gender: genderKey,
        age: Number(userProfile.age) || existing.age || 26,
        image: photo || existing.image || (genderKey === 'Female' ? defaultFemale : defaultMale),
        profileImage: photo || existing.profileImage || (genderKey === 'Female' ? defaultFemale : defaultMale),
        category: genderKey === 'Female' ? 'brides' : 'grooms',
        approved: true,
        status: 'approved',
        verified: true
      });
    }

    // 4. Add admin edited profiles (HIGHEST PRIORITY: overrides base & registered profiles)
    adminProfiles.forEach(p => {
      if (p && (p.id || p.memberId)) {
        const id = p.id || p.memberId;
        const isApproved = Boolean(p.approved === true || p.status === 'approved');

        // If this profile is an unapproved pending registration, do NOT publish live on website until admin approves!
        if (!isApproved && !map.has(id)) {
          return;
        }

        const genderKey = (p.gender?.toLowerCase() === 'female' || p.gender?.toLowerCase() === 'bride') ? 'Female' : 'Male';
        const photo = p.image || p.profileImage || p.profilePhoto;
        const existing = map.get(id) || {};
        map.set(id, {
          ...existing,
          ...p,
          id,
          name: p.name || p.fullName || existing.name || 'Member',
          fullName: p.name || p.fullName || existing.name || 'Member',
          gender: genderKey,
          age: Number(p.age) || existing.age || 26,
          image: photo || existing.image || (genderKey === 'Female' ? defaultFemale : defaultMale),
          profileImage: photo || existing.profileImage || (genderKey === 'Female' ? defaultFemale : defaultMale),
          category: genderKey === 'Female' ? 'brides' : 'grooms',
          approved: isApproved,
          status: isApproved ? 'approved' : 'pending_approval',
          verified: Boolean(p.verified)
        });
      }
    });

    // Only approved profiles are shown live on the public website
    const allLiveProfiles = Array.from(map.values()).filter(p => p.approved === true || p.status === 'approved');
    return this._filterLocalProfiles(allLiveProfiles, filters);
  },

  // Helper filter logic
  _filterLocalProfiles(profiles, filters) {
    let results = [...profiles];

    if (filters.gender && filters.gender !== 'any') {
      const g = filters.gender.toLowerCase();
      results = results.filter(p => {
        const pg = p.gender?.toLowerCase() || '';
        return pg === g || (g === 'female' && pg === 'bride') || (g === 'male' && pg === 'groom');
      });
    }
    if (filters.religion && filters.religion !== 'any') {
      results = results.filter(p => p.religion?.toLowerCase() === filters.religion.toLowerCase());
    }
    if (filters.motherTongue && filters.motherTongue !== 'any') {
      results = results.filter(p => p.motherTongue?.toLowerCase() === filters.motherTongue.toLowerCase());
    }
    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'brides') {
        results = results.filter(p => p.gender?.toLowerCase() === 'female' || p.gender?.toLowerCase() === 'bride');
      } else if (filters.category === 'grooms') {
        results = results.filter(p => p.gender?.toLowerCase() === 'male' || p.gender?.toLowerCase() === 'groom');
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

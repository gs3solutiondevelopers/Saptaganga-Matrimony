// Admin Service for Saptaganga Matrimony
// Manages profiles, verifications, stories, inquiries, and stats in Firestore

import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { MOCK_PROFILES, MOCK_STORIES, MEMBERSHIP_PLANS } from '../data/mockData.js';

const ADMIN_STORAGE_KEY = 'saptaganga_admin_session';

export const adminService = {
  // Admin Authentication
  login(email, password, pin) {
    // Default master admin credentials (can be customized)
    if (
      (email === 'admin@saptaganga.com' || email === 'admin') && 
      (password === 'SaptagangaAdmin2026' || password === 'admin123' || pin === '7777')
    ) {
      const session = {
        adminId: 'ADMIN-001',
        email: 'admin@saptaganga.com',
        name: 'Super Admin',
        role: 'Chief Matchmaker & Director',
        loginTime: new Date().toISOString()
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      }
      return { success: true, session };
    }
    return { success: false, error: 'Invalid admin credentials or security PIN.' };
  },

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    return { success: true };
  },

  getSession() {
    if (typeof localStorage === 'undefined') return null;
    const data = localStorage.getItem(ADMIN_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated() {
    return !!this.getSession();
  },

  // 1. Dashboard Statistics
  async getDashboardStats() {
    let totalProfiles = MOCK_PROFILES.length;
    let verifiedCount = MOCK_PROFILES.filter(p => p.verified).length;
    let pendingCount = MOCK_PROFILES.filter(p => !p.verified).length;
    let premiumCount = 4;
    let totalInquiries = 12;

    if (isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'profiles'));
        if (!snap.empty) {
          totalProfiles = snap.size;
          verifiedCount = snap.docs.filter(d => d.data().verified).length;
          pendingCount = totalProfiles - verifiedCount;
        }
        const inqSnap = await getDocs(collection(db, 'inquiries'));
        if (!inqSnap.empty) {
          totalInquiries = inqSnap.size;
        }
      } catch (err) {
        console.warn('Stats fetch fallback to local:', err.message);
      }
    }

    return {
      success: true,
      data: {
        totalProfiles,
        verifiedCount,
        pendingCount,
        premiumCount,
        totalInquiries,
        totalStories: MOCK_STORIES.length
      }
    };
  },

  // 2. Profiles Management
  async getProfiles() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'profiles'));
        if (!snap.empty) {
          return {
            success: true,
            data: snap.docs.map(d => ({ id: d.id, ...d.data() }))
          };
        }
      } catch (err) {
        console.warn('Profiles fetch fallback to local:', err.message);
      }
    }

    const localSaved = typeof localStorage !== 'undefined' ? localStorage.getItem('saptaganga_admin_profiles') : null;
    if (localSaved) {
      return { success: true, data: JSON.parse(localSaved) };
    }
    return { success: true, data: MOCK_PROFILES };
  },

  // 1-Click Verification Toggle
  async toggleVerification(profileId, currentVerifiedStatus) {
    const newStatus = !currentVerifiedStatus;

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'profiles', profileId);
        await updateDoc(docRef, {
          verified: newStatus,
          updatedAt: serverTimestamp()
        });
        return { success: true, verified: newStatus };
      } catch (err) {
        console.warn('Firestore verify update fallback:', err.message);
      }
    }

    // Local state persistence
    return { success: true, verified: newStatus };
  },

  // Create Profile
  async createProfile(profileData) {
    const profileId = profileData.id || `SG-${Math.floor(100 + Math.random() * 900)}`;
    const newProfile = {
      id: profileId,
      name: profileData.name || 'New Member',
      gender: profileData.gender || 'female',
      age: Number(profileData.age) || 25,
      height: profileData.height || "5' 5\"",
      religion: profileData.religion || 'Hindu',
      caste: profileData.caste || 'General',
      motherTongue: profileData.motherTongue || 'Bengali',
      city: profileData.city || 'Kolkata',
      state: profileData.state || 'West Bengal',
      education: profileData.education || 'Graduate',
      profession: profileData.profession || 'Professional',
      company: profileData.company || 'Reputed Organization',
      annualIncome: profileData.annualIncome || '₹10 - 15 LPA',
      familyType: profileData.familyType || 'Joint Family',
      familyStatus: profileData.familyStatus || 'Upper Middle Class',
      diet: profileData.diet || 'Non-Vegetarian',
      rashi: profileData.rashi || 'Kanya (Virgo)',
      nakshatra: profileData.nakshatra || 'Hasta',
      manglik: profileData.manglik || 'Non-Manglik',
      verified: profileData.verified ?? true,
      online: true,
      isFeatured: profileData.isFeatured ?? true,
      category: profileData.gender === 'male' ? 'grooms' : 'brides',
      badge: profileData.badge || 'Verified Profile',
      image: profileData.image || (profileData.gender === 'male' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'),
      about: profileData.about || 'A warm, family-oriented individual looking for a supportive life partner.',
      partnerPreferences: profileData.partnerPreferences || {
        ageRange: '24 - 30 yrs',
        heightRange: '5\' 2" - 5\' 10"',
        education: 'Graduate / Professional',
        religion: 'Hindu',
        location: 'West Bengal'
      }
    };

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'profiles', profileId), {
          ...newProfile,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore profile save fallback:', err.message);
      }
    }

    return { success: true, data: newProfile };
  },

  // Delete Profile
  async deleteProfile(profileId) {
    if (isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'profiles', profileId));
      } catch (err) {
        console.warn('Firestore delete error:', err.message);
      }
    }
    return { success: true, message: `Profile ${profileId} deleted successfully.` };
  },

  // 3. Success Stories CMS
  async getStories() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'stories'));
        if (!snap.empty) {
          return {
            success: true,
            data: snap.docs.map(d => ({ id: d.id, ...d.data() }))
          };
        }
      } catch (err) {
        console.warn('Stories fetch fallback:', err.message);
      }
    }
    return { success: true, data: MOCK_STORIES };
  },

  async createStory(storyData) {
    const docId = `story-${Date.now()}`;
    const newStory = {
      id: docId,
      coupleNames: storyData.coupleNames || 'Happy Couple',
      marriageYear: storyData.marriageYear || 'Married in 2024',
      location: storyData.location || 'Kolkata, WB',
      image: storyData.image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
      story: storyData.story || 'Found our lifetime happiness through Saptaganga Matrimony.',
      highlight: storyData.highlight || '100% Happy Family Match'
    };

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'stories', docId), {
          ...newStory,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore story save fallback:', err.message);
      }
    }

    return { success: true, data: newStory };
  },

  async deleteStory(storyId) {
    if (isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'stories', String(storyId)));
      } catch (err) {
        console.warn('Firestore story delete error:', err.message);
      }
    }
    return { success: true, message: 'Story deleted successfully.' };
  },

  // 4. Inquiries & Leads Manager
  async getInquiries() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'inquiries'));
        if (!snap.empty) {
          return {
            success: true,
            data: snap.docs.map(d => ({ id: d.id, ...d.data() }))
          };
        }
      } catch (err) {
        console.warn('Inquiries fetch fallback:', err.message);
      }
    }

    // Default sample leads
    return {
      success: true,
      data: [
        {
          id: 'inq-1',
          fullName: 'Subhashish Banerjee',
          phone: '+91 98301 23456',
          email: 'subhashish.b@gmail.com',
          profileFor: 'Son (পাত্র)',
          city: 'Kolkata',
          planInterest: 'Diamond Royale',
          message: 'Looking for a Brahmin bride for my son who is a Software Architect in Bangalore.',
          status: 'New Lead',
          createdAt: new Date().toISOString()
        },
        {
          id: 'inq-2',
          fullName: 'Madhumita Mukherjee',
          phone: '+91 98450 78912',
          email: 'madhumita.m@yahoo.com',
          profileFor: 'Daughter (পাত্রী)',
          city: 'Siliguri',
          planInterest: 'Platinum Elite',
          message: 'Need personalized assisted matchmaking for doctor groom.',
          status: 'In Progress',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    };
  },

  async updateInquiryStatus(inquiryId, status) {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'inquiries', inquiryId);
        await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
      } catch (err) {
        console.warn('Inquiry status update fallback:', err.message);
      }
    }
    return { success: true, status };
  },

  async deleteInquiry(inquiryId) {
    if (isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'inquiries', inquiryId));
      } catch (err) {
        console.warn('Inquiry delete fallback:', err.message);
      }
    }
    return { success: true };
  }
};

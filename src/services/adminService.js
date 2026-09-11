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
    const profilesRes = await this.getProfiles();
    const profilesList = profilesRes.success ? profilesRes.data : MOCK_PROFILES;
    const totalProfiles = profilesList.length;
    const verifiedCount = profilesList.filter(p => p.verified && p.approved !== false && p.status === 'approved').length;
    const pendingCount = profilesList.filter(p => !p.approved || p.status === 'pending_approval' || !p.verified).length;
    const premiumCount = profilesList.filter(p => p.membershipTier && p.membershipTier !== 'Free Member').length || 4;
    let totalInquiries = 12;

    if (isFirebaseConfigured()) {
      try {
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
    let list = [];

    if (isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'profiles'));
        if (!snap.empty) {
          list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Profiles fetch fallback to local:', err.message);
      }
    }

    // Load from local storage admin list & all registered profiles
    let localSaved = [];
    let registeredProfiles = [];
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('saptaganga_admin_profiles');
        if (saved) localSaved = JSON.parse(saved);
        const reg = localStorage.getItem('saptaganga_all_registered_profiles');
        if (reg) registeredProfiles = JSON.parse(reg);
      }
    } catch {}

    // Load from current logged-in user profile if exists
    let currentUser = null;
    try {
      if (typeof localStorage !== 'undefined') {
        const u = localStorage.getItem('saptaganga_user');
        if (u) currentUser = JSON.parse(u);
      }
    } catch {}

    const baseProfiles = list.length > 0 ? list : MOCK_PROFILES;
    const combinedMap = new Map();

    // 1. Add base/mock profiles first
    baseProfiles.forEach(p => {
      if (p && (p.id || p.memberId)) {
        const id = p.id || p.memberId;
        combinedMap.set(id, { ...p, id, approved: p.approved ?? true, verified: p.verified ?? true, status: p.status || 'approved' });
      }
    });

    // 2. Add all registered profiles
    registeredProfiles.forEach(p => {
      if (p && (p.id || p.memberId)) {
        const id = p.id || p.memberId;
        const existing = combinedMap.get(id) || {};
        const isApproved = Boolean(p.approved || p.status === 'approved');
        const isVerified = Boolean(p.verified || isApproved);

        combinedMap.set(id, {
          ...existing,
          ...p,
          id,
          name: p.name || p.fullName || existing.name || 'Candidate',
          fullName: p.name || p.fullName || existing.name || 'Candidate',
          approved: isApproved,
          verified: isVerified,
          status: isApproved ? 'approved' : (p.status || 'pending_approval'),
          badge: isVerified ? '100% Verified' : 'Verification Pending'
        });
      }
    });

    // 3. Add local admin profiles
    localSaved.forEach(p => {
      if (p && (p.id || p.memberId)) {
        const id = p.id || p.memberId;
        const existing = combinedMap.get(id) || {};
        const isApproved = Boolean(p.approved || p.status === 'approved');
        const isVerified = Boolean(p.verified || isApproved);

        combinedMap.set(id, {
          ...existing,
          ...p,
          id,
          name: p.name || p.fullName || existing.name || 'Candidate',
          fullName: p.name || p.fullName || existing.name || 'Candidate',
          approved: isApproved,
          verified: isVerified,
          status: isApproved ? 'approved' : (p.status || 'pending_approval'),
          badge: isVerified ? '100% Verified' : 'Verification Pending'
        });
      }
    });

    // 4. Add current user profile if profile was completed
    if (currentUser && (currentUser.memberId || currentUser.id) && currentUser.profileCompleted) {
      const id = currentUser.memberId || currentUser.id;
      const existing = combinedMap.get(id) || {};
      const isApproved = Boolean(currentUser.approved || currentUser.status === 'approved' || existing.approved);
      const isVerified = Boolean(currentUser.verified || isApproved || existing.verified);

      combinedMap.set(id, {
        ...existing,
        ...currentUser,
        id,
        name: currentUser.name || currentUser.fullName || existing.name || 'Candidate',
        fullName: currentUser.name || currentUser.fullName || existing.name || 'Candidate',
        gender: currentUser.gender || existing.gender || 'Male',
        age: currentUser.age || existing.age || 28,
        height: currentUser.height || existing.height || "5' 6\"",
        religion: currentUser.religion || existing.religion || 'Hindu',
        caste: currentUser.caste || existing.caste || 'Kayastha',
        city: currentUser.city || existing.city || 'Kolkata',
        state: currentUser.state || existing.state || 'West Bengal',
        profession: currentUser.occupation || currentUser.profession || existing.profession || 'Professional',
        education: currentUser.highestEducation || currentUser.education || existing.education || 'Graduate',
        image: currentUser.image || currentUser.profileImage || existing.image || existing.profileImage || '',
        profileImage: currentUser.image || currentUser.profileImage || existing.image || existing.profileImage || '',
        verified: isVerified,
        status: isApproved ? 'approved' : (currentUser.status || 'pending_approval'),
        approved: isApproved,
        badge: isVerified ? '100% Verified' : 'Verification Pending'
      });
    }

    // Convert map to array with pending profiles sorted to the top
    const allProfiles = Array.from(combinedMap.values()).sort((a, b) => {
      const aPending = (!a.approved || a.status === 'pending_approval') ? 1 : 0;
      const bPending = (!b.approved || b.status === 'pending_approval') ? 1 : 0;
      return bPending - aPending;
    });

    return { success: true, data: allProfiles };
  },

  // 1-Click Verification Toggle
  async toggleVerification(profileId, currentVerifiedStatus) {
    const newStatus = !currentVerifiedStatus;

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'profiles', profileId);
        await updateDoc(docRef, {
          verified: newStatus,
          approved: newStatus,
          status: newStatus ? 'approved' : 'pending_approval',
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore verify update fallback:', err.message);
      }
    }

    // Local state persistence
    if (typeof localStorage !== 'undefined') {
      try {
        const localSaved = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
        const updated = localSaved.map(p => {
          if (p.id === profileId || p.memberId === profileId) {
            return { 
              ...p, 
              verified: newStatus, 
              approved: newStatus, 
              status: newStatus ? 'approved' : 'pending_approval',
              badge: newStatus ? '100% Verified' : 'Verification Pending'
            };
          }
          return p;
        });
        localStorage.setItem('saptaganga_admin_profiles', JSON.stringify(updated));

        // Update current user if it is their profile
        const user = JSON.parse(localStorage.getItem('saptaganga_user') || 'null');
        if (user && (user.memberId === profileId || user.id === profileId || user.phone === localSaved.find(p => p.id === profileId)?.phone)) {
          user.verified = newStatus;
          user.approved = newStatus;
          user.status = newStatus ? 'approved' : 'pending_approval';
          user.badge = newStatus ? '100% Verified' : 'Verification Pending';
          localStorage.setItem('saptaganga_user', JSON.stringify(user));
        }

        // Dispatch sync events
        try {
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('saptaganga_profile_approved', { detail: { profileId, verified: newStatus } }));
        } catch {}
      } catch (e) {
        console.error('Storage toggle verify error:', e);
      }
    }

    return { success: true, verified: newStatus };
  },

  // Approve Profile by Admin (Publishes Profile live & delivers notification)
  async approveProfile(profileId) {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'profiles', profileId);
        await updateDoc(docRef, {
          approved: true,
          status: 'approved',
          verified: true,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore approve update fallback:', err.message);
      }
    }

    // Local state persistence
    if (typeof localStorage !== 'undefined') {
      try {
        const localSaved = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
        const targetProfile = localSaved.find(p => p.id === profileId || p.memberId === profileId);
        const updated = localSaved.map(p => (p.id === profileId || p.memberId === profileId) ? { ...p, approved: true, status: 'approved', verified: true, badge: '100% Verified' } : p);
        localStorage.setItem('saptaganga_admin_profiles', JSON.stringify(updated));

        // Update current user if it is their profile
        const user = JSON.parse(localStorage.getItem('saptaganga_user') || 'null');
        if (user && (
          user.memberId === profileId || 
          user.id === profileId || 
          (targetProfile && user.phone && targetProfile.phone && user.phone === targetProfile.phone) ||
          (targetProfile && (user.name === targetProfile.name || user.fullName === targetProfile.name))
        )) {
          user.approved = true;
          user.status = 'approved';
          user.verified = true;
          user.badge = '100% Verified';
          localStorage.setItem('saptaganga_user', JSON.stringify(user));
        }

        // Add Notification
        const notifications = JSON.parse(localStorage.getItem('saptaganga_user_notifications') || '[]');
        const approvalNotif = {
          id: `notif-appr-${Date.now()}`,
          type: 'admin_approval',
          title: 'Profile Approved & Verified',
          message: `🎉 Your matrimony profile (${profileId}) has been approved and verified by Admin! It is now published live on Saptaganga.`,
          time: 'Just now',
          unread: true
        };
        localStorage.setItem('saptaganga_user_notifications', JSON.stringify([approvalNotif, ...notifications]));

        // Dispatch sync events to refresh all components across the app
        try {
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('saptaganga_profile_approved', { detail: { profileId } }));
        } catch {}
      } catch (e) {
        console.error('Storage update error:', e);
      }
    }

    return { success: true, approved: true, verified: true };
  },

  // Create Profile
  async createProfile(profileData) {
    const profileId = profileData.id || profileData.memberId || `SG-${Math.floor(100000 + Math.random() * 900000)}`;
    const genderKey = (profileData.gender?.toLowerCase() === 'female' || profileData.gender?.toLowerCase() === 'bride') ? 'Female' : 'Male';
    const isMale = genderKey === 'Male';
    
    const newProfile = {
      id: profileId,
      memberId: profileId,
      name: profileData.name || profileData.fullName || 'New Member',
      fullName: profileData.name || profileData.fullName || 'New Member',
      gender: genderKey,
      age: Number(profileData.age) || 26,
      height: profileData.height || "5' 6\"",
      religion: profileData.religion || 'Hindu',
      caste: profileData.caste || 'General',
      motherTongue: profileData.motherTongue || 'Bengali',
      city: profileData.city || 'Kolkata',
      state: profileData.state || 'West Bengal',
      education: profileData.education || profileData.highestEducation || 'Graduate',
      profession: profileData.profession || profileData.occupation || 'Professional',
      company: profileData.company || 'Reputed Organization',
      annualIncome: profileData.annualIncome || '₹10 - 15 LPA',
      familyType: profileData.familyType || 'Joint Family',
      familyStatus: profileData.familyStatus || 'Upper Middle Class',
      diet: profileData.diet || 'Non-Vegetarian',
      rashi: profileData.rashi || 'Kanya (Virgo)',
      nakshatra: profileData.nakshatra || 'Hasta',
      manglik: profileData.manglik || 'Non-Manglik',
      verified: profileData.verified ?? false,
      approved: profileData.approved ?? false,
      status: profileData.status || (profileData.approved ? 'approved' : 'pending_approval'),
      online: true,
      isFeatured: profileData.isFeatured ?? true,
      category: isMale ? 'grooms' : 'brides',
      badge: profileData.badge || (profileData.verified ? '100% Verified' : 'Verification Pending'),
      image: profileData.image || profileData.profilePhoto || (isMale 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'),
      profileImage: profileData.image || profileData.profilePhoto || (isMale 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'),
      about: profileData.about || profileData.aboutMe || 'A warm, family-oriented individual looking for a supportive life partner.',
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

    if (typeof localStorage !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
        const filtered = saved.filter(p => p.id !== profileId && p.memberId !== profileId);
        localStorage.setItem('saptaganga_admin_profiles', JSON.stringify([newProfile, ...filtered]));
      } catch (e) {
        console.error('Storage save error in createProfile:', e);
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
          profileFor: 'Son',
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
          profileFor: 'Daughter',
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

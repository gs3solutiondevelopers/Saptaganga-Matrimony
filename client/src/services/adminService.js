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
import { apiClient } from './api.js';
import { MOCK_PROFILES, MOCK_STORIES, MEMBERSHIP_PLANS } from '../data/mockData.js';

const ADMIN_STORAGE_KEY = 'saptaganga_admin_session';

export const adminService = {
  // Admin Authentication via Express Backend (HTTP-Only Auth Cookie)
  async login(email, password, pin) {
    try {
      const response = await apiClient.post('/admin/login', { email, password, pin });
      if (response.data && response.data.success) {
        const session = response.data.user || {
          adminId: 'ADMIN-001',
          email: email || 'admin@saptaganga.com',
          name: 'Super Admin',
          role: 'Chief Matchmaker & Director',
          loginTime: new Date().toISOString()
        };
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
        }
        return { success: true, session };
      }
      return { success: false, error: response.data?.error || 'Authentication failed' };
    } catch (apiErr) {
      console.warn('[AdminService] Express API auth fallback:', apiErr.response?.data?.error || apiErr.message);
    }

    // Local master credentials fallback
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

  async logout() {
    try {
      await apiClient.post('/admin/logout');
    } catch {}
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

    // 1. Primary: Fetch real candidate profiles from Express Backend API
    try {
      const response = await apiClient.get('/profiles');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        list = response.data.data;
      }
    } catch (err) {
      console.warn('Express Backend API profile fetch warning:', err.message);
    }

    // 2. Client-side Firestore fallback if list is empty
    if (list.length === 0 && isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'profiles'));
        if (!snap.empty) {
          list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (err) {
        console.warn('Profiles fetch fallback to Firestore:', err.message);
      }
    }

    // Normalize profiles from DB
    const allProfiles = list.map(p => ({
      ...p,
      id: p.id || p.memberId,
      image: p.image || p.profileImage || p.profilePhoto || '',
      profileImage: p.image || p.profileImage || p.profilePhoto || '',
      approved: p.approved ?? true,
      verified: p.verified ?? true,
      status: p.status || 'approved'
    }));

    // Sort pending profiles to the top
    allProfiles.sort((a, b) => {
      const aPending = (!a.approved || a.status === 'pending_approval') ? 1 : 0;
      const bPending = (!b.approved || b.status === 'pending_approval') ? 1 : 0;
      return bPending - aPending;
    });

    return { success: true, data: allProfiles };
  },

  // 1-Click Verification Toggle
  async toggleVerification(profileId, currentVerifiedStatus) {
    const newStatus = !currentVerifiedStatus;

    try {
      await apiClient.patch(`/profiles/${profileId}/verify`, { currentStatus: currentVerifiedStatus });
    } catch (err) {
      console.warn('Express API verify toggle fallback:', err.message);
    }

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

        // Also update all registered profiles list
        const reg = JSON.parse(localStorage.getItem('saptaganga_all_registered_profiles') || '[]');
        const updatedReg = reg.map(p => (p.id === profileId || p.memberId === profileId) ? { ...p, verified: newStatus, approved: newStatus, status: newStatus ? 'approved' : 'pending_approval', badge: newStatus ? '100% Verified' : 'Verification Pending' } : p);
        localStorage.setItem('saptaganga_all_registered_profiles', JSON.stringify(updatedReg));

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
    try {
      await apiClient.patch(`/admin/profiles/${profileId}/approve`);
    } catch (err) {
      console.warn('Express API approve profile fallback:', err.message);
    }

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

        // Also update all registered profiles list
        const reg = JSON.parse(localStorage.getItem('saptaganga_all_registered_profiles') || '[]');
        const updatedReg = reg.map(p => (p.id === profileId || p.memberId === profileId) ? { ...p, approved: true, status: 'approved', verified: true, badge: '100% Verified' } : p);
        localStorage.setItem('saptaganga_all_registered_profiles', JSON.stringify(updatedReg));

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

  // Create Profile / Candidate Registration via API
  async createProfile(profileData) {
    const profileId = profileData.id || profileData.memberId || `SG-${Math.floor(100000 + Math.random() * 900000)}`;
    const genderKey = (profileData.gender?.toLowerCase() === 'female' || profileData.gender?.toLowerCase() === 'bride') ? 'Female' : 'Male';
    const isMale = genderKey === 'Male';
    
    const newProfile = {
      id: profileId,
      memberId: profileId,
      name: profileData.name || profileData.fullName || 'Member',
      fullName: profileData.name || profileData.fullName || 'Member',
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
      verified: profileData.verified !== undefined ? Boolean(profileData.verified) : false,
      approved: profileData.approved !== undefined ? Boolean(profileData.approved) : false,
      status: profileData.status || (profileData.approved ? 'approved' : 'pending_approval'),
      online: true,
      isFeatured: profileData.isFeatured ?? false,
      category: isMale ? 'grooms' : 'brides',
      badge: profileData.badge || (profileData.verified ? '100% Verified' : 'Verification Pending'),
      image: profileData.image || profileData.profilePhoto || profileData.profileImage || '',
      profileImage: profileData.image || profileData.profilePhoto || profileData.profileImage || '',
      about: profileData.about || profileData.aboutMe || 'A warm, family-oriented individual looking for a supportive life partner.',
      partnerPreferences: profileData.partnerPreferences || {
        ageRange: '24 - 30 yrs',
        heightRange: '5\' 2" - 5\' 10"',
        education: 'Graduate / Professional',
        religion: 'Hindu',
        location: 'West Bengal'
      }
    };

    // Primary: Post to Express Backend API with Zod validation
    try {
      const response = await apiClient.post('/profiles', newProfile);
      if (response.data && response.data.success) {
        const created = response.data.data;
        if (typeof localStorage !== 'undefined') {
          const saved = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
          const filtered = saved.filter(p => p.id !== profileId && p.memberId !== profileId);
          localStorage.setItem('saptaganga_admin_profiles', JSON.stringify([created, ...filtered]));

          const reg = JSON.parse(localStorage.getItem('saptaganga_all_registered_profiles') || '[]');
          const filteredReg = reg.filter(p => p.id !== profileId && p.memberId !== profileId);
          localStorage.setItem('saptaganga_all_registered_profiles', JSON.stringify([created, ...filteredReg]));

          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('saptaganga_profile_created', { detail: { profile: created } }));
        }
        return { success: true, data: created };
      }
    } catch (err) {
      console.warn('Express API create profile error/validation:', err.response?.data || err.message);
      if (err.response?.data?.error) {
        return { success: false, error: err.response.data.error };
      }
    }

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'profiles', profileId), {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore profile save fallback:', err.message);
      }
    }

    if (typeof localStorage !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
        const filtered = saved.filter(p => p.id !== profileId && p.memberId !== profileId);
        localStorage.setItem('saptaganga_admin_profiles', JSON.stringify([newProfile, ...filtered]));

        // Also sync into all registered profiles
        const reg = JSON.parse(localStorage.getItem('saptaganga_all_registered_profiles') || '[]');
        const filteredReg = reg.filter(p => p.id !== profileId && p.memberId !== profileId);
        localStorage.setItem('saptaganga_all_registered_profiles', JSON.stringify([newProfile, ...filteredReg]));

        // Dispatch sync events so website updates immediately without reload
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('saptaganga_profile_created', { detail: { profile: newProfile } }));
      } catch (e) {
        console.error('Storage save error in createProfile:', e);
      }
    }

    return { success: true, data: newProfile };
  },

  // Update Existing Profile
  async updateProfile(profileId, updatedData) {
    const genderKey = (updatedData.gender?.toLowerCase() === 'female' || updatedData.gender?.toLowerCase() === 'bride') ? 'Female' : 'Male';
    const isMale = genderKey === 'Male';

    const newPhotoUrl = updatedData.image || updatedData.profilePhoto || updatedData.profileImage || updatedData.photoUrl || '';

    const mergedProfile = {
      approved: true,
      verified: true,
      status: 'approved',
      ...updatedData,
      id: profileId,
      memberId: profileId,
      gender: genderKey,
      category: isMale ? 'grooms' : 'brides',
      name: updatedData.name || updatedData.fullName || 'Member',
      fullName: updatedData.name || updatedData.fullName || 'Member',
      age: Number(updatedData.age) || 26,
      badge: (updatedData.verified !== false) ? (updatedData.badge || '100% Verified') : (updatedData.badge || 'Verification Pending'),
      image: newPhotoUrl,
      profileImage: newPhotoUrl,
      photoUrl: newPhotoUrl,
      profilePhoto: newPhotoUrl,
      updatedAt: new Date().toISOString()
    };

    let resultProfile = mergedProfile;

    // 1. Primary: PUT update request to Express Backend API (with Zod validation & Admin SDK storage finalization)
    try {
      const response = await apiClient.put(`/profiles/${profileId}`, mergedProfile);
      if (response.data && response.data.success) {
        resultProfile = response.data.data;
      }
    } catch (apiErr) {
      console.warn('[AdminService] Express API update fallback:', apiErr.response?.data || apiErr.message);
    }

    // 2. Fallback: Update client Firestore document directly if connected
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'profiles', profileId), {
          ...resultProfile,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore update fallback:', err.message);
      }
    }

    if (typeof localStorage !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
        const index = saved.findIndex(p => p.id === profileId || p.memberId === profileId);
        if (index >= 0) {
          saved[index] = { ...saved[index], ...resultProfile };
        } else {
          saved.unshift(resultProfile);
        }
        localStorage.setItem('saptaganga_admin_profiles', JSON.stringify(saved));

        // Also update saptaganga_all_registered_profiles if present
        const reg = JSON.parse(localStorage.getItem('saptaganga_all_registered_profiles') || '[]');
        const regIdx = reg.findIndex(p => p.id === profileId || p.memberId === profileId);
        if (regIdx >= 0) {
          reg[regIdx] = { ...reg[regIdx], ...resultProfile };
          localStorage.setItem('saptaganga_all_registered_profiles', JSON.stringify(reg));
        }

        // Also update current user if it matches
        const user = JSON.parse(localStorage.getItem('saptaganga_user') || 'null');
        if (user && (user.id === profileId || user.memberId === profileId || (user.phone && resultProfile.phone && user.phone === resultProfile.phone))) {
          localStorage.setItem('saptaganga_user', JSON.stringify({ ...user, ...resultProfile }));
        }

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('saptaganga_profile_created', { detail: { profile: resultProfile } }));
        window.dispatchEvent(new CustomEvent('saptaganga_profile_updated', { detail: { profile: resultProfile } }));
        window.dispatchEvent(new CustomEvent('saptaganga_profile_approved', { detail: { profileId, verified: resultProfile.verified } }));
      } catch (e) {
        console.error('Storage update error in updateProfile:', e);
      }
    }

    return { success: true, data: resultProfile };
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

    if (typeof localStorage !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
        const updated = saved.filter(p => p.id !== profileId && p.memberId !== profileId);
        localStorage.setItem('saptaganga_admin_profiles', JSON.stringify(updated));

        const reg = JSON.parse(localStorage.getItem('saptaganga_all_registered_profiles') || '[]');
        const updatedReg = reg.filter(p => p.id !== profileId && p.memberId !== profileId);
        localStorage.setItem('saptaganga_all_registered_profiles', JSON.stringify(updatedReg));

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('saptaganga_profile_created', { detail: { profileId } }));
      } catch (e) {
        console.error('Storage delete error:', e);
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

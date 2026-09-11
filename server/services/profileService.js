import { adminDb, adminStorage } from '../config/firebaseAdmin.js';

export const profileService = {
  // Fetch all profiles with optional filtering
  async getAllProfiles(filters = {}) {
    try {
      const snapshot = await adminDb.collection('profiles').get();
      let list = [];

      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
      }

      // Apply filtering logic
      if (filters.gender && filters.gender !== 'any') {
        const g = filters.gender.toLowerCase();
        list = list.filter(p => {
          const pg = (p.gender || '').toLowerCase();
          return pg === g || (g === 'female' && pg === 'bride') || (g === 'male' && pg === 'groom');
        });
      }

      if (filters.religion && filters.religion !== 'any') {
        list = list.filter(p => (p.religion || '').toLowerCase() === filters.religion.toLowerCase());
      }

      if (filters.category && filters.category !== 'all') {
        if (filters.category === 'brides') {
          list = list.filter(p => (p.gender || '').toLowerCase() === 'female' || (p.gender || '').toLowerCase() === 'bride');
        } else if (filters.category === 'grooms') {
          list = list.filter(p => (p.gender || '').toLowerCase() === 'male' || (p.gender || '').toLowerCase() === 'groom');
        }
      }

      if (filters.minAge && filters.maxAge) {
        list = list.filter(p => p.age >= Number(filters.minAge) && p.age <= Number(filters.maxAge));
      }

      return { success: true, data: list };
    } catch (error) {
      console.error('[ProfileService] Error fetching profiles:', error);
      throw error;
    }
  },

  // Get single profile by ID
  async getProfileById(id) {
    try {
      const docSnap = await adminDb.collection('profiles').doc(id).get();
      if (docSnap.exists) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      }
      return { success: false, message: 'Profile not found' };
    } catch (error) {
      console.error(`[ProfileService] Error fetching profile ${id}:`, error);
      throw error;
    }
  },

  // Create new profile
  async createProfile(profileData) {
    try {
      const profileId = profileData.id || profileData.memberId || `SG-${Math.floor(100000 + Math.random() * 900000)}`;
      const newProfile = {
        ...profileData,
        id: profileId,
        memberId: profileId,
        approved: profileData.approved ?? true,
        verified: profileData.verified ?? true,
        status: profileData.status || 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await adminDb.collection('profiles').doc(profileId).set(newProfile, { merge: true });
      return { success: true, data: newProfile };
    } catch (error) {
      console.error('[ProfileService] Error creating profile:', error);
      throw error;
    }
  },

  // Update existing profile
  async updateProfile(id, updateData) {
    try {
      const profileRef = adminDb.collection('profiles').doc(id);
      const mergedData = {
        ...updateData,
        id,
        memberId: id,
        updatedAt: new Date().toISOString()
      };
      await profileRef.set(mergedData, { merge: true });
      return { success: true, data: mergedData };
    } catch (error) {
      console.error(`[ProfileService] Error updating profile ${id}:`, error);
      throw error;
    }
  },

  // Delete profile
  async deleteProfile(id) {
    try {
      await adminDb.collection('profiles').doc(id).delete();
      return { success: true, message: `Profile ${id} deleted successfully.` };
    } catch (error) {
      console.error(`[ProfileService] Error deleting profile ${id}:`, error);
      throw error;
    }
  },

  // Toggle Verification
  async toggleVerification(id, currentStatus) {
    try {
      const newStatus = !currentStatus;
      const profileRef = adminDb.collection('profiles').doc(id);
      await profileRef.set({
        verified: newStatus,
        approved: newStatus,
        status: newStatus ? 'approved' : 'pending_approval',
        badge: newStatus ? '100% Verified' : 'Verification Pending',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return { success: true, verified: newStatus };
    } catch (error) {
      console.error(`[ProfileService] Error toggling verification for ${id}:`, error);
      throw error;
    }
  },

  // Upload image to Firebase Storage Bucket
  async uploadPhotoToStorage(fileBuffer, mimeType, filename) {
    try {
      const destination = `profile_photos/${Date.now()}_${filename}`;
      const file = adminStorage.file(destination);

      await file.save(fileBuffer, {
        metadata: { contentType: mimeType },
        public: true
      });

      const publicUrl = `https://storage.googleapis.com/${adminStorage.name}/${destination}`;
      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('[ProfileService] Firebase Storage upload error:', error);
      throw error;
    }
  }
};

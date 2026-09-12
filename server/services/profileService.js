import { adminDb, adminStorage } from '../config/firebaseAdmin.js';

export const profileService = {
  // Move photo from temp_uploads/ to permanent profile_photos/${memberId}.jpg
  async finalizeProfilePhoto(memberId, tempStoragePathOrUrl) {
    if (!tempStoragePathOrUrl) return null;

    try {
      let tempPath = tempStoragePathOrUrl;
      if (tempStoragePathOrUrl.includes('temp_uploads/')) {
        const parts = tempStoragePathOrUrl.split('temp_uploads/');
        const sub = parts[1].split('?')[0];
        tempPath = `temp_uploads/${decodeURIComponent(sub)}`;
      } else {
        return tempStoragePathOrUrl; // Already permanent or external URL
      }

      const tempFile = adminStorage.file(tempPath);
      const [exists] = await tempFile.exists();
      if (!exists) return tempStoragePathOrUrl;

      const permanentPath = `profile_photos/${memberId}.jpg`;
      const permanentFile = adminStorage.file(permanentPath);

      // Copy from temp_uploads/ to profile_photos/
      await tempFile.copy(permanentFile);
      try {
        await permanentFile.makePublic();
      } catch {}

      // Delete temp object from staging folder
      try {
        await tempFile.delete();
      } catch (e) {
        console.warn('[ProfileService] Temp file delete warning:', e.message);
      }

      const permanentUrl = `https://storage.googleapis.com/${adminStorage.name}/${permanentPath}`;
      return permanentUrl;
    } catch (error) {
      console.warn('[ProfileService] Error finalizing profile photo:', error.message);
      return tempStoragePathOrUrl;
    }
  },

  // Fetch all profiles with optional filtering (Real data only, no seed data)
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
      return { success: true, data: [] };
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

  // Create new profile (with photo finalization from temp_uploads to profile_photos)
  async createProfile(profileData) {
    try {
      const profileId = profileData.id || profileData.memberId || `SG-${Math.floor(100000 + Math.random() * 900000)}`;
      const rawImage = profileData.image || profileData.profilePhoto || profileData.profileImage;

      let finalPhotoUrl = rawImage;
      if (rawImage && rawImage.includes('temp_uploads/')) {
        finalPhotoUrl = await this.finalizeProfilePhoto(profileId, rawImage);
      }

      const genderKey = (profileData.gender?.toLowerCase() === 'female' || profileData.gender?.toLowerCase() === 'bride') ? 'Female' : 'Male';
      const isMale = genderKey === 'Male';

      const newProfile = {
        ...profileData,
        id: profileId,
        memberId: profileId,
        name: profileData.name || profileData.fullName || 'Member',
        fullName: profileData.name || profileData.fullName || 'Member',
        gender: genderKey,
        category: isMale ? 'grooms' : 'brides',
        image: finalPhotoUrl || rawImage || '',
        profileImage: finalPhotoUrl || rawImage || '',
        profilePhoto: finalPhotoUrl || rawImage || '',
        approved: profileData.approved ?? true,
        verified: profileData.verified ?? true,
        status: profileData.status || (profileData.approved ? 'approved' : 'pending_approval'),
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

  // Update existing profile (with photo finalization)
  async updateProfile(id, updateData) {
    try {
      const profileRef = adminDb.collection('profiles').doc(id);
      const rawImage = updateData.image || updateData.profilePhoto || updateData.profileImage || updateData.photoUrl;

      let finalPhotoUrl = rawImage;
      if (rawImage && rawImage.includes('temp_uploads/')) {
        finalPhotoUrl = await this.finalizeProfilePhoto(id, rawImage);
      }

      const mergedData = {
        ...updateData,
        id,
        memberId: id,
        ...(finalPhotoUrl ? { 
          image: finalPhotoUrl, 
          profileImage: finalPhotoUrl, 
          profilePhoto: finalPhotoUrl, 
          photoUrl: finalPhotoUrl 
        } : {
          image: '', 
          profileImage: '', 
          profilePhoto: '', 
          photoUrl: '' 
        }),
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

  // Direct upload image to Firebase Storage Bucket
  async uploadPhotoToStorage(fileBuffer, mimeType, filename) {
    try {
      const cleanName = filename ? filename.replace(/[^a-zA-Z0-9._-]/g, '_') : 'image.jpg';
      const destination = `temp_uploads/temp_${Date.now()}_${cleanName}`;
      const file = adminStorage.file(destination);

      await file.save(fileBuffer, {
        metadata: { contentType: mimeType }
      });
      try {
        await file.makePublic();
      } catch {}

      const publicUrl = `https://storage.googleapis.com/${adminStorage.name}/${destination}`;
      return { success: true, url: publicUrl, storagePath: destination };
    } catch (error) {
      console.error('[ProfileService] Firebase Storage upload error:', error);
      throw error;
    }
  }
};

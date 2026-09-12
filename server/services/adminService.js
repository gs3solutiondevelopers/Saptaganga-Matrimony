import { adminDb } from '../config/firebaseAdmin.js';
import { profileService } from './profileService.js';

export const adminService = {
  // Admin Login Authentication
  verifyAdmin(email, password, pin) {
    if (
      (email === 'admin@saptaganga.com' || email === 'admin') && 
      (password === 'SaptagangaAdmin2026' || password === 'admin123' || pin === '7777')
    ) {
      return {
        success: true,
        session: {
          adminId: 'ADMIN-001',
          email: 'admin@saptaganga.com',
          name: 'Super Admin',
          role: 'Chief Matchmaker & Director',
          loginTime: new Date().toISOString()
        }
      };
    }
    return { success: false, error: 'Invalid admin credentials or security PIN.' };
  },

  // Dashboard Statistics
  async getDashboardStats() {
    try {
      const profilesRes = await profileService.getAllProfiles();
      const profilesList = profilesRes.success ? profilesRes.data : [];

      const totalProfiles = profilesList.length;
      const verifiedCount = profilesList.filter(p => p.verified && p.status === 'approved').length;
      const pendingCount = profilesList.filter(p => !p.approved || p.status === 'pending_approval').length;
      const premiumCount = profilesList.filter(p => p.membershipTier && p.membershipTier !== 'Free Member').length;

      let totalInquiries = 0;
      try {
        const inqSnap = await adminDb.collection('inquiries').get();
        totalInquiries = inqSnap.size;
      } catch {}

      return {
        success: true,
        data: {
          totalProfiles,
          verifiedCount,
          pendingCount,
          premiumCount,
          totalInquiries,
          totalStories: 4
        }
      };
    } catch (error) {
      console.error('[AdminService] Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Approve Profile
  async approveProfile(id) {
    try {
      await adminDb.collection('profiles').doc(id).set({
        approved: true,
        status: 'approved',
        verified: true,
        badge: '100% Verified',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return { success: true, approved: true, verified: true };
    } catch (error) {
      console.error(`[AdminService] Error approving profile ${id}:`, error);
      throw error;
    }
  }
};

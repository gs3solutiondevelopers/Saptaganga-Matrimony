// API & Firebase Integration Service for Saptaganga Matrimony
import { firestoreService } from './firestoreService.js';
import { authService } from './authService.js';
import { MOCK_PROFILES, MOCK_STORIES, MEMBERSHIP_PLANS } from '../data/mockData.js';

export const api = {
  // Fetch profiles (Live Firestore with fallback)
  async getProfiles(filters = {}) {
    return await firestoreService.getProfiles(filters);
  },

  // Get specific profile by ID
  async getProfileById(id) {
    return await firestoreService.getProfileById(id);
  },

  // Send Interest / Connect request
  async sendInterest(profileId, note = "") {
    return await firestoreService.sendInterest(null, profileId, note);
  },

  // Send Phone OTP
  async sendPhoneOtp(phone) {
    return await authService.sendPhoneOtp(phone);
  },

  // Verify Phone OTP
  async verifyPhoneOtp(phone, otp, profileDetails = {}) {
    return await authService.verifyPhoneOtp(phone, otp, profileDetails);
  },

  // User Registration via Firebase Auth & Firestore
  async registerUser(userData) {
    const email = userData.email || `member${Date.now()}@saptaganga.com`;
    const password = userData.password || "Saptaganga@2026";
    return await authService.register(email, password, userData);
  },

  // User Login via Firebase Auth
  async loginUser(credentials) {
    const email = credentials.emailOrPhone || credentials.email;
    const password = credentials.password || "Saptaganga@2026";
    return await authService.login(email, password);
  },

  // Submit Contact Form Inquiry to Firestore
  async submitInquiry(inquiryData) {
    return await firestoreService.submitInquiry(inquiryData);
  },

  // Fetch Success Stories
  async getStories() {
    return { success: true, data: MOCK_STORIES };
  },

  // Fetch Membership Plans
  async getMembershipPlans() {
    return { success: true, data: MEMBERSHIP_PLANS };
  }
};

export { authService, firestoreService };

// API & Express Backend / Firebase Integration Service for Saptaganga Matrimony
import axios from 'axios';
import { firestoreService } from './firestoreService.js';
import { authService } from './authService.js';
import { MOCK_PROFILES, MOCK_STORIES, MEMBERSHIP_PLANS } from '../data/mockData.js';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:5000/api';

// Create Axios Client Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Fetch profiles (Express Backend via Axios with Firestore fallback)
  async getProfiles(filters = {}) {
    try {
      const response = await apiClient.get('/profiles', { params: filters });
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch {
      // Fallback to client-side Firestore service
    }
    return await firestoreService.getProfiles(filters);
  },

  // Get specific profile by ID via Axios
  async getProfileById(id) {
    try {
      const response = await apiClient.get(`/profiles/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch {}
    return await firestoreService.getProfileById(id);
  },

  // Create Profile via Axios
  async createProfile(profileData) {
    try {
      const response = await apiClient.post('/profiles', profileData);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch {}
    return await firestoreService.createProfile(profileData);
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

  // User Registration
  async registerUser(userData) {
    const email = userData.email || `member${Date.now()}@saptaganga.com`;
    const password = userData.password || "Saptaganga@2026";
    return await authService.register(email, password, userData);
  },

  // User Login
  async loginUser(credentials) {
    const email = credentials.emailOrPhone || credentials.email;
    const password = credentials.password || "Saptaganga@2026";
    return await authService.login(email, password);
  },

  // Submit Contact Form Inquiry via Axios
  async submitInquiry(inquiryData) {
    try {
      const response = await apiClient.post('/inquiries', inquiryData);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch {}
    return await firestoreService.submitInquiry(inquiryData);
  },

  // Admin Login via Axios
  async adminLogin(email, password, pin) {
    try {
      const response = await apiClient.post('/admin/login', { email, password, pin });
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch {}
    return { success: false, error: 'Invalid admin credentials.' };
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

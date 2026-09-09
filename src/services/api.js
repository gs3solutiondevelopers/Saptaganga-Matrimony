// API Service Client for Saptaganga Matrimony
// Ready to switch between mock local data and live Express/Node.js API endpoints

import { MOCK_PROFILES, MOCK_STORIES, MEMBERSHIP_PLANS } from '../data/mockData';

// Configurable API base URL (can be loaded from import.meta.env.VITE_API_URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || null;

export const api = {
  // Fetch profiles with filtering capability
  async getProfiles(filters = {}) {
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/api/profiles?` + new URLSearchParams(filters));
      return await response.json();
    }

    // Local Mock Implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...MOCK_PROFILES];

        if (filters.gender && filters.gender !== 'any') {
          results = results.filter(p => p.gender.toLowerCase() === filters.gender.toLowerCase());
        }
        if (filters.religion && filters.religion !== 'any') {
          results = results.filter(p => p.religion.toLowerCase() === filters.religion.toLowerCase());
        }
        if (filters.motherTongue && filters.motherTongue !== 'any') {
          results = results.filter(p => p.motherTongue.toLowerCase() === filters.motherTongue.toLowerCase());
        }
        if (filters.category && filters.category !== 'all') {
          if (filters.category === 'brides') {
            results = results.filter(p => p.gender === 'female');
          } else if (filters.category === 'grooms') {
            results = results.filter(p => p.gender === 'male');
          } else if (filters.category === 'doctors') {
            results = results.filter(p => p.profession.toLowerCase().includes('doctor') || p.profession.toLowerCase().includes('physician') || p.profession.toLowerCase().includes('dental'));
          } else if (filters.category === 'tech') {
            results = results.filter(p => p.profession.toLowerCase().includes('software') || p.profession.toLowerCase().includes('data'));
          }
        }
        if (filters.minAge && filters.maxAge) {
          results = results.filter(p => p.age >= filters.minAge && p.age <= filters.maxAge);
        }

        resolve({ success: true, data: results });
      }, 200);
    });
  },

  // Get specific profile by ID
  async getProfileById(id) {
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/api/profiles/${id}`);
      return await response.json();
    }
    const profile = MOCK_PROFILES.find(p => p.id === id);
    return { success: !!profile, data: profile };
  },

  // Send Interest / Connect request
  async sendInterest(profileId, note = "") {
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/api/interests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, note })
      });
      return await response.json();
    }
    return { success: true, message: `Interest successfully sent to ${profileId}` };
  },

  // User Registration
  async registerUser(userData) {
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await response.json();
    }
    return {
      success: true,
      message: "Account created successfully! Welcome to Saptaganga Matrimony.",
      user: {
        id: "SG-NEW-" + Math.floor(1000 + Math.random() * 9000),
        ...userData
      }
    };
  },

  // User Login
  async loginUser(credentials) {
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await response.json();
    }
    return {
      success: true,
      message: "Logged in successfully!",
      token: "mock-jwt-token-saptaganga",
      user: {
        id: "SG-USER-001",
        name: credentials.emailOrPhone.split('@')[0] || "Valued Member",
        email: credentials.emailOrPhone,
        plan: "Gold Advantage"
      }
    };
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

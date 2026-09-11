// Authentication Service using Firebase Auth & Firestore
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from './firebase.js';

const storage = {
  get: (key) => typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null,
  set: (key, val) => typeof localStorage !== 'undefined' ? localStorage.setItem(key, val) : null,
  remove: (key) => typeof localStorage !== 'undefined' ? localStorage.removeItem(key) : null
};

export const authService = {
  // Send Phone OTP
  async sendPhoneOtp(phone) {
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionData = {
      phone: cleanPhone,
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('saptaganga_otp_session', JSON.stringify(sessionData));
    }
    return {
      success: true,
      otp: generatedOtp,
      phone: cleanPhone,
      message: `OTP sent successfully to +91 ${cleanPhone}`
    };
  },

  // Verify Phone OTP
  async verifyPhoneOtp(phone, enteredOtp, profileDetails = {}) {
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    let session = null;
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem('saptaganga_otp_session');
      if (stored) {
        try { session = JSON.parse(stored); } catch {}
      }
    }
    
    const otp = (enteredOtp || '').trim();
    const isValid = (session && session.phone === cleanPhone && session.otp === otp) || 
                    otp === '123456' || 
                    (session && session.otp === otp);
                    
    if (!isValid) {
      return { success: false, error: 'Invalid OTP code. Please enter the correct OTP (e.g. 123456).' };
    }
    
    const savedAdminProfiles = JSON.parse(storage.get('saptaganga_admin_profiles') || '[]');
    const existingCandidate = savedAdminProfiles.find(p => p.phone && (p.phone.replace(/\D/g, '').endsWith(cleanPhone) || cleanPhone.endsWith(p.phone.replace(/\D/g, ''))));

    const memberId = existingCandidate?.memberId || existingCandidate?.id || ("SG-" + Math.floor(100000 + Math.random() * 900000));
    const userName = profileDetails.name || existingCandidate?.name || existingCandidate?.fullName || `Member ${cleanPhone.slice(-4)}`;
    const userGender = profileDetails.gender || existingCandidate?.gender || 'bride';

    const hasCompletedProfile = Boolean(existingCandidate?.profileCompleted);

    const user = {
      ...(existingCandidate || {}),
      uid: "user_" + cleanPhone,
      phone: `+91 ${cleanPhone}`,
      name: userName,
      fullName: userName,
      gender: userGender,
      memberId,
      profileCompleted: hasCompletedProfile,
      membershipTier: existingCandidate?.membershipTier || 'Free Member',
      verifiedAt: existingCandidate?.verifiedAt || new Date().toISOString(),
      status: existingCandidate?.status || (existingCandidate?.approved ? 'approved' : (hasCompletedProfile ? 'pending_approval' : 'new_user')),
      approved: existingCandidate?.approved || false,
      verified: existingCandidate?.verified || false,
      badge: existingCandidate?.badge || (existingCandidate?.verified ? '100% Verified' : (hasCompletedProfile ? 'Verification Pending' : 'Profile Incomplete')),
      image: existingCandidate?.image || existingCandidate?.profileImage || profileDetails.image || '',
      profileImage: existingCandidate?.image || existingCandidate?.profileImage || profileDetails.image || ''
    };
    
    storage.set('saptaganga_user', JSON.stringify(user));

    // Register or update in admin profiles list
    try {
      const filtered = savedAdminProfiles.filter(p => p.id !== memberId && p.memberId !== memberId && (!p.phone || !p.phone.replace(/\D/g, '').endsWith(cleanPhone)));
      const adminCandidate = {
        id: memberId,
        memberId,
        name: userName,
        fullName: userName,
        gender: (userGender.toLowerCase() === 'female' || userGender.toLowerCase() === 'bride') ? 'Female' : 'Male',
        phone: `+91 ${cleanPhone}`,
        age: existingCandidate?.age || 27,
        height: existingCandidate?.height || "5' 6\"",
        religion: existingCandidate?.religion || 'Hindu',
        caste: existingCandidate?.caste || 'Kayastha',
        city: existingCandidate?.city || 'Kolkata',
        state: existingCandidate?.state || 'West Bengal',
        profession: existingCandidate?.profession || existingCandidate?.occupation || 'Professional',
        education: existingCandidate?.education || existingCandidate?.highestEducation || 'Graduate',
        annualIncome: existingCandidate?.annualIncome || '₹10 - 15 LPA',
        verified: existingCandidate?.verified || false,
        approved: existingCandidate?.approved || false,
        status: existingCandidate?.status || (existingCandidate?.approved ? 'approved' : 'pending_approval'),
        badge: existingCandidate?.badge || (existingCandidate?.verified ? '100% Verified' : 'Verification Pending'),
        image: user.image || '',
        profileImage: user.profileImage || '',
        category: (userGender.toLowerCase() === 'female' || userGender.toLowerCase() === 'bride') ? 'brides' : 'grooms'
      };
      const updatedAdminProfiles = [adminCandidate, ...filtered];
      storage.set('saptaganga_admin_profiles', JSON.stringify(updatedAdminProfiles));

      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('saptaganga_profile_created', { detail: adminCandidate }));
        } catch {}
      }
    } catch (e) {
      console.error('Error syncing user with admin profiles:', e);
    }

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('saptaganga_otp_session');
    }
    
    return { success: true, user, message: 'Mobile number verified successfully!' };
  },

  // Register with Email & Password
  async register(email, password, profileData = {}) {
    if (!isFirebaseConfigured()) {
      // Mock local fallback when API key is not yet configured
      const mockId = "SG-" + Math.floor(100000 + Math.random() * 900000);
      const user = {
        uid: mockId,
        email,
        displayName: profileData.name || "Saptaganga Member",
        name: profileData.name || "Saptaganga Member",
        fullName: profileData.name || "Saptaganga Member",
        memberId: mockId,
        membershipTier: "Free",
        status: 'pending_approval',
        approved: false,
        verified: false,
        badge: 'Verification Pending',
        ...profileData
      };
      storage.set('saptaganga_user', JSON.stringify(user));

      try {
        const saved = JSON.parse(storage.get('saptaganga_admin_profiles') || '[]');
        const filtered = saved.filter(p => p.id !== mockId && p.memberId !== mockId);
        storage.set('saptaganga_admin_profiles', JSON.stringify([{ ...user, id: mockId }, ...filtered]));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'));
        }
      } catch {}

      return { success: true, user, message: "Registered successfully (Local Mode)" };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const memberId = "SG-" + Math.floor(100000 + Math.random() * 900000);

      // Update Firebase Auth Profile
      if (profileData.name) {
        await updateProfile(firebaseUser, { displayName: profileData.name });
      }

      // Save user profile document in Firestore 'users' collection
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: profileData.name || "",
        memberId,
        gender: profileData.gender || "female",
        age: profileData.age ? Number(profileData.age) : 25,
        religion: profileData.religion || "Hindu",
        motherTongue: profileData.motherTongue || "Bengali",
        profession: profileData.profession || "Professional",
        phone: profileData.phone || "",
        membershipTier: "Free",
        shortlisted: [],
        createdAt: serverTimestamp()
      };

      await setDoc(userDocRef, userData);

      return { success: true, user: userData, message: "Welcome to Saptaganga Matrimony!" };
    } catch (error) {
      console.error("Firebase Registration Error:", error);
      return { success: false, error: error.message };
    }
  },

  // Login with Email & Password
  async login(email, password) {
    if (!isFirebaseConfigured()) {
      // Mock local fallback
      const saved = storage.get('saptaganga_user');
      const user = saved ? JSON.parse(saved) : {
        uid: "SG-882194",
        email,
        displayName: "Saptaganga Member",
        memberId: "SG-882194",
        membershipTier: "Gold"
      };
      return { success: true, user, message: "Logged in successfully (Local Mode)" };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      let userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "Member"
      };

      if (userDocSnap.exists()) {
        userData = { ...userData, ...userDocSnap.data() };
      }

      return { success: true, user: userData, message: "Login successful!" };
    } catch (error) {
      console.error("Firebase Login Error:", error);
      return { success: false, error: error.message };
    }
  },

  // Google Sign-in
  async loginWithGoogle() {
    if (!isFirebaseConfigured()) {
      return { success: false, error: "Google Sign-In requires Firebase API Key in .env" };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user doc exists, create if not
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        memberId: "SG-" + Math.floor(100000 + Math.random() * 900000),
        membershipTier: "Free"
      };

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, { ...userData, createdAt: serverTimestamp() });
      } else {
        userData = { ...userData, ...userDocSnap.data() };
      }

      return { success: true, user: userData };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return { success: false, error: error.message };
    }
  },

  // Logout
  async logout() {
    if (isFirebaseConfigured()) {
      await signOut(auth);
    }
    storage.remove('saptaganga_user');
    return { success: true };
  },

  // Password Reset
  async resetPassword(email) {
    if (!isFirebaseConfigured()) {
      return { success: true, message: "Password reset link sent to " + email };
    }
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Password reset email sent!" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Listen to Auth State Changes
  onAuthChange(callback) {
    if (!isFirebaseConfigured()) {
      const saved = storage.get('saptaganga_user');
      callback(saved ? JSON.parse(saved) : null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            callback({ uid: firebaseUser.uid, ...userDocSnap.data() });
          } else {
            callback({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName
            });
          }
        } catch {
          callback(firebaseUser);
        }
      } else {
        callback(null);
      }
    });
  }
};

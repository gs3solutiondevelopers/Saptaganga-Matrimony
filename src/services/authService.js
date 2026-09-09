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
  // Register with Email & Password
  async register(email, password, profileData = {}) {
    if (!isFirebaseConfigured()) {
      // Mock local fallback when API key is not yet configured
      const mockId = "SG-" + Math.floor(100000 + Math.random() * 900000);
      const user = {
        uid: mockId,
        email,
        displayName: profileData.name || "Saptaganga Member",
        memberId: mockId,
        membershipTier: "Free",
        ...profileData
      };
      storage.set('saptaganga_user', JSON.stringify(user));
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

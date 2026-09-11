import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  Sparkles, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Camera, 
  Upload, 
  Trash2, 
  Image, 
  Lock,
  Globe,
  Link2,
  AtSign,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INDIAN_STATES, STATE_CITIES_MAP } from '../../data/locationData';
import { adminService } from '../../services/adminService';

// Custom Crisp SVG Icons for Instagram & Facebook
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const RELIGIONS = [
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Buddhist",
  "Jain",
  "Other"
];

const EDUCATION_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  "B.Tech",
  "M.Tech",
  "MBA",
  "BCA",
  "MCA",
  "B.Com",
  "M.Com",
  "BBA",
  "Higher Secondary",
  "School",
  "Diploma",
  "Doctorate / PhD",
  "Other"
];

const OCCUPATION_OPTIONS = [
  "Software Professional",
  "Doctor / Healthcare",
  "Engineer",
  "Teacher / Professor",
  "Business Owner / Entrepreneur",
  "Banking & Finance",
  "Accountant / CA",
  "Lawyer / Legal",
  "Designer / Architect",
  "Government Employee",
  "Consultant",
  "Student",
  "Self Employed",
  "Other"
];

const INCOME_RANGES = [
  "₹1 Lakh & below",
  "₹1–3 Lakh",
  "₹3–5 Lakh",
  "₹5–10 Lakh",
  "₹10–15 Lakh",
  "₹15–25 Lakh",
  "₹25–50 Lakh",
  "₹50 Lakh–₹1 Crore",
  "₹1 Crore+"
];

const HOBBIES_LIST = [
  "Music",
  "Traveling",
  "Reading",
  "Cooking",
  "Fitness & Gym",
  "Photography",
  "Art & Painting",
  "Movies & Cinema",
  "Gardening",
  "Yoga & Meditation",
  "Dancing",
  "Cricket & Sports"
];

const SAMPLE_AVATARS = {
  Male: [
    { label: "Classic Groom 1", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
    { label: "Corporate Groom 2", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { label: "Modern Groom 3", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" },
    { label: "Smart Groom 4", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
    { label: "Professional Groom 5", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400" }
  ],
  Female: [
    { label: "Traditional Bride 1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
    { label: "Modern Bride 2", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400" },
    { label: "Elegant Bride 3", url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400" },
    { label: "Cultured Bride 4", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
    { label: "Graceful Bride 5", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" }
  ]
};

export default function CreateProfileModal({ currentUser, onClose, onSave }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState(null);

  // Top-level 5-step form state (3 fields per step)
  const [formData, setFormData] = useState({
    // Step 1: Basic Details (3 fields)
    profileFor: 'Myself',
    gender: 'Male',
    fullName: currentUser?.name || '',

    // Step 2: Personal & Religious Details (3 fields)
    dob: '1998-05-15',
    maritalStatus: 'Never Married',
    religion: 'Hindu',

    // Step 3: Location & Contact Details (3 fields)
    state: 'West Bengal',
    city: 'Kolkata',
    phone: (currentUser?.phone || '').replace(/\D/g, '').slice(-10),

    // Step 4: Education & Career Details (3 fields)
    education: "Bachelor's Degree",
    occupation: 'Software Professional',
    annualIncome: '₹10–15 Lakh',

    // Step 5: Profile Picture, Hobbies, Social Links & Bio (4 options/fields)
    profilePhoto: '',
    hobbies: ['Music', 'Traveling'],
    instagram: '',
    facebook: '',
    socialLink: '',
    aboutMe: ''
  });

  // Dynamically calculate age from DOB
  const calculatedAge = useMemo(() => {
    if (!formData.dob) return null;
    const birthDate = new Date(formData.dob);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  }, [formData.dob]);

  // Cities dynamically computed from selected state
  const availableCities = useMemo(() => {
    return STATE_CITIES_MAP[formData.state] || STATE_CITIES_MAP["West Bengal"] || [];
  }, [formData.state]);

  // Handle Profile Created For change with conditional Gender logic
  const handleProfileForChange = (relation) => {
    let autoGender = formData.gender;
    if (relation === 'Son' || relation === 'Brother') {
      autoGender = 'Male';
    } else if (relation === 'Daughter' || relation === 'Sister') {
      autoGender = 'Female';
    }
    setFormData({
      ...formData,
      profileFor: relation,
      gender: autoGender
    });
    setError('');
  };

  // Helper for dynamic label prefix based on Profile Created For
  const getDynamicPrefix = (type = 'possessive') => {
    const relation = formData.profileFor;
    if (relation === 'Myself') {
      return type === 'about' ? 'myself' : 'Your';
    }
    if (relation === 'Relative') {
      return type === 'about' ? 'my relative' : "Relative's";
    }
    if (type === 'about') {
      return `my ${relation.toLowerCase()}`;
    }
    return `${relation}'s`;
  };

  // Handle State Change -> Reset City to first available city of that state
  const handleStateChange = (newState) => {
    const citiesForNewState = STATE_CITIES_MAP[newState] || [];
    setFormData({
      ...formData,
      state: newState,
      city: citiesForNewState[0] || 'Other'
    });
    setError('');
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Toggle Hobby
  const handleToggleHobby = (hobby) => {
    setFormData(prev => {
      const current = prev.hobbies || [];
      const updated = current.includes(hobby)
        ? current.filter(h => h !== hobby)
        : [...current, hobby];
      return { ...prev, hobbies: updated };
    });
  };

  // Step 1 Validation (3 fields)
  const validateStep1 = () => {
    if (!formData.profileFor) {
      setError('Please select who you are creating this profile for.');
      return false;
    }
    if (!formData.gender) {
      setError('Please select gender.');
      return false;
    }
    if (!formData.fullName.trim()) {
      setError(`Please enter ${getDynamicPrefix()} Full Name.`);
      return false;
    }
    setError('');
    return true;
  };

  // Step 2 Validation (3 fields)
  const validateStep2 = () => {
    if (!formData.dob) {
      setError(`Please provide ${getDynamicPrefix()} Date of Birth (DOB).`);
      return false;
    }
    if (calculatedAge !== null && calculatedAge < 18) {
      setError('Age must be at least 18 years old to register.');
      return false;
    }
    if (!formData.maritalStatus) {
      setError('Please select marital status.');
      return false;
    }
    if (!formData.religion) {
      setError('Please select religion.');
      return false;
    }
    setError('');
    return true;
  };

  // Step 3 Validation (3 fields)
  const validateStep3 = () => {
    if (!formData.state) {
      setError('Please select state.');
      return false;
    }
    if (!formData.city) {
      setError('Please select city.');
      return false;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return false;
    }
    setError('');
    return true;
  };

  // Step 4 Validation (3 fields)
  const validateStep4 = () => {
    if (!formData.education) {
      setError('Please select highest education.');
      return false;
    }
    if (!formData.occupation) {
      setError('Please select occupation / profession.');
      return false;
    }
    if (!formData.annualIncome) {
      setError('Please select annual income.');
      return false;
    }
    setError('');
    return true;
  };

  // Step 5 Validation & Final Submit (3 fields/options)
  const validateStep5AndSubmit = async () => {
    const memberId = currentUser?.memberId || "SG-" + Math.floor(100000 + Math.random() * 900000);
    const genderKey = formData.gender === 'Female' ? 'Female' : 'Male';
    const finalPhoto = formData.profilePhoto || 
      (SAMPLE_AVATARS[genderKey] && SAMPLE_AVATARS[genderKey][0]?.url) || '';

    const updatedUser = {
      ...currentUser,
      ...formData,
      age: calculatedAge || 26,
      image: finalPhoto,
      profileImage: finalPhoto,
      name: formData.fullName,
      fullName: formData.fullName,
      memberId,
      profileCompleted: true,
      status: 'pending_approval',
      approved: false,
      verified: false,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('saptaganga_user', JSON.stringify(updatedUser));
      
      // Add to admin profiles for review
      const existingAdminProfiles = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
      const filtered = existingAdminProfiles.filter(p => p.id !== memberId);
      const newAdminCandidate = {
        ...updatedUser,
        id: memberId,
        memberId: memberId,
        image: finalPhoto,
        profileImage: finalPhoto,
        height: formData.height || "5' 5\"",
        education: formData.education || formData.highestEducation || 'Graduate',
        profession: formData.occupation || 'Working',
        annualIncome: formData.annualIncome || '₹10 - 15 LPA',
        verified: false,
        status: 'pending_approval',
        approved: false,
        category: formData.gender === 'Female' ? 'brides' : 'grooms'
      };
      const updatedAdminProfiles = [newAdminCandidate, ...filtered];
      localStorage.setItem('saptaganga_admin_profiles', JSON.stringify(updatedAdminProfiles));

      // Cache all registered profiles permanently with their uploaded photos
      try {
        const existingRegistered = JSON.parse(localStorage.getItem('saptaganga_all_registered_profiles') || '[]');
        const filteredRegistered = existingRegistered.filter(p => p.id !== memberId && p.memberId !== memberId);
        localStorage.setItem('saptaganga_all_registered_profiles', JSON.stringify([newAdminCandidate, ...filteredRegistered]));
      } catch {}

      // Also register into adminService directly
      try {
        await adminService.createProfile(newAdminCandidate);
      } catch (err) {
        console.warn('Admin profile direct sync error:', err);
      }

      // Notify open windows/tabs and components to refresh candidate lists
      try {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('saptaganga_profile_created', { detail: newAdminCandidate }));
      } catch {}
    } catch (e) {
      console.error('Storage save error:', e);
    }

    setCreatedUser(updatedUser);
    setIsSubmitted(true);

    if (onSave) {
      onSave(updatedUser);
    }

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#780E2F', '#ECCB85', '#C29B38', '#E63946']
      });
    } catch {}
  };

  // Step Navigation Forward
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    } else if (currentStep === 4) {
      if (validateStep4()) setCurrentStep(5);
    } else if (currentStep === 5) {
      validateStep5AndSubmit();
    }
  };

  // Step Navigation Back (Zero data loss)
  const handleBack = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // -------------------------------------------------------------
  // SUCCESS SCREEN (After completing all 5 steps)
  // -------------------------------------------------------------
  if (isSubmitted && createdUser) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div 
          className="modal-content" 
          style={{ 
            maxWidth: '500px', 
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '0', 
            borderRadius: '24px',
            textAlign: 'center',
            background: '#FFFFFF'
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div style={{
            background: '#FFF0F3',
            borderBottom: '1px solid rgba(120, 14, 47, 0.12)',
            padding: '24px 20px 18px 20px',
            color: '#780E2F',
            position: 'relative'
          }}>
            {/* Success Icon */}
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#780E2F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px auto',
              boxShadow: '0 4px 14px rgba(120, 14, 47, 0.25)'
            }}>
              <CheckCircle2 size={30} color="#ECCB85" />
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0', color: '#780E2F' }}>
              Profile Created Successfully!
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#8B1E3F', margin: '0 0 4px 0', fontWeight: 600 }}>
              Member ID: <strong>{createdUser.memberId}</strong>
            </p>
            <div style={{
              display: 'inline-block',
              background: 'rgba(120, 14, 47, 0.08)',
              border: '1px solid rgba(120, 14, 47, 0.18)',
              padding: '3px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#780E2F',
              fontWeight: 600,
              marginTop: '4px'
            }}>
              ⏳ Pending Admin Verification & Approval
            </div>
          </div>

          <div style={{ padding: '18px 20px 22px' }}>
            {/* User Profile Summary Card */}
            <div style={{
              background: '#FDF7F8',
              border: '1px solid var(--romantic-rose-border)',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px',
              textAlign: 'left',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #ECCB85',
                flexShrink: 0
              }}>
                <img 
                  src={createdUser.image} 
                  alt={createdUser.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '2px' }}>
                  {createdUser.fullName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.4 }}>
                  Profile for: <strong>{createdUser.profileFor}</strong> ({createdUser.gender}, {createdUser.age} yrs)<br />
                  {createdUser.religion} • {createdUser.maritalStatus}<br />
                  {createdUser.occupation} in {createdUser.city}, {createdUser.state}
                </div>
              </div>
            </div>

            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              color: '#92400E',
              textAlign: 'left',
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              ℹ️ <strong>Admin Approval Notice:</strong> Our verification team will review your profile. Once approved by Admin, your profile will be published live across Saptaganga. You can still browse and view matching profiles in the meantime.
            </div>

            <button
              onClick={() => {
                onClose();
                navigate('/matches');
              }}
              className="btn-burgundy"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.96rem', fontWeight: 700, justifyContent: 'center', cursor: 'pointer' }}
            >
              Go to My Matching Profiles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5-STEP WIZARD MODAL (3 Options per Step)
  // -------------------------------------------------------------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '580px', 
          maxHeight: '90vh', 
          padding: '0', 
          overflow: 'hidden', 
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wizard Header */}
        <div style={{
          background: '#FFF0F3',
          borderBottom: '1px solid rgba(120, 14, 47, 0.12)',
          padding: '20px 24px',
          color: '#780E2F',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{
              background: 'rgba(120, 14, 47, 0.08)',
              color: '#780E2F',
              border: '1px solid rgba(120, 14, 47, 0.18)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Step {currentStep}/5
            </span>

            <button 
              className="modal-close-btn" 
              onClick={onClose} 
              aria-label="Close modal"
              style={{
                color: '#780E2F',
                background: 'rgba(120, 14, 47, 0.08)',
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={15} />
            </button>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            fontWeight: 800,
            margin: '0 0 2px 0',
            color: '#780E2F'
          }}>
            {currentStep === 1 && "Create Your Profile"}
            {currentStep === 2 && "Personal & Religious Details"}
            {currentStep === 3 && "Location & Contact Details"}
            {currentStep === 4 && "Education & Career Details"}
            {currentStep === 5 && "Profile Photo & Bio"}
          </h3>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.80rem',
            color: '#6B7280',
            margin: '0'
          }}>
            {currentStep === 1 && "Step 1 of 5: Basic Identity & Relationship"}
            {currentStep === 2 && "Step 2 of 5: Date of Birth, Marital Status & Religion"}
            {currentStep === 3 && "Step 3 of 5: State, City & Contact Number"}
            {currentStep === 4 && "Step 4 of 5: Highest Education, Occupation & Income"}
            {currentStep === 5 && "Step 5 of 5: Photo Upload & Personal Statement"}
          </p>

          {/* Step Progress Bar (5 Steps) */}
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(120, 14, 47, 0.1)',
            borderRadius: '4px',
            marginTop: '14px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(currentStep / 5) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #780E2F 0%, #C29B38 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ overflowY: 'auto', padding: '24px 26px', flex: 1 }}>
          
          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #FCA5A5'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ================= STEP 1: BASIC DETAILS (3 Fields) ================= */}
          {currentStep === 1 && (
            <div>
              {/* Field 1: Profile Created For */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '8px' }}>
                  1. PROFILE CREATED FOR *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['Myself', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative'].map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => handleProfileForChange(rel)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        border: formData.profileFor === rel ? '2px solid var(--primary-burgundy)' : '1.5px solid #E5E7EB',
                        background: formData.profileFor === rel ? '#FFF0F3' : '#FAFAFA',
                        color: formData.profileFor === rel ? 'var(--primary-burgundy)' : '#4B5563',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Gender (Conditional) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '8px' }}>
                  2. {getDynamicPrefix().toUpperCase()} GENDER *
                </label>
                
                {['Son', 'Brother', 'Daughter', 'Sister'].includes(formData.profileFor) ? (
                  <div style={{
                    padding: '12px 14px',
                    background: '#FDF7F8',
                    border: '1.5px solid var(--romantic-rose-border)',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    color: 'var(--primary-burgundy-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>Auto-selected: <strong>{formData.gender}</strong></span>
                    <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>(Based on {formData.profileFor})</span>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['Male', 'Female'].map((gen) => (
                      <button
                        key={gen}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: gen })}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          border: formData.gender === gen ? '2px solid var(--primary-burgundy)' : '1.5px solid #E5E7EB',
                          background: formData.gender === gen ? '#FFF0F3' : '#FAFAFA',
                          color: formData.gender === gen ? 'var(--primary-burgundy)' : '#4B5563',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 3: Full Name */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  3. {getDynamicPrefix().toUpperCase()} FULL NAME *
                </label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); setError(''); }}
                  placeholder={`Enter ${getDynamicPrefix()} full name`}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.94rem',
                    outline: 'none',
                    background: '#FFF'
                  }}
                />
              </div>
            </div>
          )}

          {/* ================= STEP 2: PERSONAL & RELIGIOUS (3 Fields with DOB) ================= */}
          {currentStep === 2 && (
            <div>
              {/* Field 1: Date of Birth (DOB) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  1. {getDynamicPrefix().toUpperCase()} DATE OF BIRTH (DOB) *
                </label>
                <input 
                  type="date"
                  max={`${new Date().getFullYear() - 18}-12-31`}
                  value={formData.dob}
                  onChange={(e) => { setFormData({ ...formData, dob: e.target.value }); setError(''); }}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FFF'
                  }}
                />
                <span style={{ fontSize: '0.76rem', color: '#6B7280', marginTop: '4px', display: 'block' }}>
                  Used to calculate horoscope matching & verified age.
                </span>
              </div>

              {/* Field 2: Marital Status */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '8px' }}>
                  2. {getDynamicPrefix().toUpperCase()} MARITAL STATUS *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {['Never Married', 'Widowed', 'Awaiting Divorce', 'Divorced'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, maritalStatus: m })}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        border: formData.maritalStatus === m ? '2px solid var(--primary-burgundy)' : '1.5px solid #E5E7EB',
                        background: formData.maritalStatus === m ? '#FFF0F3' : '#FAFAFA',
                        color: formData.maritalStatus === m ? 'var(--primary-burgundy)' : '#4B5563',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Religion */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  3. {getDynamicPrefix().toUpperCase()} RELIGION *
                </label>
                <select
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FFF'
                  }}
                >
                  {RELIGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ================= STEP 3: LOCATION & CONTACT (3 Fields) ================= */}
          {currentStep === 3 && (
            <div>
              {/* Field 1: State */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  1. {getDynamicPrefix().toUpperCase()} STATE / REGION *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FFF'
                  }}
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Field 2: City (Cascading from State) */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  2. {getDynamicPrefix().toUpperCase()} CITY *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FFF'
                  }}
                >
                  {availableCities.map((ct) => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
              </div>

              {/* Field 3: Mobile Number */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  3. VERIFIED MOBILE NUMBER *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#FDF7F8',
                  border: '1.5px solid var(--romantic-rose-border)',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '12px 14px',
                    background: '#F5E6EA',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: 'var(--primary-burgundy-dark)',
                    borderRight: '1px solid var(--romantic-rose-border)'
                  }}>
                    +91
                  </div>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => { setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') }); setError(''); }}
                    placeholder="Enter 10-digit number"
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      padding: '12px 14px',
                      fontSize: '0.96rem',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: EDUCATION & CAREER (3 Fields) ================= */}
          {currentStep === 4 && (
            <div>
              {/* Field 1: Highest Education */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  1. {getDynamicPrefix().toUpperCase()} HIGHEST EDUCATION *
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FFF'
                  }}
                >
                  {EDUCATION_OPTIONS.map((edu) => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>

              {/* Field 2: Occupation */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  2. {getDynamicPrefix().toUpperCase()} OCCUPATION / PROFESSION *
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FFF'
                  }}
                >
                  {OCCUPATION_OPTIONS.map((occ) => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              {/* Field 3: Annual Income */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  3. {getDynamicPrefix().toUpperCase()} ANNUAL INCOME *
                </label>
                <select
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#FFF'
                  }}
                >
                  {INCOME_RANGES.map((inc) => (
                    <option key={inc} value={inc}>{inc}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ================= STEP 5: PROFILE PICTURE & BIO (3 Options/Fields) ================= */}
          {currentStep === 5 && (
            <div>
              {/* Option 1: Profile Photo Upload & Preview */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '8px' }}>
                  1. {getDynamicPrefix().toUpperCase()} PROFILE PHOTO (OPTIONAL)
                </label>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: '#FDF7F8',
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1.5px dashed var(--romantic-rose-border)'
                }}>
                  {/* Photo Preview Circle */}
                  <div style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    border: '2px solid #ECCB85',
                    overflow: 'hidden',
                    background: '#F5E6EA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative'
                  }}>
                    {formData.profilePhoto ? (
                      <img 
                        src={formData.profilePhoto} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Camera size={32} color="#780E2F" />
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <label 
                        style={{
                          background: 'var(--primary-burgundy)',
                          color: '#FFF',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Upload size={14} />
                        <span>Upload Custom Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload}
                          style={{ display: 'none' }}
                        />
                      </label>

                      {formData.profilePhoto && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, profilePhoto: '' }))}
                          style={{
                            background: '#FEE2E2',
                            color: '#991B1B',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Clear Photo</span>
                        </button>
                      )}
                    </div>
                    
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>
                      Supports JPG, PNG up to 5MB. Clear face photo recommended.
                    </span>
                  </div>
                </div>

                {/* Avatar Picker Gallery */}
                <div style={{
                  marginTop: '12px',
                  background: '#FFF8FA',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #FCE7EB'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '8px' }}>
                    Or Select a Photo from {formData.gender === 'Female' ? 'Bride' : 'Groom'} Avatars:
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {(SAMPLE_AVATARS[formData.gender === 'Female' ? 'Female' : 'Male'] || SAMPLE_AVATARS.Male).map((avatar, idx) => {
                      const isSelected = formData.profilePhoto === avatar.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, profilePhoto: avatar.url }))}
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '50%',
                            padding: 0,
                            border: isSelected ? '3px solid var(--primary-burgundy)' : '2px solid #E5E7EB',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: isSelected ? '0 0 0 3px #FECDD3, 0 4px 10px rgba(120, 14, 47, 0.25)' : '0 2px 6px rgba(0,0,0,0.06)',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          title={avatar.label}
                        >
                          <img 
                            src={avatar.url} 
                            alt={avatar.label} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                          />
                          {isSelected && (
                            <div style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(120, 14, 47, 0.35)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFF',
                              fontSize: '1rem',
                              fontWeight: 900
                            }}>
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Option 2: Hobbies & Interests (Optional) */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', margin: 0 }}>
                    2. {getDynamicPrefix().toUpperCase()} HOBBIES & INTERESTS (OPTIONAL)
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                    {(formData.hobbies || []).length} Selected
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {HOBBIES_LIST.map((hobby) => {
                    const isSelected = (formData.hobbies || []).includes(hobby);
                    return (
                      <button
                        key={hobby}
                        type="button"
                        onClick={() => handleToggleHobby(hobby)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '9999px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          border: isSelected ? '1.5px solid var(--primary-burgundy)' : '1px solid #E5E7EB',
                          background: isSelected ? '#FFF0F3' : '#FAFAFA',
                          color: isSelected ? 'var(--primary-burgundy)' : '#4B5563',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isSelected && <span>✓</span>}
                        <span>{hobby}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option 3: Social Media Profile Links (Optional) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '8px' }}>
                  3. {getDynamicPrefix().toUpperCase()} SOCIAL MEDIA PROFILE LINKS (OPTIONAL)
                </label>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  background: '#FDF7F8',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--romantic-rose-border)'
                }}>
                  {/* Instagram Profile */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#FFF',
                    borderRadius: '8px',
                    border: '1.5px solid #E5E7EB',
                    padding: '0 12px'
                  }}>
                    <InstagramIcon size={18} />
                    <input
                      type="text"
                      placeholder="Instagram username or profile link (e.g. @username or instagram.com/...)"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      style={{
                        flex: 1,
                        border: 'none',
                        padding: '10px 0',
                        fontSize: '0.88rem',
                        outline: 'none',
                        background: 'transparent'
                      }}
                    />
                  </div>

                  {/* Facebook Profile */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#FFF',
                    borderRadius: '8px',
                    border: '1.5px solid #E5E7EB',
                    padding: '0 12px'
                  }}>
                    <FacebookIcon size={18} />
                    <input
                      type="text"
                      placeholder="Facebook profile URL (e.g. facebook.com/username)"
                      value={formData.facebook || ''}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      style={{
                        flex: 1,
                        border: 'none',
                        padding: '10px 0',
                        fontSize: '0.88rem',
                        outline: 'none',
                        background: 'transparent'
                      }}
                    />
                  </div>

                  <span style={{ fontSize: '0.73rem', color: '#6B7280' }}>
                    Adding social profiles helps establish authenticity and faster matchmaking trust.
                  </span>
                </div>
              </div>

              {/* Option 4: About Profile (Optional) */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  4. A FEW WORDS ABOUT {getDynamicPrefix('about').toUpperCase()} (OPTIONAL)
                </label>

                <textarea
                  rows={4}
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  placeholder={`Write a few lines about ${getDynamicPrefix('about')}, personality, lifestyle, or partner expectations (optional)...`}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--romantic-rose-border)',
                    fontSize: '0.90rem',
                    outline: 'none',
                    background: '#FFF',
                    resize: 'none',
                    lineHeight: 1.45
                  }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Wizard Navigation Footer */}
        <div style={{
          padding: '16px 24px',
          background: '#FFF',
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              style={{
                padding: '11px 20px',
                borderRadius: '10px',
                border: '1.5px solid #E5E7EB',
                background: '#FFF',
                color: '#374151',
                fontSize: '0.90rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="btn-burgundy"
            style={{
              padding: '12px 30px',
              borderRadius: '10px',
              fontSize: '0.94rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <span>{currentStep === 5 ? "Complete & Create Profile" : "Next Step"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

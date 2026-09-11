import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MatchesPage from './pages/MatchesPage';
import MembershipPage from './pages/MembershipPage';
import StoriesPage from './pages/StoriesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';

// Admin Panel Pages & Components
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProfilesPage from './pages/admin/AdminProfilesPage';
import AdminStoriesPage from './pages/admin/AdminStoriesPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';

// Modals
import ProfileDetailModal from './components/modals/ProfileDetailModal';
import AuthModal from './components/modals/AuthModal';
import SendInterestModal from './components/modals/SendInterestModal';
import CreateProfileModal from './components/modals/CreateProfileModal';
import MembershipPlanModal from './components/modals/MembershipPlanModal';

import { api } from './services/api';
import './styles/index.css';
import './styles/components.css';
import './styles/admin.css';

function AppContent() {
  const navigate = useNavigate();

  // Profiles State
  const [profiles, setProfiles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Shortlisted Favorites State
  const [shortlistedIds, setShortlistedIds] = useState(new Set(['SG-101']));

  // Active Modals State
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [interestProfile, setInterestProfile] = useState(null);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [createProfileOpen, setCreateProfileOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [pendingInterestProfile, setPendingInterestProfile] = useState(null);

  // User Notifications state
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('saptaganga_user_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current Logged-in User initialized from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('saptaganga_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const adminProfiles = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
      const match = adminProfiles.find(p => p.id === parsed.memberId || p.memberId === parsed.memberId || p.id === parsed.id || (p.phone && parsed.phone && p.phone === parsed.phone));
      if (match && (match.approved || match.verified || match.status === 'approved')) {
        parsed.approved = true;
        parsed.verified = true;
        parsed.status = 'approved';
        parsed.badge = '100% Verified';
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auto-open OTP login gate if visitor is not verified/logged in
  useEffect(() => {
    if (!currentUser) {
      setAuthModal({ open: true, mode: 'login' });
    }
  }, [currentUser]);

  // Load profiles
  const loadProfiles = async (filters = {}) => {
    setLoadingProfiles(true);
    try {
      const res = await api.getProfiles({ ...filters, category: activeCategory });
      if (res.success) {
        setProfiles(res.data);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    loadProfiles();

    const handleLiveSync = () => {
      loadProfiles();
      try {
        const u = localStorage.getItem('saptaganga_user');
        if (u) {
          const parsed = JSON.parse(u);
          const adminProfiles = JSON.parse(localStorage.getItem('saptaganga_admin_profiles') || '[]');
          const match = adminProfiles.find(p => p.id === parsed.memberId || p.memberId === parsed.memberId || p.id === parsed.id || (p.phone && parsed.phone && p.phone === parsed.phone));
          if (match && (match.approved || match.verified || match.status === 'approved')) {
            parsed.approved = true;
            parsed.verified = true;
            parsed.status = 'approved';
            parsed.badge = '100% Verified';
          }
          setCurrentUser(parsed);
        }
        const notifs = localStorage.getItem('saptaganga_user_notifications');
        if (notifs) setNotifications(JSON.parse(notifs));
      } catch {}
    };

    window.addEventListener('storage', handleLiveSync);
    window.addEventListener('focus', handleLiveSync);
    window.addEventListener('saptaganga_profile_created', handleLiveSync);
    window.addEventListener('saptaganga_profile_approved', handleLiveSync);

    const interval = setInterval(handleLiveSync, 3000);

    return () => {
      window.removeEventListener('storage', handleLiveSync);
      window.removeEventListener('focus', handleLiveSync);
      window.removeEventListener('saptaganga_profile_created', handleLiveSync);
      window.removeEventListener('saptaganga_profile_approved', handleLiveSync);
      clearInterval(interval);
    };
  }, [activeCategory]);

  // Handle Quick Search from Home -> navigate to search (Gated on Profile Completion)
  const handleQuickSearch = async (searchParams) => {
    if (!currentUser?.profileCompleted) {
      setCreateProfileOpen(true);
      showToast('⚠️ Please create your profile first to search and view matches.');
      return;
    }
    navigate('/search', { state: { searchFilters: searchParams } });
    showToast('Applied quick search filters!');
  };

  // Toggle Shortlist
  const handleToggleShortlist = (profile) => {
    if (!currentUser) {
      setAuthModal({ open: true, mode: 'login' });
      showToast('Please login with your mobile number to shortlist profiles.');
      return;
    }
    setShortlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(profile.id)) {
        next.delete(profile.id);
        showToast(`Removed ${profile.name} from shortlist.`);
      } else {
        next.add(profile.id);
        showToast(`❤️ Added ${profile.name} to your shortlist!`);
      }
      return next;
    });
  };

  // Open Auth Modal
  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ open: true, mode });
  };

  // Open Create Profile Modal
  const handleOpenCreateProfile = () => {
    setCreateProfileOpen(true);
  };

  // Handle successful Auth -> Auto trigger Create Profile popup after 2.5 seconds
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setAuthModal({ open: false, mode: 'login' });
    showToast(`🎉 Welcome ${user.name || user.fullName}! Mobile number verified.`);

    if (!user.profileCompleted) {
      setTimeout(() => {
        setCreateProfileOpen(true);
      }, 2500);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('saptaganga_user');
    } catch {}
    setCurrentUser(null);
    setCreateProfileOpen(false);
    setAuthModal({ open: true, mode: 'login' });
    showToast('You have been logged out.');
  };

  // Handle unlock contact
  const handleUnlockContact = (profile) => {
    if (!currentUser) {
      setSelectedProfile(null);
      setAuthModal({ open: true, mode: 'login' });
      showToast('Please login with mobile OTP to view contact details.');
      return;
    }
    showToast('Contact request sent! Our team will connect you shortly.');
  };

  // Handle Initiate Send Interest (Subscription Gating & Instant Notification Delivery)
  const handleInitiateSendInterest = (targetProfile) => {
    if (!currentUser) {
      setAuthModal({ open: true, mode: 'login' });
      showToast('Please login with your mobile number to send interest.');
      return;
    }

    const isSubscribed = currentUser.hasSubscription || currentUser.isSubscribed || currentUser.subscriptionPlan;

    if (!isSubscribed) {
      setPendingInterestProfile(targetProfile);
      setMembershipModalOpen(true);
      return;
    }

    // Deliver interest & send notification
    try {
      api.sendInterest(targetProfile.id);
    } catch {}
    showToast(`💌 Interest sent to ${targetProfile.name}! A notification has been delivered to their profile.`);
  };

  // Handle Subscribe Plan & Auto-deliver pending interest if any
  const handleSelectSubscriptionPlan = (plan) => {
    const updatedUser = {
      ...(currentUser || {}),
      hasSubscription: true,
      isSubscribed: true,
      subscriptionPlan: plan.name,
      membershipId: `MEM-${Date.now()}`
    };
    try {
      localStorage.setItem('saptaganga_user', JSON.stringify(updatedUser));
    } catch {}
    setCurrentUser(updatedUser);
    setMembershipModalOpen(false);

    if (pendingInterestProfile) {
      try {
        api.sendInterest(pendingInterestProfile.id);
      } catch {}
      showToast(`🎉 Subscribed to ${plan.name}! Interest and notification successfully delivered to ${pendingInterestProfile.name}!`);
      setPendingInterestProfile(null);
    } else {
      showToast(`🎉 Congratulations! You have successfully upgraded to ${plan.name}.`);
    }
  };

  // Handle View Profile From Notification (Subscription Gated)
  const handleViewNotificationProfile = (candidateProfile) => {
    const isSubscribed = currentUser?.hasSubscription || currentUser?.isSubscribed || currentUser?.subscriptionPlan;
    if (!isSubscribed) {
      setPendingInterestProfile(candidateProfile);
      setMembershipModalOpen(true);
      showToast('🔒 Subscription required to view full profile details of interested members.');
      return;
    }
    setSelectedProfile(candidateProfile);
  };

  // Handle Profile Selection (Strictly Profile Creation Gated)
  const handleSelectProfile = (targetProfile) => {
    const isProfileCompleted = Boolean(currentUser?.profileCompleted);

    if (!isProfileCompleted) {
      setCreateProfileOpen(true);
      showToast('📝 Please create your matrimony profile first to view candidate details.');
      return;
    }

    setSelectedProfile(targetProfile);
  };

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Handle Admin Login Portal
  if (location.pathname === '/admin/login') {
    return <AdminLoginPage />;
  }

  // Handle Admin Control Dashboard & Management Routes
  if (isAdminRoute) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <Routes>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/profiles" element={<AdminProfilesPage />} />
            <Route path="/admin/stories" element={<AdminStoriesPage />} />
            <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
          </Routes>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <MainLayout
      onOpenAuth={handleOpenAuth}
      onOpenCreateProfile={handleOpenCreateProfile}
      toastMessage={toastMessage}
      currentUser={currentUser}
      onLogout={handleLogout}
      onViewNotificationProfile={handleViewNotificationProfile}
      notifications={notifications}
    >
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              profiles={profiles}
              activeCategory={activeCategory}
              onCategoryChange={(cat) => setActiveCategory(cat)}
              onSelectProfile={handleSelectProfile}
              onSendInterest={handleInitiateSendInterest}
              onToggleShortlist={handleToggleShortlist}
              shortlistedIds={shortlistedIds}
              onQuickSearch={handleQuickSearch}
              onOpenAuth={handleOpenAuth}
              onOpenCreateProfile={handleOpenCreateProfile}
              currentUser={currentUser}
              onSelectPlan={(plan) => {
                handleSelectSubscriptionPlan(plan);
              }}
            />
          } 
        />
        <Route 
          path="/search" 
          element={
            <SearchPage 
              onSelectProfile={handleSelectProfile}
              onSendInterest={handleInitiateSendInterest}
              onToggleShortlist={handleToggleShortlist}
              shortlistedIds={shortlistedIds}
              currentUser={currentUser}
              onOpenCreateProfile={handleOpenCreateProfile}
            />
          } 
        />
        <Route 
          path="/matches" 
          element={
            <MatchesPage 
              onSelectProfile={handleSelectProfile}
              onSendInterest={handleInitiateSendInterest}
              onToggleShortlist={handleToggleShortlist}
              shortlistedIds={shortlistedIds}
              currentUser={currentUser}
              onOpenCreateProfile={handleOpenCreateProfile}
            />
          } 
        />
        <Route 
          path="/membership" 
          element={
            <MembershipPage 
              onSelectPlan={handleSelectSubscriptionPlan}
              onOpenAuth={handleOpenAuth}
            />
          } 
        />
        <Route 
          path="/stories" 
          element={<StoriesPage onOpenAuth={handleOpenAuth} />} 
        />
        <Route 
          path="/how-it-works" 
          element={<HowItWorksPage onOpenAuth={handleOpenAuth} />} 
        />
        <Route 
          path="/contact" 
          element={<ContactPage />} 
        />
      </Routes>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <ProfileDetailModal 
          profile={selectedProfile}
          allProfiles={profiles}
          currentUser={currentUser}
          onSelectProfile={handleSelectProfile}
          isShortlisted={shortlistedIds.has(selectedProfile.id)}
          onClose={() => setSelectedProfile(null)}
          onToggleShortlist={handleToggleShortlist}
          onSendInterest={handleInitiateSendInterest}
          onUnlockContact={handleUnlockContact}
        />
      )}

      {/* Membership Plan Modal (Subscription Gate on Send Interest) */}
      <MembershipPlanModal 
        isOpen={membershipModalOpen}
        onClose={() => {
          setMembershipModalOpen(false);
          setPendingInterestProfile(null);
        }}
        onSelectPlan={handleSelectSubscriptionPlan}
        targetProfile={pendingInterestProfile}
      />

      {/* Send Interest Modal */}
      {interestProfile && (
        <SendInterestModal 
          profile={interestProfile}
          onClose={() => setInterestProfile(null)}
          onSentSuccess={(p) => {
            showToast(`Interest successfully sent to ${p.name}!`);
          }}
        />
      )}

      {/* Auth Modal (Pure Mobile Number + OTP Verification) */}
      {authModal.open && (
        <AuthModal 
          isGated={!currentUser}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Create / Complete Profile Modal */}
      {createProfileOpen && (
        <CreateProfileModal 
          currentUser={currentUser}
          onClose={() => setCreateProfileOpen(false)}
          onSave={(updatedUser) => {
            setCurrentUser(updatedUser);
            showToast('🎉 Your matrimony profile has been created successfully!');
          }}
        />
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

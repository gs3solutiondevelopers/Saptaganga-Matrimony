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
  const [authModal, setAuthModal] = useState({ open: false, mode: 'register' });

  // Current Logged-in User & Toast
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

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
  }, [activeCategory]);

  // Handle Quick Search from Home -> navigate to search
  const handleQuickSearch = async (searchParams) => {
    navigate('/search');
    showToast('Applied quick search filters!');
  };

  // Toggle Shortlist
  const handleToggleShortlist = (profile) => {
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
  const handleOpenAuth = (mode = 'register') => {
    setAuthModal({ open: true, mode });
  };

  // Handle successful Auth
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome ${user.name || user.fullName}! You are now signed in.`);
  };

  // Handle unlock contact
  const handleUnlockContact = (profile) => {
    setSelectedProfile(null);
    setAuthModal({ open: true, mode: 'login' });
    showToast('Please sign in with a Gold/Diamond membership to view direct contact numbers.');
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
      toastMessage={toastMessage}
    >
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              profiles={profiles}
              activeCategory={activeCategory}
              onCategoryChange={(cat) => setActiveCategory(cat)}
              onSelectProfile={(p) => setSelectedProfile(p)}
              onSendInterest={(p) => setInterestProfile(p)}
              onToggleShortlist={handleToggleShortlist}
              shortlistedIds={shortlistedIds}
              onQuickSearch={handleQuickSearch}
              onOpenAuth={handleOpenAuth}
              onSelectPlan={(plan) => {
                handleOpenAuth('register');
                showToast(`Selected ${plan.name}. Complete registration to upgrade.`);
              }}
            />
          } 
        />
        <Route 
          path="/search" 
          element={
            <SearchPage 
              onSelectProfile={(p) => setSelectedProfile(p)}
              onSendInterest={(p) => setInterestProfile(p)}
              onToggleShortlist={handleToggleShortlist}
              shortlistedIds={shortlistedIds}
            />
          } 
        />
        <Route 
          path="/matches" 
          element={
            <MatchesPage 
              onSelectProfile={(p) => setSelectedProfile(p)}
              onSendInterest={(p) => setInterestProfile(p)}
              onToggleShortlist={handleToggleShortlist}
              shortlistedIds={shortlistedIds}
            />
          } 
        />
        <Route 
          path="/membership" 
          element={
            <MembershipPage 
              onSelectPlan={(plan) => {
                handleOpenAuth('register');
                showToast(`Selected ${plan.name}. Complete registration to upgrade.`);
              }}
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
          isShortlisted={shortlistedIds.has(selectedProfile.id)}
          onClose={() => setSelectedProfile(null)}
          onToggleShortlist={handleToggleShortlist}
          onSendInterest={(p) => {
            setSelectedProfile(null);
            setInterestProfile(p);
          }}
          onUnlockContact={handleUnlockContact}
        />
      )}

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

      {/* Auth Modal (Login / Multi-Step Register) */}
      {authModal.open && (
        <AuthModal 
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'register' })}
          onSuccess={handleAuthSuccess}
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

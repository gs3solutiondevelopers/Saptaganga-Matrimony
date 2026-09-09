import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import HeroBanner from './components/home/HeroBanner';
import QuickSearchCard from './components/home/QuickSearchCard';
import HowItWorks from './components/home/HowItWorks';
import FeaturedProfiles from './components/home/FeaturedProfiles';
import WhyChooseUs from './components/home/WhyChooseUs';
import MembershipPlans from './components/home/MembershipPlans';
import Footer from './components/common/Footer';

// Modals
import ProfileDetailModal from './components/modals/ProfileDetailModal';
import AuthModal from './components/modals/AuthModal';
import SendInterestModal from './components/modals/SendInterestModal';
import FavoritesModal from './components/modals/FavoritesModal';

import { api } from './services/api';
import './styles/index.css';
import './styles/components.css';

export default function App() {
  // Profiles & Filter State
  const [profiles, setProfiles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Shortlisted Favorites State
  const [shortlistedIds, setShortlistedIds] = useState(new Set(['SG-101']));
  const [shortlistedProfiles, setShortlistedProfiles] = useState([]);

  // Active Modals State
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [interestProfile, setInterestProfile] = useState(null);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'register' });
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary toast notification
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

  // Update shortlisted profiles array whenever shortlistedIds or profiles change
  useEffect(() => {
    const list = profiles.filter(p => shortlistedIds.has(p.id));
    setShortlistedProfiles(list);
  }, [shortlistedIds, profiles]);

  // Handle Quick Search
  const handleQuickSearch = async (searchParams) => {
    setLoadingProfiles(true);
    const res = await api.getProfiles(searchParams);
    if (res.success) {
      setProfiles(res.data);
      // Smooth scroll to profiles
      const el = document.getElementById('featured');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`Found ${res.data.length} compatible matches!`);
    }
    setLoadingProfiles(false);
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

  return (
    <div className="app-container">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--primary-burgundy-dark)',
          color: '#FFF',
          padding: '14px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          borderLeft: '4px solid var(--accent-gold)',
          zIndex: 3000,
          fontSize: '0.92rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar 
        onOpenAuth={handleOpenAuth}
        onOpenFavorites={() => setFavoritesModalOpen(true)}
        favoritesCount={shortlistedIds.size}
      />

      {/* Hero Banner with Traditional Royal Couple & Stats */}
      <HeroBanner 
        onStartJourney={() => handleOpenAuth('register')}
      />

      {/* Interactive Quick Match Finder Form */}
      <QuickSearchCard 
        onSearch={handleQuickSearch}
        onRegisterClick={() => handleOpenAuth('register')}
      />

      {/* How It Works - 3 Simple Steps */}
      <HowItWorks 
        onGetStarted={() => handleOpenAuth('register')}
      />

      {/* Featured & Verified Profiles Showcase */}
      <FeaturedProfiles 
        profiles={profiles}
        activeCategory={activeCategory}
        onCategoryChange={(cat) => setActiveCategory(cat)}
        onSelectProfile={(profile) => setSelectedProfile(profile)}
        onSendInterest={(profile) => setInterestProfile(profile)}
        onToggleShortlist={handleToggleShortlist}
        shortlistedIds={shortlistedIds}
      />

      {/* Why Choose Saptaganga & Couple Success Stories */}
      <WhyChooseUs 
        onRegisterClick={() => handleOpenAuth('register')}
      />

      {/* Membership Packages & Pricing */}
      <MembershipPlans 
        onSelectPlan={(plan) => {
          if (plan.id === 'free') {
            handleOpenAuth('register');
          } else {
            handleOpenAuth('register');
            showToast(`Selected ${plan.name}. Complete registration to upgrade.`);
          }
        }}
      />

      {/* Footer */}
      <Footer />

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

      {/* Shortlisted Favorites Modal */}
      {favoritesModalOpen && (
        <FavoritesModal 
          favorites={shortlistedProfiles}
          onClose={() => setFavoritesModalOpen(false)}
          onSelectProfile={(p) => setSelectedProfile(p)}
          onSendInterest={(p) => setInterestProfile(p)}
          onRemoveFavorite={(p) => handleToggleShortlist(p)}
        />
      )}

    </div>
  );
}

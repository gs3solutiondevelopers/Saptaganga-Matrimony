import React, { useState } from 'react';
import { 
  Lock, 
  UserPlus, 
  Menu, 
  X, 
  Heart 
} from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenFavorites, favoritesCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      {/* Main Navigation Bar (Clean, Sleek & No Wrap) */}
      <nav className="navbar">
        <div className="container navbar-container">
          {/* Logo & Brand Identity */}
          <a href="#" className="brand-logo">
            <div className="brand-icon">
              {/* Sacred Lotus / Couple Emblem */}
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c1.5 3 4 5.5 7 6-2 3-5 5-7 12-2-7-5-9-7-12 3-.5 5.5-3 7-6z" fill="rgba(201, 150, 53, 0.4)" />
                <path d="M12 21c3-4 7-6 9-8-1-2-3-3-5-3-2 3-3 7-4 11z" />
                <path d="M12 21c-3-4-7-6-9-8 1-2 3-3 5-3 2 3 3 7 4 11z" />
              </svg>
            </div>
            <div className="brand-text-container">
              <span className="brand-name">SAPTAGANGA</span>
              <span className="brand-tagline">MATRIMONY • SEVEN RIVERS</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li><a href="#home" className="nav-link active">Home</a></li>
            <li><a href="#search" className="nav-link">Search</a></li>
            <li><a href="#featured" className="nav-link">Matches</a></li>
            <li><a href="#membership" className="nav-link">Membership</a></li>
            <li><a href="#stories" className="nav-link">Success Stories</a></li>
            <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
          </ul>

          {/* User Action CTAs */}
          <div className="nav-actions">
            {favoritesCount > 0 && (
              <button 
                onClick={onOpenFavorites}
                className="nav-shortlist-btn"
                title="View Shortlisted Profiles"
              >
                <Heart size={14} fill="#E11D48" color="#E11D48" />
                <span>Shortlist ({favoritesCount})</span>
              </button>
            )}

            <button 
              onClick={() => onOpenAuth('login')}
              className="btn-outline-burgundy hide-mobile"
            >
              <Lock size={15} />
              <span>Login</span>
            </button>
            
            <button 
              onClick={() => onOpenAuth('register')}
              className="btn-burgundy"
            >
              <UserPlus size={16} />
              <span>Register Free</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-dropdown">
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#search" onClick={() => setMobileMenuOpen(false)}>Search</a>
            <a href="#featured" onClick={() => setMobileMenuOpen(false)}>Matches</a>
            <a href="#membership" onClick={() => setMobileMenuOpen(false)}>Membership</a>
            <a href="#stories" onClick={() => setMobileMenuOpen(false)}>Success Stories</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                className="btn-outline-burgundy" 
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Login
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
                className="btn-burgundy" 
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Register
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

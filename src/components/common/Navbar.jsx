import React, { useState } from 'react';
import { 
  Phone, 
  Globe, 
  Lock, 
  UserPlus, 
  Menu, 
  X, 
  Heart, 
  ShieldCheck, 
  Sparkles,
  Users
} from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenFavorites, favoritesCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('English');

  const languages = ['English', 'বাংলা (Bengali)', 'हिंदी (Hindi)'];

  return (
    <header>
      {/* Top Utility Bar */}
      <div className="topbar">
        <div className="container topbar-content">
          <div className="topbar-left">
            <span className="topbar-item">
              <Phone size={13} className="text-gold" style={{ color: 'var(--accent-gold-light)' }} />
              <span>24/7 Helpline: <strong>+91 1800 200 7777</strong></span>
            </span>
            <span className="topbar-item hide-mobile">
              <ShieldCheck size={14} style={{ color: '#10B981' }} />
              <span>100% Verified Hindu & South Asian Matrimony</span>
            </span>
          </div>

          <div className="topbar-right">
            <div className="topbar-item">
              <Globe size={13} style={{ color: 'var(--accent-gold-light)' }} />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  color: '#FFF', 
                  border: 'none', 
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang} style={{ color: '#333' }}>{lang}</option>
                ))}
              </select>
            </div>
            
            {favoritesCount > 0 && (
              <button 
                onClick={onOpenFavorites}
                className="topbar-item" 
                style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 10px', borderRadius: '20px', color: '#FFF' }}
              >
                <Heart size={13} fill="#E11D48" color="#E11D48" />
                <span>Shortlisted (<strong>{favoritesCount}</strong>)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
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
            <li><a href="#search" className="nav-link">Search Matches</a></li>
            <li><a href="#featured" className="nav-link">Featured Profiles</a></li>
            <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
            <li><a href="#membership" className="nav-link">Membership</a></li>
            <li><a href="#stories" className="nav-link">Success Stories</a></li>
          </ul>

          {/* User Action CTAs */}
          <div className="nav-actions">
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
          <div style={{
            background: '#FFF',
            padding: '20px',
            borderTop: '1px solid var(--romantic-rose)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--primary-burgundy)' }}>Home</a>
            <a href="#search" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Search Matches</a>
            <a href="#featured" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Featured Profiles</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>How It Works</a>
            <a href="#membership" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Membership Plans</a>
            <a href="#stories" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Success Stories</a>
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

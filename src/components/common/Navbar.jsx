import React, { useState } from 'react';
import { 
  Lock, 
  UserPlus, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      {/* Main Navigation Bar */}
      <nav className="navbar">
        <div className="container navbar-container">
          {/* Official Brand Logo */}
          <a href="#" className="brand-logo">
            <img 
              src="/logo.png" 
              alt="Saptaganga Matrimony" 
              className="navbar-brand-logo-img" 
            />
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

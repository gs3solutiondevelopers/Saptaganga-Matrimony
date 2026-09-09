import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Lock, 
  UserPlus, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`main-header-sticky ${scrolled ? 'header-scrolled' : ''}`}>
      {/* Main Navigation Bar (Common across all pages) */}
      <nav className="navbar">
        <div className="container navbar-container">
          {/* Official Brand Logo with Name */}
          <Link to="/" className="brand-logo">
            <img 
              src="/logo-emblem.png" 
              alt="Saptaganga Matrimony" 
              className="navbar-brand-logo-img" 
            />
            <div className="brand-text-container">
              <span className="brand-name">SAPTAGANGA</span>
              <span className="brand-tagline">
                <span>M</span><span>A</span><span>T</span><span>R</span><span>I</span><span>M</span><span>O</span><span>N</span><span>Y</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Search
              </NavLink>
            </li>
            <li>
              <NavLink to="/matches" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Matches
              </NavLink>
            </li>
            <li>
              <NavLink to="/membership" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Membership
              </NavLink>
            </li>
            <li>
              <NavLink to="/stories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Success Stories
              </NavLink>
            </li>
            <li>
              <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                How It Works
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
            </li>
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
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/search" onClick={() => setMobileMenuOpen(false)}>Search</NavLink>
            <NavLink to="/matches" onClick={() => setMobileMenuOpen(false)}>Matches</NavLink>
            <NavLink to="/membership" onClick={() => setMobileMenuOpen(false)}>Membership</NavLink>
            <NavLink to="/stories" onClick={() => setMobileMenuOpen(false)}>Success Stories</NavLink>
            <NavLink to="/how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
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

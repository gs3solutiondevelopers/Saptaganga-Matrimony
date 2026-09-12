import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Lock, 
  Menu, 
  X,
  User,
  LogOut,
  UserPlus,
  ChevronDown,
  Bell,
  CheckCheck,
  Crown,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  onOpenAuth, 
  onOpenCreateProfile, 
  currentUser, 
  onLogout,
  onViewNotificationProfile,
  notifications = []
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState('all');
  const [unreadCount, setUnreadCount] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`main-header-sticky ${scrolled ? 'header-scrolled' : ''}`}>
      {/* Main Navigation Bar */}
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
            {/* Notification Bell with Badge & Dropdown */}
            <div ref={notificationRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: notificationOpen ? '#FFF0F3' : 'transparent',
                  border: notificationOpen ? '1px solid #F8D3DA' : '1px solid transparent',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: notificationOpen ? 'var(--primary-burgundy)' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!notificationOpen) {
                    e.currentTarget.style.background = '#F9FAFB';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!notificationOpen) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
                aria-expanded={notificationOpen}
                aria-label="Notifications"
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Bell size={18} color={notificationOpen ? 'var(--primary-burgundy)' : '#4B5563'} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-7px',
                      background: '#E53E3E',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 2px',
                      lineHeight: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span>Notification</span>
              </button>

              {/* Notification Dropdown Menu Card */}
              {notificationOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '330px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                  border: '1px solid var(--romantic-rose-border)',
                  padding: '12px',
                  zIndex: 1000,
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  {/* Dropdown Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 6px 8px 6px',
                    borderBottom: '1px solid #F3F4F6'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#111827' }}>
                      Notifications
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setUnreadCount(0)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '0.75rem',
                          color: 'var(--primary-burgundy)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCheck size={13} />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs Bar (All / Interactions) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    background: '#FFF5F7',
                    borderRadius: '10px',
                    marginTop: '8px',
                    border: '1px solid #FCE7EB'
                  }}>
                    <button
                      type="button"
                      onClick={() => setNotificationTab('all')}
                      style={{
                        padding: '6px 20px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        border: notificationTab === 'all' ? 'none' : '1px solid #E5E7EB',
                        background: notificationTab === 'all' 
                          ? 'linear-gradient(135deg, #780E2F 0%, #9E1B43 100%)' 
                          : '#FFFFFF',
                        color: notificationTab === 'all' ? '#FFFFFF' : '#4B5563',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: notificationTab === 'all' ? '0 2px 8px rgba(120, 14, 47, 0.28)' : 'none'
                      }}
                    >
                      All
                    </button>

                    <button
                      type="button"
                      onClick={() => setNotificationTab('interactions')}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        border: notificationTab === 'interactions' ? 'none' : '1px solid #E5E7EB',
                        background: notificationTab === 'interactions' 
                          ? 'linear-gradient(135deg, #780E2F 0%, #9E1B43 100%)' 
                          : '#FFFFFF',
                        color: notificationTab === 'interactions' ? '#FFFFFF' : '#4B5563',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: notificationTab === 'interactions' ? '0 2px 8px rgba(120, 14, 47, 0.28)' : 'none'
                      }}
                    >
                      Interactions
                    </button>
                  </div>

                  {/* Notification List by Tab */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {notificationTab === 'all' ? (
                      <>
                        {/* Admin Approval & System Notifications */}
                        {notifications.length > 0 ? (
                          notifications.map((notif, i) => (
                            <div 
                              key={notif.id || i}
                              onClick={() => setUnreadCount(0)}
                              style={{
                                padding: '10px',
                                borderRadius: '10px',
                                background: notif.unread ? '#FFF8F9' : '#F9FAFB',
                                border: notif.unread ? '1px solid #FCE7EB' : '1px solid #F3F4F6',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: notif.unread ? '#E53E3E' : 'transparent',
                                  marginTop: '5px',
                                  flexShrink: 0
                                }} />
                                <div>
                                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>
                                    {notif.title}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '2px', lineHeight: 1.35 }}>
                                    {notif.message}
                                  </div>
                                  <div style={{ fontSize: '0.70rem', color: '#9CA3AF', marginTop: '4px' }}>
                                    {notif.time || 'Just now'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div 
                            onClick={() => setUnreadCount(0)}
                            style={{
                              padding: '10px',
                              borderRadius: '10px',
                              background: unreadCount > 0 ? '#FFF8F9' : '#F9FAFB',
                              border: unreadCount > 0 ? '1px solid #FCE7EB' : '1px solid #F3F4F6',
                              cursor: 'pointer',
                              transition: 'background 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: unreadCount > 0 ? '#E53E3E' : 'transparent',
                                marginTop: '5px',
                                flexShrink: 0
                              }} />
                              <div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>
                                  Welcome to Saptaganga Matrimony
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '2px', lineHeight: 1.35 }}>
                                  Your profile is submitted. Browse verified matches tailored to your community and preferences.
                                </div>
                                <div style={{ fontSize: '0.70rem', color: '#9CA3AF', marginTop: '4px' }}>
                                  Just now
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div 
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            background: '#F9FAFB',
                            border: '1px solid #F3F4F6',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151' }}>
                                Daily Match Recommendations
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '2px', lineHeight: 1.35 }}>
                                We found 3 new compatible verified profiles matching your preferences.
                              </div>
                              <div style={{ fontSize: '0.70rem', color: '#9CA3AF', marginTop: '4px' }}>
                                2 hours ago
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Interactions Tab - Interests & Views with View Profile Button */}
                        <div 
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: '#FFF8F9',
                            border: '1px solid #FCE7EB'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: 'var(--primary-burgundy)',
                              marginTop: '5px',
                              flexShrink: 0
                            }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>
                                💌 Interest Received from Ananya Sharma
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#4B5563', marginTop: '3px', lineHeight: 1.4 }}>
                                Ananya Sharma (27 yrs, Kolkata, Senior Software Engineer) has expressed interest in connecting with you!
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                                <span style={{ fontSize: '0.70rem', color: '#9CA3AF' }}>10 mins ago</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNotificationOpen(false);
                                    if (onViewNotificationProfile) {
                                      onViewNotificationProfile({
                                        id: "SG-101",
                                        name: "Ananya Sharma",
                                        gender: "female",
                                        age: 27,
                                        height: "5' 4\"",
                                        religion: "Hindu",
                                        caste: "Brahmin",
                                        motherTongue: "Bengali",
                                        city: "Kolkata",
                                        state: "West Bengal",
                                        education: "B.Tech in Computer Science",
                                        profession: "Senior Software Engineer",
                                        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
                                        about: "Looking for an understanding partner who values equality and traditions."
                                      });
                                    }
                                  }}
                                  style={{
                                    background: 'linear-gradient(135deg, #E05A10 0%, #C2410C 100%)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    padding: '5px 12px',
                                    borderRadius: '16px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(224, 90, 16, 0.25)'
                                  }}
                                >
                                  View Full Profile ›
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div 
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: '#F9FAFB',
                            border: '1px solid #F3F4F6'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151' }}>
                                👀 Profile Viewed
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '2px', lineHeight: 1.35 }}>
                                A verified member matching your partner preferences viewed your profile.
                              </div>
                              <div style={{ fontSize: '0.70rem', color: '#9CA3AF', marginTop: '4px' }}>
                                1 hour ago
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {currentUser ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User profile menu"
                  aria-expanded={userDropdownOpen}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#FFF0F3',
                    border: userDropdownOpen ? '2px solid var(--primary-burgundy)' : '2px solid #F8D3DA',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: userDropdownOpen 
                      ? '0 0 0 3px rgba(120, 14, 47, 0.15), 0 4px 12px rgba(120, 14, 47, 0.2)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {currentUser.image || currentUser.profileImage ? (
                    <img 
                      src={currentUser.image || currentUser.profileImage} 
                      alt={currentUser.name || 'Profile Avatar'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #780E2F 0%, #9E1B43 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.92rem',
                      fontWeight: 700
                    }}>
                      {(currentUser.name || currentUser.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Profile Dropdown Menu Card */}
                {userDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '280px',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16)',
                    border: '1px solid #FCE7EB',
                    padding: '16px',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    {/* User Info Header Card */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #F3F4F6',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#FFF0F3',
                        border: '1.5px solid var(--primary-burgundy)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {currentUser.image || currentUser.profileImage ? (
                          <img 
                            src={currentUser.image || currentUser.profileImage} 
                            alt={currentUser.name || 'Avatar'} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #780E2F 0%, #9E1B43 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 800
                          }}>
                            {(currentUser.name || currentUser.fullName || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{
                          fontSize: '0.98rem',
                          fontWeight: 800,
                          color: 'var(--primary-burgundy-dark)',
                          lineHeight: '1.2',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {currentUser.name || currentUser.fullName || 'Registered Member'}
                        </div>
                        <div style={{
                          fontSize: '0.74rem',
                          color: '#6B7280',
                          marginTop: '2px'
                        }}>
                          ID: <strong style={{ color: '#374151' }}>{currentUser.memberId || currentUser.id || 'SG-202688'}</strong>
                        </div>
                        {currentUser.phone && (
                          <div style={{
                            fontSize: '0.72rem',
                            color: '#9CA3AF',
                            marginTop: '1px'
                          }}>
                            {currentUser.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badges Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexWrap: 'wrap',
                      marginBottom: '12px'
                    }}>
                      {/* Membership Plan Badge */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: (currentUser.hasSubscription || currentUser.isSubscribed || currentUser.subscriptionPlan) ? '#FEF3C7' : '#F3F4F6',
                        color: (currentUser.hasSubscription || currentUser.isSubscribed || currentUser.subscriptionPlan) ? '#B45309' : '#6B7280'
                      }}>
                        <Crown size={12} />
                        <span>{currentUser.subscriptionPlan || (currentUser.hasSubscription ? 'Premium Plan' : 'Free Plan')}</span>
                      </div>

                      {/* Verification Status Badge */}
                      {(() => {
                        const isVerified = Boolean(
                          currentUser.verified === true || 
                          currentUser.approved === true || 
                          currentUser.status === 'approved' ||
                          currentUser.status === 'verified'
                        );
                        return (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: isVerified ? '#ECFDF5' : '#FFFBEB',
                            color: isVerified ? '#059669' : '#D97706',
                            border: isVerified ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(217, 119, 6, 0.2)'
                          }}>
                            <ShieldCheck size={12} />
                            <span>{isVerified ? 'Verified Profile' : 'Verification Pending'}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Menu Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenCreateProfile) onOpenCreateProfile();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 12px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: '#374151',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#FFF0F3'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <UserPlus size={16} color="var(--primary-burgundy)" />
                        <span>View / Edit Profile</span>
                      </button>

                      <Link
                        to="/membership"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 12px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: '#374151',
                          cursor: 'pointer',
                          textAlign: 'left',
                          textDecoration: 'none',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#FFF8E7'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Crown size={16} color="#D97706" />
                        <span>Upgrade Membership</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 12px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: '#DC2626',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          marginTop: '4px',
                          borderTop: '1px solid #F3F4F6'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={16} color="#DC2626" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => onOpenAuth('login')}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '9999px',
                    background: '#FFFFFF',
                    color: 'var(--primary-burgundy)',
                    border: '1.5px solid var(--primary-burgundy)',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Lock size={14} />
                  <span>Login</span>
                </button>

                <button 
                  onClick={() => {
                    if (onOpenCreateProfile) onOpenCreateProfile();
                    else onOpenAuth('register');
                  }}
                  className="btn-burgundy"
                  style={{ 
                    padding: '8px 18px', 
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <UserPlus size={14} />
                  <span>Register Free</span>
                </button>
              </div>
            )}

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
            
            {/* Mobile Notification Item */}
            <div 
              onClick={() => {
                setUnreadCount(0);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: unreadCount > 0 ? '#FFF0F3' : '#F9FAFB',
                borderRadius: '10px',
                border: unreadCount > 0 ? '1px solid #F8D3DA' : '1px solid #E5E7EB',
                cursor: 'pointer',
                margin: '4px 0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-burgundy)', fontWeight: 600, fontSize: '0.88rem' }}>
                <Bell size={18} />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span style={{
                  background: '#E53E3E',
                  color: '#FFF',
                  fontSize: '0.70rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>

            <div style={{ marginTop: '10px' }}>
              {currentUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--primary-burgundy)' }}>
                    Signed in as {currentUser.name || currentUser.phone}
                  </div>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                    className="btn-outline-burgundy" 
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                  className="btn-burgundy" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Lock size={15} />
                  <span>Login with Mobile OTP</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

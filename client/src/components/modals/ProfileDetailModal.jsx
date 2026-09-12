import React, { useRef } from 'react';
import { 
  X, 
  Bookmark, 
  MoreVertical, 
  PhoneCall, 
  MessageCircle, 
  ChevronsRight, 
  Heart, 
  Crown,
  ChevronRight,
  Info,
  ShieldCheck,
  ArrowLeft,
  Lock,
  User,
  Home,
  Phone,
  Compass,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { MOCK_PROFILES } from '../../data/mockData.js';

export default function ProfileDetailModal({ 
  profile, 
  allProfiles = [],
  currentUser = null,
  onSelectProfile,
  onClose, 
  onSendInterest, 
  onToggleShortlist, 
  isShortlisted,
  onUnlockContact
}) {
  const scrollRef = useRef(null);

  if (!profile) return null;

  // Use matching profile list or fallback to MOCK_PROFILES
  const profileList = allProfiles && allProfiles.length > 0 ? allProfiles : MOCK_PROFILES;
  const currentIndex = profileList.findIndex(p => p.id === profile.id);

  // Scroll carousel right
  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  // Skip to next profile
  const handleSkip = () => {
    if (profileList.length > 1 && onSelectProfile) {
      const nextIndex = (currentIndex + 1) % profileList.length;
      onSelectProfile(profileList[nextIndex]);
    } else {
      onClose();
    }
  };

  // Format bullet items for hero card
  const metadataItems = [
    profile.maritalStatus || 'Never Married',
    `Profile created by ${profile.profileFor || 'parents'}`,
    `${profile.age} yrs`,
    profile.height || "5'0\"",
    `${profile.caste || profile.religion || 'Kayastha'} (${profile.motherTongue || 'Bengali'})`,
    profile.education || 'B.A.',
    profile.profession || 'Not Working',
    profile.city || 'Berhampore'
  ].filter(Boolean);

  // Helper row renderer for key-value lists
  const renderKeyValueRow = (label, value, isLocked = false) => (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      fontSize: '0.94rem',
      padding: '8px 0',
      color: '#1F2937'
    }}>
      <div style={{ width: '220px', minWidth: '180px', color: '#4B5563', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ width: '20px', color: '#6B7280', fontWeight: 600 }}>:</div>
      <div style={{ flex: 1, fontWeight: 500, color: '#111827' }}>
        {isLocked ? (
          <button
            onClick={() => onUnlockContact && onUnlockContact(profile)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#EA580C',
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '0.94rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <Lock size={13} />
            <span>{typeof value === 'string' && value.includes('+91') ? value : 'Upgrade to view ›'}</span>
          </button>
        ) : (
          value
        )}
      </div>
    </div>
  );

  // Helper preference row renderer with check/cross
  const renderPreferenceRow = (label, value, isMatched = true) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.93rem',
      padding: '10px 0',
      borderBottom: '1px solid #F3F4F6'
    }}>
      <div style={{ width: '250px', minWidth: '190px', color: '#4B5563', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ flex: 1, color: '#111827', fontWeight: 600, paddingRight: '12px' }}>
        {value}
      </div>
      <div>
        {isMatched ? (
          <CheckCircle2 size={19} color="#10B981" />
        ) : (
          <XCircle size={19} color="#D1D5DB" />
        )}
      </div>
    </div>
  );

  return (
    <div 
      className="profile-detail-fullpage-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: '#F4F6F9',
        overflowY: 'scroll',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        padding: '20px 16px 140px 16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Top Navigation Bar with Back & Close */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '24px',
              padding: '8px 18px',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Profiles</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4B5563',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Matching Profiles Thumbnail Carousel Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative'
        }}>
          <div 
            ref={scrollRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '6px 4px',
              flex: 1
            }}
          >
            {profileList.map((p, idx) => {
              const isCurrent = p.id === profile.id;
              return (
                <button
                  key={p.id || idx}
                  onClick={() => onSelectProfile && onSelectProfile(p)}
                  aria-label={`View profile ${p.name}`}
                  style={{
                    position: 'relative',
                    width: '84px',
                    height: '84px',
                    minWidth: '84px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: isCurrent ? '3.5px solid #E05A10' : '2.5px solid #FFFFFF',
                    boxShadow: isCurrent 
                      ? '0 8px 24px rgba(224, 90, 16, 0.45), 0 0 0 2px #FFF' 
                      : '0 4px 12px rgba(0,0,0,0.1)',
                    transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    padding: 0,
                    cursor: 'pointer',
                    background: '#1F2937'
                  }}
                >
                  {p.image || p.profileImage ? (
                    <img 
                      src={p.image || p.profileImage} 
                      alt={p.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    style={{
                      display: (p.image || p.profileImage) ? 'none' : 'flex',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #780E2F 0%, #9E1B43 100%)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF'
                    }}
                  >
                    <User size={24} color="#FFFFFF" />
                  </div>
                  {p.isFeatured && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: '#F59E0B',
                        color: '#FFF',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      <Crown size={11} fill="#FFF" color="#FFF" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Carousel Next Arrow */}
          <button
            onClick={handleScrollRight}
            aria-label="Scroll profiles right"
            style={{
              width: '42px',
              height: '42px',
              minWidth: '42px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Unified Profile Card Container */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)',
          border: '1px solid #E5E7EB',
          overflow: 'hidden'
        }}>
          
          {/* TOP HERO SECTION */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderBottom: '1px solid #F3F4F6'
          }}>
            {/* Left Column - Compact Photo Showcase */}
            <div style={{
              flex: '0 0 320px',
              width: '320px',
              maxWidth: '320px',
              minWidth: '280px',
              height: '340px',
              position: 'relative',
              background: '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {profile.image || profile.profileImage ? (
                <img 
                  src={profile.image || profile.profileImage} 
                  alt={profile.name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                style={{
                  display: (profile.image || profile.profileImage) ? 'none' : 'flex',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #780E2F 0%, #9E1B43 100%)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF'
                }}
              >
                <User size={64} color="#FFFFFF" />
              </div>

              {/* Bottom Dark Gradient & Indicator Bar */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 20px 14px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, transparent 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'rgba(255,255,255,0.95)'
                }} />
                <span style={{
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}>
                  1/1
                </span>
              </div>
            </div>

            {/* Right Column - Profile Details & Contact Actions */}
            <div style={{
              flex: '1 1 440px',
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#FFFFFF'
            }}>
              
              <div>
                {/* Header Top Row: Verified Ribbon & Utilities */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}>
                  {/* Verified Ribbon */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#E0F2FE',
                    color: '#0284C7',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.86rem',
                    fontWeight: 700
                  }}>
                    <ShieldCheck size={16} fill="#0284C7" color="#FFF" />
                    <span>Verified</span>
                    <Info size={14} style={{ opacity: 0.85 }} />
                  </div>

                  {/* Right Utilities: Shortlist & More */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => onToggleShortlist && onToggleShortlist(profile)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 16px',
                        borderRadius: '24px',
                        border: isShortlisted ? '1px solid #E11D48' : '1px solid #E5E7EB',
                        background: isShortlisted ? '#FFF1F2' : '#F9FAFB',
                        color: isShortlisted ? '#E11D48' : '#374151',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Bookmark size={14} fill={isShortlisted ? "#E11D48" : "none"} color={isShortlisted ? "#E11D48" : "#4B5563"} />
                      <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
                    </button>

                    <button
                      onClick={onClose}
                      aria-label="More options"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6B7280',
                        cursor: 'pointer'
                      }}
                    >
                      <MoreVertical size={17} />
                    </button>
                  </div>
                </div>

                {/* Profile Name, ID & Contact Icons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  marginBottom: '14px'
                }}>
                  <div>
                    <h1 style={{
                      fontSize: '1.65rem',
                      fontWeight: 800,
                      color: '#111827',
                      lineHeight: '1.2',
                      marginBottom: '4px'
                    }}>
                      {profile.name}
                    </h1>
                    <p style={{
                      fontSize: '0.84rem',
                      color: '#6B7280',
                      margin: 0
                    }}>
                      {profile.id || 'B7020333'} | Last seen few hour ago
                    </p>
                  </div>

                  {/* Call & WhatsApp Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => onUnlockContact && onUnlockContact(profile)}
                      title="Call or Unlock Contact"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1.5px solid #FDBA74',
                        background: '#FFF7ED',
                        color: '#EA580C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(234, 88, 12, 0.18)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <PhoneCall size={18} />
                    </button>

                    <button
                      onClick={() => {
                        const targetPhone = (profile.phone || '9876543210').replace(/\D/g, '').slice(-10);
                        const isSubscribed = currentUser?.hasSubscription || currentUser?.isSubscribed || currentUser?.subscriptionPlan;
                        if (!isSubscribed) {
                          if (onUnlockContact) onUnlockContact(profile);
                          return;
                        }
                        const text = encodeURIComponent(`Hello ${profile.name}, I found your verified profile on Saptaganga Matrimony and would like to connect.`);
                        window.open(`https://wa.me/91${targetPhone}?text=${text}`, '_blank');
                      }}
                      title="Chat on WhatsApp"
                      aria-label="Chat on WhatsApp"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1.5px solid #25D366',
                        background: '#25D366',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(37, 211, 102, 0.35)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.37C16.32 14.24 15.1 13.64 14.88 13.56C14.65 13.48 14.48 13.44 14.32 13.69C14.15 13.94 13.68 14.49 13.53 14.66C13.38 14.82 13.24 14.85 12.99 14.72C12.74 14.6 11.94 14.33 10.99 13.49C10.25 12.83 9.75 12.02 9.6 11.77C9.45 11.52 9.58 11.39 9.71 11.26C9.82 11.15 9.96 10.97 10.08 10.82C10.21 10.67 10.25 10.57 10.33 10.4C10.41 10.24 10.37 10.1 10.31 9.97C10.25 9.85 9.75 8.63 9.55 8.12C9.35 7.63 9.15 7.7 9 7.69C8.86 7.69 8.7 7.68 8.53 7.68C8.36 7.68 8.09 7.75 7.86 8C7.63 8.25 7 8.84 7 10.04C7 11.24 7.88 12.4 8 12.57C8.12 12.73 9.72 15.2 12.18 16.27C12.76 16.52 13.22 16.67 13.57 16.78C14.16 16.97 14.7 16.94 15.12 16.88C15.6 16.81 16.58 16.28 16.79 15.7C16.99 15.11 16.99 14.61 16.93 14.5C16.87 14.41 16.72 14.36 16.57 14.37Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bullet-Separated Profile Info */}
                <div style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  lineHeight: '1.7',
                  marginBottom: '10px'
                }}>
                  {metadataItems.map((item, index) => (
                    <span key={index}>
                      {item}
                      {index < metadataItems.length - 1 && (
                        <span style={{ margin: '0 8px', color: '#9CA3AF', fontWeight: 'bold' }}>•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Buttons inside Hero */}
              <div>
                <hr style={{
                  border: 'none',
                  borderTop: '1px solid #E5E7EB',
                  margin: '16px 0 14px'
                }} />

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {/* Skip Button */}
                  <button
                    onClick={handleSkip}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 24px',
                      borderRadius: '28px',
                      border: '1.5px solid #E05A10',
                      background: '#FFFFFF',
                      color: '#E05A10',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ChevronsRight size={18} />
                    <span>Skip</span>
                  </button>

                  {/* Send Interest Button */}
                  <button
                    onClick={() => onSendInterest && onSendInterest(profile)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 28px',
                      borderRadius: '28px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #E05A10 0%, #C2410C 100%)',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(224, 90, 16, 0.35)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Heart size={17} fill="#FFFFFF" color="#FFFFFF" />
                    <span>Send Interest</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* SCROLLABLE DETAILED INFORMATION BODY */}
          <div style={{ padding: '36px 40px', background: '#FFFFFF' }}>
            
            {/* 1. PERSONAL INFORMATION SECTION */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFF1F2',
                color: '#9F1239',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.96rem',
                marginBottom: '16px'
              }}>
                <User size={17} />
                <span>Personal Information</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px' }}>
                {renderKeyValueRow('Age', `${profile.age || 23} Years and 9 months`)}
                {renderKeyValueRow('Height', profile.height || "5'0\"")}
                {renderKeyValueRow('Mother Tongue', profile.motherTongue || 'Bengali')}
                {renderKeyValueRow('Profile Created By', profile.profileFor || 'Parents')}
                {renderKeyValueRow('Marital Status', profile.maritalStatus || 'Never Married')}
                {renderKeyValueRow('Lives In', `${profile.city || 'Berhampore'}, ${profile.state || 'West Bengal'}`)}
                {renderKeyValueRow('Eating Habits', profile.diet || 'Non-Vegetarian')}
                {renderKeyValueRow('Religion', profile.religion || 'Hindu')}
                {renderKeyValueRow('Caste', `${profile.caste || 'Kayastha'} (${profile.motherTongue || 'Bengali'})`)}
                {renderKeyValueRow('Subcaste', "Don't know sub-caste")}
                {renderKeyValueRow('Gothra(m)', 'Not specified')}
                {renderKeyValueRow('Dosha(m)', profile.manglik || 'No Dosham')}
                {renderKeyValueRow('Date Of Birth', '', true)}
                {renderKeyValueRow('Star', '', true)}
                {renderKeyValueRow('Raasi', '', true)}
                {renderKeyValueRow('Horoscope', '', true)}
                {renderKeyValueRow('Employment', profile.employment || 'Currently Not Working')}
                {renderKeyValueRow('Education', profile.education || 'B.A.')}
                {renderKeyValueRow('Occupation', profile.profession || 'Not Working')}
                {renderKeyValueRow('Works at', '', true)}
                {renderKeyValueRow('Education', '', true)}
              </div>
            </div>

            {/* 2. FAMILY INFORMATION SECTION */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFF1F2',
                color: '#9F1239',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.96rem',
                marginBottom: '16px'
              }}>
                <Home size={17} />
                <span>Family Information</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px' }}>
                {renderKeyValueRow('Ancestral Origin', 'Not specified')}
                {renderKeyValueRow('Family Type', profile.familyType || 'Nuclear')}
                {renderKeyValueRow('Family Status', profile.familyStatus || 'Middle Class')}
                {renderKeyValueRow('Family Values', 'Traditional')}
              </div>
            </div>

            {/* 3. CONTACT INFORMATION SECTION */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFF1F2',
                color: '#9F1239',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.96rem',
                marginBottom: '16px'
              }}>
                <Phone size={17} />
                <span>Contact Information</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px' }}>
                {renderKeyValueRow('Mobile Number', '+91 96******** Upgrade to view >', true)}
              </div>
            </div>

            {/* 4. ABOUT MYSELF SECTION */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFF1F2',
                color: '#9F1239',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.96rem',
                marginBottom: '16px'
              }}>
                <User size={17} />
                <span>About Myself</span>
              </div>

              <p style={{
                fontSize: '0.95rem',
                color: '#374151',
                lineHeight: '1.7',
                margin: '0 0 8px 0'
              }}>
                {profile.about || `My daughter has completed her Bachelor's degree. She is currently not working and she lives in ${profile.city || 'Berhampore'}.`}
              </p>
            </div>

            {/* 5. LIFESTYLE SECTION */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFF1F2',
                color: '#9F1239',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.96rem',
                marginBottom: '16px'
              }}>
                <Compass size={17} />
                <span>Lifestyle</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px' }}>
                {renderKeyValueRow('Hobbies', Array.isArray(profile.hobbies) ? profile.hobbies.join(', ') : (profile.hobbies || 'Travel, Reading, Music'))}
                {renderKeyValueRow('Movies', 'Comedy, Horror, Romantic, Romantic Comedies')}
                {renderKeyValueRow('Music', 'Film Songs')}
                {renderKeyValueRow('Smoking Habits', 'Not specified')}
                {renderKeyValueRow('Drinking Habits', 'Not specified')}
              </div>
            </div>

            {/* 6. PARTNER PREFERENCES SECTION */}
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '32px' }}>
              <h3 style={{
                textAlign: 'center',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#111827',
                marginBottom: '24px'
              }}>
                {profile.gender === 'male' ? 'His' : 'Her'} Partner Preferences
              </h3>

              {/* Match Banner Card */}
              <div style={{
                background: 'linear-gradient(135deg, #FFF5F8 0%, #F5F3FF 100%)',
                border: '1.5px solid #E9D5FF',
                borderRadius: '16px',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.08)'
              }}>
                {/* Left Candidate Thumbnail */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #FFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <img 
                    src={profile.image || profile.profileImage} 
                    alt={profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Match Text */}
                <div style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  textAlign: 'center'
                }}>
                  You match <span style={{ color: '#7C3AED', fontSize: '1.15rem' }}>16/20</span> of {profile.gender === 'male' ? 'his' : 'her'} preferences
                </div>

                {/* Right User Avatar */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #FFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  background: '#E5E7EB'
                }}>
                  <img 
                    src={currentUser?.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} 
                    alt="Your Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* A. Basic Preferences */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFF1F2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ color: '#9F1239', fontWeight: 700, fontSize: '0.94rem' }}>
                    Basic Preferences
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10B981' }}>
                    You match ✓
                  </span>
                </div>

                <div style={{ padding: '0 4px' }}>
                  {renderPreferenceRow("Preferred Groom's Age", "23-30 yrs", true)}
                  {renderPreferenceRow("Preferred Height", "5'0\" - 6'0\"", true)}
                  {renderPreferenceRow("Preferred Marital Status", "Never Married", true)}
                  {renderPreferenceRow("Preferred Mother Tongue", "Bengali", true)}
                  {renderPreferenceRow("Preferred Physical Status", "Normal", true)}
                  {renderPreferenceRow("Preferred Eating Habits", "Doesn't Matter", true)}
                  {renderPreferenceRow("Preferred Smoking Habits", "Doesn't Matter", true)}
                  {renderPreferenceRow("Preferred Drinking Habits", "Never Drinks, Drinks Socially", false)}
                </div>
              </div>

              {/* B. Religious Preferences */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  background: '#FFF1F2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ color: '#9F1239', fontWeight: 700, fontSize: '0.94rem' }}>
                    Religious Preferences
                  </span>
                </div>

                <div style={{ padding: '0 4px' }}>
                  {renderPreferenceRow("Preferred Religion", "Hindu", true)}
                  {renderPreferenceRow("Preferred Caste", `${profile.caste || 'Kayastha'} (Bengali)`, false)}
                  {renderPreferenceRow("Preferred Subcaste", "Any", false)}
                  {renderPreferenceRow("Preferred Star", "Any", true)}
                  {renderPreferenceRow("Preferred Dosham", "Doesn't Matter", true)}
                </div>
              </div>

              {/* C. Professional Preferences */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{
                  background: '#FFF1F2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ color: '#9F1239', fontWeight: 700, fontSize: '0.94rem' }}>
                    Professional Preferences
                  </span>
                </div>

                <div style={{ padding: '0 4px' }}>
                  {renderPreferenceRow("Preferred Education", "Bachelors - Engineering / Computers / Others, Masters", true)}
                  {renderPreferenceRow("Preferred Employment Type", "Any", true)}
                  {renderPreferenceRow("Preferred Occupation", "Any", true)}
                  {renderPreferenceRow("Preferred Annual Income", "Rs. 12 Lakhs - Rs. 16 Lakhs", false)}
                </div>
              </div>

              {/* D. Location Preferences */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  background: '#FFF1F2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ color: '#9F1239', fontWeight: 700, fontSize: '0.94rem' }}>
                    Location Preferences
                  </span>
                </div>

                <div style={{ padding: '0 4px' }}>
                  {renderPreferenceRow("Preferred Country", "India", true)}
                  {renderPreferenceRow("Preferred Residing State", "Any", true)}
                  {renderPreferenceRow("Preferred Residing City", "Any", true)}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

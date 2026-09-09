import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Heart, 
  Send, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Home, 
  Sparkles, 
  Phone, 
  Lock,
  Compass,
  FileText
} from 'lucide-react';

export default function ProfileDetailModal({ 
  profile, 
  onClose, 
  onSendInterest, 
  onToggleShortlist, 
  isShortlisted,
  onUnlockContact
}) {
  const [activeTab, setActiveTab] = useState('about');

  if (!profile) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '680px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold-dark)', background: 'var(--accent-gold-soft)', padding: '3px 8px', borderRadius: '4px' }}>
              PROFILE ID: {profile.id}
            </span>
            {profile.verified && (
              <span className="badge-verified">
                <CheckCircle2 size={13} />
                Verified
              </span>
            )}
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Hero Strip */}
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '24px',
          background: 'linear-gradient(135deg, #FFF9F9 0%, #FFF3F6 100%)',
          borderBottom: '1px solid var(--romantic-rose-border)',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={profile.image} 
              alt={profile.name} 
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary-burgundy)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            {profile.online && (
              <span 
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid #FFF'
                }}
                title="Online Now"
              />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--primary-burgundy-dark)', marginBottom: '4px' }}>
              {profile.name}
            </h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {profile.age} Yrs • {profile.height} • {profile.religion} ({profile.caste})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary-burgundy)', fontWeight: 600 }}>
              <Briefcase size={15} />
              <span>{profile.profession} at {profile.company || 'Reputed Organization'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <MapPin size={14} />
              <span>{profile.city}, {profile.state}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 24px',
          background: '#FFF',
          overflowX: 'auto'
        }}>
          {[
            { id: 'about', label: 'About & Lifestyle' },
            { id: 'career', label: 'Career & Education' },
            { id: 'family', label: 'Family & Horoscope' },
            { id: 'preferences', label: 'Partner Preferences' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 18px',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: activeTab === tab.id ? 'var(--primary-burgundy)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '2.5px solid var(--primary-burgundy)' : '2.5px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="modal-body">
          {activeTab === 'about' && (
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-burgundy)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} />
                <span>Personal Overview</span>
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '20px' }}>
                "{profile.about}"
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: 'var(--romantic-rose)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div><strong>Mother Tongue:</strong> {profile.motherTongue}</div>
                <div><strong>Diet:</strong> {profile.diet}</div>
                <div><strong>Marital Status:</strong> Never Married</div>
                <div><strong>Location:</strong> {profile.city}, {profile.state}</div>
              </div>
            </div>
          )}

          {activeTab === 'career' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div style={{ border: '1px solid #E5E7EB', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-burgundy)', fontWeight: 700, marginBottom: '8px' }}>
                    <GraduationCap size={18} />
                    <span>Education</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{profile.education}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Full-time Premier Degree</div>
                </div>

                <div style={{ border: '1px solid #E5E7EB', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-burgundy)', fontWeight: 700, marginBottom: '8px' }}>
                    <Briefcase size={18} />
                    <span>Career & Income</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{profile.profession}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Annual Package: <strong>{profile.annualIncome}</strong></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div>
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-burgundy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Home size={16} />
                  <span>Family Background</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.88rem' }}>
                  <div><strong>Family Type:</strong> {profile.familyType}</div>
                  <div><strong>Family Status:</strong> {profile.familyStatus}</div>
                  <div><strong>Values:</strong> Traditional & Cultured</div>
                  <div><strong>Living in:</strong> {profile.city}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} />
                  <span>Horoscope / Kundali Profile</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.88rem', background: '#FCF7EE', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div><strong>Rashi (Moon Sign):</strong> {profile.rashi}</div>
                  <div><strong>Nakshatra:</strong> {profile.nakshatra}</div>
                  <div><strong>Manglik Status:</strong> {profile.manglik}</div>
                  <div><strong>Kundali Match:</strong> Available on request</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-burgundy)', marginBottom: '12px' }}>
                Looking for in a Life Partner:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem', background: '#F9FAFB', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div><strong>Preferred Age:</strong> {profile.partnerPreferences.ageRange}</div>
                <div><strong>Preferred Height:</strong> {profile.partnerPreferences.heightRange}</div>
                <div><strong>Religion:</strong> {profile.partnerPreferences.religion}</div>
                <div><strong>Education:</strong> {profile.partnerPreferences.education}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Preferred Cities:</strong> {profile.partnerPreferences.location}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '16px 24px',
          background: '#FFF9FA',
          borderTop: '1px solid var(--romantic-rose-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button 
            onClick={() => onToggleShortlist(profile)}
            className="btn-outline-burgundy"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <Heart size={16} fill={isShortlisted ? "#E11D48" : "none"} color={isShortlisted ? "#E11D48" : "currentColor"} />
            <span>{isShortlisted ? "Shortlisted" : "Shortlist"}</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => onUnlockContact(profile)}
              className="btn-gold"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              <Phone size={15} />
              <span>Unlock Contact</span>
            </button>

            <button 
              onClick={() => onSendInterest(profile)}
              className="btn-burgundy"
              style={{ padding: '10px 22px', fontSize: '0.88rem' }}
            >
              <Send size={15} />
              <span>Send Interest</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

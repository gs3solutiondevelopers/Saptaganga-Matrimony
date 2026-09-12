import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Send, 
  Users, 
  Lock, 
  UserPlus, 
  ArrowRight, 
  User, 
  MapPin, 
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function MatchesPage({
  onSelectProfile,
  onSendInterest,
  onToggleShortlist,
  shortlistedIds = new Set(),
  currentUser,
  onOpenCreateProfile
}) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMatches() {
      if (!currentUser?.profileCompleted) return;
      setLoading(true);

      const res = await api.getProfiles();
      if (res.success) {
        let list = res.data || [];

        // Filter out current user's own profile
        if (currentUser?.id || currentUser?.memberId) {
          const currentUserId = currentUser.id || currentUser.memberId;
          list = list.filter(p => p.id !== currentUserId && p.memberId !== currentUserId);
        }

        // Automatic opposite gender matchmaking filtering
        if (currentUser?.gender) {
          const userGender = currentUser.gender.toLowerCase();
          const oppositeGender = userGender === 'male' || userGender === 'groom' ? 'female' : 'male';
          const genderMatched = list.filter(p => {
            const pGender = p.gender?.toLowerCase() || '';
            if (oppositeGender === 'female') return pGender === 'female' || pGender === 'bride';
            return pGender === 'male' || pGender === 'groom';
          });
          if (genderMatched.length > 0) {
            list = genderMatched;
          }
        }
        setProfiles(list);
      }
      setLoading(false);
    }
    loadMatches();

    const handleSync = () => {
      loadMatches();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('saptaganga_profile_created', handleSync);
    window.addEventListener('saptaganga_profile_updated', handleSync);
    window.addEventListener('saptaganga_profile_approved', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('saptaganga_profile_created', handleSync);
      window.removeEventListener('saptaganga_profile_updated', handleSync);
      window.removeEventListener('saptaganga_profile_approved', handleSync);
    };
  }, [currentUser?.profileCompleted, currentUser?.gender, currentUser?.id, currentUser?.memberId]);

  return (
    <div style={{ background: '#FFF8FA', minHeight: '80vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="section-subtitle">AI & Culture Powered</span>
          <h1 className="section-title">Your Personalized Matches</h1>
          <p className="section-desc">Handpicked profiles curated to match your cultural values, education, and Kundali compatibility.</p>
        </div>

        {/* Grid or Profile Creation Gate */}
        {!currentUser?.profileCompleted ? (
          <div style={{
            background: '#FFF',
            border: '1.5px solid var(--romantic-rose-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '60px 30px',
            textAlign: 'center',
            maxWidth: '650px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FFF0F3',
              border: '2px solid var(--romantic-rose-border)',
              color: 'var(--primary-burgundy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}>
              <Lock size={28} />
            </div>
            
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--primary-burgundy-dark)', marginBottom: '10px' }}>
              Create Your Profile to View Matches
            </h3>
            
            <p style={{ margin: '0 auto 24px auto', fontSize: '0.90rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              Personalized and Kundali-matched profiles are curated based on your preferences. Complete your profile to view 100% verified matches.
            </p>

            <button 
              onClick={onOpenCreateProfile} 
              className="btn-burgundy"
              style={{ padding: '13px 32px', fontSize: '0.95rem' }}
            >
              <span>Create Your Profile Now</span>
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1.1rem', color: 'var(--primary-burgundy)' }}>
            <Sparkles size={24} className="spin-animation inline mr-2" />
            Loading your matches...
          </div>
        ) : profiles.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#FFF', padding: '60px 20px', borderRadius: 'var(--radius-lg)', maxWidth: '600px', margin: '0 auto' }}>
            <Users size={48} color="#780E2F" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#780E2F' }}>No Matches Found Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>We are continually adding verified profiles. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {profiles.map((profile) => {
              const photoUrl = (typeof profile.image === 'string' && profile.image.trim()) || 
                               (typeof profile.profileImage === 'string' && profile.profileImage.trim()) || 
                               null;
              const profileId = profile.id || profile.memberId;
              const isFavorited = shortlistedIds && typeof shortlistedIds.has === 'function' ? shortlistedIds.has(profileId) : false;

              return (
                <div className="profile-card" key={profileId}>
                  <div className="profile-img-container" style={{ position: 'relative' }}>
                    {/* Badge */}
                    <div className="profile-badge-top-left" style={{ display: 'flex', gap: '6px' }}>
                      <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                        <ShieldCheck size={12} /> Verified
                      </span>
                    </div>

                    {/* Shortlist Heart Button */}
                    <button 
                      className={`profile-shortlist-btn ${isFavorited ? 'favorited' : ''}`}
                      onClick={() => onToggleShortlist && onToggleShortlist(profileId)}
                      title={isFavorited ? 'Remove from shortlist' : 'Shortlist profile'}
                      aria-label="Shortlist profile"
                    >
                      <Heart size={18} fill={isFavorited ? 'var(--status-heart)' : 'none'} />
                    </button>

                    {/* Image or Fallback Avatar */}
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt={profile.name || 'Candidate Profile'} 
                        className="profile-img" 
                        loading="lazy" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    <div 
                      className="profile-img-placeholder"
                      style={{
                        display: photoUrl ? 'none' : 'flex',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #780E2F 0%, #9E1B43 100%)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF'
                      }}
                    >
                      <User size={56} color="#FFFFFF" />
                    </div>
                  </div>

                  {/* Profile Info Details */}
                  <div className="profile-info" style={{ padding: '16px' }}>
                    <div className="profile-name-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <h4 className="profile-name" style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                        {profile.name || 'Candidate Profile'}
                      </h4>
                      <CheckCircle2 size={15} className="profile-verified-check" color="#10B981" />
                    </div>

                    <div className="profile-meta" style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: '6px' }}>
                      {[profile.age ? `${profile.age} yrs` : null, profile.height, profile.religion, profile.caste].filter(Boolean).join(' • ')}
                    </div>

                    <div className="profile-profession" style={{ fontSize: '0.84rem', fontWeight: 600, color: '#780E2F', marginBottom: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {profile.profession || profile.education || 'Professional'}
                    </div>

                    {/* Card Action Buttons */}
                    <div className="profile-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                      <button 
                        onClick={() => onSelectProfile && onSelectProfile(profile)} 
                        className="profile-btn-view"
                        style={{ cursor: 'pointer' }}
                      >
                        View Profile
                      </button>

                      <button 
                        onClick={() => onSendInterest && onSendInterest(profile)} 
                        className="profile-btn-connect"
                        style={{ cursor: 'pointer' }}
                      >
                        <Send size={13} style={{ marginRight: '4px' }} /> Connect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

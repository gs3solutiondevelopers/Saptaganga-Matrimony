import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Heart, Send, Users, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function MatchesPage({
  onSelectProfile,
  onSendInterest,
  onToggleShortlist,
  shortlistedIds,
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
        let list = res.data;
        // Automatic opposite gender matchmaking filtering
        if (currentUser?.gender) {
          const oppositeGender = currentUser.gender.toLowerCase() === 'male' ? 'female' : 'male';
          const genderMatched = list.filter(p => p.gender?.toLowerCase() === oppositeGender);
          if (genderMatched.length > 0) {
            list = genderMatched;
          }
        }
        setProfiles(list);
      }
      setLoading(false);
    }
    loadMatches();
  }, [currentUser?.profileCompleted, currentUser?.gender]);

  return (
    <div style={{ background: '#FFF8FA', minHeight: '80vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="section-subtitle">AI & Astrology Powered</span>
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
          <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading your matches...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {profiles.map((profile) => {
              return (
                <div className="profile-card" key={profile.id}>
                  <div className="profile-img-container">
                    <img src={profile.image} alt={profile.name} className="profile-img" loading="lazy" />
                  </div>

                  {/* Profile Action */}
                  <div className="profile-info" style={{ padding: '14px 16px 16px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button 
                      onClick={() => onSelectProfile(profile)} 
                      className="profile-btn-view"
                      style={{ 
                        width: '100%', 
                        maxWidth: '180px',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View Profile
                    </button>
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

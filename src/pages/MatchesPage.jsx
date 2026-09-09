import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Heart, Send, Users } from 'lucide-react';
import { api } from '../services/api';

export default function MatchesPage({
  onSelectProfile,
  onSendInterest,
  onToggleShortlist,
  shortlistedIds
}) {
  const [activeTab, setActiveTab] = useState('daily');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'daily', label: '🌟 Daily Recommendations' },
    { id: 'mutual', label: '🤝 Mutual Matches (95%+ Compatibility)' },
    { id: 'doctors', label: '🩺 Doctors & Medical' },
    { id: 'tech', label: '💻 Engineers & Tech' },
    { id: 'brides', label: '👰 Verified Brides' },
    { id: 'grooms', label: '🤵 Verified Grooms' }
  ];

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      let filterParam = {};
      if (activeTab === 'doctors') filterParam = { category: 'doctors' };
      else if (activeTab === 'tech') filterParam = { category: 'tech' };
      else if (activeTab === 'brides') filterParam = { category: 'brides' };
      else if (activeTab === 'grooms') filterParam = { category: 'grooms' };

      const res = await api.getProfiles(filterParam);
      if (res.success) {
        setProfiles(res.data);
      }
      setLoading(false);
    }
    loadMatches();
  }, [activeTab]);

  return (
    <div style={{ background: '#FFF8FA', minHeight: '80vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="section-subtitle">AI & Astrology Powered</span>
          <h1 className="section-title">Your Personalized Matches</h1>
          <p className="section-desc">Handpicked profiles curated to match your cultural values, education, and Kundali compatibility.</p>
        </div>

        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`profile-filter-tab ${activeTab === t.id ? 'active' : ''}`}
              style={{ fontSize: '0.9rem', padding: '10px 20px' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading your matches...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {profiles.map((profile, idx) => {
              const isFavorited = shortlistedIds.has(profile.id);
              const matchPercent = 98 - idx * 3;

              return (
                <div className="profile-card" key={profile.id}>
                  <div className="profile-img-container">
                    <img src={profile.image} alt={profile.name} className="profile-img" />
                    
                    {/* Match Score Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(115, 15, 45, 0.9)',
                      backdropFilter: 'blur(6px)',
                      color: '#ECCB85',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Sparkles size={12} />
                      <span>{matchPercent}% Match</span>
                    </div>

                    <button 
                      className={`profile-shortlist-btn ${isFavorited ? 'favorited' : ''}`}
                      onClick={() => onToggleShortlist(profile)}
                    >
                      <Heart size={18} fill={isFavorited ? "#E11D48" : "none"} color={isFavorited ? "#E11D48" : "currentColor"} />
                    </button>
                  </div>

                  <div className="profile-info">
                    <div className="profile-name-row">
                      <h3 className="profile-name">{profile.name}</h3>
                      {profile.verified && <CheckCircle2 size={16} fill="#10B981" color="#FFF" />}
                    </div>

                    <div className="profile-meta">{profile.age} yrs • {profile.city} • {profile.religion} ({profile.caste})</div>
                    <div className="profile-profession">{profile.profession}</div>

                    <div className="profile-actions">
                      <button onClick={() => onSelectProfile(profile)} className="profile-btn-view">View Details</button>
                      <button onClick={() => onSendInterest(profile)} className="profile-btn-connect">
                        <Send size={13} />
                        <span>Connect</span>
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

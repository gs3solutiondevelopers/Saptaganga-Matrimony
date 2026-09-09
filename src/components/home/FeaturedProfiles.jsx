import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Heart, 
  Send, 
  Eye, 
  Sparkles, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function FeaturedProfiles({ 
  profiles = [], 
  onSelectProfile, 
  onSendInterest, 
  onToggleShortlist, 
  shortlistedIds = new Set(),
  activeCategory = 'all',
  onCategoryChange
}) {
  const categories = [
    { id: 'all', label: 'All Matches' },
    { id: 'brides', label: 'Brides (পাত্রী)' },
    { id: 'grooms', label: 'Grooms (পাত্র)' },
    { id: 'doctors', label: 'Doctors & Medical' },
    { id: 'tech', label: 'Engineers & Tech' }
  ];

  return (
    <section className="profiles-section section-padding" id="featured">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">Verified Members</span>
          <h2 className="section-title">Featured Profiles</h2>
          <p className="section-desc">
            Explore 100% verified brides and grooms tailored for compatibility and family values.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="profiles-filter-bar">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`profile-filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Profiles Grid */}
        <div className="profiles-grid">
          {profiles.map(profile => {
            const isFavorited = shortlistedIds.has(profile.id);

            return (
              <div className="profile-card" key={profile.id}>
                
                {/* Photo & Top Badges */}
                <div className="profile-img-container">
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    className="profile-img"
                    loading="lazy"
                  />
                  
                  {/* Online Badge */}
                  {profile.online && (
                    <div className="profile-badge-top-left">
                      <span className="badge-online">Online</span>
                    </div>
                  )}

                  {/* Shortlist Heart Button */}
                  <button 
                    className={`profile-shortlist-btn ${isFavorited ? 'favorited' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleShortlist(profile);
                    }}
                    title={isFavorited ? "Remove from Shortlist" : "Add to Shortlist"}
                    aria-label="Shortlist profile"
                  >
                    <Heart 
                      size={18} 
                      fill={isFavorited ? "#E11D48" : "none"} 
                      color={isFavorited ? "#E11D48" : "currentColor"} 
                    />
                  </button>
                </div>

                {/* Profile Information */}
                <div className="profile-info">
                  <div className="profile-name-row">
                    <h3 className="profile-name">{profile.name}</h3>
                    {profile.verified && (
                      <CheckCircle2 
                        size={16} 
                        className="profile-verified-check" 
                        fill="#10B981" 
                        color="#FFF" 
                      />
                    )}
                  </div>

                  <div className="profile-meta">
                    {profile.age} yrs, {profile.city} • {profile.motherTongue}
                  </div>

                  <div className="profile-profession" title={profile.profession}>
                    {profile.profession}
                  </div>

                  {/* Action Buttons */}
                  <div className="profile-actions">
                    <button 
                      onClick={() => onSelectProfile(profile)} 
                      className="profile-btn-view"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => onSendInterest(profile)} 
                      className="profile-btn-connect"
                    >
                      <Send size={13} />
                      <span>Connect</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* View All Matches Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => onCategoryChange('all')}
            className="btn-outline-burgundy" 
            style={{ padding: '12px 32px' }}
          >
            <span>View All Verified Profiles</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}

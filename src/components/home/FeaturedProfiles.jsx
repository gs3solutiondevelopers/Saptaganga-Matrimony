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
    { id: 'brides', label: 'Brides' },
    { id: 'grooms', label: 'Grooms' }
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
                
                {/* Photo */}
                <div 
                  className="profile-img-container" 
                  onClick={() => onSelectProfile(profile)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    className="profile-img"
                    loading="lazy"
                  />
                </div>

                {/* Profile Information & Action */}
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

        {/* View All Matches Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => onCategoryChange('all')}
            className="btn-outline-burgundy" 
            style={{ padding: '12px 34px' }}
          >
            <span>View All Verified Profiles</span>
          </button>
        </div>

      </div>
    </section>
  );
}

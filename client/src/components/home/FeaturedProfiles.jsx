import React, { useEffect, useRef } from 'react';

export default function FeaturedProfiles({ 
  profiles = [], 
  onSelectProfile, 
  activeCategory = 'all',
  onCategoryChange
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const offsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const categories = [
    { id: 'all', label: 'All Matches' },
    { id: 'brides', label: 'Brides' },
    { id: 'grooms', label: 'Grooms' }
  ];

  // Repeat profiles 4 times for a seamless, continuous, infinite gliding stream
  const repeatedProfiles = profiles.length > 0 
    ? [...profiles, ...profiles, ...profiles, ...profiles] 
    : [];

  useEffect(() => {
    offsetRef.current = 0;
    const cardWidth = 250;
    const gap = 24;
    const singleSetWidth = profiles.length * (cardWidth + gap);

    const animate = () => {
      if (trackRef.current && containerRef.current && singleSetWidth > 0) {
        if (!isPausedRef.current) {
          offsetRef.current += 0.85; // smooth constant gliding velocity
          if (offsetRef.current >= singleSetWidth) {
            offsetRef.current -= singleSetWidth;
          }
          trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        }

        // Dynamically scale each card depending on its real-time distance to the container center
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        const cardElements = trackRef.current.children;
        const centerThreshold = 300; // Radius around the center where cards expand

        for (let i = 0; i < cardElements.length; i++) {
          const card = cardElements[i];
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(containerCenter - cardCenter);

          if (distance < centerThreshold) {
            const ratio = distance / centerThreshold; // 0 at exact center, 1 at edge
            const scale = 1.15 - (ratio * 0.27); // 1.15 down to 0.88
            const opacity = 1 - (ratio * 0.18);  // 1.0 down to 0.82
            const zIndex = Math.round((1 - ratio) * 10) + 1;

            card.style.transform = `scale(${scale.toFixed(3)})`;
            card.style.opacity = opacity.toFixed(3);
            card.style.zIndex = zIndex;

            if (distance < 90) {
              card.classList.add('is-active-center');
            } else {
              card.classList.remove('is-active-center');
            }
          } else {
            card.style.transform = 'scale(0.88)';
            card.style.opacity = '0.78';
            card.style.zIndex = '1';
            card.classList.remove('is-active-center');
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [profiles.length, activeCategory]);

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

        {/* Continuous Flow Carousel with Dynamic Center Scaling */}
        <div 
          className="profiles-continuous-wrapper"
          ref={containerRef}
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
        >
          <div className="profiles-continuous-track" ref={trackRef}>
            {repeatedProfiles.map((profile, idx) => (
              <div 
                className="profile-continuous-card" 
                key={`${profile.id}-${idx}`}
                onClick={() => {
                  if (onSelectProfile) onSelectProfile(profile);
                }}
              >
                
                {/* Photo Container */}
                <div className="profile-img-container">
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    className="profile-img"
                    loading="lazy"
                  />
                </div>

                {/* Profile Action */}
                <div className="profile-info" style={{ padding: '14px 16px 16px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectProfile) onSelectProfile(profile);
                    }} 
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
            ))}
          </div>
        </div>

        {/* View All Matches Button */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
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

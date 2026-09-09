import React from 'react';
import { 
  Users, 
  Heart, 
  ShieldCheck, 
  Headphones, 
  ArrowRight 
} from 'lucide-react';

export default function HeroBanner({ onStartJourney, onExploreMatches }) {
  const handleExploreMatches = () => {
    if (onExploreMatches) {
      onExploreMatches();
    } else {
      const el = document.getElementById('search-finder') || 
                 document.querySelector('.quick-search-section') || 
                 document.querySelector('.featured-profiles-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="saptaganga-hero-panoramic" id="home">
      
      {/* Background Image Container with Right-Aligned Couple */}
      <div className="hero-panoramic-bg" />
      <div className="hero-panoramic-overlay" />

      <div className="container hero-panoramic-container">
        
        {/* Left Column: Heading, Stats & CTA */}
        <div className="hero-left-box">

          {/* Sub-tagline */}
          <div className="hero-subtagline">
            <span>Traditional Values • Modern Connections</span>
          </div>

          {/* Main Headline with Wedding Moment Ligature Typography & Heart Ribbon Image */}
          <h1 className="hero-main-title">
            <div className="hero-title-top-row">
              <span className="hero-title-wedding-top">Find Your</span>
              <img 
                src="/heart-ribbon.svg" 
                alt="Heart Ribbon" 
                className="hero-heart-ribbon-img" 
              />
            </div>
            <span className="hero-title-wedding-main">Perfect Partner</span>
          </h1>

          {/* Subtext Paragraph */}
          <p className="hero-subtext">
            Join Saptaganga Matrimony and take the first step towards a happier tomorrow.
          </p>

          {/* Pill CTA Buttons (Top) */}
          <div className="hero-cta-pill-row">
            <button onClick={onStartJourney} className="hero-btn-pill-primary">
              <span>Start Your Journey</span>
              <ArrowRight size={17} />
            </button>

            <button onClick={handleExploreMatches} className="hero-btn-pill-outline">
              <span>Explore Matches</span>
            </button>
          </div>

          {/* 4 Circular Metrics Badges with Vertical Dividers (Bottom) */}
          <div className="hero-metrics-strip-divided">
            
            {/* Metric 1 */}
            <div className="hero-metric-item">
              <div className="hero-metric-icon-circle">
                <Users size={18} />
              </div>
              <span className="hero-metric-val">2M+</span>
              <span className="hero-metric-lbl">Trusted Members</span>
            </div>

            <div className="hero-metric-divider" />

            {/* Metric 2 */}
            <div className="hero-metric-item">
              <div className="hero-metric-icon-circle">
                <Heart size={18} />
              </div>
              <span className="hero-metric-val">500K+</span>
              <span className="hero-metric-lbl">Successful Matches</span>
            </div>

            <div className="hero-metric-divider" />

            {/* Metric 3 */}
            <div className="hero-metric-item">
              <div className="hero-metric-icon-circle">
                <ShieldCheck size={18} />
              </div>
              <span className="hero-metric-val">100%</span>
              <span className="hero-metric-lbl">Verified Profiles</span>
            </div>

            <div className="hero-metric-divider" />

            {/* Metric 4 */}
            <div className="hero-metric-item">
              <div className="hero-metric-icon-circle">
                <Headphones size={18} />
              </div>
              <span className="hero-metric-val">24/7</span>
              <span className="hero-metric-lbl">Dedicated Support</span>
            </div>

          </div>

        </div>

        {/* Right Side Visual Showcase: Couple Photo & Royal Ornate Rings Badge */}
        <div className="hero-right-box">
          <div className="hero-couple-showcase-frame">
            <img 
              src="/hero.png" 
              alt="Saptaganga Happy Wedding Couple" 
              className="hero-couple-main-img" 
            />

            {/* Floating Luxury Royal Ornate Rings Badge */}
            <div className="hero-royal-rings-badge">
              <div className="badge-corner-flourish top-left">✦</div>
              <div className="badge-corner-flourish top-right">✦</div>
              <div className="badge-corner-flourish bottom-left">✦</div>
              <div className="badge-corner-flourish bottom-right">✦</div>

              <div className="royal-rings-circle">
                <svg viewBox="0 0 48 48" width="30" height="30" fill="none" stroke="#ECCB85" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="20" cy="27" r="10.5" />
                  <circle cx="28" cy="27" r="10.5" />
                  <path d="M 25 15 L 28 9 L 31 15 Z" fill="#ECCB85" stroke="none" />
                  <path d="M 28 6 L 28 9" stroke="#ECCB85" strokeWidth="1.8" />
                  <circle cx="28" cy="9" r="1.2" fill="#FFF" />
                  <path d="M 22 27 C 22 24.5 26 24.5 26 27" stroke="#ECCB85" strokeWidth="2.2" />
                </svg>
              </div>

              <div className="royal-rings-text">
                <span className="royal-rings-title">More Than Matches</span>
                <span className="royal-rings-subtitle">We Create Happy Stories ♡</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

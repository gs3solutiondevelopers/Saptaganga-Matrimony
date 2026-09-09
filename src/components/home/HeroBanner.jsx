import React from 'react';
import { 
  Users, 
  Heart, 
  ShieldCheck, 
  Headphones, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

export default function HeroBanner({ onStartJourney }) {
  return (
    <section className="hero-wrapper" id="home">
      {/* Decorative River / Sanskrit Watermark */}
      <div className="hero-watermark">सप्तगङ्गा</div>

      <div className="container">
        <div className="hero-grid">
          
          {/* Left Column: Heading, Slogans, Metrics & CTA */}
          <div className="hero-content">
            
            {/* Tagline Badge */}
            <div className="hero-badge-container">
              <Sparkles size={15} style={{ color: 'var(--accent-gold)' }} />
              <span className="hero-badge-text">Traditional Values. Modern Connections.</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              Find Your <br />
              <span>Perfect Partner</span>
            </h1>

            {/* Subtext */}
            <p className="hero-description">
              Join <strong>Saptaganga Matrimony</strong> and take the first step towards a happier tomorrow. 
              Because every soul deserves a sacred, lifelong bond.
            </p>

            {/* 4 Trust Metrics Row (Exact Match to Design) */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <div className="hero-stat-icon-wrapper">
                  <Users size={18} />
                </div>
                <span className="hero-stat-value">2M+</span>
                <span className="hero-stat-label">Trusted Members</span>
              </div>

              <div className="hero-stat-item">
                <div className="hero-stat-icon-wrapper">
                  <Heart size={18} fill="var(--primary-burgundy)" />
                </div>
                <span className="hero-stat-value">500K+</span>
                <span className="hero-stat-label">Successful Matches</span>
              </div>

              <div className="hero-stat-item">
                <div className="hero-stat-icon-wrapper">
                  <ShieldCheck size={18} />
                </div>
                <span className="hero-stat-value">100%</span>
                <span className="hero-stat-label">Verified Profiles</span>
              </div>

              <div className="hero-stat-item">
                <div className="hero-stat-icon-wrapper">
                  <Headphones size={18} />
                </div>
                <span className="hero-stat-value">24/7</span>
                <span className="hero-stat-label">Dedicated Support</span>
              </div>
            </div>

            {/* CTA and Calligraphy Accent */}
            <div className="hero-cta-wrapper">
              <button 
                onClick={onStartJourney} 
                className="btn-burgundy" 
                style={{ padding: '15px 36px', fontSize: '1.05rem' }}
              >
                <span>Start Your Journey</span>
                <ArrowRight size={18} />
              </button>

              <div className="hero-calligraphy-note">
                <span>Same Roots</span>
                Brighter Tomorrows ♡
              </div>
            </div>

          </div>

          {/* Right Column: Traditional Royal Couple Banner & Floating Badges */}
          <div className="hero-visual-col">
            
            {/* Floating Top-Right Hindi Quote Badge */}
            <div className="floating-hindi-badge">
              <div className="floating-hindi-text">
                सात नदियाँ<br />
                एक बंधन<br />
                सदा के लिए ♡
              </div>
            </div>

            {/* Couple Image Card */}
            <div className="hero-image-card">
              <img 
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=900" 
                alt="Saptaganga Matrimony Royal Couple" 
                className="hero-couple-img"
              />

              {/* Bottom Lotus Overlay Badge */}
              <div className="floating-lotus-badge">
                {/* Lotus Motif Icon */}
                <svg className="lotus-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 4c2 3.5 5.5 6 9.5 6.5-2.5 3.5-6 5.5-9.5 9.5-3.5-4-7-6-9.5-9.5C6.5 10 10 7.5 12 4z" fill="rgba(201,150,53,0.3)" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <div>
                  <div className="floating-badge-text-title">More Than Matches</div>
                  <div className="floating-badge-text-sub">We Create Happy Stories</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

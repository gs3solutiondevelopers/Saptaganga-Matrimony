import React from 'react';
import { 
  Users, 
  Heart, 
  ShieldCheck, 
  Headphones, 
  ArrowRight 
} from 'lucide-react';

export default function HeroBanner({ onStartJourney }) {
  return (
    <section className="saptaganga-hero-panoramic" id="home">
      
      {/* Background Image Container with Right-Aligned Couple */}
      <div className="hero-panoramic-bg" />
      <div className="hero-panoramic-overlay" />

      <div className="container hero-panoramic-container">
        
        {/* Left Column: Official Logo, Heading, Stats & CTA */}
        <div className="hero-left-box">
          
          {/* Official Saptaganga Matrimony Logo */}
          <div className="hero-official-logo-box">
            <img 
              src="/logo.png" 
              alt="Saptaganga Matrimony - Seven Rivers. A Lifetime Together." 
              className="hero-official-logo-img" 
            />
          </div>

          {/* Sub-tagline */}
          <div className="hero-subtagline">
            <span className="hero-subtagline-accent">✦</span>
            <span>Traditional Values • Modern Connections</span>
            <span className="hero-subtagline-accent">✦</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-main-title">
            Find Your<br />
            <span className="hero-title-highlight">Perfect Partner</span>
          </h1>

          {/* Subtext Paragraph */}
          <p className="hero-subtext">
            Join Saptaganga Matrimony and take the first step towards a happier tomorrow.
          </p>

          {/* 4 Circular Metrics Badges in Horizontal Row */}
          <div className="hero-metrics-strip">
            
            {/* Metric 1 */}
            <div className="hero-metric-badge">
              <div className="hero-metric-icon-circle">
                <Users size={17} />
              </div>
              <div className="hero-metric-info">
                <span className="hero-metric-val">2M+</span>
                <span className="hero-metric-lbl">Trusted Members</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="hero-metric-badge">
              <div className="hero-metric-icon-circle">
                <Heart size={17} />
              </div>
              <div className="hero-metric-info">
                <span className="hero-metric-val">500K+</span>
                <span className="hero-metric-lbl">Successful Matches</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="hero-metric-badge">
              <div className="hero-metric-icon-circle">
                <ShieldCheck size={17} />
              </div>
              <div className="hero-metric-info">
                <span className="hero-metric-val">100%</span>
                <span className="hero-metric-lbl">Verified Profiles</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="hero-metric-badge">
              <div className="hero-metric-icon-circle">
                <Headphones size={17} />
              </div>
              <div className="hero-metric-info">
                <span className="hero-metric-val">24/7</span>
                <span className="hero-metric-lbl">Dedicated Support</span>
              </div>
            </div>

          </div>

          {/* CTA Button and Gold Calligraphy Note */}
          <div className="hero-cta-row">
            <button onClick={onStartJourney} className="hero-start-journey-btn">
              <span>Start Your Journey</span>
              <ArrowRight size={17} />
            </button>

            <div className="hero-handwritten-calligraphy">
              <span className="handwritten-line1">Same Roots</span>
              <span className="handwritten-line2">Brighter Tomorrows</span>
              <span className="handwritten-heart">♡</span>
            </div>
          </div>

        </div>

        {/* Right Side Overlays (Rendered over the background couple & ghat) */}
        <div className="hero-right-box">
          
          {/* Bottom Right: Luxury Royal Lotus Badge */}
          <div className="hero-royal-lotus-badge">
            <div className="royal-lotus-circle">
              {/* Detailed Sacred Golden Lotus SVG */}
              <svg viewBox="0 0 36 30" width="24" height="20" fill="none" stroke="#ECCB85" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2 C15 9 15 17 18 24 C21 17 21 9 18 2 Z" fill="rgba(236, 203, 133, 0.3)" />
                <path d="M17 10 C11 11 6 16 8 22 C12 22 15 19 17 16" />
                <path d="M16 4 C10 6 4 13 3 20 C8 20 13 16 16 12" />
                <path d="M19 10 C25 11 30 16 28 22 C24 22 21 19 19 16" />
                <path d="M20 4 C26 6 32 13 33 20 C28 20 23 16 20 12" />
                <path d="M10 24 Q 18 27 26 24" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="royal-lotus-text">
              <span className="royal-lotus-title">More Than Matches</span>
              <span className="royal-lotus-subtitle">We Create Happy Stories ♡</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

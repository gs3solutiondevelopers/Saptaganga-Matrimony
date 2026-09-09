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
            Traditional Values. Modern Connections.
          </div>

          {/* Main Headline */}
          <h1 className="hero-main-title">
            Find Your<br />
            <span>Perfect Partner</span>
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
          
          {/* Bottom Right: Maroon Brush Stroke Ribbon with Golden Lotus */}
          <div className="hero-maroon-ribbon-badge">
            <div className="ribbon-lotus-icon">
              {/* Golden Lotus Flower SVG */}
              <svg viewBox="0 0 40 30" width="36" height="26" fill="none" stroke="#ECCB85" strokeWidth="1.8">
                <path d="M20 3 C17 10 17 18 20 26 C23 18 23 10 20 3 Z" fill="rgba(236, 203, 133, 0.2)" />
                <path d="M19 12 C13 13 8 18 10 24 C14 24 17 21 19 18" />
                <path d="M18 6 C12 8 6 15 5 22 C10 22 15 18 18 14" />
                <path d="M21 12 C27 13 32 18 30 24 C26 24 23 21 21 18" />
                <path d="M22 6 C28 8 34 15 35 22 C30 22 25 18 22 14" />
                <path d="M12 26 Q 20 28 28 26" />
              </svg>
            </div>
            <div className="ribbon-text-content">
              <div className="ribbon-title">More Than Matches</div>
              <div className="ribbon-subtitle">We Create Happy Stories</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

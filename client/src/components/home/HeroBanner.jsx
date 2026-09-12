import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  ShieldCheck, 
  Headphones,
  ArrowRight 
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/hero-slide2.webp',
    alt: 'Saptaganga Happy Wedding Couple by the Ghats',
    bgPosition: 'right center',
    className: 'hero-slide-2'
  },
  {
    id: 2,
    image: '/imsge 2.webp',
    alt: 'Saptaganga Matrimony - Traditional Values, Modern Connections',
    bgPosition: 'right 66%',
    className: 'hero-slide-1'
  }
];

export default function HeroBanner({ onStartJourney, onRegisterClick, onOpenCreateProfile, onExploreMatches, currentUser }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    if (onOpenCreateProfile) {
      onOpenCreateProfile();
    } else if (onRegisterClick) {
      onRegisterClick();
    } else if (onStartJourney) {
      onStartJourney();
    }
  };

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
      
      {/* Dynamic Panoramic Background Carousel with 7s auto-transition */}
      <div className="hero-panoramic-bg-wrapper">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-panoramic-bg ${slide.className || ''} ${idx === activeSlide ? 'active' : ''}`}
            style={{ 
              backgroundImage: `url("${slide.image}")`,
              backgroundPosition: slide.bgPosition || 'right center'
            }}
            aria-hidden={idx !== activeSlide}
          />
        ))}
      </div>
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
            <button onClick={handleStart} className="hero-btn-pill-primary">
              <span>Start Your Journey</span>
              <ArrowRight size={15} />
            </button>

            <button onClick={handleExploreMatches} className="hero-btn-pill-outline">
              <span>Explore Matches</span>
            </button>
          </div>

          {/* 4 Circular Metrics Badges with Vertical Dividers (Desktop View) */}
          <div className="hero-metrics-strip-divided hero-metrics-desktop">
            
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
              src="/imsge 2.webp" 
              alt="Saptaganga Happy Wedding Couple" 
              className="hero-couple-main-img" 
            />

            {/* Floating Luxury Royal Ornate Rings Badge */}
            <div className="hero-royal-rings-badge">

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

        {/* 4 Circular Metrics Badges (Mobile & Tablet View - directly below couple photo showcase) */}
        <div className="hero-metrics-strip-divided hero-metrics-mobile">
          
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

      {/* Slide Indicator Navigation Dots */}
      <div className="hero-slide-indicators">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(idx)}
            className={`hero-slide-dot ${idx === activeSlide ? 'active' : ''}`}
            aria-label={`Go to slide ${idx + 1}`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

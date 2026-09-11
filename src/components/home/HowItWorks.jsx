import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, Search, HeartHandshake, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onGetStarted, onOpenCreateProfile, currentUser }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const stepList = [
    {
      num: "01",
      title: "Create Your Profile",
      desc: "Register for free & set up your verified profile with family values, photos and partner preferences.",
      icon: <UserPlus size={24} strokeWidth={2.2} />,
      colorClass: "step-theme-1",
      align: "left" // Capsule on Left, Step 01 on Right
    },
    {
      num: "02",
      title: "Search & Connect",
      desc: "Discover compatible verified matches by community, profession, horoscope and express interest.",
      icon: <Search size={24} strokeWidth={2.2} />,
      colorClass: "step-theme-2",
      align: "right" // Step 02 on Left, Capsule on Right
    },
    {
      num: "03",
      title: "Start a Lifetime Bond",
      desc: "Connect securely with verified families, initiate meaningful conversations and tie the knot.",
      icon: <HeartHandshake size={24} strokeWidth={2.2} />,
      colorClass: "step-theme-3",
      align: "left" // Capsule on Left, Step 03 on Right
    }
  ];

  const handleStepClick = (stepNum) => {
    const num = Number(stepNum);
    if (num === 1) {
      if (onOpenCreateProfile) {
        onOpenCreateProfile();
      } else if (onGetStarted) {
        onGetStarted();
      }
    } else if (num === 2) {
      const el = document.getElementById('search-finder') || 
                 document.querySelector('.quick-search-section') ||
                 document.querySelector('.featured-profiles-section') ||
                 document.querySelector('.profiles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (num === 3) {
      const el = document.getElementById('membership') || 
                 document.querySelector('.membership-section') ||
                 document.querySelector('.featured-profiles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    if (onOpenCreateProfile) {
      onOpenCreateProfile();
    } else if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <section 
      className={`how-it-works-section section-padding ${isVisible ? 'is-in-view' : ''}`} 
      id="how-it-works"
      ref={sectionRef}
    >
      <div className="container">
        
        {/* Section Header */}
        <div className={`section-header ${isVisible ? 'anim-fade-up' : ''}`}>
          <span className="section-subtitle">HOW IT WORKS</span>
          <h2 className="section-title">Find Your Match in 3 Simple Steps</h2>
        </div>

        {/* 2-Column Split Showcase Grid */}
        <div className="how-split-grid">
          
          {/* Left Column: Shaadi Image Visual Showcase */}
          <div className={`how-image-col ${isVisible ? 'anim-fade-right' : ''}`}>
            <div className="how-shaadi-card">
              <div className="how-shaadi-img-box">
                <img 
                  src="/shaadi-story.jpg" 
                  alt="Traditional Bengali Matrimony Wedding Couple" 
                  className="how-shaadi-img"
                  loading="eager"
                />
                <div className="how-shaadi-overlay"></div>
              </div>

              {/* Decorative Corner Glow */}
              <div className="how-shaadi-glow" aria-hidden="true"></div>
            </div>
          </div>

          {/* Right Column: S-Curve Zigzag Timeline Infographic */}
          <div className="how-steps-col">
            <div className="how-zigzag-timeline-wrapper">
              
              {/* SVG S-Curve Dotted Trail (Desktop & Tablet) */}
              <div className="how-zigzag-svg-box" aria-hidden="true">
                <svg 
                  className={`how-zigzag-svg ${isVisible ? 'curve-animated' : ''}`}
                  viewBox="0 0 480 314" 
                  fill="none" 
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="240" cy="10" r="4.5" fill="#780E2F" />
                  <path 
                    d="M 240 10 C 270 10, 330 30, 330 57 C 330 107, 150 107, 150 157 C 150 207, 330 207, 330 257 C 330 284, 270 304, 240 304" 
                    stroke="#D4AF37" 
                    strokeWidth="2.5" 
                    strokeDasharray="6 6" 
                    className="how-zigzag-trail"
                  />
                  <circle cx="240" cy="304" r="3.5" fill="#D4AF37" />
                </svg>
              </div>

              {/* 3 Zigzag Step Rows */}
              <div className="how-zigzag-rows-list">
                {stepList.map((item, idx) => (
                  <div 
                    key={item.num}
                    className={`how-zigzag-row ${item.align === 'left' ? 'row-capsule-left' : 'row-capsule-right'} ${item.colorClass} ${isVisible ? 'row-revealed' : ''}`}
                    style={{
                      transitionDelay: `${idx * 0.18 + 0.12}s`
                    }}
                    onClick={() => handleStepClick(item.num)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStepClick(item.num);
                      }
                    }}
                    title={`Click to explore Step ${item.num}: ${item.title}`}
                  >
                    
                    {/* Row 1 & 3: Capsule on Left, Step Indicator on Right */}
                    {item.align === 'left' ? (
                      <>
                        {/* Left: Compact 3D White Capsule with Right Pointer */}
                        <div className="how-zigzag-pill">
                          <div className="how-zigzag-pill-text">
                            <h4 className="how-zigzag-pill-title">{item.title}</h4>
                          </div>
                          <div className="how-zigzag-disk">
                            {item.icon}
                          </div>
                          <div className="how-zigzag-arrow"></div>
                        </div>

                        {/* Right: Target Ring Node + STEP Label */}
                        <div className="how-zigzag-indicator indicator-right">
                          <div className="how-zigzag-node-ring">
                            <div className="how-zigzag-node-core"></div>
                          </div>
                          <div className="how-zigzag-step-label">
                            <span className="how-zigzag-step-text">STEP</span>
                            <span className="how-zigzag-step-num">{item.num}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Left: STEP Label + Target Ring Node */}
                        <div className="how-zigzag-indicator indicator-left">
                          <div className="how-zigzag-step-label text-right">
                            <span className="how-zigzag-step-text">STEP</span>
                            <span className="how-zigzag-step-num">{item.num}</span>
                          </div>
                          <div className="how-zigzag-node-ring">
                            <div className="how-zigzag-node-core"></div>
                          </div>
                        </div>

                        {/* Right: Compact 3D White Capsule with Left Pointer */}
                        <div className="how-zigzag-pill">
                          <div className="how-zigzag-arrow"></div>
                          <div className="how-zigzag-disk">
                            {item.icon}
                          </div>
                          <div className="how-zigzag-pill-text">
                            <h4 className="how-zigzag-pill-title">{item.title}</h4>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* CTA Button Centered Below Both Columns */}
        <div className={`how-cta-row ${isVisible ? 'anim-fade-up' : ''}`} style={{ transitionDelay: '0.7s' }}>
          <button 
            onClick={handleCtaClick}
            className="btn-burgundy how-cta-button"
          >
            <span>Get Started Now</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}




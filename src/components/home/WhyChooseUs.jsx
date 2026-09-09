import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  MessageSquare, 
  Sparkles, 
  Quote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MOCK_STORIES } from '../../data/mockData';

export default function WhyChooseUs({ onRegisterClick }) {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  const features = [
    {
      icon: <ShieldCheck size={24} />,
      title: "100% Verified Profiles",
      desc: "All profiles are manually screened & ID-verified for maximum trust and safety."
    },
    {
      icon: <Users size={24} />,
      title: "Advanced Matchmaking",
      desc: "Our smart Kundali & preference algorithm pairs you with compatible life partners."
    },
    {
      icon: <Lock size={24} />,
      title: "Strict Privacy Controls",
      desc: "Full authority over who views your photos, phone number, and personal details."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Secure Communication",
      desc: "Chat, voice call, and connect in a private, encrypted environment."
    }
  ];

  const currentStory = MOCK_STORIES[activeStoryIdx];

  return (
    <section className="section-padding" id="stories" style={{ background: '#FFF' }}>
      <div className="container">
        
        <div className="why-choose-grid">
          
          {/* Left Column: Why Choose Saptaganga Features */}
          <div>
            <span className="section-subtitle">The Saptaganga Advantage</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '24px' }}>
              Why Choose Saptaganga?
            </h2>
            <p className="section-desc" style={{ textAlign: 'left', marginBottom: '32px' }}>
              We blend sacred cultural heritage with cutting-edge matchmaking technology to help families unite in lifelong happiness.
            </p>

            <div className="features-list">
              {features.map((feat, index) => (
                <div className="feature-box" key={index}>
                  <div className="feature-icon-box">
                    {feat.icon}
                  </div>
                  <h4 className="feature-title">{feat.title}</h4>
                  <p className="feature-desc">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Burgundy Success Story Card (Matching Design) */}
          <div>
            <div className="testimonial-card-burgundy">
              
              {/* Background Floral Art Decoration */}
              <svg className="testimonial-floral-bg" viewBox="0 0 200 200" fill="none" stroke="currentColor">
                <path d="M100 20 C60 50 40 80 40 120 C40 160 80 180 100 180 C120 180 160 160 160 120 C160 80 140 50 100 20 Z" strokeWidth="1.5" />
                <path d="M100 40 C75 65 60 90 60 120 C60 150 90 160 100 160 C110 160 140 150 140 120 C140 90 125 65 100 40 Z" strokeWidth="1.5" />
                <circle cx="100" cy="120" r="15" strokeWidth="1.5" />
              </svg>

              {/* Golden Quote Icon */}
              <div className="testimonial-quote-icon">“</div>

              {/* Testimonial Quote */}
              <p className="testimonial-quote-text">
                "{currentStory.story}"
              </p>

              {/* Couple Profile & Info */}
              <div className="testimonial-couple-info">
                <img 
                  src={currentStory.image} 
                  alt={currentStory.coupleNames} 
                  className="testimonial-couple-avatar" 
                />
                <div>
                  <div className="testimonial-names">{currentStory.coupleNames}</div>
                  <div className="testimonial-year">{currentStory.marriageYear} • {currentStory.location}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--accent-gold-light)', marginTop: '2px' }}>
                    ✨ {currentStory.highlight}
                  </div>
                </div>
              </div>

              {/* Slider Pagination Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <div className="testimonial-nav-dots">
                  {MOCK_STORIES.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`test-dot ${idx === activeStoryIdx ? 'active' : ''}`}
                      onClick={() => setActiveStoryIdx(idx)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setActiveStoryIdx((prev) => (prev === 0 ? MOCK_STORIES.length - 1 : prev - 1))}
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#FFF', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveStoryIdx((prev) => (prev === MOCK_STORIES.length - 1 ? 0 : prev + 1))}
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#FFF', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

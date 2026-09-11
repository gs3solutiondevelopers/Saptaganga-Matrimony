import React from 'react';
import { UserPlus, Search, HeartHandshake, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../../data/mockData';

export default function HowItWorks({ onGetStarted, onOpenCreateProfile, currentUser }) {
  const icons = [
    <UserPlus size={36} key="1" />,
    <Search size={36} key="2" />,
    <HeartHandshake size={36} key="3" />
  ];

  const handleStepClick = (stepNum) => {
    const num = Number(stepNum);
    if (num === 1 || stepNum === '1' || stepNum === 1) {
      if (onOpenCreateProfile) {
        onOpenCreateProfile();
      } else if (onGetStarted) {
        onGetStarted();
      }
    } else if (num === 2 || stepNum === '2') {
      const el = document.getElementById('search-finder') || 
                 document.querySelector('.quick-search-section') ||
                 document.querySelector('.featured-profiles-section') ||
                 document.querySelector('.profiles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (num === 3 || stepNum === '3') {
      const el = document.getElementById('membership') || 
                 document.querySelector('.membership-section') ||
                 document.querySelector('.featured-profiles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="how-it-works-section section-padding" id="how-it-works">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <span className="section-subtitle">How It Works</span>
          <h2 className="section-title">Find Your Match in 3 Simple Steps</h2>
        </div>

        {/* 3 Step Cards with Interactive Clicks */}
        <div className="steps-container">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div 
              className="step-card" 
              key={step.step}
              onClick={() => handleStepClick(step.step)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              title={step.step === 1 ? "Click to Create Your Matrimony Profile" : undefined}
            >
              <div className="step-number-badge">{step.step}</div>
              <div className="step-icon-circle">
                {icons[idx]}
              </div>
              <h3 className="step-title" style={{ margin: '0' }}>{step.title}</h3>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '45px' }}>
          <button 
            onClick={() => {
              if (onOpenCreateProfile) {
                onOpenCreateProfile();
              } else if (onGetStarted) {
                onGetStarted();
              }
            }}
            className="btn-burgundy" 
            style={{ padding: '14px 36px', fontSize: '1rem' }}
          >
            <span>Get Started Now</span>
          </button>
        </div>

      </div>
    </section>
  );
}

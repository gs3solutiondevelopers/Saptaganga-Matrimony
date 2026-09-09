import React from 'react';
import { UserPlus, Search, HeartHandshake, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../../data/mockData';

export default function HowItWorks({ onGetStarted }) {
  const icons = [
    <UserPlus size={36} key="1" />,
    <Search size={36} key="2" />,
    <HeartHandshake size={36} key="3" />
  ];

  return (
    <section className="how-it-works-section section-padding" id="how-it-works">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">How It Works</span>
          <h2 className="section-title">Find Your Match in 3 Simple Steps</h2>
          <p className="section-desc">
            Your sacred journey to a lifetime of happiness begins with three easy and verified steps.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="steps-container">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div className="step-card" key={step.step}>
              <div className="step-number-badge">{step.step}</div>
              <div className="step-icon-circle">
                {icons[idx]}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '45px' }}>
          <button 
            onClick={onGetStarted}
            className="btn-burgundy" 
            style={{ padding: '14px 34px', fontSize: '1rem' }}
          >
            <span>Get Started Now</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { Check, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../../data/mockData';

export default function MembershipPlans({ onSelectPlan }) {
  return (
    <section className="section-padding" id="membership" style={{ background: 'linear-gradient(180deg, #FFF8FA 0%, #FFF 100%)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">Transparent Pricing</span>
          <h2 className="section-title">Choose Your Perfect Plan</h2>
          <p className="section-desc">
            Upgrade to premium to unlock direct contact numbers, unlimited messaging, and priority matchmaking support.
          </p>
        </div>

        {/* Membership Plans Grid */}
        <div className="membership-grid">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`plan-card ${plan.isPopular ? 'featured' : ''}`}
            >
              {plan.isPopular && (
                <div className="plan-popular-tag">
                  ★ {plan.badge}
                </div>
              )}

              <h3 className="plan-name">{plan.name}</h3>

              <div className="plan-price-row">
                <span className="plan-price">{plan.price}</span>
                <span className="plan-duration">/ {plan.duration}</span>
              </div>

              <ul className="plan-features-list">
                {plan.features.map((feature, idx) => (
                  <li className="plan-feature-item" key={idx}>
                    <Check size={16} className="feature-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onSelectPlan(plan)}
                className={plan.btnClass}
                style={{ width: '100%' }}
              >
                <span>{plan.cta}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Money-Back Guarantee Assurance */}
        <div style={{
          maxWidth: '680px',
          margin: '40px auto 0 auto',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          background: '#FFF',
          border: '1px solid var(--romantic-rose-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Shield size={24} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <strong>100% Safe & Secure Payments:</strong> All transactions are protected with 256-bit bank-grade encryption. Instant activation upon checkout.
          </div>
        </div>

      </div>
    </section>
  );
}

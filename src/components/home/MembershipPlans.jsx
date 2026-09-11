import React from 'react';
import { Check, Shield } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../../data/mockData';

export default function MembershipPlans({ onSelectPlan, onOpenAuth }) {
  return (
    <section className="membership-section section-padding" id="membership">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header anim-fade-up">
          <span className="section-subtitle">MEMBERSHIP PLANS</span>
          <h2 className="section-title">Transparent & Affordable Plans</h2>
          <p className="section-description">
            Choose the best plan to connect directly with your soulmate and their family.
          </p>
        </div>

        {/* Clean Modern 3-Column Plan Cards */}
        <div className="membership-clean-grid">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`plan-clean-card ${plan.isPopular ? 'is-popular-plan' : ''}`}
            >
              {/* Top Capsule Header Box */}
              <div className="plan-clean-header-box">
                <div className="plan-clean-badge-row">
                  <span className="plan-clean-badge">{plan.name}</span>
                </div>

                <div className="plan-clean-price-row">
                  <span className="plan-clean-price">{plan.price}</span>
                  <span className="plan-clean-duration">{plan.duration}</span>
                </div>

                <p className="plan-clean-tagline">{plan.tagline}</p>

                <button 
                  onClick={() => onSelectPlan(plan)}
                  className={plan.isPopular ? "plan-clean-cta-popular" : "plan-clean-cta"}
                >
                  <span>{plan.cta}</span>
                </button>
              </div>

              {/* Bottom Features Checklist */}
              <ul className="plan-clean-features">
                {plan.features.map((feature, idx) => (
                  <li className="plan-clean-feature-item" key={idx}>
                    <Check size={16} strokeWidth={2.4} className="plan-clean-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Money-Back Guarantee Assurance */}
        <div style={{
          maxWidth: '680px',
          margin: '44px auto 0 auto',
          padding: '16px 24px',
          borderRadius: '20px',
          background: '#FFF',
          border: '1px solid #EAE5E3',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <Shield size={24} style={{ color: '#D4AF37', flexShrink: 0 }} />
          <div style={{ fontSize: '0.84rem', color: '#64748B' }}>
            <strong style={{ color: '#1E293B' }}>100% Safe & Secure Payments:</strong> All transactions are protected with 256-bit bank-grade encryption. Instant activation upon checkout.
          </div>
        </div>

      </div>
    </section>
  );
}


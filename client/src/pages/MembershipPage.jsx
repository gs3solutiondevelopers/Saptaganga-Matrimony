import React from 'react';
import { Check, X, Shield, Sparkles, HelpCircle, Phone } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/mockData';

export default function MembershipPage({ onSelectPlan, onOpenAuth }) {
  const faqs = [
    {
      q: "How does contact unlocking work?",
      a: "Once you upgrade to Gold or Diamond, you can directly click 'Unlock Contact' on any profile to view their verified phone number and family contact details."
    },
    {
      q: "Can I get personalized assistance with my matchmaking?",
      a: "Yes! Our Diamond and Platinum plans include a dedicated Relationship Advisor who shortlists and connects with prospective families on your behalf."
    },
    {
      q: "Is Kundali / Horoscope matching included?",
      a: "Yes, Gold, Diamond, and Platinum tiers include automated 36 Guna Milan analysis and detailed Vedic astrological reports."
    },
    {
      q: "Are payments safe and refundable?",
      a: "All transactions are secured with 256-bit bank encryption. Platinum plans include our 100% Match or Refund guarantee."
    }
  ];

  return (
    <div style={{ background: '#FAF7F5', padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-subtitle">Membership Plans</span>
          <h1 className="section-title">Upgrade to Connect Directly</h1>
          <p className="section-desc">Choose a plan that fits your family's journey. Unlock contacts, initiate chats, and boost your profile visibility.</p>
        </div>

        {/* Clean Plans Grid */}
        <div className="membership-clean-grid" style={{ marginBottom: '60px' }}>
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

        {/* Feature Comparison Table */}
        <div style={{
          background: '#FFF',
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          border: '1px solid var(--romantic-rose-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '50px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--primary-burgundy-dark)', marginBottom: '24px', textAlign: 'center' }}>
            Feature Comparison
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--romantic-rose-border)', background: 'var(--romantic-rose)' }}>
                  <th style={{ padding: '14px 16px' }}>Features</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Classic Free</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--primary-burgundy)' }}>Gold Advantage</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Diamond Royale</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Platinum Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>Browse Profiles</td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>Verified Contact Numbers</td>
                  <td style={{ textAlign: 'center', color: '#9CA3AF' }}>—</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>35 Contacts</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>80 Contacts</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-gold-dark)' }}>Unlimited</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>Direct Live Chat</td>
                  <td style={{ textAlign: 'center', color: '#9CA3AF' }}>—</td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>Personal Relationship Manager</td>
                  <td style={{ textAlign: 'center', color: '#9CA3AF' }}>—</td>
                  <td style={{ textAlign: 'center', color: '#9CA3AF' }}>—</td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>Kundali & Astrology Report</td>
                  <td style={{ textAlign: 'center', color: '#9CA3AF' }}>Basic</td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} color="#10B981" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--primary-burgundy-dark)', marginBottom: '24px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ background: '#FFF', padding: '20px 24px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

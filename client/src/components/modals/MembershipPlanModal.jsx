import React from 'react';
import { X, Check, ShieldCheck, Crown } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../../data/mockData';

export default function MembershipPlanModal({
  isOpen,
  onClose,
  onSelectPlan,
  targetProfile = null
}) {
  if (!isOpen) return null;

  // Filter premium paid plans
  const premiumPlans = MEMBERSHIP_PLANS.filter(p => p.id !== 'free');

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 12000, padding: '16px' }}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          borderRadius: '20px',
          overflowY: 'auto',
          background: '#FFF8FA',
          padding: '24px 28px 32px'
        }}
      >
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FEF3C7',
              color: '#B45309',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '6px'
            }}>
              <Crown size={14} />
              <span>Premium Membership Required</span>
            </div>
            
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--primary-burgundy-dark)',
              margin: '2px 0 4px'
            }}>
              {targetProfile ? `Connect with ${targetProfile.name}` : 'Upgrade to Send Unlimited Interests'}
            </h2>
            
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              margin: 0
            }}>
              Subscribe to unlock direct contact numbers, instant interest notifications & VIP matchmaking support.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4B5563',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Plans Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '18px',
          marginBottom: '24px'
        }}>
          {premiumPlans.map((plan) => {
            const isFeatured = plan.isPopular || plan.id === 'gold';
            return (
              <div
                key={plan.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: isFeatured ? '2.5px solid var(--primary-burgundy)' : '1px solid #E5E7EB',
                  boxShadow: isFeatured ? '0 8px 24px rgba(115, 15, 45, 0.12)' : '0 2px 10px rgba(0,0,0,0.04)',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '16px',
                    background: isFeatured ? 'var(--primary-burgundy)' : '#F59E0B',
                    color: '#FFFFFF',
                    padding: '3px 12px',
                    borderRadius: '12px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px'
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#111827',
                    marginBottom: '8px'
                  }}>
                    {plan.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-burgundy)' }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 500 }}>
                      / {plan.duration}
                    </span>
                  </div>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 20px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.85rem',
                        color: '#374151',
                        lineHeight: '1.4'
                      }}>
                        <span style={{
                          color: '#10B981',
                          background: '#ECFDF5',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '1px'
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPlan && onSelectPlan(plan)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '24px',
                    border: 'none',
                    background: isFeatured 
                      ? 'linear-gradient(135deg, var(--primary-burgundy) 0%, var(--primary-burgundy-dark) 100%)' 
                      : 'linear-gradient(135deg, #E05A10 0%, #C2410C 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {plan.cta || 'Subscribe & Activate'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security & Reassurance footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: '#6B7280',
          fontSize: '0.84rem'
        }}>
          <ShieldCheck size={18} color="#10B981" />
          <span>100% Safe & Secure Payment with Instant Access & Money Back Guarantee</span>
        </div>

      </div>
    </div>
  );
}

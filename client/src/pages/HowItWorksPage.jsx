import React from 'react';
import { UserCheck, ShieldCheck, MessageCircle, HeartHandshake, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage({ onOpenAuth }) {
  const steps = [
    {
      num: "01",
      title: "Create Your Free Profile",
      desc: "Register in under 2 minutes. Enter personal, educational, and professional background. Set your partner expectations and photo privacy settings."
    },
    {
      num: "02",
      title: "Get 100% ID & Phone Verified",
      desc: "Upload a government ID to receive the coveted Verified Blue Tick badge, assuring other families of your authentic matrimonial intent."
    },
    {
      num: "03",
      title: "Explore Matches with 30+ Filters",
      desc: "Filter profiles by religion, caste, mother tongue, career, salary package, location, and astrological compatibility (Guna Milan)."
    },
    {
      num: "04",
      title: "Send Interests & Chat Privately",
      desc: "Express interest with one tap. Once accepted, communicate safely through our encrypted in-app messaging and audio/video calls."
    },
    {
      num: "05",
      title: "Involve Families & Begin Life Journey",
      desc: "Exchange verified phone numbers, arrange family meetings, and take the sacred seven steps towards a blessed union."
    }
  ];

  return (
    <div style={{ background: '#FAF7F5', padding: '40px 0 80px 0' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="section-subtitle">A Complete Guide</span>
          <h1 className="section-title">How Saptaganga Works</h1>
          <p className="section-desc">From initial registration to the wedding mandap, here is how we ensure a safe, authentic, and seamless matchmaking experience.</p>
        </div>

        {/* Timeline Steps */}
        <div style={{ maxWidth: '840px', margin: '0 auto 60px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((s, idx) => (
            <div 
              key={idx}
              style={{
                background: '#FFF',
                padding: '24px 30px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--romantic-rose-border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                gap: '24px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-burgundy) 0%, var(--primary-burgundy-dark) 100%)',
                color: '#ECCB85',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontWeight: 800,
                fontSize: '1.2rem',
                flexShrink: 0
              }}>
                {s.num}
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Safety & Trust Box */}
        <div style={{
          background: '#FFF8FA',
          border: '1.5px solid var(--romantic-rose-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          maxWidth: '840px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <ShieldCheck size={40} style={{ color: '#10B981', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary-burgundy-dark)', marginBottom: '8px' }}>
            Our 100% Privacy & Safety Promise
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            Your photos and contact numbers are never shown without your explicit permission. We employ 24/7 fraud detection and strict manual screening.
          </p>
          <button onClick={() => onOpenAuth('register')} className="btn-burgundy">
            <span>Register Your Profile Free</span>
          </button>
        </div>

      </div>
    </div>
  );
}

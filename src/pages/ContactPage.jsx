import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', query: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', query: '' });
    }, 4000);
  };

  return (
    <div style={{ background: '#FAF7F5', padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="section-subtitle">Get in Touch</span>
          <h1 className="section-title">24/7 Dedicated Support</h1>
          <p className="section-desc">Have questions about registration, membership packages, or partner preferences? Our advisors are here to assist you.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Contact Form */}
          <div style={{
            background: '#FFF',
            padding: '36px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--romantic-rose-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-burgundy-dark)', marginBottom: '18px' }}>
              Send Us a Message
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <CheckCircle2 size={44} style={{ color: '#10B981', margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>Message Received!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Our matchmaking advisor will call or email you within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label className="search-field-label">Full Name</label>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label className="search-field-label">Email Address</label>
                    <input 
                      type="email" 
                      className="search-input" 
                      placeholder="email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required 
                    />
                  </div>
                  <div>
                    <label className="search-field-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="search-input" 
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="search-field-label">Your Query / Message</label>
                  <textarea 
                    className="search-input" 
                    style={{ height: '100px', padding: '10px 14px', resize: 'none' }}
                    placeholder="How can we help you?"
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                    required 
                  />
                </div>

                <button type="submit" className="btn-burgundy" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-md)' }}>
                  <Send size={16} />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Offices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ background: '#FFF', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--romantic-rose)', color: 'var(--primary-burgundy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toll-Free Helpline</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>+91 1800 200 7777</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#FFF', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--romantic-rose)', color: 'var(--primary-burgundy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Support</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>care@saptagangamatrimony.com</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#FFF', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--romantic-rose)', color: 'var(--primary-burgundy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Headquarters</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary-burgundy-dark)', lineHeight: '1.4' }}>
                    Ganga Ghat Heritage Tower, Dashashwamedh Road, Varanasi & Park Street, Kolkata, India
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

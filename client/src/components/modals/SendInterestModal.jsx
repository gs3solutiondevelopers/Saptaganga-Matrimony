import React, { useState } from 'react';
import { X, Send, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export default function SendInterestModal({ profile, onClose, onSentSuccess }) {
  const [selectedNote, setSelectedNote] = useState(
    "Namaste. I came across your profile and found our values and interests aligned. Would love to connect and know more about you."
  );
  const [customNote, setCustomNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!profile) return null;

  const quickNotes = [
    "Namaste. I found your profile very compatible and would be delighted to take the conversation forward.",
    "Hello! Our families share similar cultural roots. We would love to discuss a prospective alliance.",
    "Hi there! Impressed by your career and lifestyle goals. Looking forward to connecting."
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalNote = customNote || selectedNote;
      await api.sendInterest(profile.id, finalNote);
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setIsSent(true);
      setTimeout(() => {
        if (onSentSuccess) onSentSuccess(profile);
        onClose();
      }, 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '500px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} fill="var(--primary-burgundy)" color="var(--primary-burgundy)" />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>
              Express Interest
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {isSent ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#DCFCE7',
                color: '#16A34A',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-burgundy-dark)', marginBottom: '8px' }}>
                Interest Expressed!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {profile.name} has been notified via SMS & Email. You will be notified when they accept.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend}>
              
              {/* Profile Mini Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'var(--romantic-rose)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px'
              }}>
                <img 
                  src={profile.image} 
                  alt={profile.name} 
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-burgundy)' }}
                />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--primary-burgundy-dark)' }}>
                    {profile.name}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {profile.age} yrs • {profile.profession} • {profile.city}
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div style={{ marginBottom: '16px' }}>
                <label className="search-field-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Choose a Personal Message
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {quickNotes.map((note, idx) => (
                    <div 
                      key={idx}
                      onClick={() => { setSelectedNote(note); setCustomNote(""); }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedNote === note && !customNote ? '1.5px solid var(--primary-burgundy)' : '1px solid #E5E7EB',
                        background: selectedNote === note && !customNote ? '#FFF5F7' : '#FAFAFA',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        color: 'var(--text-main)'
                      }}
                    >
                      "{note}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom message field */}
              <div style={{ marginBottom: '20px' }}>
                <label className="search-field-label" style={{ marginBottom: '6px', display: 'block' }}>
                  Or Write a Custom Message (Optional)
                </label>
                <textarea 
                  className="search-input"
                  style={{ height: '70px', padding: '10px 12px', resize: 'none' }}
                  placeholder="Type your personalized message here..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn-burgundy" 
                style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-md)' }}
                disabled={loading}
              >
                <Send size={16} />
                <span>{loading ? 'Sending Interest...' : 'Send Free Interest'}</span>
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { Heart, Sparkles, Quote, CheckCircle2 } from 'lucide-react';
import { MOCK_STORIES } from '../data/mockData';

export default function StoriesPage({ onOpenAuth }) {
  return (
    <div style={{ background: '#FFF8FA', padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="section-subtitle">Real Matrimony Journeys</span>
          <h1 className="section-title">Happy Saptaganga Stories</h1>
          <p className="section-desc">Thousands of brides and grooms found their lifetime companions through Saptaganga. Read their heartwarming journeys.</p>
        </div>

        {/* Stories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          {MOCK_STORIES.map((story) => (
            <div 
              key={story.id} 
              style={{
                background: '#FFF',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--romantic-rose-border)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '240px' }}>
                <img 
                  src={story.image} 
                  alt={story.coupleNames} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(115, 15, 45, 0.9)',
                  color: '#FFF',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}>
                  💍 {story.marriageYear}
                </div>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-burgundy-dark)', marginBottom: '4px' }}>
                  {story.coupleNames}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  📍 {story.location} • <span style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}>{story.highlight}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '16px' }}>
                  "{story.story}"
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#10B981', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  <span>Verified Match by Saptaganga</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Share Story Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-burgundy) 0%, var(--primary-burgundy-dark) 100%)',
          color: '#FFF',
          padding: '40px',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-burgundy)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#ECCB85', marginBottom: '10px' }}>
            Found Your Partner on Saptaganga?
          </h2>
          <p style={{ maxWidth: '560px', margin: '0 auto 24px auto', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>
            We would love to celebrate your holy union! Share your wedding photos and story with our community.
          </p>
          <button onClick={() => onOpenAuth('register')} className="btn-gold">
            <span>Share Your Wedding Story</span>
          </button>
        </div>

      </div>
    </div>
  );
}

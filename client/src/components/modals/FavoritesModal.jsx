import React from 'react';
import { X, Heart, Trash2, Send, Eye } from 'lucide-react';

export default function FavoritesModal({ 
  favorites = [], 
  onClose, 
  onSelectProfile, 
  onSendInterest, 
  onRemoveFavorite 
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '560px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} fill="#E11D48" color="#E11D48" />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>
              Shortlisted Profiles ({favorites.length})
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>❤️</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary-burgundy-dark)', marginBottom: '6px' }}>
                No Shortlisted Profiles Yet
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Click the heart icon on any bride or groom profile card to save them here for quick access.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {favorites.map((profile) => (
                <div 
                  key={profile.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--romantic-rose-border)',
                    background: '#FFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-burgundy)' }}
                    />
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--primary-burgundy-dark)' }}>
                        {profile.name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {profile.age} yrs • {profile.profession} • {profile.city}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => { onClose(); onSelectProfile(profile); }}
                      className="profile-btn-view"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => { onClose(); onSendInterest(profile); }}
                      className="profile-btn-connect"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Connect
                    </button>
                    <button 
                      onClick={() => onRemoveFavorite(profile)}
                      style={{ color: '#9CA3AF', padding: '6px', borderRadius: '50%' }}
                      title="Remove from shortlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

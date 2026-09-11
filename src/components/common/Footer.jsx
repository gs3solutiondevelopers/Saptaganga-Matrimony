import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        <div className="footer-grid">
          
          {/* Col 1: Brand & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img 
                src="/logo.png" 
                alt="Saptaganga Matrimony" 
                style={{ 
                  height: '60px', 
                  width: 'auto', 
                  background: '#FFF', 
                  padding: '6px 12px', 
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                }} 
              />
            </div>

            <p className="footer-brand-desc">
              Saptaganga Matrimony unites traditional cultural values with modern matchmaking precision. Blessed by sacred roots, we help millions begin their beautiful lifelong bond.
            </p>

            <div className="footer-social-links">
              {/* Facebook */}
              <a href="#" className="social-icon-btn" aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="social-icon-btn" aria-label="Instagram">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="social-icon-btn" aria-label="YouTube">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#search">Search Matches</a></li>
              <li><a href="#featured">Featured Profiles</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#membership">Membership Plans</a></li>
              <li><a href="#stories">Success Stories</a></li>
            </ul>
          </div>

          {/* Col 3: Regional Communities */}
          <div>
            <h4 className="footer-col-title">Regional Matrimony</h4>
            <ul className="footer-links-list">
              <li><a href="#">Bengali Matrimony</a></li>
              <li><a href="#">Hindi Matrimony</a></li>
              <li><a href="#">Tamil Matrimony</a></li>
              <li><a href="#">Gujarati Matrimony</a></li>
              <li><a href="#">Marathi Matrimony</a></li>
              <li><a href="#">Punjabi Matrimony</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Help */}
          <div>
            <h4 className="footer-col-title">24/7 Dedicated Support</h4>
            
            <div className="footer-contact-item">
              <Phone size={16} style={{ color: 'var(--accent-gold-light)', marginTop: '2px' }} />
              <div>
                <div style={{ color: '#FFF', fontWeight: 600 }}>Toll-Free Helpline:</div>
                <div>+91 1800 200 7777</div>
              </div>
            </div>

            <div className="footer-contact-item">
              <Mail size={16} style={{ color: 'var(--accent-gold-light)', marginTop: '2px' }} />
              <div>
                <div style={{ color: '#FFF', fontWeight: 600 }}>Helpdesk Email:</div>
                <div>care@saptagangamatrimony.com</div>
              </div>
            </div>

            <div className="footer-contact-item">
              <MapPin size={16} style={{ color: 'var(--accent-gold-light)', marginTop: '2px' }} />
              <div>
                <div>Ganga Ghat Heritage Tower, Varanasi & Park Street, Kolkata</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Saptaganga Matrimony Services Ltd. All Rights Reserved.
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>Privacy Policy</a>
            <span>•</span>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>Terms & Conditions</a>
            <span>•</span>
            <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>Security & Trust</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

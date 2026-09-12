import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

export default function MainLayout({ 
  children, 
  onOpenAuth, 
  onOpenCreateProfile,
  toastMessage,
  currentUser,
  onLogout,
  onViewNotificationProfile,
  notifications = []
}) {
  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--primary-burgundy-dark)',
          color: '#FFF',
          padding: '14px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          borderLeft: '4px solid var(--accent-gold)',
          zIndex: 15000,
          fontSize: '0.92rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Common Navbar Header across all pages */}
      <Navbar 
        onOpenAuth={onOpenAuth} 
        onOpenCreateProfile={onOpenCreateProfile}
        currentUser={currentUser} 
        onLogout={onLogout} 
        onViewNotificationProfile={onViewNotificationProfile}
        notifications={notifications}
      />

      {/* Dynamic Page Content */}
      <main className="main-page-content">
        {children}
      </main>

      {/* Common Footer across all pages */}
      <Footer />
    </div>
  );
}

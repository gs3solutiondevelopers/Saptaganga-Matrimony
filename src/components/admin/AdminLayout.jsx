import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  Crown
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const adminSession = adminService.getSession();

  React.useEffect(() => {
    const updateCount = () => {
      adminService.getProfiles().then(res => {
        if (res.success) {
          const count = res.data.filter(p => !p.approved || p.status === 'pending_approval' || !p.verified).length;
          setPendingCount(count);
        }
      });
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('focus', updateCount);
    window.addEventListener('saptaganga_profile_created', updateCount);
    window.addEventListener('saptaganga_profile_approved', updateCount);
    const interval = setInterval(updateCount, 2500);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('focus', updateCount);
      window.removeEventListener('saptaganga_profile_created', updateCount);
      window.removeEventListener('saptaganga_profile_approved', updateCount);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    adminService.logout();
    navigate('/admin/login');
  };

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/profiles')) return 'Candidate Profiles & Approvals';
    if (path.includes('/admin/stories')) return 'Success Stories CMS';
    if (path.includes('/admin/inquiries')) return 'Contact Leads & Inquiries';
    return 'Executive Dashboard';
  };

  return (
    <div className="admin-layout-root">
      
      {/* 1. Admin Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        
        {/* Brand Header */}
        <Link to="/admin" className="admin-sidebar-brand" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo-emblem.png" alt="Saptaganga" className="admin-sidebar-logo" />
          <div>
            <div className="admin-sidebar-title">SAPTAGANGA</div>
            <div className="admin-sidebar-badge">ADMIN CONTROL</div>
          </div>
        </Link>

        {/* Navigation Menu */}
        <ul className="admin-nav-menu">
          <li>
            <NavLink 
              to="/admin" 
              end 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/admin/profiles" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={18} />
                <span>Profiles & Approvals</span>
              </div>
              {pendingCount > 0 && (
                <span style={{
                  background: '#F43F5E',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(244, 63, 94, 0.4)'
                }}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/admin/stories" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart size={18} />
              <span>Success Stories</span>
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/admin/inquiries" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare size={18} />
              <span>Contact Leads</span>
            </NavLink>
          </li>
        </ul>

        {/* Sidebar Bottom Footer */}
        <div className="admin-sidebar-footer">
          <Link to="/" target="_blank" className="admin-view-site-btn">
            <ExternalLink size={15} />
            <span>View Public Website</span>
          </Link>

          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={15} />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="admin-main-wrapper">
        
        {/* Topbar Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle admin sidebar"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="admin-breadcrumbs">
              <span>Admin</span>
              <span>/</span>
              <span className="active">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-live-badge">
              <span className="admin-pulse-dot"></span>
              <span>Firestore Live</span>
            </div>

            <div className="admin-user-pill">
              <div className="admin-user-avatar">
                <Crown size={15} />
              </div>
              <div className="admin-user-info">
                <span className="admin-user-name">{adminSession?.name || 'Director Admin'}</span>
                <span className="admin-user-role">{adminSession?.role || 'Super Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Sub-Page Content */}
        <main className="admin-content-area">
          {children}
        </main>
      </div>

    </div>
  );
}

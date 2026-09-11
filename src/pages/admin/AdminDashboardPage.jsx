import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  Heart, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProfiles: 0,
    verifiedCount: 0,
    pendingCount: 0,
    premiumCount: 0,
    totalInquiries: 0,
    totalStories: 0
  });
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminService.getDashboardStats();
      if (statsRes.success) setStats(statsRes.data);

      const profilesRes = await adminService.getProfiles();
      if (profilesRes.success) setRecentProfiles(profilesRes.data.slice(0, 5));

      const inqRes = await adminService.getInquiries();
      if (inqRes.success) setRecentInquiries(inqRes.data.slice(0, 4));
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const handleSync = () => {
      loadDashboardData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('saptaganga_profile_created', handleSync);
    window.addEventListener('saptaganga_profile_approved', handleSync);
    const interval = setInterval(handleSync, 3000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('saptaganga_profile_created', handleSync);
      window.removeEventListener('saptaganga_profile_approved', handleSync);
      clearInterval(interval);
    };
  }, []);

  const handleToggleVerify = async (profileId, currentStatus) => {
    const res = await adminService.toggleVerification(profileId, currentStatus);
    if (res.success) {
      setRecentProfiles(prev => prev.map(p => p.id === profileId ? { ...p, verified: res.verified } : p));
      loadDashboardData();
    }
  };

  return (
    <div>
      
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Executive Overview</h1>
          <p className="admin-page-subtitle">Real-time matrimonial platform health, members, and verification stream.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/admin/profiles')} className="admin-btn-primary">
            <UserPlus size={16} />
            <span>Manage Profiles</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        
        {/* Card 1: Total Profiles */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-info">
            <span className="admin-kpi-label">Total Profiles</span>
            <span className="admin-kpi-value">{stats.totalProfiles || '6'}</span>
            <span className="admin-kpi-sub">↑ Active on platform</span>
          </div>
          <div className="admin-kpi-icon kpi-icon-burgundy">
            <Users size={24} />
          </div>
        </div>

        {/* Card 2: 100% Verified */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-info">
            <span className="admin-kpi-label">Verified Members</span>
            <span className="admin-kpi-value">{stats.verifiedCount || '5'}</span>
            <span className="admin-kpi-sub">🛡️ Aadhaar/ID verified</span>
          </div>
          <div className="admin-kpi-icon kpi-icon-green">
            <ShieldCheck size={24} />
          </div>
        </div>

        {/* Card 3: Pending Approvals */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-info">
            <span className="admin-kpi-label">Pending Approval</span>
            <span className="admin-kpi-value">{stats.pendingCount || '1'}</span>
            <span className="admin-kpi-sub" style={{ color: '#D97706' }}>Action required</span>
          </div>
          <div className="admin-kpi-icon kpi-icon-gold">
            <Clock size={24} />
          </div>
        </div>

        {/* Card 4: Contact Inquiries */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-info">
            <span className="admin-kpi-label">Leads & Inquiries</span>
            <span className="admin-kpi-value">{stats.totalInquiries || '12'}</span>
            <span className="admin-kpi-sub" style={{ color: '#0284C7' }}>Helpline & consultation</span>
          </div>
          <div className="admin-kpi-icon kpi-icon-blue">
            <MessageSquare size={24} />
          </div>
        </div>

      </div>

      {/* Grid: Recent Profiles & Inquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Recent Registrations & 1-Click Approval */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Candidates</h2>
            <Link to="/admin/profiles" style={{ fontSize: '0.82rem', color: 'var(--primary-burgundy)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProfiles.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-user-cell">
                        <img src={p.image} alt={p.name} className="admin-cell-avatar" />
                        <div>
                          <div className="admin-cell-name">{p.name}</div>
                          <div className="admin-cell-sub">{p.id} • {p.gender === 'female' ? 'Bride' : 'Groom'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{p.profession}</div>
                      <div className="admin-cell-sub">{p.city}, {p.age} yrs</div>
                    </td>
                    <td>
                      {p.verified ? (
                        <span className="admin-badge-verified">
                          <CheckCircle2 size={12} />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="admin-badge-pending">
                          <Clock size={12} />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleToggleVerify(p.id, p.verified)}
                        className={`admin-btn-icon ${p.verified ? '' : 'verify-btn'}`}
                        title={p.verified ? "Remove verification" : "Approve & Verify"}
                      >
                        {p.verified ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Inquiries & Leads */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Latest Inquiries & Leads</h2>
            <Link to="/admin/inquiries" style={{ fontSize: '0.82rem', color: 'var(--primary-burgundy)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentInquiries.map(inq => (
              <div 
                key={inq.id}
                style={{
                  padding: '14px 16px',
                  background: '#FAF7F4',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--admin-border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--primary-burgundy-dark)', fontSize: '0.92rem' }}>{inq.fullName}</span>
                    <span style={{ fontSize: '0.72rem', background: '#F3E8FF', color: '#7E22CE', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      {inq.profileFor || 'Match Consultation'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '3px' }}>
                    📞 {inq.phone} • ✉️ {inq.email}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#4A3E42', marginTop: '6px', lineHeight: 1.4 }}>
                    "{inq.message}"
                  </p>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: inq.status === 'New Lead' ? '#FEF3C7' : '#ECFDF5',
                  color: inq.status === 'New Lead' ? '#92400E' : '#065F46',
                  whiteSpace: 'nowrap'
                }}>
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

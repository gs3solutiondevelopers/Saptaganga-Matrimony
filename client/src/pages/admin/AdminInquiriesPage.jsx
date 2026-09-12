import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Clock, CheckCircle2, Trash2, Search, Filter } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await adminService.getInquiries();
      if (res.success) setInquiries(res.data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const res = await adminService.updateInquiryStatus(id, newStatus);
    if (res.success) {
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      const res = await adminService.deleteInquiry(id);
      if (res.success) {
        setInquiries(prev => prev.filter(i => i.id !== id));
      }
    }
  };

  const filtered = inquiries.filter(i => {
    const matchesSearch = 
      i.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.phone?.includes(searchQuery) ||
      i.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.city?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'new') return i.status === 'New Lead';
    if (filterStatus === 'progress') return i.status === 'In Progress';
    if (filterStatus === 'resolved') return i.status === 'Resolved';
    return true;
  });

  return (
    <div>
      
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Leads & Inquiries</h1>
          <p className="admin-page-subtitle">Track incoming consultations, membership inquiries, and helpline requests.</p>
        </div>
      </div>

      {/* Main Inquiries Card */}
      <div className="admin-card">
        
        {/* Filter bar */}
        <div className="admin-filter-bar">
          <div className="admin-search-input-wrap">
            <Search size={16} />
            <input 
              type="text" 
              className="admin-search-input"
              placeholder="Search leads by name, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-filter-pills">
            <button 
              className={`admin-filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Leads ({inquiries.length})
            </button>
            <button 
              className={`admin-filter-pill ${filterStatus === 'new' ? 'active' : ''}`}
              onClick={() => setFilterStatus('new')}
            >
              New Leads
            </button>
            <button 
              className={`admin-filter-pill ${filterStatus === 'progress' ? 'active' : ''}`}
              onClick={() => setFilterStatus('progress')}
            >
              In Progress
            </button>
            <button 
              className={`admin-filter-pill ${filterStatus === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilterStatus('resolved')}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Contact Name</th>
                <th>Phone & Email</th>
                <th>Profile Looking For</th>
                <th>Inquiry Message</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-text-muted)' }}>
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map(inq => (
                  <tr key={inq.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--primary-burgundy-dark)' }}>
                        {inq.fullName}
                      </div>
                      <div className="admin-cell-sub">{inq.city || 'Kolkata'}</div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
                        <Phone size={13} color="var(--primary-burgundy)" />
                        <a href={`tel:${inq.phone}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: '600' }}>
                          {inq.phone}
                        </a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
                        <Mail size={12} />
                        <span>{inq.email}</span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.75rem', background: '#F3E8FF', color: '#7E22CE', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {inq.profileFor || 'Match Assistance'}
                      </span>
                    </td>

                    <td style={{ maxWidth: '280px' }}>
                      <p style={{ fontSize: '0.82rem', color: '#4A3E42', lineHeight: 1.4, margin: 0 }}>
                        "{inq.message}"
                      </p>
                    </td>

                    <td>
                      <select 
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          border: '1px solid var(--admin-border-subtle)',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          background: inq.status === 'New Lead' ? '#FEF3C7' : (inq.status === 'Resolved' ? '#ECFDF5' : '#EFF6FF'),
                          color: inq.status === 'New Lead' ? '#92400E' : (inq.status === 'Resolved' ? '#065F46' : '#1E40AF'),
                          cursor: 'pointer'
                        }}
                      >
                        <option value="New Lead">New Lead</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td>
                      <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleDelete(inq.id)}
                          className="admin-btn-icon delete-btn"
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

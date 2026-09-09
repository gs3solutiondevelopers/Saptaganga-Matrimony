import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Trash2, 
  UserPlus, 
  Filter, 
  X, 
  Check, 
  Clock,
  Sparkles
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);

  // New Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'female',
    age: 26,
    height: "5' 5\"",
    religion: 'Hindu',
    caste: 'Brahmin',
    motherTongue: 'Bengali',
    city: 'Kolkata',
    state: 'West Bengal',
    education: 'B.Tech / M.Tech',
    profession: 'Software Engineer',
    company: 'TCS / Cognizant',
    annualIncome: '₹12 - 18 LPA',
    diet: 'Non-Vegetarian',
    rashi: 'Kanya (Virgo)',
    nakshatra: 'Hasta',
    manglik: 'Non-Manglik',
    verified: true,
    about: 'Cultured, family-oriented professional looking for a life partner with mutual respect and progressive outlook.'
  });

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const res = await adminService.getProfiles();
      if (res.success) {
        setProfiles(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleToggleVerify = async (profileId, currentStatus) => {
    const res = await adminService.toggleVerification(profileId, currentStatus);
    if (res.success) {
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, verified: res.verified } : p));
    }
  };

  const handleDelete = async (profileId) => {
    if (window.confirm(`Are you sure you want to delete profile ${profileId}?`)) {
      const res = await adminService.deleteProfile(profileId);
      if (res.success) {
        setProfiles(prev => prev.filter(p => p.id !== profileId));
      }
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    const res = await adminService.createProfile(formData);
    if (res.success) {
      setProfiles(prev => [res.data, ...prev]);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        gender: 'female',
        age: 26,
        height: "5' 5\"",
        religion: 'Hindu',
        caste: 'Brahmin',
        motherTongue: 'Bengali',
        city: 'Kolkata',
        state: 'West Bengal',
        education: 'B.Tech / M.Tech',
        profession: 'Software Engineer',
        company: 'TCS / Cognizant',
        annualIncome: '₹12 - 18 LPA',
        diet: 'Non-Vegetarian',
        rashi: 'Kanya (Virgo)',
        nakshatra: 'Hasta',
        manglik: 'Non-Manglik',
        verified: true,
        about: 'Cultured, family-oriented professional looking for a life partner with mutual respect and progressive outlook.'
      });
    }
  };

  // Filter & Search Logic
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.religion?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'brides') return p.gender === 'female';
    if (activeFilter === 'grooms') return p.gender === 'male';
    if (activeFilter === 'pending') return !p.verified;
    if (activeFilter === 'verified') return p.verified;
    if (activeFilter === 'doctors') return p.profession?.toLowerCase().includes('doctor') || p.profession?.toLowerCase().includes('physician') || p.profession?.toLowerCase().includes('dental');
    if (activeFilter === 'tech') return p.profession?.toLowerCase().includes('software') || p.profession?.toLowerCase().includes('data');

    return true;
  });

  return (
    <div>
      
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Candidate Profiles & Verification</h1>
          <p className="admin-page-subtitle">Manage matrimonial candidates, grant 100% verified badges, and register new profiles.</p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="admin-btn-primary">
          <UserPlus size={16} />
          <span>Add New Candidate</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="admin-card">
        
        {/* Search & Filter Toolbar */}
        <div className="admin-filter-bar">
          <div className="admin-search-input-wrap">
            <Search size={16} />
            <input 
              type="text"
              className="admin-search-input"
              placeholder="Search by Name, ID, City, Profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-filter-pills">
            <button 
              className={`admin-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Profiles ({profiles.length})
            </button>
            <button 
              className={`admin-filter-pill ${activeFilter === 'brides' ? 'active' : ''}`}
              onClick={() => setActiveFilter('brides')}
            >
              Brides (পাত্রী)
            </button>
            <button 
              className={`admin-filter-pill ${activeFilter === 'grooms' ? 'active' : ''}`}
              onClick={() => setActiveFilter('grooms')}
            >
              Grooms (পাত্র)
            </button>
            <button 
              className={`admin-filter-pill ${activeFilter === 'verified' ? 'active' : ''}`}
              onClick={() => setActiveFilter('verified')}
            >
              Verified
            </button>
            <button 
              className={`admin-filter-pill ${activeFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveFilter('pending')}
            >
              Pending Approval
            </button>
            <button 
              className={`admin-filter-pill ${activeFilter === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveFilter('doctors')}
            >
              Doctors
            </button>
            <button 
              className={`admin-filter-pill ${activeFilter === 'tech' ? 'active' : ''}`}
              onClick={() => setActiveFilter('tech')}
            >
              Tech Elite
            </button>
          </div>
        </div>

        {/* Candidate Table */}
        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member Profile</th>
                <th>Community & Age</th>
                <th>Career & Education</th>
                <th>Verification</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-text-muted)' }}>
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-user-cell">
                        <img src={p.image} alt={p.name} className="admin-cell-avatar" />
                        <div>
                          <div className="admin-cell-name">{p.name}</div>
                          <div className="admin-cell-sub">{p.id} • {p.gender === 'female' ? 'Bride (পাত্রী)' : 'Groom (পাত্র)'}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary-burgundy-dark)' }}>
                        {p.age} yrs, {p.height}
                      </div>
                      <div className="admin-cell-sub">
                        {p.religion}, {p.caste} • {p.city}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '600' }}>{p.profession}</div>
                      <div className="admin-cell-sub">{p.education} • {p.annualIncome}</div>
                    </td>

                    <td>
                      {p.verified ? (
                        <span className="admin-badge-verified">
                          <CheckCircle2 size={13} />
                          <span>100% Verified</span>
                        </span>
                      ) : (
                        <span className="admin-badge-pending">
                          <Clock size={13} />
                          <span>Pending Approval</span>
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                        
                        {/* 1-Click Verification Toggle */}
                        <button 
                          onClick={() => handleToggleVerify(p.id, p.verified)}
                          className={`admin-btn-icon ${p.verified ? '' : 'verify-btn'}`}
                          title={p.verified ? "Mark as unverified" : "Approve & Grant Verified Badge"}
                        >
                          {p.verified ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                        </button>

                        {/* View Bio Modal */}
                        <button 
                          onClick={() => setViewingProfile(p)}
                          className="admin-btn-icon"
                          title="View Full Profile Details"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Delete Candidate */}
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="admin-btn-icon delete-btn"
                          title="Delete Candidate"
                        >
                          <Trash2 size={15} />
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

      {/* ➕ ADD NEW PROFILE MODAL */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFF',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            border: '1px solid var(--admin-border-gold)'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="kpi-icon-burgundy" style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-burgundy-dark)', fontSize: '1.4rem' }}>
                  Register New Candidate
                </h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProfile}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    required 
                    placeholder="e.g. Debolina Mukherjee"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-form-label">Looking for (Gender)</label>
                  <select 
                    className="admin-form-input"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="female">Bride (পাত্রী)</option>
                    <option value="male">Groom (পাত্র)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Age</label>
                  <input 
                    type="number" 
                    className="admin-form-input" 
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Height</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Mother Tongue</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.motherTongue}
                    onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Religion</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Caste / Community</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.caste}
                    onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">City</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Education Degree</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Profession / Job Title</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Annual Income</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Rashi / Horoscope</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={formData.rashi}
                    onChange={(e) => setFormData({ ...formData, rashi: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="admin-form-label">About / Bio</label>
                <textarea 
                  rows="3"
                  className="admin-form-input"
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: '10px 18px', borderRadius: '6px', border: '1px solid #CCC', background: '#FFF', cursor: 'pointer', fontWeight: '600' }}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <span>Save Candidate to Firestore</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 👁️ VIEW CANDIDATE MODAL */}
      {viewingProfile && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFF',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '580px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            border: '1px solid var(--admin-border-gold)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-burgundy-dark)', fontSize: '1.4rem' }}>
                Candidate Bio Details
              </h2>
              <button onClick={() => setViewingProfile(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <img src={viewingProfile.image} alt={viewingProfile.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-gold)' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-burgundy-dark)' }}>{viewingProfile.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>{viewingProfile.id} • {viewingProfile.gender === 'female' ? 'Bride' : 'Groom'}</div>
                <div style={{ marginTop: '4px' }}>
                  {viewingProfile.verified ? (
                    <span className="admin-badge-verified">✓ 100% Verified</span>
                  ) : (
                    <span className="admin-badge-pending">Pending Approval</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#FAF7F4', padding: '16px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '16px' }}>
              <div><strong>Age/Height:</strong> {viewingProfile.age} yrs, {viewingProfile.height}</div>
              <div><strong>Religion/Caste:</strong> {viewingProfile.religion}, {viewingProfile.caste}</div>
              <div><strong>Profession:</strong> {viewingProfile.profession}</div>
              <div><strong>Income:</strong> {viewingProfile.annualIncome}</div>
              <div><strong>Location:</strong> {viewingProfile.city}, {viewingProfile.state}</div>
              <div><strong>Rashi / Kundali:</strong> {viewingProfile.rashi}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>About Bio:</strong>
              <p style={{ fontSize: '0.88rem', color: '#4A3E42', lineHeight: 1.5, background: '#FFFDFD', padding: '10px', borderRadius: '6px', border: '1px solid #EEE' }}>
                {viewingProfile.about}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  handleToggleVerify(viewingProfile.id, viewingProfile.verified);
                  setViewingProfile(null);
                }}
                className="admin-btn-primary"
              >
                {viewingProfile.verified ? 'Revoke Verification' : 'Grant Verified Badge'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

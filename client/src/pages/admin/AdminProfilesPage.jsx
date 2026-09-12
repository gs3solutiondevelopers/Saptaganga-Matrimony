import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User,
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
  Sparkles,
  Edit2,
  Upload,
  Camera,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { adminService } from '../../services/adminService';
import { storageService } from '../../services/storageService';

export default function AdminProfilesPage() {
  const [searchParams] = useSearchParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    const f = searchParams.get('filter');
    if (f) setActiveFilter(f);
  }, [searchParams]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);

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
    image: '',
    verified: true,
    approved: true,
    status: 'approved',
    about: 'Cultured, family-oriented professional looking for a life partner with mutual respect and progressive outlook.'
  });

  const [editFormData, setEditFormData] = useState(null);

  const handleOpenEdit = (profile) => {
    const existingPhoto = profile.image || profile.profileImage || profile.photoUrl || profile.profilePhoto || '';
    setEditingProfile(profile);
    setEditFormData({
      ...profile,
      name: profile.name || profile.fullName || '',
      gender: profile.gender || 'Female',
      age: profile.age || 26,
      height: profile.height || "5' 5\"",
      religion: profile.religion || 'Hindu',
      caste: profile.caste || 'Brahmin',
      motherTongue: profile.motherTongue || 'Bengali',
      city: profile.city || 'Kolkata',
      state: profile.state || 'West Bengal',
      education: profile.education || 'Graduate',
      profession: profile.profession || 'Professional',
      company: profile.company || '',
      annualIncome: profile.annualIncome || '₹10 - 15 LPA',
      diet: profile.diet || 'Non-Vegetarian',
      rashi: profile.rashi || 'Kanya (Virgo)',
      nakshatra: profile.nakshatra || '',
      manglik: profile.manglik || 'Non-Manglik',
      image: existingPhoto,
      profileImage: existingPhoto,
      photoUrl: existingPhoto,
      profilePhoto: existingPhoto,
      about: profile.about || profile.aboutMe || ''
    });
  };

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const handlePhotoFileUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'File Too Large',
          text: 'Please select a photo smaller than 5MB.',
          confirmButtonColor: '#780E2F'
        });
        e.target.value = '';
        return;
      }
      setIsUploadingPhoto(true);
      try {
        const res = await storageService.uploadTempPhoto(file);
        if (res.success && res.tempUrl) {
          if (isEdit) {
            setEditFormData(prev => ({ 
              ...prev, 
              image: res.tempUrl, 
              profileImage: res.tempUrl, 
              photoUrl: res.tempUrl,
              profilePhoto: res.tempUrl,
              tempStoragePath: res.storagePath 
            }));
          } else {
            setFormData(prev => ({ 
              ...prev, 
              image: res.tempUrl, 
              profileImage: res.tempUrl, 
              photoUrl: res.tempUrl,
              profilePhoto: res.tempUrl,
              tempStoragePath: res.storagePath 
            }));
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: res.error || 'Failed to upload photo. Please try again.',
            confirmButtonColor: '#780E2F'
          });
        }
      } catch (err) {
        console.error('Photo upload error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Upload Error',
          text: err.message || 'Photo upload failed. Please try again.',
          confirmButtonColor: '#780E2F'
        });
      } finally {
        setIsUploadingPhoto(false);
        e.target.value = '';
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProfile || !editFormData) return;
    setIsSubmittingEdit(true);
    try {
      const fullPayload = {
        ...editingProfile,
        ...editFormData,
        approved: editingProfile.approved ?? true,
        verified: editingProfile.verified ?? true,
        status: editingProfile.status || 'approved'
      };
      const res = await adminService.updateProfile(editingProfile.id, fullPayload);
      if (res.success) {
        setProfiles(prev => prev.map(p => (p.id === editingProfile.id || p.memberId === editingProfile.id) ? res.data : p));
        setEditingProfile(null);
        setEditFormData(null);
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Candidate profile has been updated and published successfully.',
          confirmButtonColor: '#780E2F',
          timer: 2500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: res.error || 'Failed to update candidate profile. Please try again.',
          confirmButtonColor: '#780E2F'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#780E2F'
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

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

    // Auto-refresh when tab gains focus, storage changes or profile created
    const handleSync = () => {
      adminService.getProfiles().then(res => {
        if (res.success) setProfiles(res.data);
      });
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('saptaganga_profile_created', handleSync);
    window.addEventListener('saptaganga_profile_approved', handleSync);

    const interval = setInterval(handleSync, 2500);

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
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, verified: res.verified } : p));
    }
  };

  const handleApproveProfile = async (profileId) => {
    const res = await adminService.approveProfile(profileId);
    if (res.success) {
      setProfiles(prev => prev.map(p => (p.id === profileId || p.memberId === profileId) ? { ...p, verified: true, approved: true, status: 'approved' } : p));
      setNotificationMsg(`🎉 Profile ${profileId} has been successfully approved and published live!`);
      setTimeout(() => setNotificationMsg(''), 5000);
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
    setIsSubmittingAdd(true);
    try {
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
        Swal.fire({
          icon: 'success',
          title: 'Profile Created!',
          text: `Candidate ${res.data?.name || ''} has been saved to Firestore successfully.`,
          confirmButtonColor: '#780E2F',
          timer: 2500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: res.error || 'Failed to create candidate profile. Please try again.',
          confirmButtonColor: '#780E2F'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#780E2F'
      });
    } finally {
      setIsSubmittingAdd(false);
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

    const genderLower = p.gender?.toLowerCase() || '';
    if (activeFilter === 'brides') return genderLower === 'female' || genderLower === 'bride';
    if (activeFilter === 'grooms') return genderLower === 'male' || genderLower === 'groom';
    if (activeFilter === 'pending') return !p.verified || p.status === 'pending_approval' || !p.approved;
    if (activeFilter === 'verified') return p.verified && p.approved !== false;
    if (activeFilter === 'doctors') return p.profession?.toLowerCase().includes('doctor') || p.profession?.toLowerCase().includes('physician') || p.profession?.toLowerCase().includes('dental');
    if (activeFilter === 'tech') return p.profession?.toLowerCase().includes('software') || p.profession?.toLowerCase().includes('data') || p.profession?.toLowerCase().includes('engineer');

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

      {/* Success Notification Banner */}
      {notificationMsg && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '16px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{notificationMsg}</span>
        </div>
      )}

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
              Brides
            </button>
            <button 
              className={`admin-filter-pill ${activeFilter === 'grooms' ? 'active' : ''}`}
              onClick={() => setActiveFilter('grooms')}
            >
              Grooms
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Pending Approval</span>
              {profiles.filter(p => !p.approved || p.status === 'pending_approval' || !p.verified).length > 0 && (
                <span style={{
                  background: activeFilter === 'pending' ? '#FFFFFF' : '#F43F5E',
                  color: activeFilter === 'pending' ? '#780E2F' : '#FFFFFF',
                  fontSize: '0.70rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {profiles.filter(p => !p.approved || p.status === 'pending_approval' || !p.verified).length}
                </span>
              )}
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

        {/* Pending Requests Alert Banner */}
        {profiles.filter(p => !p.approved || p.status === 'pending_approval' || !p.verified).length > 0 && activeFilter !== 'pending' && (
          <div style={{
            background: '#FFF7ED',
            border: '1px solid #FED7AA',
            borderRadius: '10px',
            padding: '12px 18px',
            margin: '0 20px 16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9A3412', fontSize: '0.88rem', fontWeight: 600 }}>
              <Clock size={18} color="#EA580C" />
              <span>🔔 You have <strong>{profiles.filter(p => !p.approved || p.status === 'pending_approval' || !p.verified).length}</strong> candidate profile registration request(s) awaiting admin review and verification.</span>
            </div>
            <button 
              onClick={() => setActiveFilter('pending')}
              style={{
                background: '#EA580C',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.80rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              View Pending Requests
            </button>
          </div>
        )}

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
                        {p.image || p.profileImage ? (
                          <img 
                            src={p.image || p.profileImage} 
                            alt={p.name} 
                            className="admin-cell-avatar"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="admin-cell-avatar-placeholder" 
                          style={{ 
                            display: (p.image || p.profileImage) ? 'none' : 'flex',
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #780E2F 0%, #9E1B43 100%)',
                            color: '#FFFFFF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <User size={18} color="#FFFFFF" />
                        </div>
                        <div>
                          <div className="admin-cell-name">{p.name}</div>
                          <div className="admin-cell-sub">{p.id} • {p.gender?.toLowerCase() === 'female' ? 'Bride' : 'Groom'}</div>
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
                      <div className="admin-actions-cell" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                        
                        {/* 1-Click Approve Button for Pending Profiles */}
                        {(!p.approved || p.status === 'pending_approval') && (
                          <button
                            onClick={() => handleApproveProfile(p.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: '#10B981',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '5px 12px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                            }}
                            title="Approve & Publish Live"
                          >
                            <Check size={13} strokeWidth={3} />
                            <span>Approve</span>
                          </button>
                        )}

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

                        {/* Edit Candidate */}
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="admin-btn-icon"
                          title="Edit Candidate Details"
                        >
                          <Edit2 size={15} />
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
            
            <div style={{ 
              position: 'sticky',
              top: '-28px',
              zIndex: 50,
              background: '#FFF',
              paddingTop: '28px',
              paddingBottom: '14px',
              marginTop: '-28px',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid #F3F4F6',
              marginBottom: '20px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="kpi-icon-burgundy" style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-burgundy-dark)', fontSize: '1.4rem' }}>
                  Register New Candidate
                </h2>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                aria-label="Close modal"
                style={{ 
                  background: '#F3F4F6', 
                  border: 'none', 
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <X size={18} />
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
                    <option value="female">Bride</option>
                    <option value="male">Groom</option>
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

              {/* Profile Photo Section (Upload + URL + Presets) */}
              <div style={{
                background: '#FAF6F0',
                border: '1.5px dashed var(--admin-border-gold)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <label className="admin-form-label" style={{ fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '8px', display: 'block' }}>
                  📸 Candidate Profile Photo
                </label>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Photo Preview Circle */}
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#EDE8E1',
                    border: '3px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {formData.image ? (
                      <img 
                        src={formData.image} 
                        alt="Candidate Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#8C827A' }}>
                        <Camera size={24} style={{ margin: '0 auto 2px auto' }} />
                        <span style={{ fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                      <label 
                        htmlFor="adminAddPhotoInput"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, var(--primary-burgundy) 0%, var(--primary-burgundy-dark) 100%)',
                          color: '#FFF',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: isUploadingPhoto ? 'not-allowed' : 'pointer',
                          opacity: isUploadingPhoto ? 0.75 : 1,
                          boxShadow: '0 2px 8px rgba(115, 15, 45, 0.25)'
                        }}
                      >
                        {isUploadingPhoto ? (
                          <><Loader2 size={16} className="spin-animation" /> <span>Uploading Photo...</span></>
                        ) : (
                          <><Upload size={15} /> <span>Upload from Computer / Phone</span></>
                        )}
                        <input 
                          id="adminAddPhotoInput"
                          type="file" 
                          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/jpg,image/webp" 
                          disabled={isUploadingPhoto}
                          style={{ display: 'none' }}
                          onChange={(e) => handlePhotoFileUpload(e, false)}
                        />
                      </label>

                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          disabled={isUploadingPhoto}
                          title="Delete photo"
                          style={{
                            background: '#FEE2E2',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            padding: '7px 12px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            cursor: isUploadingPhoto ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
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
                <button type="button" onClick={() => setIsAddModalOpen(false)} disabled={isSubmittingAdd || isUploadingPhoto} style={{ padding: '10px 18px', borderRadius: '6px', border: '1px solid #CCC', background: '#FFF', cursor: (isSubmittingAdd || isUploadingPhoto) ? 'not-allowed' : 'pointer', fontWeight: '600', opacity: (isSubmittingAdd || isUploadingPhoto) ? 0.7 : 1 }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn-primary" 
                  disabled={isSubmittingAdd || isUploadingPhoto} 
                  style={{ 
                    opacity: (isSubmittingAdd || isUploadingPhoto) ? 0.7 : 1,
                    cursor: (isSubmittingAdd || isUploadingPhoto) ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmittingAdd ? (
                    <><Loader2 size={16} className="spin-animation" /> <span>Saving...</span></>
                  ) : isUploadingPhoto ? (
                    <><Loader2 size={16} className="spin-animation" /> <span>Uploading Photo...</span></>
                  ) : (
                    <span>Save Candidate to Firestore</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ✏️ EDIT CANDIDATE MODAL */}
      {editingProfile && editFormData && (
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
            
            <div style={{ 
              position: 'sticky',
              top: '-28px',
              zIndex: 50,
              background: '#FFF',
              paddingTop: '28px',
              paddingBottom: '14px',
              marginTop: '-28px',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid #F3F4F6',
              marginBottom: '20px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="kpi-icon-burgundy" style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit2 size={18} />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-burgundy-dark)', fontSize: '1.4rem' }}>
                    Edit Candidate Profile
                  </h2>
                  <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>ID: {editingProfile.id}</span>
                </div>
              </div>
              <button 
                onClick={() => { setEditingProfile(null); setEditFormData(null); }} 
                aria-label="Close modal"
                style={{ 
                  background: '#F3F4F6', 
                  border: 'none', 
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    required 
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-form-label">Gender</label>
                  <select 
                    className="admin-form-input"
                    value={editFormData.gender || 'Female'}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                  >
                    <option value="Female">Bride (Female)</option>
                    <option value="Male">Groom (Male)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Age</label>
                  <input 
                    type="number" 
                    className="admin-form-input" 
                    value={editFormData.age || 26}
                    onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Height</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.height || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Mother Tongue</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.motherTongue || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, motherTongue: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Religion</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.religion || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, religion: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Caste</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.caste || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, caste: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">City</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.city || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Education</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.education || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, education: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Profession</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.profession || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, profession: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="admin-form-label">Annual Income</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.annualIncome || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, annualIncome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Rashi / Horoscope</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    value={editFormData.rashi || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, rashi: e.target.value })}
                  />
                </div>
              </div>

              {/* Profile Photo Section (Upload + URL + Presets) */}
              <div style={{
                background: '#FAF6F0',
                border: '1.5px dashed var(--admin-border-gold)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <label className="admin-form-label" style={{ fontWeight: 700, color: 'var(--primary-burgundy-dark)', marginBottom: '8px', display: 'block' }}>
                  📸 Candidate Profile Photo
                </label>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Photo Preview Circle */}
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#EDE8E1',
                    border: '3px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {editFormData.image || editFormData.profileImage || editFormData.photoUrl || editFormData.profilePhoto ? (
                      <img 
                        src={editFormData.image || editFormData.profileImage || editFormData.photoUrl || editFormData.profilePhoto} 
                        alt="Candidate Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      style={{ 
                        display: (editFormData.image || editFormData.profileImage || editFormData.photoUrl || editFormData.profilePhoto) ? 'none' : 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#8C827A',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <Camera size={24} style={{ margin: '0 auto 2px auto' }} />
                      <span style={{ fontSize: '0.68rem', display: 'block', fontWeight: 600 }}>No Photo</span>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                      <label 
                        htmlFor="adminEditPhotoInput"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, var(--primary-burgundy) 0%, var(--primary-burgundy-dark) 100%)',
                          color: '#FFF',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          cursor: isUploadingPhoto ? 'not-allowed' : 'pointer',
                          opacity: isUploadingPhoto ? 0.75 : 1,
                          boxShadow: '0 2px 8px rgba(115, 15, 45, 0.25)'
                        }}
                      >
                        {isUploadingPhoto ? (
                          <><Loader2 size={16} className="spin-animation" /> <span>Uploading Photo...</span></>
                        ) : (
                          <><Upload size={15} /> <span>Upload from Computer / Phone</span></>
                        )}
                        <input 
                          id="adminEditPhotoInput"
                          type="file" 
                          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/jpg,image/webp" 
                          disabled={isUploadingPhoto}
                          style={{ display: 'none' }}
                          onChange={(e) => handlePhotoFileUpload(e, true)}
                        />
                      </label>

                      {Boolean(editFormData.image || editFormData.profileImage || editFormData.photoUrl || editFormData.profilePhoto) && (
                        <button
                          type="button"
                          onClick={() => setEditFormData(prev => ({ ...prev, image: '', profileImage: '', photoUrl: '', profilePhoto: '' }))}
                          disabled={isUploadingPhoto}
                          title="Delete photo"
                          style={{
                            background: '#FEE2E2',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            padding: '7px 12px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            cursor: isUploadingPhoto ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="admin-form-label">About / Bio</label>
                <textarea 
                  rows="3"
                  className="admin-form-input"
                  value={editFormData.about || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, about: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => { setEditingProfile(null); setEditFormData(null); }} disabled={isSubmittingEdit || isUploadingPhoto} style={{ padding: '10px 18px', borderRadius: '6px', border: '1px solid #CCC', background: '#FFF', cursor: (isSubmittingEdit || isUploadingPhoto) ? 'not-allowed' : 'pointer', fontWeight: '600', opacity: (isSubmittingEdit || isUploadingPhoto) ? 0.7 : 1 }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn-primary" 
                  disabled={isSubmittingEdit || isUploadingPhoto} 
                  style={{ 
                    opacity: (isSubmittingEdit || isUploadingPhoto) ? 0.7 : 1,
                    cursor: (isSubmittingEdit || isUploadingPhoto) ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmittingEdit ? (
                    <><Loader2 size={16} className="spin-animation" /> <span>Updating...</span></>
                  ) : isUploadingPhoto ? (
                    <><Loader2 size={16} className="spin-animation" /> <span>Uploading Photo...</span></>
                  ) : (
                    <span>Update & Publish Candidate</span>
                  )}
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
            <div style={{ 
              position: 'sticky',
              top: '-28px',
              zIndex: 50,
              background: '#FFF',
              paddingTop: '28px',
              paddingBottom: '14px',
              marginTop: '-28px',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid #F3F4F6',
              marginBottom: '16px' 
            }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-burgundy-dark)', fontSize: '1.4rem' }}>
                Candidate Bio Details
              </h2>
              <button 
                onClick={() => setViewingProfile(null)} 
                aria-label="Close modal"
                style={{ 
                  background: '#F3F4F6', 
                  border: 'none', 
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <X size={18} />
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

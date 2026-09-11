import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, RefreshCw, CheckCircle2, Heart, Send, Sparkles, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function SearchPage({
  onSelectProfile,
  onSendInterest,
  onToggleShortlist,
  shortlistedIds,
  currentUser,
  onOpenCreateProfile
}) {
  const location = useLocation();
  const initialFilters = location.state?.searchFilters || {};

  const [filters, setFilters] = useState({
    gender: initialFilters.gender || 'any',
    minAge: initialFilters.minAge || 20,
    maxAge: initialFilters.maxAge || 40,
    religion: initialFilters.religion || 'any',
    motherTongue: initialFilters.motherTongue || 'any',
    education: 'any',
    income: 'any'
  });

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const executeSearch = async () => {
    if (!currentUser?.profileCompleted) {
      if (onOpenCreateProfile) {
        onOpenCreateProfile();
      }
      return;
    }
    setLoading(true);
    try {
      const res = await api.getProfiles(filters);
      if (res.success) {
        let list = res.data;
        if (sortBy === 'age_asc') {
          list = [...list].sort((a, b) => a.age - b.age);
        } else if (sortBy === 'age_desc') {
          list = [...list].sort((a, b) => b.age - a.age);
        }
        setProfiles(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.profileCompleted) {
      executeSearch();
    }
  }, [filters, sortBy, currentUser?.profileCompleted]);

  const handleReset = () => {
    setFilters({
      gender: 'any',
      minAge: 20,
      maxAge: 40,
      religion: 'any',
      motherTongue: 'any',
      education: 'any',
      income: 'any'
    });
  };

  return (
    <div className="search-page-container" style={{ background: '#FAF7F5', minHeight: '80vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Page Banner Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="section-subtitle">Intelligent Matchmaking</span>
          <h1 className="section-title">Search Compatible Matches</h1>
          <p className="section-desc">Filter verified brides and grooms based on cultural, horoscope, and lifestyle preferences.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Left Filter Sidebar */}
          <div style={{
            background: '#FFF',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--romantic-rose-border)',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: '90px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--romantic-rose)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-burgundy-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={18} />
                <span>Filter Matches</span>
              </h3>
              <button onClick={handleReset} style={{ fontSize: '0.8rem', color: 'var(--primary-burgundy)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Looking for */}
            <div style={{ marginBottom: '16px' }}>
              <label className="search-field-label">Looking For</label>
              <select 
                className="search-select" 
                style={{ height: '42px', marginTop: '6px' }}
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              >
                <option value="any">Bride or Groom (Any)</option>
                <option value="female">Bride (Female)</option>
                <option value="male">Groom (Male)</option>
              </select>
            </div>

            {/* Age Range */}
            <div style={{ marginBottom: '16px' }}>
              <label className="search-field-label">Age Range ({filters.minAge} - {filters.maxAge} yrs)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                <select 
                  className="search-select" 
                  style={{ height: '42px' }}
                  value={filters.minAge}
                  onChange={(e) => setFilters({ ...filters, minAge: Number(e.target.value) })}
                >
                  {[20, 22, 24, 26, 28, 30, 32, 35].map(a => <option key={a} value={a}>{a} yrs</option>)}
                </select>
                <select 
                  className="search-select" 
                  style={{ height: '42px' }}
                  value={filters.maxAge}
                  onChange={(e) => setFilters({ ...filters, maxAge: Number(e.target.value) })}
                >
                  {[25, 28, 30, 32, 35, 40, 45, 50].map(a => <option key={a} value={a}>{a} yrs</option>)}
                </select>
              </div>
            </div>

            {/* Religion */}
            <div style={{ marginBottom: '16px' }}>
              <label className="search-field-label">Religion</label>
              <select 
                className="search-select" 
                style={{ height: '42px', marginTop: '6px' }}
                value={filters.religion}
                onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
              >
                <option value="any">All Religions</option>
                <option value="Hindu">Hindu</option>
                <option value="Jain">Jain</option>
                <option value="Sikh">Sikh</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Christian">Christian</option>
                <option value="Muslim">Muslim</option>
              </select>
            </div>

            {/* Mother Tongue */}
            <div style={{ marginBottom: '16px' }}>
              <label className="search-field-label">Mother Tongue</label>
              <select 
                className="search-select" 
                style={{ height: '42px', marginTop: '6px' }}
                value={filters.motherTongue}
                onChange={(e) => setFilters({ ...filters, motherTongue: e.target.value })}
              >
                <option value="any">All Languages</option>
                <option value="Bengali">Bengali</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
                <option value="Malayalam">Malayalam</option>
              </select>
            </div>

            <button onClick={executeSearch} className="btn-burgundy" style={{ width: '100%', marginTop: '10px' }}>
              <span>Apply Filters</span>
            </button>

          </div>

          {/* Right Results Grid */}
          <div>
            
            {/* Results Header Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              background: '#FFF',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--romantic-rose-border)'
            }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>
                Showing <strong>{profiles.length}</strong> Verified Matches
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span>Sort By:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #D1D5DB', background: '#FFF' }}
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="age_asc">Age: Younger First</option>
                  <option value="age_desc">Age: Older First</option>
                </select>
              </div>
            </div>

            {/* Profiles Grid or Locked Gate */}
            {!currentUser?.profileCompleted ? (
              <div style={{
                background: '#FFF',
                border: '1.5px solid var(--romantic-rose-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '60px 30px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#FFF0F3',
                  border: '2px solid var(--romantic-rose-border)',
                  color: 'var(--primary-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto'
                }}>
                  <Lock size={28} />
                </div>
                
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--primary-burgundy-dark)', marginBottom: '10px' }}>
                  Profile Creation Required to View Matches
                </h3>
                
                <p style={{ maxWidth: '480px', margin: '0 auto 24px auto', fontSize: '0.90rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Please complete your 5-step profile first. Once your profile details are saved, verified bride & groom profiles will automatically unlock.
                </p>

                <button 
                  onClick={onOpenCreateProfile} 
                  className="btn-burgundy"
                  style={{ padding: '13px 32px', fontSize: '0.95rem' }}
                >
                  <span>Create Your Profile Now</span>
                </button>
              </div>
            ) : loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading matches...</div>
            ) : profiles.length === 0 ? (
              <div style={{ textAlign: 'center', background: '#FFF', padding: '60px 20px', borderRadius: 'var(--radius-lg)' }}>
                <h3>No profiles match your current filter.</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try broadening your search criteria.</p>
                <button onClick={handleReset} className="btn-burgundy" style={{ marginTop: '16px' }}>Reset Filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {profiles.map(profile => {
                  const isFavorited = shortlistedIds.has(profile.id);

                  return (
                    <div className="profile-card" key={profile.id}>
                      <div className="profile-img-container">
                        <img src={profile.image} alt={profile.name} className="profile-img" />
                      </div>

                      {/* Profile Action */}
                      <div className="profile-info" style={{ padding: '14px 16px 16px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button 
                          onClick={() => onSelectProfile(profile)} 
                          className="profile-btn-view"
                          style={{ 
                            width: '100%', 
                            maxWidth: '180px',
                            padding: '9px 16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

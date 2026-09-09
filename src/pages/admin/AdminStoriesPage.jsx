import React, { useState, useEffect } from 'react';
import { Heart, Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    coupleNames: '',
    marriageYear: 'Married in 2024',
    location: 'Kolkata, WB',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
    story: '',
    highlight: 'Verified Match'
  });

  const loadStories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getStories();
      if (res.success) setStories(res.data);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await adminService.createStory(formData);
    if (res.success) {
      setStories(prev => [res.data, ...prev]);
      setIsAddModalOpen(false);
      setFormData({
        coupleNames: '',
        marriageYear: 'Married in 2024',
        location: 'Kolkata, WB',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
        story: '',
        highlight: 'Verified Match'
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this wedding story?')) {
      const res = await adminService.deleteStory(id);
      if (res.success) {
        setStories(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  return (
    <div>
      
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Success Stories CMS</h1>
          <p className="admin-page-subtitle">Manage wedding stories and real couple testimonials showcased on the public website.</p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="admin-btn-primary">
          <Plus size={16} />
          <span>Add Wedding Story</span>
        </button>
      </div>

      {/* Stories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {stories.map(story => (
          <div key={story.id} className="admin-card" style={{ marginBottom: 0 }}>
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
              <img 
                src={story.image} 
                alt={story.coupleNames} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <span style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'rgba(23, 2, 8, 0.8)',
                color: 'var(--accent-gold-light)',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                {story.marriageYear}
              </span>
            </div>

            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-burgundy-dark)', fontSize: '1.15rem' }}>
                  {story.coupleNames}
                </h3>
                <button 
                  onClick={() => handleDelete(story.id)}
                  className="admin-btn-icon delete-btn"
                  title="Delete Story"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginBottom: '10px' }}>
                📍 {story.location} • 💍 {story.highlight}
              </div>

              <p style={{ fontSize: '0.84rem', color: '#4A3E42', lineHeight: 1.5 }}>
                "{story.story}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Story Modal */}
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
            maxWidth: '540px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-burgundy-dark)', fontSize: '1.3rem' }}>
                Add New Wedding Story
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Couple Names</label>
                <input 
                  type="text" 
                  required 
                  className="admin-form-input" 
                  placeholder="e.g. Tanmoy & Rupsha Das"
                  value={formData.coupleNames}
                  onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label className="admin-form-label">Marriage Timeline</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    placeholder="Married in Jan 2024"
                    value={formData.marriageYear}
                    onChange={(e) => setFormData({ ...formData, marriageYear: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Location</label>
                  <input 
                    type="text" 
                    className="admin-form-input" 
                    placeholder="Kolkata & Howrah"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="admin-form-label">Photo URL</label>
                <input 
                  type="url" 
                  className="admin-form-input" 
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="admin-form-label">Wedding Testimonial Story</label>
                <textarea 
                  rows="3" 
                  required
                  className="admin-form-input" 
                  placeholder="Write the couple's matrimonial journey..."
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #CCC', background: '#FFF', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <span>Publish Story</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

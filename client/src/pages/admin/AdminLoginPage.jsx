import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@saptaganga.com');
  const [password, setPassword] = useState('SaptagangaAdmin2026');
  const [pin, setPin] = useState('7777');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await adminService.login(email, password, pin);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Authentication failed. Please check credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        
        {/* Gold Seal Header */}
        <div className="admin-login-seal">
          <ShieldCheck size={32} />
        </div>

        <h1 className="admin-login-title">SAPTAGANGA</h1>
        <p className="admin-login-sub">Administrative Control Portal</p>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#DC2626',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '18px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Admin Email or Username</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                className="admin-form-input"
                placeholder="admin@saptaganga.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Password</label>
            <input 
              type="password"
              className="admin-form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Security Master PIN</label>
            <input 
              type="password"
              maxLength="4"
              className="admin-form-input"
              placeholder="7777"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '4px' }}>
              Default Master PIN: <strong>7777</strong> | Password: <strong>admin123</strong>
            </span>
          </div>

          <button 
            type="submit" 
            className="admin-btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }}
            disabled={loading}
          >
            <Lock size={16} />
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} />
            <span>Return to Public Website</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

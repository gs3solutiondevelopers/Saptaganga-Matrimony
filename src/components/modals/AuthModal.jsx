import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export default function AuthModal({ initialMode = 'register', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    profileFor: 'Self',
    fullName: '',
    gender: 'female',
    dob: '1998-05-15',
    religion: 'Hindu',
    motherTongue: 'Bengali',
    education: 'B.Tech / MCA / Graduate',
    profession: 'Software Engineer',
    annualIncome: '₹15 - 20 LPA',
    city: 'Kolkata',
    emailOrPhone: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailOrPhone || !formData.password) {
      setError('Please enter your email/phone and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.loginUser({
        emailOrPhone: formData.emailOrPhone,
        password: formData.password
      });
      if (res.success) {
        onSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.registerUser(formData);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '520px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--romantic-rose)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-burgundy)' }}>
              💍
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-burgundy-dark)' }}>
              {mode === 'login' ? 'Member Login' : 'Create Free Matrimony Profile'}
            </span>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle between Login and Register */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <button
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: mode === 'login' ? 'var(--primary-burgundy)' : 'var(--text-muted)',
              borderBottom: mode === 'login' ? '2.5px solid var(--primary-burgundy)' : '2.5px solid transparent',
              background: mode === 'login' ? '#FFF' : 'transparent'
            }}
          >
            Login
          </button>

          <button
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: mode === 'register' ? 'var(--primary-burgundy)' : 'var(--text-muted)',
              borderBottom: mode === 'register' ? '2.5px solid var(--primary-burgundy)' : '2.5px solid transparent',
              background: mode === 'register' ? '#FFF' : 'transparent'
            }}
          >
            Register Free
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {error && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {/* ---------------- LOGIN FORM ---------------- */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label className="search-field-label">Email Address or Mobile Number</label>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <input 
                    type="text" 
                    name="emailOrPhone"
                    className="search-input"
                    placeholder="e.g. user@gmail.com or 9876543210"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="search-field-label">Password</label>
                  <a href="#" style={{ fontSize: '0.78rem', color: 'var(--primary-burgundy)' }}>Forgot Password?</a>
                </div>
                <div style={{ position: 'relative', marginTop: '6px' }}>
                  <input 
                    type="password" 
                    name="password"
                    className="search-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-burgundy" 
                style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-md)' }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In to Saptaganga'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                New to Saptaganga Matrimony?{' '}
                <button 
                  type="button" 
                  onClick={() => setMode('register')}
                  style={{ color: 'var(--primary-burgundy)', fontWeight: 700 }}
                >
                  Register Free
                </button>
              </div>
            </form>
          ) : (
            /* ---------------- MULTI-STEP REGISTRATION FORM ---------------- */
            <form onSubmit={handleRegisterSubmit}>
              
              {/* Step Progress Bar */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-burgundy)', marginBottom: '6px' }}>
                  <span>Step {step} of 3</span>
                  <span>{step === 1 ? 'Personal Info' : step === 2 ? 'Education & Career' : 'Account Setup'}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(step / 3) * 100}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--primary-burgundy) 0%, var(--accent-gold) 100%)',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
              </div>

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div>
                  <div style={{ marginBottom: '14px' }}>
                    <label className="search-field-label">Creating Profile For</label>
                    <select 
                      name="profileFor" 
                      value={formData.profileFor} 
                      onChange={handleChange} 
                      className="search-select"
                    >
                      <option value="Self">Self (নিজে)</option>
                      <option value="Son">Son (ছেলে)</option>
                      <option value="Daughter">Daughter (মেয়ে)</option>
                      <option value="Brother">Brother (ভাই)</option>
                      <option value="Sister">Sister (বোন)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label className="search-field-label">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="Candidate's Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="search-input"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label className="search-field-label">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="search-select">
                        <option value="female">Bride (Female)</option>
                        <option value="male">Groom (Male)</option>
                      </select>
                    </div>
                    <div>
                      <label className="search-field-label">Mother Tongue</label>
                      <select name="motherTongue" value={formData.motherTongue} onChange={handleChange} className="search-select">
                        <option value="Bengali">Bengali (বাংলা)</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Tamil">Tamil (தமிழ்)</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Marathi">Marathi</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label className="search-field-label">Religion</label>
                    <select name="religion" value={formData.religion} onChange={handleChange} className="search-select">
                      <option value="Hindu">Hindu (হিন্দু)</option>
                      <option value="Jain">Jain (জৈন)</option>
                      <option value="Sikh">Sikh (শিখ)</option>
                      <option value="Buddhist">Buddhist</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Education & Career */}
              {step === 2 && (
                <div>
                  <div style={{ marginBottom: '14px' }}>
                    <label className="search-field-label">Highest Qualification</label>
                    <input 
                      type="text" 
                      name="education"
                      placeholder="e.g. B.Tech / MBA / MBBS / CA"
                      value={formData.education}
                      onChange={handleChange}
                      className="search-input"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label className="search-field-label">Profession / Job Title</label>
                    <input 
                      type="text" 
                      name="profession"
                      placeholder="e.g. Software Engineer / Doctor / Business"
                      value={formData.profession}
                      onChange={handleChange}
                      className="search-input"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label className="search-field-label">Annual Income</label>
                      <select name="annualIncome" value={formData.annualIncome} onChange={handleChange} className="search-select">
                        <option value="₹5 - 10 LPA">₹5 - 10 LPA</option>
                        <option value="₹10 - 15 LPA">₹10 - 15 LPA</option>
                        <option value="₹15 - 25 LPA">₹15 - 25 LPA</option>
                        <option value="₹25 - 50 LPA">₹25 - 50 LPA</option>
                        <option value="₹50+ LPA">₹50+ LPA</option>
                      </select>
                    </div>
                    <div>
                      <label className="search-field-label">Current City</label>
                      <input 
                        type="text" 
                        name="city"
                        placeholder="e.g. Kolkata / Delhi"
                        value={formData.city}
                        onChange={handleChange}
                        className="search-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Account & Password */}
              {step === 3 && (
                <div>
                  <div style={{ marginBottom: '14px' }}>
                    <label className="search-field-label">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="search-input"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label className="search-field-label">Mobile Number (For OTP Verification)</label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="search-input"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label className="search-field-label">Create Secure Password</label>
                    <input 
                      type="password" 
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className="search-input"
                      required
                    />
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    By clicking Complete Registration, you agree to Saptaganga Matrimony's Terms of Use & Privacy Policy.
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {step > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setStep(step - 1)}
                    className="btn-outline-burgundy"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                )}

                <button 
                  type="submit" 
                  className="btn-burgundy"
                  style={{ flex: 2, height: '48px', borderRadius: 'var(--radius-md)' }}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : step < 3 ? 'Continue to Next Step' : 'Complete Registration 🎉'}
                  {step < 3 && <ArrowRight size={16} />}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}

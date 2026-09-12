import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, ShieldCheck, ArrowRight, ArrowLeft, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export default function AuthModal({ onClose, onSuccess, isGated = false }) {
  // Steps: 'phone' -> 'otp'
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle phone submission -> Request OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.sendPhoneOtp(cleanPhone);
      if (res.success) {
        setGeneratedOtp(res.otp);
        setStep('otp');
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(res.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Error sending OTP. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.sendPhoneOtp(phone);
      if (res.success) {
        setGeneratedOtp(res.otp);
        setTimer(30);
        setCanResend(false);
      } else {
        setError(res.error || 'Failed to resend OTP.');
      }
    } catch {
      setError('Error resending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input box
    if (val && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6 && enteredOtp !== '123456') {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.verifyPhoneOtp(phone, enteredOtp, {
        name: name || undefined
      });

      if (res.success) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onSuccess) onSuccess(res.user);
        if (onClose) onClose();
      } else {
        setError(res.error || 'Invalid OTP code.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fill Demo OTP
  const handleQuickFillDemoOtp = () => {
    const targetOtp = (generatedOtp || '123456').padEnd(6, '0').slice(0, 6);
    setOtp(targetOtp.split(''));
  };

  return (
    <div className="modal-overlay" onClick={isGated ? undefined : onClose}>
      <div 
        className="modal-content auth-otp-modal-box" 
        style={{ maxWidth: '440px', padding: '0', overflow: 'hidden', borderRadius: '24px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Saptaganga Logo & Name */}
        <div style={{
          background: '#FFF0F3',
          borderBottom: '1px solid rgba(120, 14, 47, 0.12)',
          padding: '24px 24px 20px 24px',
          color: '#780E2F',
          position: 'relative',
          textAlign: 'center'
        }}>
          {!isGated && (
            <button 
              className="modal-close-btn" 
              onClick={onClose} 
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#780E2F',
                background: 'rgba(120, 14, 47, 0.08)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}

          {/* Saptaganga Official Brand Logo Emblem */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '10px'
          }}>
            <img 
              src="/logo-emblem.png" 
              alt="Saptaganga Matrimony" 
              style={{
                height: '48px',
                width: 'auto',
                filter: 'drop-shadow(0 2px 4px rgba(120, 14, 47, 0.12))'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#780E2F',
                letterSpacing: '1px',
                lineHeight: 1.1
              }}>
                SAPTAGANGA
              </div>
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#9B1B3C',
                letterSpacing: '2.5px',
                textTransform: 'uppercase'
              }}>
                MATRIMONY
              </div>
            </div>
          </div>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.84rem',
            color: '#6B5A60',
            margin: '0',
            lineHeight: 1.4
          }}>
            {step === 'phone' 
              ? 'Enter your mobile number to access the website' 
              : `Enter the 6-digit code sent to +91 ${phone}`}
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
          
          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #FCA5A5'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-sans)'
                }}>
                  Mobile Number
                </label>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#FDF7F8',
                  border: '1.5px solid var(--romantic-rose-border)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '12px 14px',
                    background: '#F5E6EA',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: 'var(--primary-burgundy-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRight: '1px solid var(--romantic-rose-border)'
                  }}>
                    <span>IN +91</span>
                  </div>

                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit number"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      padding: '12px 16px',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      outline: 'none',
                      letterSpacing: '1px'
                    }}
                  />
                </div>
              </div>

              {/* Optional Name field */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  marginBottom: '6px'
                }}>
                  Your Name (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Subhajit Mukherjee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    fontSize: '0.9rem',
                    outline: 'none',
                    background: '#FAFAFA'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: phone.length === 10 
                    ? 'linear-gradient(135deg, #780E2F 0%, #52081E 100%)' 
                    : '#D1D5DB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  cursor: phone.length === 10 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: phone.length === 10 ? '0 4px 14px rgba(115, 15, 45, 0.28)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? (
                  <span>Sending OTP...</span>
                ) : (
                  <>
                    <span>Get OTP Code</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <div style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '0.78rem',
                color: '#6B7280'
              }}>
                🔒 Your mobile number is 100% secure with Saptaganga Matrimony.
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              
              {/* Demo / Live OTP helper banner for seamless testing */}
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontSize: '0.82rem', color: '#92400E' }}>
                  💡 Test Code: <strong>{generatedOtp || '123456'}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFillDemoOtp}
                  style={{
                    background: '#F59E0B',
                    color: '#FFF',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Auto-Fill
                </button>
              </div>

              {/* 6-box OTP inputs */}
              <div 
                className="auth-otp-input-group"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '6px',
                  marginBottom: '20px'
                }}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="auth-otp-input-box"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      maxWidth: '46px',
                      height: '50px',
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--primary-burgundy-dark)',
                      background: '#FDF7F8',
                      border: digit ? '2px solid var(--primary-burgundy)' : '1.5px solid var(--romantic-rose-border)',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      padding: 0
                    }}
                  />
                ))}
              </div>

              {/* Resend & Edit Phone Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
                marginBottom: '22px'
              }}>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-burgundy)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Change Number</span>
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-gold-dark)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCw size={13} />
                    <span>Resend OTP</span>
                  </button>
                ) : (
                  <span style={{ color: '#9CA3AF' }}>
                    Resend in <strong>{timer}s</strong>
                  </span>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: otp.join('').length === 6 
                    ? 'linear-gradient(135deg, #780E2F 0%, #52081E 100%)' 
                    : '#D1D5DB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: otp.join('').length === 6 ? '0 4px 14px rgba(115, 15, 45, 0.28)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? (
                  <span>Verifying OTP...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Verify & Access Website</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

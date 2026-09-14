import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, KeyRound, Building2, 
  User, CheckCircle2, Eye, EyeOff, Sparkles, Zap, ArrowRight, Check,
  Cpu, Flame, Layers
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AuthPage({ initialRole = 'officer', initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginOfficer, registerOfficer, loginBidder, registerBidder, isAuthenticated, isOfficer, isBidder } = useAuth();

  // Role: 'officer' | 'bidder'
  const [role, setRole] = useState(() => {
    if (location.pathname.includes('bidder')) return 'bidder';
    if (location.pathname.includes('officer')) return 'officer';
    const params = new URLSearchParams(location.search);
    return params.get('role') || initialRole;
  });

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState(() => {
    if (location.pathname.includes('register') || location.pathname.includes('signup')) return 'register';
    const params = new URLSearchParams(location.search);
    return params.get('mode') || initialMode;
  });

  useEffect(() => {
    if (location.pathname.includes('bidder')) setRole('bidder');
    else if (location.pathname.includes('officer')) setRole('officer');

    if (location.pathname.includes('register') || location.pathname.includes('signup')) setMode('register');
    else if (location.pathname.includes('login')) setMode('login');
  }, [location.pathname]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      if (isOfficer) navigate('/dashboard', { replace: true });
      else if (isBidder) navigate('/bidder-portal', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isOfficer, isBidder, navigate]);

  // Form Fields
  const [email, setEmail] = useState('akshay.gupta@cpcl.gov.in');
  const [password, setPassword] = useState('Officer@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState('officer');

  // Officer Register Form
  const [officerForm, setOfficerForm] = useState({
    fullName: '',
    email: '',
    password: '',
    employeeId: '',
    designation: 'Procurement Officer',
    department: 'Refinery Materials Division',
    phone: ''
  });
  const [officerRegSuccess, setOfficerRegSuccess] = useState(false);

  // Bidder Register Form
  const [bidderForm, setBidderForm] = useState({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gstin: '',
    pan: '',
    registrationNumber: '',
    msmeClassification: 'Medium (Class-II)',
    udyamNumber: '',
    address: '',
    state: 'Tamil Nadu'
  });
  const [bidderRegSuccess, setBidderRegSuccess] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingApproval, setPendingApproval] = useState(false);

  // Switch Role
  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setError(null);
    setPendingApproval(false);
    if (newRole === 'officer') {
      setEmail('akshay.gupta@cpcl.gov.in');
      setPassword('Officer@2026');
      setSelectedDemo('officer');
    } else {
      setEmail('contact@shaktienterprises.com');
      setPassword('Bidder@2026');
      setSelectedDemo('shakti');
    }
    navigate(`/${newRole}/${mode === 'register' ? 'register' : 'login'}`, { replace: true });
  };

  // Switch Mode
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError(null);
    setPendingApproval(false);
    navigate(`/${role}/${newMode === 'register' ? 'register' : 'login'}`, { replace: true });
  };

  // Select Demo Account
  const handleSelectDemo = (type) => {
    setSelectedDemo(type);
    setError(null);
    setPendingApproval(false);
    if (type === 'officer') {
      setEmail('akshay.gupta@cpcl.gov.in');
      setPassword('Officer@2026');
    } else if (type === 'pending') {
      setEmail('priya.sharma@cpcl.gov.in');
      setPassword('Officer@2026');
    } else if (type === 'admin') {
      setEmail('admin@cpcl.gov.in');
      setPassword('CPCL@admin2026');
    } else if (type === 'shakti') {
      setEmail('contact@shaktienterprises.com');
      setPassword('Bidder@2026');
    } else if (type === 'precision') {
      setEmail('bids@precisiontools.in');
      setPassword('Bidder@2026');
    }
  };

  // Autofill registration forms
  const autofillOfficer = () => {
    const id = Math.floor(1000 + Math.random() * 9000);
    setOfficerForm({
      fullName: 'Vikramaditya Verma',
      email: `vikram.verma${id}@cpcl.gov.in`,
      password: 'Officer@2026',
      employeeId: `CPCL-${id}`,
      designation: 'Senior Procurement Officer',
      department: 'Technical Evaluation Committee',
      phone: '+91 94440 23456'
    });
  };

  const autofillBidder = () => {
    const id = Math.floor(100 + Math.random() * 900);
    setBidderForm({
      companyName: `Apex Engineering ${id} Pvt Ltd`,
      fullName: 'Rajeshwer Rao',
      email: `tenders@apex${id}.in`,
      password: 'Bidder@2026',
      phone: '+91 98410 87654',
      gstin: `33AAICA${id}1Z5`,
      pan: `AAICA${id}F`,
      registrationNumber: `U28112TN2020PTC${id}`,
      msmeClassification: 'Medium (Class-II)',
      udyamNumber: `UDYAM-TN-02-${id}45`,
      address: 'Industrial Estate, Guindy',
      state: 'Tamil Nadu'
    });
  };

  // Submit Handler
  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setPendingApproval(false);

    try {
      if (role === 'officer') {
        await loginOfficer({ email, password });
        navigate('/dashboard');
      } else {
        await loginBidder({ email, password });
        navigate('/bidder-portal');
      }
    } catch (err) {
      if (err.data && err.data.status === 'PENDING_APPROVAL') {
        setPendingApproval(true);
      } else {
        setError(err.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerRegister = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerOfficer(officerForm);
      setOfficerRegSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleBidderRegister = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerBidder(bidderForm);
      setBidderRegSuccess(true);
    } catch (err) {
      setError(err.message || 'Vendor onboarding failed.');
    } finally {
      setLoading(false);
    }
  };

  const isOfficerRole = role === 'officer';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F6FB',
      color: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle clean ambient gradient */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.10) 0%, rgba(248, 250, 252, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Clean Enterprise Top Bar */}
      <header style={{
        height: '64px',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '16px',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
          }}>
            ⚡
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              BidVerify <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>AI</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>CPCL · Ministry of Petroleum & Natural Gas</div>
          </div>
        </div>

        <Link to="/home" style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#475569',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '7px 16px',
          borderRadius: '10px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.15s ease'
        }}>
          <ArrowLeft size={14} /> Back to Portal
        </Link>
      </header>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 860px) {
          .auth-card-wrapper {
            flex-direction: column !important;
            max-width: 460px !important;
            min-height: auto !important;
          }
          .auth-hero-pane {
            display: none !important;
          }
          .auth-form-pane {
            width: 100% !important;
            padding: 28px 20px !important;
          }
        }
      `}</style>

      {/* Main Split-Screen Workspace */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="auth-card-wrapper" style={{
          width: '100%',
          maxWidth: '1060px',
          minHeight: '620px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          boxShadow: '0 24px 50px -20px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          overflow: 'hidden'
        }}>
          
          {/* ─── LEFT: EXECUTIVE HERO VISUAL CARD ───────────────────────────── */}
          <div className="auth-hero-pane" style={{
            width: '46%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '36px',
            background: 'linear-gradient(145deg, #EAF3FF 0%, #F8FBFF 55%, #EEF8F6 100%)',
            borderRight: '1px solid #D9E2F0'
          }}>
            {/* Background 3D Artwork */}
            <img
              src="/auth-hero.jpg"
              alt="GenZ AI Visual"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.28,
                mixBlendMode: 'multiply',
                pointerEvents: 'none'
              }}
            />

            {/* Top Badge */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #CFE0F5',
                fontSize: '11px',
                fontWeight: 700,
                color: '#1D4ED8',
                letterSpacing: '0.03em'
              }}>
                <Sparkles size={12} color="#a855f7" /> Next-Gen Procurement AI
              </span>
            </div>

            {/* Bottom Glass Tag */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              padding: '20px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #D9E2F0',
              boxShadow: '0 12px 28px rgba(37, 99, 235, 0.10)'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Instant Scrutiny. Zero Fraud.
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                High-speed OCR & automated CA UDIN verification powered by sovereign intelligence.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0369A1', background: '#E0F2FE', padding: '3px 8px', borderRadius: '6px' }}>
                  ⚡ 1.4s OCR
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#6D28D9', background: '#F3E8FF', padding: '3px 8px', borderRadius: '6px' }}>
                  🔒 SHA-256
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#047857', background: '#D1FAE5', padding: '3px 8px', borderRadius: '6px' }}>
                  ✓ 99.2% Accuracy
                </span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: MODERN ENTERPRISE AUTH FORM ─────────────────────── */}
          <div className="auth-form-pane" style={{
            width: '54%',
            padding: '44px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: '#FFFFFF',
            overflowY: 'auto'
          }}>
            <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
              
              {/* Clean Role Switcher (Pill Style) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                padding: '4px',
                background: '#F1F5F9',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                marginBottom: '24px'
              }}>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('officer')}
                  style={{
                    padding: '9px',
                    borderRadius: '9px',
                    border: 'none',
                    background: isOfficerRole ? '#2563EB' : 'transparent',
                    color: isOfficerRole ? '#FFFFFF' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: isOfficerRole ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ShieldCheck size={15} /> Officer Portal
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('bidder')}
                  style={{
                    padding: '9px',
                    borderRadius: '9px',
                    border: 'none',
                    background: !isOfficerRole ? '#2563EB' : 'transparent',
                    color: !isOfficerRole ? '#FFFFFF' : '#64748B',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: !isOfficerRole ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Building2 size={15} /> Bidder Portal
                </button>
              </div>

              {/* Title & Mode Switcher */}
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  {mode === 'login' ? 'Welcome back' : 'Create an account'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B' }}>
                  <span>{mode === 'login' ? 'New here?' : 'Already registered?'}</span>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    {mode === 'login' ? (isOfficerRole ? 'Request Access' : 'Register Bidder') : 'Sign In'}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  marginBottom: '18px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Pending Approval Notice */}
              {pendingApproval && (
                <div style={{
                  marginBottom: '18px',
                  padding: '14px',
                  borderRadius: '10px',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  color: '#92400E',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <ShieldCheck size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#B45309', marginBottom: '2px' }}>Awaiting CVO Approval</div>
                    <div style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.4 }}>
                      Your registration is pending security review by the Chief Vigilance Officer.
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────────────────────────── */}
              {/* FORM A: SIGN IN                                          */}
              {/* ──────────────────────────────────────────────────────── */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex' }}>
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@cpcl.gov.in"
                        style={{
                          width: '100%',
                          height: '44px',
                          padding: '0 14px 0 42px',
                          fontSize: '13.5px',
                          color: '#0F172A',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '10px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'all 0.15s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563EB';
                          e.target.style.background = '#FFFFFF';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E2E8F0';
                          e.target.style.background = '#F8FAFC';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Password
                      </label>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                        {isOfficerRole ? 'SHA-256' : 'Encrypted'}
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex' }}>
                        <Lock size={16} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        style={{
                          width: '100%',
                          height: '44px',
                          padding: '0 42px 0 42px',
                          fontSize: '13.5px',
                          color: '#0F172A',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '10px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'all 0.15s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#2563EB';
                          e.target.style.background = '#FFFFFF';
                          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E2E8F0';
                          e.target.style.background = '#F8FAFC';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px'
                        }}
                        title={showPassword ? 'Hide' : 'Show'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        height: '44px',
                        background: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {loading ? (
                        <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%' }} className="anim-spin" />
                      ) : (
                        <>
                          Sign In <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleLoginSubmit}
                      disabled={loading}
                      style={{
                        height: '44px',
                        padding: '0 16px',
                        background: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE',
                        borderRadius: '10px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                      title="1-Click Instant Demo Login"
                    >
                      <Zap size={14} color="#2563EB" />
                      1-Click Login
                    </button>
                  </div>
                </form>
              )}

              {/* ──────────────────────────────────────────────────────── */}
              {/* FORM B: REGISTRATION                                    */}
              {/* ──────────────────────────────────────────────────────── */}
              {mode === 'register' && (
                <div>
                  {(officerRegSuccess || bidderRegSuccess) ? (
                    <div style={{ padding: '24px 0', textAlign: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '1px solid #BBF7D0' }}>
                        <CheckCircle2 size={24} />
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>Registration Logged!</h3>
                      <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '320px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                        {isOfficerRole ? 'Submitted for CVO security clearance.' : 'Vendor account created. Ready for procurement.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => isOfficerRole ? handleModeSwitch('login') : navigate('/bidder-portal')}
                        style={{ height: '42px', padding: '0 22px', background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                      >
                        {isOfficerRole ? 'Go to Sign In' : 'Enter Portal'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={isOfficerRole ? handleOfficerRegister : handleBidderRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                          {isOfficerRole ? 'Official Officer Data' : 'Corporate Details'}
                        </span>
                        <button
                          type="button"
                          onClick={isOfficerRole ? autofillOfficer : autofillBidder}
                          style={{ background: 'none', border: 'none', fontSize: '11px', color: '#2563EB', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Sparkles size={12} color="#F59E0B" /> Auto-fill Demo
                        </button>
                      </div>

                      {isOfficerRole ? (
                        <>
                          <input
                            type="text"
                            required
                            value={officerForm.fullName}
                            onChange={(e) => setOfficerForm({ ...officerForm, fullName: e.target.value })}
                            placeholder="Full Legal Name"
                            style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box' }}
                          />
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <input
                              type="text"
                              required
                              value={officerForm.employeeId}
                              onChange={(e) => setOfficerForm({ ...officerForm, employeeId: e.target.value })}
                              placeholder="Employee ID"
                              style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box' }}
                            />
                            <input
                              type="email"
                              required
                              value={officerForm.email}
                              onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                              placeholder="officer@cpcl.gov.in"
                              style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box' }}
                            />
                          </div>
                          <input
                            type="password"
                            required
                            value={officerForm.password}
                            onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })}
                            placeholder="Set Password (min 8 chars)"
                            style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box' }}
                          />
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            required
                            value={bidderForm.companyName}
                            onChange={(e) => setBidderForm({ ...bidderForm, companyName: e.target.value })}
                            placeholder="Company Legal Name (per ROC)"
                            style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box' }}
                          />
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <input
                              type="text"
                              required
                              value={bidderForm.gstin}
                              onChange={(e) => setBidderForm({ ...bidderForm, gstin: e.target.value.toUpperCase() })}
                              placeholder="GSTIN Number"
                              style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'monospace' }}
                            />
                            <input
                              type="text"
                              required
                              value={bidderForm.pan}
                              onChange={(e) => setBidderForm({ ...bidderForm, pan: e.target.value.toUpperCase() })}
                              placeholder="PAN Number"
                              style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'monospace' }}
                            />
                          </div>
                          <input
                            type="email"
                            required
                            value={bidderForm.email}
                            onChange={(e) => setBidderForm({ ...bidderForm, email: e.target.value })}
                            placeholder="Contact Email"
                            style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box' }}
                          />
                          <input
                            type="password"
                            required
                            value={bidderForm.password}
                            onChange={(e) => setBidderForm({ ...bidderForm, password: e.target.value })}
                            placeholder="Set Password"
                            style={{ width: '100%', height: '40px', padding: '0 12px', fontSize: '12.5px', color: '#0F172A', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', boxSizing: 'border-box' }}
                          />
                        </>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          height: '44px',
                          background: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginTop: '6px',
                          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
                        }}
                      >
                        {loading ? 'Submitting...' : (isOfficerRole ? 'Submit for CVO Clearance' : 'Complete Registration')}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ─── QUICK DEMO TEST PROFILES (Clean minimal chips) ───── */}
              {mode === 'login' && (
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={13} color="#F59E0B" /> Demo Profiles:
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {isOfficerRole ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSelectDemo('officer')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: selectedDemo === 'officer' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                            background: selectedDemo === 'officer' ? '#EFF6FF' : '#F8FAFC',
                            color: selectedDemo === 'officer' ? '#2563EB' : '#475569',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          👔 Akshay (Officer) {selectedDemo === 'officer' && '✓'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectDemo('pending')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: selectedDemo === 'pending' ? '1px solid #F59E0B' : '1px solid #E2E8F0',
                            background: selectedDemo === 'pending' ? '#FFFBEB' : '#F8FAFC',
                            color: selectedDemo === 'pending' ? '#B45309' : '#475569',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          📋 Priya (Pending) {selectedDemo === 'pending' && '✓'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectDemo('admin')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: selectedDemo === 'admin' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                            background: selectedDemo === 'admin' ? '#EFF6FF' : '#F8FAFC',
                            color: selectedDemo === 'admin' ? '#2563EB' : '#475569',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          🛡️ CVO Admin {selectedDemo === 'admin' && '✓'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSelectDemo('shakti')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: selectedDemo === 'shakti' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                            background: selectedDemo === 'shakti' ? '#EFF6FF' : '#F8FAFC',
                            color: selectedDemo === 'shakti' ? '#2563EB' : '#475569',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          🏢 Shakti Enterprises {selectedDemo === 'shakti' && '✓'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectDemo('precision')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: selectedDemo === 'precision' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                            background: selectedDemo === 'precision' ? '#EFF6FF' : '#F8FAFC',
                            color: selectedDemo === 'precision' ? '#2563EB' : '#475569',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          ⚙️ Precision Tools {selectedDemo === 'precision' && '✓'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

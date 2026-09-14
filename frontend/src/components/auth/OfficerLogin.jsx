import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, KeyRound, Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function OfficerLogin({ onBack, onNavigateRegister }) {
  const { loginOfficer } = useAuth();
  const [email, setEmail] = useState('akshay.gupta@cpcl.gov.in');
  const [password, setPassword] = useState('Officer@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingApproval, setPendingApproval] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPendingApproval(false);

    try {
      await loginOfficer({ email, password });
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

  const setDemoCredentials = (type) => {
    if (type === 'officer') {
      setEmail('akshay.gupta@cpcl.gov.in');
      setPassword('Officer@2026');
    } else if (type === 'admin') {
      setEmail('admin@cpcl.gov.in');
      setPassword('CPCL@admin2026');
    } else if (type === 'pending') {
      setEmail('priya.sharma@cpcl.gov.in');
      setPassword('Officer@2026');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 selection:bg-cyan-500/30">
      <div className="max-w-md w-full">
        {/* Header Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sovereign Portal
        </button>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600"></div>

          {/* Logo & Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">CPCL Officer Console</h2>
              <p className="text-xs text-slate-400">Chief Vigilance & Procurement Directorate</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {pendingApproval && (
            <div className="mb-5 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200 mb-0.5">Account Pending CVO Approval</p>
                <p className="text-amber-300/80 leading-relaxed">
                  Your officer registration has been logged and is awaiting security clearance by the Chief Vigilance Officer.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official CPCL Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer.name@cpcl.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Authenticate to Secure Console
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 mb-2">Quick Test Pre-Seeded Profiles:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('officer')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-cyan-300 text-center transition-colors"
              >
                Active Officer
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('pending')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-amber-300 text-center transition-colors"
              >
                Pending Officer
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-purple-300 text-center transition-colors"
              >
                Admin (CVO)
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            New CPCL Procurement Official?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-cyan-400 hover:underline font-semibold"
            >
              Request Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Building2, Mail, Lock, AlertCircle, ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function BidderLogin({ onBack, onNavigateRegister }) {
  const { loginBidder } = useAuth();
  const [email, setEmail] = useState('contact@shaktienterprises.com');
  const [password, setPassword] = useState('Bidder@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginBidder({ email, password });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your enterprise credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (company) => {
    if (company === 'shakti') {
      setEmail('contact@shaktienterprises.com');
      setPassword('Bidder@2026');
    } else if (company === 'precision') {
      setEmail('bids@precisiontools.in');
      setPassword('Bidder@2026');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 selection:bg-cyan-500/30">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sovereign Portal
        </button>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Bidder Enterprise Portal</h2>
              <p className="text-xs text-slate-400">Government Procurement & Tender Submission</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Enterprise Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendor@company.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Portal Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Sign In to Bidder Workspace
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-Seeded Vendors */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 mb-2">Quick Test Pre-Seeded Bidders:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('shakti')}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-emerald-300 text-left transition-colors truncate"
              >
                Shakti Enterprises Pvt Ltd
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('precision')}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-teal-300 text-left transition-colors truncate"
              >
                Precision Tools Ltd
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            New Enterprise Vendor?{' '}
            <button
              onClick={onNavigateRegister}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Register Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

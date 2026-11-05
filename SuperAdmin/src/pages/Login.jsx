import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogIn, Lock, Mail, ShieldCheck, Landmark, 
  Sparkles, ArrowRight, Eye, EyeOff, Globe, 
  CheckCircle2, KeyRound, Server, Zap, ExternalLink,
  Layers, ShieldAlert
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    identifier: 'ryadavy498@gmail.com', 
    password: 'admin@123' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('superadmin_token') || localStorage.getItem('sa_user');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const performBypassLogin = async () => {
    setLoading(true);
    try {
      const ok = await login('ryadavy498@gmail.com', 'admin@123');
      if (ok) {
        Swal.fire({
          icon: 'success',
          title: 'Welcome Super Admin!',
          text: 'Master SaaS Central Command Center Active',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        navigate('/');
        return;
      }
    } catch (e) {
      // Local fallback for offline/demo evaluation
      const demoUser = {
        id: 'root_superadmin',
        name: 'Super Admin Master',
        email: 'ryadavy498@gmail.com',
        role: 'superadmin',
      };
      localStorage.setItem('sa_user', JSON.stringify(demoUser));
      localStorage.setItem('superadmin_token', 'demo_superadmin_jwt_token_valid');
      localStorage.setItem('superadmin_user', JSON.stringify(demoUser));
      
      Swal.fire({
        icon: 'success',
        title: 'Demo Access Granted',
        text: 'SuperAdmin Session Initialized',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.password.trim()) {
      return Swal.fire('Error', 'Please enter your Master ID and Password.', 'warning');
    }

    setLoading(true);

    try {
      const ok = await login(formData.identifier.trim(), formData.password.trim());
      if (ok) {
        Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          text: 'Welcome to SuperAdmin Command Center',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1800,
          timerProgressBar: true
        });
        navigate('/');
        return;
      }
      
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Failed',
        text: 'Credentials did not match. Use Instant One-Click Demo Access.',
        confirmButtonText: 'Use Demo Credentials',
        confirmButtonColor: '#ff5c0a',
        showCancelButton: true
      }).then((res) => {
        if (res.isConfirmed) {
          performBypassLogin();
        }
      });
    } catch (err) {
      const isNetworkError = !err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network');
      if (isNetworkError) {
        performBypassLogin();
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: err?.response?.data?.message || err?.message || 'Authentication failed',
        confirmButtonColor: '#ff5c0a'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = () => {
    setFormData({
      identifier: 'ryadavy498@gmail.com',
      password: 'admin@123'
    });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row font-sans text-slate-800 relative selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* Background Ambient Lighting (Mobile & Desktop) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-orange-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Left Column - High-Tech SaaS Presentation (Desktop Only: lg:flex) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-10 xl:p-14 border-r border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Top Branding Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-13 h-13 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25 ring-1 ring-white/20">
              <Landmark className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                <span>MultiSchool</span>
                <span className="text-orange-500">ERP</span>
              </span>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SuperAdmin Master Suite v3.7</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold mb-4 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Central Cloud Governance Platform</span>
          </div>

          <h1 className="text-white text-3xl xl:text-5xl font-black leading-tight tracking-tight mb-4">
            Master Central <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>

          <p className="text-slate-300 text-sm xl:text-base max-w-md leading-relaxed font-normal">
            Govern registered school branches, manage subscription licensing, provision tenant databases, and inspect live transactions in real time.
          </p>
        </div>

        {/* Middle Feature Cards */}
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-lg my-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
            <div className="w-9 h-9 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-2">
              <Globe className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white">Multi-Tenant Fabric</p>
            <p className="text-[11px] text-slate-400 leading-snug">Instant cluster isolation & tenant database routing</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
            <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white">Bank-Grade Audit</p>
            <p className="text-[11px] text-slate-400 leading-snug">Zero-trust root authentication & 2FA protection</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
            <div className="w-9 h-9 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center mb-2">
              <Server className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white">99.99% Uptime</p>
            <p className="text-[11px] text-slate-400 leading-snug">High availability microservices architecture</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
            <div className="w-9 h-9 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <p className="text-xs font-black text-white">Real-Time Sync</p>
            <p className="text-[11px] text-slate-400 leading-snug">Webhooks & bi-directional telemetry stream</p>
          </div>
        </div>

        {/* Bottom Footer Credit */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-medium pt-4 border-t border-white/10">
          <span>&copy; {new Date().getFullYear()} MultiSchool ERP</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SaaS Gateway Online
          </span>
        </div>
      </div>

      {/* Right Column - Dynamic Interactive Login Form (Responsive on all Media Screens) */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-4 sm:p-8 md:p-12 lg:p-14 bg-white relative z-10 overflow-y-auto">
        
        {/* Mobile Header Branding (Visible on < lg screens) */}
        <div className="lg:hidden flex items-center justify-between pb-6 pt-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                SuperAdmin <span className="text-orange-500">ERP</span>
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Central Console</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        </div>

        {/* Centered Form Wrapper */}
        <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-8 space-y-6">
          
          {/* Header Title */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[11px] font-black uppercase tracking-wider">
              <KeyRound className="w-3.5 h-3.5 text-orange-500" />
              <span>Root Administrative Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to SuperAdmin
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Enter your master platform credentials to access central management.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Identifier (Email / Master ID) */}
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Master ID or Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder="e.g. ryadavy498@gmail.com"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-slate-900 placeholder:text-slate-400"
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Master Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutofill}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                >
                  ⚡ Autofill Default
                </button>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-3 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-slate-900 placeholder:text-slate-400"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Session Options */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-bold select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-300 cursor-pointer accent-orange-500" 
                />
                <span>Keep Master Session Active</span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border border-orange-400/30"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>{loading ? 'Authenticating Session...' : 'Sign In to SuperAdmin'}</span>
            </button>
          </form>

          {/* Quick Demo Access Box (Responsive card) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-orange-50/80 border border-orange-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-orange-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Instant Evaluation Credentials</span>
              </span>
              <span className="text-[10px] font-black text-orange-700 bg-white px-2 py-0.5 rounded-full border border-orange-200 shadow-3xs">
                Root Admin
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-800 font-mono font-bold bg-white px-3 py-2 rounded-xl border border-orange-100 shadow-3xs">
              <span className="truncate">ryadavy498@gmail.com</span>
              <span className="text-orange-600">admin@123</span>
            </div>
            
            <button
              type="button"
              onClick={performBypassLogin}
              disabled={loading}
              className="w-full py-2.5 bg-white hover:bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-wider rounded-xl border border-orange-200 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>One-Click Instant Demo Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Other Portal Links for Multi-Portal Navigation */}
          <div className="pt-2">
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Looking for dedicated sub-panels?
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a 
                href="https://sms-frontend-by-raj-serp.onrender.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 flex items-center justify-between font-bold text-slate-700 transition-colors group"
              >
                <span>School Admin ERP</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-orange-500 transition-colors" />
              </a>
              <a 
                href="https://sms-frontend-by-raj-4.onrender.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 flex items-center justify-between font-bold text-slate-700 transition-colors group"
              >
                <span>Landing Hub</span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-orange-500 transition-colors" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Credit & Copyright */}
        <div className="pt-6 pb-2 text-center text-xs text-slate-400 border-t border-slate-100">
          <p className="font-medium">&copy; {new Date().getFullYear()} Multi-School ERP SaaS Platform. All rights reserved.</p>
          <p className="font-semibold text-slate-500 mt-1">
            Engineered by <span className="text-orange-500 font-bold">RAJ YADAV</span> @ALLCORE SOLUTION
          </p>
        </div>

      </div>

    </div>
  );
};

export default Login;

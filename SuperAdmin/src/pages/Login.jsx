import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogIn, Lock, Mail, ShieldCheck, Landmark, 
  Sparkles, ArrowRight, Eye, EyeOff, Globe 
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
          text: 'Logged into SaaS Central Command Center',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        navigate('/');
      }
    } catch (e) {
      // Force local fallback if network offline
      const demoUser = {
        id: 'demo_superadmin',
        name: 'Super Admin Master',
        email: 'ryadavy498@gmail.com',
        role: 'superadmin',
      };
      localStorage.setItem('sa_user', JSON.stringify(demoUser));
      localStorage.setItem('superadmin_token', 'demo_superadmin_jwt_token');
      Swal.fire({
        icon: 'success',
        title: 'Demo Access Granted',
        text: 'Offline Super Admin Session Activated',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ok = await login(formData.identifier, formData.password);
      if (ok) {
        Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          text: 'Welcome to SuperAdmin Command Center',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        navigate('/');
        return;
      }
      
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Failed',
        text: 'Invalid credentials. You can use Demo Admin Access.',
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

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex font-sans">
      
      {/* Left Side - Modern Visual Branding (Dark Theme with Orange / Amber Accents) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0b101d] via-[#101728] to-[#070b14] relative flex-col justify-between p-12 xl:p-14 overflow-hidden items-start border-r border-slate-800">
        
        {/* Ambient Glows */}
        <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] bg-orange-600/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[110px] pointer-events-none"></div>

        <div className="relative z-10 w-full">
          {/* Brand Icon */}
          <div className="w-14 h-14 bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/25 ring-1 ring-white/20">
            <Landmark className="w-8 h-8 text-white" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-semibold mb-4 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Multi-School Central Cloud Platform</span>
          </div>

          <h1 className="text-white text-4xl xl:text-5xl font-black leading-tight mb-5 tracking-tight">
            Central Command <br />
            <span className="bg-gradient-to-r from-[#ff5c0a] via-amber-300 to-[#ff9e59] bg-clip-text text-transparent">
              Super Admin SaaS Hub
            </span>
          </h1>
          <p className="text-slate-300 text-sm xl:text-base max-w-md leading-relaxed font-normal">
            Govern multi-branch school networks, manage subscription licenses, monitor global student enrollments, and track live multi-tenant transactions in real time.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-lg">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block">Multi-Tenant Cloud</span>
              <span className="text-slate-400 text-[11px]">Real-time Branch Sync</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block">Bank-Grade Security</span>
              <span className="text-slate-400 text-[11px]">Audited Root Access</span>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-[11px] text-slate-400 font-medium">
          Protected by Multi-School ERP SaaS Core • SuperAdmin Portal v3.7
        </div>
      </div>

      {/* Right Side - Interactive Login Form (Crisp Light Theme matching School ERP) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 bg-white relative z-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] rounded-xl flex items-center justify-center shadow-lg">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">SuperAdmin ERP</h1>
              <p className="text-xs text-slate-500">Central SaaS Governance Console</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Super Admin Portal</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in with your master credentials to access the central console.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Master ID / Email Address
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder="e.g. ryadavy498@gmail.com"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a] focus:border-[#ff5c0a] text-sm font-medium transition-all"
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Master Password
              </label>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a] focus:border-[#ff5c0a] text-sm font-medium transition-all"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#ff5c0a] focus:ring-[#ff5c0a] border-slate-300" />
                <span>Remember session</span>
              </label>
              <Link to="/forgot-password" className="text-[#ff5c0a] font-semibold hover:underline cursor-pointer">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] hover:from-[#e85004] hover:to-[#f26e1a] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Authenticating...' : 'Sign In to SuperAdmin'}
            </button>
          </form>

          {/* Demo Access Button & Credentials */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-orange-900 uppercase tracking-wider text-[10px]">Demo Master Credentials</span>
              <span className="text-[10px] font-semibold text-orange-600 bg-white px-2 py-0.5 rounded-full border border-orange-200">
                Ready
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-orange-950 font-mono font-medium bg-white px-3 py-2 rounded-xl border border-orange-100">
              <span>ryadavy498@gmail.com</span>
              <span>admin@123</span>
            </div>
            
            <button
              type="button"
              onClick={performBypassLogin}
              className="w-full py-2 bg-white hover:bg-slate-50 text-[#ff5c0a] text-xs font-bold rounded-xl border border-orange-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff5c0a]" />
              <span>Instant One-Click Demo Access</span>
              <ArrowRight className="w-3 h-3 text-[#ff5c0a]" />
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} Multi-School ERP. All rights reserved.</p>
            <p className="font-semibold text-slate-500 mt-0.5">Built with ❤️ by <span className="text-[#ff5c0a] font-bold">RAJ YADAV</span> @ALLCORE SOLUTION</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

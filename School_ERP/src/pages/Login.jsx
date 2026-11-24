import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { 
  LogIn, Lock, Mail, ShieldCheck, GraduationCap, CheckCircle2, 
  PieChart, Sparkles, ArrowRight, Eye, EyeOff, Building2, Zap, Globe, Headphones 
} from 'lucide-react';
import Swal from 'sweetalert2';
import schoolHeroImg from '../assets/school_erp_login_hero.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: 'ryadavy498@gmail.com', password: 'admin@123' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for direct SuperAdmin impersonation token in URL query
    const params = new URLSearchParams(window.location.search);
    const impToken = params.get('impersonate_token') || params.get('token');
    if (impToken) {
      const impEmail = params.get('email') || 'admin@school.com';
      const impSchoolId = params.get('schoolId') || '6ad9bbe1c6514fd4a43099c6';
      const impSchoolName = params.get('schoolName') || 'ALL CORE SOLUTION School';

      let parsedUser = {
        username: impEmail,
        email: impEmail,
        role: 'admin',
        token: impToken,
        isImpersonated: true,
        impersonatedBy: 'Super Admin (RAJ YADAV)',
        tenant: {
          _id: impSchoolId,
          schoolName: impSchoolName,
          plan: 'Enterprise Pro Suite'
        }
      };

      const userParam = params.get('user');
      if (userParam) {
        try {
          parsedUser = { ...parsedUser, ...JSON.parse(decodeURIComponent(userParam)) };
        } catch (_) {}
      }

      sessionStorage.setItem('token', impToken);
      sessionStorage.setItem('user', JSON.stringify(parsedUser));
      localStorage.setItem('token', impToken);
      localStorage.setItem('user', JSON.stringify(parsedUser));
      localStorage.setItem('schoolId', impSchoolId);
      localStorage.setItem('schoolName', impSchoolName);
      localStorage.setItem('is_impersonated', 'true');

      // Clear query string and redirect to School ERP dashboard
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/');
      return;
    }

    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (token && user) {
      navigate('/');
    }
  }, [navigate]);

  const performBypassLogin = () => {
    const dummyUser = {
      username: 'Raj Yadav (Super Admin)',
      email: 'ryadavy498@gmail.com',
      role: 'admin',
      token: 'demo-school-erp-token-authenticated',
      tenant: {
        _id: '6ad9bbe1c6514fd4a43099c6',
        schoolName: 'ALL CORE SOLUTION',
        plan: 'Enterprise Pro Suite'
      }
    };
    sessionStorage.setItem('token', dummyUser.token);
    sessionStorage.setItem('user', JSON.stringify(dummyUser));
    localStorage.setItem('token', dummyUser.token);
    localStorage.setItem('user', JSON.stringify(dummyUser));
    localStorage.setItem('schoolId', '6ad9bbe1c6514fd4a43099c6');
    localStorage.setItem('schoolName', 'ALL CORE SOLUTION');

    Swal.fire({
      icon: 'success',
      title: 'Access Granted',
      text: 'Welcome to ALL CORE SOLUTION School ERP',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: true
    });

    navigate('/');
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.identifier.trim() || !formData.password.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Credentials Required',
        text: 'Please enter your User ID and Password.',
        confirmButtonColor: '#ff5c0a'
      });
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', {
        empId: formData.identifier.trim(),
        email: formData.identifier.trim(),
        password: formData.password.trim(),
        role: "admin"
      });

      if (res.data?.success) {
        sessionStorage.setItem('token', res.data.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data.data));
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        if (res.data.data.tenant?._id) {
          localStorage.setItem('schoolId', res.data.data.tenant._id);
        }
        if (res.data.data.tenant?.schoolName) {
          localStorage.setItem('schoolName', res.data.data.tenant.schoolName);
        } else {
          localStorage.setItem('schoolName', 'ALL CORE SOLUTION');
        }

        Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          text: 'Welcome to ALL CORE SOLUTION School ERP',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1600,
          timerProgressBar: true
        });

        navigate('/');
        return;
      }
    } catch (err) {
      console.warn('API login attempt failed:', err);
      const isDemoCred = (formData.identifier.trim() === 'ryadavy498@gmail.com' || formData.identifier.trim() === 'admin123@gmail.com') && formData.password.trim() === 'admin@123';

      if (isDemoCred) {
        performBypassLogin();
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: err.response?.data?.message || 'Invalid email or password. Please verify credentials.',
        confirmButtonColor: '#ff5c0a',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row items-center justify-center font-sans text-slate-800 relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      
      {/* Ambient Lighting Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Desktop Left Column: Premium SaaS Showcase (lg+) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 h-screen max-h-screen overflow-hidden relative z-10 flex-col justify-between p-6 xl:p-8 2xl:p-10 border-r border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Top Brand Emblem */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3.5 xl:mb-5">
            <div className="w-10 h-10 xl:w-11 xl:h-11 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-white/20 shrink-0">
              <span className="text-sm xl:text-base font-black tracking-tight text-white font-mono">ACS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg xl:text-xl font-black text-white tracking-tight">
                  ALL CORE <span className="text-orange-500">SOLUTION</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-md">
                  School ERP
                </span>
              </div>
              <p className="text-[10.5px] font-semibold text-slate-400">Enterprise Multi-School ERP Platform</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-semibold mb-2 xl:mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Integrated School Digital Operating System</span>
          </div>

          <h1 className="text-white text-2xl xl:text-3xl font-black leading-tight tracking-tight mb-2">
            Next-Gen Cloud OS for <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Schools &amp; Institutions
            </span>
          </h1>

          <p className="text-slate-300 text-xs xl:text-[13px] max-w-md leading-relaxed font-normal">
            Empower principal leadership, academic faculty, student lifecycle, and automated fee collections across 38 integrated cloud ERP modules.
          </p>
        </div>

        {/* Center: Sleek 3D Preview Frame */}
        <div className="relative z-10 my-2 xl:my-4 rounded-2xl overflow-hidden border border-white/15 shadow-xl shadow-black/70 bg-slate-900/80 backdrop-blur-md group">
          <img 
            src={schoolHeroImg} 
            alt="ALL CORE SOLUTION School ERP Center" 
            className="w-full h-32 xl:h-40 2xl:h-48 object-cover object-center transform group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/10 text-[10.5px] font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus Online &amp; Synchronized</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-[10px] font-black text-orange-300 tracking-wider font-mono">
              SLA 99.99%
            </span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 max-w-md mb-1">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5">
            <div className="w-7 h-7 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Bank-Grade Security</p>
              <p className="text-[10px] text-slate-400">Role RBAC &amp; Audit Trails</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
              <PieChart className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Real-Time Analytics</p>
              <p className="text-[10px] text-slate-400">38 Full Modules Active</p>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10 font-medium">
          <span>&copy; {new Date().getFullYear()} ALL CORE SOLUTION</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Mobile & Tablet Full Container / Desktop Right Column */}
      <div className="w-full lg:w-1/2 xl:w-7/12 min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center items-center p-0 sm:p-4 md:p-6 lg:p-8 xl:p-10 relative z-10 overflow-y-auto">
        
        {/* Tablet / Mobile Frame Chassis */}
        <div className="w-full sm:max-w-[420px] md:max-w-[450px] lg:max-w-md bg-white sm:rounded-[36px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] sm:border-[6px] sm:border-slate-800/90 overflow-hidden flex flex-col relative transition-all min-h-screen sm:min-h-0">
          
          {/* Mobile & Tablet Top Branding Banner (lg:hidden) */}
          <div className="lg:hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-4 pb-7 px-4 relative shrink-0 border-b border-slate-800">
            {/* Top Bar with Status Badge */}
            <div className="flex items-center justify-between z-20 mb-2">
              <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                School ERP Cloud Platform
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Campus Connected
              </span>
            </div>

            {/* Emblem and Platform Title */}
            <div className="flex flex-col items-center text-center my-1 z-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-[1.5px] shadow-lg shadow-orange-500/20 mb-1.5 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-sm font-black tracking-wider bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent font-mono">ACS</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                ALL CORE <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">SOLUTION</span>
              </h1>
              <p className="text-[10.5px] font-bold text-slate-400 tracking-wide mt-1">
                Institutional ERP &amp; Campus Operating System
              </p>
            </div>

            {/* 3D Hero Artwork Preview Card */}
            <div className="mt-2.5 relative rounded-2xl overflow-hidden shadow-md border border-slate-700/60 bg-slate-900 group">
              <img 
                src={schoolHeroImg} 
                alt="School ERP Console" 
                className="w-full h-32 sm:h-36 object-cover object-center group-hover:scale-102 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-white">
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md font-bold text-orange-300 border border-white/10">
                  Principal &amp; Admin Suite
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-mono font-bold border border-emerald-500/30">
                  38 Live Modules
                </span>
              </div>
            </div>

            {/* Vibrant Orange Wave Arc Divider */}
            <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
              <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-6 sm:h-7">
                <path d="M0,15 Q250,55 500,10 L500,50 L0,50 Z" fill="#ff5c0a" opacity="0.95" />
                <path d="M0,25 Q250,65 500,20 L500,50 L0,50 Z" fill="#ffffff" />
              </svg>
            </div>
          </div>

          {/* Form Card Body */}
          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between bg-white text-slate-800">
            
            {/* Header Title (Visible on desktop or subtitle on mobile) */}
            <div className="space-y-1 mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10.5px] font-black uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                <span>School Admin &amp; Staff Access</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Sign In to School ERP
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Enter your administrator ID or verified staff credentials to manage the campus.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              
              {/* User ID / Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  User ID / Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="ryadavy498@gmail.com"
                    required
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5c0a] text-xs sm:text-sm font-semibold transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    System Password <span className="text-rose-500">*</span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5c0a] text-xs sm:text-sm font-semibold transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Session Options */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600 font-bold select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-500 border-slate-300 cursor-pointer accent-orange-500" 
                  />
                  <span>Remember this workstation</span>
                </label>

                <button
                  type="button"
                  onClick={() => setFormData({ identifier: 'ryadavy498@gmail.com', password: 'admin@123' })}
                  className="text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Autofill Credentials
                </button>
              </div>

              {/* Vibrant Gradient Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border border-orange-400/30"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>{loading ? 'Authenticating...' : 'Sign In to School ERP'}</span>
              </button>
            </form>

            {/* Instant Demo Evaluation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={performBypassLogin}
                disabled={loading}
                className="w-full py-2 px-3.5 rounded-xl border border-slate-200 hover:border-orange-200 bg-slate-50/60 hover:bg-orange-50/50 text-slate-600 hover:text-orange-600 text-xs font-bold transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
                  <span>Instant Demo Login (Principal &amp; Admin Access)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Support / Help Callout Card */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2.5 bg-gradient-to-r from-orange-50/50 via-slate-50 to-orange-50/30 p-2.5 rounded-xl border border-orange-200/50">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[#ff5c0a] flex items-center justify-center shrink-0 border border-orange-500/20">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <div className="text-[10.5px] text-slate-600 leading-snug">
                <strong className="text-slate-900 font-bold block">Need Help?</strong>
                Contact central administrator for institutional credentials or support.
              </div>
            </div>

            {/* Footer Credit & Copyright */}
            <div className="pt-2 text-center text-[10.5px] text-slate-400">
              <p className="font-medium">&copy; {new Date().getFullYear()} ALL CORE SOLUTION. All rights reserved.</p>
              <p className="text-slate-400 text-[10px] mt-0.5">
                Lead Architect: <span className="text-slate-700 font-bold">RAJ YADAV</span>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;

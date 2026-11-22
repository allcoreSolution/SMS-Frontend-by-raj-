import React, { useState, useEffect } from 'react';
import { 
  LogIn, Lock, Mail, ShieldCheck, 
  Eye, EyeOff, ArrowRight, Sparkles, 
  Receipt, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';
import accountantLoginHero from '../assets/accountant_login_hero.png';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('accountant@allcoresolution.com');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Check active sessionStorage (redirect if already logged in)
  useEffect(() => {
    const token = sessionStorage.getItem('accountant_token');
    const user = sessionStorage.getItem('accountant_user');
    if (token && user) {
      navigate('/accounts/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (loading) return;

    const loginIdentifier = identifier.trim();

    if (!loginIdentifier || !password.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Credentials Required',
        text: 'Please enter your Accountant Email / Username and Password.',
        confirmButtonColor: '#ff5c0a'
      });
    }

    setLoading(true);

    try {
      const res = await authService.login({
        username: loginIdentifier,
        email: loginIdentifier,
        password: password.trim()
      });

      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          text: 'Welcome to ALL CORE SOLUTION Financial Desk',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1600,
          timerProgressBar: true
        });
        navigate('/accounts/dashboard', { replace: true });
        return;
      }

      // Offline / evaluation fallback for demo credentials
      const isDemo = (loginIdentifier === 'accountant@allcoresolution.com' || loginIdentifier === 'admin@branch.com' || loginIdentifier === 'ryadavy498@gmail.com') && password.trim() === 'admin@123';
      if (isDemo) {
        performDemoBypass();
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: res?.message || 'Invalid username/email or password. Please try again.',
        confirmButtonColor: '#ff5c0a'
      });
    } catch (err) {
      const isDemo = (loginIdentifier === 'accountant@allcoresolution.com' || loginIdentifier === 'admin@branch.com' || loginIdentifier === 'ryadavy498@gmail.com') && password.trim() === 'admin@123';
      if (isDemo) {
        performDemoBypass();
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: err.response?.data?.message || 'Unable to connect to server. Please verify credentials.',
        confirmButtonColor: '#ff5c0a'
      });
    } finally {
      setLoading(false);
    }
  };

  const performDemoBypass = () => {
    const dummyUser = {
      token: 'demo-accountant-token-auth',
      _id: 'acc_demo_6ad9bbe1c6514fd4a43099c6',
      name: 'Hari Kumar',
      email: identifier.trim() || 'accountant@allcoresolution.com',
      role: 'Accountant',
      staffId: 'ACC-001',
      school: {
        name: 'ALL CORE SOLUTION',
        shortName: 'allcore',
        logo: null
      },
      schoolName: 'ALL CORE SOLUTION',
      schoolLogo: null,
      schoolShortName: 'allcore'
    };

    sessionStorage.setItem('accountant_token', dummyUser.token);
    sessionStorage.setItem('accountant_user', JSON.stringify(dummyUser));
    localStorage.setItem('accountant_token', dummyUser.token);
    localStorage.setItem('token', dummyUser.token);
    localStorage.setItem('accountant_user', JSON.stringify(dummyUser));
    localStorage.setItem('schoolName', 'ALL CORE SOLUTION');
    localStorage.setItem('school_info', JSON.stringify(dummyUser.school));

    try {
      window.dispatchEvent(new CustomEvent('school_info_updated', { detail: dummyUser.school }));
      window.dispatchEvent(new CustomEvent('accountant_profile_updated', { detail: dummyUser }));
    } catch (_) {}

    Swal.fire({
      icon: 'success',
      title: 'Access Granted',
      text: 'Welcome to ALL CORE SOLUTION Financial Desk (Evaluation Mode)',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: true
    });

    navigate('/accounts/dashboard', { replace: true });
  };

  const handleQuickDemoLogin = () => {
    setIdentifier('accountant@allcoresolution.com');
    setPassword('admin@123');
    performDemoBypass();
  };

  const handleForgotPassword = async () => {
    const { value: resetEmail } = await Swal.fire({
      title: 'Reset Password',
      text: 'Enter your registered email to receive a verification OTP:',
      input: 'email',
      inputValue: identifier || 'accountant@allcoresolution.com',
      showCancelButton: true,
      confirmButtonText: 'Send Reset OTP',
      confirmButtonColor: '#ff5c0a'
    });

    if (resetEmail) {
      try {
        Swal.fire({
          title: 'Sending OTP...',
          text: 'Contacting server to dispatch reset code...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const res = await authService.forgotPassword(resetEmail);

        if (res && res.success) {
          const { value: formValues } = await Swal.fire({
            title: 'Enter OTP & New Password',
            html: `
              <p style="font-size: 13px; color: #555; margin-bottom: 12px;">OTP verification code sent to <b>${resetEmail}</b></p>
              <input id="swal-otp" class="swal2-input" placeholder="6-digit OTP" maxlength="6" style="text-align: center; font-size: 20px; letter-spacing: 4px; font-weight: bold;">
              <input id="swal-newpass" type="password" class="swal2-input" placeholder="Enter New Password (min 6 chars)">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update Password',
            confirmButtonColor: '#ff5c0a',
            preConfirm: () => {
              const otpVal = document.getElementById('swal-otp')?.value;
              const newPassVal = document.getElementById('swal-newpass')?.value;
              if (!otpVal || !newPassVal) {
                Swal.showValidationMessage('Please fill both OTP and New Password');
                return false;
              }
              if (newPassVal.length < 6) {
                Swal.showValidationMessage('Password must be at least 6 characters');
                return false;
              }
              return { otp: otpVal, newPassword: newPassVal };
            }
          });

          if (formValues) {
            Swal.fire({
              title: 'Resetting Password...',
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading()
            });

            const resetRes = await authService.resetPassword({
              email: resetEmail,
              otp: formValues.otp,
              newPassword: formValues.newPassword
            });

            if (resetRes && resetRes.success) {
              Swal.fire({
                icon: 'success',
                title: 'Password Updated!',
                text: 'Your password has been changed successfully. You can now log in.',
                confirmButtonColor: '#ff5c0a'
              });
              setPassword(formValues.newPassword);
            } else {
              Swal.fire('Error', resetRes?.message || 'Invalid OTP code', 'error');
            }
          }
        } else {
          Swal.fire('Account Note', res?.message || 'Could not verify email', 'warning');
        }
      } catch {
        Swal.fire('Error', 'Could not reach server. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-slate-950 flex font-sans text-slate-800 relative overflow-hidden selection:bg-orange-500 selection:text-white">
      
      {/* Ambient Lighting Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Left Column: Premium SaaS Showcase (Desktop lg+) - FIXED & NON-SCROLLABLE */}
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
                  Accounts
                </span>
              </div>
              <p className="text-[10.5px] font-semibold text-slate-400">Enterprise Multi-School ERP Platform</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-semibold mb-2 xl:mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Institutional Financial Suite</span>
          </div>

          <h1 className="text-white text-2xl xl:text-3xl font-black leading-tight tracking-tight mb-2">
            Unified Financial Control for <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Educational Institutions
            </span>
          </h1>

          <p className="text-slate-300 text-xs xl:text-[13px] max-w-md leading-relaxed font-normal">
            Automate student fee collections, manage real-time day book reconciliations, disburse staff payroll, and generate audit-ready balance sheets from a centralized desk.
          </p>
        </div>

        {/* Center: Sleek 3D Preview Frame */}
        <div className="relative z-10 my-2 xl:my-4 rounded-2xl overflow-hidden border border-white/15 shadow-xl shadow-black/70 bg-slate-900/80 backdrop-blur-md group">
          <img 
            src={accountantLoginHero} 
            alt="ALL CORE SOLUTION Financial Command Center" 
            className="w-full h-32 xl:h-40 2xl:h-48 object-cover object-center transform group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/10 text-[10.5px] font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Multi-Campus Ledger Sync</span>
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
              <Receipt className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Automated Fee Ledger</p>
              <p className="text-[10px] text-slate-400">Receipts & dues alerts</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Audit Compliance</p>
              <p className="text-[10px] text-slate-400">Zero-trust fiscal control</p>
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

      {/* Right Column: Clean, Elegant, Focused Login Form - FIXED & FIT TO VIEWPORT */}
      <div className="w-full lg:w-1/2 xl:w-7/12 h-screen max-h-screen overflow-y-auto lg:overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-6 xl:p-8 2xl:p-12 bg-white relative z-10">
        
        {/* Top Bar on Mobile Screens */}
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/20">
              <span className="text-xs font-black tracking-tight text-white font-mono">ACS</span>
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">
                ALL CORE <span className="text-orange-500">SOLUTION</span>
              </h2>
              <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Accountant Console</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        </div>

        {/* Centered Clean Login Box - COMPACT & FIXED */}
        <div className="w-full max-w-md mx-auto my-auto py-2 space-y-3.5">
          
          {/* Header Title */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10.5px] font-black uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5 text-orange-500" />
              <span>Accountant Access</span>
            </div>
            <h2 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
              Sign In to Financial Desk
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Enter your official credentials to access the accounts portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            
            {/* Email / Username */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Accountant Email / Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="accountant@allcoresolution.com"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
                />
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Password <span className="text-rose-500">*</span>
                </label>
                <button 
                  type="button"
                  onClick={handleForgotPassword} 
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-semibold transition-all text-slate-900 placeholder:text-slate-400 shadow-2xs"
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
                onClick={() => { setIdentifier('accountant@allcoresolution.com'); setPassword('admin@123'); }}
                className="text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
              >
                Autofill Credentials
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border border-orange-400/30"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>{loading ? 'Authenticating...' : 'Sign In to Financial Desk'}</span>
            </button>
          </form>

          {/* Clean 1-Click Demo Evaluation Strip */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3.5 rounded-xl border border-slate-200 hover:border-orange-200 bg-slate-50/50 hover:bg-orange-50/40 text-slate-600 hover:text-orange-600 text-xs font-bold transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
                <span>Instant Demo Login (Accountant Access)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* Security Badge */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL Encrypted &bull; Zero-Trust Accounting Desk</span>
          </div>

        </div>

        {/* Footer Credit & Copyright */}
        <div className="pt-2.5 pb-1 text-center text-xs text-slate-400 border-t border-slate-100">
          <p className="font-medium">&copy; {new Date().getFullYear()} ALL CORE SOLUTION. All rights reserved.</p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Developed by <span className="text-slate-700 font-bold">RAJ YADAV</span> <span className="text-orange-500 font-bold">@ALLCORE SOLUTION</span>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Login;

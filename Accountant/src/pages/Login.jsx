import React, { useState, useEffect } from 'react';
import { 
  LogIn, Lock, User, Mail, ShieldCheck, 
  GraduationCap, Eye, EyeOff, ArrowRight, 
  Sparkles, Users, BookOpen, BarChart3, 
  MessageCircle, Sun, Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';

// High-Resolution 3D Assets (100% clean, zero text artifacts)
import campusTwilightBg from '../assets/campus_twilight_bg.jpg';
import educationHero3dImg from '../assets/education_hero_3d.png';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('accountant@allcoresolution.com');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Check active sessionStorage (NO auto-login on new tab/session)
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

    // Validate input
    if (!loginIdentifier || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter your email/username and password.',
        confirmButtonColor: '#0066ff'
      });
      return;
    }

    setLoading(true);

    try {
      const res = await authService.login({
        username: loginIdentifier,
        email: loginIdentifier,
        password
      });

      if (res?.success) {
        await Swal.fire({
          title: 'Access Granted',
          text: 'Welcome back to Accountant Portal!',
          icon: 'success',
          timer: 1600,
          showConfirmButton: false,
          position: 'top-end',
          toast: true
        });

        navigate('/accounts/dashboard', { replace: true });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: res?.message || 'Invalid username/email or password. Please try again.',
          confirmButtonColor: '#0066ff'
        });
      }
    } catch (err) {
      console.error('Accountant Login Error:', err);

      let errorMessage = 'Something went wrong. Please check your credentials.';
      if (!err.response) {
        errorMessage = 'Unable to connect to the server. Offline Demo Mode available.';
      } else if ([400, 401, 403].includes(err.response.status)) {
        errorMessage = 'Invalid username/email or password.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: errorMessage,
        confirmButtonColor: '#0066ff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { value: resetEmail } = await Swal.fire({
      title: 'Reset Password',
      text: 'Enter your registered email to receive a verification OTP:',
      input: 'email',
      inputValue: identifier || 'accountant@allcoresolution.com',
      showCancelButton: true,
      confirmButtonText: 'Send Reset OTP',
      confirmButtonColor: '#0066ff'
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

        if (res.success) {
          const { value: formValues } = await Swal.fire({
            title: 'Enter OTP & New Password',
            html: `
              <p style="font-size: 13px; color: #555; margin-bottom: 12px;">OTP code sent to <b>${resetEmail}</b>. (Demo OTP: 123456)</p>
              <input id="swal-otp" class="swal2-input" placeholder="6-digit OTP" maxlength="6" style="text-align: center; font-size: 20px; letter-spacing: 4px; font-weight: bold;">
              <input id="swal-newpass" type="password" class="swal2-input" placeholder="Enter New Password (min 6 chars)">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update Password',
            confirmButtonColor: '#0066ff',
            preConfirm: () => {
              const otpVal = document.getElementById('swal-otp').value;
              const newPassVal = document.getElementById('swal-newpass').value;
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

            if (resetRes.success) {
              Swal.fire({
                icon: 'success',
                title: 'Password Updated!',
                text: 'Your password has been changed successfully. You can now log in.',
                confirmButtonColor: '#0066ff'
              });
              setPassword(formValues.newPassword);
            } else {
              Swal.fire('Error', resetRes.message || 'Invalid OTP code', 'error');
            }
          }
        } else {
          Swal.fire('Account Note', res.message || 'Could not verify email', 'warning');
        }
      } catch (err) {
        Swal.fire('Connection Note', 'Demo mode: Please use standard credentials to log in.', 'info');
      }
    }
  };

  const fillDemo = () => {
    setIdentifier('accountant@allcoresolution.com');
    setPassword('admin@123');
    Swal.fire({
      icon: 'info',
      title: 'Demo Credentials Loaded',
      text: 'accountant@allcoresolution.com / admin@123',
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-[#010a20] text-slate-100 font-sans flex flex-col justify-between selection:bg-blue-500 selection:text-white relative select-none">

      {/* Atmospheric Photorealistic Campus Background (100% Clean - Zero Ghost Text) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Cinematic Campus Backdrop */}
        <img 
          src={campusTwilightBg} 
          alt="School Campus" 
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />

        {/* Luminous Royal Navy Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#010e2e]/95 via-[#021844]/80 to-[#01091d]/90"></div>
        <div className="absolute inset-0 bg-radial from-transparent via-[#010e2e]/30 to-[#010e2e]/90"></div>

        {/* Subtle Architectural Dot Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Luminous Ambient Glowing Light Orbs */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[130px]"></div>
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px]"></div>
        
        {/* Sleek Top & Bottom Glow Lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/35 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent"></div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-6 sm:px-10 lg:px-14 py-3 sm:py-3.5 flex items-center justify-between max-w-7xl mx-auto shrink-0">
        {/* School ERP Brand Logo */}
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-600 p-[1.5px] shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-[#051c44] rounded-[9px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
              School <span className="text-sky-400">ERP</span>
            </span>
          </div>
        </div>

        {/* Day / Night Mode Pill */}
        <div className="flex items-center">
          <button 
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#09224f]/90 hover:bg-[#0c2f6d] border border-blue-400/30 text-xs font-bold text-slate-200 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            title="Toggle Theme"
          >
            <span className={isDarkMode ? 'opacity-40' : 'text-amber-400 scale-110 transition-transform'}>☀️</span>
            <span className={isDarkMode ? 'text-sky-300 scale-110 transition-transform' : 'opacity-40'}>🌙</span>
          </button>
        </div>
      </header>

      {/* Main Content Showcase (Strictly Fit 100vh - Zero Scrollbar) */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 overflow-hidden min-h-0 py-1 sm:py-2">

        {/* Left Side - Next Gen Hero Showcase */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center text-left py-1 shrink-0 lg:shrink">
          
          {/* Main Headline */}
          <div className="mb-2 sm:mb-2.5">
            <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-[1.12]">
              Next Generation <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
                School ERP
              </span>{' '}
              System.
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-blue-100/80 max-w-lg font-normal leading-relaxed">
              Manage your institution finances, academic records and communication in one powerful integrated platform.
            </p>
          </div>

          {/* 4 Feature Cards Row - Glassmorphic with Vibrant 3D Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-xl my-2 sm:my-2.5">
            {/* 1. Student Management */}
            <div className="group bg-gradient-to-b from-[#0a2350]/85 to-[#051736]/90 hover:from-[#0d2d66] hover:to-[#071f4a] border border-blue-400/25 hover:border-sky-400/60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-500/30 mb-1.5 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white drop-shadow" />
              </div>
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-100 leading-tight">
                Student<br />Management
              </span>
            </div>

            {/* 2. Academic Records */}
            <div className="group bg-gradient-to-b from-[#0a2350]/85 to-[#051736]/90 hover:from-[#0d2d66] hover:to-[#071f4a] border border-blue-400/25 hover:border-amber-400/60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/30 mb-1.5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white drop-shadow" />
              </div>
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-100 leading-tight">
                Academic<br />Records
              </span>
            </div>

            {/* 3. Fees & Accounts (Highlight Ring!) */}
            <div className="group bg-gradient-to-b from-[#0e2f69]/90 to-[#061e46]/95 hover:from-[#11397e] hover:to-[#09285c] border-2 border-cyan-400 hover:border-cyan-300 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg shadow-cyan-950/50 ring-2 ring-cyan-400/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-cyan-500/40 mb-1.5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white drop-shadow" />
              </div>
              <span className="text-[10.5px] sm:text-[11px] font-bold text-cyan-300 leading-tight">
                Fees &amp;<br />Accounts
              </span>
            </div>

            {/* 4. Communication Desk */}
            <div className="group bg-gradient-to-b from-[#0a2350]/85 to-[#051736]/90 hover:from-[#0d2d66] hover:to-[#071f4a] border border-blue-400/25 hover:border-sky-400/60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-sky-400 to-cyan-300 flex items-center justify-center shadow-md shadow-sky-500/30 mb-1.5 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white drop-shadow" />
              </div>
              <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-100 leading-tight">
                Communication<br />Desk
              </span>
            </div>
          </div>

          {/* Bottom 3D Artwork Showcase (Cap, Stacked Books, Pencil Cup, Wave & Holograms) */}
          <div className="w-full max-w-lg mt-1 flex flex-col items-start">
            <img 
              src={educationHero3dImg} 
              alt="Build a Better Education Future" 
              className="w-full max-h-32 sm:max-h-36 lg:max-h-38 object-contain object-left drop-shadow-[0_15px_30px_rgba(0,102,255,0.45)]"
            />
            <div className="w-full flex items-center justify-between px-1 pt-1">
              <span className="font-serif italic text-amber-200/90 text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                Build a Better Education Future <span className="text-amber-400">✨</span>
              </span>
              <span className="text-[10px] text-sky-400/70 font-semibold tracking-wider uppercase font-mono">
                Institutional Financial Suite
              </span>
            </div>
          </div>

        </div>

        {/* Right Side - Accountant Portal Login Card */}
        <div className="w-full lg:w-[45%] max-w-[420px] flex items-center justify-center shrink-0 my-auto">
          
          <div className="w-full bg-white text-gray-900 rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,102,255,0.45)] border border-white/95 px-6 sm:px-7 py-5 sm:py-6 relative flex flex-col">

            {/* Top Center Floating 3D Badge (Luminous Vector 3D Emblem with Glass Highlight) */}
            <div className="w-full flex justify-center -mt-12 sm:-mt-14 mb-2">
              <div className="relative group cursor-pointer">
                {/* Multi-layer Neon Glow Ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-300 to-blue-600 rounded-full blur-xs opacity-90"></div>
                
                {/* Glossy 3D Circle Emblem */}
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-[#0066ff] via-[#0240b0] to-[#011a54] p-[3px] shadow-[0_15px_35px_rgba(0,102,255,0.6)] flex items-center justify-center border-2 border-white/95">
                  {/* Top Gloss Reflection */}
                  <div className="absolute top-1 inset-x-2.5 h-3.5 bg-gradient-to-b from-white/50 to-transparent rounded-full pointer-events-none"></div>
                  
                  {/* Center 3D Cap */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center shadow-inner">
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transform -rotate-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card Header Title */}
            <div className="text-center mb-3">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
                Accountant <span className="text-blue-600">Portal</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 leading-relaxed max-w-xs mx-auto">
                Please enter your credentials to securely sign in to your dashboard.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              
              {/* Field 1: Email Address / Username */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold text-gray-800 tracking-wider uppercase mb-1">
                  <span className="w-3.5 h-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[9px]">
                    <Mail className="w-2 h-2" />
                  </span>
                  <span>Email Address / Username</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. accountant@allcoresolution.com"
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 focus:bg-white text-gray-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Field 2: System Password */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold text-gray-800 tracking-wider uppercase mb-1">
                  <span className="w-3.5 h-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[9px]">
                    <Lock className="w-2 h-2" />
                  </span>
                  <span>System Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 sm:py-2.5 rounded-xl border border-gray-200 bg-gray-50/80 focus:bg-white text-gray-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Remember Me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] sm:text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Lock className="w-2.5 h-2.5 text-blue-600" />
                  <span>Forgot Password?</span>
                </button>
              </div>

              {/* Glowing Blue Action Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#0062ff] via-[#0077ff] to-[#0091ff] hover:from-[#0052dd] hover:to-[#007ee6] active:scale-[0.99] text-white py-2.5 sm:py-3 px-5 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-500/35 hover:shadow-lg hover:shadow-blue-500/45 transition-all flex items-center justify-between cursor-pointer group disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>

            </form>

            {/* Quick Demo Pill */}
            <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col items-center">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Or sign in with
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="w-full py-1.5 px-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Quick Demo: accountant@allcoresolution.com</span>
              </button>
            </div>

            {/* Card Footer */}
            <div className="mt-2.5 pt-1 text-center flex items-center justify-center gap-1 text-[10px] font-medium text-gray-500">
              <ShieldCheck className="w-3 h-3 text-gray-400" />
              <span>
                Built with <span className="text-red-500 font-bold">❤️</span> by{' '}
                <strong className="text-gray-900 font-bold">RAJ YADAV</strong> |{' '}
                <strong className="text-blue-600 font-bold">ALLCORE SOLUTION</strong>
              </span>
            </div>

          </div>

        </div>

      </main>

      {/* Subtle Bottom Accent Indicator */}
      <div className="relative z-20 w-full py-1 text-center pointer-events-none">
        <p className="text-[10px] text-blue-300/40 font-medium tracking-wider">
          School ERP &bull; Institutional Financial Suite
        </p>
      </div>

    </div>
  );
};

export default Login;

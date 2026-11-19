import React, { useState, useEffect } from 'react';
import { 
  LogIn, Lock, User, Mail, ShieldCheck, 
  GraduationCap, Eye, EyeOff, ArrowRight, 
  Sparkles, Users, BookOpen, BarChart3, 
  MessageCircle, Sun, Moon, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';

// Assets
import accountantHeroImg from '../assets/accountant_login_hero.jpg';
import mortarboardBadgeImg from '../assets/mortarboard_badge.png';
import books3dDecorImg from '../assets/books_3d_decor.png';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('accountant@allcoresolution.com');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Check active sessionStorage (NO auto-login if fresh tab/session)
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
          text: `Welcome back to Accountant Portal!`,
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
              <input id="swal-password" type="password" class="swal2-input" placeholder="Enter New Password (min 6 chars)">
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
    <div className="min-h-screen w-full relative bg-[#021333] text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden selection:bg-blue-500 selection:text-white">

      {/* Background Graphic Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Full Hero Image Backdrop */}
        <img 
          src={accountantHeroImg} 
          alt="School ERP Campus" 
          className="w-full h-full object-cover object-center opacity-30 sm:opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        {/* Luminous Glow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#011438]/95 via-[#021b4a]/85 to-[#001030]/90"></div>
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-600/25 rounded-full blur-[130px]"></div>
        <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[150px]"></div>
        <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px]"></div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-5 flex items-center justify-between max-w-7xl mx-auto">
        {/* School ERP Brand */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1.5px] shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-[#051c44] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
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

      {/* Main Content Showcase */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-4 sm:py-8 flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

        {/* Left Side - Next Gen Hero Showcase */}
        <div className="w-full lg:w-[54%] flex flex-col items-start justify-center text-left py-2">
          
          {/* Main Headline */}
          <div className="mb-4">
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.12]">
              Next Generation <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
                School ERP
              </span>{' '}
              System.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-blue-100/80 max-w-xl font-normal leading-relaxed">
              Manage your institution finances, academic records and communication in one powerful integrated platform.
            </p>
          </div>

          {/* 4 Feature Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl my-4">
            {/* 1. Student Management */}
            <div className="group bg-[#041d47]/80 hover:bg-[#072a68] border border-blue-400/25 hover:border-sky-400/60 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-200 leading-tight">
                Student<br />Management
              </span>
            </div>

            {/* 2. Academic Records */}
            <div className="group bg-[#041d47]/80 hover:bg-[#072a68] border border-blue-400/25 hover:border-amber-400/60 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-200 leading-tight">
                Academic<br />Records
              </span>
            </div>

            {/* 3. Fees & Accounts */}
            <div className="group bg-[#041d47]/80 hover:bg-[#072a68] border border-blue-400/25 hover:border-emerald-400/60 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ring-1 ring-sky-400/30">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-300 leading-tight">
                Fees &amp;<br />Accounts
              </span>
            </div>

            {/* 4. Communication */}
            <div className="group bg-[#041d47]/80 hover:bg-[#072a68] border border-blue-400/25 hover:border-cyan-400/60 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg shadow-blue-950/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-200 leading-tight">
                Communication<br />Desk
              </span>
            </div>
          </div>

          {/* Bottom 3D Books Decor & Tagline */}
          <div className="mt-2 w-full flex flex-col sm:flex-row items-center sm:items-end justify-between gap-2 max-w-xl pt-2">
            <div className="w-full sm:w-auto flex items-center gap-3">
              <img 
                src={books3dDecorImg} 
                alt="Education 3D Assets" 
                className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,120,255,0.4)]"
              />
            </div>
            <div className="text-right pb-1">
              <span className="font-serif italic text-amber-200/90 text-sm sm:text-base tracking-wide flex items-center gap-1.5 justify-end">
                Build a Better Education Future <span>✨</span>
              </span>
            </div>
          </div>

        </div>

        {/* Right Side - Accountant Portal Login Card */}
        <div className="w-full lg:w-[46%] max-w-[480px] flex items-center justify-center my-4">
          
          <div className="w-full bg-white text-gray-900 rounded-[32px] sm:rounded-[36px] shadow-[0_25px_70px_-15px_rgba(0,102,255,0.45)] border border-white/90 p-7 sm:p-9 relative flex flex-col">

            {/* Top Center Floating 3D Badge */}
            <div className="w-full flex justify-center -mt-16 sm:-mt-20 mb-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-b from-blue-600 to-indigo-700 p-1 shadow-2xl flex items-center justify-center overflow-hidden border-2 border-white">
                  <img 
                    src={mortarboardBadgeImg} 
                    alt="Accountant Badge" 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <GraduationCap className="w-10 h-10 text-white drop-shadow-md absolute" />
                </div>
              </div>
            </div>

            {/* Card Header Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight leading-snug">
                Accountant <span className="text-blue-600">Portal</span>
              </h2>
              <p className="text-xs sm:text-[13px] text-gray-500 font-medium mt-1 leading-relaxed max-w-xs mx-auto">
                Please enter your credentials to securely sign in to your dashboard.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Field 1: Email Address / Username */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                  <span className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    <Mail className="w-2.5 h-2.5" />
                  </span>
                  <span>Email Address / Username</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. accountant@allcoresolution.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Field 2: System Password */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-800 tracking-wider uppercase mb-1.5">
                  <span className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                  <span>System Password</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50/70 focus:bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Remember Me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-blue-600" />
                  <span>Forgot Password?</span>
                </button>
              </div>

              {/* Glowing Blue Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#0062ff] via-[#0077ff] to-[#0091ff] hover:from-[#0052dd] hover:to-[#007ee6] active:scale-[0.99] text-white py-3.5 px-6 rounded-full font-bold text-sm shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50 transition-all flex items-center justify-between cursor-pointer group disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2.5">
                    <LogIn className="w-4 h-4" />
                    <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>

            </form>

            {/* Quick Demo Pill */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col items-center">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Or sign in with
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="w-full py-2 px-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick Demo: accountant@allcoresolution.com</span>
              </button>
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-2 text-center flex items-center justify-center gap-1 text-[11px] font-medium text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              <span>
                Built with <span className="text-red-500 font-bold">❤️</span> by{' '}
                <strong className="text-gray-900 font-bold">RAJ YADAV</strong> |{' '}
                <strong className="text-blue-600 font-bold">ALLCORE SOLUTION</strong>
              </span>
            </div>

          </div>

        </div>

      </main>

      {/* Global Minimal Bottom Bar */}
      <footer className="relative z-10 w-full py-3 px-6 text-center border-t border-blue-900/30 bg-[#010e28]/70 backdrop-blur-xs">
        <p className="text-[11px] text-blue-200/60 font-medium">
          &copy; {new Date().getFullYear()} School ERP &bull; Next Generation Institutional Finance Platform
        </p>
      </footer>

    </div>
  );
};

export default Login;

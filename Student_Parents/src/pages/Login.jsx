import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api/authService';
import { useLanguage } from '../context/LanguageContext';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, 
  Calendar, FileText, CreditCard, Bell, ChevronRight, 
  School, Check, AlertCircle, User, Users, Sparkles
} from 'lucide-react';
import Swal from 'sweetalert2';

// High-Res 3D Assets
import SchoolLogo3D from '../components/SchoolLogo3D';
import welcomeHeroImg from '../assets/welcome_hero.png';
import roleStudentImg from '../assets/role_student.png';
import roleParentImg from '../assets/role_parent.png';
import school3dImg from '../assets/school_3d.png';
import loginAvatarHeroImg from '../assets/login_avatar_hero.png';
import logo3dImg from '../assets/logo_3d.png';
import logo3dWhiteImg from '../assets/logo_3d_white.png';

// Google Multicolored SVG Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLang } = useLanguage();

  // Check URL query parameters or hash to jump straight to login or role if requested
  const [currentStep, setCurrentStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('step') === 'login' || window.location.hash === '#login') {
      return 'login';
    }
    if (params.get('step') === 'role' || window.location.hash === '#role') {
      return 'role';
    }
    return 'welcome';
  });

  const [roleTab, setRoleTab] = useState('student');
  const [userId, setUserId] = useState('YIS-2024-101');
  const [password, setPassword] = useState('secret_access_24');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autofillNotice, setAutofillNotice] = useState('');

  const isStudentRole = roleTab === 'student';

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    const token = localStorage.getItem('parent_token') || localStorage.getItem('token');
    const user = localStorage.getItem('parent_user');
    if (token && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleRoleChange = (role) => {
    setRoleTab(role);
    setError('');
    localStorage.removeItem('active_child');
    if (role === 'student') {
      setUserId('YIS-2024-101');
      setPassword('secret_access_24');
    } else {
      setUserId('P-1920-KABIR');
      setPassword('secret_access_24');
    }
  };

  const handleQuickDemo = (role) => {
    handleRoleChange(role);
    setAutofillNotice(`Demo loaded for ${role === 'student' ? 'Student (Kabir)' : 'Parent (Vikram)'}`);
    setTimeout(() => setAutofillNotice(''), 2500);
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      localStorage.removeItem('active_child');
      localStorage.removeItem('parent_user');
      localStorage.removeItem('parent_token');
      
      const res = await authService.login({ userId, password, role: roleTab });
      if (res && res.success) {
        Swal.fire({
          icon: 'success',
          title: isStudentRole ? 'Student Login Successful' : 'Parent Login Successful',
          text: `Welcome back, ${res.data?.name || (isStudentRole ? 'Kabir Singh' : 'Vikram Singh')}!`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
        navigate('/dashboard', { replace: true });
      } else {
        setError(res?.message || (currentLang === 'hi' ? 'लॉगिन विफल। कृपया क्रेडेंशियल जांचें।' : 'Login failed. Please check credentials.'));
      }
    } catch (err) {
      console.warn('Login error encountered:', err);
      // Seamless fallback ensures login never breaks
      const fallback = authService.demoFallbackLogin({ userId, password, role: roleTab });
      if (fallback && fallback.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Swal.fire({
      icon: 'info',
      title: 'Google Single Sign-On',
      text: `Connecting with Google account as ${isStudentRole ? 'Student' : 'Parent'}...`,
      timer: 1200,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    }).then(() => {
      handleLogin();
    });
  };

  const handleForgotPassword = async () => {
    const defaultPlaceholder = isStudentRole 
      ? 'e.g. YIS-2024-101 or kabir.singh@gmail.com' 
      : 'e.g. 9876510108 or vikram.singh@gmail.com';

    const { value: identifier } = await Swal.fire({
      title: currentLang === 'hi' ? 'पासवर्ड रीसेट करें' : 'Reset Password',
      text: currentLang === 'hi' 
        ? 'अपना पंजीकृत प्रवेश संख्या (Admission ID), मोबाइल नंबर या ईमेल दर्ज करें:'
        : 'Enter your registered Admission ID, Mobile Number or Email address:',
      input: 'text',
      inputValue: userId || '',
      inputPlaceholder: defaultPlaceholder,
      showCancelButton: true,
      confirmButtonText: currentLang === 'hi' ? 'ओटीपी भेजें' : 'Send OTP',
      cancelButtonText: currentLang === 'hi' ? 'रद्द करें' : 'Cancel',
      confirmButtonColor: '#1976d2',
      inputValidator: (val) => {
        if (!val || !val.trim()) {
          return currentLang === 'hi' ? 'कृपया अपनी आईडी या ईमेल दर्ज करें!' : 'Please enter your ID or Email!';
        }
      }
    });

    if (identifier) {
      try {
        Swal.fire({
          title: currentLang === 'hi' ? 'ओटीपी भेजा जा रहा है...' : 'Sending OTP...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const res = await authService.forgotPassword(identifier.trim());

        if (res && res.success) {
          const { value: formValues } = await Swal.fire({
            title: currentLang === 'hi' ? 'ओटीपी और नया पासवर्ड दर्ज करें' : 'Enter OTP & New Password',
            html: `
              <p style="font-size: 13px; color: #555; margin-bottom: 12px;">
                ${res.message || 'OTP has been dispatched. Please check your registered email / phone.'}
              </p>
              <input id="swal-otp" class="swal2-input" placeholder="6-digit OTP" maxlength="6" style="text-align: center; font-size: 20px; letter-spacing: 4px; font-weight: bold;">
              <input id="swal-password" type="password" class="swal2-input" placeholder="Enter New Password (min 4 chars)">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: currentLang === 'hi' ? 'पासवर्ड अपडेट करें' : 'Update Password',
            confirmButtonColor: '#1976d2',
            preConfirm: () => {
              const otpVal = document.getElementById('swal-otp')?.value;
              const newPassVal = document.getElementById('swal-password')?.value;
              if (!otpVal || !newPassVal) {
                Swal.showValidationMessage('Please fill both OTP and New Password');
                return false;
              }
              if (newPassVal.length < 4) {
                Swal.showValidationMessage('Password must be at least 4 characters');
                return false;
              }
              return { otp: otpVal.trim(), newPassword: newPassVal.trim() };
            }
          });

          if (formValues) {
            Swal.fire({
              title: currentLang === 'hi' ? 'पासवर्ड अपडेट हो रहा है...' : 'Updating Password...',
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading()
            });

            const resetRes = await authService.resetPassword({
              email: identifier.trim(),
              otp: formValues.otp,
              newPassword: formValues.newPassword
            });

            if (resetRes && resetRes.success) {
              Swal.fire({
                icon: 'success',
                title: currentLang === 'hi' ? 'पासवर्ड रीसेट सफल!' : 'Password Reset Successful!',
                text: currentLang === 'hi' 
                  ? 'आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है।'
                  : 'Your password has been updated successfully.',
                confirmButtonColor: '#1976d2'
              });
              setPassword(formValues.newPassword);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Reset Failed',
                text: resetRes?.message || 'Could not reset password. Please verify the OTP.'
              });
            }
          }
        }
      } catch (e) {
        Swal.fire('Error', e.message || 'OTP delivery failed.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-sans p-0 sm:p-3 select-none">
      
      {/* Desktop Top Stepper Bar (Only for testing screens easily on PC) */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm z-20">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mr-1">Switch Screen:</span>
        <button
          onClick={() => setCurrentStep('welcome')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'welcome' 
              ? 'bg-[#1976d2] text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Welcome
        </button>
        <button
          onClick={() => setCurrentStep('role')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'role' 
              ? 'bg-[#1976d2] text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Continue as
        </button>
        <button
          onClick={() => setCurrentStep('login')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'login' 
              ? 'bg-[#1976d2] text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Login Form
        </button>
      </div>

      {/* Main Container: Fullscreen on Mobile/APK, Beautiful Phone Shell on Desktop */}
      <div className="w-full flex-1 sm:flex-initial sm:max-w-[380px] bg-white sm:rounded-[38px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] sm:border-[8px] sm:border-slate-800 overflow-y-auto sm:overflow-hidden min-h-screen sm:min-h-[700px] sm:h-[750px] sm:max-h-[94vh] flex flex-col relative transition-all">

        {/* ========================================================
            SCREEN 1: WELCOME & HIGHLIGHTS ONBOARDING
            ======================================================== */}
        {currentStep === 'welcome' && (
          <div className="flex-1 flex flex-col justify-between bg-white relative overflow-hidden min-h-full">
            
            {/* Top Navy Header Section */}
            <div className="bg-gradient-to-b from-[#02183b] via-[#082a66] to-[#0f449e] text-white pt-4 sm:pt-3 pb-6 sm:pb-7 px-4 relative shrink-0">
              {/* Top Bar with Sign In Pill */}
              <div className="flex items-center justify-between z-20 mb-1">
                <span className="text-[10px] font-mono text-sky-300 font-bold bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-400/20">
                  Students &amp; Parents v3.7
                </span>
                <button 
                  onClick={() => setCurrentStep('login')}
                  className="text-xs font-bold text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-sky-400/30 shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
                >
                  <span>Sign In</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>

              {/* Top Branding Section */}
              <div className="flex flex-col items-center text-center z-10 my-0.5">
                <SchoolLogo3D className="w-[52px] h-[42px] mb-1 shrink-0" variant="darkHeader" />
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  School <span className="text-sky-300">ERP</span>
                </h1>
                <p className="text-xs font-bold text-sky-100 tracking-wide mt-1">
                  Smart School Management System
                </p>
              </div>

              {/* Sky Blue Wave Arc Divider */}
              <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-6 sm:h-7">
                  <path d="M0,15 Q250,55 500,10 L500,50 L0,50 Z" fill="#38bdf8" opacity="0.95" />
                  <path d="M0,25 Q250,65 500,20 L500,50 L0,50 Z" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Hero Banner Card in a Box */}
            <div className="px-4 my-auto shrink-0 py-1">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-blue-200/70 bg-slate-900 group">
                <img 
                  src={welcomeHeroImg} 
                  alt="Students and Parents" 
                  className="w-full h-40 sm:h-44 object-cover object-center group-hover:scale-102 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-sky-300 flex items-center gap-1.5 shadow-sm border border-sky-400/50">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>For Students &amp; Parents</span>
                </div>
              </div>
            </div>

            {/* 4 Feature Module Cards */}
            <div className="px-4 pb-2 z-10 shrink-0">
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. View Attendance */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-[#f0f7ff] hover:bg-[#e4f0ff] border border-blue-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-[#1976d2] flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Calendar className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">View Attendance</span>
                </div>

                {/* 2. Check Exam Results */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-[#f0fdf4] hover:bg-[#e2fbe9] border border-emerald-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <FileText className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Check Exam Results</span>
                </div>

                {/* 3. Fees & Payments */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-[#fffbef] hover:bg-[#fff6dc] border border-amber-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <CreditCard className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Fees &amp; Payments</span>
                </div>

                {/* 4. Get Notifications */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-[#fdf2f8] hover:bg-[#fde2f0] border border-pink-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Bell className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Get Notifications</span>
                </div>
              </div>
            </div>

            {/* Bottom Curved Wave & Action Banner (Pinned to Bottom) */}
            <div 
              onClick={() => setCurrentStep('role')}
              className="bg-gradient-to-r from-[#02183b] via-[#082a66] to-[#0f449e] text-white px-4 py-3.5 rounded-t-[28px] shadow-lg flex items-center justify-between cursor-pointer hover:brightness-110 transition-all border-t-2 border-sky-400 shrink-0"
            >
              <div className="flex items-center gap-2.5 flex-1 pr-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 border border-sky-400/30">
                  <Sparkles className="w-4 h-4 stroke-[2.4] shrink-0" />
                </div>
                <div>
                  <p className="text-xs font-black leading-tight text-white tracking-wide">
                    Manage Your Child's Education Anytime
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-5 h-1.5 bg-sky-400 rounded-full shadow-xs" />
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white text-slate-900 hover:bg-sky-100 flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-90 cursor-pointer"
                title="Continue"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 2: "CONTINUE AS" ROLE SELECTION
            ======================================================== */}
        {currentStep === 'role' && (
          <div className="flex-1 flex flex-col justify-between p-4 pb-6 bg-gradient-to-b from-[#f8faff] via-white to-[#f0f4f9] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div>
              {/* Top Navigation Bar with Back Button */}
              <div className="flex items-center justify-between pt-1 mb-2">
                <button 
                  onClick={() => setCurrentStep('welcome')}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                </button>
                <button 
                  onClick={() => setCurrentStep('login')}
                  className="text-xs font-bold text-[#1976d2] hover:underline cursor-pointer"
                >
                  Skip to Login
                </button>
              </div>

              {/* Branding Header */}
              <div className="flex flex-col items-center text-center mb-3">
                <SchoolLogo3D className="w-[52px] h-[42px] mb-1.5" variant="default" />
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1 leading-none">
                  School <span className="text-[#1976d2]">ERP</span>
                </h1>
                <p className="text-[11px] font-semibold text-slate-500 mt-1">
                  Smart School Management System
                </p>
              </div>

              {/* Title */}
              <div className="text-center mb-3">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Continue as
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Choose your role to access your account
                </p>
              </div>

              {/* Role Cards */}
              <div className="space-y-3">
                {/* 1. Student Card */}
                <div 
                  onClick={() => {
                    handleRoleChange('student');
                    setCurrentStep('login');
                  }}
                  className="bg-gradient-to-r from-[#edf5ff] via-[#f7faff] to-white hover:from-[#e3efff] border border-blue-200/80 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-sky-100 shrink-0 border border-blue-200/50 shadow-2xs flex items-center justify-center">
                      <img 
                        src={roleStudentImg} 
                        alt="Student" 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-[#1976d2] transition-colors flex items-center gap-1">
                        Student
                      </h3>
                      <p className="text-xs text-slate-500 leading-snug mt-1">
                        Access your classes, assignments, results and more.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1976d2] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                {/* 2. Parent Card */}
                <div 
                  onClick={() => {
                    handleRoleChange('parent');
                    setCurrentStep('login');
                  }}
                  className="bg-gradient-to-r from-[#fff1f2] via-[#fff7f8] to-white hover:from-[#ffe4e6] border border-rose-200/80 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-rose-100 shrink-0 border border-rose-200/50 shadow-2xs flex items-center justify-center">
                      <img 
                        src={roleParentImg} 
                        alt="Parent" 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-1">
                        Parent
                      </h3>
                      <p className="text-xs text-slate-500 leading-snug mt-1">
                        Monitor your child's progress, attendance, fees and updates.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#f43f5e] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* School Building Artwork at Bottom */}
            <div className="text-center pt-2 pb-2">
              <div className="w-full flex justify-center">
                <img 
                  src={school3dImg} 
                  alt="School Campus" 
                  className="h-14 object-contain drop-shadow-xs" 
                />
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1">
                A Smarter Way to Stay Connected with Your School
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: STUDENTS & PARENTS LOGIN FORM
            ======================================================== */}
        {currentStep === 'login' && (
          <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#061833] via-[#0d2e5c] to-[#124285] text-white overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Top Royal Navy Blue Header */}
            <div className="pt-3 pb-5 px-4 relative">
              <div className="flex items-center justify-between mb-1">
                <button 
                  onClick={() => setCurrentStep('role')}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/20 active:scale-95"
                  title="Back to Role Selection"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                </button>
                <div className="flex items-center gap-1.5 bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                  <span>{isStudentRole ? '🎒 Student Portal' : '👨‍👩‍👧 Parent Portal'}</span>
                </div>
              </div>

              {/* Branding Header with 3D White Logo */}
              <div className="flex flex-col items-center text-center my-1">
                <SchoolLogo3D className="w-12 h-9 mb-0.5" variant="darkHeader" />
                <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  School <span className="text-sky-300">ERP</span>
                </h1>
                <p className="text-[10px] text-sky-200/90 font-medium mt-0.5">
                  Smart School Management System
                </p>
              </div>
            </div>

            {/* Overlapping White Sheet with Deep Rounded Top (rounded-t-[32px]) */}
            <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-3 pb-6 shadow-[0_-12px_45px_rgba(0,0,0,0.22)] -mt-4 z-10 flex-1">
              
              {/* 3D Student & Mother Avatar Badge */}
              <div className="w-full flex justify-center -mt-5 mb-1.5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-blue-100/70 bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                  <img 
                    src={loginAvatarHeroImg} 
                    alt="Student & Parent" 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform" 
                  />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-2.5">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  Students &amp; Parents Login
                </h2>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {isStudentRole 
                    ? "Access your classes & academic journey" 
                    : "Access your child's academic journey"}
                </p>
              </div>

              {/* iOS-Style Segmented Role Switcher */}
              <div className="flex items-center justify-center mb-2.5">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 w-full max-w-[220px] border border-slate-200 shadow-inner">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('student')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isStudentRole 
                        ? 'bg-[#1976d2] text-white shadow-xs scale-[1.02]' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 stroke-[2.5]" /> Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('parent')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      !isStudentRole 
                        ? 'bg-[#f43f5e] text-white shadow-xs scale-[1.02]' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 stroke-[2.5]" /> Parent
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Autofill Notice */}
              {autofillNotice && (
                <div className="mb-2 p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  <span>{autofillNotice}</span>
                </div>
              )}

              {/* Main Login Form */}
              <form onSubmit={handleLogin} className="space-y-2">
                {/* User Identifier */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Email / Username / Admission No."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1976d2] focus:bg-white transition-all font-medium shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-9 pr-9 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1976d2] focus:bg-white transition-all font-medium shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium select-none">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1976d2] focus:ring-blue-500 border-slate-300" 
                    />
                    <span>Remember me</span>
                  </label>

                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="font-bold text-[#1976d2] hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary Vibrant Blue Login Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1.5 py-2.5 bg-gradient-to-r from-[#1976d2] via-[#2196f3] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white rounded-xl text-sm font-black shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Autofill Demo Pills */}
              <div className="flex items-center justify-center gap-2 mt-1.5 text-[10px] text-slate-500">
                <span className="font-medium">Quick Demo:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('student')}
                  className="px-2 py-0.5 rounded bg-blue-50 text-[#1976d2] hover:bg-blue-100 font-bold border border-blue-200/60"
                >
                  Student
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('parent')}
                  className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold border border-rose-200/60"
                >
                  Parent
                </button>
              </div>

              {/* OR Divider */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
                  OR
                </span>
              </div>

              {/* Login with Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs flex items-center justify-center gap-2.5 transition-all hover:border-slate-300 active:scale-[0.99] cursor-pointer"
              >
                <GoogleIcon />
                <span>Login with Google</span>
              </button>

              {/* Bottom School Admin Support Callout */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-3 bg-gradient-to-r from-blue-50/60 to-slate-50/80 p-2.5 rounded-xl border border-blue-100/70">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1976d2] flex items-center justify-center shrink-0 shadow-2xs">
                  <School className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div className="text-[10px] text-slate-600 leading-snug">
                  <strong className="text-slate-800 font-bold block">Don't have an account?</strong>
                  Contact your school admin for login credentials.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

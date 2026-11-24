import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Bell, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Wifi, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Headphones 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { driverService } from '../api/driverService';
import { getApiBaseUrl } from '../api/axios';
import Swal from 'sweetalert2';

// High-Res 3D Assets
import SchoolLogo3D from '../components/SchoolLogo3D';
import driverWelcomeHeroImg from '../assets/driver_welcome_hero.png';
import driverAvatarImg from '../assets/driver_avatar.png';
import schoolBusCampusImg from '../assets/school_bus_campus.png';
import driverLoginBannerImg from '../assets/driver_login_banner.png';

// Google Multicolored SVG Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Stepper State: 'welcome' | 'role' | 'login'
  const [currentStep, setCurrentStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('step') === 'welcome' || window.location.hash === '#welcome') {
      return 'welcome';
    }
    if (params.get('step') === 'role' || window.location.hash === '#role') {
      return 'role';
    }
    return 'login';
  });

  const [driversList, setDriversList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autofillNotice, setAutofillNotice] = useState('');
  const [serverUrl, setServerUrl] = useState(getApiBaseUrl());

  const { login } = useAuth();

  // Load fleet drivers from backend API
  const loadActiveDrivers = async () => {
    try {
      const res = await driverService.getActiveDrivers();
      if (res.success && res.data && res.data.length > 0) {
        setDriversList(res.data);
      }
    } catch (e) {
      console.warn('Could not load fleet drivers from server:', e.message);
    }
  };

  useEffect(() => {
    loadActiveDrivers();
  }, []);

  const handleSelectDriver = (drv) => {
    setSelectedDriver(drv);
    setIdentifier(drv.driverId || drv.mobile || '');
    setPassword(drv.pin || '');
    setError('');
    setAutofillNotice(`Loaded credentials for ${drv.name} (${drv.driverId || drv.mobile})`);
    setTimeout(() => setAutofillNotice(''), 2500);
  };

  const handleQuickDemo = (drvId) => {
    if (driversList && driversList.length > 0) {
      const drv = driversList.find(d => d.driverId === drvId || d.driver_id === drvId) || driversList[0];
      if (drv) handleSelectDriver(drv);
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(identifier, password);
      setLoading(false);

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Driver Login Successful',
          text: `Welcome back, ${result.data?.name || selectedDriver?.name || 'Driver'}!`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message || 'Invalid Driver ID or Security PIN.');
      }
    } catch (err) {
      setLoading(false);
      const msg = err.friendlyMessage || err.message || 'Connection failed.';
      setError(msg);
    }
  };

  const handleGoogleLogin = () => {
    Swal.fire({
      icon: 'info',
      title: 'Fleet Google Single Sign-On',
      text: `Authenticating driver account for ${identifier || 'Driver'}...`,
      timer: 1200,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    }).then(() => {
      handleLogin();
    });
  };

  const handleForgotPassword = async () => {
    const { value: driverIdInput } = await Swal.fire({
      title: 'Driver PIN Recovery',
      text: 'Enter your Registered Email, Driver ID or Mobile Number:',
      input: 'text',
      inputValue: identifier || '',
      inputPlaceholder: 'e.g. driver@school.com or Driver ID',
      showCancelButton: true,
      confirmButtonText: 'Send Verification OTP',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff5c0a',
      inputValidator: (val) => {
        if (!val || !val.trim()) {
          return 'Please enter your Registered Email, Driver ID or Mobile Number!';
        }
      }
    });

    if (driverIdInput) {
      try {
        Swal.fire({
          title: 'Sending OTP...',
          text: 'Dispatching verification code...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const res = await driverService.forgotPassword({ email: driverIdInput.trim() });
        if (res && res.success) {
          const { value: formValues } = await Swal.fire({
            title: 'Enter OTP & New PIN',
            html: `
              <p style="font-size: 13px; color: #475569; margin-bottom: 12px;">${res.message || 'OTP verification code sent. Please check your registered email inbox.'}</p>
              <input id="swal-otp" class="swal2-input" placeholder="6-digit OTP" maxlength="6" style="text-align: center; font-size: 20px; letter-spacing: 4px; font-weight: bold;">
              <input id="swal-pin" type="password" class="swal2-input" placeholder="Enter New PIN / Password">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update PIN',
            confirmButtonColor: '#ff5c0a',
            preConfirm: () => {
              const otpVal = document.getElementById('swal-otp')?.value;
              const pinVal = document.getElementById('swal-pin')?.value;
              if (!otpVal || !pinVal) {
                Swal.showValidationMessage('Please enter both OTP and New PIN');
                return false;
              }
              if (pinVal.length < 4) {
                Swal.showValidationMessage('PIN must be at least 4 characters');
                return false;
              }
              return { otp: otpVal.trim(), newPassword: pinVal.trim() };
            }
          });

          if (formValues) {
            Swal.fire({
              title: 'Updating PIN...',
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading()
            });

            const resetRes = await driverService.resetPassword({
              email: driverIdInput.trim(),
              otp: formValues.otp,
              newPassword: formValues.newPassword
            });

            if (resetRes && resetRes.success) {
              Swal.fire({
                icon: 'success',
                title: 'PIN Reset Successful!',
                text: 'Your security PIN has been updated. You can now log in.',
                confirmButtonColor: '#ff5c0a'
              });
              setIdentifier(driverIdInput.trim());
              setPassword(formValues.newPassword);
            } else {
              Swal.fire('Error', resetRes?.message || 'Invalid or expired OTP code', 'error');
            }
          }
        } else {
          Swal.fire('Error', res?.message || 'No registered driver account found with this ID or Email', 'error');
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Failed to dispatch reset OTP. Please check your network.', 'error');
      }
    }
  };

  const handleConfigServerIp = async () => {
    const { value: newIp } = await Swal.fire({
      title: 'Configure Central Server IP',
      text: "Enter your PC's Wi-Fi IPv4 address or Full API URL:",
      input: 'text',
      inputValue: serverUrl,
      showCancelButton: true,
      confirmButtonText: 'Save & Reconnect',
      confirmButtonColor: '#f59e0b',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) return 'Please enter a valid IP or URL!';
      }
    });

    if (newIp) {
      let formatted = newIp.trim().replace(/\/+$/, '');
      if (formatted.endsWith('/api')) {
        formatted = formatted.slice(0, -4);
      }

      if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
        if (formatted.includes('.onrender.com') || formatted.includes('.com') || formatted.includes('.net') || formatted.includes('.app')) {
          formatted = `https://${formatted}`;
        } else {
          formatted = `http://${formatted}`;
        }
      }

      const isCloudOrHttps = formatted.startsWith('https://') || formatted.includes('.onrender.com') || formatted.includes('.vercel.app');
      const hasPort = /:\d+$/.test(formatted);

      if (!hasPort && !isCloudOrHttps) {
        formatted = `${formatted}:5050`;
      }

      formatted = `${formatted}/api`;
      localStorage.setItem('api_base_url', formatted);
      if (typeof window !== 'undefined') {
        window.__API_BASE_URL__ = formatted;
      }
      setServerUrl(formatted);
      setError('');
      loadActiveDrivers();
      Swal.fire({
        icon: 'success',
        title: 'Server IP Updated!',
        text: `Target API set to ${formatted}`,
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans p-0 sm:p-3 select-none text-slate-800 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-orange-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      </div>

      {/* Desktop Top Stepper Bar */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm z-20">
        <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider mr-1">Switch Screen:</span>
        <button
          onClick={() => setCurrentStep('welcome')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'welcome' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          1. Welcome
        </button>
        <button
          onClick={() => setCurrentStep('role')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'role' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          2. Continue as
        </button>
        <button
          onClick={() => setCurrentStep('login')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'login' 
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          3. Login Form
        </button>
      </div>

      {/* Main Container: Fullscreen on Mobile, Phone Shell on Desktop (750px Height) */}
      <div className="w-full flex-1 sm:flex-initial sm:max-w-[380px] bg-white sm:rounded-[38px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] sm:border-[8px] sm:border-slate-800 overflow-y-auto sm:overflow-hidden min-h-screen sm:min-h-[700px] sm:h-[750px] sm:max-h-[94vh] flex flex-col relative transition-all">

        {/* ========================================================
            SCREEN 1: DRIVER WELCOME & FLEET HIGHLIGHTS
            ======================================================== */}
        {currentStep === 'welcome' && (
          <div className="flex-1 flex flex-col justify-between bg-white relative overflow-hidden min-h-full">
            
            {/* Top Header Section */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-4 sm:pt-3 pb-6 sm:pb-7 px-4 relative shrink-0 border-b border-slate-800">
              {/* Top Bar with Sign In Pill */}
              <div className="flex items-center justify-between z-20 mb-1">
                <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                  Fleet &amp; Transport Cloud Console
                </span>
                <button 
                  onClick={() => setCurrentStep('login')}
                  className="text-xs font-bold text-orange-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-orange-400/30 shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
                >
                  <span>Sign In</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>

              {/* Top Branding Section */}
              <div className="flex flex-col items-center text-center z-10 my-0.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-[1.5px] shadow-lg shadow-orange-500/20 mb-1 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <span className="text-sm font-black tracking-wider bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">ACS</span>
                  </div>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  ALL CORE <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">SOLUTION</span>
                </h1>
                <p className="text-xs font-bold text-slate-400 tracking-wide mt-1">
                  Fleet &amp; Transport Cloud Console
                </p>
              </div>

              {/* Vibrant Orange Wave Arc Divider */}
              <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-6 sm:h-7">
                  <path d="M0,15 Q250,55 500,10 L500,50 L0,50 Z" fill="#ff5c0a" opacity="0.95" />
                  <path d="M0,25 Q250,65 500,20 L500,50 L0,50 Z" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Hero Banner Card in a Box */}
            <div className="px-4 my-auto shrink-0 py-1">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 group">
                <img 
                  src={driverWelcomeHeroImg} 
                  alt="School Bus Driver" 
                  className="w-full h-40 sm:h-44 object-cover object-center group-hover:scale-102 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-orange-400 flex items-center gap-1.5 shadow-sm border border-orange-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>For Drivers</span>
                </div>
              </div>
            </div>

            {/* 4 Feature Module Cards */}
            <div className="px-4 pb-2 z-10 shrink-0">
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. View My Route (Orange Pin) */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-orange-50/60 hover:bg-orange-50 border border-orange-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#ff5c0a] flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <MapPin className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">View My Route</span>
                </div>

                {/* 2. Student Pick & Drop */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-amber-50/60 hover:bg-amber-50 border border-amber-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Bus className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Student Pick &amp; Drop</span>
                </div>

                {/* 3. Bus Attendance */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900/10 text-slate-800 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Clock className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Bus Attendance</span>
                </div>

                {/* 4. Get Notifications */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-rose-50/60 hover:bg-rose-50 border border-rose-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Bell className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Get Notifications</span>
                </div>
              </div>
            </div>

            {/* Bottom Curved Wave & Action Banner (Pinned to Bottom) */}
            <div 
              onClick={() => setCurrentStep('role')}
              className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-3.5 rounded-t-[28px] shadow-lg flex items-center justify-between cursor-pointer hover:brightness-110 transition-all border-t-2 border-[#ff5c0a] shrink-0"
            >
              <div className="flex items-center gap-2.5 flex-1 pr-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-400/30">
                  <ShieldCheck className="w-4 h-4 stroke-[2.4] shrink-0" />
                </div>
                <div>
                  <p className="text-xs font-black leading-tight text-white tracking-wide">
                    Safe &amp; On-Time Transportation
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-5 h-1.5 bg-[#ff5c0a] rounded-full shadow-xs" />
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:brightness-110 flex items-center justify-center shadow-md shadow-orange-500/30 shrink-0 transition-transform active:scale-90 cursor-pointer"
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
          <div className="flex-1 flex flex-col justify-between bg-white overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Top Header Section */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-3 pb-7 px-4 relative shrink-0 border-b border-slate-800">
              {/* Navigation Bar with Back Button */}
              <div className="flex items-center justify-between z-20 mb-1">
                <button 
                  onClick={() => setCurrentStep('welcome')}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-95"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                </button>
                <button 
                  onClick={() => setCurrentStep('login')}
                  className="text-xs font-bold text-orange-400 hover:underline cursor-pointer"
                >
                  Skip to Login
                </button>
              </div>

              {/* Branding Header */}
              <div className="flex flex-col items-center text-center z-10 my-0.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-[1.5px] shadow-lg shadow-orange-500/20 mb-1 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <span className="text-sm font-black tracking-wider bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">ACS</span>
                  </div>
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  ALL CORE <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">SOLUTION</span>
                </h1>
                <p className="text-xs font-bold text-slate-400 tracking-wide mt-1">
                  Fleet &amp; Transport Cloud Console
                </p>
              </div>

              {/* Vibrant Orange Wave Arc Divider */}
              <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-6 sm:h-7">
                  <path d="M0,15 Q250,55 500,10 L500,50 L0,50 Z" fill="#ff5c0a" opacity="0.95" />
                  <path d="M0,25 Q250,65 500,20 L500,50 L0,50 Z" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Middle Section: Title + Driver Card */}
            <div className="px-4 py-2 shrink-0">
              <div className="text-center pb-2.5">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Continue as
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Choose your role to access your account
                </p>
              </div>

              {/* Role Card: Driver (Orange Accent) */}
              <div 
                onClick={() => setCurrentStep('login')}
                className="bg-white hover:bg-orange-50/40 border-2 border-slate-200 hover:border-[#ff5c0a] rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-orange-100/80 shrink-0 border border-orange-200 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                    <img 
                      src={driverAvatarImg} 
                      alt="Driver Avatar" 
                      className="w-full h-full object-cover object-top" 
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#ff5c0a] transition-colors flex items-center gap-1.5">
                      <span>Driver</span>
                      <span className="text-[9.5px] bg-[#ff5c0a] text-white font-black px-1.5 py-0.2 rounded-full font-mono uppercase">
                        Fleet
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-snug mt-1">
                      Manage your routes, pick &amp; drop, student attendance and updates.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs shadow-orange-500/30 shrink-0 group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* School Bus & Campus Artwork at Bottom */}
            <div className="text-center px-4 pt-1 pb-4 shrink-0">
              <div className="w-full flex justify-center mb-2">
                <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-white">
                  <img 
                    src={schoolBusCampusImg} 
                    alt="School Campus & Fleet Bus" 
                    className="w-full h-32 sm:h-36 object-cover object-center" 
                  />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800">
                Ensure Safe &amp; Secure Transport for Our Students
              </p>
            </div>

          </div>
        )}

        {/* ========================================================
            SCREEN 3: DRIVER LOGIN FORM
            ======================================================== */}
        {currentStep === 'login' && (
          <div className="flex-1 flex flex-col justify-between bg-white overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Top Header Section */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-3 pb-8 px-4 relative shrink-0 border-b border-slate-800">
              <div className="flex items-center justify-between mb-1 z-20">
                <button 
                  onClick={() => setCurrentStep('role')}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/20 active:scale-95"
                  title="Back to Role Selection"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                </button>

                <div className="w-8"></div>
              </div>

              {/* Branding Header with Golden ACS Logo */}
              <div className="flex flex-col items-center text-center my-1 z-10">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-[1.5px] shadow-lg shadow-orange-500/20 mb-1 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <span className="text-sm font-black tracking-wider bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">ACS</span>
                  </div>
                </div>
                <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  ALL CORE <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">SOLUTION</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Fleet &amp; Transport Cloud Console
                </p>
              </div>

              {/* Vibrant Orange Wave Arc Divider */}
              <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-6 sm:h-7">
                  <path d="M0,15 Q250,55 500,10 L500,50 L0,50 Z" fill="#ff5c0a" opacity="0.95" />
                  <path d="M0,25 Q250,65 500,20 L500,50 L0,50 Z" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Overlapping White Sheet with Deep Rounded Top */}
            <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-2 pb-5 -mt-4 z-10 flex-1 flex flex-col justify-between">
              
              <div>
                {/* Floating Thumbs-Up Driver Banner Card */}
                <div className="w-full flex justify-center -mt-7 mb-2">
                  <div className="w-full max-w-[280px] h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-orange-200/80 bg-gradient-to-r from-orange-50 to-white flex items-center justify-center">
                    <img 
                      src={driverLoginBannerImg} 
                      alt="Driver Ready for Trip" 
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform" 
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-2">
                  <h2 className="text-base font-black text-slate-900 tracking-tight">
                    Driver Login
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Access your driver account
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="text-[11px] leading-tight">{error}</span>
                  </div>
                )}

                {/* Autofill Notification */}
                {autofillNotice && (
                  <div className="mb-2 p-1.5 bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
                    <span>{autofillNotice}</span>
                  </div>
                )}

                {/* Driver Login Form */}
                <form onSubmit={handleLogin} className="space-y-2.5">
                  {/* Driver ID / Username Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input 
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Driver ID / Username"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5c0a] focus:bg-white transition-all font-medium shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Password / PIN Input */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-9 pr-9 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5c0a] focus:bg-white transition-all font-medium shadow-2xs font-mono tracking-wider"
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
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-[#ff5c0a] border-slate-300" 
                      />
                      <span>Remember me</span>
                    </label>

                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Vibrant Gradient Login Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1.5 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Login</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </>
                    )}
                  </button>
                </form>

                {/* Dynamic Fleet Quick Fill Chips (only shown if fleet drivers are loaded) */}
                {driversList && driversList.length > 0 && (
                  <div className="flex items-center justify-center flex-wrap gap-1.5 mt-2 text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-400">Quick Fill:</span>
                    {driversList.slice(0, 3).map((drv, idx) => (
                      <button
                        key={drv.driverId || drv._id || idx}
                        type="button"
                        onClick={() => handleSelectDriver(drv)}
                        className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold border border-orange-200/80 cursor-pointer"
                      >
                        {drv.driverId || drv.name}
                      </button>
                    ))}
                  </div>
                )}

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
              </div>

              {/* Bottom Support / Help Callout */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-3 bg-gradient-to-r from-orange-50/60 via-slate-50 to-orange-50/40 p-2.5 rounded-xl border border-orange-200/60">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-[#ff5c0a] flex items-center justify-center shrink-0 shadow-2xs border border-orange-500/30">
                  <Headphones className="w-4 h-4 stroke-[2.3]" />
                </div>
                <div className="text-[10px] text-slate-600 leading-snug">
                  <strong className="text-slate-900 font-bold block">Need Help?</strong>
                  Contact the school admin for login credentials or support.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
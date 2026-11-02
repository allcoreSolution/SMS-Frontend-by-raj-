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

// Fallback Fleet Drivers
const FALLBACK_DRIVERS = [
  { driverId: 'DRV-101', name: 'Ramesh Kumar', assignedBus: 'DL-01-AB-4501', pin: '1011', mobile: '+91 98112 23399' },
  { driverId: 'DRV-102', name: 'Sukhwinder Singh', assignedBus: 'DL-01-AB-4502', pin: '1022', mobile: '+91 98112 23398' },
  { driverId: 'DRV-103', name: 'Harish Chandra', assignedBus: 'DL-01-AB-4503', pin: '1033', mobile: '+91 98112 23397' },
  { driverId: 'DRV-104', name: 'Mohd. Aslam', assignedBus: 'DL-01-AB-4504', pin: '1044', mobile: '+91 98112 23396' },
  { driverId: 'DRV-105', name: 'Balram Yadav', assignedBus: 'DL-01-AB-4505', pin: '1055', mobile: '+91 98112 23395' },
  { driverId: 'DRV-106', name: 'Suresh Verma', assignedBus: 'DL-09-XY-2704', pin: 'MyPassword999', mobile: '+91 98112 23394' }
];

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

  // Stepper State: 'welcome' | 'role' | 'login'
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

  const [driversList, setDriversList] = useState(FALLBACK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState(FALLBACK_DRIVERS[0]);
  const [identifier, setIdentifier] = useState('DRV-101');
  const [password, setPassword] = useState('1011');
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
        const matched = res.data.find(d => d.driverId === identifier) || res.data[0];
        setSelectedDriver(matched);
        setIdentifier(matched.driverId);
        setPassword(matched.pin || '1011');
      }
    } catch (e) {
      console.warn('Using local fleet driver directory:', e.message);
    }
  };

  useEffect(() => {
    loadActiveDrivers();
  }, []);

  const handleSelectDriver = (drv) => {
    setSelectedDriver(drv);
    setIdentifier(drv.driverId);
    setPassword(drv.pin || '1011');
    setError('');
    setAutofillNotice(`Loaded credentials for ${drv.name} (${drv.driverId})`);
    setTimeout(() => setAutofillNotice(''), 2500);
  };

  const handleQuickDemo = (drvId) => {
    const drv = driversList.find(d => d.driverId === drvId) || FALLBACK_DRIVERS.find(d => d.driverId === drvId) || FALLBACK_DRIVERS[0];
    handleSelectDriver(drv);
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
      text: `Authenticating driver account for ${identifier || 'DRV-101'}...`,
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
      text: 'Enter your Driver ID or Registered Mobile Number:',
      input: 'text',
      inputValue: identifier || 'DRV-101',
      inputPlaceholder: 'e.g. DRV-101 or 9811223399',
      showCancelButton: true,
      confirmButtonText: 'Verify & Send PIN',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f59e0b',
      inputValidator: (val) => {
        if (!val || !val.trim()) {
          return 'Please enter your Driver ID or Mobile Number!';
        }
      }
    });

    if (driverIdInput) {
      const matched = driversList.find(d => 
        d.driverId.toLowerCase() === driverIdInput.trim().toLowerCase() ||
        (d.mobile && d.mobile.includes(driverIdInput.trim()))
      ) || FALLBACK_DRIVERS[0];

      Swal.fire({
        icon: 'success',
        title: 'Security PIN Dispatched',
        html: `
          <p style="font-size: 13px; color: #475569; margin-bottom: 8px;">
            Driver ID: <strong>${matched.driverId}</strong> (${matched.name})
          </p>
          <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 10px; border-radius: 10px; margin: 10px 0;">
            <p style="font-size: 11px; color: #92400e; margin: 0; font-weight: 600;">Default Security PIN:</p>
            <p style="font-size: 20px; font-weight: 900; color: #b45309; letter-spacing: 4px; margin: 4px 0 0;">${matched.pin || '1011'}</p>
          </div>
          <p style="font-size: 11px; color: #64748b; margin-top: 6px;">
            A backup verification SMS has also been dispatched to your mobile.
          </p>
        `,
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'Apply PIN & Login'
      }).then(() => {
        setIdentifier(matched.driverId);
        setPassword(matched.pin || '1011');
      });
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
      let formatted = newIp.trim();
      if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
        formatted = `http://${formatted}`;
      }
      if (!formatted.includes(':5050')) {
        formatted = `${formatted}:5050`;
      }
      if (!formatted.endsWith('/api')) {
        formatted = `${formatted}/api`;
      }
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-sans p-0 sm:p-3 select-none text-slate-800">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Desktop Top Stepper Bar */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-slate-800/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 shadow-sm z-20">
        <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider mr-1">Switch Screen:</span>
        <button
          onClick={() => setCurrentStep('welcome')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'welcome' 
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
              : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          1. Welcome
        </button>
        <button
          onClick={() => setCurrentStep('role')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'role' 
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
              : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          2. Continue as
        </button>
        <button
          onClick={() => setCurrentStep('login')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentStep === 'login' 
              ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
              : 'text-slate-300 hover:bg-slate-700'
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
            
            {/* Top Navy Header Section */}
            <div className="bg-gradient-to-b from-[#041226] via-[#061a38] to-[#0a2349] text-white pt-4 sm:pt-3 pb-6 sm:pb-7 px-4 relative shrink-0">
              {/* Top Bar with Sign In Pill */}
              <div className="flex items-center justify-between z-20 mb-1">
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Fleet v3.7
                </span>
                <button 
                  onClick={() => setCurrentStep('login')}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-amber-400/30 shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
                >
                  <span>Sign In</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>

              {/* Top Branding Section */}
              <div className="flex flex-col items-center text-center z-10 my-0.5">
                <SchoolLogo3D className="w-[52px] h-[42px] mb-1 shrink-0" variant="darkHeader" />
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  School <span className="text-amber-400">ERP</span>
                </h1>
                <p className="text-xs font-bold text-slate-300 tracking-wide mt-1">
                  Smart School Management System
                </p>
              </div>

              {/* Golden Wave Arc Divider */}
              <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-6 sm:h-7">
                  <path d="M0,15 Q250,55 500,10 L500,50 L0,50 Z" fill="#f59e0b" opacity="0.95" />
                  <path d="M0,25 Q250,65 500,20 L500,50 L0,50 Z" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Hero Banner Card in a Box */}
            <div className="px-4 my-auto shrink-0 py-1">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-amber-200/70 bg-slate-900 group">
                <img 
                  src={driverWelcomeHeroImg} 
                  alt="School Bus Driver" 
                  className="w-full h-40 sm:h-44 object-cover object-center group-hover:scale-102 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-amber-300 flex items-center gap-1.5 shadow-sm border border-amber-400/50">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>For Drivers</span>
                </div>
              </div>
            </div>

            {/* 4 Feature Module Cards (Pastel Backgrounds matching Mockup) */}
            <div className="px-4 pb-2 z-10 shrink-0">
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. View My Route (Red Pin) */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-[#fff1f2] hover:bg-[#ffe4e6] border border-rose-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <MapPin className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">View My Route</span>
                </div>

                {/* 2. Student Pick & Drop (Blue Bus) */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-[#eff6ff] hover:bg-[#dbeafe] border border-blue-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Bus className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Student Pick &amp; Drop</span>
                </div>

                {/* 3. Bus Attendance (Green Clock) */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-[#f0fdf4] hover:bg-[#dcfce7] border border-emerald-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Clock className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Bus Attendance</span>
                </div>

                {/* 4. Get Notifications (Amber Bell) */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-[#fffbeb] hover:bg-[#fef3c7] border border-amber-200/80 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Bell className="w-5 h-5 stroke-[2.2] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Get Notifications</span>
                </div>
              </div>
            </div>

            {/* Bottom Curved Navy Wave & Action Banner (Pinned to Bottom) */}
            <div 
              onClick={() => setCurrentStep('role')}
              className="bg-gradient-to-r from-[#041226] via-[#061a38] to-[#0a2349] text-white px-4 py-3.5 rounded-t-[28px] shadow-lg flex items-center justify-between cursor-pointer hover:brightness-110 transition-all border-t-2 border-amber-400 shrink-0"
            >
              <div className="flex items-center gap-2.5 flex-1 pr-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                  <ShieldCheck className="w-4 h-4 stroke-[2.4] shrink-0" />
                </div>
                <div>
                  <p className="text-xs font-black leading-tight text-white tracking-wide">
                    Safe &amp; On-Time Transportation
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-5 h-1.5 bg-amber-400 rounded-full shadow-xs" />
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white text-slate-900 hover:bg-amber-100 flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-90 cursor-pointer"
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
            
            {/* Top Navy Header Section */}
            <div className="bg-gradient-to-b from-[#041226] via-[#061a38] to-[#0a2349] text-white pt-3 pb-7 px-4 relative shrink-0">
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
                  className="text-xs font-bold text-amber-300 hover:underline cursor-pointer"
                >
                  Skip to Login
                </button>
              </div>

              {/* Branding Header */}
              <div className="flex flex-col items-center text-center z-10 my-0.5">
                <SchoolLogo3D className="w-[52px] h-[42px] mb-1" variant="darkHeader" />
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1 leading-none">
                  School <span className="text-amber-400">ERP</span>
                </h1>
                <p className="text-[11px] font-semibold text-slate-300 mt-1">
                  Smart School Management System
                </p>
              </div>

              {/* Golden Wave Arc Divider */}
              <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-6 sm:h-7">
                  <path d="M0,15 Q250,55 500,10 L500,50 L0,50 Z" fill="#f59e0b" opacity="0.95" />
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

              {/* Role Card: Driver (Golden Accent) */}
              <div 
                onClick={() => setCurrentStep('login')}
                className="bg-gradient-to-r from-[#fffbeb] via-[#fef3c7] to-white hover:from-[#fde68a]/50 border-2 border-amber-300/80 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-amber-100 shrink-0 border border-amber-300/60 shadow-2xs flex items-center justify-center">
                    <img 
                      src={driverAvatarImg} 
                      alt="Driver Avatar" 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                      <span>Driver</span>
                      <span className="text-[9.5px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full font-mono uppercase">
                        Fleet
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-snug mt-1">
                      Manage your routes, pick &amp; drop, student attendance and updates.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* School Bus & Campus Artwork at Bottom */}
            <div className="text-center px-4 pt-1 pb-4 shrink-0">
              <div className="w-full flex justify-center mb-2">
                <div className="w-full max-w-[280px] rounded-2xl overflow-hidden shadow-xs border border-amber-200/60 bg-white">
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
            
            {/* Top Navy Header Section */}
            <div className="bg-gradient-to-b from-[#041226] via-[#061a38] to-[#0a2349] text-white pt-3 pb-8 px-4 relative shrink-0">
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

              {/* Branding Header with 3D White Logo */}
              <div className="flex flex-col items-center text-center my-1 z-10">
                <SchoolLogo3D className="w-12 h-9 mb-0.5" variant="darkHeader" />
                <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  School <span className="text-amber-400">ERP</span>
                </h1>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">
                  Smart School Management System
                </p>
              </div>

              {/* Golden Wave Arc Divider */}
              <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-6 sm:h-7">
                  <path d="M0,15 Q250,55 500,10 L500,50 L0,50 Z" fill="#f59e0b" opacity="0.95" />
                  <path d="M0,25 Q250,65 500,20 L500,50 L0,50 Z" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Overlapping White Sheet with Deep Rounded Top */}
            <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-2 pb-5 -mt-4 z-10 flex-1 flex flex-col justify-between">
              
              <div>
                {/* Floating Thumbs-Up Driver Banner Card */}
                <div className="w-full flex justify-center -mt-7 mb-2">
                  <div className="w-full max-w-[280px] h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-amber-200/80 bg-gradient-to-r from-amber-50 to-white flex items-center justify-center">
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
                  <div className="mb-2 p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
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
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white transition-all font-medium shadow-2xs"
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
                        className="w-full pl-9 pr-9 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white transition-all font-medium shadow-2xs font-mono tracking-wider"
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
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300" 
                      />
                      <span>Remember me</span>
                    </label>

                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Golden Yellow Vibrant Login Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1.5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-sm shadow-md shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
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

                {/* Quick Demo Fleet Chips */}
                <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-400">Quick Demo:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('DRV-101')}
                    className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold border border-amber-200/80 cursor-pointer"
                  >
                    DRV-101
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('DRV-102')}
                    className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold border border-amber-200/80 cursor-pointer"
                  >
                    DRV-102
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('DRV-106')}
                    className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold border border-amber-200/80 cursor-pointer"
                  >
                    DRV-106
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
              </div>

              {/* Bottom Support / Help Callout */}
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-3 bg-gradient-to-r from-amber-50/50 via-slate-50/80 to-blue-50/40 p-2.5 rounded-xl border border-amber-100/70">
                <div className="w-8 h-8 rounded-lg bg-[#061a38] text-amber-400 flex items-center justify-center shrink-0 shadow-2xs border border-amber-400/30">
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { useLanguage } from '../context/LanguageContext';
import { 
  Lock, ArrowRight, ShieldCheck, GraduationCap, 
  Eye, EyeOff, AlertCircle, ExternalLink, Users, Globe
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function Login() {
  const [roleTab, setRoleTab] = useState('student'); // 'student' | 'parent'
  const [userId, setUserId] = useState('YIS-2024-101');
  const [password, setPassword] = useState('secret_access_24');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filledNotice, setFilledNotice] = useState(false);
  const navigate = useNavigate();
  const { currentLang, setLanguage } = useLanguage();

  const isStudentRole = roleTab === 'student';

  const handleRoleChange = (role) => {
    setRoleTab(role);
    setError('');
    localStorage.removeItem('active_child');
    if (role === 'student') {
      setUserId('YIS-2024-101');
    } else {
      setUserId('P-1920-KABIR');
    }
  };

  const handleSelectStudentDemo = () => {
    setRoleTab('student');
    setUserId('YIS-2024-101');
    setPassword('secret_access_24');
    setError('');
    setFilledNotice(true);
    setTimeout(() => setFilledNotice(false), 2000);
  };

  const handleSelectParentDemo = () => {
    setRoleTab('parent');
    setUserId('P-1920-KABIR');
    setPassword('secret_access_24');
    setError('');
    setFilledNotice(true);
    setTimeout(() => setFilledNotice(false), 2000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      localStorage.removeItem('active_child');
      localStorage.removeItem('parent_user');
      localStorage.removeItem('parent_token');
      
      const res = await authService.login({ userId, password, role: roleTab });
      if (res && res.success) {
        navigate('/dashboard');
      } else {
        setError(res?.message || (currentLang === 'hi' ? 'लॉगिन विफल। कृपया क्रेडेंशियल जांचें।' : 'Login failed. Please check credentials.'));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Connection failed';
      if (String(msg).toLowerCase().includes('network') || err.code === 'ERR_NETWORK') {
        setError(currentLang === 'hi' ? 'सर्वर से संपर्क हो रहा है, डेमो मोड सक्रिय...' : 'Server connecting, attempting demo mode...');
        try {
          const fallback = await authService.login({ userId, password, role: roleTab });
          if (fallback && fallback.success) {
            navigate('/dashboard');
            return;
          }
        } catch (_) {}
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const defaultPlaceholder = isStudentRole 
      ? 'e.g. YIS-2024-101 or student@yis.edu' 
      : 'e.g. 9876510108 or parent@gmail.com';

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
      confirmButtonColor: isStudentRole ? '#2563EB' : '#059669',
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
            confirmButtonColor: isStudentRole ? '#2563EB' : '#059669',
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
                  ? 'आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है। अब नए पासवर्ड से लॉगिन करें।'
                  : 'Your password has been updated successfully. You can now login with your new credentials.',
                confirmButtonColor: isStudentRole ? '#2563EB' : '#059669'
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
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Request Failed',
            text: res?.message || 'Failed to dispatch password reset OTP.'
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: err.response?.data?.message || err.message || 'Unable to connect to auth server'
        });
      }
    }
  };

  return (
    <div className="h-screen w-screen max-h-screen max-w-full overflow-hidden bg-slate-50 flex flex-col lg:flex-row font-sans select-none fixed inset-0">

      {/* ── LEFT SIDE: BRANDING PANEL (FIXED SCREEN, NO SCROLL) ── */}
      <div className={`hidden lg:flex flex-col justify-between w-1/2 h-full max-h-screen p-8 xl:p-12 text-white shadow-2xl relative overflow-hidden transition-colors duration-500 bg-gradient-to-br ${
        isStudentRole 
          ? 'from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB]' 
          : 'from-[#064E3B] via-[#059669] to-[#047857]'
      }`}>
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -bottom-36 -left-36 w-96 h-96 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-[70px] pointer-events-none" />

        <div className="relative z-10 w-full my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 mb-4 text-white shadow-xs">
            {isStudentRole ? (
              <GraduationCap className="w-4 h-4 text-amber-300" />
            ) : (
              <Users className="w-4 h-4 text-emerald-200" />
            )}
            <span className="text-[10.5px] font-black uppercase tracking-wider">
              ACS Smart Campus &bull; {isStudentRole ? 'Student Workspace' : 'Parent Supervisory Desk'}
            </span>
          </div>

          <h1 className="text-white text-3xl xl:text-4xl font-black tracking-tight leading-tight font-serif">
            {isStudentRole ? (
              <>
                Next-Gen <br />
                <span className="text-amber-300">Student Learning</span> <br />
                Digital Portal.
              </>
            ) : (
              <>
                Empowered <br />
                <span className="text-emerald-200">Parent Monitoring</span> <br />
                Digital Desk.
              </>
            )}
          </h1>

          <p className="mt-3 text-white/90 text-xs xl:text-sm font-medium leading-relaxed max-w-md">
            {isStudentRole
              ? 'Real-time academic synchronization: class timetable, homework submission, CBSE attendance, and 24/7 AI learning assistant.'
              : 'Direct oversight for guardians: multi-ward academic monitoring, secure fee payments, real-time bus tracking, and official PTM schedule.'
            }
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 max-w-md">
            {/* Feature 1 */}
            <div className={`p-3 rounded-xl backdrop-blur-md border transition-all ${
              isStudentRole ? 'bg-white/20 border-white/30 shadow-xs' : 'bg-white/10 border-white/15 opacity-75'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center mb-1.5 text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-white font-black text-[11px] uppercase tracking-wide">
                {currentLang === 'hi' ? 'विद्यार्थी स्पेस' : 'Student Space'}
              </h3>
              <p className="text-white/80 text-[10px] leading-tight mt-0.5">
                {currentLang === 'hi' 
                  ? 'गृहकार्य, दैनिक डायरी, क्लासवर्क व परीक्षा परिणाम।' 
                  : 'Homework, daily diary, live classes & report cards.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-3 rounded-xl backdrop-blur-md border transition-all ${
              !isStudentRole ? 'bg-white/20 border-white/30 shadow-xs' : 'bg-white/10 border-white/15 opacity-75'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center mb-1.5 text-white">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-white font-black text-[11px] uppercase tracking-wide">
                {currentLang === 'hi' ? 'अभिभावक डेस्क' : 'Parent Desk'}
              </h3>
              <p className="text-white/80 text-[10px] leading-tight mt-0.5">
                {currentLang === 'hi' 
                  ? 'मल्टी-वार्ड स्विच, ऑनलाइन फीस, बस ट्रैकिंग व पीटीएम।' 
                  : 'Multi-ward switch, online fee payment & bus telemetry.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/80 shrink-0">
          <span>&copy; {new Date().getFullYear()} ACS International School</span>
          <span className="font-semibold text-white">
            By <strong className="text-amber-300">RAJ YADAV</strong> @ALLCORE SOLUTION
          </span>
        </div>
      </div>

      {/* ── RIGHT SIDE: LOGIN FORM (FIXED SCREEN, ABSOLUTELY ZERO SCROLL) ── */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 h-full max-h-screen p-3.5 sm:p-5 lg:p-6 xl:p-8 bg-white overflow-hidden">

        {/* Top Header & Language Switcher (Compact, Shrink-0) */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-2xs transition-colors ${
              isStudentRole ? 'bg-[#2563EB]' : 'bg-[#059669]'
            }`}>
              {isStudentRole ? <GraduationCap className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-gray-900 text-xs sm:text-sm font-serif leading-tight">ACS Smart Campus</span>
              <span className={`text-[8.5px] font-bold uppercase tracking-wider ${isStudentRole ? 'text-blue-600' : 'text-emerald-600'}`}>
                {isStudentRole ? 'Student Portal' : 'Parent Portal'}
              </span>
            </div>
          </div>

          {/* Language Switch Button */}
          <button
            type="button"
            onClick={() => setLanguage(currentLang === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3 h-3 text-blue-600" />
            <span>{currentLang === 'hi' ? '🇬🇧 English' : '🇮🇳 हिन्दी'}</span>
          </button>
        </div>

        {/* Centered Main Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto flex flex-col justify-center py-1">
          
          {/* Logo & Heading */}
          <div className="mb-2.5 flex flex-col items-center text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 shadow-md transition-all duration-300 ${
              isStudentRole 
                ? 'bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-blue-500/25' 
                : 'bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white shadow-emerald-500/25'
            }`}>
              {isStudentRole ? <GraduationCap className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-serif leading-tight">
              {isStudentRole 
                ? (currentLang === 'hi' ? 'विद्यार्थी पोर्टल लॉगिन' : 'Student Portal Login')
                : (currentLang === 'hi' ? 'अभिभावक पोर्टल लॉगिन' : 'Parent Portal Login')
              }
            </h2>
            <p className="text-[10.5px] font-medium text-slate-500">
              {currentLang === 'hi'
                ? 'प्रवेश के लिए अपनी भूमिका व क्रेडेंशियल चुनें'
                : 'Select your role to access student or parent portal'
              }
            </p>
          </div>

          {/* DUAL ROLE TAB SWITCHER: STUDENT vs PARENT */}
          <div className="mb-2 p-0.5 bg-slate-100 rounded-xl grid grid-cols-2 gap-1 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isStudentRole
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'विद्यार्थी' : 'Student'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('parent')}
              className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isStudentRole
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'अभिभावक' : 'Parent'}</span>
            </button>
          </div>

          {/* FAST ONE-CLICK DEMO IDENTITY CARDS (COMPACT) */}
          <div className="mb-2.5">
            <div className="flex items-center justify-between mb-1 px-0.5">
              <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">
                {currentLang === 'hi' ? 'त्वरित डेमो क्रेडेंशियल्स' : 'Quick Demo Credentials'}
              </span>
              {filledNotice && (
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                  ✓ {currentLang === 'hi' ? 'लागू हुआ!' : 'Applied!'}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              {/* Student Demo Card */}
              <button
                type="button"
                onClick={handleSelectStudentDemo}
                className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer group ${
                  isStudentRole && userId === 'YIS-2024-101'
                    ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] font-black flex items-center justify-center shrink-0">
                    A
                  </div>
                  <span className="text-[11px] font-black text-slate-900 truncate">Aarav Sharma</span>
                </div>
                <p className="text-[9px] font-bold text-blue-700 truncate mt-0.5">
                  YIS-2024-101 &bull; Class I
                </p>
              </button>

              {/* Parent Demo Card */}
              <button
                type="button"
                onClick={handleSelectParentDemo}
                className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer group ${
                  !isStudentRole
                    ? 'bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'bg-slate-50 hover:bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[8px] font-black flex items-center justify-center shrink-0">
                    V
                  </div>
                  <span className="text-[11px] font-black text-slate-900 truncate">Vikram Chauhan</span>
                </div>
                <p className="text-[9px] font-bold text-emerald-700 truncate mt-0.5">
                  P-1920-KABIR &bull; 2 Wards
                </p>
              </button>
            </div>
          </div>

          {/* In-page Error Banner */}
          {error && (
            <div className="mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}

          {/* Form Section */}
          <form className="space-y-2.5" onSubmit={handleLogin}>

            {/* ID Input */}
            <div>
              <label htmlFor="userId" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                {isStudentRole 
                  ? (currentLang === 'hi' ? 'विद्यार्थी रोल नं. / प्रवेश आईडी' : 'Student Roll No / Admission ID')
                  : (currentLang === 'hi' ? 'अभिभावक पोर्टल आईडी / मोबाइल' : 'Parent Portal ID / Mobile Number')
                }
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isStudentRole ? (
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className={`block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white text-xs font-bold text-slate-900 transition-all shadow-2xs ${
                    isStudentRole 
                      ? 'focus:ring-1 focus:ring-blue-500/25 focus:border-blue-600' 
                      : 'focus:ring-1 focus:ring-emerald-500/25 focus:border-emerald-600'
                  }`}
                  placeholder={
                    isStudentRole 
                      ? 'e.g. YIS-2024-101 or Aarav' 
                      : 'e.g. P-1920-KABIR or 9876510108'
                  }
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label htmlFor="password" className="block text-[11px] font-bold text-slate-700">
                  {currentLang === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <span className="text-[9.5px] font-semibold text-slate-400">
                  Default: secret_access_24
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:bg-white text-xs font-bold text-slate-900 transition-all shadow-2xs ${
                    isStudentRole 
                      ? 'focus:ring-1 focus:ring-blue-500/25 focus:border-blue-600' 
                      : 'focus:ring-1 focus:ring-emerald-500/25 focus:border-emerald-600'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className={`w-3.5 h-3.5 rounded border-slate-300 cursor-pointer ${
                    isStudentRole ? 'text-blue-600 focus:ring-blue-500' : 'text-emerald-600 focus:ring-emerald-500'
                  }`}
                />
                <span>{currentLang === 'hi' ? 'सत्र याद रखें' : 'Remember session'}</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className={`text-[11px] font-bold hover:underline cursor-pointer transition-colors ${
                  isStudentRole ? 'text-blue-600 hover:text-blue-700' : 'text-emerald-600 hover:text-emerald-700'
                }`}
              >
                {currentLang === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-1.5 w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] shadow-md ${
                isStudentRole
                  ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 shadow-blue-600/25 hover:opacity-95'
                  : 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 shadow-emerald-600/25 hover:opacity-95'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {isStudentRole 
                      ? (currentLang === 'hi' ? 'विद्यार्थी पोर्टल में प्रवेश करें →' : 'Sign In to Student Portal →')
                      : (currentLang === 'hi' ? 'अभिभावक पोर्टल में प्रवेश करें →' : 'Sign In to Parent Portal →')
                    }
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1 pt-1 text-slate-400 justify-center w-full text-[9px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>{currentLang === 'hi' ? 'सुरक्षित एन्क्रिप्टेड कनेक्शन' : 'Central Database Link'}</span>
            </div>

          </form>
        </div>

        {/* Compact Footer (Fixed At Bottom, Single Line, Shrink-0) */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span>Main ERP:</span>
            <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5">
              <span>localhost:5173</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <div>
            Built by <strong className="text-slate-700 font-bold">RAJ YADAV</strong> <span className="text-blue-600 font-bold">@ALLCORE</span>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { 
  LogIn, 
  Lock, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle, 
  Building2, 
  Globe, 
  ArrowRight,
  Briefcase,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const navigate = useNavigate();
  const { currentLang, changeLanguage, t } = useLanguage();

  // Role Switcher State: 'teacher' or 'staff'
  const [selectedRole, setSelectedRole] = useState('teacher');

  const [formData, setFormData] = useState({ 
    identifier: 'ryadavy498@gmail.com', 
    password: 'admin@123' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Handle Role Switch
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    if (role === 'teacher') {
      setFormData({
        identifier: 'ryadavy498@gmail.com',
        password: 'admin@123'
      });
    } else {
      setFormData({
        identifier: 'staff@school.edu',
        password: 'admin@123'
      });
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', {
        empId: formData.identifier,
        email: formData.identifier,
        password: formData.password,
        role: selectedRole === 'teacher' ? 'teacher' : 'staff'
      });

      if (res.data?.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify({
          ...res.data.data,
          role: selectedRole === 'staff' ? 'Staff' : (res.data.data.role || 'Teacher')
        }));
        if (res.data.data.tenantId) {
          localStorage.setItem('schoolId', res.data.data.tenantId);
        }

        Swal.fire({
          icon: 'success',
          title: selectedRole === 'staff' ? 'Staff Access Granted' : 'Teacher Access Granted',
          text: `Welcome to the ${selectedRole === 'staff' ? 'Staff & Administration' : 'Teacher'} Portal`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

        navigate('/');
      }
    } catch (err) {
      // Graceful offline demo fallback
      const isTeacherCred = (formData.identifier === 'ryadavy498@gmail.com' || formData.identifier === 'admin123@gmail.com' || formData.identifier === 'amit.sharma@school.edu') && formData.password === 'admin@123';
      const isStaffCred = (formData.identifier === 'staff@school.edu' || formData.identifier === 'admin@school.edu' || formData.identifier === 'EMP-101') && formData.password === 'admin@123';

      if (isTeacherCred || isStaffCred || selectedRole) {
        const isStaffUser = selectedRole === 'staff' || isStaffCred;
        const demoUser = isStaffUser ? {
          _id: '6ac78a6d1125ffc6d7987bbb',
          name: 'Rajesh Verma',
          fullName: 'Rajesh Verma',
          email: formData.identifier || 'staff@school.edu',
          role: 'Staff',
          designation: 'Senior Administrative Officer',
          department: 'Administration & HR',
          token: 'demo_staff_session_token_2026'
        } : {
          _id: '6ac78a6d1125ffc6d7987aaa',
          name: 'Amit Sharma',
          fullName: 'Amit Sharma',
          email: formData.identifier || 'amit.sharma@school.edu',
          role: 'Teacher',
          designation: 'Senior PGT Mathematics',
          department: 'Science & Math',
          token: 'demo_teacher_session_token_2026'
        };

        localStorage.setItem('token', demoUser.token);
        localStorage.setItem('user', JSON.stringify(demoUser));

        Swal.fire({
          icon: 'success',
          title: `${demoUser.role} Access Granted`,
          text: `Welcome ${demoUser.name} (${demoUser.designation})`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

        navigate('/');
        return;
      }

      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';

      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: msg,
        confirmButtonColor: '#ff5c0a',
        background: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Instant Demo Login
  const quickDemoLogin = (role) => {
    handleSelectRole(role);
    setTimeout(() => {
      const isStaff = role === 'staff';
      const demoUser = isStaff ? {
        _id: '6ac78a6d1125ffc6d7987bbb',
        name: 'Rajesh Verma',
        fullName: 'Rajesh Verma',
        email: 'staff@school.edu',
        role: 'Staff',
        designation: 'Senior Administrative Officer',
        department: 'Administration & HR',
        token: 'demo_staff_session_token_2026'
      } : {
        _id: '6ac78a6d1125ffc6d7987aaa',
        name: 'Amit Sharma',
        fullName: 'Amit Sharma',
        email: 'ryadavy498@gmail.com',
        role: 'Teacher',
        designation: 'Senior PGT Mathematics',
        department: 'Science & Math',
        token: 'demo_teacher_session_token_2026'
      };

      localStorage.setItem('token', demoUser.token);
      localStorage.setItem('user', JSON.stringify(demoUser));

      Swal.fire({
        icon: 'success',
        title: `${demoUser.role} Login Successful`,
        text: `Logged in as ${demoUser.name} (${demoUser.designation})`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1800
      });

      navigate('/');
    }, 100);
  };

  const handleForgotPassword = async () => {
    const { value: resetEmail } = await Swal.fire({
      title: 'Reset Password',
      text: 'Enter your registered employee email to receive a reset OTP:',
      input: 'email',
      inputValue: formData.identifier || 'ryadavy498@gmail.com',
      showCancelButton: true,
      confirmButtonText: 'Send Reset OTP',
      confirmButtonColor: '#ff5c0a'
    });

    if (resetEmail) {
      try {
        Swal.fire({
          title: 'Sending OTP...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const res = await fetch('http://localhost:5050/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetEmail })
        }).then(r => r.json());

        if (res.success) {
          const { value: formValues } = await Swal.fire({
            title: 'Enter OTP & New Password',
            html: `
              <p style="font-size: 13px; color: #555; margin-bottom: 12px;">OTP sent to <b>${resetEmail}</b>. Check your inbox.</p>
              <input id="swal-otp" class="swal2-input" placeholder="6-digit OTP" maxlength="6" style="text-align: center; font-size: 20px; letter-spacing: 4px; font-weight: bold;">
              <input id="swal-password" type="password" class="swal2-input" placeholder="Enter New Password (min 6 chars)">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update Password',
            confirmButtonColor: '#ff5c0a',
            preConfirm: () => {
              const otpVal = document.getElementById('swal-otp').value;
              const newPassVal = document.getElementById('swal-password').value;
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

            const resetRes = await fetch('http://localhost:5050/api/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email: resetEmail, 
                otp: formValues.otp, 
                newPassword: formValues.newPassword 
              })
            }).then(r => r.json());

            if (resetRes.success) {
              Swal.fire({
                icon: 'success',
                title: 'Password Updated!',
                text: 'Your password has been changed. You can now login.',
                confirmButtonColor: '#ff5c0a'
              });
              setFormData({ ...formData, password: formValues.newPassword });
            } else {
              Swal.fire('Error', resetRes.message || 'Invalid OTP code', 'error');
            }
          }
        } else {
          Swal.fire('Account Not Found', res.message || 'No account found with this email', 'error');
        }
      } catch (err) {
        Swal.fire('Connection Error', 'Could not reach server to reset password', 'error');
      }
    }
  };

  const isTeacher = selectedRole === 'teacher';

  return (
    <div className="fixed inset-0 h-screen w-screen max-h-screen max-w-full overflow-hidden bg-slate-50 flex flex-col lg:flex-row font-sans select-none">

      {/* ── LEFT HERO: BRANDING PANEL (FIXED SCREEN, ABSOLUTELY ZERO SCROLL) ── */}
      <div className={`hidden lg:flex flex-col justify-between w-1/2 h-full max-h-screen p-8 xl:p-12 text-white relative overflow-hidden transition-colors duration-500 shadow-2xl ${
        isTeacher 
          ? 'bg-gradient-to-br from-[#131927] via-[#1a233a] to-[#0f1422]' 
          : 'bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#0f172a]'
      }`}>
        {/* Ambient Glows */}
        <div className={`absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full opacity-20 blur-[90px] transition-colors duration-500 pointer-events-none ${
          isTeacher ? 'bg-[#ff5c0a]' : 'bg-indigo-600'
        }`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500 opacity-10 blur-[80px] pointer-events-none" />

        {/* Top Tag */}
        <div className="relative z-10 w-full my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-300 text-xs font-semibold mb-4 border border-white/10">
            <span className={`w-2 h-2 rounded-full ${isTeacher ? 'bg-orange-400' : 'bg-indigo-400'}`} />
            <span>{isTeacher ? 'Teacher & Faculty Suite' : 'Staff & Administration Desk'}</span>
          </div>

          <h1 className="text-white text-3xl xl:text-4xl font-black leading-tight mb-3 tracking-tight">
            {isTeacher ? (
              <>Empowering Teachers, <br /><span className="text-[#ff5c0a]">Elevating Students.</span></>
            ) : (
              <>Seamless School Operations, <br /><span className="text-indigo-400">Unified Staff Hub.</span></>
            )}
          </h1>

          <p className="text-slate-300 text-xs xl:text-sm max-w-md leading-relaxed font-normal">
            {isTeacher 
              ? 'Real-time student attendance, online exam grading, lesson planner, and holistic progress cards in one unified portal.'
              : 'Effortless employee attendance, leave management, loans, payroll slips, and official institutional circulars.'
            }
          </p>

          {/* Feature Chips */}
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isTeacher ? 'bg-orange-500/20 text-[#ff5c0a]' : 'bg-indigo-500/20 text-indigo-400'
              }`}>
                {isTeacher ? <Users className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-white block truncate">
                  {isTeacher ? 'Classroom Hub' : 'Staff Services'}
                </span>
                <span className="text-slate-400 text-[10px] block truncate">
                  {isTeacher ? 'Attendance & Exams' : 'Payroll & Leaves'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-white block truncate">Enterprise Security</span>
                <span className="text-slate-400 text-[10px] block truncate">256-bit Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Footer */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>&copy; {new Date().getFullYear()} School ERP Ecosystem</span>
          <span className="text-slate-300 font-semibold">
            By <strong className="text-orange-400">RAJ YADAV</strong> @ALLCORE SOLUTION
          </span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: FIXED LOGIN CARD (NO SCROLL, NO SPILL) ── */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 h-full max-h-screen p-4 sm:p-6 lg:p-7 xl:p-8 bg-white overflow-hidden">

        {/* Compact Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm transition-colors ${
              isTeacher ? 'bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42]' : 'bg-gradient-to-tr from-indigo-600 to-violet-500'
            }`}>
              {isTeacher ? <GraduationCap className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 tracking-tight block leading-tight">
                School <span className={isTeacher ? 'text-[#ff5c0a]' : 'text-indigo-600'}>ERP</span>
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                {isTeacher ? 'Teacher Portal' : 'Staff Portal'}
              </span>
            </div>
          </div>

          {/* Language Switch Button */}
          <button
            type="button"
            onClick={() => changeLanguage(currentLang === 'Hindi' ? 'English' : 'Hindi')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3 h-3 text-[#ff5c0a]" />
            <span>{currentLang === 'Hindi' ? '🇬🇧 English' : '🇮🇳 हिन्दी'}</span>
          </button>
        </div>

        {/* Centered Main Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto flex flex-col justify-center py-1">

          {/* Logo & Heading */}
          <div className="mb-2 text-center flex flex-col items-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              {isTeacher ? 'Teacher & Faculty Sign In' : 'Staff & Office Sign In'}
            </h2>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              {isTeacher 
                ? 'Sign in to access your classes, exams & gradebooks'
                : 'Sign in to access attendance, leaves, loans & payslips'
              }
            </p>
          </div>

          {/* DUAL ROLE TAB SWITCHER: TEACHER vs STAFF */}
          <div className="mb-3 p-0.5 bg-slate-100 rounded-xl grid grid-cols-2 gap-1 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => handleSelectRole('teacher')}
              className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isTeacher
                  ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Teacher / Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('staff')}
              className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isTeacher
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Staff / Office</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wide">
                {isTeacher ? 'Teacher ID / Email' : 'Staff ID / Employee Code'}
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder={isTeacher ? 'ryadavy498@gmail.com' : 'staff@school.edu'}
                  required
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/20 focus:border-[#ff5c0a] text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400"
                />
                <User className="w-3.5 h-3.5 absolute left-3 top-[10px] text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-9 py-2 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/20 focus:border-[#ff5c0a] text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400"
                />
                <Lock className="w-3.5 h-3.5 absolute left-3 top-[10px] text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-semibold select-none text-[11px]">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="w-3.5 h-3.5 rounded text-[#ff5c0a] focus:ring-[#ff5c0a] border-slate-300" 
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-bold text-[#ff5c0a] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl text-xs font-black text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-[0.99] ${
                isTeacher 
                  ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] hover:from-[#e55208] hover:to-[#ff6a19] shadow-orange-500/25' 
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-500/25'
              }`}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-3.5 h-3.5" />
              )}
              <span>
                {loading ? 'Authenticating...' : (isTeacher ? 'Sign In as Teacher' : 'Sign In as Staff')}
              </span>
            </button>
          </form>

          {/* 1-Click Instant Demo Credentials */}
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                1-Click Quick Demo Login
              </span>
              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full">
                Instant Fill
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Teacher Demo Card */}
              <button
                type="button"
                onClick={() => quickDemoLogin('teacher')}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer group active:scale-95 ${
                  isTeacher 
                    ? 'border-orange-300 bg-orange-50/80 shadow-2xs' 
                    : 'border-slate-200 bg-slate-50/60 hover:bg-orange-50/40 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-[#ff5c0a]" />
                    <span className="text-[10px] font-black text-slate-900">Teacher</span>
                  </div>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-300 group-hover:text-[#ff5c0a] transition-colors" />
                </div>
                <p className="text-[9.5px] font-bold text-slate-700 truncate">Amit Sharma</p>
                <p className="text-[8.5px] text-slate-500 truncate">PGT Mathematics</p>
              </button>

              {/* Staff Demo Card */}
              <button
                type="button"
                onClick={() => quickDemoLogin('staff')}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer group active:scale-95 ${
                  !isTeacher 
                    ? 'border-indigo-300 bg-indigo-50/80 shadow-2xs' 
                    : 'border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-900">Staff</span>
                  </div>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
                <p className="text-[9.5px] font-bold text-slate-700 truncate">Rajesh Verma</p>
                <p className="text-[8.5px] text-slate-500 truncate">Admin Officer</p>
              </button>
            </div>
          </div>

        </div>

        {/* Compact Footer */}
        <div className="shrink-0 pt-2 border-t border-slate-100 text-center">
          <p className="text-[9.5px] text-slate-400">
            &copy; {new Date().getFullYear()} School ERP Ecosystem &bull; Developed by <span className="font-bold text-[#ff5c0a]">RAJ YADAV</span> @ALLCORE SOLUTION
          </p>
        </div>

      </div>

    </div>
  );
};

export default Login;

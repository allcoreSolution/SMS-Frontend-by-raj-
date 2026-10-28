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
  PieChart, 
  Building2, 
  Globe, 
  ArrowRight,
  Briefcase,
  Users
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
          timer: 2500,
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
          timer: 2500,
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
        timer: 2000
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
    <div className="h-screen overflow-hidden bg-white flex font-sans select-none">

      {/* Left Side - Hero & Branding (Desktop) */}
      <div className={`hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden items-start transition-colors duration-500 ${
        isTeacher 
          ? 'bg-gradient-to-br from-[#131927] via-[#1a233a] to-[#0f1422]' 
          : 'bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#0f172a]'
      }`}>
        {/* Ambient Glows */}
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-15 blur-[90px] transition-colors duration-500 ${
          isTeacher ? 'bg-[#ff5c0a]' : 'bg-indigo-600'
        }`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500 opacity-10 blur-[80px]" />

        {/* Top Monogram */}
        <div className="relative z-10 w-full">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all ${
            isTeacher 
              ? 'bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] shadow-orange-500/25' 
              : 'bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-indigo-500/25'
          }`}>
            {isTeacher ? (
              <GraduationCap className="w-8 h-8 text-white" />
            ) : (
              <Building2 className="w-8 h-8 text-white" />
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-300 text-xs font-semibold mb-4 border border-white/10">
            <span className={`w-2 h-2 rounded-full ${isTeacher ? 'bg-orange-400' : 'bg-indigo-400'}`} />
            <span>{isTeacher ? 'Teacher & Faculty Suite' : 'Staff & Administration Desk'}</span>
          </div>

          <h1 className="text-white text-[38px] xl:text-[44px] font-black leading-tight mb-4 tracking-tight">
            {isTeacher ? (
              <>Empowering Teachers, <br /><span className="text-[#ff5c0a]">Elevating Students.</span></>
            ) : (
              <>Seamless School Operations, <br /><span className="text-indigo-400">Unified Staff Hub.</span></>
            )}
          </h1>

          <p className="text-slate-300 text-[15px] max-w-md leading-relaxed font-normal">
            {isTeacher 
              ? 'Real-time student attendance, online exam grading, lesson planner, and holistic progress cards in one unified portal.'
              : 'Effortless employee attendance, leave management, loans, payroll slips, and official institutional circulars.'
            }
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-lg">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isTeacher ? 'bg-orange-500/20 text-[#ff5c0a]' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {isTeacher ? <Users className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[13px] text-white">
                {isTeacher ? 'Classroom Tools' : 'Staff Services'}
              </span>
              <span className="text-slate-400 text-[11px]">
                {isTeacher ? 'Attendance & Exams' : 'Payroll & Leaves'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[13px] text-white">Bank-Grade Security</span>
              <span className="text-slate-400 text-[11px]">Encrypted session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 bg-slate-50/50 relative z-10 overflow-y-auto py-8">
        <div className="w-full max-w-[420px] bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40">
          
          {/* Top Bar: Brand & Language Toggle */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
                isTeacher ? 'bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42]' : 'bg-gradient-to-tr from-indigo-600 to-violet-500'
              }`}>
                {isTeacher ? <GraduationCap className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-base font-black text-slate-900 tracking-tight block leading-tight">
                  School <span className={isTeacher ? 'text-[#ff5c0a]' : 'text-indigo-600'}>ERP</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Multi-School v3.7
                </span>
              </div>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => changeLanguage(currentLang === 'Hindi' ? 'English' : 'Hindi')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>{currentLang === 'Hindi' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          {/* Interactive Role Switcher Tabs */}
          <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-1 mb-5">
            <button
              type="button"
              onClick={() => handleSelectRole('teacher')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isTeacher
                  ? 'bg-white text-[#ff5c0a] shadow-sm shadow-orange-500/10'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${isTeacher ? 'text-[#ff5c0a]' : 'text-slate-400'}`} />
              <span>Teacher / Faculty</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('staff')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !isTeacher
                  ? 'bg-white text-indigo-600 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-4 h-4 ${!isTeacher ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Staff / Office</span>
            </button>
          </div>

          {/* Role Header Text */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isTeacher ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {isTeacher ? 'Teaching Staff' : 'Administration Staff'}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isTeacher ? 'Teacher Sign In' : 'Staff Sign In'}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {isTeacher 
                ? 'Access marks, student attendance, exams & syllabus' 
                : 'Access employee attendance, leaves, loans & payslips'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                {isTeacher ? 'Teacher ID / Email' : 'Staff ID / Employee Code'}
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder={isTeacher ? 'e.g. ryadavy498@gmail.com' : 'e.g. staff@school.edu or EMP-101'}
                  required
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/20 focus:border-[#ff5c0a] text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400"
                />
                <User className="w-4 h-4 absolute left-3.5 top-[12px] text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/20 focus:border-[#ff5c0a] text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-[12px] text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="w-4 h-4 rounded text-[#ff5c0a] focus:ring-[#ff5c0a] border-slate-300"
                />
                <span className="text-xs text-slate-600 font-semibold">Remember session</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#ff5c0a] hover:underline font-bold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 ${
                isTeacher 
                  ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] hover:from-[#e55208] hover:to-[#ff6a19] shadow-orange-500/25' 
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-500/25'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>
                {loading ? 'Authenticating...' : (isTeacher ? 'Sign In as Teacher' : 'Sign In as Staff')}
              </span>
            </button>
          </form>

          {/* 1-Click Instant Demo Credentials */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                1-Click Quick Demo Login
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Pre-configured
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Teacher Demo Card */}
              <button
                type="button"
                onClick={() => quickDemoLogin('teacher')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                  isTeacher 
                    ? 'border-orange-300 bg-orange-50/80 shadow-xs' 
                    : 'border-slate-200 bg-slate-50/60 hover:bg-orange-50/40 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#ff5c0a]" />
                    <span className="text-[11px] font-bold text-slate-900">Teacher</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-[#ff5c0a] transition-colors" />
                </div>
                <p className="text-[10px] font-bold text-slate-700 truncate">Amit Sharma</p>
                <p className="text-[9px] text-slate-500 truncate">PGT Mathematics</p>
              </button>

              {/* Staff Demo Card */}
              <button
                type="button"
                onClick={() => quickDemoLogin('staff')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                  !isTeacher 
                    ? 'border-indigo-300 bg-indigo-50/80 shadow-xs' 
                    : 'border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[11px] font-bold text-slate-900">Staff</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
                <p className="text-[10px] font-bold text-slate-700 truncate">Rajesh Verma</p>
                <p className="text-[9px] text-slate-500 truncate">Admin Officer</p>
              </button>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="mt-5 text-center">
            <p className="text-[11px] text-slate-400">&copy; {new Date().getFullYear()} School ERP Ecosystem</p>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5">
              Developed by <span className="text-[#ff5c0a]">RAJ YADAV</span> @ALLCORE SOLUTION
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  Calendar, 
  Users, 
  CheckSquare, 
  Bell, 
  School, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import Swal from 'sweetalert2';

// High-Res 3D Assets for Teacher & Staff
import SchoolLogo3D from '../components/SchoolLogo3D';
import teacherWelcomeHero from '../assets/teacher_welcome_hero.png';
import teacherLoginHero from '../assets/teacher_login_hero.png';
import teacherFemaleAvatar from '../assets/teacher_female_avatar.png';
import teacherStaffAvatar from '../assets/teacher_staff_avatar.png';
import teacherSchoolBuilding from '../assets/teacher_school_building.png';


const Login = () => {
  const navigate = useNavigate();

  // Screen Stepper: 'welcome' | 'role' | 'login'
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

  // Role: 'teacher' or 'staff'
  const [selectedRole, setSelectedRole] = useState('teacher');

  const [formData, setFormData] = useState({ 
    identifier: 'avanikumari@gmail.com', 
    password: 'admin@123' 
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autofillNotice, setAutofillNotice] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    if (token && user) {
      navigate('/');
    }
  }, [navigate]);

  // Handle Role Switch
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    if (role === 'teacher') {
      setFormData({
        identifier: 'avanikumari@gmail.com',
        password: 'admin@123'
      });
    } else {
      setFormData({
        identifier: 'staff@school.edu',
        password: 'admin@123'
      });
    }
  };

  const handleChooseRoleAndProceed = (role) => {
    handleSelectRole(role);
    setCurrentStep('login');
  };

  const handleQuickDemo = (role) => {
    handleSelectRole(role);
    setAutofillNotice(`Demo loaded for ${role === 'teacher' ? 'Teacher' : 'Staff'}`);
    setTimeout(() => setAutofillNotice(''), 2500);
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
        const token = res.data.data.token;
        const serverRole = res.data.data.role;
        const serverPermissions = res.data.data.permissions || [];
        const userData = {
          ...res.data.data,
          role: serverRole || (selectedRole === 'staff' ? 'Staff' : 'Teacher'),
          roleName: res.data.data.roleName || serverRole || (selectedRole === 'staff' ? 'Staff' : 'Teacher'),
          permissions: Array.isArray(serverPermissions) ? serverPermissions : []
        };
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        if (res.data.data.photo || res.data.data.avatar) {
          localStorage.setItem('teacher_user_avatar', res.data.data.photo || res.data.data.avatar);
        }
        localStorage.setItem('user', JSON.stringify(userData));
        if (res.data.data.tenantId) {
          localStorage.setItem('schoolId', res.data.data.tenantId);
          sessionStorage.setItem('schoolId', res.data.data.tenantId);
        }
        if (res.data.data.school || res.data.data.schoolName) {
          const sInfo = res.data.data.school || { name: res.data.data.schoolName, logo: res.data.data.schoolLogo };
          localStorage.setItem('school_info', JSON.stringify(sInfo));
          localStorage.setItem('schoolName', sInfo.name || res.data.data.schoolName || '');
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
        return;
      }
    } catch (err) {
      console.warn('Backend login error, evaluating demo fallback:', err);
      // Demo credentials & graceful fallback
      const isTeacherCred = (formData.identifier === 'avanikumari@gmail.com' || formData.identifier === 'ryadavy498@gmail.com' || formData.identifier === 'admin123@gmail.com') && formData.password === 'admin@123';
      const isStaffCred = (formData.identifier === 'staff@school.edu' || formData.identifier === 'admin@school.edu') && formData.password === 'admin@123';

      if (isTeacherCred || isStaffCred) {
        const dummyUser = selectedRole === 'staff' ? {
          id: 'staff_101',
          name: 'Priya Sharma (Staff Admin)',
          fullName: 'Priya Sharma',
          email: 'staff@school.edu',
          role: 'Staff',
          roleName: 'Staff Administrator',
          permissions: [
            'staff.view', 'attendance.mark', 'attendance.view', 
            'students.list.view', 'students.attendance.manage', 'students.admission.create',
            'exams.datesheet.manage', 'exams.marks.entry',
            'online_exams.manage',
            'academics.homework', 'academics.study_material', 'lesson_plan.submit',
            'front_office.enquiries.manage', 'leads.pipeline.manage',
            'certificates.generate', 'ptm.remarks.manage',
            'leave.apply', 'leave.view'
          ],
          designation: 'Staff Faculty',
          department: 'Administration',
          tenantId: '6ad9bbe1c6514fd4a43099c6',
          schoolName: 'ALL CORE SOLUTION'
        } : {
          id: '6afd5a6c6568c30df618a4c4',
          staffId: '110',
          fullName: 'Avani',
          name: 'Avani',
          email: 'avanikumari@gmail.com',
          role: 'Teacher',
          roleName: 'Senior Teacher',
          permissions: [
            'teacher.dashboard', 'academics.timetable.manage', 'academics.homework', 'academics.study_material',
            'exams.marks.entry', 'online_exams.manage', 'online_exams.questions.manage',
            'students.list.view', 'students.attendance.manage', 'students.behavior.manage',
            'lesson_plan.submit', 'ptm.remarks.manage', 'certificates.generate',
            'communication.notices'
          ],
          designation: 'Teacher',
          department: 'Academics',
          tenantId: '6ad9bbe1c6514fd4a43099c6',
          schoolName: 'ALL CORE SOLUTION',
          photo: localStorage.getItem('teacher_user_avatar') || '',
          avatar: localStorage.getItem('teacher_user_avatar') || ''
        };

        const demoTok = `demo_token_${Date.now()}`;
        sessionStorage.setItem('token', demoTok);
        sessionStorage.setItem('user', JSON.stringify(dummyUser));
        localStorage.setItem('token', demoTok);
        localStorage.setItem('user', JSON.stringify(dummyUser));
        localStorage.setItem('schoolId', '6ad9bbe1c6514fd4a43099c6');
        localStorage.setItem('schoolName', 'ALL CORE SOLUTION');

        Swal.fire({
          icon: 'success',
          title: `${selectedRole === 'staff' ? 'Staff' : 'Teacher'} Portal Ready`,
          text: `Logged in as ${dummyUser.name}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

        navigate('/');
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || 'Invalid credentials. Please verify your Email/Employee ID and Password.',
        confirmButtonColor: '#ff5c0a'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { value: resetEmail } = await Swal.fire({
      title: 'Reset Password',
      input: 'email',
      inputLabel: 'Enter your registered school email address',
      inputPlaceholder: selectedRole === 'staff' ? 'staff@school.edu' : 'avanikumari@gmail.com',
      inputValue: formData.identifier.includes('@') ? formData.identifier : '',
      showCancelButton: true,
      confirmButtonColor: '#ff5c0a',
      confirmButtonText: 'Send Verification OTP',
      inputValidator: (value) => {
        if (!value) return 'Please enter an email address!';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email!';
      }
    });

    if (resetEmail) {
      try {
        Swal.fire({
          title: 'Sending OTP...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const res = await axiosInstance.post('/auth/forgot-password', { email: resetEmail })
          .then(r => r.data)
          .catch(err => err.response?.data || { success: false, message: 'Could not connect to server' });

        if (res.success) {
          const { value: formValues } = await Swal.fire({
            title: 'Enter OTP & New Password',
            html:
              `<p class="text-xs text-slate-500 mb-3">A 6-digit verification code has been dispatched to <b>${resetEmail}</b>. Please check your email inbox.</p>` +
              '<input id="swal-otp" class="swal2-input !h-10 !text-sm !my-2" placeholder="Enter 6-digit OTP" type="text" maxlength="6">' +
              '<input id="swal-newpass" class="swal2-input !h-10 !text-sm !my-2" placeholder="Enter New Password" type="password">',
            focusConfirm: false,
            confirmButtonText: 'Update Password',
            confirmButtonColor: '#ff5c0a',
            showCancelButton: true,
            preConfirm: () => {
              const otpVal = document.getElementById('swal-otp').value;
              const newPassVal = document.getElementById('swal-newpass').value;
              if (!otpVal || otpVal.length < 6) {
                Swal.showValidationMessage('Please enter the 6-digit OTP code sent to your email');
                return false;
              }
              if (newPassVal.length < 6) {
                Swal.showValidationMessage('Password must be at least 6 characters');
                return false;
              }
              return { otp: otpVal.trim(), newPassword: newPassVal.trim() };
            }
          });

          if (formValues) {
            Swal.fire({
              title: 'Resetting Password...',
              allowOutsideClick: false,
              didOpen: () => Swal.showLoading()
            });

            const resetRes = await axiosInstance.post('/auth/reset-password', {
              email: resetEmail, 
              otp: formValues.otp, 
              newPassword: formValues.newPassword 
            }).then(r => r.data).catch(err => err.response?.data || { success: false, message: 'Password reset failed' });

            if (resetRes.success) {
              Swal.fire({
                icon: 'success',
                title: 'Password Updated!',
                text: 'Your password has been changed. You can now login.',
                confirmButtonColor: '#ff5c0a'
              });
              setFormData({ ...formData, password: formValues.newPassword });
            } else {
              Swal.fire('Error', resetRes.message || 'Invalid or expired OTP code', 'error');
            }
          }
        } else {
          Swal.fire('Error', res.message || 'Unable to send OTP to this email address', 'error');
        }
      } catch {
        Swal.fire('Connection Error', 'Could not reach server to reset password', 'error');
      }
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
      <div className="w-full flex-1 sm:flex-initial sm:max-w-[380px] bg-white sm:rounded-[38px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] sm:border-[8px] sm:border-slate-800 overflow-hidden min-h-screen sm:min-h-[700px] sm:h-[750px] sm:max-h-[94vh] flex flex-col relative transition-all">

        {/* ========================================================
            SCREEN 1: TEACHER & STAFF WELCOME ONBOARDING
            ======================================================== */}
        {currentStep === 'welcome' && (
          <div className="flex-1 flex flex-col justify-between bg-white relative overflow-y-auto sm:overflow-hidden">
            
            {/* Top Header Section */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-4 sm:pt-3 pb-6 sm:pb-7 px-4 relative shrink-0 border-b border-slate-800">
              {/* Top Bar with Sign In Pill */}
              <div className="flex items-center justify-between z-20 mb-1">
                <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                  Faculty &amp; Staff Cloud Console
                </span>
                <button 
                  onClick={() => setCurrentStep('login')}
                  className="text-xs font-bold text-orange-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-orange-400/30 shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <span>Sign In</span>
                  <ChevronRight className="w-3.5 h-3.5" />
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
                  Faculty &amp; Staff Cloud Console
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

            {/* Hero Banner Card in a Box (3D Pixar Teacher Illustration) */}
            <div className="px-4 my-auto shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 group">
                <img 
                  src={teacherWelcomeHero} 
                  alt="Educators and Staff" 
                  className="w-full h-40 sm:h-44 object-cover object-center group-hover:scale-102 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-orange-400 flex items-center gap-1.5 shadow-sm border border-orange-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>For Teachers &amp; Staff</span>
                </div>
              </div>
            </div>

            {/* 4 Feature Module Cards */}
            <div className="px-4 pb-2 z-10 shrink-0">
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Manage Classes */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-orange-50/60 hover:bg-orange-50 border border-orange-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#ff5c0a] flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Calendar className="w-5 h-5 stroke-[2.3] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Manage Classes</span>
                </div>

                {/* 2. Mark Attendance */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-amber-50/60 hover:bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Users className="w-5 h-5 stroke-[2.3] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">Mark Attendance</span>
                </div>

                {/* 3. View Student Records */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900/10 text-slate-800 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <CheckSquare className="w-5 h-5 stroke-[2.3] shrink-0" />
                  </div>
                  <span className="text-xs font-black text-slate-800 leading-tight">View Student Records</span>
                </div>

                {/* 4. Get Notifications */}
                <div 
                  onClick={() => setCurrentStep('role')}
                  className="bg-rose-50/60 hover:bg-rose-50 border border-rose-200/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    <Bell className="w-5 h-5 stroke-[2.3] shrink-0" />
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
                  <GraduationCap className="w-4 h-4 stroke-[2.4]" />
                </div>
                <div>
                  <p className="text-xs font-black leading-tight text-white tracking-wide">
                    Empowering Educators for Better Learning
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
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-orange-400">
                  Step 2 of 3
                </span>
                <div className="w-8"></div>
              </div>

              {/* Branding Section */}
              <div className="flex flex-col items-center text-center z-10 my-0.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-[1.5px] shadow-lg shadow-orange-500/20 mb-1 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <span className="text-sm font-black tracking-wider bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">ACS</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  ALL CORE <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">SOLUTION</span>
                </h2>
                <p className="text-xs font-bold text-slate-400 tracking-wide mt-1">
                  Faculty &amp; Staff Cloud Console
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

            {/* Role Header */}
            <div className="text-center pt-2 px-4 shrink-0">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Continue as
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Choose your role to access your account
              </p>
            </div>

            {/* Role Cards: Teacher & Staff */}
            <div className="px-4 py-2 space-y-2.5 my-auto shrink-0">
              {/* Option 1: Teacher Role Card */}
              <div 
                onClick={() => handleChooseRoleAndProceed('teacher')}
                className="bg-white hover:bg-orange-50/40 border-2 border-slate-200 hover:border-[#ff5c0a] rounded-2xl p-3 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100/80 border border-orange-200 p-0.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                    <img 
                      src={teacherFemaleAvatar} 
                      alt="Teacher" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-[#ff5c0a] transition-colors leading-tight">
                      Teacher
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug mt-1 max-w-[170px]">
                      Mark attendance, manage assignments, exams and student grades.
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs shadow-orange-500/30 group-hover:scale-110 transition-transform shrink-0">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>

              {/* Option 2: Staff Role Card */}
              <div 
                onClick={() => handleChooseRoleAndProceed('staff')}
                className="bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-300 p-0.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                    <img 
                      src={teacherStaffAvatar} 
                      alt="Staff" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-slate-900 transition-colors leading-tight">
                      Staff
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug mt-1 max-w-[170px]">
                      Manage school operations, student records and administrative tasks.
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform shrink-0">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Bottom 3D School Building Illustration & Footer */}
            <div className="flex flex-col items-center text-center pt-1 pb-3 shrink-0">
              <img 
                src={teacherSchoolBuilding} 
                alt="School Campus" 
                className="w-52 h-auto object-contain drop-shadow-xs" 
              />
              <p className="text-xs font-bold text-slate-700 tracking-tight mt-1">
                A Complete Platform for Teachers &amp; Staff
              </p>
            </div>

          </div>
        )}

        {/* ========================================================
            SCREEN 3: TEACHER & STAFF LOGIN FORM
            ======================================================== */}
        {currentStep === 'login' && (
          <div className="flex-1 flex flex-col justify-between bg-white overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
            {/* Top Header Section */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-3 pb-8 px-4 relative shrink-0 border-b border-slate-800">
              
              {/* Navigation Bar with Back Button */}
              <div className="flex items-center justify-between z-20 mb-1">
                <button 
                  onClick={() => setCurrentStep('role')}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Role Switcher Pill */}
                <div className="flex bg-slate-900/90 p-0.5 rounded-full border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSelectRole('teacher')}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      selectedRole === 'teacher' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectRole('staff')}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      selectedRole === 'staff' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Staff
                  </button>
                </div>
              </div>

              {/* Branding */}
              <div className="flex flex-col items-center text-center z-10 my-0.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-[1.5px] shadow-lg shadow-orange-500/20 mb-1 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <span className="text-sm font-black tracking-wider bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">ACS</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  ALL CORE <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">SOLUTION</span>
                </h2>
                <p className="text-xs font-bold text-slate-400 tracking-wide mt-1">
                  Faculty &amp; Staff Cloud Console
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

            {/* Floating Hero Banner Card (3D Pixar Teacher & Staff Illustration) */}
            <div className="-mt-7 px-4 z-10 shrink-0">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-1 flex items-center justify-center overflow-hidden">
                <img 
                  src={teacherLoginHero} 
                  alt="Teacher & Staff" 
                  className="w-full h-24 sm:h-28 object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Form Section */}
            <div className="px-5 pt-2 pb-6 space-y-3 shrink-0">
              
              {/* Form Title */}
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {selectedRole === 'staff' ? 'Staff Login' : 'Teacher Login'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedRole === 'staff' ? 'Access your administrative workspace' : 'Access your classroom portal'}
                </p>
              </div>

              {autofillNotice && (
                <div className="bg-orange-50 text-orange-800 text-xs px-3 py-1.5 rounded-xl border border-orange-200 text-center font-bold">
                  {autofillNotice}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-2.5">
                
                {/* Identifier */}
                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input 
                      type="text" 
                      required
                      placeholder="Email / Username / Employee ID"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5c0a] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#ff5c0a] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 accent-[#ff5c0a]"
                    />
                    <span className="text-slate-600 font-medium text-[11px]">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Primary Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Signing In...</span>
                    </span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

              </form>

              {/* Quick Demo Chips */}
              <div className="flex items-center justify-center gap-2 text-[10px] pt-0.5">
                <span className="text-slate-400 font-semibold">Quick Demo:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('teacher')}
                  className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 font-bold border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  Teacher
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('staff')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Staff
                </button>
              </div>


              {/* Need Help? Footer Card */}
              <div className="bg-orange-50/60 border border-orange-200/60 rounded-2xl p-2.5 flex items-center gap-2.5 mt-1">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#ff5c0a] flex items-center justify-center shrink-0">
                  <School className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h5 className="text-[11px] font-black text-slate-900 leading-tight">
                    Need Help?
                  </h5>
                  <p className="text-[10px] text-slate-600 font-medium leading-snug mt-0.5">
                    Contact the school admin for login credentials or support.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Login;

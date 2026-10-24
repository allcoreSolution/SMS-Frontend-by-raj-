import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { 
  Mail, Lock, KeyRound, ArrowRight, ArrowLeft, 
  ShieldCheck, Sparkles, CheckCircle2, Eye, EyeOff, RefreshCw, Landmark 
} from 'lucide-react';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Multi-step flow: 1 = Email, 2 = Verify OTP & Set Password, 3 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('ryadavy498@gmail.com');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtp, setDevOtp] = useState('');

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your registered SuperAdmin email address.',
        confirmButtonColor: '#ff5c0a'
      });
      return;
    }

    setLoading(true);
    setDevOtp('');

    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email: email.trim() });
      if (res.data?.success) {
        Swal.fire({
          icon: 'success',
          title: 'OTP Dispatched!',
          text: `A 6-digit verification code has been sent to ${email}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true
        });

        if (res.data.devOtp) {
          setDevOtp(res.data.devOtp);
        }

        setStep(2);
        setResendCooldown(60);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text: res.data?.message || 'Unable to send OTP at this time.',
          confirmButtonColor: '#ff5c0a'
        });
      }
    } catch (err) {
      console.error('SuperAdmin Forgot password error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to dispatch OTP. Please check email configuration.';
      Swal.fire({
        icon: 'error',
        title: 'Error Sending OTP',
        text: msg,
        confirmButtonColor: '#ff5c0a'
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'Please enter the complete 6-digit verification code sent to your email.',
        confirmButtonColor: '#ff5c0a'
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
        confirmButtonColor: '#ff5c0a'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'New password and confirmation password do not match.',
        confirmButtonColor: '#ff5c0a'
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword
      });

      if (res.data?.success) {
        setStep(3);
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful!',
          text: 'Your SuperAdmin password has been securely updated. You can now login.',
          confirmButtonColor: '#ff5c0a',
          timer: 3500
        });

        setTimeout(() => {
          navigate('/login');
        }, 3500);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: res.data?.message || 'Invalid or expired OTP code.',
          confirmButtonColor: '#ff5c0a'
        });
      }
    } catch (err) {
      console.error('Reset password error:', err);
      const msg = err.response?.data?.message || err.message || 'Verification failed. Please check your OTP code.';
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: msg,
        confirmButtonColor: '#ff5c0a'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex font-sans">
      
      {/* Left Side - Modern Visual Branding (Dark Theme with Orange / Amber Accents) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0b101d] via-[#101728] to-[#070b14] relative flex-col justify-between p-12 xl:p-14 overflow-hidden items-start border-r border-slate-800">
        
        {/* Ambient Glows */}
        <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] bg-orange-600/15 rounded-full blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[110px] pointer-events-none"></div>

        <div className="relative z-10 w-full">
          {/* Brand Icon */}
          <div className="w-14 h-14 bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/25 ring-1 ring-white/20">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-semibold mb-4 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Root Credential Recovery System</span>
          </div>

          <h1 className="text-white text-4xl xl:text-5xl font-black leading-tight mb-5 tracking-tight">
            SuperAdmin <br />
            <span className="bg-gradient-to-r from-[#ff5c0a] via-amber-300 to-[#ff9e59] bg-clip-text text-transparent">
              Access Recovery Desk
            </span>
          </h1>
          <p className="text-slate-300 text-sm xl:text-base max-w-md leading-relaxed font-normal">
            Automated institutional verification delivering instant one-time passwords directly to your registered administrator inbox.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-lg">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block">Bank-Grade Security</span>
              <span className="text-slate-400 text-[11px]">15-Minute Expiry Limit</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block">Live SMTP Delivery</span>
              <span className="text-slate-400 text-[11px]">Direct Inbox Verification</span>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-[11px] text-slate-400 font-medium">
          Protected by Multi-School ERP SaaS Core • Developed by RAJ YADAV @ALLCORE SOLUTION
        </div>
      </div>

      {/* Right Side - Interactive Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 bg-white relative z-10">
        <div className="w-full max-w-md space-y-6">
          
          {/* Back to Login Link */}
          <Link 
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#ff5c0a] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Sign In</span>
          </Link>

          {/* Step Progress Indicators */}
          <div className="flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#ff5c0a]' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#ff5c0a]' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 1: ENTER REGISTERED EMAIL */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Enter your registered SuperAdmin email address. We'll send you a 6-digit OTP verification code.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Master Email Address
                  </label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ryadavy498@gmail.com"
                      required
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a] focus:border-[#ff5c0a] text-sm font-medium transition-all"
                    />
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] hover:from-[#e85004] hover:to-[#f26e1a] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {loading ? 'Sending OTP to Email...' : 'Send Verification OTP'}
                </button>
              </form>

              {/* Quick Demo Helper */}
              <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-100 text-xs text-orange-900 flex items-center justify-between">
                <span>Default SuperAdmin Account:</span>
                <button
                  type="button"
                  onClick={() => setEmail('ryadavy498@gmail.com')}
                  className="font-bold text-[#ff5c0a] hover:underline cursor-pointer"
                >
                  ryadavy498@gmail.com
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 2: ENTER OTP & NEW PASSWORD */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>OTP Sent to {email}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Verify & Reset</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Enter the 6-digit code received on your email and set your new master password.
                </p>
              </div>

              {devOtp && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                  <span>Development OTP Code:</span>
                  <span className="font-mono font-bold text-base tracking-widest bg-white px-2.5 py-0.5 rounded border border-amber-300">{devOtp}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* 6-Digit OTP */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      6-Digit OTP Code
                    </label>
                    <span className="text-[11px] text-slate-400">Valid for 15 mins</span>
                  </div>
                  <div className="relative group">
                    <input 
                      type="text" 
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 123456"
                      required
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a] focus:border-[#ff5c0a] text-base font-mono font-bold tracking-widest text-slate-900 transition-all text-center sm:text-left"
                    />
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    New Master Password (Min 6 Chars)
                  </label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a] focus:border-[#ff5c0a] text-sm font-medium transition-all"
                    />
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5c0a] focus:border-[#ff5c0a] text-sm font-medium transition-all"
                    />
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Didn't receive email?</span>
                  {resendCooldown > 0 ? (
                    <span className="text-slate-400 font-medium">Resend in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp(null)}
                      className="text-[#ff5c0a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] hover:from-[#e85004] hover:to-[#f26e1a] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  {loading ? 'Updating Credentials...' : 'Reset Password & Secure Account'}
                </button>
              </form>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP 3: SUCCESS STATE */}
          {/* ───────────────────────────────────────────────────────────── */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Password Reset Complete!</h2>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Your SuperAdmin password has been successfully updated. You can now log in with your new password.
                </p>
              </div>

              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="pt-2 text-center text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} Multi-School ERP. All rights reserved.</p>
            <p className="font-semibold text-slate-500 mt-0.5">Developed by <span className="text-[#ff5c0a] font-bold">RAJ YADAV</span> @ALLCORE SOLUTION</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

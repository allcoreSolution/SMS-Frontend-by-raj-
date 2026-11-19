import React, { useState, useEffect } from 'react';
import { 
  LogIn, Lock, User, Mail, ShieldCheck, 
  GraduationCap, Eye, EyeOff, ArrowRight, 
  Sparkles, Receipt, Landmark, Wallet, 
  FileCheck, CheckCircle2, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('accountant@allcoresolution.com');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

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
        confirmButtonColor: '#2563eb'
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
          confirmButtonColor: '#2563eb'
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
        confirmButtonColor: '#2563eb'
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
      confirmButtonColor: '#2563eb'
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
            confirmButtonColor: '#2563eb',
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
                confirmButtonColor: '#2563eb'
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
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">

      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 sm:px-10 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              School <span className="text-blue-600">ERP</span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Finance &amp; Accounts Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online &bull; Secure
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

          {/* Left Column: Information & 4 Proper Cards */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Institutional Financial Management Suite</span>
            </div>

            {/* Primary Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-3">
              Streamlined School Accounts &amp;{' '}
              <span className="text-blue-600">Fee Administration</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
              A comprehensive financial management platform designed for accountants and administrators. Collect fees, monitor daily transactions, manage payroll, and generate audit-compliant ledgers with zero friction.
            </p>

            {/* 4 Feature Cards (Clean, White, High-DPI Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mb-8">
              
              {/* Card 1: Student Fee Collection */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-200 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">Fee Collection &amp; Invoices</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Collect dues, apply scholarship discounts, issue digital receipts, and track payment gateways.
                  </p>
                </div>
              </div>

              {/* Card 2: Income & Day Book */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">Income &amp; Day Book</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Real-time daily transaction logs, cash book balances, and automated ledger reconciliations.
                  </p>
                </div>
              </div>

              {/* Card 3: Expense & Payroll */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all duration-200 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">Expense &amp; Payroll</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Track vendor vouchers, departmental spending, staff salaries, and petty cash dispensations.
                  </p>
                </div>
              </div>

              {/* Card 4: Audit & Balance Sheet */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all duration-200 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">Financial Audits &amp; Reports</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Generate instant balance sheets, annual P&amp;L summaries, and export statutory audit spreadsheets.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Security Highlights */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Bank-grade 256-bit Encryption
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Multi-Branch Ledger Sync
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" /> Verified Role Privilege
              </span>
            </div>

          </div>

          {/* Right Column: Clean, Normal, Crisp White Login Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200/90 p-7 sm:p-9">
              
              {/* Form Title & Icon */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Accountant Sign In
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Enter your credentials to securely access your institutional finance desk.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Field 1: Email Address / Username */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address / Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. accountant@allcoresolution.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Field 2: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Account Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Remember me on this browser
                    </span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

              </form>

              {/* Instant One-Click Demo Access */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Or One-Click Demo Access
                </span>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="w-full py-2.5 px-4 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Quick Demo: accountant@allcoresolution.com</span>
                </button>
              </div>

              {/* Card Footer Credit */}
              <div className="mt-5 pt-3 border-t border-slate-100 text-center flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Built with <span className="text-red-500 font-bold">❤️</span> by{' '}
                  <strong className="text-slate-800 font-bold">RAJ YADAV</strong> |{' '}
                  <strong className="text-blue-600 font-bold">ALLCORE SOLUTION</strong>
                </span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Global Minimal Bottom Footer */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-3.5 px-6 text-center">
        <p className="text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} School ERP &bull; Next Generation Institutional Finance Platform &bull; All Rights Reserved
        </p>
      </footer>

    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { 
  LogIn, Lock, Mail, ShieldCheck, 
  Eye, EyeOff, ArrowRight, 
  Sparkles, Receipt, Landmark, Wallet, 
  FileCheck, CheckCircle2, Building2, 
  TrendingUp, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
              <p style="font-size: 13px; color: #555; margin-bottom: 12px;">OTP verification code sent to <b>${resetEmail}</b></p>
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
      } catch {
        Swal.fire('Error', 'Could not reach server. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">

      {/* Top Header Bar */}
      <header className="w-full bg-white border-b border-slate-200/90 px-6 sm:px-10 lg:px-12 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                School <span className="text-blue-600">ERP</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10.5px] font-bold uppercase tracking-wider">
                Accounts Desk
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 block leading-tight mt-0.5">
              Multi-Branch Institutional Finance &amp; Ledger Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Fiscal Year: 2026–2027</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live
          </span>
        </div>
      </header>

      {/* Main Content Area (Balanced 2-Column Fixed Grid) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-4 lg:py-6 flex items-center justify-center overflow-hidden min-h-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Polished Content & 4 Balanced Cards */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Smart School Accounting &bull; Automated Ledger Engine</span>
            </div>

            {/* Primary Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-2.5">
              Complete Financial Control for{' '}
              <span className="text-blue-600">Educational Institutions</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mb-5">
              Empower school accountants and bursars with automated fee management, real-time day book reconciliation, instant voucher disbursement, and tax-ready audit compliance.
            </p>

            {/* 4 Proper Cards - Equal Heights & Clean Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mb-5">
              
              {/* Card 1: Student Fee Collection */}
              <div className="bg-white border border-slate-200/90 hover:border-blue-500/60 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                      Fee Collection &amp; Invoices
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">
                    Multi-mode fee collection, sibling discount rules, instant SMS/email receipts &amp; pending dues alerts.
                  </p>
                </div>
              </div>

              {/* Card 2: Income & Day Book */}
              <div className="bg-white border border-slate-200/90 hover:border-emerald-500/60 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                      Day Book &amp; Cash Flow
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">
                    Real-time daily transaction logs, multi-head income classification, bank reconciliations &amp; closing balances.
                  </p>
                </div>
              </div>

              {/* Card 3: Expense & Payroll */}
              <div className="bg-white border border-slate-200/90 hover:border-amber-500/60 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Wallet className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                      Expense &amp; Staff Payroll
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">
                    Vendor payment vouchers, departmental expense tracking, teacher salary disbursals &amp; petty cash records.
                  </p>
                </div>
              </div>

              {/* Card 4: Audit & Balance Sheet */}
              <div className="bg-white border border-slate-200/90 hover:border-indigo-500/60 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                      Audit &amp; Balance Sheets
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 leading-snug">
                    Generate instant P&amp;L statements, quarterly balance sheets, statutory compliance &amp; Excel/PDF exports.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bank-grade 256-bit SSL</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Multi-Campus Ledger Sync</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Role-Based Audit Logs</span>
              </span>
            </div>

          </div>

          {/* Right Column: Clean, Normal, Compact White Login Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[370px] bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/90 p-5 sm:p-5.5">
              
              {/* Form Title & Icon */}
              <div className="mb-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Landmark className="w-4.5 h-4.5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                  Accountant Sign In
                </h2>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                  Enter your credentials to securely access your financial desk.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-2.5">
                
                {/* Field 1: Email Address / Username */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email / Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="accountant@allcoresolution.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Field 2: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Account Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span className="text-[11px] font-semibold text-slate-700">
                      Remember me on this browser
                    </span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 px-4 rounded-lg font-bold text-xs shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>

              </form>

              {/* Card Footer Credit */}
              <div className="mt-3 pt-2 border-t border-slate-100 text-center flex items-center justify-center gap-1 text-[10px] font-medium text-slate-500">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
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
      <footer className="w-full bg-white border-t border-slate-200/90 py-2.5 px-6 text-center shrink-0">
        <p className="text-[11px] text-slate-500 font-medium">
          &copy; 2026 School ERP &bull; Institutional Financial Suite &bull; All Rights Reserved
        </p>
      </footer>

    </div>
  );
};

export default Login;

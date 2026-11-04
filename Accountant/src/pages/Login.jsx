import React, { useState, useEffect } from 'react';
import { LogIn, Lock, User, CheckCircle, GraduationCap, ShieldCheck, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accountant_token') || localStorage.getItem('token');
    if (token) {
      navigate('/accounts/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    const loginIdentifier = identifier.trim();

    // Validate input
    if (!loginIdentifier || !password.trim()) {
      Swal.fire('Validation Error', 'Please enter your email/username and password.', 'warning');
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
          title: 'Login Successful',
          text: 'Welcome back to the Accountant Portal!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#ffffff',
          confirmButtonColor: '#3c8dbc'
        });

        navigate('/accounts/dashboard', { replace: true });
      } else {
        Swal.fire(
          'Login Failed',
          'Invalid username/email or password. Please try again.',
          'error'
        );
      }
    } catch (err) {
      console.error('Accountant Login Error:', {
        status: err.response?.status,
        code: err.code,
        message: err.message
      });

      let errorMessage = 'Something went wrong. Please try again.';

      if (!err.response) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection or server status.';
      } else if ([400, 401, 403].includes(err.response.status)) {
        errorMessage = 'Invalid username/email or password.';
      } else if (err.response.status >= 500) {
        errorMessage = 'Server is temporarily unavailable. Please try again later.';
      }

      Swal.fire('Login Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { value: resetEmail } = await Swal.fire({
      title: 'Reset Password',
      text: 'Enter your registered email to receive a 6-digit OTP:',
      input: 'email',
      inputValue: identifier || 'ryadavy498@gmail.com',
      showCancelButton: true,
      confirmButtonText: 'Send Reset OTP',
      confirmButtonColor: '#3c8dbc'
    });

    if (resetEmail) {
      try {
        Swal.fire({
          title: 'Sending OTP...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const res = await authService.forgotPassword(resetEmail);

        if (res.success) {
          const { value: formValues } = await Swal.fire({
            title: 'Enter OTP & New Password',
            html: `
              <p style="font-size: 13px; color: #555; margin-bottom: 12px;">OTP sent to <b>${resetEmail}</b>. Check your Gmail inbox.</p>
              <input id="swal-otp" class="swal2-input" placeholder="6-digit OTP" maxlength="6" style="text-align: center; font-size: 20px; letter-spacing: 4px; font-weight: bold;">
              <input id="swal-password" type="password" class="swal2-input" placeholder="Enter New Password (min 6 chars)">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update Password',
            confirmButtonColor: '#3c8dbc',
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

            const resetRes = await authService.resetPassword({
              email: resetEmail,
              otp: formValues.otp,
              newPassword: formValues.newPassword
            });

            if (resetRes.success) {
              Swal.fire({
                icon: 'success',
                title: 'Password Updated!',
                text: 'Your password has been changed. You can now login.',
                confirmButtonColor: '#3c8dbc'
              });
              setPassword(formValues.newPassword);
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

  return (
    <div className="min-h-screen bg-white flex font-sans">

      {/* Left Side - Branding & Aesthetics */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e282c] via-[#222d32] to-[#12181a] relative flex-col justify-between p-12 overflow-hidden items-start">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3c8dbc] rounded-full opacity-10 blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#00a65a] rounded-full opacity-10 blur-[60px]"></div>

        <div className="relative z-10 w-full">
          <div className="w-14 h-14 bg-[#3c8dbc] rounded-[3px] flex items-center justify-center mb-6 shadow-lg shadow-[#3c8dbc]/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-[42px] font-bold leading-tight mb-4 tracking-tight">
            Next Generation <br /> <span className="text-[#3c8dbc]">School ERP</span> System.
          </h1>
          <p className="text-[#a0aabf] text-[16px] max-w-md leading-relaxed font-light">
            Manage your institution's finances, academic records, and communications in one seamlessly integrated platform.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 w-full max-w-lg">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-[3px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#00a65a]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[14px]">Enterprise Security</span>
              <span className="text-[#8aa4af] text-[12px]">Bank-grade encryption</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-[3px] flex items-center justify-center">
              <PieChart className="w-5 h-5 text-[#f39c12]" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[14px]">Real-time Analytics</span>
              <span className="text-[#8aa4af] text-[12px]">Smart financial reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative z-10">

        <div className="w-full max-w-[420px]">
          {/* Mobile Only Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#3c8dbc] rounded-[3px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-[24px] font-bold text-[#333]">
              ALL CORE <span className="text-[#3c8dbc]">SOLUTION</span>
            </h1>
          </div>

          <div className="mb-10">
            <h2 className="text-[28px] font-bold text-[#111] mb-2 tracking-tight">Accountant Portal</h2>
            <p className="text-[#666] text-[15px]">Please enter your credentials to securely sign in to your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-[#444] mb-1.5 uppercase tracking-wide">Email Address / Username</label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="e.g. accountant@allcoresolution.com"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-[3px] pl-10 pr-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3c8dbc] text-[15px] transition-colors"
                />
                <User className="w-[18px] h-[18px] absolute left-3.5 top-[14px] text-gray-400 group-focus-within:text-[#3c8dbc] transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#444] mb-1.5 uppercase tracking-wide">System Password</label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-[3px] pl-10 pr-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#3c8dbc] text-[15px] transition-colors"
                />
                <Lock className="w-[18px] h-[18px] absolute left-3.5 top-[14px] text-gray-400 group-focus-within:text-[#3c8dbc] transition-colors" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="w-[18px] h-[18px] opacity-0 absolute z-10 cursor-pointer peer" defaultChecked />
                  <div className="w-[18px] h-[18px] border-2 border-gray-300 rounded-[3px] bg-white peer-checked:bg-[#3c8dbc] peer-checked:border-[#3c8dbc] transition-colors flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                </div>
                <span className="text-[14px] text-[#555] font-semibold group-hover:text-[#333]">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[13px] text-[#3c8dbc] font-semibold hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-3.5 rounded-[3px] text-[15px] font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : <><span className="mr-1">Sign In to Dashboard</span> <LogIn className="w-[18px] h-[18px]" /></>}
            </button>

          </form>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-gray-400">&copy; {new Date().getFullYear()} School ERP — Accountant Portal</p>
            <p className="text-[11px] font-bold text-gray-500">Built with ❤️ by <span className="text-[#3c8dbc]">RAJ YADAV</span> @ALLCORE SOLUTION</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

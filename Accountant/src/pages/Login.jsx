import React, { useState } from 'react';
import { LogIn, Lock, User, CheckCircle, GraduationCap, ShieldCheck, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('accountant@allcoresolution.com');
  const [password, setPassword] = useState('admin@123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ username: identifier, email: identifier, password });
      if (res.success) {
         Swal.fire({
           title: 'Login Successful',
           text: 'Welcome back to the Accountant Portal!',
           icon: 'success',
           timer: 1500,
           showConfirmButton: false,
           background: '#ffffff',
           confirmButtonColor: '#3c8dbc'
         }).then(() => {
           navigate('/accounts/dashboard');
         });
      } else {
         Swal.fire('Error', res.message || 'Login failed', 'error');
      }
    } catch (err) {
       Swal.fire('Error', err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
       setLoading(false);
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
            Next Generation <br/> <span className="text-[#3c8dbc]">School ERP</span> System.
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
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-3.5 rounded-[3px] text-[15px] font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : <><span className="mr-1">Sign In to Dashboard</span> <LogIn className="w-[18px] h-[18px]" /></>}
            </button>
            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-[3px] p-3 text-center">
              <p className="text-[11px] font-bold text-blue-800 mb-1 uppercase tracking-wider">Demo Credentials</p>
              <div className="flex justify-center items-center gap-4 text-[13px] text-blue-700 font-mono font-semibold">
                <span>Email: accountant@allcoresolution.com</span>
                <span>Pass: admin@123</span>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-gray-400">&copy; {new Date().getFullYear()} School ERP — Accountant Portal</p>
            <p className="text-[11px] font-bold text-gray-500">Developed by <span className="text-[#3c8dbc]">RAJ</span> @ALLCORE SOLUTION</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

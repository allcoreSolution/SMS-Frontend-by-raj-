import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { LogIn, Lock, User, ShieldCheck, GraduationCap, CheckCircle, PieChart } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: 'admin@school.com', password: 'admin123' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/login', {
        empId: formData.identifier,
        email: formData.identifier,
        password: formData.password,
        role: "staff"
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data));

        Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          text: 'Welcome to the School ERP',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });

        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      
      Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: msg,
        confirmButtonColor: '#6366f1',
        background: '#fff',
        borderRadius: '3px'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex font-sans">
      
      {/* Left Side - Branding & Aesthetics */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e282c] via-[#222d32] to-[#12181a] relative flex-col justify-between p-12 overflow-hidden items-start">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3c8dbc] rounded-none opacity-10 blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#00a65a] rounded-none opacity-10 blur-[60px]"></div>

        <div className="relative z-10 w-full">
          <div className="w-14 h-14 bg-[#00a65a] rounded-[3px] flex items-center justify-center mb-6 shadow-lg shadow-[#00a65a]/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-[42px] font-bold leading-tight mb-4 tracking-tight">
            Next Generation <br/> <span className="text-[#00a65a]">School ERP</span> System.
          </h1>
          <p className="text-[#a0aabf] text-[16px] max-w-md leading-relaxed font-light">
            Empower your teaching staff, administration, and student management in one unified core platform.
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
              <span className="font-semibold text-[14px]">Real-time Operations</span>
              <span className="text-[#8aa4af] text-[12px]">Smart reports & logs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 bg-white relative z-10">
        <div className="w-full max-w-[400px]">
          {/* Mobile Only Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[#00a65a] rounded-[3px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-[22px] font-bold text-[#333]">
              Yug <span className="text-[#00a65a]">ERP</span>
            </h1>
          </div>

          <div className="mb-5">
            <h2 className="text-[22px] font-bold text-[#111] mb-1 tracking-tight">Admin & Staff Portal</h2>
            <p className="text-[#666] text-[13px]">Enter your credentials to sign in to the core.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#444] mb-1 uppercase tracking-wide">User ID / Employee ID</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder="e.g. ADMIN-01 or EMP001"
                  required
                  className="w-full border-2 border-gray-200 rounded-[3px] pl-9 pr-4 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00a65a] text-[14px] transition-colors"
                />
                <User className="w-[15px] h-[15px] absolute left-3 top-[10px] text-gray-400 group-focus-within:text-[#00a65a] transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-[#444] mb-1 uppercase tracking-wide">System Password</label>
              <div className="relative group">
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-gray-200 rounded-[3px] pl-9 pr-4 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00a65a] text-[14px] transition-colors"
                />
                <Lock className="w-[15px] h-[15px] absolute left-3 top-[10px] text-gray-400 group-focus-within:text-[#00a65a] transition-colors" />
              </div>
            </div>

            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="w-[15px] h-[15px] opacity-0 absolute z-10 cursor-pointer peer" defaultChecked />
                  <div className="w-[15px] h-[15px] border-2 border-gray-300 rounded-[3px] bg-white peer-checked:bg-[#00a65a] peer-checked:border-[#00a65a] transition-colors flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                </div>
                <span className="text-[13px] text-[#555] font-semibold group-hover:text-[#333]">Remember my session</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#00a65a] hover:bg-[#008d4c] text-white py-2.5 rounded-[3px] text-[14px] font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-none animate-spin" />
              ) : (
                <LogIn className="w-[16px] h-[16px]" />
              )}
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>

            <div className="bg-green-50 border border-green-200 rounded-[3px] p-2.5 text-center">
              <p className="text-[10px] font-bold text-green-800 mb-0.5 uppercase tracking-wider">Demo Credentials</p>
              <div className="flex justify-center items-center gap-3 text-[12px] text-green-700 font-mono font-semibold">
                <span>admin@school.com</span>
                <span>·</span>
                <span>admin123</span>
              </div>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-gray-400">&copy; {new Date().getFullYear()} School ERP</p>
            <p className="text-[11px] font-bold text-gray-500">Developed by <span className="text-[#00a65a]">Sachin</span> @ALLCORE SOLUTION</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

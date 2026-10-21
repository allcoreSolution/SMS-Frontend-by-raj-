import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { Lock, User, ArrowRight, ShieldCheck, GraduationCap, LayoutDashboard, MonitorPlay, Activity } from 'lucide-react';

export default function Login() {
  // Hardcoded for testing convenience
  const [userId, setUserId] = useState('P-1920-KABIR');
  const [password, setPassword] = useState('secret_access_24');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login({ userId, password });
      if (res.success) {
        navigate('/dashboard');
      } else {
        alert(res.message || 'Login failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid credentials or API offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">

      {/* ── LEFT SIDE: BRANDING PANEL (50%) ── */}
      <div className="hidden lg:flex flex-col relative w-full lg:w-1/2 bg-[#0B0F19] overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -bottom-64 -left-64 w-[800px] h-[800px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex-1 flex flex-col justify-center px-16 xl:px-24 relative z-10 w-full mx-auto">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-indigo-500/30 bg-indigo-500/10 rounded-none mb-6 text-indigo-400 w-max">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">System Operational v4.2.1</span>
          </div>

          <h1 className="text-white text-5xl xl:text-5xl 2xl:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
            Empower <br />
            <span className="text-indigo-500">Student & Parent</span> <br />
            Connectivity.
          </h1>

          <p className="mt-6 text-gray-400 text-sm font-medium leading-relaxed max-w-md">
            The YUG Enterprise System streamlines academic progress tracking, attendance monitoring, and direct communication lines between families and educators.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 max-w-lg">
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-none backdrop-blur-sm">
              <LayoutDashboard className="w-6 h-6 text-indigo-400 mb-3" />
              <h3 className="text-white font-black text-[13px] uppercase tracking-widest mb-1.5">Real-time Metrics</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Track live attendance drops, assignment deadlines, and timetable shifts automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-none backdrop-blur-sm">
              <MonitorPlay className="w-6 h-6 text-indigo-400 mb-3" />
              <h3 className="text-white font-black text-[13px] uppercase tracking-widest mb-1.5">Digital Learning</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Direct access to online examinations, performance analytics, and dynamic curriculum.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: LOGIN FORM (50%) ── */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-20 xl:px-28 relative z-10 w-full lg:w-1/2 bg-gray-50/50 border-l border-gray-100">

        <div className="w-full max-w-sm mx-auto">
          {/* Logo Header */}
          <div className="mb-10 flex flex-col items-center text-center pt-6">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-none flex items-center justify-center mb-5 shadow-lg transform -rotate-3">
              <GraduationCap className="h-7 w-7 rotate-3" />
            </div>
            <h2 className="text-[26px] font-black text-gray-900 tracking-tighter uppercase leading-none">
              Parent Portal
            </h2>
            <p className="mt-2 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
              Student ERP Access Node
            </p>
          </div>

          {/* Form Section */}
          <form className="space-y-6" onSubmit={handleLogin}>

            {/* ID Input */}
            <div>
              <label htmlFor="userId" className="block text-[11px] font-black tracking-widest text-gray-800 uppercase mb-2">
                Portal ID / Mobile No.
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-none bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-600 sm:text-sm font-bold text-gray-900 transition-colors shadow-sm"
                  placeholder="Enter your ID..."
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-[11px] font-black tracking-widest text-gray-800 uppercase">
                  Secure Password
                </label>
                <a href="#" className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors">
                  Reset Link?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-none bg-white placeholder-gray-400 focus:outline-none focus:border-indigo-600 sm:text-sm font-bold text-gray-900 transition-colors shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-none cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2.5 block text-[11px] font-extrabold tracking-widest text-gray-600 uppercase cursor-pointer">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-none shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] text-[12px] font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-none hover:translate-y-1 hover:translate-x-1 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                'Authenticating Connection...'
              ) : (
                <>
                  Authenticate Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 mt-8 text-gray-400 pt-6 border-t border-gray-200/60 justify-center w-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted Session</span>
            </div>

          </form>
        </div>

        {/* Small watermark on right side */}
        <div className="absolute bottom-6 w-full text-center left-0 text-[9px] font-black uppercase tracking-widest text-gray-400 select-none">
          Developed by RAJ YADAV @All Core Solution
        </div>
      </div>

    </div>
  );
}

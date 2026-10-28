import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { 
  Lock, User, ArrowRight, ShieldCheck, GraduationCap, 
  LayoutDashboard, MonitorPlay, Activity, Eye, EyeOff, 
  AlertCircle, KeyRound, ExternalLink, School, Users, Check
} from 'lucide-react';

export default function Login() {
  const [roleTab, setRoleTab] = useState('student'); // 'student' | 'parent'
  const [userId, setUserId] = useState('YIS-2024-101');
  const [password, setPassword] = useState('secret_access_24');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filledNotice, setFilledNotice] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setRoleTab(role);
    setError('');
    localStorage.removeItem('active_child');
    if (role === 'student') {
      setUserId('YIS-2024-101');
    } else {
      setUserId('P-1920-KABIR');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      localStorage.removeItem('active_child');
      localStorage.removeItem('parent_user');
      localStorage.removeItem('parent_token');
      const res = await authService.login({ userId, password, role: roleTab });
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Connection failed';
      if (String(msg).toLowerCase().includes('network') || err.code === 'ERR_NETWORK') {
        setError('Backend server offline on port 5050. Attempting demo mode...');
        try {
          const fallback = await authService.login({ userId, password });
          if (fallback.success) {
            navigate('/dashboard');
            return;
          }
        } catch (_) {}
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    if (roleTab === 'student') {
      setUserId('YIS-2024-101');
      setPassword('secret_access_24');
    } else {
      setUserId('P-1920-KABIR');
      setPassword('secret_access_24');
    }
    setFilledNotice(true);
    setTimeout(() => setFilledNotice(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden font-sans">

      {/* ── LEFT SIDE: BRANDING PANEL (50%) ── */}
      <div className="hidden lg:flex flex-col relative w-full lg:w-1/2 bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] overflow-hidden justify-between p-12 xl:p-16 text-white shadow-2xl">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-blue-300/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 mb-6 text-blue-100 shadow-sm">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-black uppercase tracking-wider">ACS Smart Campus &bull; Dual Portal v5.0</span>
          </div>

          <h1 className="text-white text-4xl xl:text-5xl font-black tracking-tight leading-tight">
            Next-Gen <br />
            <span className="text-amber-300">Student & Parent</span> <br />
            Digital Portal.
          </h1>

          <p className="mt-5 text-blue-100 text-xs xl:text-sm font-medium leading-relaxed max-w-md">
            Unified access for both students and parents: live timetable, CBSE attendance tracking, fee receipts, RFID bus telemetry, assignments, and 24/7 AI tutor desk.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
            {/* Feature 1 */}
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2 text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-white font-black text-xs uppercase tracking-wide mb-1">Student Space</h3>
              <p className="text-blue-100 text-[11px] leading-relaxed">
                Homework, daily diary, study notes, live classes, online CBT tests, and report card marks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2 text-white">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-white font-black text-xs uppercase tracking-wide mb-1">Parent Desk</h3>
              <p className="text-blue-100 text-[11px] leading-relaxed">
                Multi-ward switcher, fee installment clearance, live GPS tracking, and PTM consultations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="relative z-10 pt-6 border-t border-white/20 flex items-center justify-between text-xs text-blue-200">
          <span>&copy; {new Date().getFullYear()} ACS International School &bull; All Rights Reserved</span>
          <span className="font-semibold text-white">
            Engineered by <strong className="text-amber-300">RAJ YADAV</strong> @ALLCORE SOLUTION
          </span>
        </div>
      </div>

      {/* ── RIGHT SIDE: LOGIN FORM (50%) ── */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 relative z-10 w-full lg:w-1/2 bg-white min-h-screen lg:min-h-0">

        {/* Top Header Mobile */}
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-black text-gray-900 text-sm">ACS Student & Parent Portal</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">v5.0</span>
        </div>

        <div className="w-full max-w-sm mx-auto my-auto py-4">
          
          {/* Logo Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-700 to-blue-500 text-white rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              ACS Smart Campus
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Select your role to access academics, fees & communications
            </p>
          </div>

          {/* DUAL ROLE TAB SWITCHER: STUDENT vs PARENT */}
          <div className="mb-4 p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                roleTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('parent')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                roleTab === 'parent'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Parent Login</span>
            </button>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="mb-4 flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-2xl text-xs">
            <div className="text-[11px] text-blue-950 font-medium">
              Demo ID: <strong className="font-bold text-blue-700">{roleTab === 'student' ? 'YIS-2024-101 (Aarav - Student)' : 'P-1920-KABIR (Vikram - Parent)'}</strong>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>{filledNotice ? 'Filled!' : 'Fill Demo'}</span>
            </button>
          </div>

          {/* In-page Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Section */}
          <form className="space-y-4" onSubmit={handleLogin}>

            {/* ID Input */}
            <div>
              <label htmlFor="userId" className="block text-xs font-bold text-slate-700 mb-1.5">
                {roleTab === 'student' ? 'Student Roll No / Admission ID' : 'Parent Portal ID / Mobile Phone'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {roleTab === 'student' ? (
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Users className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-2xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 focus:bg-white text-xs font-bold text-slate-900 transition-all shadow-xs"
                  placeholder={roleTab === 'student' ? 'e.g. YIS-2024-101 or Aarav' : 'e.g. P-1920-KABIR or 9876543210'}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[10px] font-semibold text-slate-400">Default: secret_access_24</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-2xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 focus:bg-white text-xs font-bold text-slate-900 transition-all shadow-xs"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] font-bold text-blue-600">Active Node</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex justify-center items-center gap-2 py-3 px-4 rounded-2xl shadow-lg shadow-blue-600/25 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:opacity-95 active:scale-[0.99] focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as {roleTab === 'student' ? 'Student' : 'Parent'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 pt-3 text-slate-400 justify-center w-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct Central Database Link</span>
            </div>

          </form>

          {/* Quick links to Main Web & other portals */}
          <div className="mt-6 pt-3 border-t border-slate-200/80 text-center text-xs text-slate-500 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span>Main Portal:</span>
              <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>localhost:5173</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Small watermark on right side */}
        <div className="w-full text-center py-2 text-[11px] font-medium text-slate-500 select-none">
          Built with ❤️ by <strong className="text-slate-800 font-bold">RAJ YADAV</strong> <span className="text-blue-600 font-bold">@ALLCORE SOLUTION</span>
        </div>
      </div>

    </div>
  );
}

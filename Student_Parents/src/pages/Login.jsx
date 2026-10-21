import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { 
  Lock, User, ArrowRight, ShieldCheck, GraduationCap, 
  LayoutDashboard, MonitorPlay, Activity, Eye, EyeOff, 
  AlertCircle, KeyRound, ExternalLink, School
} from 'lucide-react';

export default function Login() {
  const [userId, setUserId] = useState('P-1920-KABIR');
  const [password, setPassword] = useState('secret_access_24');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filledNotice, setFilledNotice] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login({ userId, password });
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Connection failed';
      if (String(msg).toLowerCase().includes('network') || err.code === 'ERR_NETWORK') {
        setError('Backend server offline on port 5050. Attempting demo mode...');
        // Auto-attempt demo fallback
        try {
          const fallback = await authService.login({ userId: 'P-1920-KABIR', password });
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
    setUserId('P-1920-KABIR');
    setPassword('secret_access_24');
    setFilledNotice(true);
    setTimeout(() => setFilledNotice(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">

      {/* ── LEFT SIDE: BRANDING PANEL (50%) ── */}
      <div className="hidden lg:flex flex-col relative w-full lg:w-1/2 bg-[#0B0F19] overflow-hidden justify-between p-12 xl:p-16">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -bottom-64 -left-64 w-[800px] h-[800px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-indigo-500/30 bg-indigo-500/10 rounded-full mb-6 text-indigo-400 w-max">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Parent Portal Node v4.2.1</span>
          </div>

          <h1 className="text-white text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-tight">
            Empower <br />
            <span className="text-indigo-400">Student & Parent</span> <br />
            Connectivity.
          </h1>

          <p className="mt-5 text-gray-400 text-xs xl:text-sm font-medium leading-relaxed max-w-md">
            Direct real-time link to attendance drops, live fee receipts, report cards, classwork logs, and 24/7 school communications.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <LayoutDashboard className="w-5 h-5 text-indigo-400 mb-2" />
              <h3 className="text-white font-black text-xs uppercase tracking-wide mb-1">Live Academics</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Instant alerts for attendance, daily homework and test scores.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <MonitorPlay className="w-5 h-5 text-indigo-400 mb-2" />
              <h3 className="text-white font-black text-xs uppercase tracking-wide mb-1">Fee Desk & Diary</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Pay school fees online, get instant invoices and receipts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} School ERP &bull; Student & Parent Portal</span>
          <span className="font-semibold text-gray-400">
            Built with ❤️ by <strong className="text-white">RAJ YADAV</strong> <span className="text-indigo-400 font-bold">@ALLCORE SOLUTION</span>
          </span>
        </div>
      </div>

      {/* ── RIGHT SIDE: LOGIN FORM (50%) ── */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 relative z-10 w-full lg:w-1/2 bg-gray-50/70 border-l border-gray-200/80 min-h-screen lg:min-h-0">

        {/* Top Header Mobile */}
        <div className="lg:hidden flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-black text-gray-900 text-sm">Parent Portal</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">Port 5175</span>
        </div>

        <div className="w-full max-w-sm mx-auto my-auto py-6">
          {/* Logo Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-indigo-600/30">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Parent & Student Portal
            </h2>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              Sign in with your Portal ID to access student records
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="mb-4 flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs">
            <div className="text-[11px] text-indigo-950 font-medium">
              Demo ID: <strong className="font-bold text-indigo-600">P-1920-KABIR</strong>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>{filledNotice ? 'Filled!' : 'Fill Demo'}</span>
            </button>
          </div>

          {/* In-page Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Section */}
          <form className="space-y-4" onSubmit={handleLogin}>

            {/* ID Input */}
            <div>
              <label htmlFor="userId" className="block text-xs font-bold text-gray-700 mb-1">
                Portal ID / Admission No.
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
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-xs font-bold text-gray-900 transition-all shadow-sm"
                  placeholder="e.g. P-1920-KABIR"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700">
                  Password
                </label>
                <span className="text-[10px] font-semibold text-gray-400">Default: secret_access_24</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 text-xs font-bold text-gray-900 transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] font-bold text-indigo-600">Active Node</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/25 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Parent Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 pt-4 text-gray-400 justify-center w-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct Central Database Link</span>
            </div>

          </form>

          {/* Quick links to Main Web & other portals */}
          <div className="mt-6 pt-4 border-t border-gray-200/80 text-center text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span>Main Portal:</span>
              <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>localhost:5173</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Small watermark on right side */}
        <div className="w-full text-center py-2 text-[11px] font-bold text-gray-500 select-none">
          Built with ❤️ by <strong className="text-gray-900">RAJ YADAV</strong> <span className="text-indigo-600">@ALLCORE SOLUTION</span>
        </div>
      </div>

    </div>
  );
}

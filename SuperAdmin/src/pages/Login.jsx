import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Mail, GraduationCap, 
  Sparkles, ArrowRight, School, UserCheck, 
  Calculator, BookOpen, Users, ExternalLink, CheckCircle2,
  Eye, EyeOff, Zap, ShieldAlert, KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const demoRoles = [
  {
    role: 'Super Admin',
    desc: 'Platform Owner',
    email: 'admin123@gmail.com',
    pass: 'admin@123',
    icon: ShieldCheck,
    color: 'from-orange-500 to-amber-500',
    currentPanel: true,
  },
  {
    role: 'School Admin',
    desc: 'School Portal (5176)',
    url: 'http://localhost:5176',
    icon: School,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    role: 'Branch Admin',
    desc: 'Branch Campus (5174)',
    url: 'http://localhost:5174',
    icon: UserCheck,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    role: 'Teacher',
    desc: 'Faculty & Marks (5177)',
    url: 'http://localhost:5177',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    role: 'Accountant',
    desc: 'Fees & Finance (5178)',
    url: 'http://localhost:5178',
    icon: Calculator,
    color: 'from-rose-500 to-pink-500',
  },
  {
    role: 'Parent / Student',
    desc: 'Learning Portal (5175)',
    url: 'http://localhost:5175',
    icon: Users,
    color: 'from-amber-500 to-yellow-500',
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin123@gmail.com', password: 'admin@123' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await login(form.email, form.password);
      if (ok) {
        navigate('/');
        return;
      }
      setError('Invalid credentials. Use admin123@gmail.com / admin@123');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed';
      if (String(msg).toLowerCase().includes('network') || err?.code === 'ERR_NETWORK') {
        setError('Backend API not reachable on port 5050. Please check API server.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (item) => {
    if (item.currentPanel) {
      setForm({ email: item.email, password: item.pass });
      setAutoFilled(true);
      setTimeout(() => setAutoFilled(false), 2000);
    } else if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-[#080d1a] text-slate-100 font-sans selection:bg-[#ff5c0a] selection:text-white relative">
      
      {/* Background Decorative Mesh Glows */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-gradient-to-br from-orange-600/20 via-amber-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-gradient-to-bl from-purple-600/15 via-pink-500/10 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Dot Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* ============================================================ */}
      {/* LEFT COLUMN: BRANDING & PLATFORM SHOWCASE (Fits 100vh) */}
      {/* ============================================================ */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] h-full relative z-10 flex-col justify-between p-8 xl:p-12 border-r border-slate-800/80 bg-gradient-to-b from-[#0b101d]/90 via-[#090d18]/95 to-[#070a13]/90 backdrop-blur-xl">
        
        {/* Top Header / Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ff5c0a] via-[#ff782d] to-[#ffaa40] p-0.5 shadow-lg shadow-orange-500/25 flex items-center justify-center group">
              <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center transition-transform group-hover:scale-95">
                <GraduationCap className="w-5 h-5 text-[#ff5c0a]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">Multi-School ERP</h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#ff5c0a] tracking-wide">
                  v3.7 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Central Governance Suite</p>
            </div>
          </div>

          {/* Live System Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cloud Sync Active</span>
          </div>
        </div>

        {/* Center Hero Section */}
        <div className="my-auto py-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/70 text-xs font-semibold text-slate-200 mb-4 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5c0a] animate-spin" style={{ animationDuration: '8s' }} />
            <span>Central Multi-Tenant Platform</span>
          </div>

          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            Unified Control for Every Campus, <br />
            <span className="bg-gradient-to-r from-[#ff5c0a] via-amber-300 to-[#ff8c42] bg-clip-text text-transparent">
              One Single Command Hub.
            </span>
          </h2>

          <p className="text-slate-400 text-xs xl:text-sm leading-relaxed mb-6 max-w-lg">
            Effortlessly govern academic workflows, real-time fee ledgers, automated biometric attendance, and multi-branch infrastructure from a rock-solid cloud backend.
          </p>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all group backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Multi-Tenant DB</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Isolated branches with centralized control & sync.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all group backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <div className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#ff5c0a] group-hover:scale-110 transition-transform">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>Live Attendance</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Instant QR code scanning & biometric hardware link.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all group backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Calculator className="w-3.5 h-3.5" />
                </div>
                <span>Fee Accounting</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Automated payment gateways, invoices & live audit.</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all group backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span>Exams & Marks</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">Online assessments, grading rubrics & report cards.</p>
            </div>
          </div>
        </div>

        {/* Left Column Bottom Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/70">
          <span>&copy; {new Date().getFullYear()} Multi-School ERP Suite</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-400">
            <span>Built by</span>
            <span className="text-[#ff5c0a] font-bold">RAJ</span>
            <span>@ALLCORE SOLUTION</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: LOGIN FORM & PORTAL SWITCHER (Fits 100vh) */}
      {/* ============================================================ */}
      <div className="w-full lg:w-[50%] xl:w-[48%] h-full flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto lg:overflow-hidden relative z-10 bg-[#070b14]/95">
        
        {/* Mobile Top Brand (Visible only on mobile/tablet) */}
        <div className="lg:hidden w-full max-w-md pt-2 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff5c0a] flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm text-white">Multi-School ERP</span>
              <span className="block text-[10px] text-slate-400">SuperAdmin Portal</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-[#ff5c0a]">Port 5179</span>
        </div>

        {/* Central Card Container */}
        <div className="w-full max-w-md my-auto">
          
          <div className="bg-[#101726]/90 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/70 backdrop-blur-2xl relative overflow-hidden">
            {/* Top Glowing Brand Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff5c0a] via-amber-400 to-[#ff7e33]" />

            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff5c0a]/10 border border-[#ff5c0a]/20 text-[10px] font-extrabold text-[#ff5c0a] tracking-wider uppercase mb-1.5">
                  <ShieldCheck className="w-3 h-3" />
                  SUPER ADMIN MASTER
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Master Sign In</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Enter master credentials to access the central governance dashboard.</p>
              </div>

              {/* Quick Auto-Fill Chip */}
              <button
                type="button"
                onClick={() => handleQuickSelect(demoRoles[0])}
                title="Click to auto-fill SuperAdmin credentials"
                className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                  autoFilled 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <KeyRound className="w-3 h-3 text-[#ff5c0a]" />
                <span>{autoFilled ? 'Filled!' : 'Demo Fill'}</span>
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-3.5 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-[11px] font-medium flex items-start gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Master Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="admin123@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/40 focus:border-[#ff5c0a] transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300">Master Password</label>
                  <span className="text-[10px] font-semibold text-slate-500">Default: admin@123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/40 focus:border-[#ff5c0a] transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1.5 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#ff5c0a] via-[#ff7020] to-[#ff8c42] hover:from-[#e64e00] hover:to-[#ff5c0a] shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Super Admin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Divider */}
            <div className="relative my-3.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="bg-[#101726] px-2.5 font-bold uppercase tracking-wider text-slate-400">
                  Switch or Access Panels
                </span>
              </div>
            </div>

            {/* 6 Quick Demo Roles Grid (Compact 2-columns) */}
            <div className="grid grid-cols-2 gap-2">
              {demoRoles.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSelect(item)}
                    title={item.currentPanel ? 'Click to fill credentials' : `Open ${item.role} on ${item.url}`}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all group cursor-pointer ${
                      item.currentPanel
                        ? 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/15'
                        : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                          {item.role}
                        </span>
                        {item.currentPanel ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c0a] flex-shrink-0" />
                        ) : (
                          <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[9.5px] text-slate-400 block truncate leading-none mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Assistance Footer */}
          <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
            <span>Main Landing Web:</span>
            <a 
              href="http://localhost:5173" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#ff5c0a] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>localhost:5173</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Bottom copyright on right */}
        <div className="text-[10px] text-slate-400 py-1">
          Multi-School ERP System &bull; Platform Owner Portal
        </div>

      </div>

    </div>
  );
}

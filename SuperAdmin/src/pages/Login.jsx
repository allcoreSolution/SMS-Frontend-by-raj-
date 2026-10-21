import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, LogIn, Lock, Mail, GraduationCap, 
  Sparkles, Layers, ArrowRight, School, UserCheck, 
  Calculator, BookOpen, Users, ExternalLink, CheckCircle2 
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
    border: 'border-orange-500/30',
    bg: 'bg-orange-50/50 hover:bg-orange-50',
    text: 'text-orange-600',
    currentPanel: true,
  },
  {
    role: 'School Admin',
    desc: 'Main School Portal',
    url: 'http://localhost:5176',
    icon: School,
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    bg: 'bg-blue-50/50 hover:bg-blue-50',
    text: 'text-blue-600',
  },
  {
    role: 'Branch Admin',
    desc: 'Branch Campus',
    url: 'http://localhost:5174',
    icon: UserCheck,
    color: 'from-purple-500 to-indigo-500',
    border: 'border-purple-500/30',
    bg: 'bg-purple-50/50 hover:bg-purple-50',
    text: 'text-purple-600',
  },
  {
    role: 'Teacher',
    desc: 'Faculty & Marks',
    url: 'http://localhost:5177',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-50/50 hover:bg-emerald-50',
    text: 'text-emerald-600',
  },
  {
    role: 'Accountant',
    desc: 'Fees & Finance',
    url: 'http://localhost:5178',
    icon: Calculator,
    color: 'from-rose-500 to-pink-500',
    border: 'border-rose-500/30',
    bg: 'bg-rose-50/50 hover:bg-rose-50',
    text: 'text-rose-600',
  },
  {
    role: 'Parent / Student',
    desc: 'Learning & Diary',
    url: 'http://localhost:5175',
    icon: Users,
    color: 'from-amber-500 to-yellow-500',
    border: 'border-amber-500/30',
    bg: 'bg-amber-50/50 hover:bg-amber-50',
    text: 'text-amber-600',
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin123@gmail.com', password: 'admin@123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setError('Invalid email or password. Use admin123@gmail.com / admin@123');
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
    } else if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0c1017] text-slate-100 font-sans selection:bg-[#ff5c0a] selection:text-white">
      
      {/* Left Column: Visual Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#131927] border-r border-slate-800/80 p-12 flex-col justify-between overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ff5c0a]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#131927] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#ff5c0a]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">Multi-School ERP</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff5c0a]">v3.7 PRO</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Enterprise Central Governance Platform</p>
            </div>
          </div>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-300 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5c0a] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Next-Generation Cloud Education Suite</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-5">
            Empower Every Campus, <br />
            <span className="bg-gradient-to-r from-[#ff5c0a] via-amber-400 to-[#ff8c42] bg-clip-text text-transparent">
              One Single Command Center.
            </span>
          </h1>

          <p className="text-slate-400 text-sm xl:text-base leading-relaxed mb-8">
            Manage multi-branch academics, automated biometric & QR attendance, real-time fee ledgers, online examinations, and teacher workflows from a single unified hub.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Multi-Tenant Architecture
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Isolated databases & custom domains for each school branch.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#ff5c0a]" />
                Live Attendance & Biometrics
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Instant QR scanning, hardware sync, and geo-fenced logs.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Fee Ledgers & Accounting
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Automated payment gateways, invoices & financial audits.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                Exams & Question Bank
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Rubrics, online assessments, and instant report cards.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800/60">
          <span>&copy; {new Date().getFullYear()} Multi-School ERP Suite</span>
          <span className="font-semibold text-slate-400">Developed by <span className="text-[#ff5c0a]">RAJ</span> @ALLCORE SOLUTION</span>
        </div>
      </div>

      {/* Right Column: Interactive Login & Demo Role Switcher */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-slate-950">
        <div className="w-full max-w-md my-auto">
          
          {/* Card Container */}
          <div className="bg-[#131927] border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/60 relative overflow-hidden">
            {/* Top Orange Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff5c0a] via-amber-400 to-[#ff8c42]" />

            {/* Header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff5c0a]/10 border border-[#ff5c0a]/20 text-[11px] font-bold text-[#ff5c0a] mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                PLATFORM OWNER PORTAL
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-400 mt-1">Sign in with master credentials to access the Super Admin control panel.</p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-medium flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0 animate-ping" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Master Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="admin123@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/30 focus:border-[#ff5c0a] transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  <span className="text-[11px] font-medium text-slate-400">admin@123</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff5c0a]/30 focus:border-[#ff5c0a] transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] hover:from-[#e64e00] hover:to-[#ff5c0a] shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 group mt-2 disabled:opacity-60"
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

            {/* Quick Demo Access Header */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#131927] px-3 font-bold text-[11px] uppercase tracking-wider text-slate-400">
                  Quick Demo Access (One-Click)
                </span>
              </div>
            </div>

            {/* 6 Quick Demo Roles Grid (Matching demo.multischoolerp.com) */}
            <div className="grid grid-cols-2 gap-2">
              {demoRoles.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSelect(item)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                          {item.role}
                        </span>
                        {!item.currentPanel && <ExternalLink className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate leading-tight">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Need assistance? Contact support at </span>
            <span className="text-slate-400 font-semibold">support@multischoolerp.com</span>
          </div>

        </div>
      </div>

    </div>
  );
}

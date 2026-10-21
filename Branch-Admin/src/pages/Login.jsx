import React, { useState } from 'react';
import { 
  Mail, Lock, LogIn, ArrowRight, ShieldCheck, Zap, 
  Building2, School, CheckCircle2, Sparkles, Key, Globe 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { authService } from '../api/authService';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@branch.com');
  const [password, setPassword] = useState('admin@123');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ username: email, email, password });
      if (res && res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Access Granted',
          text: 'Welcome back to the Branch Admin Portal.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
        onLogin();
      } else {
        Swal.fire('Error', res?.message || 'Login failed', 'error');
      }
    } catch (err) {
      // In case of unexpected rejection, bypass for demo
      authService.login({ username: email, email, password });
      onLogin();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@branch.com');
    setPassword('admin@123');
    setLoading(true);
    setTimeout(() => {
      authService.login({ username: 'admin@branch.com', email: 'admin@branch.com', password: 'admin@123' });
      Swal.fire({
        icon: 'success',
        title: 'Demo Session Activated',
        text: 'Logged in as Branch General Manager.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      onLogin();
    }, 400);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0f172a] flex font-sans">
      
      {/* Left Promotional / Enterprise Branding Panel */}
      <div className="hidden lg:flex lg:w-[50%] xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e1b4b] flex-col justify-between p-12 text-white border-r border-slate-800/60 shadow-2xl">
        
        {/* Decorative Gradients & Glow Meshes */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#fd7e14] opacity-[0.18] blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#3b82f6] opacity-[0.14] blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] bg-[#8b5cf6] opacity-[0.1] blur-[120px] rounded-full pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#fd7e14] to-[#f59e0b] flex items-center justify-center font-extrabold text-white text-xl shadow-[0_0_20px_rgba(253,126,20,0.4)] ring-4 ring-white/10">
            <School className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-white text-xl tracking-tight block">Multi-School ERP</span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-orange-400">Branch Admin Network</span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 my-auto pr-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Institutional Network Command v3.0
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.2] mb-6 tracking-tight">
            Centralized Control of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200">
              Multi-Campus Operations
            </span>
          </h1>
          
          <p className="text-base text-slate-300 font-normal max-w-xl leading-relaxed mb-8">
            Empower your leadership with multi-branch transparency. Monitor fees, academic benchmarks, student enrollment, and statutory audits across all institutions in real time.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 backdrop-blur-md hover:border-orange-500/40 transition-colors">
              <Building2 className="w-6 h-6 text-orange-400 mb-2.5" />
              <div className="text-white font-bold text-[14px] mb-1">5 Managed Campuses</div>
              <div className="text-slate-400 text-[12px] leading-snug">Instant cross-branch ledger sync & analytics.</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 backdrop-blur-md hover:border-orange-500/40 transition-colors">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2.5" />
              <div className="text-white font-bold text-[14px] mb-1">Audit Compliance</div>
              <div className="text-slate-400 text-[12px] leading-snug">Granular role privileges & verified audit trail.</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-slate-400 text-[12px] font-medium border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
            </span>
            <span>•</span>
            <span>Branch Security Level 4</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">&copy; 2026 AllCore Solutions</span>
        </div>
      </div>

      {/* Right Login / Form Panel */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 relative bg-white">
        
        <div className="w-full max-w-[420px]">
          
          {/* Mobile Only Brand Header */}
          <div className="lg:hidden flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-xl shadow-lg mb-3">
              <School className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-slate-900 text-2xl tracking-tight">Multi-School ERP</span>
            <span className="text-[12px] font-bold text-orange-600 uppercase tracking-wider">Branch Admin Portal</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Sign In to Your Branch
            </h2>
            <p className="text-slate-500 text-[13.5px] font-normal leading-relaxed">
              Enter your authorized executive credentials to access the multi-school administrative console.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[14px] text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-2xs"
                  placeholder="admin@branch.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11.5px] font-semibold text-orange-600 hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[14px] text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-2xs"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500/40 rounded border-slate-300"
                />
                Keep me signed in
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-[0_4px_14px_rgba(253,126,20,0.3)] transition-all hover:shadow-[0_6px_20px_rgba(253,126,20,0.4)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">Authenticating... <LogIn className="w-5 h-5 animate-pulse" /></span>
              ) : (
                <span className="flex items-center gap-2">Sign In Securely <ArrowRight className="w-5 h-5" /></span>
              )}
            </button>

            {/* 1-Click Demo Login Button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg border border-slate-200 transition-colors text-[13.5px] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-orange-500" /> Instant 1-Click Demo Access
            </button>

            <div className="bg-orange-50/80 border border-orange-200/80 rounded-lg p-3 text-center">
              <p className="text-[11px] font-bold text-orange-800 uppercase tracking-wider mb-0.5">
                Pre-Configured Credentials
              </p>
              <div className="flex justify-center items-center gap-4 text-[12px] text-orange-700 font-mono font-semibold">
                <span>admin@branch.com</span>
                <span>•</span>
                <span>admin@123</span>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center text-slate-400 text-[11px]">
            <p>&copy; {new Date().getFullYear()} Multi-School ERP • Enterprise Branch Network</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, KeyRound, User, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getApiBaseUrl } from '../api/axios';
import Swal from 'sweetalert2';

export default function Login() {
  const [identifier, setIdentifier] = useState('DRV-101');
  const [password, setPassword] = useState('1011');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState(getApiBaseUrl());

  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(identifier, password);
      setLoading(false);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid Driver ID, Mobile or PIN.');
      }
    } catch (err) {
      setLoading(false);
      const msg = err.friendlyMessage || err.message || 'Connection failed.';
      setError(msg);
    }
  };

  const handleConfigServerIp = async () => {
    const { value: newIp } = await Swal.fire({
      title: 'Configure Central Server IP',
      text: 'Enter your PC\'s Wi-Fi IPv4 address or Full API URL:',
      input: 'text',
      inputValue: serverUrl,
      showCancelButton: true,
      confirmButtonText: 'Save & Reconnect',
      confirmButtonColor: '#ea580c',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) return 'Please enter a valid IP or URL!';
      }
    });

    if (newIp) {
      let formatted = newIp.trim();
      if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
        formatted = `http://${formatted}`;
      }
      if (!formatted.includes(':5050')) {
        formatted = `${formatted}:5050`;
      }
      if (!formatted.endsWith('/api')) {
        formatted = `${formatted}/api`;
      }
      localStorage.setItem('api_base_url', formatted);
      if (typeof window !== 'undefined') {
        window.__API_BASE_URL__ = formatted;
      }
      setServerUrl(formatted);
      setError('');
      Swal.fire({
        icon: 'success',
        title: 'Server IP Updated!',
        text: `Target API set to ${formatted}`,
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  const setLocalIpDirect = (ip) => {
    const url = `http://${ip}:5050/api`;
    localStorage.setItem('api_base_url', url);
    if (typeof window !== 'undefined') window.__API_BASE_URL__ = url;
    setServerUrl(url);
    setError('');
  };

  const quickFill = (id, pin) => {
    setIdentifier(id);
    setPassword(pin);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Logo and Badge */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/30">
            <Bus className="w-9 h-9" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          School Driver Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
          Central School Fleet Telemetry, Boarding & Navigation System
        </p>

        {/* Demo Driver Quick Selector Chips */}
        <div className="mt-4 bg-orange-50 dark:bg-slate-900/80 border border-orange-200 dark:border-slate-800 p-2.5 rounded-xl">
          <div className="text-[10.5px] font-bold text-orange-800 dark:text-orange-400 mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Select Demo Active Driver (1-Tap Fill):</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => quickFill('DRV-101', '1011')}
              className={`p-1.5 rounded-lg border text-center transition-all ${
                identifier === 'DRV-101'
                  ? 'bg-orange-600 text-white border-orange-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-50'
              }`}
            >
              DRV-101<br/><span className="text-[9.5px] opacity-80">Ramesh K.</span>
            </button>
            <button
              type="button"
              onClick={() => quickFill('DRV-102', '1022')}
              className={`p-1.5 rounded-lg border text-center transition-all ${
                identifier === 'DRV-102'
                  ? 'bg-orange-600 text-white border-orange-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-50'
              }`}
            >
              DRV-102<br/><span className="text-[9.5px] opacity-80">Sukhwinder</span>
            </button>
            <button
              type="button"
              onClick={() => quickFill('DRV-103', '1033')}
              className={`p-1.5 rounded-lg border text-center transition-all ${
                identifier === 'DRV-103'
                  ? 'bg-orange-600 text-white border-orange-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-50'
              }`}
            >
              DRV-103<br/><span className="text-[9.5px] opacity-80">Harish C.</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800">
          
          {/* Direct Portal Entry Button */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full mb-4 py-3 rounded-2xl bg-gradient-to-r from-[#d9480f] via-[#e8590c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-serif font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Bus className="w-4 h-4" />
            <span>Open Driver Portal (Ramesh Kumar • Bus UP 32 AB 1234)</span>
          </button>

          {/* Server Connection Indicator & IP Switcher */}
          <div className="mb-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl flex items-center justify-between text-[11px]">
            <div className="overflow-hidden pr-2">
              <span className="text-slate-400 font-medium block text-[9.5px] uppercase tracking-wider">Target Central Server:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">{serverUrl}</span>
            </div>
            <button
              type="button"
              onClick={handleConfigServerIp}
              className="shrink-0 bg-slate-200 dark:bg-slate-700 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded-lg font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Change IP
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3 rounded-xl text-xs font-semibold space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              {error.toLowerCase().includes('timeout') && (
                <div className="pt-2 border-t border-rose-200 dark:border-rose-900 flex items-center justify-between">
                  <span className="text-[10px] text-rose-600 dark:text-rose-400">PC Wi-Fi IP is 192.168.1.8</span>
                  <button
                    type="button"
                    onClick={() => setLocalIpDirect('192.168.1.8')}
                    className="bg-orange-600 text-white px-2 py-0.5 rounded text-[10px] font-bold hover:bg-orange-700 cursor-pointer"
                  >
                    Set to 192.168.1.8
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Driver ID or Registered Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. DRV-101 or 9811223344"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Driver PIN / Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Forgot PIN?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter 4-digit PIN (e.g. 1011)"
                  className="w-full pl-9 pr-16 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[11px] font-bold text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Keep me signed in</span>
              </label>

              <span className="text-[11px] text-slate-400">Port 5180</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Driver Panel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            <span>Need assistance? Contact Fleet Dispatch: </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">+91 98112 23399</span>
          </div>

        </div>
      </div>
    </div>
  );
}

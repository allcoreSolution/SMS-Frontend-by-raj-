import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bus, 
  KeyRound, 
  User, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Eye,
  EyeOff,
  Wifi,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { driverService } from '../api/driverService';
import { getApiBaseUrl } from '../api/axios';
import { getDriverPhoto } from '../utils/photoHelper';
import Swal from 'sweetalert2';

const FALLBACK_DRIVERS = [
  { driverId: 'DRV-101', name: 'Ramesh Kumar', assignedBus: 'DL-01-AB-4501', pin: '1011', photo: '' },
  { driverId: 'DRV-102', name: 'Sukhwinder Singh', assignedBus: 'DL-01-AB-4502', pin: '1022', photo: '' },
  { driverId: 'DRV-103', name: 'Harish Chandra', assignedBus: 'DL-01-AB-4503', pin: '1033', photo: '' },
  { driverId: 'DRV-104', name: 'Mohd. Aslam', assignedBus: 'DL-01-AB-4504', pin: '1044', photo: '' },
  { driverId: 'DRV-105', name: 'Balram Yadav', assignedBus: 'DL-01-AB-4505', pin: '1055', photo: '' },
  { driverId: 'DRV-106', name: 'Suresh Verma', assignedBus: 'DL-09-XY-2704', pin: 'MyPassword999', photo: '' }
];

export default function Login() {
  const [driversList, setDriversList] = useState(FALLBACK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState(FALLBACK_DRIVERS[0]);
  const [identifier, setIdentifier] = useState('DRV-101');
  const [password, setPassword] = useState('1011');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDrivers, setFetchingDrivers] = useState(false);
  const [serverUrl, setServerUrl] = useState(getApiBaseUrl());

  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Dynamically load active fleet drivers from central API
  const loadActiveDrivers = async () => {
    try {
      setFetchingDrivers(true);
      const res = await driverService.getActiveDrivers();
      if (res.success && res.data && res.data.length > 0) {
        setDriversList(res.data);
        // Match currently selected or default to first
        const matched = res.data.find(d => d.driverId === identifier) || res.data[0];
        setSelectedDriver(matched);
        setIdentifier(matched.driverId);
        setPassword(matched.pin || '1011');
      }
    } catch (e) {
      // Use fallback
      console.warn('Using local fleet driver directory:', e.message);
    } finally {
      setFetchingDrivers(false);
    }
  };

  useEffect(() => {
    loadActiveDrivers();
  }, []);

  const handleSelectDriver = (drv) => {
    setSelectedDriver(drv);
    setIdentifier(drv.driverId);
    setPassword(drv.pin || '1011');
    setError('');
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(identifier, password);
      setLoading(false);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid Driver ID or PIN.');
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
      loadActiveDrivers();
      Swal.fire({
        icon: 'success',
        title: 'Server IP Updated!',
        text: `Target API set to ${formatted}`,
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-slate-900 text-slate-100 select-none">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-orange-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-amber-600/15 blur-3xl" />
      </div>

      {/* Main Compact Card (Fixed on Screen) */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col justify-between max-h-[96vh]">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ea580c] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
                <Bus className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="font-serif font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
                  Driver Portal
                </h1>
                <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">
                  School Fleet Telematics
                </p>
              </div>
            </div>

            {/* Server IP Pill */}
            <button
              type="button"
              onClick={handleConfigServerIp}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Configure Server IP"
            >
              <Wifi className="w-3 h-3 text-orange-500" />
              <span className="font-mono text-[9.5px]">5050</span>
            </button>
          </div>

          {/* Dynamic Driver Carousel / Chips (1-Tap Selection) */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10.5px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                <span>Select Fleet Driver ({driversList.length}):</span>
              </span>
              <button
                type="button"
                onClick={loadActiveDrivers}
                disabled={fetchingDrivers}
                className="text-[10px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                title="Refresh Drivers List"
              >
                <RotateCw className={`w-2.5 h-2.5 ${fetchingDrivers ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>

            {/* Horizontal Scrollable Driver Cards */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
              {driversList.map((drv) => {
                const isSelected = selectedDriver?.driverId === drv.driverId;
                const photo = getDriverPhoto(drv);
                const shortName = drv.name.split(' ')[0] + (drv.name.split(' ')[1] ? ` ${drv.name.split(' ')[1].charAt(0)}.` : '');

                return (
                  <button
                    key={drv.driverId}
                    type="button"
                    onClick={() => handleSelectDriver(drv)}
                    className={`shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/25 scale-[1.02]'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-orange-300'
                    }`}
                  >
                    {/* Driver Avatar */}
                    <div className={`w-7 h-7 rounded-full border overflow-hidden flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-white bg-white/20 text-white' : 'border-orange-500 bg-orange-100 dark:bg-orange-950 text-orange-600'
                    }`}>
                      {photo ? (
                        <img src={photo} alt={drv.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black">{drv.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    {/* Driver Info */}
                    <div className="min-w-0 pr-1">
                      <div className={`text-[11px] font-black leading-tight truncate max-w-[85px] ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {shortName}
                      </div>
                      <div className={`text-[9.5px] font-mono leading-tight truncate ${isSelected ? 'text-white/85' : 'text-slate-400 dark:text-slate-400'}`}>
                        {drv.driverId}
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick One-Tap Direct Portal Sign In Button */}
          {selectedDriver && (
            <button
              type="button"
              onClick={() => handleLogin()}
              disabled={loading}
              className="mt-2 w-full py-2 px-3 rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:opacity-95 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0 animate-bounce" />
                <span className="truncate">
                  {loading ? 'Authenticating...' : `Quick Sign In as ${selectedDriver.name}`}
                </span>
              </div>
              <span className="text-[10.5px] bg-white/20 px-2 py-0.5 rounded-full font-mono shrink-0 ml-2">
                Bus {selectedDriver.assignedBus?.replace('Bus ', '')}
              </span>
            </button>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mt-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-shake">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] leading-tight">{error}</span>
            </div>
          )}

          {/* Compact Form */}
          <form onSubmit={handleLogin} className="mt-2.5 space-y-2.5">
            <div>
              <label className="block text-[10.5px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Driver ID / Registered Mobile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. DRV-101 or 9811223344"
                  className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10.5px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Driver Security PIN
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Forgot PIN?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PIN (e.g. 1011)"
                  className="w-full pl-8 pr-12 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Keep signed in</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">Fleet Port: 5180</span>
            </div>

            {/* Standard Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-serif font-black text-xs uppercase tracking-wider shadow-md shadow-orange-600/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer active:scale-98"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Driver Panel'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer Support Info */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400">
          <span>Fleet Dispatch Control: </span>
          <a href="tel:+919811223399" className="font-bold text-orange-600 dark:text-orange-400 hover:underline">
            +91 98112 23399
          </a>
        </div>

      </div>
    </div>
  );
}

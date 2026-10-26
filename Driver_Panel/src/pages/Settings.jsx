import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, KeyRound, Server, Trash2, LogOut, CheckCircle2, Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { driverService } from '../api/driverService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Settings() {
  const { driver, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('api_base_url') || 'http://localhost:5050/api');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const [pinError, setPinError] = useState('');

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    setPinError('');

    const trimmedNew = newPin.trim();
    if (!trimmedNew || trimmedNew.length < 4) {
      setPinError('New password / PIN must be at least 4 characters long.');
      return;
    }

    if (trimmedNew !== confirmPin.trim()) {
      setPinError('New password and confirm password do not match.');
      return;
    }

    setSavingPin(true);
    try {
      const res = await driverService.changePassword({
        currentPassword: currentPin.trim(),
        newPassword: trimmedNew,
        confirmPassword: confirmPin.trim()
      });

      setSavingPin(false);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password / PIN Updated!',
          text: res.message || 'Driver security PIN updated successfully.',
          confirmButtonColor: '#ea580c'
        });
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
      } else {
        setPinError(res.message || 'Failed to update PIN.');
      }
    } catch (err) {
      setSavingPin(false);
      const msg = err.response?.data?.message || err.message || 'Error updating password / PIN.';
      setPinError(msg);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: msg,
        confirmButtonColor: '#ea580c'
      });
    }
  };

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    localStorage.setItem('api_base_url', apiUrl.trim());
    Swal.fire({
      icon: 'success',
      title: 'Server URL Saved',
      text: 'API base target updated. Please reload the panel.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleClearCache = () => {
    Swal.fire({
      title: 'Clear Local Cached Data?',
      text: 'This will reset locally saved settings and telemetry preferences.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Clear Cache',
      confirmButtonColor: '#ea580c'
    }).then(res => {
      if (res.isConfirmed) {
        localStorage.removeItem('api_base_url');
        localStorage.removeItem('driver_theme');
        Swal.fire({ icon: 'success', title: 'Cache Cleared', timer: 1500, showConfirmButton: false });
      }
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Log out of Driver Panel?',
      text: 'You will need to enter your driver credentials again.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sign Out',
      confirmButtonColor: '#ea580c'
    }).then(res => {
      if (res.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-orange-600" />
          <span>Driver Panel Preferences & Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure telemetry endpoints, display themes, PIN security and offline cache
        </p>
      </div>

      <div className="space-y-4">
        
        {/* Card 1: Security & PIN Change */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Driver PIN & Security Password</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Change the password / 4-digit PIN used to log into this Driver terminal and mobile application
            </p>
          </div>

          {pinError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {pinError}
            </div>
          )}

          <form onSubmit={handleUpdatePin} className="space-y-3 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Password / PIN
              </label>
              <div className="relative">
                <input
                  type={showCurrentPin ? 'text' : 'password'}
                  required
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Enter current PIN (e.g. 1011 or 1234)"
                  className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Password / PIN
                </label>
                <div className="relative">
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Min 4 chars (e.g. 5678)"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password / PIN
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Re-enter new PIN"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPin}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{savingPin ? 'Updating PIN...' : 'Update Driver PIN / Password'}</span>
            </button>
          </form>
        </div>

        {/* Card 2: Appearance Theme */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4 text-orange-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Theme Appearance</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Switch between Dark Mode (ideal for night driving) and Light Mode
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:border-orange-500 transition-colors cursor-pointer"
          >
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Card 3: Central Backend API URL */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Central School Backend Server URL</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configured endpoint for real GPS streaming and student boarding synchronization
            </p>
          </div>

          <form onSubmit={handleSaveApiUrl} className="flex gap-2">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:5050/api or https://api.schoolerp.com/api"
              className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
            >
              Save URL
            </button>
          </form>
        </div>

        {/* Card 4: Cache & Storage */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Offline Cache & Stored Preferences</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reset cached vehicle details and offline boarding registers
            </p>
          </div>

          <button
            onClick={handleClearCache}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
          >
            Clear Local Cache
          </button>
        </div>

        {/* Card 5: Sign Out */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-rose-600 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>End Driver Session</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign out of this terminal: {driver?.driverId} ({driver?.name})
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer"
          >
            Sign Out
          </button>
        </div>

      </div>

    </div>
  );
}

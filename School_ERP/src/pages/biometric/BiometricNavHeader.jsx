import React from 'react';
import { 
  Fingerprint, Monitor, ClipboardList, Radio, Eye, 
  ShieldAlert, Terminal, Plus, Sparkles, RefreshCcw, Cpu
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BiometricNavHeader({ onTriggerSimulate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'All Devices', path: '/biometric/all-devices', icon: Monitor },
    { label: 'Attendance Logs', path: '/biometric/attendance-logs', icon: ClipboardList },
    { label: 'Live Punch Stream', path: '/biometric/live-log', icon: Radio },
    { label: 'AI Face Monitoring', path: '/biometric/face-monitoring', icon: Eye },
    { label: 'Review Queue', path: '/biometric/review-queue', icon: ShieldAlert },
    { label: 'Agent Sync Logs', path: '/biometric/agent-logs', icon: Terminal },
  ];

  return (
    <div className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      {/* Brand & Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-200">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Biometric &amp; IoT Device Fleet
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Hardware Gateway Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fingerprint punch clocks, facial recognition turnstiles, and TCP local agent sync management.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onTriggerSimulate && (
            <button
              onClick={onTriggerSimulate}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-purple-200 shadow-2xs"
              title="Test Live Biometric Punch"
            >
              <Sparkles className="w-4 h-4 text-purple-600" /> Test Live Punch
            </button>
          )}

          <button
            onClick={() => navigate('/biometric/add-device')}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-200 flex items-center gap-2 cursor-pointer border-none transition-all"
          >
            <Plus className="w-4 h-4" /> Add Device
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 sm:gap-6 text-xs font-bold overflow-x-auto no-scrollbar border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 font-semibold text-xs transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-teal-600 text-teal-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

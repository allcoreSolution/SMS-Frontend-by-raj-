import React from 'react';
import { 
  QrCode, Camera, Settings, BarChart2, Shield, Maximize, Radio, Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function QRAttendanceNavHeader({ extraRightAction }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Scan Station (Live)', path: '/qr-attendance/attendance', icon: Camera },
    { label: 'Settings & Hardware', path: '/qr-attendance/setting', icon: Settings },
    { label: 'Attendance Report', path: '/qr-attendance/report', icon: BarChart2 },
    { label: 'Scan Audit Log', path: '/qr-attendance/scan-audit', icon: Shield },
  ];

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">
                QR &amp; Barcode Attendance
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Kiosk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-speed entrance scanning, webcam recognition, hardware gun punches &amp; live audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {extraRightAction}
          <button
            onClick={handleFullscreen}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Toggle Fullscreen Kiosk Mode"
          >
            <Maximize className="w-4 h-4" /> Fullscreen Kiosk
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
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
                    ? 'border-indigo-600 text-indigo-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

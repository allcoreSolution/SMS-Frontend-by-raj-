import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Grid, 
  Video, 
  FileText, 
  Sliders, 
  Wifi, 
  Eye, 
  ShieldCheck, 
  HardDrive,
  RefreshCw 
} from 'lucide-react';

export default function CctvTabs({ stats, onRefresh, isRefreshing }) {
  const tabs = [
    {
      to: '/cctv/camera-wall',
      label: 'Camera Wall',
      icon: Grid,
      badge: stats?.onlineCameras !== undefined ? `${stats.onlineCameras} Live` : 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    },
    {
      to: '/cctv/cameras',
      label: 'CCTV Cameras',
      icon: Sliders,
      badge: stats?.totalCameras !== undefined ? `${stats.totalCameras} Units` : null,
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    {
      to: '/cctv/access-log',
      label: 'CCTV Access Log',
      icon: FileText,
      badge: stats?.viewsLast7Days !== undefined ? `${stats.viewsLast7Days} Views` : null,
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-200'
    }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Banner with Quick Stats & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl text-white shadow-xl shadow-slate-950/10 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              Campus CCTV Security Core
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              RTSP / HLS Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-400 inline" />
            CCTV Video Surveillance & Access
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Multi-zone live streaming, high-definition control room feed, parent authorization policy, and tamper-proof access audit logging.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl border border-white/15 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Sync latest camera states & logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-300' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Sync Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Modern Navigation Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 shadow-inner overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 shadow-indigo-500/5'
                    : 'text-slate-650 hover:text-slate-900 hover:bg-white/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

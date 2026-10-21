import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Cake,
  Palette,
  Sparkles,
  Sliders,
  RefreshCw,
  Gift
} from 'lucide-react';

export default function EngagementTabs({ counts = {}, onRefresh, loading = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'birthday-manager',
      label: 'Birthday Manager',
      path: '/engagement/birthday-manager',
      icon: Cake,
      badge: counts.birthdays != null ? counts.birthdays : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'creatives',
      label: 'Creatives & Templates',
      path: '/engagement/creatives',
      icon: Palette,
      badge: counts.creatives != null ? counts.creatives : null
    },
    {
      id: 'festival-greetings',
      label: 'Festival Greetings',
      path: '/engagement/festival-greetings',
      icon: Gift,
      badge: counts.festivals != null ? counts.festivals : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'auto-send-settings',
      label: 'Auto-send Settings',
      path: '/engagement/auto-send-settings',
      icon: Sliders,
      badge: null
    }
  ];

  const currentPath = location.pathname.toLowerCase().replace(/\/$/, '');

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-slate-200/80 mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path.toLowerCase() || 
            (tab.id === 'birthday-manager' && currentPath === '/engagement');

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span
                  className={`ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badgeColor || 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh live data"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200/80 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      )}
    </div>
  );
}

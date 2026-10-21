import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  TrendingDown,
  Wrench,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  BookOpen,
  RefreshCw
} from 'lucide-react';

export default function AssetTabs({ activeTab, counts = {}, onRefresh, loading = false }) {
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'register',
      label: 'Asset Register',
      icon: Package,
      badge: counts.totalAssets != null ? counts.totalAssets : null
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: Layers,
      badge: counts.categories != null ? counts.categories : null
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: Users,
      badge: counts.allocations != null ? counts.allocations : null
    },
    {
      id: 'depreciation',
      label: 'Depreciation',
      icon: TrendingDown,
      badge: null
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      badge: counts.inMaintenance != null && counts.inMaintenance > 0 ? counts.inMaintenance : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'disposals',
      label: 'Disposals',
      icon: Trash2,
      badge: counts.disposals != null ? counts.disposals : null
    },
    {
      id: 'audits',
      label: 'Audits',
      icon: CheckCircle2,
      badge: counts.audits != null ? counts.audits : null
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'guide',
      label: 'Guide',
      icon: BookOpen,
      badge: null
    }
  ];

  const handleTabClick = (tabId) => {
    navigate(`/asset-management/${tabId}`);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-slate-200/80 mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
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

      <button
        onClick={onRefresh}
        disabled={loading}
        title="Refresh live data"
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200/80 disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
}

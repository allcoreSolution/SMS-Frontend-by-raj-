import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  DoorOpen, 
  Layers, 
  Building2, 
  RefreshCw 
} from 'lucide-react';

export default function HostelTabs({ counts = {}, onRefresh, loading = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Hostel Dashboard',
      path: '/hostel/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'student-allocation',
      label: 'Student Allocation',
      path: '/hostel/student-allocation',
      icon: UserCheck,
      badge: counts.allocations != null ? counts.allocations : null
    },
    {
      id: 'manage-rooms',
      label: 'Manage Rooms',
      path: '/hostel/manage-rooms',
      icon: DoorOpen,
      badge: counts.rooms != null ? counts.rooms : null
    },
    {
      id: 'room-types',
      label: 'Room Types',
      path: '/hostel/room-types',
      icon: Layers,
      badge: counts.roomTypes != null ? counts.roomTypes : null
    },
    {
      id: 'manage-hostels',
      label: 'Manage Hostels',
      path: '/hostel/manage-hostels',
      icon: Building2,
      badge: counts.hostels != null ? counts.hostels : null
    }
  ];

  const currentPath = location.pathname.toLowerCase().replace(/\/$/, '');

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-slate-200/80 mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path.toLowerCase() || 
            (tab.id === 'dashboard' && (currentPath === '/hostel' || currentPath === '/hostel/dashboard'));

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
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
          title="Refresh Data"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      )}
    </div>
  );
}

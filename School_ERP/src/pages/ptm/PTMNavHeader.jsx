import React from 'react';
import { 
  LayoutDashboard, Calendar, ClipboardList, MessageSquare, BarChart2, HelpCircle, 
  Plus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PTMNavHeader({ onScheduleClick, activeTabOverride }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (activeTabOverride) return activeTabOverride;
    const path = location.pathname;
    if (path.includes('/schedule')) return 'schedule';
    if (path.includes('/attendance') || path.includes('/details')) return 'attendance';
    if (path.includes('/followup') || path.includes('/follow-up')) return 'followups';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/guide')) return 'guide';
    return 'dashboard';
  };

  const currentTab = getActiveTab();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/ptm/dashboard' },
    { id: 'schedule', label: 'Schedule Meetings', icon: Calendar, path: '/ptm/schedule' },
    { id: 'attendance', label: 'Attendance & Remarks', icon: ClipboardList, path: '/ptm/attendance' },
    { id: 'followups', label: 'Follow-ups', icon: MessageSquare, path: '/ptm/followups' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart2, path: '/ptm/reports' },
    { id: 'guide', label: 'Guide & Workflow', icon: HelpCircle, path: '/ptm/guide' },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-0 z-20 backdrop-blur-md bg-white/95">
      {/* Top Banner */}
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Parent-Teacher Meetings</h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
              PTM Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Schedule meetings, coordinate guardian invites, capture live attendance, write remarks, and track action items.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentTab !== 'schedule' && (
            <button
              onClick={onScheduleClick || (() => navigate('/ptm/schedule'))}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm hover:shadow transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Row */}
      <div className="px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 border-b-2 cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold bg-blue-50/40'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

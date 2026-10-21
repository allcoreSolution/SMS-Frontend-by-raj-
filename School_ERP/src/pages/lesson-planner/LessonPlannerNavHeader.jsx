import React from 'react';
import { 
  LayoutDashboard, BookOpen, Users, CheckSquare, BarChart2, Settings, HelpCircle, 
  Plus, FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LessonPlannerNavHeader({ onNewClick, activeTabOverride }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (activeTabOverride) return activeTabOverride;
    const path = location.pathname;
    if (path.includes('/plans')) return 'plans';
    if (path.includes('/review')) return 'review';
    if (path.includes('/approvals')) return 'approvals';
    if (path.includes('/coverage')) return 'coverage';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/guide')) return 'guide';
    return 'dashboard';
  };

  const currentTab = getActiveTab();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/lesson-planner/dashboard' },
    { id: 'plans', label: 'Lesson Plans', icon: BookOpen, path: '/lesson-planner/plans' },
    { id: 'review', label: 'Review (HOD)', icon: Users, path: '/lesson-planner/review' },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, path: '/lesson-planner/approvals' },
    { id: 'coverage', label: 'Syllabus Coverage', icon: FileText, path: '/lesson-planner/coverage' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart2, path: '/lesson-planner/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/lesson-planner/settings' },
    { id: 'guide', label: 'Workflow Guide', icon: HelpCircle, path: '/lesson-planner/guide' },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-0 z-20 backdrop-blur-md bg-white/95">
      {/* Top Banner */}
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Lesson Planner & Curriculum Hub</h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded-full">
              Academics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weekly lesson planning, learning objectives, multi-tier approvals, and syllabus completion reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {location.pathname !== '/lesson-planner/new' && (
            <button
              onClick={onNewClick || (() => navigate('/lesson-planner/new'))}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm hover:shadow transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>New Lesson Plan</span>
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
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold whitespace-nowrap transition-all duration-150 border-b-2 cursor-pointer ${
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

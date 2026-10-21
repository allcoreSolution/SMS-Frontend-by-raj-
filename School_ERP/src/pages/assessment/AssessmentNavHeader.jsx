import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckSquare, LayoutDashboard, List, BarChart3, FileText, 
  Trophy, BookOpen, Plus, PenSquare, Sparkles
} from 'lucide-react';

export default function AssessmentNavHeader({ onOpenNewModal, onOpenQuickMarks }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Dashboard', path: '/assessment/dashboard', icon: LayoutDashboard },
    { label: 'Assessments', path: '/assessment/list', icon: List },
    { label: 'Enter Marks', path: '/assessment/enter-marks', icon: PenSquare },
    { label: 'Analytics & Trends', path: '/assessment/analytics', icon: BarChart3 },
    { label: 'Student Dossier', path: '/assessment/student-report', icon: FileText },
    { label: 'Rank List', path: '/assessment/rank-list', icon: Trophy },
    { label: 'Guide & Best Practices', path: '/assessment/guide', icon: BookOpen }
  ];

  const currentPath = location.pathname;
  const isMatch = (path) => {
    if (path === '/assessment/list') {
      return currentPath.includes('/list') || currentPath.includes('/assessments');
    }
    if (path === '/assessment/analytics') {
      return currentPath.includes('/analytics') || currentPath.includes('/reports');
    }
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-100 ring-2 ring-indigo-50">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Classroom Assessment Hub
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-3xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lightweight formative evaluations, fast spreadsheet grading, auto marksheets & longitudinal trend analytics
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenQuickMarks}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all shadow-xs cursor-pointer"
            title="Fast mark entry gradebook"
          >
            <PenSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Quick</span> Mark Entry
          </button>

          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 active:scale-95 transition-all shadow-md shadow-indigo-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Assessment
          </button>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isMatch(tab.path);
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 shadow-3xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

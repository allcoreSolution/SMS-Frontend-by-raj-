import React from 'react';
import { 
  LayoutDashboard, BookOpen, List, Tags, Award, LayoutGrid, Calendar, Edit3, Star, MessageSquare, PenTool
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const tabs = [
  { id: 'Dashboard', path: '/offline-exams/dashboard', icon: LayoutDashboard },
  { id: 'Guide', path: '/offline-exams/guide', icon: BookOpen },
  { id: 'Manage Exams', path: '/offline-exams/manage', icon: List },
  { id: 'Exam Types', path: '/offline-exams/types', icon: Tags },
  { id: 'Manage Grades', path: '/offline-exams/manage-grades', icon: Award },
  { id: 'Cocurricular Areas', path: '/offline-exams/cocurricular-areas', icon: LayoutGrid },
  { id: 'Schedule & Marks Setup', path: '/offline-exams/schedule-marks', icon: Calendar },
  { id: 'Enter Marks', path: '/offline-exams/enter-marks', icon: Edit3 },
  { id: 'Cocurricular Grades', path: '/offline-exams/cocurricular-grades', icon: Star },
  { id: 'Teacher Remarks', path: '/offline-exams/teacher-remarks', icon: MessageSquare },
];

export default function OfflineExamsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine active tab based on current path
  const isActive = (path) => {
    // Exact match or base path match for sub-routes
    if (location.pathname === path) return true;
    if (location.pathname.startsWith(path + '/')) return true;
    // Edge case for manage vs manage-grades
    if (path === '/offline-exams/manage' && location.pathname.startsWith('/offline-exams/manage-')) return false;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Offline Examinations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Set up exams, schedule papers, enter marks, and generate report cards across the school.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/offline-exams/quick-setup')}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-none shadow-sm hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <PenTool className="w-4 h-4" /> Quick Setup
          </button>
          <button 
            onClick={() => navigate('/offline-exams/manage')}
            className="px-4 py-2 bg-[#5b5fcf] hover:bg-[#4a4db5] text-white font-bold text-sm rounded-none shadow-sm flex items-center gap-2 cursor-pointer transition-colors border-none"
          >
            <List className="w-4 h-4" /> Manage Exams
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`pb-3 pt-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer bg-transparent ${
                isActive(tab.path)
                  ? 'border-indigo-600 text-indigo-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.id}
            </button>
          ))}
          <button className="pb-3 pt-3 font-bold text-sm flex items-center gap-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 ml-auto cursor-pointer bg-transparent">
             ... More Menu 
          </button>
        </div>
      </div>

      {/* Main Routed Content */}
      <div className="p-6 max-w-[1400px] mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

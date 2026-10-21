import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, List, Tags, Calendar, Edit3, 
  Award, FileText, Printer, Star, MessageSquare, Sliders, Settings
} from 'lucide-react';

const tabs = [
  { name: 'Dashboard', path: '/offline-exams/dashboard', icon: LayoutDashboard },
  { name: 'Manage Exams', path: '/offline-exams/manage', icon: List },
  { name: 'Exam Types', path: '/offline-exams/types', icon: Tags },
  { name: 'Schedule & Setup', path: '/offline-exams/schedule-marks', icon: Calendar },
  { name: 'Datesheet', path: '/offline-exams/datesheet', icon: Calendar },
  { name: 'Enter Marks', path: '/offline-exams/enter-marks', icon: Edit3 },
  { name: 'Teacher Remarks', path: '/offline-exams/teacher-remarks', icon: MessageSquare },
  { name: 'Admit Cards', path: '/offline-exams/admit-cards', icon: Printer },
  { name: 'Manage Grades', path: '/offline-exams/manage-grades', icon: Award },
  { name: 'Generate Marksheet', path: '/offline-exams/generate-marksheet', icon: FileText },
  { name: 'Cocurricular Areas', path: '/offline-exams/cocurricular-areas', icon: Star },
  { name: 'Cocurricular Grades', path: '/offline-exams/cocurricular-grades', icon: Award },
  { name: 'Admit Card Settings', path: '/offline-exams/card-settings', icon: Sliders },
  { name: 'Result Settings', path: '/offline-exams/result-settings', icon: Settings },
];

const OfflineExamsTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path || 
          (tab.path !== '/offline-exams/dashboard' && location.pathname.startsWith(tab.path));

        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span>{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default OfflineExamsTabs;

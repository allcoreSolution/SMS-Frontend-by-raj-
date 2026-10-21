import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Layers, Database, PlusCircle, 
  Upload, GitFork, Award, PlayCircle
} from 'lucide-react';

const tabs = [
  { name: 'Exam Dashboard', path: '/online-exams/dashboard', icon: LayoutDashboard },
  { name: 'Manage Online Exams', path: '/online-exams/manage', icon: Layers },
  { name: 'Question Bank', path: '/online-exams/question-bank', icon: Database },
  { name: 'Add New Question', path: '/online-exams/question-bank/new', icon: PlusCircle },
  { name: 'Bulk Upload Questions', path: '/online-exams/question-bank/bulk-upload', icon: Upload },
  { name: 'Chapters & Topics', path: '/online-exams/chapters-topics', icon: GitFork },
];

const OnlineExamsTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-100'
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

export default OnlineExamsTabs;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, UserPlus, List, Camera, Users, ClipboardCheck, 
  Star, Home, Tags, LogOut, HeartPulse 
} from 'lucide-react';

const StudentsTabs = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', path: '/students/dashboard', icon: LayoutDashboard },
    { name: 'Student Admission', path: '/students/admission', icon: UserPlus },
    { name: 'Student List', path: '/students/list', icon: List },
    { name: 'Search by Photo', path: '/students/search-photo', icon: Camera },
    { name: 'Parents & Guardians', path: '/students/parents', icon: Users },
    { name: 'Student Attendance', path: '/students/attendance', icon: ClipboardCheck },
    { name: 'Behavior Records', path: '/students/behavior', icon: Star },
    { name: 'Student Houses', path: '/students/houses', icon: Home },
    { name: 'Student Categories', path: '/students/categories', icon: Tags },
    { name: 'TC & Exit', path: '/students/tc', icon: LogOut },
    { name: 'Health Records', path: '/students/health', icon: HeartPulse }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path !== '/students/dashboard' && location.pathname.startsWith(tab.path));
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StudentsTabs;

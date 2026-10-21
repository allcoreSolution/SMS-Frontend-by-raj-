import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Book, Layers, LayoutGrid, Link2, Users, 
  Clock, Calendar, ArrowRight
} from 'lucide-react';

const AcademicsTabs = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', path: '/academics/dashboard', icon: LayoutDashboard },
    { name: 'Sessions', path: '/academics/sessions', icon: Layers },
    { name: 'Classes', path: '/academics/classes', icon: LayoutGrid },
    { name: 'Sections', path: '/academics/sections', icon: LayoutGrid },
    { name: 'Subjects', path: '/academics/subjects', icon: Book },
    { name: 'Assign Subjects', path: '/academics/assign-subjects', icon: Link2 },
    { name: 'Assign Electives', path: '/academics/assign-electives', icon: Link2 },
    { name: 'Assign Teacher', path: '/academics/assign-class-teacher', icon: Users },
    { name: 'Manage Periods', path: '/academics/manage-periods', icon: Clock },
    { name: 'Timetable', path: '/academics/timetable', icon: Calendar },
    { name: 'Promote', path: '/academics/promote', icon: ArrowRight },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200/80 shadow-xs mb-6 overflow-x-auto hide-scroll">
      <style dangerouslySetInnerHTML={{__html: `.hide-scroll::-webkit-scrollbar { display: none; }`}} />
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || 
            (tab.path !== '/academics/dashboard' && location.pathname.startsWith(tab.path));
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-200' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicsTabs;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, CreditCard, 
  HardHat, AlertCircle, Mail, ScanLine
} from 'lucide-react';

const FrontOfficeTabs = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', path: '/front-office/dashboard', icon: LayoutDashboard },
    { name: 'Admission Enquiries', path: '/front-office/admission-enquiries', icon: Users },
    { name: 'Visitor Book', path: '/front-office/visitor-book', icon: UserCheck },
    { name: 'Gate Passes', path: '/front-office/gate-passes', icon: CreditCard },
    { name: 'Gate Terminal', path: '/front-office/gate-passes/terminal', icon: ScanLine },
    { name: 'Campus Workers', path: '/front-office/campus-workers', icon: HardHat },
    { name: 'Complaints', path: '/front-office/complaints', icon: AlertCircle },
    { name: 'Postal Records', path: '/front-office/postal-records', icon: Mail },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200/80 shadow-xs mb-6 overflow-x-auto hide-scroll">
      <style dangerouslySetInnerHTML={{__html: `.hide-scroll::-webkit-scrollbar { display: none; }`}} />
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || 
            (tab.path !== '/front-office/dashboard' && location.pathname.startsWith(tab.path));
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

export default FrontOfficeTabs;

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  PenTool, 
  MessageSquare, 
  Grid,
  FileText,
  DollarSign
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav() {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  const { t } = useLanguage();
  const location = useLocation();

  const [userRole, setUserRole] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u?.role || 'Teacher';
    } catch (_) {
      return 'Teacher';
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(u?.role || 'Teacher');
      } catch (_) {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const staffNavItems = [
    {
      name: t('dashboard', 'Home'),
      path: '/',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: t('leave', 'Leave'),
      path: '/leave',
      icon: FileText
    },
    {
      name: t('loans', 'Loans'),
      path: '/loans',
      icon: DollarSign
    },
    {
      name: t('messages', 'Messages'),
      path: '/messages',
      icon: MessageSquare
    }
  ];

  const teacherNavItems = [
    {
      name: t('dashboard', 'Home'),
      path: '/',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: t('attendance', 'Attendance'),
      path: '/student-attendance',
      icon: CalendarCheck
    },
    {
      name: t('marks', 'Marks'),
      path: '/enter-marks',
      icon: PenTool
    },
    {
      name: t('messages', 'Messages'),
      path: '/messages',
      icon: MessageSquare
    }
  ];

  const navItems = userRole === 'Staff' ? staffNavItems : teacherNavItems;

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#131927]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? location.pathname === item.path 
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 select-none ${
                isActive
                  ? 'text-[#ff5c0a] font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform active:scale-95 ${
                isActive ? 'bg-orange-50 dark:bg-orange-950/60' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#ff5c0a]' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.name}
              </span>
            </NavLink>
          );
        })}

        {/* Menu / Drawer Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 select-none cursor-pointer ${
            isSidebarOpen
              ? 'text-[#ff5c0a] font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
          aria-label="Open Full Menu"
        >
          <div className={`p-1.5 rounded-xl transition-transform active:scale-95 ${
            isSidebarOpen ? 'bg-orange-50 dark:bg-orange-950/60' : ''
          }`}>
            <Grid className={`w-5 h-5 ${isSidebarOpen ? 'text-[#ff5c0a]' : 'text-slate-500 dark:text-slate-400'}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">
            {t('menu', 'Menu')}
          </span>
        </button>
      </div>
    </nav>
  );
}

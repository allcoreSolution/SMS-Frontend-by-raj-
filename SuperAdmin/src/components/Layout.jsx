import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('superadmin_sidebar_open');
      return saved !== null ? saved === 'true' : true;
    } catch (_) {
      return true;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Persist desktop sidebar state
  useEffect(() => {
    try {
      localStorage.setItem('superadmin_sidebar_open', String(sidebarOpen));
    } catch (_) {}
  }, [sidebarOpen]);

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(prev => !prev);
    } else {
      setSidebarOpen(prev => !prev);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar with dual mobile & desktop toggle support */}
      <Sidebar 
        open={mobileOpen} 
        desktopOpen={sidebarOpen}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)} 
        onToggleDesktop={() => setSidebarOpen(prev => !prev)}
      />

      {/* Content wrapper with smooth responsive margin transition */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out w-full max-w-full min-w-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <Header 
          onMenuClick={handleToggle} 
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] pt-16 flex flex-col justify-between w-full max-w-full min-w-0">
          <div className="flex-1 w-full max-w-full min-w-0">
            {children}
          </div>
          {/* Main Portal Bottom Footer */}
          <footer className="mt-auto shrink-0 py-3 px-6 border-t border-slate-200/80 bg-white/80 backdrop-blur-md text-center flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-700 tracking-wide">
              &copy; 2026 ALL CORE SOLUTION — Multi-School ERP Cloud Platform
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Developed by <span className="text-slate-900 font-black">RAJ YADAV</span> <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent font-black">@ALLCORE SOLUTION</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;

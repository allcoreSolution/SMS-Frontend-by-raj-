import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-[#f4f6f9] overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full transition-all duration-300">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f4f6f9] flex flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>
          {/* Main Portal Bottom Footer */}
          <footer className="mt-auto shrink-0 py-3 px-4 border-t border-gray-200/80 bg-white/80 backdrop-blur-xs text-center">
            <p className="text-[12px] font-bold text-gray-700 tracking-wide mb-0.5">
              &copy; 2026 School ERP
            </p>
            <p className="text-[11px] font-medium text-gray-500">
              Developed by <span className="text-gray-900 font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

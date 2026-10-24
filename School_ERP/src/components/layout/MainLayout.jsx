import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { BotMessageSquare, X, Megaphone } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [showBanner, setShowBanner] = useState(() => {
    try {
      return !localStorage.getItem('hide_session_banner');
    } catch(e) {
      return true;
    }
  });
  const location = useLocation();
  const mainRef = useRef(null);

  // Close sidebar on mobile when navigating and scroll to top
  useEffect(() => {
    setIsMobileOpen(false);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsDesktopCollapsed(!isDesktopCollapsed);
    }
  };

  // Determine if the sidebar is in a collapsed state for the UI
  // On mobile, if it's open, it's always full width (never collapsed)
  const isCollapsed = !isMobileScreen ? isDesktopCollapsed : false;

  // Re-evaluate window width on resize so state aligns correctly
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex-shrink-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } print:hidden h-full`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 print:bg-white h-screen overflow-hidden">
        <div className="print:hidden relative z-20 flex-shrink-0 w-full">
          <Header toggleSidebar={handleToggleSidebar} />
        </div>
        
        {/* Session Scoping Announcement Banner */}
        {showBanner && (
          <div className="bg-[#009b9f] text-white px-4 sm:px-6 py-2.5 text-xs font-normal flex items-center justify-between gap-3 shadow-xs z-10 w-full animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4 shrink-0 text-white" />
              <p className="leading-relaxed">
                <strong>New: academic-session scoping.</strong> Lists and dashboard numbers (students, exams, assessments, homework, notices...) now show the <em>selected academic session</em> only, so totals may look smaller than before — nothing was deleted. Use the session picker in the top bar to view another year, the &quot;View all sessions&quot; button on lists to see everything, and note that money totals marked &quot;(All Years)&quot; still include every session.
              </p>
            </div>
            <button 
              onClick={() => {
                setShowBanner(false);
                try { localStorage.setItem('hide_session_banner', 'true'); } catch(e) {}
              }} 
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 shrink-0 transition-colors cursor-pointer"
              title="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        
        {/* Dynamic Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto w-full relative flex flex-col justify-between">
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
          
          {/* Floating AI Chatbot Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <Link to="/help-center/ai-chatbot" className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#ff3366] shadow-[0_5px_20px_rgb(0,0,0,0.15)] border border-gray-100 hover:scale-105 transition-transform group relative cursor-pointer">
              <BotMessageSquare className="w-7 h-7" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

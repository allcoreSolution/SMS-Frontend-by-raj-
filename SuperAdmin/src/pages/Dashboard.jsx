import React, { useState, useEffect } from 'react';
import KpiCards from '../components/dashboard/KpiCards';
import PlatformHub from '../components/dashboard/PlatformHub';
import LiveActivity from '../components/dashboard/LiveActivity';
import BottomWidgets from '../components/dashboard/BottomWidgets';
import { Key } from 'lucide-react';

const getGreeting = (hour) => {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const Dashboard = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(now.getHours());
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="px-4 md:px-6 py-4 w-full">
      {/* Top Welcome Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-wider text-orange-600 bg-orange-50 w-max px-3 py-1 rounded-full mb-3 border border-orange-200/60 shadow-3xs uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1 animate-pulse"></span>
            PLATFORM CONSOLE • ONLINE
          </div>
          <h1 className="text-[26px] font-black text-slate-900 tracking-tight">
            {greeting}<span>, </span><span>Super Admin</span> <span className="text-[26px]">👋</span>
          </h1>
          <p className="text-[13px] font-medium text-slate-500 mt-1.5">
            Platform overview — {dateStr} · {timeStr}
          </p>
        </div>
        
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl flex items-center h-12 w-full md:w-auto overflow-hidden max-w-lg">
          <div className="bg-slate-50/70 px-4 h-full flex items-center border-r border-slate-100 font-bold text-[11px] text-emerald-600 z-10 flex-shrink-0 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            LIVE FEED
          </div>
          <div className="w-[420px] max-w-full overflow-hidden relative h-full flex items-center text-[12px] font-medium text-slate-600 pl-4">
            <div className="animate-marquee flex items-center select-none cursor-default">
              <div className="flex items-center gap-6 pr-6 shrink-0">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Super Admin Session Active</span>
                  <span className="text-slate-400 font-normal">({timeStr})</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Platform Multi-School Cloud Online</span>
                  <span className="text-slate-400 font-normal">— {dateStr}</span>
                </span>
                <span className="text-slate-300">•</span>
              </div>
              <div className="flex items-center gap-6 pr-6 shrink-0" aria-hidden="true">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Super Admin Session Active</span>
                  <span className="text-slate-400 font-normal">({timeStr})</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Platform Multi-School Cloud Online</span>
                  <span className="text-slate-400 font-normal">— {dateStr}</span>
                </span>
                <span className="text-slate-300">•</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards />

      {/* Main Grid & Sidebar Area */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        {/* Left Side: Platform Hub */}
        <div className="flex-1 w-full xl:w-[75%]">
          <PlatformHub />
        </div>

        {/* Right Side: Live Activity */}
        <div className="w-full xl:w-[25%] xl:max-w-sm">
          <LiveActivity />
        </div>
      </div>
      
      {/* Bottom Widgets */}
      <BottomWidgets />

      {/* DEVELOPER BRANDING & ATTRIBUTION FOOTER */}
      <footer className="mt-8 pt-4 pb-4 border-t border-slate-200/80 text-center">
        <p className="text-[12px] font-bold text-gray-700 tracking-wide mb-1">
          &copy; 2026 School ERP
        </p>
        <p className="text-[11px] font-medium text-gray-500">
          Developed by <span className="text-gray-900 font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;

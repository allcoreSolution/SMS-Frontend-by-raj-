import React, { useState, useEffect } from 'react';
import KpiCards from '../components/dashboard/KpiCards';
import PlatformHub from '../components/dashboard/PlatformHub';
import LiveActivity from '../components/dashboard/LiveActivity';
import BottomWidgets from '../components/dashboard/BottomWidgets';
import { Key, Sparkles } from 'lucide-react';

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
    <div className="px-3 sm:px-4 md:px-6 py-4 w-full max-w-full overflow-x-hidden min-w-0">
      
      {/* Top Welcome Section - Modern Executive SaaS Banner */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800 p-5 sm:p-6 mb-6 text-white shadow-xl overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full mb-2.5 border border-amber-400/30 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL CORE SOLUTION • SUPERADMIN COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{greeting}, Super Admin</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-[13px] font-medium text-slate-400 mt-1">
            Global multi-campus SaaS operating overview — {dateStr} · {timeStr}
          </p>
        </div>

        {/* Live Feed Ticker Card */}
        <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center h-12 w-full lg:w-auto overflow-hidden shadow-inner max-w-xl">
          <div className="bg-slate-800/80 px-3.5 h-full flex items-center border-r border-slate-700/60 font-black text-[10px] text-emerald-400 shrink-0 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            LIVE FEED
          </div>
          <div className="w-[380px] max-w-full overflow-hidden relative h-full flex items-center text-xs font-semibold text-slate-300 pl-3">
            <div className="animate-marquee flex items-center select-none cursor-default">
              <div className="flex items-center gap-6 pr-6 shrink-0">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Super Admin Session Active</span>
                  <span className="text-slate-400 font-normal">({timeStr})</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Multi-School Cloud SaaS Online</span>
                  <span className="text-slate-400 font-normal">— 100% Operational</span>
                </span>
                <span className="text-slate-600">•</span>
              </div>
              <div className="flex items-center gap-6 pr-6 shrink-0" aria-hidden="true">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Super Admin Session Active</span>
                  <span className="text-slate-400 font-normal">({timeStr})</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Multi-School Cloud SaaS Online</span>
                  <span className="text-slate-400 font-normal">— 100% Operational</span>
                </span>
                <span className="text-slate-600">•</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards />

      {/* Main Grid & Sidebar Area */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6 w-full max-w-full min-w-0">
        {/* Left Side: Platform Hub */}
        <div className="flex-1 w-full xl:w-[75%] min-w-0">
          <PlatformHub />
        </div>

        {/* Right Side: Live Activity */}
        <div className="w-full xl:w-[25%] xl:max-w-sm min-w-0">
          <LiveActivity />
        </div>
      </div>
      
      {/* Bottom Widgets */}
      <BottomWidgets />
    </div>
  );
};

export default Dashboard;

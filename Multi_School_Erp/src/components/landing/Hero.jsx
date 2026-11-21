import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { useModal } from '../../context/ModalContext';
import { 
  ExternalLink, Sparkles, Play, CheckCircle2, TrendingUp, 
  Users, DollarSign, Bus, Smartphone, GraduationCap, 
  ShieldCheck, ArrowUpRight, Bell, Download, Calendar, Activity, Zap
} from 'lucide-react';

export default function Hero() {
  const { openModal } = useModal();

  return (
    <section className="relative pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center w-full">
        
        {/* Left Content */}
        <div className="flex flex-col items-start text-left space-y-3 sm:space-y-3.5 relative w-full">
          {/* Tech Stack Tag */}
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#09B48E] bg-[#E8F8F5] px-2.5 py-1 border border-gray-900 shadow-[1px_1px_0_0_#111827]">
            <span>Node.js</span> <span className="text-gray-900">•</span>
            <span>React</span> <span className="text-gray-900">•</span>
            <span>MongoDB</span> <span className="text-gray-900">•</span>
            <span>Flutter</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-black leading-[1.15] tracking-tight text-gray-900 w-full">
            Complete Multi-School ERP — <br className="hidden lg:block"/>
            <span className="text-amber-500 text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] font-black block mt-1">
              Empower Your Entire School with Cloud &amp; AI.
            </span>
          </h1>

          <p className="text-sm sm:text-[15px] text-gray-600 font-medium leading-relaxed max-w-xl">
            The all-in-one digital operating system for modern schools and educational institutes. Connects School Admin, Teachers, Parents, Students, Accounts, and Drivers into one seamless cloud ecosystem with built-in AI exam &amp; lesson planning tools.
          </p>

          <div className="bg-amber-50 border-[1.5px] border-gray-900 p-2.5 sm:p-3 rounded-lg relative group w-full">
            <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 -z-10 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 rounded-lg" />
            <p className="text-gray-900 text-xs sm:text-[13px] font-semibold leading-relaxed">
              <span className="font-black bg-gray-900 text-white px-2 py-0.5 mr-2 text-[10px] rounded">ENTERPRISE SAAS</span>
              Engineered for <span className="font-black">single schools &amp; multi-branch groups.</span> Complete with mobile apps, automated fee receipts, GPS tracking, and QR attendance.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-[13px] font-bold text-[#09B48E]">
            <span className="flex items-center gap-1.5"><span className="text-sm font-black">✓</span> Zero Hardware Cost</span>
            <span className="flex items-center gap-1.5"><span className="text-sm font-black">✓</span> Instant Cloud Setup</span>
            <span className="flex items-center gap-1.5"><span className="text-sm font-black">✓</span> Mobile Apps for Parents &amp; Staff</span>
            <span className="flex items-center gap-1.5"><span className="text-sm font-black">✓</span> 24/7 Dedicated Support</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-sm sm:text-base font-bold text-gray-400 line-through decoration-2">₹30/mo</span>
            <span className="text-3xl sm:text-4xl font-black text-gray-900 leading-none">₹15</span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider leading-tight">
              PER STUDENT / MONTH<br/>AFFORDABLE SCHOOL PLANS
            </span>
          </div>

          <div className="flex flex-row items-center gap-3 sm:gap-4 pt-1.5 w-full sm:w-auto">
            <button 
              onClick={() => openModal('purchase', { plan: 'Book Free School Demo & Consultation' })}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-active:translate-x-0 group-active:translate-y-0" />
              <div className="relative bg-amber-400 border-[1.5px] border-gray-900 px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center transition-transform group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] group-active:translate-x-0 group-active:translate-y-0 liquid-btn" style={{ '--liquid-bg': '#0f172a', '--liquid-text': '#ffffff' }}>
                <span className="text-gray-900 font-black text-xs sm:text-[13px] uppercase tracking-wider whitespace-nowrap z-10 relative flex items-center gap-2">
                  <span>Book Free School Demo</span>
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
            </button>
            
            <button 
              onClick={() => openModal('portals')}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gray-900 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-active:translate-x-0 group-active:translate-y-0" />
              <div className="relative bg-white border-[1.5px] border-gray-900 px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center transition-transform group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] group-active:translate-x-0 group-active:translate-y-0 liquid-btn" style={{ '--liquid-bg': '#0f172a', '--liquid-text': '#ffffff' }}>
                <span className="text-gray-900 font-black text-xs sm:text-[13px] uppercase tracking-wider whitespace-nowrap z-10 relative flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-gray-900" />
                  <span>Explore Live Portals</span>
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Content - Modern SaaS Interactive Dashboard Showcase */}
        <div className="relative w-full flex flex-col items-center justify-center mt-4 lg:mt-0">
          
          {/* Ambient Lighting Gradients */}
          <div className="absolute -top-8 -right-8 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-60 h-60 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Main Glassmorphic Browser Console */}
          <div className="relative w-full rounded-2xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden transition-all duration-300 hover:shadow-[0_25px_60px_rgba(15,23,42,0.18)]">
            
            {/* Window Top Bar (macOS Chrome Style) */}
            <div className="bg-slate-900 text-white px-4 py-2 sm:py-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
              </div>
              
              <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-0.5 text-[10px] text-slate-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>erp.allcoresolution.com</span>
                <span className="text-slate-500 hidden sm:inline">| Cloud SaaS Engine</span>
              </div>

              <a
                href={PORTAL_URLS.admin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-0.5 rounded border border-amber-400/30 transition-colors"
                title="Open School Admin Portal"
              >
                <span>Live Admin</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Simulated Live School ERP Dashboard Screen */}
            <div className="p-3 sm:p-4 bg-slate-50/70 text-slate-900 space-y-2.5 sm:space-y-3">
              
              {/* Institution Sub-Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                    ACS
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      ALL CORE SOLUTION
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold leading-none mt-0.5">
                      Enterprise Multi-School ERP • Multi-Campus Cloud
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Biometric Active
                  </span>
                </div>
              </div>

              {/* 3 Metric Summary Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                
                {/* Metric 1: Fee Recovery */}
                <div className="bg-white border border-emerald-100 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fee Inflow</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">↑ 94%</span>
                  </div>
                  <div className="text-xs sm:text-base font-black text-slate-900">₹18,45,000</div>
                  <div className="text-[8.5px] sm:text-[9.5px] text-emerald-600 font-semibold mt-0.5 truncate">Auto UPI &amp; Cash Desk</div>
                </div>

                {/* Metric 2: Attendance */}
                <div className="bg-white border border-indigo-100 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-indigo-700 bg-indigo-100 px-1 py-0.2 rounded">98.4%</span>
                  </div>
                  <div className="text-xs sm:text-base font-black text-slate-900">1,842 / 1,872</div>
                  <div className="text-[8.5px] sm:text-[9.5px] text-indigo-600 font-semibold mt-0.5 truncate">Present Today</div>
                </div>

                {/* Metric 3: Fleet GPS */}
                <div className="bg-white border border-amber-100 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">School Bus</span>
                    <span className="text-[8px] sm:text-[9px] font-black text-amber-700 bg-amber-100 px-1 py-0.2 rounded">14 / 14</span>
                  </div>
                  <div className="text-xs sm:text-base font-black text-slate-900">Live GPS</div>
                  <div className="text-[8.5px] sm:text-[9.5px] text-amber-600 font-semibold mt-0.5 truncate">All Routes On-Time</div>
                </div>

              </div>

              {/* Chart & Live Activity Visualizer */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-0.5">
                
                {/* Left 3 cols: Weekly Attendance Bar Chart */}
                <div className="sm:col-span-3 bg-white border border-slate-200/80 rounded-xl p-2.5 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      Weekly Attendance Trend
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Optimal</span>
                  </div>

                  {/* Visual Bar representation */}
                  <div className="flex items-end justify-between h-14 sm:h-16 pt-1 px-2 gap-2">
                    {[
                      { day: 'Mon', h: '88%', val: '96%' },
                      { day: 'Tue', h: '96%', val: '98%' },
                      { day: 'Wed', h: '98%', val: '99%' },
                      { day: 'Thu', h: '92%', val: '97%' },
                      { day: 'Fri', h: '95%', val: '98%' }
                    ].map((b, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[8.5px] font-black text-slate-400 group-hover:text-emerald-600 transition-colors">{b.val}</span>
                        <div className="w-full bg-slate-100 rounded-t h-full flex items-end">
                          <div 
                            style={{ height: b.h }} 
                            className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t transition-all group-hover:brightness-110 shadow-xs"
                          />
                        </div>
                        <span className="text-[8.5px] font-bold text-slate-500">{b.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 2 cols: Live Operational Stream */}
                <div className="sm:col-span-2 bg-white border border-slate-200/80 rounded-xl p-2.5 flex flex-col justify-between shadow-xs space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-0.5">
                    <Activity className="w-3 h-3 text-amber-500" />
                    Live Activity Stream
                  </div>

                  <div className="space-y-1.5 text-[9.5px]">
                    <div className="bg-amber-50/80 border border-amber-200/60 p-1.5 rounded-lg flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-600 shrink-0" />
                      <div className="leading-tight truncate">
                        <strong className="text-slate-900 block truncate text-[9.5px]">AI Exam Paper Generated</strong>
                        <span className="text-slate-500 text-[8.5px]">Class 10 CBSE • 45 MCQs</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50/80 border border-emerald-200/60 p-1.5 rounded-lg flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3 text-emerald-600 shrink-0" />
                      <div className="leading-tight truncate">
                        <strong className="text-slate-900 block truncate text-[9.5px]">Fee Paid via Parent App</strong>
                        <span className="text-slate-500 text-[8.5px]">₹14,500 • Receipt #8942</span>
                      </div>
                    </div>

                    <div className="bg-sky-50/80 border border-sky-200/60 p-1.5 rounded-lg flex items-center gap-1.5">
                      <Bus className="w-3 h-3 text-sky-600 shrink-0" />
                      <div className="leading-tight truncate">
                        <strong className="text-slate-900 block truncate text-[9.5px]">Bus 04 Live GPS Ping</strong>
                        <span className="text-slate-500 text-[8.5px]">Sector 14 Stop • On Time</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Quick Portals Bar */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                <span className="font-bold text-slate-500 text-[9.5px] uppercase tracking-wider hidden sm:inline">Explore Dedicated Portals:</span>
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
                  <a href={PORTAL_URLS.teacher} target="_blank" rel="noreferrer" className="bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 px-2 py-0.5 rounded font-bold transition-colors">
                    Teacher Desk ↗
                  </a>
                  <a href={PORTAL_URLS.accountant} target="_blank" rel="noreferrer" className="bg-slate-100 hover:bg-teal-100 text-slate-800 hover:text-teal-900 px-2 py-0.5 rounded font-bold transition-colors">
                    Fee Desk ↗
                  </a>
                  <a href={PORTAL_URLS.student} target="_blank" rel="noreferrer" className="bg-slate-100 hover:bg-indigo-100 text-slate-800 hover:text-indigo-900 px-2 py-0.5 rounded font-bold transition-colors">
                    Student Portal ↗
                  </a>
                  <a href={PORTAL_URLS.superAdmin} target="_blank" rel="noreferrer" className="bg-slate-100 hover:bg-purple-100 text-slate-800 hover:text-purple-900 px-2 py-0.5 rounded font-bold transition-colors">
                    SuperAdmin ↗
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Floating Mobile App Notification Card (Top-Right / Desktop) */}
          <div className="hidden lg:flex absolute -top-3 -right-3 lg:-top-4 lg:-right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] max-w-[210px] items-center gap-2.5 animate-bounce-slow">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-left text-[10px]">
              <div className="font-black text-slate-900 leading-tight">Parent Mobile App</div>
              <div className="text-emerald-600 font-bold text-[9px]">Live UPI Fee Alerts</div>
              <a 
                href="/apk/Student_Parents.apk" 
                download="Student_Parents.apk" 
                className="inline-flex items-center gap-1 text-[8.5px] font-black text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-slate-200"
              >
                <span>Download APK</span>
                <Download className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Floating Live Bus Radar Card (Overlapping Bottom-Left of Console / Desktop) */}
          <div className="hidden lg:flex absolute bottom-3 -left-3 lg:bottom-4 lg:-left-5 z-20 bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] max-w-[220px] items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
              <Bus className="w-4 h-4" />
            </div>
            <div className="text-left text-[10px]">
              <div className="font-black text-slate-900 leading-tight flex items-center gap-1">
                <span>Bus 04 • Live GPS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-amber-700 font-bold text-[9px]">Sector 14 • 42 km/h</div>
              <a 
                href="/apk/Driver.apk" 
                download="Driver.apk" 
                className="inline-flex items-center gap-1 text-[8.5px] font-black text-slate-600 hover:text-amber-800 bg-slate-100 hover:bg-amber-50 px-2 py-0.5 rounded mt-1 border border-slate-200"
              >
                <span>Driver APK</span>
                <Download className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Mobile Android APK Quick Downloads Grid (lg:hidden) */}
          <div className="grid grid-cols-3 gap-2 w-full mt-3 lg:hidden z-10">
            <a 
              href="/apk/Student_Parents.apk" 
              download="Student_Parents.apk" 
              className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-xs hover:bg-emerald-50"
            >
              <Smartphone className="w-4 h-4 text-emerald-600 mb-0.5" />
              <span className="text-[9px] font-black text-slate-800">Parent App</span>
              <span className="text-[8px] font-bold text-emerald-700 flex items-center gap-0.5">APK ⬇</span>
            </a>

            <a 
              href="/apk/Teacher.apk" 
              download="Teacher.apk" 
              className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-xs hover:bg-amber-50"
            >
              <GraduationCap className="w-4 h-4 text-amber-600 mb-0.5" />
              <span className="text-[9px] font-black text-slate-800">Teacher App</span>
              <span className="text-[8px] font-bold text-amber-700 flex items-center gap-0.5">APK ⬇</span>
            </a>

            <a 
              href="/apk/Driver.apk" 
              download="Driver.apk" 
              className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-xs hover:bg-sky-50"
            >
              <Bus className="w-4 h-4 text-sky-600 mb-0.5" />
              <span className="text-[9px] font-black text-slate-800">Driver GPS</span>
              <span className="text-[8px] font-bold text-sky-700 flex items-center gap-0.5">APK ⬇</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

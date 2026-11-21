import React from 'react';

export default function Features() {
  return (
    <section className="py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        
        {/* Core Title */}
        <div className="text-center mb-10 sm:mb-16 flex flex-col items-center px-2">
           <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[9.5px] sm:text-[11px] px-3.5 py-1 mb-3 rounded-full border border-emerald-200 shadow-xs">
             Enterprise Architecture
           </span>
           <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3 leading-tight">
             Not a prototype. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">A battle-tested ERP.</span>
           </h2>
           <p className="text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed text-xs sm:text-base">
             From multi-channel fee collection to biometric attendance orchestration — everything an institution or school chain needs is engineered for high reliability.
           </p>
        </div>

        {/* Feature 1: Web Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-28">
           <div className="order-2 lg:order-1">
             <span className="inline-block bg-amber-50 text-amber-800 font-black uppercase tracking-widest text-[10px] sm:text-xs px-3 py-1 rounded-full border border-amber-200 mb-3 sm:mb-4 shadow-xs">
               Platform Intelligence
             </span>
             <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-[1.15] tracking-tight mb-3 sm:mb-4">
               Six dashboard variants.<br/>Instant institutional control.
             </h3>
             <p className="text-slate-600 font-medium text-xs sm:text-base mb-5 sm:mb-6 leading-relaxed">
               Monitor total student cohorts, structural capacities, and revenue trajectories. Drill down into human resources, academic performances, and transportation logistics with a single centralized click.
             </p>
             <ul className="space-y-3 text-slate-800 font-bold text-xs sm:text-[14px]">
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs shadow-xs">✓</span> Real-time stat telemetry with trend indicators</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs shadow-xs">✓</span> Financial charts displaying daily, monthly &amp; term fee inflows</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs shadow-xs">✓</span> Complete RBAC enforcing per-role dashboard visibility</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs shadow-xs">✓</span> Micro-actions for daily attendance, marks &amp; admissions</li>
             </ul>
           </div>
           
           <div className="order-1 lg:order-2 relative w-full">
             <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col gap-3">
                 <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                       <span className="text-[10px] font-black text-slate-700 ml-2">ALL CORE SOLUTION • Analytics</span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">99.9% Cloud SLA</span>
                 </div>

                 {/* Visual Analytics Preview */}
                 <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3">
                       <span className="text-[9px] font-bold text-slate-500 uppercase">Term Fee Recovery</span>
                       <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">₹18,45,000</div>
                       <span className="text-[8.5px] font-black text-emerald-600">↑ 18.2% vs previous session</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3">
                       <span className="text-[9px] font-bold text-slate-500 uppercase">Student Attendance</span>
                       <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">98.4% Present</div>
                       <span className="text-[8.5px] font-black text-indigo-600">Synced with RFID &amp; Biometric</span>
                    </div>
                 </div>

                 {/* Smooth Analytics Trend Chart */}
                 <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200/60 rounded-xl p-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-2">
                       <span>Monthly Admissions &amp; Inflow Trajectory</span>
                       <span className="text-amber-600">Session 2026-27</span>
                    </div>
                    <div className="h-28 w-full flex items-end">
                       <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                          <defs>
                             <linearGradient id="gradFeat" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
                             </linearGradient>
                          </defs>
                          <path d="M0,100 L0,70 Q50,40 100,55 T200,30 T300,45 T400,15 L400,100 Z" fill="url(#gradFeat)" />
                          <path d="M0,70 Q50,40 100,55 T200,30 T300,45 T400,15" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                       </svg>
                    </div>
                 </div>
             </div>
           </div>
        </div>

        {/* Feature 2: Mobile Apps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
           <div className="relative w-full">
             <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex justify-center items-center gap-4 sm:gap-8 shadow-xl overflow-hidden">
                
                {/* Mobile Phone 1: Parent App */}
                <div className="w-36 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-lg p-3 flex flex-col gap-2 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                   <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="text-[9px] font-black text-slate-800">Parent Portal</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   </div>
                   <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-2 text-center">
                      <span className="text-[8px] font-bold text-emerald-800 block">Fee Receipt #8942</span>
                      <span className="text-xs font-black text-emerald-950">₹14,500 Paid</span>
                      <span className="text-[7.5px] text-emerald-700 block mt-0.5">UPI Instant Acknowledged</span>
                   </div>
                   <div className="bg-slate-50 rounded-lg p-2 text-[8px] font-medium text-slate-600 space-y-1">
                      <div className="flex justify-between"><span>Aarav Sharma</span><strong className="text-slate-800">Class 8-B</strong></div>
                      <div className="flex justify-between"><span>Attendance</span><strong className="text-emerald-600">Present (08:14)</strong></div>
                   </div>
                   <a href="/apk/Student_Parents.apk" download="Student_Parents.apk" className="w-full bg-emerald-600 text-white rounded-lg py-1.5 text-center text-[8.5px] font-black uppercase tracking-wider block">
                      Parent APK ⬇
                   </a>
                </div>
                
                {/* Mobile Phone 2: Driver GPS App */}
                <div className="w-36 sm:w-44 bg-slate-950 text-white border border-slate-800 rounded-2xl shadow-lg p-3 flex flex-col gap-2 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                   <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                      <span className="text-[9px] font-black text-amber-400">Driver Telemetry</span>
                      <span className="text-[8px] font-bold text-emerald-400">● LIVE GPS</span>
                   </div>
                   <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center">
                      <span className="text-[8px] font-bold text-slate-400 block">Bus #04 • Route B</span>
                      <span className="text-xs font-black text-white">42 km/h</span>
                      <span className="text-[7.5px] text-amber-400 block mt-0.5">Next: Sector 14 Gate</span>
                   </div>
                   <div className="bg-slate-900 rounded-lg p-2 text-[8px] font-medium text-slate-300 space-y-1">
                      <div className="flex justify-between"><span>Students Onboard</span><strong className="text-white">24 / 28</strong></div>
                      <div className="flex justify-between"><span>SOS Hotline</span><strong className="text-emerald-400">Ready</strong></div>
                   </div>
                   <a href="/apk/Driver.apk" download="Driver.apk" className="w-full bg-amber-400 text-slate-950 rounded-lg py-1.5 text-center text-[8.5px] font-black uppercase tracking-wider block">
                      Driver APK ⬇
                   </a>
                </div>
             </div>
           </div>

           <div>
             <span className="inline-block bg-amber-50 text-amber-800 font-black uppercase tracking-widest text-[10px] sm:text-xs px-3 py-1 rounded-full border border-amber-200 mb-3 sm:mb-4 shadow-xs">
               Mobile Ecosystem
             </span>
             <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-[1.15] tracking-tight mb-3 sm:mb-4">
               Parents, Staff, and Drivers.<br/>Triple-app synergy.
             </h3>
             <p className="text-slate-600 font-medium text-xs sm:text-base mb-5 sm:mb-6 leading-relaxed">
               Completely native mobile experience for high-speed execution on Android. Empower parents to pay fees from home. Empower teachers to mark attendance anywhere. Empower drivers to live-cast bus coordinates.
             </p>
             <ul className="space-y-3 text-slate-800 font-bold text-xs sm:text-[14px]">
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs shadow-xs">✓</span> Live CBT exam scores and digital report cards for parents</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs shadow-xs">✓</span> Staff Gradebook, lesson planners &amp; leave management</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs shadow-xs">✓</span> SOS triggers, live route telemetry &amp; passenger rosters for buses</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full text-xs shadow-xs">✓</span> Instant fee payment with zero manual receipt reconciliation</li>
             </ul>
           </div>
        </div>

      </section>
  );
}

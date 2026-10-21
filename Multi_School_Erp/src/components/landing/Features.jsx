import React from 'react';

export default function Features() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        
        {/* Core Title */}
        <div className="text-center mb-10 flex flex-col items-center">
           <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[9.5px] sm:text-[10px] px-3 py-1 border-[2px] border-gray-900 mb-3 shadow-[2px_2px_0_0_#111827]">
             Enterprise Architecture
           </span>
           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter mb-2 leading-tight">
             Not a prototype. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">A production-grade ERP.</span>
           </h2>
           <p className="text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed text-[13px] sm:text-sm">
             From multi-channel fee collection to biometric attendance orchestration — everything a sophisticated school chain needs is already built and battle-tested at scale.
           </p>
        </div>

        {/* Feature 1: Web Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-28">
           <div className="order-2 lg:order-1">
             <span className="inline-block bg-amber-100 text-amber-800 font-black uppercase tracking-widest text-[10px] px-3 py-1 border-[1.5px] border-gray-900 mb-5 shadow-[2px_2px_0_0_#111827]">
               Platform Intelligence
             </span>
             <h3 className="text-3xl sm:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight mb-5">
               Six dashboard variants.<br/>Instant control.
             </h3>
             <p className="text-gray-600 font-medium text-sm sm:text-[15px] mb-8 leading-relaxed">
               Monitor total student cohorts, structural capacities, and revenue trajectories. Drill down into human resources, academic performances, and transportation logistics with a single centralized click.
             </p>
             <ul className="space-y-4 text-gray-800 font-bold text-[13px] sm:text-[14px]">
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex items-center justify-center bg-[#09B48E] border border-gray-900 text-white rounded-full text-xs">✓</span> Real-time stat telemetry with trend indicators</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex items-center justify-center bg-[#09B48E] border border-gray-900 text-white rounded-full text-xs">✓</span> Financial charts displaying 15/30/90 day inflows</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex items-center justify-center bg-[#09B48E] border border-gray-900 text-white rounded-full text-xs">✓</span> Complete RBAC enforcing per-role dashboard visibility</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex items-center justify-center bg-[#09B48E] border border-gray-900 text-white rounded-full text-xs">✓</span> Micro-actions for daily heavy-lifting tasks</li>
             </ul>
           </div>
           
           <div className="order-1 lg:order-2 relative group w-full h-[320px] sm:h-[400px]">
             {/* Offset Shadow */}
             <div className="absolute inset-0 bg-gray-900 translate-x-3 translate-y-3 transition-transform group-hover:translate-x-5 group-hover:translate-y-5 rounded-sm" />
             {/* Main Graphic Box */}
             <div className="relative w-full h-full bg-slate-50 border-[3px] border-gray-900 flex flex-col pt-2 px-2 overflow-hidden bg-grid-pattern rounded-sm">
                 <div className="w-full h-4 border-b-[2px] border-gray-900 mb-2 flex items-center justify-end px-2 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-900" />
                    <div className="w-2 h-2 rounded-full bg-gray-900" />
                    <div className="w-2 h-2 rounded-full bg-gray-900" />
                 </div>
                 <div className="flex-1 flex gap-2 pb-2">
                    {/* Dummy Sidebar */}
                    <div className="w-1/4 h-full bg-gray-950 text-white p-2 border-[2px] border-gray-900 shadow-inner">
                       <div className="w-full h-1.5 bg-gray-700 mb-2" />
                       <div className="w-2/3 h-1.5 bg-gray-700 mb-2" />
                       <div className="w-1/2 h-1.5 bg-amber-500 mb-2" />
                       <div className="w-4/5 h-1.5 bg-emerald-500 mb-2" />
                       <div className="w-3/4 h-1.5 bg-gray-700 mt-6 mb-2" />
                    </div>
                    {/* Dummy Content */}
                    <div className="flex-1 h-full flex flex-col gap-2">
                       <div className="w-full h-1/4 grid grid-cols-2 gap-2">
                          <div className="bg-amber-100 border-[2px] border-gray-900 shadow-[2px_2px_0_0_#111827] group-hover:-translate-y-1 transition-transform" />
                          <div className="bg-emerald-100 border-[2px] border-gray-900 shadow-[2px_2px_0_0_#111827] group-hover:-translate-y-1 transition-transform delay-75" />
                       </div>
                       <div className="w-full flex-1 bg-white border-[2px] border-gray-900 p-2 flex flex-col justify-end shadow-[2px_2px_0_0_#111827] relative overflow-hidden group-hover:bg-slate-50 transition-colors">
                           <div className="absolute top-2 left-2 w-1/4 h-2 bg-gray-200" />
                           <div className="w-full h-1/2 bg-gray-50 border-t-[2px] border-gray-900 relative">
                               <div className="absolute inset-0 flex items-end">
                                 <svg className="w-full h-[80%] group-hover:scale-y-110 transition-transform origin-bottom" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0,100 L0,60 L20,70 L40,30 L60,80 L80,20 L100,40 L100,100 Z" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="2" />
                                 </svg>
                               </div>
                           </div>
                       </div>
                    </div>
                 </div>
             </div>
           </div>
        </div>

        {/* Feature 2: Mobile Apps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
           <div className="relative group w-full h-[360px] sm:h-[450px]">
             {/* Offset Shadow */}
             <div className="absolute inset-y-6 inset-x-4 lg:inset-x-6 bg-gray-900 -translate-x-3 translate-y-4 transition-transform group-hover:-translate-x-5 group-hover:translate-y-5 rounded-sm" />
             {/* Main Graphic Box */}
             <div className="relative w-full h-full bg-slate-100 border-[3px] border-gray-900 p-6 flex justify-center items-center gap-4 sm:gap-6 bg-grid-pattern overflow-hidden rounded-sm">
                
                {/* Mobile Phone 1 */}
                <div className="w-1/3 max-w-[140px] h-[85%] bg-white border-[3px] border-gray-900 rounded-[20px] shadow-[4px_4px_0_0_#111827] flex flex-col -translate-y-4 transform transition-transform group-hover:-translate-y-8 duration-500">
                   <div className="w-full h-8 sm:h-10 bg-amber-400 rounded-t-[16px] border-b-[3px] border-gray-900 flex justify-center pt-2.5">
                      <div className="w-4 h-[4px] bg-gray-900 rounded-full" />
                   </div>
                   <div className="flex-1 p-2 grid grid-cols-2 gap-2 mt-2">
                      <div className="w-full aspect-square bg-blue-100 border-[2px] border-gray-900 rounded-2xl relative overflow-hidden"><div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-200" /></div>
                      <div className="w-full aspect-square bg-pink-100 border-[2px] border-gray-900 rounded-2xl relative overflow-hidden"><div className="absolute inset-x-0 bottom-0 h-1/2 bg-pink-200" /></div>
                      <div className="w-full aspect-square bg-amber-100 border-[2px] border-gray-900 rounded-2xl relative overflow-hidden"><div className="absolute inset-x-0 bottom-0 h-1/2 bg-amber-200" /></div>
                      <div className="w-full aspect-square bg-emerald-100 border-[2px] border-gray-900 rounded-2xl relative overflow-hidden"><div className="absolute inset-x-0 bottom-0 h-1/2 bg-emerald-200" /></div>
                   </div>
                </div>
                
                {/* Mobile Phone 2 */}
                <div className="w-1/3 max-w-[140px] h-[85%] bg-white border-[3px] border-gray-900 rounded-[20px] shadow-[4px_4px_0_0_#111827] flex flex-col transform transition-transform group-hover:-translate-y-2 duration-500 delay-100">
                   <div className="w-full h-8 sm:h-10 bg-gray-900 rounded-t-[16px] border-b-[3px] border-gray-900 flex justify-center pt-2.5">
                      <div className="w-4 h-[4px] bg-gray-600 rounded-full" />
                   </div>
                   <div className="flex-1 p-2 flex flex-col justify-center items-center gap-4 mt-2 bg-slate-900 rounded-b-[16px]">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-[6px] border-emerald-400 rotate-45 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                      </div>
                      <div className="w-full h-8 bg-emerald-400 border-[2px] border-white flex items-center justify-center text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-950">
                        Start Trip
                      </div>
                   </div>
                </div>
             </div>
           </div>

           <div>
             <span className="inline-block bg-amber-100 text-amber-800 font-black uppercase tracking-widest text-[10px] px-3 py-1 border-[1.5px] border-gray-900 mb-5 shadow-[2px_2px_0_0_#111827]">
               Mobile Ecosystem
             </span>
             <h3 className="text-3xl sm:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight mb-5">
               Parents, Staff, and Drivers.<br/>Triple-app synergy.
             </h3>
             <p className="text-gray-600 font-medium text-sm sm:text-[15px] mb-8 leading-relaxed">
               Completely native Dart/Flutter codebase for high-fps execution on iOS and Android. Empower parents to pay fees from their couches. Empower teachers to mark biometric attendance. Empower drivers to live-cast bus coordinates.
             </p>
             <ul className="space-y-4 text-gray-800 font-bold text-[13px] sm:text-[14px]">
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex items-center justify-center bg-[#09B48E] border border-gray-900 text-white rounded-full text-xs">✓</span> Live CBT exam scores and digital report cards</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex items-center justify-center bg-[#09B48E] border border-gray-900 text-white rounded-full text-xs">✓</span> Staff Gradebook execution natively on mobile</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex items-center justify-center bg-[#09B48E] border border-gray-900 text-white rounded-full text-xs">✓</span> SOS triggers and live map routing for fleets</li>
               <li className="flex items-center gap-3"><span className="w-5 h-5 flex items-center justify-center bg-[#09B48E] border border-gray-900 text-white rounded-full text-xs">✓</span> Bi-directional instant chat messaging</li>
             </ul>
           </div>
        </div>

      </section>
  );
}

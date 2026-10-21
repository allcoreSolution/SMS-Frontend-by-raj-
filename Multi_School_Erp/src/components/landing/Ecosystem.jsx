import React from 'react';
import { useModal } from '../../context/ModalContext';
import { ExternalLink, Play, Radio, Sparkles } from 'lucide-react';

export default function Ecosystem() {
  const { openModal } = useModal();

  const apps = [
    { 
      title: 'Super Admin Control', 
      sub: 'SAAS PLATFORM • MULTI-TENANTS', 
      desc: 'Global SaaS control. Onboard schools, manage subscription plans, configure billing gateways, and oversee cross-tenant system metrics.', 
      icon: '👑', 
      tag: 'Port 5179 • SuperAdmin', 
      actionType: 'url',
      actionTarget: 'http://localhost:5179',
      btnText: 'Open SuperAdmin :5179 ↗'
    },
    { 
      title: 'School Admin & Staff ERP', 
      sub: 'REACT 18 • INSTITUTIONAL CORE', 
      desc: 'The complete administrative powerhouse. Covers Admissions, HR Staff Directory, Offline Exam Marksheets, Biometric Devices, and 30+ modules.', 
      icon: '🏫', 
      tag: 'Port 5176 • School_ERP', 
      actionType: 'url',
      actionTarget: 'http://localhost:5176',
      btnText: 'Open School ERP :5176 ↗'
    },
    { 
      title: 'Parent & Student App', 
      sub: 'FLUTTER NATIVE • 14 LANGUAGES', 
      desc: 'A seamless mobile bridge. Enables instant PG fee payments, live CBT exam results, realtime GPS bus tracking, and direct push interactions.', 
      icon: '👨‍👩‍👦', 
      tag: 'Port 5175 • Student Portal', 
      actionType: 'url',
      actionTarget: 'http://localhost:5175',
      btnText: 'Open Student App :5175 ↗'
    },
    { 
      title: 'Teacher & Staff App', 
      sub: 'DEDICATED TEACHER PORTAL', 
      desc: 'Empower educators with attendance marking, lesson planning, marks entry, online exam question banks, PTM scheduling, and teacher leave management.', 
      icon: '👩‍🏫', 
      tag: 'Port 5177 • Teache_Panel', 
      actionType: 'url',
      actionTarget: 'http://localhost:5177',
      btnText: 'Open Teacher Panel :5177 ↗'
    },
    { 
      title: 'Accountant & Finance Portal', 
      sub: 'FEE COLLECTION & LEDGERS', 
      desc: 'Specialized accounting desk for collecting fees, searching due dues, managing fee groups, income/expense vouchers, and daily day-book balance.', 
      icon: '💰', 
      tag: 'Port 5178 • Accountant', 
      actionType: 'url',
      actionTarget: 'http://localhost:5178',
      btnText: 'Open Accountant :5178 ↗'
    },
    { 
      title: 'Windows Biometric API', 
      sub: 'ZKTECO ADMS PROTOCOL', 
      desc: 'Standalone secure desktop executable bridging physical hardware directly with the cloud. Uninterrupted low-latency push synchronization.', 
      icon: '🔒', 
      tag: 'Hardware API :5050', 
      actionType: 'modal',
      actionTarget: 'hardware',
      btnText: 'Open Biometric Terminal ⚡'
    },
  ];

  const handleCardClick = (app) => {
    if (app.actionType === 'url') {
      window.open(app.actionTarget, '_blank', 'noreferrer');
    } else if (app.actionType === 'modal') {
      openModal(app.actionTarget);
    }
  };

  return (
    <section id="demo" className="py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white border-t-[3px] border-gray-900 min-h-[90vh] flex flex-col justify-center">
      <div className="max-w-[1400px] mx-auto w-full">
        
        {/* Header Block */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[11px] px-4 py-1.5 border-[2px] border-gray-900 mb-6 shadow-[3px_3px_0_0_#111827]">
            ✦ One Platform. Complete Solution
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-none">
            6 Specialized Portals. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">One Ecosystem.</span>
          </h2>
          <p className="text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Every role has its own dedicated portal running on a distinct local port. Click any card below to launch its real working interface immediately.
          </p>
        </div>

        {/* 3x2 Massive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-5 max-w-6xl mx-auto">
          {apps.map((app, i) => (
            <div 
              key={i} 
              onClick={() => handleCardClick(app)}
              className="relative group cursor-pointer block h-full select-none"
              title={`Click to open ${app.title}`}
            >
              <div className="absolute inset-0 bg-gray-900 translate-x-[3px] translate-y-[3px] transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 rounded-sm" />
              
              <div className="relative bg-white border-[2px] border-gray-900 p-4 sm:p-5 flex flex-col items-start hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all h-full rounded-sm">
                
                {/* Header Row: Icon + Tag */}
                <div className="flex justify-between items-start w-full mb-3">
                   <div className="bg-gray-50 border-[2px] border-gray-900 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-xl shadow-[1.5px_1.5px_0_0_#111827] group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out">
                     {app.icon}
                   </div>
                   <span className="bg-amber-100 text-amber-900 border-[1.5px] border-amber-900/50 font-black tracking-widest uppercase text-[8px] sm:text-[9px] px-2 py-0.5 shadow-[1px_1px_0_0_rgba(120,53,15,0.3)] mt-0.5">
                     {app.tag}
                   </span>
                </div>
                
                {/* Text Content */}
                <h3 className="text-base sm:text-[18px] font-black text-gray-900 mb-1 leading-tight tracking-tight group-hover:text-amber-600 transition-colors">
                  {app.title}
                </h3>
                <p className="font-black tracking-widest uppercase text-amber-500 text-[8px] sm:text-[8.5px] mb-2">
                  {app.sub}
                </p>
                <p className="text-gray-500 font-medium text-[11px] sm:text-[12px] leading-snug mb-5 flex-grow">
                  {app.desc}
                </p>
                
                {/* Footer Action */}
                <div className="mt-auto w-full pt-3 border-t-2 border-dashed border-gray-200">
                  <span className="text-gray-900 font-black uppercase tracking-wider text-[11px] flex items-center justify-between group-hover:text-amber-600 transition-colors">
                    <span>{app.btnText}</span>
                    <span className="text-xs font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner at Bottom */}
        <div className="mt-14 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 border-[2px] border-gray-900 p-4 sm:p-5 shadow-[4px_4px_0_0_#F59E0B]">
           <div className="flex items-center gap-3">
             <div className="bg-amber-400 border-[2px] border-gray-900 w-12 h-12 flex-shrink-0 flex items-center justify-center text-xl shadow-[2px_2px_0_0_#111827]">
               💡
             </div>
             <p className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">
               <span className="text-gray-900 font-black">All Dedicated Ports Running:</span> SuperAdmin is on <strong>5179</strong>, School ERP on <strong>5176</strong>, Teacher Panel on <strong>5177</strong>, Accountant on <strong>5178</strong>, Student on <strong>5175</strong>, and Branch Admin on <strong>5174</strong>.
             </p>
           </div>
           
           <button
             onClick={() => openModal('portals')}
             className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 text-white font-black text-xs uppercase tracking-wider border border-gray-900 hover:bg-amber-400 hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer"
           >
             Launch Demo Hub ⚡
           </button>
        </div>

      </div>
    </section>
  );
}

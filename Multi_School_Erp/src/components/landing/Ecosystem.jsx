import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
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
      tag: 'Multi-Tenant • SuperAdmin', 
      actionType: 'url',
      actionTarget: PORTAL_URLS.superAdmin,
      btnText: 'Open SuperAdmin ↗'
    },
    { 
      title: 'School Admin & Staff ERP', 
      sub: 'REACT 18 • INSTITUTIONAL CORE', 
      desc: 'The complete administrative powerhouse. Covers Admissions, HR Staff Directory, Offline Exam Marksheets, Biometric Devices, and 30+ modules.', 
      icon: '🏫', 
      tag: 'Core ERP • School Admin', 
      actionType: 'url',
      actionTarget: PORTAL_URLS.admin,
      btnText: 'Open School ERP ↗'
    },
    { 
      title: 'Parent & Student Portal', 
      sub: 'REACT 18 • LIVE WEB & MOBILE', 
      desc: 'A seamless portal for students & parents. Enables instant online fee payments, live CBT exam results, realtime GPS bus tracking, and direct push interactions.', 
      icon: '👨‍👩‍👦', 
      tag: 'Web & Android • Student Portal', 
      actionType: 'url',
      actionTarget: PORTAL_URLS.student,
      btnText: 'Open Student Portal ↗'
    },
    { 
      title: 'Teacher & Staff Portal', 
      sub: 'REACT 18 • EDUCATORS HUB', 
      desc: 'Empower educators with attendance marking, lesson planning, marks entry, online exam question banks, PTM scheduling, and teacher leave management.', 
      icon: '👩‍🏫', 
      tag: 'Faculty Portal • Teacher Panel', 
      actionType: 'url',
      actionTarget: PORTAL_URLS.teacher,
      btnText: 'Open Teacher Portal ↗'
    },
    { 
      title: 'Accountant & Fee Desk', 
      sub: 'REACT 18 • FINANCE DESK', 
      desc: 'Specialized accounting web portal for collecting fees, searching due dues, managing fee groups, income/expense vouchers, and daily day-book balance.', 
      icon: '💰', 
      tag: 'Finance Hub • Accountant', 
      actionType: 'url',
      actionTarget: PORTAL_URLS.accountant,
      btnText: 'Open Accountant Panel ↗'
    },
    { 
      title: 'Windows Biometric API', 
      sub: 'ZKTECO ADMS PROTOCOL', 
      desc: 'Standalone secure desktop executable bridging physical hardware directly with the cloud. Uninterrupted low-latency push synchronization.', 
      icon: '🔒', 
      tag: 'Hardware API • Live Sync', 
      actionType: 'modal',
      actionTarget: 'hardware',
      btnText: 'Open Biometric Terminal ⚡'
    },
  ];

  const handleCardClick = (app) => {
    if (app.actionType === 'download') {
      const link = document.createElement('a');
      link.href = app.actionTarget;
      link.download = app.actionTarget.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (app.actionType === 'url') {
      window.open(app.actionTarget, '_blank', 'noreferrer');
    } else if (app.actionType === 'modal') {
      openModal(app.actionTarget);
    }
  };

  return (
    <section id="demo" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10 bg-white border-t border-slate-200 flex flex-col justify-center">
      <div className="max-w-[1400px] mx-auto w-full">
        
        {/* Header Block */}
        <div className="text-center mb-6 sm:mb-10 flex flex-col items-center px-2">
          <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[9px] sm:text-[10px] px-3 py-0.5 mb-2 rounded-full border border-emerald-200 shadow-xs">
            ✦ Unified Multi-Panel Cloud Architecture
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3 leading-tight">
            6 Specialized Portals. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">One Seamless Ecosystem.</span>
          </h2>
          <p className="text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed text-xs sm:text-sm">
            Every role has its own dedicated portal running with isolated security. Click any card below to launch its real working interface immediately.
          </p>
        </div>

        {/* 3x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-6xl mx-auto">
          {apps.map((app, i) => (
            <div 
              key={i} 
              onClick={() => handleCardClick(app)}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col items-start shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 group cursor-pointer select-none text-left h-full"
              title={`Click to open ${app.title}`}
            >
              {/* Header Row: Icon + Tag */}
              <div className="flex justify-between items-start w-full mb-3 gap-2">
                 <div className="bg-slate-50 border border-slate-100 rounded-xl w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all duration-300 flex-shrink-0">
                   {app.icon}
                 </div>
                 <span className="bg-amber-50 text-amber-900 border border-amber-200/60 font-black tracking-widest uppercase text-[9px] px-2.5 py-0.5 rounded-full shadow-xs mt-0.5 truncate">
                   {app.tag}
                 </span>
              </div>
              
              {/* Text Content */}
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-0.5 leading-tight tracking-tight group-hover:text-amber-600 transition-colors">
                {app.title}
              </h3>
              <p className="font-black tracking-widest uppercase text-amber-600 text-[9px] mb-2">
                {app.sub}
              </p>
              <p className="text-slate-500 font-medium text-xs sm:text-[13px] leading-relaxed mb-4 flex-grow">
                {app.desc}
              </p>
              
              {/* Footer Action */}
              <div className="mt-auto w-full pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-900 font-black uppercase tracking-wider text-[11px] group-hover:text-amber-600 transition-colors flex items-center justify-between w-full">
                  <span className="truncate">{app.btnText}</span>
                  <span className="text-xs font-bold group-hover:translate-x-1 transition-transform ml-1">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner at Bottom */}
        <div className="mt-8 sm:mt-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3.5 bg-slate-950 text-white rounded-xl p-4 border border-slate-800 shadow-lg">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex-shrink-0 flex items-center justify-center text-lg font-black shadow-md">
               ⚡
             </div>
             <p className="text-xs font-medium text-slate-300 leading-snug">
               <strong className="text-white font-black block text-xs sm:text-sm mb-0.5">All 8 Portals &amp; Apps Pre-Connected:</strong>
               SuperAdmin SaaS, School Admin ERP, Teacher Panel, Accountant Panel, and Student &amp; Parent Portal, plus dedicated <strong>Android APKs</strong> for Teachers, Parents, and Drivers.
             </p>
           </div>
           
           <button
             onClick={() => openModal('portals')}
             className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-amber-500/20 whitespace-nowrap cursor-pointer shrink-0"
           >
             Launch Demo Hub ⚡
           </button>
        </div>

      </div>
    </section>
  );
}

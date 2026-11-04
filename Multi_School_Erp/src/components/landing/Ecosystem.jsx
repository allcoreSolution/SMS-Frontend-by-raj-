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
      title: 'Parent & Student App', 
      sub: 'ANDROID • APK DOWNLOAD', 
      desc: 'A seamless mobile bridge. Enables instant PG fee payments, live CBT exam results, realtime GPS bus tracking, and direct push interactions.', 
      icon: '👨‍👩‍👦', 
      tag: 'Android APK • v1.0.1', 
      actionType: 'download',
      actionTarget: '/apk/Student_Parents.apk',
      btnText: 'Download Student APK ⬇'
    },
    { 
      title: 'Teacher & Staff App', 
      sub: 'ANDROID • APK DOWNLOAD', 
      desc: 'Empower educators with attendance marking, lesson planning, marks entry, online exam question banks, PTM scheduling, and teacher leave management.', 
      icon: '👩‍🏫', 
      tag: 'Android APK • Teacher App', 
      actionType: 'download',
      actionTarget: '/apk/Teacher.apk',
      btnText: 'Download Teacher APK ⬇'
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
    <section id="demo" className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white border-t-[3px] border-gray-900 min-h-[90vh] flex flex-col justify-center">
      <div className="max-w-[1400px] mx-auto w-full">
        
        {/* Header Block */}
        <div className="text-center mb-10 sm:mb-16 flex flex-col items-center px-2">
          <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[9.5px] sm:text-[11px] px-3 sm:px-4 py-1 sm:py-1.5 border-[2px] border-gray-900 mb-4 sm:mb-6 shadow-[2px_2px_0_0_#111827]">
            ✦ One Platform. Complete Solution
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter mb-3 sm:mb-4 leading-tight">
            6 Specialized Portals. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">One Ecosystem.</span>
          </h2>
          <p className="text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed text-xs sm:text-base">
            Every role has its own dedicated portal running on a distinct local port. Click any card below to launch its real working interface immediately.
          </p>
        </div>

        {/* 3x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-5 max-w-6xl mx-auto">
          {apps.map((app, i) => (
            <div 
              key={i} 
              onClick={() => handleCardClick(app)}
              className="relative group cursor-pointer block h-full select-none"
              title={`Click to open ${app.title}`}
            >
              <div className="absolute inset-0 bg-gray-900 translate-x-[2px] sm:translate-x-[3px] translate-y-[2px] sm:translate-y-[3px] transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 rounded-sm" />
              
              <div className="relative bg-white border-[2px] border-gray-900 p-3.5 sm:p-5 flex flex-col items-start hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all h-full rounded-sm">
                
                {/* Header Row: Icon + Tag */}
                <div className="flex justify-between items-start w-full mb-2.5 sm:mb-3 gap-2">
                   <div className="bg-gray-50 border-[2px] border-gray-900 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl shadow-[1.5px_1.5px_0_0_#111827] group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out flex-shrink-0">
                     {app.icon}
                   </div>
                   <span className="bg-amber-100 text-amber-900 border-[1.5px] border-amber-900/50 font-black tracking-widest uppercase text-[8px] sm:text-[9px] px-2 py-0.5 shadow-[1px_1px_0_0_rgba(120,53,15,0.3)] mt-0.5 truncate">
                     {app.tag}
                   </span>
                </div>
                
                {/* Text Content */}
                <h3 className="text-sm sm:text-[18px] font-black text-gray-900 mb-1 leading-tight tracking-tight group-hover:text-amber-600 transition-colors">
                  {app.title}
                </h3>
                <p className="font-black tracking-widest uppercase text-amber-500 text-[8px] sm:text-[8.5px] mb-1.5 sm:mb-2">
                  {app.sub}
                </p>
                <p className="text-gray-500 font-medium text-[11px] sm:text-[12px] leading-snug mb-3.5 sm:mb-5 flex-grow">
                  {app.desc}
                </p>
                
                {/* Footer Action */}
                <div className="mt-auto w-full pt-2.5 sm:pt-3 border-t-2 border-dashed border-gray-200">
                  <span className="text-gray-900 font-black uppercase tracking-wider text-[10px] sm:text-[11px] flex items-center justify-between group-hover:text-amber-600 transition-colors">
                    <span className="truncate">{app.btnText}</span>
                    <span className="text-xs font-bold group-hover:translate-x-1 transition-transform ml-1">→</span>
                  </span>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Info Banner at Bottom */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-gray-50 border-[2px] border-gray-900 p-3.5 sm:p-5 shadow-[3px_3px_0_0_#F59E0B]">
           <div className="flex items-center gap-2.5 sm:gap-3">
             <div className="bg-amber-400 border-[2px] border-gray-900 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center text-lg sm:text-xl shadow-[2px_2px_0_0_#111827]">
               💡
             </div>
             <p className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">
               <span className="text-gray-900 font-black">All Portals & Apps Ready:</span> SuperAdmin SaaS, School Admin ERP, Teacher Panel, Accountant Panel, Student & Parent Portal, Driver App, and Branch Admin Network, plus dedicated <strong>Android APKs</strong> for Teachers, Parents, and Drivers.
             </p>
           </div>
           
           <button
             onClick={() => openModal('portals')}
             className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gray-900 text-white font-black text-xs uppercase tracking-wider border border-gray-900 hover:bg-amber-400 hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer"
           >
             Launch Demo Hub ⚡
           </button>
        </div>

      </div>
    </section>
  );
}

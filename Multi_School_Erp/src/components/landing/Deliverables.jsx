import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { useModal } from '../../context/ModalContext';

export default function Deliverables() {
  const { openModal } = useModal();

  const items = [
    { 
      title: 'Super Admin SaaS Platform', 
      sub: 'REACT 18 • PORT 5179', 
      desc: 'Centralized mega-dashboard to onboard unlimited schools, manage platform licenses, track global analytics, and handle super-admin communications.', 
      icon: '👑',
      target: PORTAL_URLS.superAdmin
    },
    { 
      title: 'School ERP Web Panel', 
      sub: 'REACT 18 • PORT 5176', 
      desc: 'The core administrative portal assigned to each school tenant. Manages HR, Academics, Admissions, and 30+ sophisticated sub-modules out of the box.', 
      icon: '🏫',
      target: PORTAL_URLS.admin
    },
    { 
      title: 'Staff & Teacher App (Android APK)', 
      sub: 'ANDROID • APK DOWNLOAD', 
      desc: 'Native Android mobile application for staff & teachers. Enables student attendance, mark entry, leave approvals, lesson planning, and direct mobile workflow.', 
      icon: '👩‍🏫',
      target: '/apk/Teacher.apk',
      isDownload: true
    },
    { 
      title: 'Accountant & Fee Panel', 
      sub: 'REACT 18 • PORT 5178', 
      desc: 'Specialized financial web portal for collecting fees, search due fees, fee group allocations, voucher day-books, and income/expense ledgers.', 
      icon: '💰',
      target: PORTAL_URLS.accountant,
      isDownload: false
    },
    { 
      title: 'Student & Parent App & Web', 
      sub: 'PORT 5175 • ANDROID APK', 
      desc: 'Native Android mobile application and web portal for parents & students. Instant fee payments, live CBT exam results, and attendance records in Hindi and English.', 
      icon: '📱',
      target: '/apk/Student_Parents.apk',
      isDownload: true
    },
    { 
      title: 'Dedicated Driver App (Android APK)', 
      sub: 'ANDROID • APK DOWNLOAD', 
      desc: 'GPS-enabled native Android APK to livestream bus locations to parents, manage student pickup roster, log fuel expenses, and broadcast emergency SOS alerts.', 
      icon: '🚌',
      target: '/apk/Driver.apk',
      isDownload: true
    },
    { 
      title: 'Centralized API Gateway', 
      sub: 'NODE.JS • PORT 5050', 
      desc: 'The core monolithic engine powering the entire ecosystem. Secured by JWT, advanced middleware, and RBAC tokenization. Engineered for heavy loads.', 
      icon: '⚙️',
      modal: 'hardware'
    },
    { 
      title: 'Full Commercial License', 
      sub: '100% OPEN SOURCE', 
      desc: 'Unencrypted access to all repositories. No IonCube, no hidden API callbacks, no domain locks. White-label and sell it completely as your own software property.', 
      icon: '📑',
      modal: 'doc',
      docTab: 'license'
    },
  ];

  const handleCardClick = (item) => {
    if (item.isDownload) {
      const link = document.createElement('a');
      link.href = item.target;
      link.download = item.target.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (item.target) {
      window.open(item.target, '_blank', 'noreferrer');
    } else if (item.modal) {
      openModal(item.modal, item.docTab ? { docTab: item.docTab } : null);
    }
  };

  return (
    <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto border-t-[3px] border-gray-900 bg-[#FBFBFB]">
      
      {/* Top Tech Stack Banner */}
      <div className="w-full mb-10 sm:mb-16">
        <div className="flex flex-wrap sm:flex-nowrap justify-center items-center bg-gray-950 text-white px-3 sm:px-6 py-2.5 sm:py-3 font-black uppercase text-[9px] sm:text-[11px] tracking-widest gap-2.5 sm:gap-8 rounded shadow-[3px_3px_0_0_#111827] text-center">
          <span className="flex items-center gap-1.5 text-cyan-400">✓ 100% Unencrypted Source</span>
          <span className="flex items-center gap-1.5 text-emerald-400">✓ Perpetual Commercial License</span>
          <span className="flex items-center gap-1.5 text-amber-400">✓ Deploy Anywhere</span>
        </div>
      </div>

      <div className="mb-10 sm:mb-14 text-center mx-auto flex flex-col items-center max-w-4xl px-2">
         <span className="inline-block bg-white text-gray-900 font-black uppercase tracking-widest text-[9.5px] sm:text-[11px] px-3 sm:px-4 py-1 sm:py-1.5 border-[2px] border-gray-900 mb-4 sm:mb-6 shadow-[2px_2px_0_0_#111827]">
           Complete Architectural Package
         </span>
         <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.15] mb-3 sm:mb-6">
           One payment. <span className="text-amber-500 underline decoration-gray-900 decoration-[3px] sm:decoration-[4px]">Eight deliverables.</span>
         </h2>
         <p className="text-xs sm:text-base text-gray-600 font-bold leading-relaxed max-w-2xl px-2">
           We don't lock core features behind recurring SaaS taxes. You receive the complete frontend, backend, and all dedicated role panels. Click any deliverable below to inspect its live screen.
         </p>
      </div>

      {/* Luxury 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-4 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <div 
            key={i} 
            onClick={() => handleCardClick(item)}
            className="relative group cursor-pointer select-none"
            title={`Click to open ${item.title}`}
          >
            <div className="absolute inset-0 bg-gray-900 translate-x-[2px] sm:translate-x-[3px] translate-y-[2px] sm:translate-y-[3px] transition-transform group-hover:translate-x-[3px] group-hover:translate-y-[3px] rounded-sm" />
            
            <div className="relative border-[2px] border-gray-900 p-3 sm:p-4 flex flex-row items-start gap-3 sm:gap-4 bg-white hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all h-full rounded-sm text-left">
              
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 border-[2px] border-gray-900 flex items-center justify-center text-xl sm:text-2xl shadow-[2px_2px_0_0_#111827] transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] mt-0.5">
                {item.icon}
              </div>
              
              <div className="flex flex-col flex-1 min-w-0 pl-2.5 sm:pl-3 border-l-2 border-gray-100 border-dashed">
                 <div className="flex items-center justify-between gap-1">
                   <p className="font-black tracking-widest uppercase text-amber-500 text-[8px] sm:text-[9px] mb-0.5 truncate">
                     {item.sub}
                   </p>
                   <span className="text-[9px] sm:text-[10px] text-gray-500 group-hover:text-amber-600 font-bold whitespace-nowrap flex-shrink-0">{item.isDownload ? 'Download ⬇' : 'Launch ➜'}</span>
                 </div>
                 <h3 className="font-black text-gray-900 leading-tight mb-1 text-[13px] sm:text-[16px] group-hover:text-amber-600 transition-colors">
                   {item.title}
                 </h3>
                 <p className="text-gray-500 font-medium text-[10px] sm:text-[11px] leading-snug">
                   {item.desc}
                 </p>
              </div>
              
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}

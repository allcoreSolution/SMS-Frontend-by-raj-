import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { useModal } from '../../context/ModalContext';

export default function Deliverables() {
  const { openModal } = useModal();

  const items = [
    { 
      title: 'Super Admin SaaS Platform', 
      sub: 'REACT 18 • SAAS PLATFORM', 
      desc: 'Centralized mega-dashboard to onboard unlimited schools, manage platform licenses, track global analytics, and handle super-admin communications.', 
      icon: '👑',
      target: PORTAL_URLS.superAdmin
    },
    { 
      title: 'School ERP Web Panel', 
      sub: 'REACT 18 • INSTITUTIONAL CORE', 
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
      sub: 'REACT 18 • FINANCE & FEE DESK', 
      desc: 'Specialized financial web portal for collecting fees, search due fees, fee group allocations, voucher day-books, and income/expense ledgers.', 
      icon: '💰',
      target: PORTAL_URLS.accountant,
      isDownload: false
    },
    { 
      title: 'Student & Parent App & Web', 
      sub: 'STUDENT PORTAL • ANDROID APK', 
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
      sub: 'NODE.JS • CLOUD API ENGINE', 
      desc: 'The core monolithic engine powering the entire ecosystem. Secured by JWT, advanced middleware, and RBAC tokenization. Engineered for heavy loads.', 
      icon: '⚙️',
      modal: 'hardware'
    },
    { 
      title: 'High-Availability Cloud Hosting & SLA', 
      sub: '99.9% UPTIME • DEDICATED CLOUD', 
      desc: 'Enterprise-grade cloud infrastructure with automatic daily backups, SSL security, fast CDN assets, and zero hardware maintenance requirements.', 
      icon: '☁️',
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
    <section className="py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto border-t border-slate-200 bg-slate-50/50">
      
      {/* Top Tech Stack Banner */}
      <div className="w-full mb-6 sm:mb-8">
        <div className="flex flex-wrap sm:flex-nowrap justify-center items-center bg-slate-900 text-white px-4 sm:px-6 py-2.5 font-bold uppercase text-[9.5px] sm:text-[11px] tracking-wider gap-3 sm:gap-8 rounded-xl shadow-md text-center max-w-3xl mx-auto border border-slate-800">
          <span className="flex items-center gap-1.5 text-cyan-400">✓ 99.9% Cloud Uptime SLA</span>
          <span className="flex items-center gap-1.5 text-emerald-400">✓ Zero Server Hardware Cost</span>
          <span className="flex items-center gap-1.5 text-amber-400">✓ Dedicated 24/7 School Support</span>
        </div>
      </div>

      <div className="mb-6 sm:mb-10 text-center mx-auto flex flex-col items-center max-w-3xl px-2">
         <span className="inline-block bg-amber-50 text-amber-800 font-black uppercase tracking-widest text-[9.5px] sm:text-[11px] px-3 py-0.5 mb-2 rounded-full border border-amber-200 shadow-xs">
           Complete Institutional Package
         </span>
         <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2 sm:mb-3">
           One complete platform. <span className="text-amber-500">Eight connected portals &amp; apps.</span>
         </h2>
         <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl px-2">
           No separate subscriptions for apps, SMS, or hardware sync. Every school tenant gets full access to all web portals, mobile apps, and biometric integration. Click any deliverable below to inspect its live screen.
         </p>
      </div>

      {/* Luxury 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <div 
            key={i} 
            onClick={() => handleCardClick(item)}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-row items-start gap-4 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 group cursor-pointer select-none text-left"
            title={`Click to open ${item.title}`}
          >
            <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl sm:text-2xl shadow-xs group-hover:scale-105 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all duration-300">
              {item.icon}
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
               <div className="flex items-center justify-between gap-2 mb-1">
                 <span className="font-black tracking-widest uppercase text-amber-600 bg-amber-50 text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md border border-amber-200/50 truncate">
                   {item.sub}
                 </span>
                 <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 group-hover:text-amber-600 bg-slate-100 group-hover:bg-amber-100/70 px-2.5 py-0.5 rounded-full transition-colors whitespace-nowrap">
                   {item.isDownload ? 'Download ⬇' : 'Launch ➜'}
                 </span>
               </div>
               <h3 className="font-black text-slate-900 leading-snug mb-1 text-sm sm:text-base group-hover:text-amber-600 transition-colors">
                 {item.title}
               </h3>
               <p className="text-slate-500 font-medium text-xs sm:text-[13px] leading-relaxed">
                 {item.desc}
               </p>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}

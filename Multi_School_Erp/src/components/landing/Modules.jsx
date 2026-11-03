import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { useModal } from '../../context/ModalContext';
import { ExternalLink } from 'lucide-react';

export default function Modules() {
  const { openModal } = useModal();

  const modules = [
    { title: 'Student Information', label: 'CORE', type: 'core', icon: '👤', url: PORTAL_URLS.admin },
    { title: 'Academics', label: 'CORE', type: 'core', icon: '📚', url: PORTAL_URLS.admin },
    { title: 'Fees Collection', label: 'CORE', type: 'core', icon: '💰', url: `${PORTAL_URLS.accountant}/collect-fees` },
    { title: 'Human Resource', label: 'CORE', type: 'core', icon: '👥', url: `${PORTAL_URLS.admin}/hr/staff-directory` },
    { title: 'Offline Exams / Marks Entry', label: 'CORE', type: 'core', icon: '📝', url: `${PORTAL_URLS.teacher}/enter-marks` },
    { title: 'Certificates', label: 'CORE', type: 'core', icon: '📜', url: PORTAL_URLS.admin },
    { title: 'ID Card Designer', label: 'CORE', type: 'core', icon: '🪪', url: PORTAL_URLS.admin },
    
    { title: 'CCTV Live View', label: 'NEW', type: 'new', icon: '📹', modal: 'hardware' },
    { title: 'Parent–Teacher Chat', label: 'NEW', type: 'new', icon: '💬', url: `${PORTAL_URLS.student}/whatsapp` },
    { title: 'Surveys & Feedback', label: 'NEW', type: 'new', icon: '📊', url: `${PORTAL_URLS.student}/notice-board` },
    { title: 'Engagement & Creatives', label: 'NEW', type: 'new', icon: '🎨', url: `${PORTAL_URLS.branch}/templates` },
    { title: 'Compliance & Governance', label: 'NEW', type: 'new', icon: '🛡️', url: `${PORTAL_URLS.branch}/reports/login-logs` },
    { title: 'Online Exams Pro (CBT)', label: 'NEW', type: 'new', icon: '💻', url: `${PORTAL_URLS.student}/online-exams` },
    { title: 'Admission CRM', label: 'NEW', type: 'new', icon: '🎯', url: PORTAL_URLS.admin },
    { title: 'School Website Builder', label: 'NEW', type: 'new', icon: '🌐', url: `${PORTAL_URLS.branch}/templates` },
    { title: 'Live Classes', label: 'NEW', type: 'new', icon: '🎥', url: `${PORTAL_URLS.student}/live-classes` },
    { title: 'Biometric 2-Way Sync', label: 'NEW', type: 'new', icon: '🖐️', modal: 'hardware' },
    
    { title: 'Homework & Classwork', type: 'standard', icon: '✏️', url: `${PORTAL_URLS.teacher}/classwork` },
    { title: 'Library Management', type: 'standard', icon: '📖', url: `${PORTAL_URLS.student}/library` },
    { title: 'Transport', type: 'standard', icon: '🚌', url: `${PORTAL_URLS.student}/transport` },
    { title: 'Hostel', type: 'standard', icon: '🏠', url: `${PORTAL_URLS.student}/hostel` },
    { title: 'Inventory', type: 'standard', icon: '📦', url: `${PORTAL_URLS.accountant}/accounts/expense` },
    { title: 'Asset Management', type: 'standard', icon: '🖨️', url: `${PORTAL_URLS.accountant}/accounts/expense` },
    { title: 'AI Assistant', type: 'standard', icon: '🤖', url: `${PORTAL_URLS.student}/ai-assistant` },
    { title: 'Knowledge Base', type: 'standard', icon: '🧠', url: `${PORTAL_URLS.student}/study-center` },
    { title: 'Study Center', type: 'standard', icon: '🎓', url: `${PORTAL_URLS.student}/study-center` },
    { title: 'Accounts & Finance', type: 'standard', icon: '📈', url: `${PORTAL_URLS.accountant}/accounts/dashboard` },
    { title: 'Front Office', type: 'standard', icon: '🏦', url: PORTAL_URLS.admin },
    { title: 'Communications', type: 'standard', icon: '📧', url: `${PORTAL_URLS.student}/sms` },
    { title: 'Teacher Leave Management', type: 'standard', icon: '📋', url: `${PORTAL_URLS.teacher}/leave` },
    { title: 'Health Records', type: 'standard', icon: '🩺', url: `${PORTAL_URLS.student}/health-records` },
    { title: 'Apps Center', type: 'standard', icon: '📱', modal: 'portals' },
    { title: 'Parent-Teacher Meetings', type: 'standard', icon: '🤝', url: `${PORTAL_URLS.teacher}/ptm` },
    { title: 'Lesson Planner', type: 'standard', icon: '📐', url: `${PORTAL_URLS.teacher}/lesson-planner` },
    { title: 'Digital Evaluation', type: 'standard', icon: '✅', url: `${PORTAL_URLS.teacher}/online-exams` },
    { title: 'QR Code Attendance', type: 'standard', icon: '📲', url: `${PORTAL_URLS.teacher}/student-attendance` },
    { title: 'Assessment & Marks', type: 'standard', icon: '📊', url: `${PORTAL_URLS.teacher}/enter-marks` }
  ];

  const handleModuleClick = (mod) => {
    if (mod.url) {
      window.open(mod.url, '_blank', 'noreferrer');
    } else if (mod.modal) {
      openModal(mod.modal);
    }
  };

  return (
    <section className="py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 w-full border-t-[3px] border-gray-900 overflow-hidden bg-white/50 bg-grid-pattern relative">
      
      {/* Clean Header Block */}
      <div className="relative z-10 text-center mb-6 sm:mb-8 flex flex-col items-center max-w-4xl mx-auto py-2 sm:py-4 px-2 sm:px-8">
        <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[7.5px] sm:text-[9px] px-2.5 py-1 mb-2 rounded-full shadow-sm">
          38 COMPREHENSIVE MODULES • CLICK ANY TO OPEN
        </span>
        <h2 className="text-xl sm:text-3xl font-black text-gray-900 leading-[1.15] tracking-tighter mb-1.5">
          Every module a school needs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">All live & clickable.</span>
        </h2>
        <p className="text-gray-600 font-bold leading-relaxed text-[11px] sm:text-[13px] max-w-2xl mx-auto">
          Every tile below is interconnected with the local running portals (:5176 School Admin ERP, :5177 Teacher Panel, :5178 Accountant Panel, :5175 Student/Parent, :5174 Branch Admin, :5050 Backend). Click any module to test its real live screen.
        </p>
      </div>

      {/* 38 Module Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4 mb-14 sm:mb-20 max-w-[1400px] mx-auto">
        {modules.map((mod, i) => {
          
          let cardTheme = "bg-white border border-gray-200 shadow-sm";
          let labelTheme = "";

          if (mod.type === 'core') {
            cardTheme = "bg-[#F3FFFC] border border-[#09B48E]/40 shadow-sm";
            labelTheme = "bg-[#09B48E] text-white";
          } else if (mod.type === 'new') {
            cardTheme = "bg-[#FFFBF0] border border-amber-500/40 shadow-sm";
            labelTheme = "bg-amber-500 text-white";
          }

          return (
            <div 
              key={i} 
              onClick={() => handleModuleClick(mod)}
              className="relative group cursor-pointer block h-full select-none"
              title={`Click to launch ${mod.title} live demo`}
            >
              {/* Horizontal Pill Card */}
              <div 
                className={`relative p-2.5 sm:p-3 px-3 sm:px-4 rounded-xl transition-all h-full flex items-center justify-between gap-2.5 hover:-translate-y-1 hover:shadow-md hover:border-gray-900 ${cardTheme}`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                   <div className="text-xl sm:text-2xl rounded-md group-hover:rotate-[360deg] transition-transform duration-700 ease-in-out flex-shrink-0">
                     {mod.icon}
                   </div>
                   <h3 className="font-bold text-gray-900 text-[11.5px] sm:text-[13px] leading-tight tracking-tight flex-1 truncate group-hover:text-amber-600">
                     {mod.title}
                   </h3>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {mod.label && (
                     <span className={`font-bold uppercase tracking-widest text-[7.5px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap ${labelTheme}`}>
                       {mod.label}
                     </span>
                  )}
                  <span className="text-[10px] text-gray-400 group-hover:text-amber-600 transition-colors">↗</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Sub-Features Banner */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white border border-gray-200 rounded-2xl p-3.5 sm:p-5 shadow-sm">
         <div className="flex items-center gap-2.5 sm:gap-3">
           <div className="bg-emerald-50 rounded-full w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center text-base sm:text-xl text-emerald-500">
             ⚡
           </div>
           <p className="text-xs sm:text-[13px] font-[500] text-gray-600 leading-snug">
             <span className="text-gray-900 font-bold uppercase tracking-wide">Intrinsic Utilities included:</span> Gate Pass authorizations, Campus Worker Registries, Dynamic Exam Datesheet Engines, and complete White-label Tenant branding.
           </p>
         </div>

         <button
           onClick={() => openModal('portals')}
           className="w-full sm:w-auto px-4 py-2 bg-gray-900 text-white font-black text-xs uppercase tracking-wider rounded-lg hover:bg-amber-500 hover:text-gray-900 transition-colors whitespace-nowrap cursor-pointer text-center"
         >
           Open All Portals Hub ↗
         </button>
      </div>

    </section>
  );
}

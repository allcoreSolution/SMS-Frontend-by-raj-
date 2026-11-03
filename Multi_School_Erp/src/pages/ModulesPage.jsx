import React, { useState } from 'react';
import { PORTAL_URLS } from '../config/portals';
import Navbar from '../components/Navbar';
import FooterLanding from '../components/landing/FooterLanding';
import { useModal } from '../context/ModalContext';
import { ExternalLink, Sparkles } from 'lucide-react';

export default function ModulesPage() {
  const [filter, setFilter] = useState('All');
  const { openModal } = useModal();

  const allModules = [
    { title: 'Student Information', label: 'CORE', category: 'Core', icon: '👤', desc: 'Manage student records, demographics & history.', url: PORTAL_URLS.admin },
    { title: 'Academics', label: 'CORE', category: 'Core', icon: '📚', desc: 'Classes, sections, subjects and syllabuses.', url: PORTAL_URLS.admin },
    { title: 'Fees Collection', label: 'CORE', category: 'Finance', icon: '💰', desc: 'Instant fee collection counter, receipts, dues.', url: `${PORTAL_URLS.accountant}/collect-fees` },
    { title: 'Human Resource', label: 'CORE', category: 'Staff', icon: '👥', desc: 'Staff directory, designations, payroll records.', url: `${PORTAL_URLS.admin}/hr/staff-directory` },
    { title: 'Offline Exams & Marks Entry', label: 'CORE', category: 'Academic', icon: '📝', desc: 'Teacher marks entry, grading, marksheets.', url: `${PORTAL_URLS.teacher}/enter-marks` },
    { title: 'Certificates', label: 'CORE', category: 'Core', icon: '📜', desc: 'Generate ID cards and custom certificates.', url: PORTAL_URLS.admin },
    { title: 'ID Card Designer', label: 'CORE', category: 'Core', icon: '🪪', desc: 'Drag-and-drop ID card printing system.', url: PORTAL_URLS.admin },
    
    { title: 'CCTV Live View', label: 'NEW', category: 'Add-on', icon: '📹', desc: 'Embed NVR feeds for admin monitoring.', modal: 'hardware' },
    { title: 'Parent–Teacher Chat', label: 'NEW', category: 'Comms', icon: '💬', desc: 'WhatsApp-style internal messaging.', url: `${PORTAL_URLS.student}/whatsapp` },
    { title: 'Surveys & Feedback', label: 'NEW', category: 'Comms', icon: '📊', desc: 'Collect feedback from parents & staff.', url: `${PORTAL_URLS.student}/notice-board` },
    { title: 'Engagement & Creatives', label: 'NEW', category: 'Add-on', icon: '🎨', desc: 'Social media post maker integration.', url: `${PORTAL_URLS.branch}/templates` },
    { title: 'Compliance & Governance', label: 'NEW', category: 'Staff', icon: '🛡️', desc: 'Store statutory documents safely.', url: `${PORTAL_URLS.branch}/reports/login-logs` },
    { title: 'Online Exams Pro (CBT)', label: 'NEW', category: 'Academic', icon: '💻', desc: 'Computer based testing with anti-cheat.', url: `${PORTAL_URLS.student}/online-exams` },
    { title: 'Admission CRM', label: 'NEW', category: 'Core', icon: '🎯', desc: 'Lead tracking and funnel management.', url: PORTAL_URLS.admin },
    { title: 'School Website Builder', label: 'NEW', category: 'Add-on', icon: '🌐', desc: 'CMS to generate front-facing websites.', url: `${PORTAL_URLS.branch}/templates` },
    { title: 'Live Classes', label: 'NEW', category: 'Academic', icon: '🎥', desc: 'Zoom & Google Meet integration.', url: `${PORTAL_URLS.student}/live-classes` },
    { title: 'Biometric 2-Way Sync', label: 'NEW', category: 'Staff', icon: '🖐️', desc: 'Real-time ZKTeco/eSSL cloud push.', modal: 'hardware' },
    
    { title: 'Homework & Classwork', category: 'Academic', icon: '✏️', desc: 'Teacher classwork assignment & evaluations.', url: `${PORTAL_URLS.teacher}/classwork` },
    { title: 'Library Management', category: 'Core', icon: '📖', desc: 'Book issues, returns, barcode scanning.', url: `${PORTAL_URLS.student}/library` },
    { title: 'Transport', category: 'Core', icon: '🚌', desc: 'Routes, vehicle tracking via driver app.', url: `${PORTAL_URLS.student}/transport` },
    { title: 'Hostel', category: 'Core', icon: '🏠', desc: 'Room allocation and hostel fee tracking.', url: `${PORTAL_URLS.student}/hostel` },
    { title: 'Inventory', category: 'Finance', icon: '📦', desc: 'Stock management, purchase and expense logs.', url: `${PORTAL_URLS.accountant}/accounts/expense` },
    { title: 'Asset Management', category: 'Finance', icon: '🖨️', desc: 'Track school assets, laptops, and vouchers.', url: `${PORTAL_URLS.accountant}/accounts/expense` },
    { title: 'AI Assistant', category: 'Add-on', icon: '🤖', desc: 'Intelligent multi-lingual school assistance.', url: `${PORTAL_URLS.student}/ai-assistant` },
    { title: 'Knowledge Base', category: 'Comms', icon: '🧠', desc: 'Articles for parent self-service portal.', url: `${PORTAL_URLS.student}/study-center` },
    { title: 'Study Center', category: 'Academic', icon: '🎓', desc: 'Share PDFs, Videos, and notes instantly.', url: `${PORTAL_URLS.student}/study-center` },
    { title: 'Accounts & Finance', category: 'Finance', icon: '📈', desc: 'Income, Expense, and comprehensive ledgers.', url: `${PORTAL_URLS.accountant}/accounts/dashboard` },
    { title: 'Front Office', category: 'Core', icon: '🏦', desc: 'Visitor log, postal dispatch, call logs.', url: PORTAL_URLS.admin },
    { title: 'Communications', category: 'Comms', icon: '📧', desc: 'Email, SMS, and Push notification center.', url: `${PORTAL_URLS.student}/sms` },
    { title: 'Teacher Leave Apply', category: 'Staff', icon: '📋', desc: 'Teacher leave application and leave status.', url: `${PORTAL_URLS.teacher}/leave` },
    { title: 'Health Records', category: 'Staff', icon: '🩺', desc: 'Track student medical history & allergies.', url: `${PORTAL_URLS.student}/health-records` },
    { title: 'Apps Center', category: 'Add-on', icon: '📱', desc: 'Manage API keys and mobile app configs.', modal: 'portals' },
    { title: 'Parent-Teacher Meetings', category: 'Comms', icon: '🤝', desc: 'Schedule PTM slots via teacher portal.', url: `${PORTAL_URLS.teacher}/ptm` },
    { title: 'Lesson Planner', category: 'Academic', icon: '📐', desc: 'Teacher syllabus tracking & daily logs.', url: `${PORTAL_URLS.teacher}/lesson-planner` },
    { title: 'Digital Evaluation', category: 'Academic', icon: '✅', desc: 'Teacher online CBT evaluation & question bank.', url: `${PORTAL_URLS.teacher}/online-exams` },
    { title: 'QR Code Attendance', category: 'Core', icon: '📲', desc: 'Teacher fast student attendance marking.', url: `${PORTAL_URLS.teacher}/student-attendance` },
    { title: 'Assessment & Marks', category: 'Academic', icon: '📊', desc: 'Consolidated marks entry and grade cards.', url: `${PORTAL_URLS.teacher}/enter-marks` }
  ];

  const categories = ['All', 'Core', 'Academic', 'Finance', 'Staff', 'Comms', 'Add-on'];

  const filteredModules = filter === 'All' ? allModules : allModules.filter(m => m.category === filter);

  const handleCardClick = (mod) => {
    if (mod.url) {
      window.open(mod.url, '_blank', 'noreferrer');
    } else if (mod.modal) {
      openModal(mod.modal);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] overflow-hidden">
      <Navbar />
      
      <main className="mt-[68px] sm:mt-[80px]">
        {/* Header Section */}
        <section className="py-8 lg:py-10 px-4 sm:px-6 lg:px-12 w-full border-b-[2px] border-gray-900 bg-[#111827] relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-pattern opacity-30" />
           
           <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
              <span className="inline-flex items-center gap-2 bg-white text-gray-900 font-black uppercase tracking-widest text-[9px] px-3 py-1 border-[2px] border-gray-900 shadow-[2px_2px_0_0_#F59E0B] mb-3">
                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                 38 Powerful Sub-Systems • All Dedicated Live Panels
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-50 tracking-tight mb-3 leading-none">
                 Module <span className="text-amber-400">Catalog</span>.
              </h1>
              
              <div className="h-0.5 w-12 bg-gray-700 mb-3" />
              
              <p className="text-gray-400 font-semibold text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                 Every card in this catalog is connected with its dedicated running portal (:5176 School Admin ERP, :5177 Teacher Panel, :5178 Accountant Panel, :5175 Student/Parent, :5174 Branch Admin, :5050 Backend). Click any module to launch its live screen.
              </p>
           </div>
        </section>

        {/* Filter bar */}
        <div className="border-b-[1.5px] border-gray-900 sticky top-[80px] bg-white z-40 bg-grid-pattern shadow-[0_4px_0_0_#111827]">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-2 overflow-x-auto py-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                {categories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setFilter(cat)}
                     className={`px-3 sm:px-4 py-1.5 font-bold text-xs sm:text-sm border-[1.5px] border-gray-900 whitespace-nowrap transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
                       filter === cat 
                       ? 'bg-gray-900 text-amber-400 shadow-[1px_1px_0_0_#F59E0B]' 
                       : 'bg-white text-gray-700 shadow-[2px_2px_0_0_#111827]'
                     }`}
                   >
                      {cat}
                   </button>
                ))}
              </div>

              <button
                onClick={() => openModal('portals')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-gray-900 border-[1.5px] border-gray-900 font-black text-xs uppercase tracking-wider hover:bg-amber-300 whitespace-nowrap shadow-[1.5px_1.5px_0_0_#111827]"
              >
                <span>Launch Demo Hub</span>
                <span>⚡</span>
              </button>
           </div>
        </div>

        {/* Grid Catalog */}
        <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto min-h-[500px]">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredModules.map((mod, i) => (
                <div 
                  key={i} 
                  onClick={() => handleCardClick(mod)}
                  className={`bg-gradient-to-b from-white to-gray-50 border-[1.5px] border-gray-900 p-3.5 shadow-[2px_2px_0_0_#111827] hover:shadow-[5px_5px_0_0_#111827] hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all flex flex-col group relative overflow-hidden cursor-pointer select-none ${
                    mod.label === 'CORE' ? 'border-t-[3px] border-t-[#09B48E]' : 
                    mod.label === 'NEW' ? 'border-t-[3px] border-t-amber-500' : 
                    'border-t-[3px] border-t-gray-700'
                  }`}
                  title={`Click to launch ${mod.title} live screen`}
                >
                   <div className="flex items-center gap-3 mb-2 relative">
                      <div className="flex-shrink-0 w-8 h-8 bg-white border-[1.5px] border-gray-900 shadow-[1.5px_1.5px_0_0_#111827] flex items-center justify-center text-sm group-hover:-rotate-6 transition-transform">
                         {mod.icon}
                      </div>
                      <div className="flex flex-col min-w-0 pr-4">
                        <h3 className="font-bold text-gray-900 text-[13px] leading-tight truncate w-full group-hover:text-amber-600 transition-colors">
                          {mod.title}
                        </h3>
                        {mod.label && (
                          <span className={`w-fit font-black tracking-widest text-[7px] px-1 py-[1px] mt-1 border-[1px] border-gray-900 shadow-[1px_1px_0_0_#111827] ${mod.label === 'CORE' ? 'bg-[#E8F8F5] text-[#09B48E]' : 'bg-amber-100 text-amber-800'}`}>
                            {mod.label}
                          </span>
                        )}
                      </div>
                   </div>
                   
                   <p className="text-gray-500 font-medium text-[11px] leading-tight flex-1 mb-2 line-clamp-2">
                     {mod.desc}
                   </p>
                   
                   <div className="mt-auto pt-2 border-t-[1.5px] border-dashed border-gray-300 w-full flex justify-between items-center">
                     <span className="text-[9px] uppercase font-black text-gray-900 tracking-widest bg-gray-100 px-1 py-0.5 rounded-sm">
                       {mod.category}
                     </span>
                     <span className="text-gray-400 group-hover:text-amber-600 transition-colors text-[11px] font-black flex items-center gap-0.5">
                       <span>Launch</span>
                       <span>➜</span>
                     </span>
                   </div>
                </div>
              ))}
           </div>
           
           {filteredModules.length === 0 && (
             <div className="text-center text-gray-500 py-20 font-semibold">
                No modules found for this category.
             </div>
           )}
        </section>

      </main>

      <FooterLanding />
    </div>
  );
}

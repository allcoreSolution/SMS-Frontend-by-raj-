import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { ExternalLink, CheckCircle, Sparkles, Download } from 'lucide-react';

export default function Showcase() {
  const panels = [
    {
      title: 'School Admin ERP Master',
      port: 'WEB',
      badge: 'Admin ERP',
      badgeColor: 'bg-amber-400 text-gray-900',
      url: PORTAL_URLS.admin,
      desc: 'Central school administration with Student Admissions, HR Staff Directory, Dynamic Datesheets, and QR Gate ingress.',
      stats: [
        { label: 'Campus Status', val: 'Active • 1,485 Enrolled' },
        { label: 'HR Directory', val: '64 Staff Members' }
      ],
      theme: 'border-amber-400'
    },
    {
      title: 'Teacher & Staff Portal',
      port: 'WEB',
      badge: 'Teacher Panel',
      badgeColor: 'bg-emerald-400 text-gray-900',
      url: PORTAL_URLS.teacher,
      isDownload: false,
      desc: 'Exclusive cloud portal for educators: Student Attendance marking, Exam Marksheet entry, Teacher Leave apply, and Lesson Planners.',
      stats: [
        { label: 'Platform', val: 'Web Cloud Portal' },
        { label: 'Exams & Marks', val: 'Term 1 / CBT Evaluation' }
      ],
      theme: 'border-emerald-400'
    },
    {
      title: 'Accountant & Financial Panel',
      port: 'WEB',
      badge: 'Accountant Panel',
      badgeColor: 'bg-teal-400 text-gray-900',
      url: PORTAL_URLS.accountant,
      isDownload: false,
      desc: 'Specialized finance web portal: Instant Fee Invoicing, Defaulter reminders, Fee Group allocation, Income & Expense vouchers, and Cash Ledgers.',
      stats: [
        { label: 'Platform', val: 'Web Cloud Portal' },
        { label: 'Fee Counter', val: 'Online & Cash Invoicing' }
      ],
      theme: 'border-teal-400'
    },
    {
      title: 'Student & Parent Portal',
      port: 'WEB',
      badge: 'Student / Parent',
      badgeColor: 'bg-purple-400 text-gray-900',
      url: PORTAL_URLS.student,
      isDownload: false,
      desc: 'Dedicated cloud web portal for students & parents: Bilingual Hindi & English switch, Intelligent AI Assistant, CBT Online Exams, Digital Fee Challan, and Attendance.',
      stats: [
        { label: 'Platform', val: 'Web Cloud Portal' },
        { label: 'Languages', val: 'Hindi & English' }
      ],
      theme: 'border-purple-400'
    }
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-200 bg-white relative overflow-hidden">
      
      {/* Clean Header Block */}
      <div className="relative z-10 text-center mb-8 sm:mb-12 flex flex-col items-center max-w-4xl mx-auto py-2 sm:py-4 px-2 sm:px-8">
        <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[9.5px] sm:text-[11px] px-3.5 py-1 mb-3 rounded-full border border-emerald-200 shadow-xs">
          UI ENGINEERING &amp; DEDICATED PANELS
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight mb-2">
          Dedicated portals for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">every single stakeholder.</span>
        </h2>
        <p className="text-slate-600 font-medium leading-relaxed text-xs sm:text-base max-w-2xl mx-auto">
          Every panel has its own dedicated portal and credentials. Click any panel below to launch its real running environment directly.
        </p>
      </div>

      {/* 4 Dedicated Panels Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {panels.map((p, idx) => (
          <a
            key={idx}
            href={p.url}
            {...(p.isDownload ? { download: p.downloadName } : { target: "_blank", rel: "noreferrer" })}
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between cursor-pointer text-left"
            title={p.isDownload ? `Click to download ${p.title}` : `Click to launch ${p.title}`}
          >
            {/* Window Title Bar */}
            <div className="w-full bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                <span className="text-[10px] font-black text-slate-300 ml-2 uppercase tracking-wider">{p.badge}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${p.badgeColor}`}>
                  {p.port} LIVE
                </span>
              </div>
            </div>

            {/* Preview Body */}
            <div className="p-5 sm:p-6 bg-slate-50/50 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-xl font-black text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
                  {p.desc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200/80 mb-4">
                {p.stats.map((st, i) => (
                  <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
                    <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{st.label}</div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 truncate">{st.val}</div>
                  </div>
                ))}
              </div>

              <div className="w-full bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-600 text-white group-hover:text-slate-950 rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-sm">
                <span>{p.isDownload ? `Download ${p.badge} APK ⬇` : `Launch ${p.badge} ↗`}</span>
                {p.isDownload ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
              </div>
            </div>

          </a>
        ))}
      </div>

    </section>
  );
}

import React from 'react';
import { PORTAL_URLS } from '../../config/portals';
import { ExternalLink, CheckCircle, Sparkles, Download } from 'lucide-react';

export default function Showcase() {
  const panels = [
    {
      title: 'School Admin ERP Master',
      port: ':5176',
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
      title: 'Teacher & Staff App (Android APK)',
      port: 'APK',
      badge: 'Teacher App',
      badgeColor: 'bg-emerald-400 text-gray-900',
      url: '/apk/Teacher.apk',
      isDownload: true,
      downloadName: 'Teacher.apk',
      desc: 'Exclusive native Android mobile app for educators: Student Attendance marking, Exam Marksheet entry, Teacher Leave apply, and Lesson Planners.',
      stats: [
        { label: 'Platform', val: 'Android APK (Teacher.apk)' },
        { label: 'Exams & Marks', val: 'Term 1 / CBT Evaluation' }
      ],
      theme: 'border-emerald-400'
    },
    {
      title: 'Accountant & Financial Panel',
      port: ':5178',
      badge: 'Accountant Panel',
      badgeColor: 'bg-teal-400 text-gray-900',
      url: PORTAL_URLS.accountant,
      isDownload: false,
      desc: 'Specialized finance web portal: Instant Fee Invoicing, Defaulter reminders, Fee Group allocation, Income & Expense vouchers, and Cash Ledgers.',
      stats: [
        { label: 'Platform', val: 'Web Portal (:5178)' },
        { label: 'Fee Counter', val: 'Online & Cash Invoicing' }
      ],
      theme: 'border-teal-400'
    },
    {
      title: 'Student & Parent App (Android APK)',
      port: 'APK',
      badge: 'Student / Parent',
      badgeColor: 'bg-purple-400 text-gray-900',
      url: '/apk/Student_Parents.apk',
      isDownload: true,
      downloadName: 'Student_Parents.apk',
      desc: 'Android mobile app with Hindi and English switch, Intelligent AI Assistant, CBT Online Exams with timer, Digital Fee Challan, and Attendance.',
      stats: [
        { label: 'Platform', val: 'Android APK' },
        { label: 'Languages', val: 'Hindi & English' }
      ],
      theme: 'border-purple-400'
    }
  ];

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t-[3px] border-gray-900 bg-white bg-grid-pattern relative overflow-hidden">
      
      {/* Clean Header Block */}
      <div className="relative z-10 text-center mb-12 flex flex-col items-center max-w-4xl mx-auto py-3 px-4 sm:py-4 sm:px-8">
        <span className="inline-block bg-[#E8F8F5] text-[#09B48E] font-black uppercase tracking-widest text-[8px] sm:text-[9px] px-2.5 py-1 mb-2 rounded-full shadow-sm">
          UI ENGINEERING & DEDICATED PANELS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-[1.1] tracking-tighter mb-1.5">
          Dedicated portals for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">every single stakeholder.</span>
        </h2>
        <p className="text-gray-600 font-bold leading-relaxed text-[11px] sm:text-[13px] max-w-2xl mx-auto">
          Every panel has its own dedicated local port and credentials. Click any panel below to launch its live running environment directly.
        </p>
      </div>

      {/* 4 Dedicated Panels Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {panels.map((p, idx) => (
          <a
            key={idx}
            href={p.url}
            {...(p.isDownload ? { download: p.downloadName } : { target: "_blank", rel: "noreferrer" })}
            className="relative group w-full cursor-pointer block"
            title={p.isDownload ? `Click to download ${p.title}` : `Click to launch ${p.title} on ${p.port}`}
          >
            <div className="absolute inset-0 bg-gray-900 translate-x-2.5 translate-y-2.5 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4" />
            <div className="relative w-full bg-white border-[2.5px] border-gray-900 flex flex-col transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
              
              {/* Window Title Bar */}
              <div className="w-full bg-slate-100 border-b-2 border-gray-900 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full border border-gray-900 bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full border border-gray-900 bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full border border-gray-900 bg-green-400" />
                  <span className="text-[10px] font-black text-gray-700 ml-2 uppercase tracking-wider">{p.badge}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[9px] font-black px-2 py-0.5 border border-gray-900 uppercase tracking-widest ${p.badgeColor}`}>
                    {p.port} LIVE
                  </span>
                </div>
              </div>

              {/* Preview Body */}
              <div className="p-5 sm:p-6 bg-slate-50 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-gray-600 font-semibold leading-relaxed mb-4">
                    {p.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200 mb-4">
                  {p.stats.map((st, i) => (
                    <div key={i} className="bg-white border border-gray-300 p-2">
                      <div className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold text-gray-400">{st.label}</div>
                      <div className="text-[11px] sm:text-xs font-black text-gray-900 truncate">{st.val}</div>
                    </div>
                  ))}
                </div>

                <div className="w-full bg-gray-900 group-hover:bg-amber-400 text-white group-hover:text-gray-900 border-2 border-gray-900 py-2.5 px-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-colors shadow-[2px_2px_0_0_#111827]">
                  <span>{p.isDownload ? `Download ${p.badge} APK ⬇` : `Launch ${p.badge} (${p.port})`}</span>
                  {p.isDownload ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                </div>
              </div>

            </div>
          </a>
        ))}
      </div>

    </section>
  );
}

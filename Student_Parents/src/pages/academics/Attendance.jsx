import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Check, X, Clock, Star, 
  CalendarDays, User, BookOpen, RefreshCw, Printer, 
  CheckCircle2, AlertCircle, Info, Filter, ArrowRight,
  ShieldCheck, Flame
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

const defaultDailyLogs = [];

const subjectAnalytics = [];

export default function Attendance({ activeChild }) {
  const { currentLang } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [loading, setLoading] = useState(false);

  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(y, m, 1).getDay();

  const DAYS = currentLang === 'hi' ? DAYS_HI : DAYS_EN;
  const MONTHS = currentLang === 'hi' ? MONTHS_HI : MONTHS_EN;

  const TABS = [
    { key: 'daily', label: currentLang === 'hi' ? 'दैनिक उपस्थिति लॉग' : 'Daily Log' },
    { key: 'calendar', label: currentLang === 'hi' ? 'मासिक कैलेंडर' : 'Monthly Calendar' },
    { key: 'analytics', label: currentLang === 'hi' ? 'विषयवार विश्लेषण' : 'Subject Analytics' },
  ];

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            {currentLang === 'hi' ? 'उपस्थिति विवरण एवं बायोमेट्रिक स्कैन' : 'Attendance Log & RFID Scans'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {currentLang === 'hi' ? 'दैनिक आगमन/प्रस्थान समय और कुल उपस्थिति रिकॉर्ड' : 'Daily entry/exit timestamps & overall percentages'}
          </p>
        </div>
      </div>

      {/* ── 1. ATTENDANCE HERO OVERVIEW CARD ── */}
      <div className="w-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-3xl p-5 text-white shadow-[0_12px_28px_-6px_rgba(37,99,235,0.35)] border border-white/20 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-semibold text-white/80">
              {currentLang === 'hi' ? 'कुल उपस्थिति प्रतिशत' : 'Overall Attendance'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight mt-0.5">{loading ? "..." : "—"}</h2>
            <div className="flex items-center gap-1.5 mt-1.5 text-blue-100 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{currentLang === 'hi' ? 'आरएफआईडी बायोमेट्रिक स्कैनर सक्रिय' : 'RFID Biometric Scanner Active'}</span>
            </div>
          </div>

          {/* SVG Circular Ring Gauge */}
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
            <svg className="w-18 h-18 sm:w-20 sm:h-20 transform -rotate-90">
              <circle
                cx="36"
                cy="36"
                r="30"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                stroke="#FFFFFF"
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={(2 * Math.PI * 30) * (1 - 0.924)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-serif font-black text-white text-base">—</span>
          </div>
        </div>

        {/* 4 Stats Mini Grid */}
        <div className="mt-4 bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15 grid grid-cols-4 gap-2 text-center text-xs relative z-10">
          <div>
            <p className="text-[10px] text-white/70">{currentLang === 'hi' ? 'उपस्थित' : 'Present'}</p>
            <p className="text-sm font-black text-emerald-300">—</p>
          </div>
          <div>
            <p className="text-[10px] text-white/70">{currentLang === 'hi' ? 'अनुपस्थित' : 'Absent'}</p>
            <p className="text-sm font-black text-red-300">—</p>
          </div>
          <div>
            <p className="text-[10px] text-white/70">{currentLang === 'hi' ? 'अवकाश' : 'Leaves'}</p>
            <p className="text-sm font-black text-amber-300">—</p>
          </div>
          <div>
            <p className="text-[10px] text-white/70">{currentLang === 'hi' ? 'कुल दिन' : 'Total Days'}</p>
            <p className="text-sm font-black text-white">—</p>
          </div>
        </div>

        {/* Streak Bar */}
        <div className="mt-3 bg-white/15 backdrop-blur-xs rounded-xl py-2 px-3 text-center flex items-center justify-center gap-1.5 text-xs font-bold text-amber-200">
          <span>{currentLang === 'hi' ? '🔥 14 दिन लगातार उपस्थिति स्ट्रीक!' : '🔥 14 Days Continuous Attendance Streak!'}</span>
        </div>
      </div>

      {/* ── 2. SEGMENTED TABS ── */}
      <div className="bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-1 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isSelected = selectedTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── 3. TAB VIEWS ── */}
      
      {/* VIEW 1: DAILY LOG */}
      {selectedTab === 'daily' && (
        <div className="space-y-3">
          {defaultDailyLogs.map((log, idx) => {
            const isPresent = log.status === 'Present';
            const isLate = log.status === 'Late';
            const isLeave = log.status === 'Leave';
            const isHoliday = log.status === 'Holiday';

            const statusText = currentLang === 'hi'
              ? (isPresent ? 'उपस्थित' : isLate ? 'विलंब' : isLeave ? 'अवकाश' : 'छुट्टी')
              : log.status;

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900 font-serif">
                      {log.date}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">• {log.periods} {currentLang === 'hi' ? 'पीरियड्स' : 'Periods'}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium mt-1">
                    <span>{currentLang === 'hi' ? 'आगमन:' : 'In:'} <b className="text-slate-700">{log.inTime}</b></span>
                    <span>•</span>
                    <span>{currentLang === 'hi' ? 'प्रस्थान:' : 'Out:'} <b className="text-slate-700">{log.outTime}</b></span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                    {currentLang === 'hi' ? 'माध्यम:' : 'Mode:'} {log.mode}
                  </p>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto shrink-0 ${
                    isPresent
                      ? 'bg-emerald-50 text-[#10B981] border-emerald-200'
                      : isLate
                      ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                      : isLeave
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {statusText}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: MONTHLY CALENDAR */}
      {selectedTab === 'calendar' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-3.5 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black font-serif text-slate-900">
              {MONTHS[m]} {y} {currentLang === 'hi' ? 'उपस्थिति मानचित्र' : 'Attendance Map'}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDate(new Date(y, m - 1, 1))}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                title={currentLang === 'hi' ? 'पिछला महीना' : 'Previous Month'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(y, m + 1, 1))}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                title={currentLang === 'hi' ? 'अगला महीना' : 'Next Month'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] sm:text-xs text-slate-400">
            {DAYS.map(d => <span key={d}>{d}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`blank-${i}`} className="h-9 sm:h-11 rounded-lg sm:rounded-xl bg-slate-50/50"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSun = (firstDay + i) % 7 === 0;
              const isAbsent = false; const isLeave = false; const isLate = false; const isPresent = false;

              return (
                <div
                  key={`day-${day}`}
                  className={`h-9 sm:h-11 rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-[11px] sm:text-xs font-bold border ${
                    isSun
                      ? 'bg-slate-50 border-slate-100 text-slate-400'
                      : isAbsent
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : isLeave
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : isLate
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                >
                  <span>{day}</span>
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSun ? 'bg-transparent' : isAbsent ? 'bg-red-500' : isLeave ? 'bg-purple-500' : isLate ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-100 text-[10.5px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {currentLang === 'hi' ? 'उपस्थित' : 'Present'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {currentLang === 'hi' ? 'विलंब / आधा दिन' : 'Late / Half Day'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> {currentLang === 'hi' ? 'अवकाश' : 'Leave'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> {currentLang === 'hi' ? 'अनुपस्थित' : 'Absent'}
            </span>
          </div>
        </div>
      )}

      {/* VIEW 3: SUBJECT ANALYTICS */}
      {selectedTab === 'analytics' && (
        <div className="space-y-3">
          {subjectAnalytics.map((sub, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black font-serif text-slate-900">
                    {sub.subject}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{currentLang === 'hi' ? 'अध्यापक:' : 'Faculty:'} {sub.teacher}</p>
                </div>
                <span className="text-sm font-black font-serif text-[#2563EB]">
                  {sub.pct}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${sub.pct}%`, backgroundColor: sub.color }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>{currentLang === 'hi' ? 'उपस्थित कक्षाएं:' : 'Classes Attended:'} <b className="text-slate-700">{sub.present}</b> / {sub.total}</span>
                <span>{currentLang === 'hi' ? 'न्यूनतम अनिवार्य उपस्थिति: 75%' : 'Minimum Required: 75%'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

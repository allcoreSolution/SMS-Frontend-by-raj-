import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, Clock, User, MapPin, RefreshCw, Printer, 
  Search, GraduationCap, Coffee, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

const DAYS_CONFIG = [
  { key: 'Mon', en: 'Mon', hi: 'सोम' },
  { key: 'Tue', en: 'Tue', hi: 'मंगल' },
  { key: 'Wed', en: 'Wed', hi: 'बुध' },
  { key: 'Thu', en: 'Thu', hi: 'गुरु' },
  { key: 'Fri', en: 'Fri', hi: 'शुक्र' },
  { key: 'Sat', en: 'Sat', hi: 'शनि' }
];

const SUBJECT_HI = {
  'Mathematics': 'गणित (Mathematics)',
  'English': 'अंग्रेज़ी (English)',
  'Science': 'विज्ञान (Science)',
  'Social Science': 'सामाजिक विज्ञान (Social Studies)',
  'Computer Science': 'कंप्यूटर साइंस (IT)',
  'Physical Ed.': 'शारीरिक शिक्षा (P.E.)',
  'Hindi': 'हिन्दी साहित्य (Hindi)',
  'Art & Craft': 'कला व क्राफ्ट (Art)',
  'General Knowledge': 'सामान्य ज्ञान (G.K.)',
  'Club Activities': 'क्लब गतिविधियां',
  'Sports & Games': 'खेलकूद व व्यायाम',
  'Remedial Class': 'उपचारात्मक कक्षा (Remedial)'
};

const TYPE_HI = {
  'Lecture': 'व्याख्यान',
  'Practical': 'प्रायोगिक',
  'Lab': 'लैब सत्र',
  'Sports': 'खेलकूद',
  'Activity': 'गतिविधि',
  'Club': 'क्लब',
  'Tutorial': 'ट्यूटोरियल'
};

// Default weekly schedule matching Screenshot 4
const defaultWeeklySchedule = {
  'Mon': [
    { time: '08:30 – 09:20 AM', subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 12', type: 'Lecture', barColor: 'bg-[#2563EB]', badgeBg: 'bg-blue-50 text-blue-700' },
    { time: '09:20 – 10:10 AM', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 15', type: 'Lecture', barColor: 'bg-[#8B5CF6]', badgeBg: 'bg-purple-50 text-purple-700' },
    { time: '10:10 – 11:00 AM', subject: 'Science', teacher: 'Mr. Verma', room: 'Lab 2', type: 'Practical', barColor: 'bg-[#10B981]', badgeBg: 'bg-emerald-50 text-emerald-700' },
    { isBreak: true, time: '11:00 – 11:30 AM', subject: 'Recess Break', teacher: '-', room: 'Cafeteria' },
    { time: '11:30 – 12:20 PM', subject: 'Social Science', teacher: 'Mr. Gupta', room: 'Room 05', type: 'Lecture', barColor: 'bg-[#14B8A6]', badgeBg: 'bg-teal-50 text-teal-700' },
    { time: '12:20 – 01:10 PM', subject: 'Computer Science', teacher: 'Mr. Das', room: 'Lab 1', type: 'Lab', barColor: 'bg-[#EC4899]', badgeBg: 'bg-pink-50 text-pink-700' }
  ],
  'Tue': [
    { time: '08:30 – 09:20 AM', subject: 'Science', teacher: 'Mr. Verma', room: 'Lab 2', type: 'Lecture', barColor: 'bg-[#10B981]', badgeBg: 'bg-emerald-50 text-emerald-700' },
    { time: '09:20 – 10:10 AM', subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 12', type: 'Lecture', barColor: 'bg-[#2563EB]', badgeBg: 'bg-blue-50 text-blue-700' },
    { time: '10:10 – 11:00 AM', subject: 'Social Science', teacher: 'Mr. Gupta', room: 'Room 05', type: 'Lecture', barColor: 'bg-[#14B8A6]', badgeBg: 'bg-teal-50 text-teal-700' },
    { isBreak: true, time: '11:00 – 11:30 AM', subject: 'Recess Break', teacher: '-', room: 'Cafeteria' },
    { time: '11:30 – 12:20 PM', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 15', type: 'Lecture', barColor: 'bg-[#8B5CF6]', badgeBg: 'bg-purple-50 text-purple-700' },
    { time: '12:20 – 01:10 PM', subject: 'Physical Ed.', teacher: 'Mr. Singh', room: 'Ground 1', type: 'Sports', barColor: 'bg-[#06B6D4]', badgeBg: 'bg-cyan-50 text-cyan-700' }
  ],
  'Wed': [
    { time: '08:30 – 09:20 AM', subject: 'Hindi', teacher: 'Mrs. Singh', room: 'Room 19', type: 'Lecture', barColor: 'bg-[#EF4444]', badgeBg: 'bg-red-50 text-red-700' },
    { time: '09:20 – 10:10 AM', subject: 'Science', teacher: 'Mr. Verma', room: 'Lab 2', type: 'Lecture', barColor: 'bg-[#10B981]', badgeBg: 'bg-emerald-50 text-emerald-700' },
    { time: '10:10 – 11:00 AM', subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 12', type: 'Lecture', barColor: 'bg-[#2563EB]', badgeBg: 'bg-blue-50 text-blue-700' },
    { isBreak: true, time: '11:00 – 11:30 AM', subject: 'Recess Break', teacher: '-', room: 'Cafeteria' },
    { time: '11:30 – 12:20 PM', subject: 'Social Science', teacher: 'Mr. Gupta', room: 'Room 05', type: 'Lecture', barColor: 'bg-[#14B8A6]', badgeBg: 'bg-teal-50 text-teal-700' },
    { time: '12:20 – 01:10 PM', subject: 'Art & Craft', teacher: 'Ms. Lily', room: 'Studio 3', type: 'Activity', barColor: 'bg-[#F59E0B]', badgeBg: 'bg-amber-50 text-amber-700' }
  ],
  'Thu': [
    { time: '08:30 – 09:20 AM', subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 12', type: 'Lecture', barColor: 'bg-[#2563EB]', badgeBg: 'bg-blue-50 text-blue-700' },
    { time: '09:20 – 10:10 AM', subject: 'Computer Science', teacher: 'Mr. Das', room: 'Lab 1', type: 'Lab', barColor: 'bg-[#EC4899]', badgeBg: 'bg-pink-50 text-pink-700' },
    { time: '10:10 – 11:00 AM', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 15', type: 'Lecture', barColor: 'bg-[#8B5CF6]', badgeBg: 'bg-purple-50 text-purple-700' },
    { isBreak: true, time: '11:00 – 11:30 AM', subject: 'Recess Break', teacher: '-', room: 'Cafeteria' },
    { time: '11:30 – 12:20 PM', subject: 'Science', teacher: 'Mr. Verma', room: 'Lab 2', type: 'Practical', barColor: 'bg-[#10B981]', badgeBg: 'bg-emerald-50 text-emerald-700' },
    { time: '12:20 – 01:10 PM', subject: 'Hindi', teacher: 'Mrs. Singh', room: 'Room 19', type: 'Lecture', barColor: 'bg-[#EF4444]', badgeBg: 'bg-red-50 text-red-700' }
  ],
  'Fri': [
    { time: '08:30 – 09:20 AM', subject: 'Social Science', teacher: 'Mr. Gupta', room: 'Room 05', type: 'Lecture', barColor: 'bg-[#14B8A6]', badgeBg: 'bg-teal-50 text-teal-700' },
    { time: '09:20 – 10:10 AM', subject: 'Science', teacher: 'Mr. Verma', room: 'Lab 2', type: 'Lecture', barColor: 'bg-[#10B981]', badgeBg: 'bg-emerald-50 text-emerald-700' },
    { time: '10:10 – 11:00 AM', subject: 'Mathematics', teacher: 'Mr. Sharma', room: 'Room 12', type: 'Lecture', barColor: 'bg-[#2563EB]', badgeBg: 'bg-blue-50 text-blue-700' },
    { isBreak: true, time: '11:00 – 11:30 AM', subject: 'Recess Break', teacher: '-', room: 'Cafeteria' },
    { time: '11:30 – 12:20 PM', subject: 'English', teacher: 'Mrs. Johnson', room: 'Room 15', type: 'Lecture', barColor: 'bg-[#8B5CF6]', badgeBg: 'bg-purple-50 text-purple-700' },
    { time: '12:20 – 01:10 PM', subject: 'General Knowledge', teacher: 'Mr. Rai', room: 'Room 12', type: 'Lecture', barColor: 'bg-[#3B82F6]', badgeBg: 'bg-blue-50 text-blue-700' }
  ],
  'Sat': [
    { time: '08:30 – 09:20 AM', subject: 'Club Activities', teacher: 'Staff', room: 'Activity Hall', type: 'Club', barColor: 'bg-[#8B5CF6]', badgeBg: 'bg-purple-50 text-purple-700' },
    { time: '09:20 – 10:10 AM', subject: 'Sports & Games', teacher: 'Mr. Singh', room: 'Playground', type: 'Sports', barColor: 'bg-[#06B6D4]', badgeBg: 'bg-cyan-50 text-cyan-700' },
    { time: '10:10 – 11:00 AM', subject: 'Remedial Class', teacher: 'Faculty', room: 'Room 10', type: 'Tutorial', barColor: 'bg-[#10B981]', badgeBg: 'bg-emerald-50 text-emerald-700' }
  ]
};

export default function Timetable({ activeChild }) {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Tue'); // default Tue as shown in Screenshot 4

  const loadTimetable = async () => {
    setLoading(true);
    try {
      const dashRes = await parentService.getDashboard({ studentId: activeChild });
      if (dashRes && dashRes.success && dashRes.data?.student) {
        setStudentInfo(dashRes.data.student);
      }
    } catch (err) {
      console.warn('Timetable sync:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, [activeChild]);

  const studentName = studentInfo?.name || 'Rahul Sharma';
  const studentClass = studentInfo?.class || 'Class 10 - Section A';
  const rollNumber = studentInfo?.rollNumber || studentInfo?.roll || 'Roll No. 22';
  const session = studentInfo?.academicSession || 'Session 2024-25';

  const periods = defaultWeeklySchedule[selectedDay] || [];

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Screen Title (matching Screenshot 4) */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
          {currentLang === 'hi' ? 'कक्षा समय सारणी (टाइमटेबल)' : 'Student Timetable'}
        </h1>
        {loading && (
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
        )}
      </div>

      {/* Horizontal Day Selector Pills (Mon, Tue, Wed, Thu, Fri, Sat) */}
      <div className="bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        {DAYS_CONFIG.map((d) => {
          const isSelected = selectedDay === d.key;
          return (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`flex-1 min-w-[46px] py-2 px-2.5 text-xs font-black rounded-xl transition-all cursor-pointer text-center shrink-0 ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25 scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {currentLang === 'hi' ? d.hi : d.en}
            </button>
          );
        })}
      </div>

      {/* Student Class Info Card (matching Screenshot 4) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-black text-slate-900 font-serif leading-tight truncate">
              {studentClass}
            </h2>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5 truncate">
              {studentName} • {rollNumber}
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto shrink-0 bg-[#10B981]/15 text-[#10B981] font-bold text-[10px] px-2.5 py-1 rounded-full border border-[#10B981]/25">
          {session}
        </span>
      </div>

      {/* Period Schedule Cards List */}
      <div className="space-y-3 pt-1">
        {periods.map((period, idx) => {
          // Special Recess Break Card (matching Screenshot 4)
          if (period.isBreak) {
            return (
              <div
                key={idx}
                className="bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-[#B45309] shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg sm:text-xl">☕</span>
                  <span className="font-serif font-black text-sm sm:text-base tracking-tight">
                    {currentLang === 'hi' ? 'मध्याह्न विश्राम (लंच ब्रेक)' : 'Recess Break'}
                  </span>
                </div>
                <span className="text-xs font-black tracking-wide font-mono self-start sm:self-auto">
                  {period.time}
                </span>
              </div>
            );
          }

          // Regular Subject Period Card
          const subTitle = currentLang === 'hi' ? (SUBJECT_HI[period.subject] || period.subject) : period.subject;
          const typeTitle = currentLang === 'hi' ? (TYPE_HI[period.type] || period.type) : period.type;

          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 relative overflow-hidden transition-all hover:border-blue-300"
            >
              {/* Colored Indicator Line on Left */}
              <div className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-md ${period.barColor || 'bg-blue-600'}`}></div>

              <div className="pl-3.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 font-serif tracking-tight">
                    {subTitle}
                  </h3>
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md ${period.badgeBg || 'bg-slate-100 text-slate-600'}`}>
                    {typeTitle}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {period.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {period.room}
                  </span>
                </div>
              </div>

              {/* Time Pill */}
              <div className="self-start sm:self-auto shrink-0 bg-slate-50 border border-slate-200/70 text-slate-700 text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-mono">
                {period.time}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

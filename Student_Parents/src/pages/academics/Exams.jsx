import React, { useEffect, useState } from 'react';
import { 
  Award, TrendingUp, CheckCircle2, AlertCircle, Printer, 
  RefreshCw, GraduationCap, Calendar, Clock, MapPin, 
  ShieldCheck, Download, ChevronRight, FileText, QrCode
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

const defaultSubjectsEn = [
  { name: 'Mathematics', code: 'MATH-10', marks: 92, max: 100, grade: 'A+', color: '#2563EB', remarks: 'Outstanding analytical skills' },
  { name: 'General Science', code: 'SCI-10', marks: 89, max: 100, grade: 'A', color: '#10B981', remarks: 'Excellent lab report and theory' },
  { name: 'Social Studies', code: 'SST-10', marks: 86, max: 100, grade: 'A', color: '#14B8A6', remarks: 'Good grasp of geography and history' },
  { name: 'English Literature', code: 'ENG-10', marks: 91, max: 100, grade: 'A+', color: '#8B5CF6', remarks: 'High vocabulary and essay quality' },
  { name: 'Computer Applications', code: 'CS-10', marks: 95, max: 100, grade: 'A+', color: '#EC4899', remarks: 'Top score in programming practical' },
  { name: 'Hindi Language', code: 'HIN-10', marks: 78, max: 100, grade: 'B+', color: '#F59E0B', remarks: 'Good, work on grammar rules' }
];

const defaultSubjectsHi = [
  { name: 'गणित (Mathematics)', code: 'MATH-10', marks: 92, max: 100, grade: 'A+', color: '#2563EB', remarks: 'उत्कृष्ट विश्लेषणात्मक कौशल' },
  { name: 'सामान्य विज्ञान (General Science)', code: 'SCI-10', marks: 89, max: 100, grade: 'A', color: '#10B981', remarks: 'प्रयोगशाला रिपोर्ट एवं थ्योरी में उत्कृष्ट' },
  { name: 'सामाजिक अध्ययन (Social Studies)', code: 'SST-10', marks: 86, max: 100, grade: 'A', color: '#14B8A6', remarks: 'भूगोल एवं इतिहास की उत्तम समझ' },
  { name: 'अंग्रेजी साहित्य (English Literature)', code: 'ENG-10', marks: 91, max: 100, grade: 'A+', color: '#8B5CF6', remarks: 'उत्कृष्ट शब्दावली एवं निबंध लेखन' },
  { name: 'कंप्यूटर अनुप्रयोग (Computer Applications)', code: 'CS-10', marks: 95, max: 100, grade: 'A+', color: '#EC4899', remarks: 'प्रोग्रामिंग प्रैक्टिकल में शीर्ष अंक' },
  { name: 'हिन्दी भाषा (Hindi Language)', code: 'HIN-10', marks: 78, max: 100, grade: 'B+', color: '#F59E0B', remarks: 'अच्छा प्रयास, व्याकरण नियमों पर अभ्यास करें' }
];

const upcomingDatesheetEn = [
  { subject: 'Science (Theory & Lab)', date: '10 Sep 2026', time: '09:00 AM – 12:00 PM', room: 'Hall A (Ground Floor)', syllabus: 'Chapters 1 to 6' },
  { subject: 'Mathematics', date: '12 Sep 2026', time: '09:00 AM – 12:00 PM', room: 'Hall A (Ground Floor)', syllabus: 'Units 1 to 5: Algebra & Trig' },
  { subject: 'Social Science', date: '15 Sep 2026', time: '09:00 AM – 12:00 PM', room: 'Room 204', syllabus: 'History Ch 1-3, Civics Ch 1-2' },
  { subject: 'English Communicative', date: '17 Sep 2026', time: '09:00 AM – 12:00 PM', room: 'Room 204', syllabus: 'Reading, Grammar, Literature Section' },
  { subject: 'Computer Applications', date: '19 Sep 2026', time: '09:00 AM – 11:30 AM', room: 'Computer Lab 2', syllabus: 'HTML, CSS, Cyber Ethics' }
];

const upcomingDatesheetHi = [
  { subject: 'विज्ञान (सैद्धांतिक एवं प्रायोगिक)', date: '10 सित 2026', time: 'प्रातः 09:00 – दोपहर 12:00', room: 'हॉल A (भूतल)', syllabus: 'अध्याय 1 से 6' },
  { subject: 'गणित', date: '12 सित 2026', time: 'प्रातः 09:00 – दोपहर 12:00', room: 'हॉल A (भूतल)', syllabus: 'इकाई 1 से 5: बीजगणित एवं त्रिकोणमिति' },
  { subject: 'सामाजिक विज्ञान', date: '15 सित 2026', time: 'प्रातः 09:00 – दोपहर 12:00', room: 'कमरा संख्या 204', syllabus: 'इतिहास अ. 1-3, नागरिक शास्त्र अ. 1-2' },
  { subject: 'अंग्रेजी संप्रेषण', date: '17 सित 2026', time: 'प्रातः 09:00 – दोपहर 12:00', room: 'कमरा संख्या 204', syllabus: 'वाचन, व्याकरण एवं साहित्य खंड' },
  { subject: 'कंप्यूटर अनुप्रयोग', date: '19 सित 2026', time: 'प्रातः 09:00 – पूर्वाह्न 11:30', room: 'कंप्यूटर लैब 2', syllabus: 'HTML, CSS, साइबर नैतिकता' }
];

export default function Exams({ activeChild }) {
  const { currentLang } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('Marksheet');
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const TABS = [
    { key: 'Marksheet', label: currentLang === 'hi' ? 'अंकतालिका (मार्कशीट)' : 'Marksheet' },
    { key: 'Date Sheet', label: currentLang === 'hi' ? 'परीक्षा समय सारणी (डेट शीट)' : 'Date Sheet' },
    { key: 'Admit Card', label: currentLang === 'hi' ? 'प्रवेश पत्र (एडमिट कार्ड)' : 'Admit Card' }
  ];

  const defaultSubjects = currentLang === 'hi' ? defaultSubjectsHi : defaultSubjectsEn;
  const upcomingDatesheet = currentLang === 'hi' ? upcomingDatesheetHi : upcomingDatesheetEn;

  const loadExamData = async () => {
    setLoading(true);
    try {
      const dashRes = await parentService.getDashboard({ studentId: activeChild });
      if (dashRes?.success && dashRes.data?.student) {
        setStudentInfo(dashRes.data.student);
      }
    } catch (err) {
      console.warn('Exams sync:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExamData();
  }, [activeChild]);

  const studentName = studentInfo?.name || (currentLang === 'hi' ? 'शिवम यादव' : 'Shivam');
  const studentClass = studentInfo?.class || (currentLang === 'hi' ? 'कक्षा 10 - C (कला वर्ग)' : 'Class 10 - C (Arts)');
  const rollNo = studentInfo?.rollNumber || studentInfo?.roll || 'Roll 22';
  const admn = studentInfo?.admissionNo || studentInfo?.admn || '8400563229';

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            {currentLang === 'hi' ? 'परीक्षा मूल्यांकन एवं रिपोर्ट कार्ड' : 'Exams & Report Cards'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {currentLang === 'hi' 
              ? 'परीक्षा परिणाम, अंकतालिका, डेटशीट एवं प्रवेश पत्र (हॉल टिकट)' 
              : 'Examination grades, marksheets, schedules & hall tickets'}
          </p>
        </div>
      </div>

      {/* ── 1. EXAM PERFORMANCE ROYAL BLUE HERO CARD ── */}
      <div className="w-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-3xl p-5 sm:p-6 text-white shadow-[0_12px_28px_-6px_rgba(37,99,235,0.35)] border border-white/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 uppercase tracking-wider">
              {currentLang === 'hi' ? 'सत्र 1 शैक्षणिक मूल्यांकन' : 'Term 1 Academic Evaluation'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight mt-1.5">
              {currentLang === 'hi' ? '88.5% विशिष्ट योग्यता (डिस्टिंक्शन)' : '88.5% Distinction'}
            </h2>
            <p className="text-xs text-blue-100 font-medium mt-0.5">
              {currentLang === 'hi' ? 'कक्षा में रैंक' : 'Rank'}: <b className="text-white">{currentLang === 'hi' ? 'कक्षा में तृतीय (3rd)' : '3rd in Class'}</b> • {currentLang === 'hi' ? 'कुल ग्रेड' : 'Overall Grade'}: <b className="text-emerald-300 font-black">A+</b>
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-2xl sm:text-3xl font-black text-white font-serif">
              531 / 600
            </span>
            <p className="text-[10px] text-blue-200 uppercase font-semibold">
              {currentLang === 'hi' ? 'कुल प्राप्तांक' : 'Total Aggregate'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => alert(currentLang === 'hi' ? 'आधिकारिक अंकतालिका PDF डाउनलोड हो रही है...' : 'Downloading official Grade Marksheet PDF...')}
          className="mt-4 w-full py-2.5 bg-white hover:bg-slate-100 text-[#1E3A8A] font-black text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>
            {currentLang === 'hi' 
              ? 'आधिकारिक सत्र 1 अंकतालिका PDF डाउनलोड करें' 
              : 'Download Official Term 1 Marksheet PDF'}
          </span>
        </button>
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

      {/* ── 3. TAB CONTENT ── */}

      {/* TAB 1: MARKSHEET */}
      {selectedTab === 'Marksheet' && (
        <div className="space-y-3">
          {defaultSubjects.map((sub, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black font-serif text-slate-900">
                      {sub.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{sub.code}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium italic mt-0.5">
                    "{sub.remarks}"
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-sm font-black font-serif text-slate-900">
                    {sub.marks} <span className="text-xs text-slate-400 font-sans">/ {sub.max}</span>
                  </span>
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                      sub.grade.startsWith('A')
                        ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                        : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                    }`}
                  >
                    {sub.grade}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(sub.marks / sub.max) * 100}%`, backgroundColor: sub.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DATE SHEET */}
      {selectedTab === 'Date Sheet' && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-[#1E3A8A]">
                {currentLang === 'hi' ? 'सत्र-मध्य लिखित परीक्षा 2026' : 'Mid-Term Written Examinations 2026'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {currentLang === 'hi' 
                  ? 'रिपोर्टिंग समय: प्रातः 08:30 बजे अनिवार्य • स्कूल ड्रेस आवश्यक' 
                  : 'Reporting Time: 08:30 AM sharp • Uniform Mandatory'}
              </p>
            </div>
            <button
              onClick={() => alert(currentLang === 'hi' ? 'परीक्षा कार्यक्रम PDF डाउनलोड हो रहा है...' : 'Downloading Examination Schedule PDF...')}
              className="p-2 rounded-xl bg-white text-[#2563EB] border border-blue-200 shadow-2xs cursor-pointer"
              title={currentLang === 'hi' ? 'समय सारणी PDF डाउनलोड करें' : 'Download Timetable PDF'}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {upcomingDatesheet.map((exam, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <h4 className="text-sm font-black text-slate-900 font-serif">
                  {exam.subject}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                  <span className="flex items-center gap-1 font-bold text-[#2563EB]">
                    <Calendar className="w-3.5 h-3.5" /> {exam.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {exam.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-1">
                  <span>{currentLang === 'hi' ? 'कक्ष' : 'Room'}: {exam.room}</span>
                  <span>•</span>
                  <span>{currentLang === 'hi' ? 'पाठ्यक्रम' : 'Syllabus'}: {exam.syllabus}</span>
                </div>
              </div>

              <span className="bg-blue-50 text-[#2563EB] border border-blue-200 text-xs font-bold px-3 py-1 rounded-xl self-end sm:self-auto shrink-0">
                {currentLang === 'hi' ? 'आगामी' : 'Upcoming'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ADMIT CARD */}
      {selectedTab === 'Admit Card' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                {currentLang === 'hi' ? 'आधिकारिक प्रवेश पत्र' : 'Official Hall Ticket'}
              </p>
              <h3 className="text-base font-black font-serif">
                {currentLang === 'hi' ? 'सत्र-मध्य बोर्ड परीक्षा 2026' : 'Mid-Term Board Examination 2026'}
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-white text-[#1E3A8A] rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'प्रवेश पत्र प्रिंट करें' : 'Print Hall Ticket'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">
                {currentLang === 'hi' ? 'विद्यार्थी का नाम' : 'Student Name'}
              </span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{studentName}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">
                {currentLang === 'hi' ? 'कक्षा एवं वर्ग' : 'Class & Stream'}
              </span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{studentClass}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">
                {currentLang === 'hi' ? 'परीक्षा रोल नंबर' : 'Examination Roll No'}
              </span>
              <p className="text-sm font-bold text-[#2563EB] font-mono mt-0.5">{rollNo}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">
                {currentLang === 'hi' ? 'प्रवेश संख्या (SRN)' : 'Admission Number'}
              </span>
              <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">{admn}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">
                {currentLang === 'hi' ? 'परीक्षा केंद्र' : 'Examination Center'}
              </span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {currentLang === 'hi' ? 'एसीएस स्मार्ट कैंपस — परीक्षा ब्लॉक ए, सेक्टर 9, जयपुर' : 'ACS Smart Campus — Examination Block A, Sector 9, Jaipur'}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-[11px] text-amber-800 leading-relaxed font-medium">
            ⚠️ <b>{currentLang === 'hi' ? 'परीक्षार्थियों हेतु निर्देश:' : 'Candidate Instructions:'}</b> {currentLang === 'hi' ? 'विद्यार्थियों को यह मुद्रित प्रवेश पत्र और मूल स्कूल पहचान पत्र साथ लाना अनिवार्य है। परीक्षा कक्ष में इलेक्ट्रॉनिक उपकरण और कैलकुलेटर ले जाना सख्त वर्जित है।' : 'Students must bring this printed admit card and original school ID card. Electronic devices and calculators are strictly prohibited inside the examination hall.'}
          </div>
        </div>
      )}

    </div>
  );
}

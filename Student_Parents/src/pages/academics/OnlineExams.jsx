import React, { useState, useEffect } from 'react';
import { 
  Laptop, Clock, CheckCircle2, Award, AlertCircle, 
  RefreshCw, Play, Check, X, HelpCircle, ChevronRight, 
  ChevronLeft, Timer, ShieldCheck, FileText
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

const defaultExamsEn = [
  {
    id: 'cbt-1',
    title: 'Mid-Term Science Mock CBT Test',
    subject: 'Science',
    durationMinutes: 30,
    totalQuestions: 5,
    totalMarks: 50,
    passingPct: 60,
    status: 'Live',
    questions: [
      { id: 'q1', text: 'Which organelle is known as the powerhouse of the cell?', options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Nucleus'], answer: 1 },
      { id: 'q2', text: 'What is the chemical formula of common salt?', options: ['NaCl', 'KCl', 'CaCO3', 'NaOH'], answer: 0 },
      { id: 'q3', text: 'What is the rate of change of velocity called?', options: ['Speed', 'Acceleration', 'Momentum', 'Force'], answer: 1 },
      { id: 'q4', text: 'Which pigment gives green color to leaves?', options: ['Hemoglobin', 'Chlorophyll', 'Carotenoid', 'Melanin'], answer: 1 },
      { id: 'q5', text: 'What is the SI unit of electric current?', options: ['Volt', 'Ohm', 'Ampere', 'Watt'], answer: 2 },
    ]
  },
  {
    id: 'cbt-2',
    title: 'Mathematics Trigonometric Quiz',
    subject: 'Mathematics',
    durationMinutes: 45,
    totalQuestions: 15,
    totalMarks: 60,
    passingPct: 50,
    status: 'Upcoming',
    startsAt: '02 Sep 2026, 10:00 AM'
  },
  {
    id: 'cbt-3',
    title: 'Computer Science Cyber Ethics Assessment',
    subject: 'Computer Science',
    durationMinutes: 20,
    totalQuestions: 10,
    totalMarks: 40,
    passingPct: 60,
    status: 'Completed',
    score: 36,
    grade: 'A+'
  }
];

const defaultExamsHi = [
  {
    id: 'cbt-1',
    title: 'सत्र-मध्य विज्ञान मॉक सीबीटी परीक्षा',
    subject: 'विज्ञान (Science)',
    durationMinutes: 30,
    totalQuestions: 5,
    totalMarks: 50,
    passingPct: 60,
    status: 'Live',
    questions: [
      { id: 'q1', text: 'कोशिका का ऊर्जा गृह (पावरहाउस) किसे कहा जाता है?', options: ['राइबोसोम', 'माइटोकॉन्ड्रिया', 'गॉल्जी उपकरण', 'केंद्रक'], answer: 1 },
      { id: 'q2', text: 'साधारण नमक का रासायनिक सूत्र क्या है?', options: ['NaCl', 'KCl', 'CaCO3', 'NaOH'], answer: 0 },
      { id: 'q3', text: 'वेग परिवर्तन की दर को क्या कहते हैं?', options: ['चाल', 'त्वरण', 'संवेग', 'बल'], answer: 1 },
      { id: 'q4', text: 'पत्तियों को हरा रंग कौन सा वर्णक प्रदान करता है?', options: ['हीमोग्लोबिन', 'क्लोरोफिल', 'कैरोटीनॉयड', 'मेलेनिन'], answer: 1 },
      { id: 'q5', text: 'विद्युत धारा का SI मात्रक क्या है?', options: ['वोल्ट', 'ओम', 'एम्पीयर', 'वाट'], answer: 2 },
    ]
  },
  {
    id: 'cbt-2',
    title: 'गणित त्रिकोणमिति क्विज़',
    subject: 'गणित (Mathematics)',
    durationMinutes: 45,
    totalQuestions: 15,
    totalMarks: 60,
    passingPct: 50,
    status: 'Upcoming',
    startsAt: '02 सित 2026, प्रातः 10:00'
  },
  {
    id: 'cbt-3',
    title: 'कंप्यूटर विज्ञान साइबर नैतिकता मूल्यांकन',
    subject: 'कंप्यूटर विज्ञान (Computer Science)',
    durationMinutes: 20,
    totalQuestions: 10,
    totalMarks: 40,
    passingPct: 60,
    status: 'Completed',
    score: 36,
    grade: 'A+'
  }
];

export default function OnlineExams({ activeChild }) {
  const { currentLang } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeExam, setActiveExam] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [resultScore, setResultScore] = useState(null);

  const defaultExams = currentLang === 'hi' ? defaultExamsHi : defaultExamsEn;

  // Timer simulation
  useEffect(() => {
    let interval = null;
    if (activeExam && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeExam, timeLeft]);

  const startTest = (exam) => {
    setActiveExam(exam);
    setCurrentQ(0);
    setUserAnswers({});
    setTimeLeft(exam.durationMinutes * 60);
    setResultScore(null);
  };

  const handleFinish = () => {
    let score = 0;
    activeExam.questions.forEach((q, idx) => {
      if (userAnswers[q.id] === q.answer) {
        score += 10;
      }
    });
    setResultScore({
      score,
      total: activeExam.totalMarks,
      pct: (score / activeExam.totalMarks) * 100,
      passed: (score / activeExam.totalMarks) * 100 >= activeExam.passingPct
    });
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filtered = defaultExams.filter(e => {
    if (selectedFilter === 'All') return true;
    return e.status === selectedFilter;
  });

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            {currentLang === 'hi' ? 'ऑनलाइन सीबीटी परीक्षा एवं क्विज़' : 'Online CBT Exams & Quizzes'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {currentLang === 'hi' 
              ? 'कंप्यूटर आधारित मूल्यांकन, तत्काल परिणाम एवं मॉक टेस्ट' 
              : 'Computer-based assessments, instant results & mock tests'}
          </p>
        </div>
      </div>

      {/* ── 1. ACTIVE CBT TEST HERO BANNER ── */}
      <div className="w-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-3xl p-5 text-white shadow-[0_12px_28px_-6px_rgba(37,99,235,0.35)] border border-white/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span>
              <span className="bg-red-500/20 text-red-200 border border-red-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {currentLang === 'hi' ? 'सक्रिय लाइव टेस्ट उपलब्ध' : 'Active Live Test Available'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight mt-1.5">
              {currentLang === 'hi' ? 'सत्र-मध्य विज्ञान मॉक सीबीटी परीक्षा' : 'Mid-Term Science Mock CBT Test'}
            </h2>
            <div className="flex items-center gap-3 text-xs text-blue-100 font-medium mt-1">
              <span>⏱️ {currentLang === 'hi' ? 'अवधि: 30 मिनट' : 'Duration: 30 Mins'}</span>
              <span>•</span>
              <span>📝 {currentLang === 'hi' ? '5 प्रश्न (50 अंक)' : '5 Questions (50 Marks)'}</span>
            </div>
          </div>

          <button
            onClick={() => startTest(defaultExams[0])}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#1E3A8A] rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{currentLang === 'hi' ? 'टेस्ट अभी शुरू करें' : 'Start Test Now'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. FILTER PILLS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'All', label: currentLang === 'hi' ? 'सभी' : 'All' },
          { key: 'Live', label: currentLang === 'hi' ? 'लाइव' : 'Live' },
          { key: 'Upcoming', label: currentLang === 'hi' ? 'आगामी' : 'Upcoming' },
          { key: 'Completed', label: currentLang === 'hi' ? 'पूर्ण' : 'Completed' }
        ].map((status) => {
          const isSelected = selectedFilter === status.key;
          return (
            <button
              key={status.key}
              onClick={() => setSelectedFilter(status.key)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              {status.label}
            </button>
          );
        })}
      </div>

      {/* ── 3. EXAMS LIST ── */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-200">
                  {item.subject}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    item.status === 'Live'
                      ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                      : item.status === 'Upcoming'
                      ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                      : 'bg-emerald-50 text-[#10B981] border-emerald-200'
                  }`}
                >
                  {currentLang === 'hi' 
                    ? (item.status === 'Live' ? 'लाइव' : item.status === 'Upcoming' ? 'आगामी' : 'पूर्ण') 
                    : item.status}
                </span>
              </div>

              <h3 className="text-base font-black font-serif text-slate-900 leading-snug">
                {item.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 font-medium mt-1">
                <span>⏱️ {item.durationMinutes} {currentLang === 'hi' ? 'मिनट' : 'Mins'}</span>
                <span>•</span>
                <span>{item.totalQuestions} {currentLang === 'hi' ? 'प्रश्न' : 'Questions'}</span>
                <span>•</span>
                <span>{currentLang === 'hi' ? 'पूर्णांक' : 'Max Marks'}: {item.totalMarks}</span>
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-auto">
              {item.status === 'Live' && (
                <button
                  onClick={() => startTest(item)}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{currentLang === 'hi' ? 'टेस्ट दें' : 'Take Test'}</span>
                </button>
              )}
              {item.status === 'Completed' && (
                <div className="text-left sm:text-right">
                  <span className="text-base font-black font-serif text-[#10B981]">
                    {item.score} / {item.totalMarks}
                  </span>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">
                    {currentLang === 'hi' ? 'ग्रेड' : 'Grade'}: {item.grade}
                  </p>
                </div>
              )}
              {item.status === 'Upcoming' && (
                <span className="text-xs font-semibold text-slate-400">
                  {currentLang === 'hi' ? 'प्रारंभ:' : 'Starts:'} {item.startsAt}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. CBT EXAM SIMULATION MODAL ── */}
      {activeExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#1E3A8A] text-white p-3.5 sm:p-4 flex items-center justify-between gap-2 shrink-0">
              <div className="min-w-0 flex-1 mr-2">
                <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider truncate">
                  {activeExam.subject} {currentLang === 'hi' ? 'मूल्यांकन' : 'Assessment'}
                </p>
                <h3 className="text-sm sm:text-base font-black font-serif truncate">{activeExam.title}</h3>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0">
                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {!resultScore ? (
                <>
                  <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-100 pb-2">
                    <span>
                      {currentLang === 'hi' 
                        ? `प्रश्न ${currentQ + 1} / ${activeExam.questions.length}` 
                        : `Question ${currentQ + 1} of ${activeExam.questions.length}`}
                    </span>
                    <span>{currentLang === 'hi' ? 'प्रत्येक 10 अंक' : '10 Marks each'}</span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {activeExam.questions[currentQ].text}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    {activeExam.questions[currentQ].options.map((opt, idx) => {
                      const isSelected = userAnswers[activeExam.questions[currentQ].id] === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setUserAnswers(prev => ({
                              ...prev,
                              [activeExam.questions[currentQ].id]: idx
                            }));
                          }}
                          className={`w-full p-3 rounded-2xl border text-left font-semibold text-xs transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-slate-300 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto">
                    <Award className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-black font-serif text-slate-900">
                    {currentLang === 'hi' ? 'परीक्षा सफलतापूर्वक संपन्न!' : 'Test Completed!'}
                  </h3>
                  <p className="text-3xl font-black text-[#2563EB] font-serif">
                    {resultScore.score} / {resultScore.total}
                  </p>
                  <p className="text-xs font-bold text-slate-500">
                    {currentLang === 'hi' ? 'प्रतिशत:' : 'Percentage:'} {resultScore.pct}% • {currentLang === 'hi' ? 'परिणाम:' : 'Status:'} <b className="text-emerald-600">{currentLang === 'hi' ? 'उत्तीर्ण (PASSED) ✅' : 'PASSED ✅'}</b>
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              {!resultScore ? (
                <>
                  <button
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ(prev => prev - 1)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40"
                  >
                    {currentLang === 'hi' ? 'पिछला' : 'Previous'}
                  </button>

                  {currentQ < activeExam.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQ(prev => prev + 1)}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs"
                    >
                      {currentLang === 'hi' ? 'अगला प्रश्न →' : 'Next Question →'}
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      className="px-4 py-2 bg-[#10B981] hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                    >
                      {currentLang === 'hi' ? 'परीक्षा सबमिट करें' : 'Submit Exam'}
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveExam(null)}
                  className="w-full py-2.5 bg-[#2563EB] text-white font-bold rounded-xl text-xs"
                >
                  {currentLang === 'hi' ? 'परिणाम बंद करें' : 'Close Result'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

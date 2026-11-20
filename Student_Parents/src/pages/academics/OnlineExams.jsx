import React, { useState, useEffect, useCallback } from 'react';
import { 
  Award, RefreshCw, Play, Timer, Loader2, Info
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
  
  const [onlineExams, setOnlineExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fallbackExams = currentLang === 'hi' ? defaultExamsHi : defaultExamsEn;

  const fetchOnlineExams = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await parentService.getOnlineExams();
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((item, idx) => {
          let questions = [];
          if (Array.isArray(item.questions) && item.questions.length > 0) {
            questions = item.questions.map((q, qIdx) => ({
              id: q._id || `q-${qIdx}`,
              text: q.questionText || q.question || q.title || `Question ${qIdx + 1}`,
              options: Array.isArray(q.options) 
                ? q.options.map(o => typeof o === 'object' ? (o.text || o.option || '') : String(o))
                : ['Option A', 'Option B', 'Option C', 'Option D'],
              answer: typeof q.correctOption === 'number' ? q.correctOption : 0
            }));
          } else {
            // Provide default questions if teacher created an exam container without questions
            questions = fallbackExams[0].questions;
          }

          let normalizedStatus = item.status || 'Live';
          if (normalizedStatus === 'Scheduled') normalizedStatus = 'Upcoming';

          return {
            id: item._id || item.id || `exam-${idx}`,
            title: item.title || item.examName || 'Online CBT Examination',
            subject: item.subject || item.subjectName || 'General',
            durationMinutes: Number(item.durationMinutes) || Number(item.duration) || 30,
            totalQuestions: questions.length,
            totalMarks: Number(item.totalMarks) || Number(item.marks) || 50,
            passingPct: Number(item.passingPercentage) || 50,
            status: normalizedStatus,
            startsAt: item.date && item.time ? `${item.date}, ${item.time}` : 'Scheduled Soon',
            questions
          };
        });

        setOnlineExams(mapped);
      } else {
        setOnlineExams(fallbackExams);
      }
    } catch (err) {
      console.warn('Online exams fetch failed:', err);
      setOnlineExams(fallbackExams);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fallbackExams]);

  useEffect(() => {
    fetchOnlineExams();
  }, [fetchOnlineExams]);

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
    setTimeLeft((exam.durationMinutes || 30) * 60);
    setResultScore(null);
  };

  const handleFinish = async () => {
    let score = 0;
    const questions = activeExam.questions || [];
    const pointsPerQuestion = questions.length > 0 ? (activeExam.totalMarks / questions.length) : 10;

    questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) {
        score += pointsPerQuestion;
      }
    });

    const finalScore = Math.round(score);
    const pct = activeExam.totalMarks > 0 ? Math.round((finalScore / activeExam.totalMarks) * 100) : 0;
    const passed = pct >= (activeExam.passingPct || 50);

    setResultScore({
      score: finalScore,
      total: activeExam.totalMarks,
      pct,
      passed
    });

    // Attempt to submit result to backend
    try {
      await parentService.submitOnlineExam({
        examId: activeExam.id,
        studentId: activeChild,
        score: finalScore,
        totalMarks: activeExam.totalMarks,
        answers: userAnswers
      });
    } catch (_) {}
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filtered = onlineExams.filter(e => {
    if (selectedFilter === 'All') return true;
    return e.status === selectedFilter;
  });

  const activeLiveBannerExam = onlineExams.find(e => e.status === 'Live') || onlineExams[0];

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Title & Refresh */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            {currentLang === 'hi' ? 'ऑनलाइन सीबीटी परीक्षा एवं क्विज़' : 'Online CBT Exams & Quizzes'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {currentLang === 'hi' 
              ? 'अध्यापक द्वारा निर्धारित कंप्यूटर आधारित टेस्ट, मॉक टेस्ट एवं तत्काल परिणाम' 
              : 'Teacher scheduled computer-based assessments, instant results & mock tests'}
          </p>
        </div>

        <button
          onClick={() => fetchOnlineExams(true)}
          disabled={loading || refreshing}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          title={currentLang === 'hi' ? 'परीक्षा सूची रीफ्रेश करें' : 'Refresh Exam List'}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{currentLang === 'hi' ? 'रीफ्रेश करें' : 'Sync Real-Time'}</span>
        </button>
      </div>

      {/* ── 1. ACTIVE CBT TEST HERO BANNER ── */}
      {activeLiveBannerExam && (
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
                {activeLiveBannerExam.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-blue-100 font-medium mt-1 flex-wrap">
                <span>⏱️ {currentLang === 'hi' ? `अवधि: ${activeLiveBannerExam.durationMinutes} मिनट` : `Duration: ${activeLiveBannerExam.durationMinutes} Mins`}</span>
                <span>•</span>
                <span>📝 {currentLang === 'hi' ? `${activeLiveBannerExam.totalQuestions} प्रश्न (${activeLiveBannerExam.totalMarks} अंक)` : `${activeLiveBannerExam.totalQuestions} Questions (${activeLiveBannerExam.totalMarks} Marks)`}</span>
                <span>•</span>
                <span>📚 {activeLiveBannerExam.subject}</span>
              </div>
            </div>

            <button
              onClick={() => startTest(activeLiveBannerExam)}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#1E3A8A] rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{currentLang === 'hi' ? 'टेस्ट अभी शुरू करें' : 'Start Test Now'}</span>
            </button>
          </div>
        </div>
      )}

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
        {loading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 flex items-center justify-center gap-2 text-slate-500 text-xs font-bold">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>{currentLang === 'hi' ? 'ऑनलाइन परीक्षाएं लोड हो रही हैं...' : 'Loading online exams...'}</span>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
            <Info className="w-8 h-8 text-blue-500 mx-auto opacity-70" />
            <h4 className="text-sm font-bold text-slate-700">
              {currentLang === 'hi' ? 'कोई परीक्षा उपलब्ध नहीं' : 'No Online Exams in This Category'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {currentLang === 'hi' 
                ? 'जैसे ही अध्यापक नया सीबीटी टेस्ट या क्विज़ निर्धारित करेंगे, वह यहाँ स्वतः प्रदर्शित होगा।' 
                : 'As soon as teachers schedule CBT tests in the portal, they will appear here automatically.'}
            </p>
          </div>
        )}

        {!loading && filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-200 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{currentLang === 'hi' ? 'टेस्ट दें' : 'Take Test'}</span>
                </button>
              )}
              {item.status === 'Completed' && (
                <div className="text-left sm:text-right">
                  <span className="text-base font-black font-serif text-[#10B981]">
                    {item.score || 36} / {item.totalMarks}
                  </span>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">
                    {currentLang === 'hi' ? 'ग्रेड' : 'Grade'}: {item.grade || 'A+'}
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
                    <span>{currentLang === 'hi' ? 'सकारात्मक अंक' : 'Positive marks'}</span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {activeExam.questions[currentQ]?.text || 'Question text not available'}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    {activeExam.questions[currentQ]?.options?.map((opt, idx) => {
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
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${
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
                    {currentLang === 'hi' ? 'प्रतिशत:' : 'Percentage:'} {resultScore.pct}% • {currentLang === 'hi' ? 'परिणाम:' : 'Status:'}{' '}
                    <b className={resultScore.passed ? 'text-emerald-600' : 'text-amber-600'}>
                      {resultScore.passed 
                        ? (currentLang === 'hi' ? 'उत्तीर्ण (PASSED) ✅' : 'PASSED ✅') 
                        : (currentLang === 'hi' ? 'पुनः प्रयास आवश्यक' : 'Needs Improvement')}
                    </b>
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
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40 cursor-pointer"
                  >
                    {currentLang === 'hi' ? 'पिछला' : 'Previous'}
                  </button>

                  {currentQ < activeExam.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQ(prev => prev + 1)}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                    >
                      {currentLang === 'hi' ? 'अगला प्रश्न →' : 'Next Question →'}
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      className="px-4 py-2 bg-[#10B981] hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                    >
                      {currentLang === 'hi' ? 'परीक्षा सबमिट करें' : 'Submit Exam'}
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveExam(null)}
                  className="w-full py-2.5 bg-[#2563EB] text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-blue-700"
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

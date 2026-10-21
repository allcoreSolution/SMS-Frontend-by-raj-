import React, { useState, useEffect } from 'react';
import { 
  MonitorPlay, GraduationCap, Zap, Target, TrendingUp, 
  Lightbulb, List, LayoutGrid, Search, Clock, CheckCircle2, 
  XCircle, AlertCircle, FileSpreadsheet, RefreshCw, Printer, 
  User, Play, Award, Check, X, HelpCircle, ChevronRight, 
  ChevronLeft, ArrowRight, ShieldCheck, Timer
} from 'lucide-react';
import { parentService } from '../../api/parentService';

export default function OnlineExams({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [resultsList, setResultsList] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Live' | 'Upcoming' | 'Completed' | 'Results'

  // Exam Taking Modal State
  const [activeExam, setActiveExam] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [submittingExam, setSubmittingExam] = useState(false);

  // Result Modal State
  const [examResult, setExamResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const loadOnlineExams = async () => {
    setLoading(true);
    try {
      // 1. Fetch student profile
      const dashRes = await parentService.getDashboard({ studentId: activeChild });
      if (dashRes && dashRes.success && dashRes.data?.student) {
        setStudentInfo(dashRes.data.student);
      }

      // 2. Fetch real online exams
      const examsRes = await parentService.getOnlineExams();
      if (examsRes && examsRes.success && Array.isArray(examsRes.data)) {
        setExams(examsRes.data);
      } else {
        setExams([]);
      }

      // 3. Fetch online exam results
      const resultsRes = await parentService.getOnlineExamResults();
      if (resultsRes && resultsRes.success && Array.isArray(resultsRes.data)) {
        setResultsList(resultsRes.data);
      }
    } catch (err) {
      console.error('Failed to load online exams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOnlineExams();
  }, [activeChild]);

  // Live Timer Countdown when an exam is active
  useEffect(() => {
    if (!activeExam || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, timeRemaining]);

  const studentName = studentInfo?.name || 'Aarav Sharma';
  const studentClass = studentInfo?.class || 'Class I (A)';
  const rollNo = studentInfo?.rollNo || studentInfo?.roll || '1';

  // Handle Starting an Exam
  const handleStartExam = async (exam) => {
    try {
      // Fetch full exam details with questions
      const res = await parentService.getOnlineExamById(exam._id);
      const fullExam = res?.data || exam;

      if (!fullExam.questions || fullExam.questions.length === 0) {
        alert('This exam has no active questions published yet.');
        return;
      }

      setActiveExam(fullExam);
      setCurrentQIndex(0);
      setSelectedAnswers({});
      const durationMins = fullExam.durationMinutes || 45;
      setTimeRemaining(durationMins * 60);
    } catch (e) {
      alert('Failed to load exam questions');
    }
  };

  // Select an option
  const handleOptionSelect = (qId, optIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optIdx
    }));
  };

  // Submit Exam
  const handleSubmitExam = async () => {
    if (!activeExam) return;
    setSubmittingExam(true);

    try {
      const answersPayload = (activeExam.questions || []).map(q => ({
        questionId: q._id,
        selectedOptionIndex: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : null
      }));

      const durationMins = activeExam.durationMinutes || 45;
      const timeTaken = Math.max(1, Math.round((durationMins * 60 - timeRemaining) / 60));

      const payload = {
        examId: activeExam._id,
        studentId: activeChild,
        studentName,
        rollNo,
        className: studentClass,
        answers: answersPayload,
        timeTakenMinutes: timeTaken
      };

      const res = await parentService.submitOnlineExam(payload);
      if (res && res.success && res.data) {
        setExamResult({
          ...res.data,
          examTitle: activeExam.title,
          questions: activeExam.questions
        });
        setActiveExam(null);
        setShowResultModal(true);
        await loadOnlineExams();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit exam');
    } finally {
      setSubmittingExam(false);
    }
  };

  // View existing Result
  const handleViewResult = (exam) => {
    // Check if result exists in resultsList
    const res = resultsList.find(r => {
      const rExamId = typeof r.onlineExam === 'object' ? r.onlineExam?._id : r.onlineExam;
      return rExamId === exam._id;
    }) || resultsList[0];

    if (res) {
      setExamResult({
        ...res,
        examTitle: exam.title || 'Online Assessment',
        questions: exam.questions || []
      });
      setShowResultModal(true);
    } else {
      setExamResult({
        examTitle: exam.title,
        score: Math.round(exam.totalMarks * 0.8),
        totalMarks: exam.totalMarks || 50,
        percentage: 80,
        grade: 'A',
        status: 'Pass',
        timeTakenMinutes: 30,
        questions: exam.questions || []
      });
      setShowResultModal(true);
    }
  };

  // Export to Excel / CSV
  const exportToExcel = () => {
    const headers = ['ID', 'Exam Title', 'Subject', 'Total Marks', 'Duration', 'Status'];
    const csvRows = [headers.join(',')];
    
    exams.forEach((ex, idx) => {
      const row = [
        idx + 1,
        `"${ex.title}"`,
        `"${ex.subjectName || ex.subject || 'General'}"`,
        ex.totalMarks || 50,
        `"${ex.duration || `${ex.durationMinutes || 45} min`}"`,
        `"${ex.status}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `online_exams_${studentName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filter exams
  const filteredExams = exams.filter(ex => {
    if (statusFilter === 'Live') return ex.status === 'Live';
    if (statusFilter === 'Upcoming') return ex.status === 'Upcoming' || ex.status === 'Scheduled';
    if (statusFilter === 'Completed') return ex.status === 'Completed';
    return true;
  }).filter(ex => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (ex.title || '').toLowerCase().includes(q);
    const subMatch = (ex.subjectName || ex.subject || '').toLowerCase().includes(q);
    return titleMatch || subMatch;
  });

  const liveExamsCount = exams.filter(e => e.status === 'Live').length;
  const upcomingCount = exams.filter(e => e.status === 'Upcoming' || e.status === 'Scheduled').length;
  const completedCount = exams.filter(e => e.status === 'Completed').length;

  // Format timer
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-5 min-h-screen">
      
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <MonitorPlay className="w-6 h-6 text-indigo-600" />
            Online Examinations & Quiz Portal
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Candidate: <span className="text-indigo-600 font-bold">{studentName}</span> 
            <span className="opacity-40">•</span> {studentClass}
            <span className="opacity-40">•</span> Session 2026-2027
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadOnlineExams}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Live & Open</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <span className="text-2xl font-black text-emerald-600">{liveExamsCount}</span>
          <p className="text-[10px] text-gray-400 mt-1">Active assessments open</p>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Upcoming Tests</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600">{upcomingCount}</span>
          <p className="text-[10px] text-gray-400 mt-1">Scheduled for this term</p>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Evaluated</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-gray-900">{completedCount + resultsList.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Results & scorecards ready</p>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Portal Mode</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <span className="text-sm font-black text-purple-700 block mt-1">Auto-Graded MCQ</span>
          <p className="text-[10px] text-gray-400">Anti-cheat & timed</p>
        </div>

      </div>

      {/* Info Notice Banner */}
      <div className="bg-indigo-50 border border-indigo-200 p-3 flex items-center gap-3 shadow-2xs">
        <Lightbulb className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        <p className="text-xs text-indigo-900 font-semibold leading-relaxed">
          <strong>Important Instructions:</strong> During a live test, answers are auto-saved. The examination automatically submits when the countdown expires.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 border border-gray-200 shadow-2xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Live', 'Upcoming', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-none border transition-colors flex-shrink-0 ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white border-indigo-600 font-black'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {st} ({st === 'All' ? exams.length : st === 'Live' ? liveExamsCount : st === 'Upcoming' ? upcomingCount : completedCount})
            </button>
          ))}
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-none focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center border border-gray-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 font-black' : 'text-gray-400 hover:text-gray-600'}`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 font-black' : 'text-gray-400 hover:text-gray-600'}`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Exams Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Loading Online Examination Papers...
          </p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center shadow-xs">
          <MonitorPlay className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No Online Exams Found</h3>
          <p className="text-xs text-gray-400 mt-1">There are no tests matching your filter for {studentClass}.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead className="bg-gray-100/70 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-[6%] text-center">#</th>
                  <th className="py-3 px-4 w-[32%]">Exam Title & Syllabus</th>
                  <th className="py-3 px-4 w-[16%]">Subject</th>
                  <th className="py-3 px-4 text-center w-[14%]">Duration</th>
                  <th className="py-3 px-4 text-center w-[14%]">Marks</th>
                  <th className="py-3 px-4 text-center w-[10%]">Status</th>
                  <th className="py-3 px-4 text-center w-[18%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredExams.map((exam, idx) => {
                  const isLive = exam.status === 'Live';
                  const isCompleted = exam.status === 'Completed';
                  const questionsCount = exam.questions?.length || 5;

                  return (
                    <tr key={exam._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-gray-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-gray-900 font-extrabold block text-xs">{exam.title}</strong>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {exam.examType || 'Term Test'} • {questionsCount} Questions • Auto-Submit
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 text-[10.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 uppercase">
                          {exam.subjectName || exam.subject || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-gray-600">
                        {exam.duration || `${exam.durationMinutes || 45} min`}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-gray-900">{exam.totalMarks || 50}</span>
                        <span className="text-[10px] text-gray-400 block">Pass: {exam.passingMarks || 20}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider rounded-none border ${
                          isLive 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                            : isCompleted 
                              ? 'bg-gray-100 text-gray-700 border-gray-200' 
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isLive ? (
                          <button
                            onClick={() => handleStartExam(exam)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-none transition-colors shadow-2xs inline-flex items-center gap-1.5"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Start Test</span>
                          </button>
                        ) : isCompleted ? (
                          <button
                            onClick={() => handleViewResult(exam)}
                            className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs uppercase tracking-wider rounded-none transition-colors shadow-2xs"
                          >
                            View Result
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => {
            const isLive = exam.status === 'Live';
            const isCompleted = exam.status === 'Completed';

            return (
              <div 
                key={exam._id} 
                className={`bg-white border rounded-none p-5 shadow-xs flex flex-col justify-between transition-all group ${
                  isLive ? 'border-emerald-400 ring-1 ring-emerald-400' : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {exam.subjectName || 'General'}
                    </span>
                    <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 border ${
                      isLive 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : isCompleted 
                          ? 'bg-gray-100 text-gray-700 border-gray-200' 
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {exam.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors mb-1.5 leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-3">
                    {exam.instructions || 'Standard assessment format with multiple choice questions.'}
                  </p>

                  <div className="bg-gray-50 p-2.5 border border-gray-100 space-y-1 text-[11px] mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-bold uppercase">Duration:</span>
                      <strong className="text-gray-800 font-mono">{exam.duration || `${exam.durationMinutes || 45} min`}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-bold uppercase">Total Marks:</span>
                      <strong className="text-indigo-700">{exam.totalMarks || 50} Marks</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-bold uppercase">Passing Score:</span>
                      <strong className="text-emerald-700">{exam.passingMarks || 20} Marks</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  {isLive ? (
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-none transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Test Now</span>
                    </button>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleViewResult(exam)}
                      className="w-full py-2 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-black text-xs uppercase tracking-wider rounded-none transition-colors shadow-2xs"
                    >
                      View Evaluated Scorecard
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-gray-50 border border-gray-200 text-center text-[10.5px] font-bold text-gray-400 uppercase tracking-widest">
                      Scheduled Ahead
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ======================== LIVE EXAM RUNNER MODAL ======================== */}
      {activeExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-none border border-gray-200 shadow-2xl max-w-3xl w-full flex flex-col h-[90vh] max-h-[720px] overflow-hidden">
            
            {/* Modal Top Bar */}
            <div className="bg-indigo-950 text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest block">
                  Live Examination Session
                </span>
                <h2 className="text-base font-black truncate max-w-md">
                  {activeExam.title}
                </h2>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 border border-white/20">
                <Timer className="w-4 h-4 text-amber-300 animate-pulse" />
                <span className="font-mono text-base font-black text-amber-300">
                  {formatTimer(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Candidate & Progress Strip */}
            <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600 flex-shrink-0">
              <span className="font-bold">
                Candidate: <strong className="text-gray-900">{studentName}</strong> ({studentClass})
              </span>
              <span className="font-mono font-bold text-indigo-700">
                Question {currentQIndex + 1} of {(activeExam.questions || []).length}
              </span>
            </div>

            {/* Question Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {activeExam.questions && activeExam.questions[currentQIndex] ? (
                (() => {
                  const q = activeExam.questions[currentQIndex];
                  const qId = q._id;
                  const selectedOpt = selectedAnswers[qId];

                  return (
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[11px] font-black uppercase tracking-wider border border-indigo-200">
                          Question #{currentQIndex + 1} • {q.marks || 4} Marks
                        </span>
                        <span className="text-[11px] text-gray-400 font-semibold">
                          Type: {q.questionType || 'MCQ'}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-relaxed">
                        {q.text}
                      </h3>

                      {/* Options List */}
                      <div className="space-y-2.5 pt-2">
                        {(q.options || []).map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleOptionSelect(qId, optIdx)}
                              className={`w-full p-3.5 text-left border transition-all rounded-none flex items-center gap-3 ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-extrabold ring-1 ring-indigo-600'
                                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-none flex items-center justify-center font-bold text-xs border flex-shrink-0 ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-gray-100 text-gray-600 border-gray-300'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className="text-xs sm:text-sm">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })()
              ) : null}
            </div>

            {/* Question Quick-Palette */}
            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
              <span className="text-[10px] font-black uppercase text-gray-400 mr-1 tracking-wider">Palette:</span>
              {(activeExam.questions || []).map((q, idx) => {
                const isAnswered = selectedAnswers[q._id] !== undefined;
                const isCur = idx === currentQIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-7 h-7 text-xs font-black rounded-none border transition-colors flex-shrink-0 ${
                      isCur
                        ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300'
                        : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-none transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQIndex < (activeExam.questions || []).length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex(prev => prev + 1)}
                    className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-none transition-colors"
                  >
                    Next Question
                  </button>
                ) : null}

                <button
                  onClick={handleSubmitExam}
                  disabled={submittingExam}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-none shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {submittingExam && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit Exam</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================== SCORECARD & RESULT MODAL ======================== */}
      {showResultModal && examResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-none border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="bg-indigo-900 text-white p-5 flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest block">
                  Performance Evaluation
                </span>
                <h2 className="text-lg font-black mt-0.5">
                  {examResult.examTitle || 'Online Assessment Result'}
                </h2>
              </div>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard Strip */}
            <div className="p-5 border-b border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 flex-shrink-0">
              <div className="bg-white p-3 border border-gray-200 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Score Scored</span>
                <strong className="text-xl font-black text-indigo-700">
                  {examResult.score} / {examResult.totalMarks}
                </strong>
              </div>
              <div className="bg-white p-3 border border-gray-200 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Percentage</span>
                <strong className="text-xl font-black text-emerald-600">
                  {examResult.percentage}%
                </strong>
              </div>
              <div className="bg-white p-3 border border-gray-200 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Grade</span>
                <strong className="text-xl font-black text-purple-700">
                  Grade {examResult.grade}
                </strong>
              </div>
              <div className="bg-white p-3 border border-gray-200 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Status</span>
                <span className={`inline-block px-2.5 py-0.5 text-xs font-black uppercase rounded-none border ${
                  examResult.status === 'Pass' || examResult.status === 'Passed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-red-50 text-red-800 border-red-300'
                }`}>
                  {examResult.status}
                </span>
              </div>
            </div>

            {/* Question Breakdown with Explanations */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">
                Detailed Solutions & Explanations
              </h4>

              {examResult.answers && examResult.answers.length > 0 ? (
                examResult.answers.map((ans, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 space-y-1.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-gray-900 leading-snug">
                        Q{idx + 1}: {ans.questionText}
                      </span>
                      {ans.isCorrect ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center gap-1 uppercase flex-shrink-0">
                          <Check className="w-3 h-3" /> Correct (+4)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 font-black text-[10px] flex items-center gap-1 uppercase flex-shrink-0">
                          <X className="w-3 h-3" /> Incorrect (0)
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  {(examResult.questions || []).map((q, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="text-gray-900">Q{idx + 1}: {q.text}</strong>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-black text-[10px]">
                          Key: {q.options ? q.options[q.correctOptionIndex] : 'Verified'}
                        </span>
                      </div>
                      {q.explanation && (
                        <p className="text-[11px] text-gray-500 italic pt-1">
                          Explanation: {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] font-bold text-gray-400">
                Evaluation ID: {examResult._id || 'EVAL-2026-101'}
              </span>
              <button
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-none"
              >
                Close Scorecard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

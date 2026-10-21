import React, { useState, useEffect } from 'react';
import { 
  Database, Network, Star, CheckCircle2, Archive, 
  PenTool, Upload, Plus, Search, Trash2, Eye, 
  RefreshCw, Filter, AlertCircle, Sparkles, BookOpen,
  CheckCircle, HelpCircle, Layers, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OnlineExamsTabs from '../../components/assessment/OnlineExamsTabs';
import { onlineExamService } from '../../api/onlineExamService';

export default function QuestionBank() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [summary, setSummary] = useState({
    totalQuestions: 0,
    questionTypesCount: 5,
    totalMarks: 0,
    usedCount: 0,
    unusedCount: 0,
    draftCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Preview Question Modal
  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [selectedType, selectedDifficulty, selectedStatus, selectedSubject]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await onlineExamService.getQuestionBank({
        questionType: selectedType !== 'All' ? selectedType : undefined,
        difficultyLevel: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        subjectName: selectedSubject !== 'All' ? selectedSubject : undefined,
        search: searchQuery || undefined
      });

      const list = Array.isArray(res) ? res : (res?.data || []);
      setQuestions(list);
      if (res?.summary) {
        setSummary(res.summary);
      } else {
        // Calculate on-the-fly
        setSummary({
          totalQuestions: list.length,
          questionTypesCount: new Set(list.map(q => q.questionType)).size || 1,
          totalMarks: list.reduce((acc, q) => acc + (q.marks || 1), 0),
          usedCount: list.filter(q => (q.usedCount || 0) > 0).length,
          unusedCount: list.filter(q => (q.usedCount || 0) === 0).length,
          draftCount: list.filter(q => q.status === 'Draft').length
        });
      }
    } catch (err) {
      console.error('Error fetching question bank:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Questions',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleDelete = async (id, text) => {
    const result = await Swal.fire({
      title: 'Delete Question?',
      text: `Are you sure you want to delete this question? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await onlineExamService.deleteQuestion(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          timer: 1400,
          showConfirmButton: false
        });
        fetchQuestions();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err?.response?.data?.message || err.message,
          confirmButtonColor: '#7c3aed'
        });
      }
    }
  };

  // Distinct subjects from current list
  const subjects = Array.from(new Set(questions.map(q => q.subjectName).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                  Question Bank Repository
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Centralized bank of verified questions across all subjects, chapters, and formats
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button 
              onClick={() => navigate('/online-exams/question-bank/bulk-upload')}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Bulk Upload
            </button>
            <button 
              onClick={() => navigate('/online-exams/question-bank/new')}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Question
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <OnlineExamsTabs />

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-800">{summary.totalQuestions}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Questions</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl font-bold">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-purple-700">{summary.questionTypesCount || 5}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Formats</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-emerald-700">{summary.totalMarks}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Marks</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-sky-700">{summary.usedCount}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Used on Papers</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl font-bold">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-amber-700">{summary.unusedCount}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fresh / Unused</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-rose-700">{summary.draftCount}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drafts</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by text or keyword..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Formats / Types</option>
              <option value="Multiple Choice - Single Answer">MCQ (Single Answer)</option>
              <option value="Multiple Choice - Multiple Answers">MCQ (Multi Answer)</option>
              <option value="True / False">True / False</option>
              <option value="Short Answer">Short Answer</option>
              <option value="Fill in the Blanks">Fill in Blanks</option>
            </select>

            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Subjects</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
            </select>

            <button 
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </form>

          {/* Difficulty & Status Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Difficulty:</span>
              {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedDifficulty === d
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
              {['All', 'Published', 'Draft'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === s
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Questions Found ({questions.length})</span>
            </div>
            <button 
              onClick={fetchQuestions}
              className="text-xs text-purple-600 hover:text-purple-700 font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="py-14 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                <span className="font-medium text-xs">Loading Question Bank...</span>
              </div>
            ) : questions.length === 0 ? (
              <div className="py-14 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-8 h-8 text-slate-300" />
                <span className="font-semibold text-slate-700 text-sm">No Questions In This Filter</span>
                <span className="text-xs text-slate-400">Click "Add New Question" or adjust search filters.</span>
              </div>
            ) : (
              questions.map((q, idx) => (
                <div key={q._id || idx} className="p-5 hover:bg-slate-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-bold text-[10px] rounded-md">
                        #{idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200/50 font-bold text-[10px] rounded-full">
                        {q.questionType}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        q.difficultyLevel === 'Easy' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : q.difficultyLevel === 'Hard'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {q.difficultyLevel || 'Medium'}
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {q.marks || 1} Mark{q.marks > 1 ? 's' : ''}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        q.status === 'Published' ? 'bg-emerald-100/60 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-800 leading-snug">
                      {q.text}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                      <span>Class: <strong className="text-slate-600">{q.className || 'General'}</strong></span>
                      <span>•</span>
                      <span>Subject: <strong className="text-slate-600">{q.subjectName || 'General'}</strong></span>
                      {q.chapter && (
                        <>
                          <span>•</span>
                          <span>Chapter: <strong className="text-slate-600">{q.chapter}</strong></span>
                        </>
                      )}
                      {q.topic && (
                        <>
                          <span>•</span>
                          <span>Topic: <strong className="text-slate-600">{q.topic}</strong></span>
                        </>
                      )}
                      <span>•</span>
                      <span>Used in: <strong className="text-purple-600">{q.usedCount || 0} papers</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button 
                      onClick={() => setActiveQuestion(q)}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button 
                      onClick={() => handleDelete(q._id, q.text)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ===================== PREVIEW QUESTION MODAL ===================== */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                  {activeQuestion.questionType}
                </span>
                <h3 className="font-bold text-slate-800 text-base">Question Preview</h3>
              </div>
              <button 
                onClick={() => setActiveQuestion(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Marks: {activeQuestion.marks || 1} • Level: {activeQuestion.difficultyLevel || 'Medium'}
                </div>
                <div className="text-sm font-black text-slate-800">
                  {activeQuestion.text}
                </div>
              </div>

              {activeQuestion.options && activeQuestion.options.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">Options:</span>
                  <div className="space-y-2">
                    {activeQuestion.options.map((opt, i) => {
                      const isCorrect = Number(activeQuestion.correctOptionIndex) === i;
                      return (
                        <div 
                          key={i} 
                          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                            isCorrect 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' 
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                              <CheckCircle className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeQuestion.explanation && (
                <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 text-xs">
                  <span className="font-bold text-purple-700 block mb-0.5">Solution & Explanation:</span>
                  <p className="text-slate-600">{activeQuestion.explanation}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveQuestion(null)}
                  className="px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

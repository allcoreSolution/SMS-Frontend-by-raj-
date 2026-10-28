import React, { useState, useEffect } from 'react';
import { 
  Target, Search, BookOpen, Clock, User, Award, 
  CheckCircle2, RefreshCw, X, ShieldCheck, Star, 
  MapPin, Sparkles, Filter, ChevronRight, Zap, Check
} from 'lucide-react';
import { parentService } from '../../api/parentService';

const CATEGORIES = [
  'All',
  'Competitive Exams',
  'Academic Foundation',
  'STEM & Robotics',
  'Language & Arts',
  'Sports & Fitness',
  'My Enrolled'
];

export default function Coaching({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollModalProgram, setEnrollModalProgram] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [guardianPhone, setGuardianPhone] = useState('9876543210');
  const [notes, setNotes] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const loadCoachingData = async () => {
    setLoading(true);
    try {
      // 1. Fetch student info
      const dashRes = await parentService.getDashboard({ studentId: activeChild });
      if (dashRes && dashRes.success && dashRes.data?.student) {
        setStudentInfo(dashRes.data.student);
        if (dashRes.data.student.studentPhone || dashRes.data.student.fatherPhone) {
          setGuardianPhone(dashRes.data.student.fatherPhone || dashRes.data.student.studentPhone);
        }
      }

      // 2. Fetch coaching programs
      const res = await parentService.getCoachingPrograms({ studentId: activeChild });
      if (res && res.success && Array.isArray(res.data)) {
        setPrograms(res.data);
      } else {
        setPrograms([]);
      }
    } catch (err) {
      console.error('Failed to load coaching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoachingData();
  }, [activeChild]);

  const studentName = studentInfo?.name || 'Aarav Sharma';
  const studentClass = studentInfo?.class || 'Class I (A)';

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!enrollModalProgram) return;

    setEnrolling(true);
    try {
      const res = await parentService.enrollInCoaching({
        programId: enrollModalProgram._id,
        studentId: activeChild,
        guardianPhone,
        notes
      });

      if (res && res.success) {
        setSuccessToast(res.message || 'Successfully enrolled!');
        setEnrollModalProgram(null);
        setNotes('');
        await loadCoachingData();
        setTimeout(() => setSuccessToast(''), 5000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleWithdraw = async (program) => {
    if (!window.confirm(`Are you sure you want to withdraw ${studentName} from ${program.title}?`)) {
      return;
    }

    try {
      const res = await parentService.withdrawCoaching({
        programId: program._id,
        studentId: activeChild
      });

      if (res && res.success) {
        setSuccessToast(`Withdrawal confirmed from ${program.title}`);
        await loadCoachingData();
        setTimeout(() => setSuccessToast(''), 5000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw');
    }
  };

  // Filter programs based on category & search
  const filteredPrograms = programs.filter(p => {
    // Category filter
    if (selectedCategory === 'My Enrolled') {
      if (!p.isEnrolled) return false;
    } else if (selectedCategory !== 'All') {
      if (p.category !== selectedCategory) return false;
    }

    // Search query
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (p.title || '').toLowerCase().includes(q);
    const descMatch = (p.description || '').toLowerCase().includes(q);
    const instMatch = (p.instructor?.name || '').toLowerCase().includes(q);
    return titleMatch || descMatch || instMatch;
  });

  const enrolledCount = programs.filter(p => p.isEnrolled).length;

  return (
    <div className="p-3 sm:p-5 md:p-6 max-w-7xl mx-auto space-y-6 min-h-screen bg-[#F8FAFF] pb-24 font-sans">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl shadow-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-blue-900/15 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner shrink-0">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Coaching &amp; Olympiad Center
                </h1>
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Academic Foundation
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1">
                Extracurricular, STEM, &amp; Advanced Training for <span className="font-bold text-white">{studentName}</span> • {studentClass}
              </p>
            </div>
          </div>

          <button
            onClick={loadCoachingData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold rounded-2xl transition-all shadow-sm self-start sm:self-auto cursor-pointer backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Programs</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Available Batches</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{programs.length}</span>
          <p className="text-[10.5px] sm:text-[11px] text-slate-400 mt-1 font-medium truncate">Multi-discipline tracks</p>
        </div>
        <div className="bg-white p-3.5 sm:p-5 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Enrolled by Candidate</span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 leading-none">{enrolledCount}</span>
          <p className="text-[10.5px] sm:text-[11px] text-slate-400 mt-1 font-medium truncate">Active modules</p>
        </div>
        <div className="bg-white p-3.5 sm:p-5 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Faculty Mentors</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 leading-none">6 Leads</span>
          <p className="text-[10.5px] sm:text-[11px] text-slate-400 mt-1 font-medium truncate">Certified coaches</p>
        </div>
        <div className="bg-white p-3.5 sm:p-5 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Scholarship / Fee</span>
          <span className="text-xs sm:text-sm font-black text-purple-700 block mt-1 truncate">Curriculum Covered</span>
          <p className="text-[10.5px] sm:text-[11px] text-slate-400 mt-1 font-medium truncate">No extra charges</p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <span>{cat}</span>
              {cat === 'My Enrolled' && enrolledCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  selectedCategory === cat ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
                }`}>
                  {enrolledCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search module or mentor..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
          />
        </div>
      </div>

      {/* Program Cards Grid */}
      {loading ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-16 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Loading Coaching Modules...
          </p>
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-xs">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Coaching Modules Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching a different term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrograms.map((prog) => {
            const isEnrolled = prog.isEnrolled;

            return (
              <div 
                key={prog._id} 
                className={`bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between transition-all group ${
                  isEnrolled ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' : 'border-slate-200/90 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                      {prog.category}
                    </span>
                    {isEnrolled ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Enrolled Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {prog.rating || 4.8} ({prog.enrolledCount || 24})
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
                    {prog.description}
                  </p>

                  {/* Program Features / Highlights */}
                  {prog.features && prog.features.length > 0 && (
                    <div className="space-y-1 mb-3 pt-2.5 border-t border-slate-100">
                      {prog.features.slice(0, 2).map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Faculty & Schedule Meta */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <strong className="text-slate-900 font-bold block">{prog.instructor?.name}</strong>
                        <span className="text-[11px] text-slate-400 truncate">{prog.instructor?.designation}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{prog.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{prog.venue} ({prog.mode})</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                    {prog.fees || 'Complimentary'}
                  </span>

                  {isEnrolled ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleWithdraw(prog)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        Withdraw
                      </button>
                      <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" /> Enrolled
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEnrollModalProgram(prog)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Enroll Child</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Enrollment Confirmation Modal */}
      {enrollModalProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">
                  Confirm Module Enrollment
                </span>
                <h3 className="text-base font-black text-slate-900 leading-tight mt-0.5">
                  {enrollModalProgram.title}
                </h3>
              </div>
              <button 
                onClick={() => setEnrollModalProgram(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Candidate:</span>
                  <strong className="text-slate-900">{studentName} ({studentClass})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Faculty Lead:</span>
                  <span className="text-slate-800 font-medium">{enrollModalProgram.instructor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Batch Timing:</span>
                  <span className="text-blue-700 font-bold">{enrollModalProgram.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Venue / Mode:</span>
                  <span className="text-slate-800 font-medium">{enrollModalProgram.venue}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Parent / Guardian WhatsApp Phone:</label>
                <input
                  type="text"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 font-mono text-xs font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Batch reminder notifications will be dispatched here.</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Optional Notes or Focus Areas:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Focus on Olympiad mathematics speed..."
                  className="w-full p-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 text-xs font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEnrollModalProgram(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                >
                  {enrolling && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{enrolling ? 'Enrolling...' : 'Confirm Enrollment'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

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
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-5 min-h-screen">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Target className="w-6 h-6 text-indigo-600" />
            Coaching Center & Olympiad Modules
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Extracurricular & Advanced Training for <span className="text-indigo-600 font-bold">{studentName}</span> • {studentClass}
          </p>
        </div>

        <button
          onClick={loadCoachingData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-none shadow-2xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Programs</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Available Batches</span>
          <span className="text-2xl font-black text-gray-900">{programs.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Multi-discipline tracks</p>
        </div>
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Enrolled by Candidate</span>
          <span className="text-2xl font-black text-indigo-700">{enrolledCount}</span>
          <p className="text-[10px] text-gray-400 mt-1">Active specialized modules</p>
        </div>
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Faculty Mentors</span>
          <span className="text-2xl font-black text-emerald-600">6 Leads</span>
          <p className="text-[10px] text-gray-400 mt-1">Certified Olympiad coaches</p>
        </div>
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Scholarship / Fee</span>
          <span className="text-sm font-black text-purple-700 block mt-1">Curriculum Covered</span>
          <p className="text-[10px] text-gray-400">No extra charges</p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 border border-gray-200 shadow-2xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-none border transition-colors flex-shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 font-black'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span>{cat}</span>
              {cat === 'My Enrolled' && enrolledCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-none font-black ${
                  selectedCategory === cat ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
                }`}>
                  {enrolledCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search module or mentor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-none focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Program Cards Grid */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Loading Coaching Modules...
          </p>
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center shadow-xs">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No Coaching Modules Found</h3>
          <p className="text-xs text-gray-400 mt-1">Try resetting the category filter or searching a different term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map((prog) => {
            const isEnrolled = prog.isEnrolled;

            return (
              <div 
                key={prog._id} 
                className={`bg-white border rounded-none p-5 shadow-xs flex flex-col justify-between transition-all group ${
                  isEnrolled ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/10' : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div>
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {prog.category}
                    </span>
                    {isEnrolled ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Enrolled Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {prog.rating || 4.8} ({prog.enrolledCount || 24})
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors mb-1.5 leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-[11.5px] text-gray-600 leading-relaxed mb-3">
                    {prog.description}
                  </p>

                  {/* Program Features / Highlights */}
                  {prog.features && prog.features.length > 0 && (
                    <div className="space-y-1 mb-3 pt-2 border-t border-gray-100">
                      {prog.features.slice(0, 2).map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10.5px] text-gray-600 font-medium">
                          <Zap className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Faculty & Schedule Meta */}
                  <div className="space-y-1.5 pt-2.5 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <div className="truncate">
                        <strong className="text-gray-900 font-bold">{prog.instructor?.name}</strong>
                        <span className="text-[10.5px] text-gray-400 block truncate">{prog.instructor?.designation}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span>{prog.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{prog.venue} ({prog.mode})</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-emerald-700 uppercase">
                    {prog.fees || 'Complimentary'}
                  </span>

                  {isEnrolled ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleWithdraw(prog)}
                        className="text-[10.5px] font-bold text-red-600 hover:text-red-800 underline transition-colors"
                      >
                        Withdraw
                      </button>
                      <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Confirmed
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEnrollModalProgram(prog)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors shadow-2xs flex items-center gap-1"
                    >
                      <span>Enroll Child</span>
                      <ChevronRight className="w-3 h-3" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-none border border-gray-200 shadow-xl max-w-md w-full p-5 space-y-4">
            
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  Confirm Module Enrollment
                </span>
                <h3 className="text-base font-black text-gray-900 leading-tight mt-0.5">
                  {enrollModalProgram.title}
                </h3>
              </div>
              <button 
                onClick={() => setEnrollModalProgram(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Candidate:</span>
                  <strong className="text-gray-900">{studentName} ({studentClass})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Faculty Lead:</span>
                  <span className="text-gray-800">{enrollModalProgram.instructor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Batch Timing:</span>
                  <span className="text-indigo-700 font-bold">{enrollModalProgram.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Venue / Mode:</span>
                  <span className="text-gray-800">{enrollModalProgram.venue}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Parent / Guardian WhatsApp Phone:</label>
                <input
                  type="text"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 font-mono text-xs"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Batch reminder notifications will be dispatched here.</span>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Optional Notes or Focus Areas:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Focus on Olympiad mathematics speed..."
                  className="w-full p-2 border border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEnrollModalProgram(null)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider text-[11px] shadow-sm flex items-center gap-1.5"
                >
                  {enrolling && <RefreshCw className="w-3 h-3 animate-spin" />}
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

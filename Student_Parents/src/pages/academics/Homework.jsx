import React, { useState, useEffect } from 'react';
import { 
  PenLine, Clock, CheckCircle2, AlertCircle, History, 
  Folder, FileText, RefreshCw, BookOpen, Download, 
  Upload, Search, Filter, Calendar, User, Printer, 
  X, Check, Award, MessageSquare, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import { parentService } from '../../api/parentService';

const SUBJECT_COLORS = {
  'Mathematics': 'bg-blue-50 text-blue-700 border-blue-200',
  'General Science': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'English Literature': 'bg-purple-50 text-purple-700 border-purple-200',
  'Hindi Language': 'bg-amber-50 text-amber-700 border-amber-200',
  'Computer Applications': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Social Studies': 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function Homework({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [homeworkList, setHomeworkList] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'list'
  const [statusTab, setStatusTab] = useState('All'); // 'All' | 'Pending' | 'Submitted' | 'Evaluated'
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Submit Modal State
  const [submitModalHw, setSubmitModalHw] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [solutionFile, setSolutionFile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Feedback Modal State
  const [feedbackHw, setFeedbackHw] = useState(null);

  const loadHomework = async () => {
    setLoading(true);
    try {
      // 1. Fetch Student profile
      const dashRes = await parentService.getDashboard({ studentId: activeChild });
      if (dashRes && dashRes.success && dashRes.data?.student) {
        setStudentInfo(dashRes.data.student);
      }

      // 2. Fetch Homework
      const res = await parentService.getHomework({ studentId: activeChild });
      if (res && res.success && Array.isArray(res.data)) {
        setHomeworkList(res.data);
      } else {
        setHomeworkList([]);
      }
    } catch (err) {
      console.error('Failed to load homework assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, [activeChild]);

  const studentName = studentInfo?.name || 'Aarav Sharma';
  const studentClass = studentInfo?.class || 'Class I (A)';

  // Handle Homework Submission
  const handleSubmissionSubmit = async (e) => {
    e.preventDefault();
    if (!submitModalHw) return;
    setSubmitting(true);

    try {
      const payload = {
        homeworkId: submitModalHw._id,
        studentId: activeChild,
        studentName,
        submissionText,
        fileUrl: solutionFile
      };

      const res = await parentService.submitHomework(payload);
      if (res && res.success) {
        setSuccessToast(`Homework for "${submitModalHw.title}" submitted successfully!`);
        setSubmitModalHw(null);
        setSubmissionText('');
        setSolutionFile('');
        await loadHomework();
        setTimeout(() => setSuccessToast(''), 5000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit homework');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter homework assignments
  const filteredHomework = homeworkList.filter(hw => {
    // Status tab filter
    const mySub = hw.mySubmission;
    const isSubmitted = hw.isSubmitted;
    const isEvaluated = mySub && mySub.evaluatedMarks !== undefined;

    if (statusTab === 'Pending') {
      if (isSubmitted) return false;
    } else if (statusTab === 'Submitted') {
      if (!isSubmitted || isEvaluated) return false;
    } else if (statusTab === 'Evaluated') {
      if (!isEvaluated) return false;
    }

    // Subject filter
    const subName = hw.subject?.subjectName || hw.subject || '';
    if (subjectFilter !== 'All' && subName !== subjectFilter) {
      return false;
    }

    // Search query
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (hw.title || '').toLowerCase().includes(q);
    const descMatch = (hw.description || '').toLowerCase().includes(q);
    const subMatch = subName.toLowerCase().includes(q);
    return titleMatch || descMatch || subMatch;
  });

  // Calculate statistics
  const pendingCount = homeworkList.filter(h => !h.isSubmitted).length;
  const submittedCount = homeworkList.filter(h => h.isSubmitted && (!h.mySubmission || h.mySubmission.evaluatedMarks === undefined)).length;
  const evaluatedCount = homeworkList.filter(h => h.mySubmission && h.mySubmission.evaluatedMarks !== undefined).length;
  const totalCount = homeworkList.length;
  const complianceRate = totalCount > 0 ? Math.round(((totalCount - pendingCount) / totalCount) * 100) : 100;

  // Extract unique subjects for dropdown
  const allSubjects = Array.from(new Set(homeworkList.map(h => h.subject?.subjectName || h.subject).filter(Boolean)));

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
            <PenLine className="w-6 h-6 text-indigo-600" />
            Daily Homework & Assignments
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Curriculum Tracker for <span className="text-indigo-600 font-bold">{studentName}</span> • {studentClass}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Diary</span>
          </button>

          <button
            onClick={loadHomework}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Pending Action</span>
            {pendingCount > 0 ? (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            ) : (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            )}
          </div>
          <span className={`text-2xl font-black ${pendingCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {pendingCount}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Requires student submission</p>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">In Review</span>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-blue-600">{submittedCount}</span>
          <p className="text-[10px] text-gray-400 mt-1">Submitted to class teacher</p>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Evaluated</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600">{evaluatedCount}</span>
          <p className="text-[10px] text-gray-400 mt-1">Feedback & marks posted</p>
        </div>

        <div className="bg-white p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Compliance</span>
            <Award className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-indigo-700">{complianceRate}%</span>
          <div className="w-full bg-gray-100 h-1 mt-1 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full" style={{ width: `${complianceRate}%` }} />
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 border border-gray-200 shadow-2xs">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'All', label: 'All Tasks', count: totalCount },
            { id: 'Pending', label: 'Pending', count: pendingCount },
            { id: 'Submitted', label: 'Under Review', count: submittedCount },
            { id: 'Evaluated', label: 'Evaluated', count: evaluatedCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-none border transition-colors flex-shrink-0 flex items-center gap-1.5 ${
                statusTab === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-600 font-black'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-none font-black ${
                statusTab === tab.id ? 'bg-white text-indigo-700' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Subject Filter & Search & View Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Dropdown */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs font-bold border border-gray-200 bg-white p-1.5 rounded-none focus:outline-none focus:border-indigo-600 text-gray-700"
          >
            <option value="All">All Subjects</option>
            {allSubjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative w-40 sm:w-56">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search homework..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-none focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 transition-colors ${viewMode === 'cards' ? 'bg-indigo-50 text-indigo-600 font-black' : 'text-gray-400 hover:text-gray-600'}`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 font-black' : 'text-gray-400 hover:text-gray-600'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Homework Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Loading Homework Diary for {studentName}...
          </p>
        </div>
      ) : filteredHomework.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center shadow-xs">
          <Folder className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-800">No Homework Found</h3>
          <p className="text-xs text-gray-400 mt-1">There are no assignments matching your selected filter.</p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHomework.map((hw) => {
            const subjectName = hw.subject?.subjectName || hw.subject || 'General Subject';
            const colorClass = SUBJECT_COLORS[subjectName] || 'bg-indigo-50 text-indigo-700 border-indigo-200';
            const teacherName = hw.assignedBy?.fullName || hw.assignedBy?.name || 'Class Teacher';
            const isSubmitted = hw.isSubmitted;
            const mySub = hw.mySubmission;
            const isEvaluated = mySub && mySub.evaluatedMarks !== undefined;

            const dueDateObj = hw.dueDate ? new Date(hw.dueDate) : new Date();
            const isOverdue = dueDateObj < new Date() && !isSubmitted;
            const dueDateStr = dueDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

            return (
              <div 
                key={hw._id}
                className={`bg-white border rounded-none p-4 shadow-xs flex flex-col justify-between transition-all group ${
                  isEvaluated
                    ? 'border-purple-300 bg-purple-50/15'
                    : isSubmitted
                      ? 'border-emerald-300 bg-emerald-50/15'
                      : isOverdue
                        ? 'border-red-300 bg-red-50/10'
                        : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div>
                  {/* Top Bar: Subject & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-none border ${colorClass}`}>
                      {subjectName}
                    </span>

                    {isEvaluated ? (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase text-purple-800 bg-purple-100 border border-purple-200 flex items-center gap-1">
                        <Award className="w-3 h-3 text-purple-600" />
                        Scored {mySub.evaluatedMarks}/{hw.maxMarks || 20}
                      </span>
                    ) : isSubmitted ? (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Submitted
                      </span>
                    ) : isOverdue ? (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase text-red-800 bg-red-100 border border-red-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        Overdue
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase text-amber-800 bg-amber-100 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Due Soon
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors mb-1.5 leading-snug">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-3">
                    {hw.description}
                  </p>

                  {/* Worksheet Attachment If Available */}
                  {hw.fileName && (
                    <div className="mb-3 p-2 bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate text-gray-700">
                        <FileText className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        <span className="font-semibold truncate text-[11px]">{hw.fileName}</span>
                      </div>
                      <a
                        href={hw.fileUrl ? (hw.fileUrl.startsWith('http') ? hw.fileUrl : `http://localhost:5050${hw.fileUrl.startsWith('/') ? '' : '/'}${hw.fileUrl}`) : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 flex-shrink-0 ml-2"
                      >
                        <Download className="w-3 h-3" />
                        <span>Worksheet</span>
                      </a>
                    </div>
                  )}

                  {/* Teacher & Due Date Meta */}
                  <div className="space-y-1 pt-2 border-t border-gray-100 text-[11.5px] text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Faculty:</span>
                      <strong className="text-gray-800">{teacherName}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Assigned:</span>
                      <span>{hw.assignDate ? new Date(hw.assignDate).toLocaleDateString('en-GB') : '16 Oct 2026'}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span>Submission Due:</span>
                      <span className={isOverdue ? 'text-red-600' : 'text-indigo-700'}>{dueDateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  {isEvaluated ? (
                    <button
                      onClick={() => setFeedbackHw(hw)}
                      className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-black uppercase tracking-wider rounded-none transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View Teacher Remarks</span>
                    </button>
                  ) : isSubmitted ? (
                    <div className="w-full py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Submitted on {new Date(mySub?.submittedAt || Date.now()).toLocaleDateString('en-GB')}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSubmitModalHw(hw)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-none transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List Table View */
        <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-100/70 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-[16%]">Subject</th>
                  <th className="py-3 px-4 w-[32%]">Assignment Title & Instructions</th>
                  <th className="py-3 px-4 text-center w-[12%]">Assigned</th>
                  <th className="py-3 px-4 text-center w-[12%]">Due Date</th>
                  <th className="py-3 px-4 text-center w-[12%]">Status</th>
                  <th className="py-3 px-4 text-center w-[16%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredHomework.map((hw, idx) => {
                  const subjectName = hw.subject?.subjectName || hw.subject || 'General';
                  const isSubmitted = hw.isSubmitted;
                  const mySub = hw.mySubmission;
                  const isEvaluated = mySub && mySub.evaluatedMarks !== undefined;

                  return (
                    <tr key={hw._id || idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">
                        <span className="block">{subjectName}</span>
                        <span className="text-[10px] text-gray-400 font-normal">Max: {hw.maxMarks || 20} Marks</span>
                      </td>
                      <td className="py-3 px-4">
                        <strong className="text-gray-900 block font-bold text-xs">{hw.title}</strong>
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{hw.description}</p>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-gray-600">
                        {hw.assignDate ? new Date(hw.assignDate).toLocaleDateString('en-GB') : '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-indigo-700">
                        {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB') : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isEvaluated ? (
                          <span className="px-2 py-0.5 text-[9.5px] font-black uppercase text-purple-800 bg-purple-100 border border-purple-200">
                            {mySub.evaluatedMarks}/{hw.maxMarks || 20}
                          </span>
                        ) : isSubmitted ? (
                          <span className="px-2 py-0.5 text-[9.5px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-200">
                            Submitted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9.5px] font-black uppercase text-amber-800 bg-amber-100 border border-amber-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isEvaluated ? (
                          <button
                            onClick={() => setFeedbackHw(hw)}
                            className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-none"
                          >
                            Remarks
                          </button>
                        ) : isSubmitted ? (
                          <span className="text-[11px] font-bold text-emerald-700">Under Review</span>
                        ) : (
                          <button
                            onClick={() => setSubmitModalHw(hw)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-none"
                          >
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================== HOMEWORK SUBMISSION MODAL ======================== */}
      {submitModalHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-none border border-gray-200 shadow-2xl max-w-lg w-full p-5 space-y-4">
            
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  Submit Homework Solution
                </span>
                <h3 className="text-base font-black text-gray-900 leading-tight mt-0.5">
                  {submitModalHw.title}
                </h3>
              </div>
              <button 
                onClick={() => setSubmitModalHw(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmissionSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-indigo-50/60 border border-indigo-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Candidate:</span>
                  <strong className="text-gray-900">{studentName} ({studentClass})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Subject:</span>
                  <span className="text-indigo-800 font-bold">{submitModalHw.subject?.subjectName || submitModalHw.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold">Max Marks:</span>
                  <span className="text-gray-800 font-mono font-bold">{submitModalHw.maxMarks || 20} Marks</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Written Answers / Work Notes:
                </label>
                <textarea
                  rows={4}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Type your answers, exercise solutions, or notes for the teacher..."
                  className="w-full p-2.5 border border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Attach Solution Document / Image Link (Optional):
                </label>
                <input
                  type="text"
                  value={solutionFile}
                  onChange={(e) => setSolutionFile(e.target.value)}
                  placeholder="e.g. /uploads/photos/homework_solution_pg1.jpg"
                  className="w-full p-2 border border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSubmitModalHw(null)}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider text-[11px] shadow-sm flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>{submitting ? 'Submitting...' : 'Confirm Submission'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================== TEACHER FEEDBACK MODAL ======================== */}
      {feedbackHw && feedbackHw.mySubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-none border border-gray-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">
                  Evaluation Feedback
                </span>
                <h3 className="text-base font-black text-gray-900 leading-tight mt-0.5">
                  {feedbackHw.title}
                </h3>
              </div>
              <button 
                onClick={() => setFeedbackHw(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-700 block">Evaluated Score</span>
                  <strong className="text-xl font-black text-purple-900">
                    {feedbackHw.mySubmission.evaluatedMarks} / {feedbackHw.maxMarks || 20}
                  </strong>
                </div>
                <span className="px-2.5 py-1 bg-white text-purple-800 font-black text-xs border border-purple-300">
                  Grade A
                </span>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 space-y-1.5">
                <span className="font-bold text-gray-700 block">Teacher Remarks:</span>
                <p className="text-gray-800 italic leading-relaxed">
                  "{feedbackHw.mySubmission.teacherRemarks || 'Satisfactory completion of assignment.'}"
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 space-y-1">
                <span className="font-bold text-gray-500 block">Submitted Notes by Student:</span>
                <p className="text-gray-700">
                  {feedbackHw.mySubmission.submissionText || 'Completed exercise.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setFeedbackHw(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-none"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

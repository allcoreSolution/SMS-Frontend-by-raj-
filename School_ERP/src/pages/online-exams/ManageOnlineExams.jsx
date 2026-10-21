import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Layers, Calendar, Clock, Award, 
  CheckCircle, Trash2, Eye, Filter, RefreshCw, X, 
  BookOpen, Sparkles, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OnlineExamsTabs from '../../components/assessment/OnlineExamsTabs';
import { onlineExamService } from '../../api/onlineExamService';
import { academicService } from '../../api/academicService';

export default function ManageOnlineExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    examType: 'Term Test',
    className: 'Class 10',
    subjectName: 'Science',
    durationMinutes: 60,
    totalMarks: 50,
    passingMarks: 20,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    status: 'Live',
    instructions: 'Answer all questions. Each question carries marks indicated. Click submit before time runs out.'
  });

  // Preview Modal
  const [previewExam, setPreviewExam] = useState(null);

  useEffect(() => {
    fetchExams();
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [clsRes, subRes] = await Promise.all([
        academicService.getClasses().catch(() => ({ data: [] })),
        academicService.getSubjects().catch(() => ({ data: [] }))
      ]);
      const clsList = Array.isArray(clsRes) ? clsRes : (clsRes?.data || []);
      const subList = Array.isArray(subRes) ? subRes : (subRes?.data || []);
      setClasses(clsList);
      setSubjects(subList);
    } catch (err) {
      console.warn('Could not load academic classes/subjects', err);
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await onlineExamService.getExams({
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        className: selectedClass !== 'All Classes' ? selectedClass : undefined,
        subjectName: selectedSubject !== 'All Subjects' ? selectedSubject : undefined,
        search: searchQuery || undefined
      });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setExams(list);
    } catch (err) {
      console.error('Error fetching online exams:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load exams',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Online Exam?',
      text: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Exam'
    });

    if (result.isConfirmed) {
      try {
        await onlineExamService.deleteExam(id);
        Swal.fire({
          icon: 'success',
          title: 'Exam Deleted',
          timer: 1500,
          showConfirmButton: false
        });
        fetchExams();
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required', text: 'Exam title is required' });
      return;
    }

    try {
      setCreating(true);
      await onlineExamService.createExam(formData);
      Swal.fire({
        icon: 'success',
        title: 'Exam Created Successfully!',
        text: `"${formData.title}" is now recorded in database.`,
        timer: 1800,
        showConfirmButton: false
      });
      setShowCreateModal(false);
      // Reset form
      setFormData({
        title: '',
        examType: 'Term Test',
        className: 'Class 10',
        subjectName: 'Science',
        durationMinutes: 60,
        totalMarks: 50,
        passingMarks: 20,
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        status: 'Live',
        instructions: 'Answer all questions. Each question carries marks indicated.'
      });
      fetchExams();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setCreating(false);
    }
  };

  // Filtered exams client-side backup
  const filteredExams = exams.filter(p => {
    const matchesSearch = !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesClass = selectedClass === 'All Classes' || p.className === selectedClass;
    const matchesSubject = selectedSubject === 'All Subjects' || p.subjectName === selectedSubject;
    return matchesSearch && matchesStatus && matchesClass && matchesSubject;
  });

  // Calculate live summary
  const totalCount = exams.length;
  const liveCount = exams.filter(e => e.status === 'Live').length;
  const scheduledCount = exams.filter(e => e.status === 'Scheduled').length;
  const completedCount = exams.filter(e => e.status === 'Completed').length;
  const draftCount = exams.filter(e => e.status === 'Draft').length;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                  Online Examinations (CBT)
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Create, configure, schedule, and monitor digital test sessions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={fetchExams}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
              title="Refresh Exam List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Paper
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <OnlineExamsTabs />

        {/* KPI Mini-Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-800">{totalCount}</div>
              <div className="text-[11px] font-semibold text-slate-400">Total Exams</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="text-lg font-black text-emerald-600">{liveCount}</div>
              <div className="text-[11px] font-semibold text-slate-400">Live Active</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-sky-600">{scheduledCount}</div>
              <div className="text-[11px] font-semibold text-slate-400">Scheduled</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-700">{completedCount}</div>
              <div className="text-[11px] font-semibold text-slate-400">Completed</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-amber-600">{draftCount}</div>
              <div className="text-[11px] font-semibold text-slate-400">Drafts</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search examination papers by title..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="All Classes">All Classes</option>
              {classes.map((c, i) => (
                <option key={c._id || i} value={c.className || c.name}>{c.className || c.name}</option>
              ))}
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
            </select>

            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="All Subjects">All Subjects</option>
              {subjects.map((s, i) => (
                <option key={s._id || i} value={s.subjectName || s.name}>{s.subjectName || s.name}</option>
              ))}
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">Status:</span>
            {['All', 'Live', 'Scheduled', 'Completed', 'Draft'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Papers Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">Online Exam Papers</span>
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold text-xs rounded-full">
                {filteredExams.length}
              </span>
            </div>
            <button 
              onClick={() => navigate('/online-exams/dashboard')}
              className="text-xs text-purple-600 hover:text-purple-700 font-bold hover:underline"
            >
              View Analytics &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">Exam Paper</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Class & Subject</th>
                  <th className="py-3.5 px-4">Duration & Marks</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                        <span className="font-medium">Loading online examinations from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <span className="font-semibold text-slate-600">No Online Exams Found</span>
                        <span className="text-xs text-slate-400 max-w-sm">
                          Try clearing filters or create a new online CBT paper using the button above.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExams.map((exam, idx) => (
                    <tr key={exam._id} className="hover:bg-slate-50/75 transition-colors group">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                          {exam.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{exam.questions?.length || 0} questions assigned</span>
                          <span>•</span>
                          <span>Pass: {exam.passingMarks || 20}m</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          exam.examType === 'Quiz' 
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                            : exam.examType === 'Competitive Mock'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                            : 'bg-indigo-50 text-indigo-600 border border-indigo-200/60'
                        }`}>
                          {exam.examType || 'Term Test'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-700">{exam.className || 'All Classes'}</div>
                        <div className="text-[11px] text-slate-400">{exam.subjectName || 'General'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{exam.durationMinutes || 60} mins</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Total: <strong className="text-slate-600">{exam.totalMarks || 50}</strong> Marks
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(exam.startTime || exam.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(exam.startTime || exam.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                          exam.status === 'Live'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : exam.status === 'Scheduled'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : exam.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {exam.status === 'Live' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          )}
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setPreviewExam(exam)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="Quick Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(exam._id, exam.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Exam"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ===================== CREATE NEW EXAM MODAL ===================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">Create Online Exam Paper</h3>
                  <p className="text-[11px] text-slate-500">Configure new CBT paper and schedule</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Exam Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Class 10 Mid-Term Science Online CBT 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Exam Type</label>
                  <select 
                    value={formData.examType}
                    onChange={(e) => setFormData({...formData, examType: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="Term Test">Term Test</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Competitive Mock">Competitive Mock</option>
                    <option value="Practice Assessment">Practice Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Class</label>
                  <select 
                    value={formData.className}
                    onChange={(e) => setFormData({...formData, className: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {classes.map((c, i) => (
                      <option key={c._id || i} value={c.className || c.name}>{c.className || c.name}</option>
                    ))}
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 8">Class 8</option>
                    <option value="All Classes">All Classes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                  <select 
                    value={formData.subjectName}
                    onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {subjects.map((s, i) => (
                      <option key={s._id || i} value={s.subjectName || s.name}>{s.subjectName || s.name}</option>
                    ))}
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Duration (mins)</label>
                  <input 
                    type="number"
                    min="5"
                    max="300"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({...formData, durationMinutes: Number(e.target.value)})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Total Marks</label>
                  <input 
                    type="number"
                    min="5"
                    max="500"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({...formData, totalMarks: Number(e.target.value)})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Passing Marks</label>
                  <input 
                    type="number"
                    min="1"
                    max="500"
                    value={formData.passingMarks}
                    onChange={(e) => setFormData({...formData, passingMarks: Number(e.target.value)})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Time</label>
                  <input 
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">End Time</label>
                  <input 
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Initial Status</label>
                <div className="flex gap-2">
                  {['Live', 'Scheduled', 'Draft'].map(s => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setFormData({...formData, status: s})}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        formData.status === s 
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Student Instructions</label>
                <textarea 
                  rows="2"
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>{creating ? 'Saving...' : 'Save Paper to Database'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== PREVIEW EXAM MODAL ===================== */}
      {previewExam && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Exam Details</span>
                <h3 className="font-black text-slate-800 text-lg">{previewExam.title}</h3>
              </div>
              <button 
                onClick={() => setPreviewExam(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Class & Subject</span>
                  <span className="font-bold text-slate-800">{previewExam.className} • {previewExam.subjectName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Exam Type</span>
                  <span className="font-bold text-slate-800">{previewExam.examType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Duration</span>
                  <span className="font-bold text-slate-800">{previewExam.durationMinutes} Minutes</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Marks</span>
                  <span className="font-bold text-slate-800">{previewExam.passingMarks} Pass / {previewExam.totalMarks} Total</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Instructions:</span>
                <p className="text-xs text-slate-600 bg-purple-50/50 p-3 rounded-xl border border-purple-100/50">
                  {previewExam.instructions || 'No specific instructions provided.'}
                </p>
              </div>

              {previewExam.questions && previewExam.questions.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Questions ({previewExam.questions.length}):
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {previewExam.questions.map((q, i) => (
                      <div key={q._id || i} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                        <div className="font-semibold text-slate-800">Q{i+1}: {q.text}</div>
                        <div className="text-[10px] text-purple-600 mt-1 font-medium">Marks: {q.marks || 1} • Level: {q.difficultyLevel || 'Medium'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setPreviewExam(null)}
                  className="px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

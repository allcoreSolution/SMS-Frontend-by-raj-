import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  PenTool, Plus, Eye, Edit, Trash2, Search,
  Clock, CheckCircle, AlertTriangle, X, Users,
  Calendar, BookOpen, FileText, Play, Square,
  BarChart2, Download, Copy, Settings, Loader2
} from 'lucide-react';
import { onlineExamService } from '../api/onlineExamService';
import { academicService } from '../api/academicService';

const statusStyle = {
  Upcoming:  { cls: 'bg-blue-100 text-blue-700 border border-blue-200',   dot: 'bg-blue-400'   },
  Live:      { cls: 'bg-red-100 text-red-600 border border-red-200',      dot: 'bg-red-500 animate-pulse' },
  Completed: { cls: 'bg-green-100 text-green-700 border border-green-200', dot: 'bg-green-400'  },
  Draft:     { cls: 'bg-gray-100 text-gray-500 border border-gray-200',   dot: 'bg-gray-400'   },
};

const defaultSubjects = ['Mathematics', 'Science', 'English', 'Computer Science', 'History', 'Algebra', 'Geometry', 'Statistics'];
const defaultClasses  = ['Class X', 'Class IX', 'Class VIII', 'Class XI', 'Class XII', 'Class I'];

const ManageOnlineExams = () => {
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('All');
  const [activeView, setActiveView] = useState('list');
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [examList, setExamList]     = useState([]);
  
  // Results view state
  const [resultsList, setResultsList] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  // Academic Dropdowns
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [classes, setClasses]   = useState(defaultClasses);

  const [form, setForm] = useState({
    title: '', 
    subject: defaultSubjects[0], 
    class: defaultClasses[0],
    date: '', 
    time: '', 
    duration: '60', 
    marks: '50', 
    instructions: '',
    shuffleQ: true, 
    showResult: true, 
    negativeMarking: false,
  });

  useEffect(() => {
    fetchExams();
    fetchAcademicDropdowns();
  }, []);

  const fetchAcademicDropdowns = async () => {
    try {
      const [clsRes, subRes] = await Promise.all([
        academicService.getClasses().catch(() => ({ data: [] })),
        academicService.getSubjects().catch(() => ({ data: [] }))
      ]);

      const clsArr = Array.isArray(clsRes) ? clsRes : (clsRes?.data || []);
      const subArr = Array.isArray(subRes) ? subRes : (subRes?.data || []);

      if (clsArr.length > 0) {
        const clsNames = clsArr.map(c => c.className || c.name).filter(Boolean);
        if (clsNames.length > 0) setClasses(clsNames);
      }
      if (subArr.length > 0) {
        const subNames = subArr.map(s => s.subjectName || s.name).filter(Boolean);
        if (subNames.length > 0) setSubjects(subNames);
      }
    } catch (err) {
      console.warn('Could not load academic classes/subjects', err);
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await onlineExamService.getExams();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setExamList(list);
    } catch (err) {
      console.error('Error fetching online exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (exam) => {
    if (!exam) return;
    try {
      setResultsLoading(true);
      const examId = exam._id || exam.id;
      const res = await onlineExamService.getResults({ examId });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setResultsList(list);
    } catch (err) {
      console.error('Error fetching results:', err);
      setResultsList([]);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleOpenResults = (ex) => {
    setSelectedExam(ex);
    setActiveView('results');
    fetchResults(ex);
  };

  const handleAction = (action, ex) => {
    const examId = ex._id || ex.id;
    if (action === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to delete exam "${ex.title}"`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await onlineExamService.deleteExam(examId);
            setExamList(prev => prev.filter(e => (e._id || e.id) !== examId));
            Swal.fire('Deleted!', 'The exam has been deleted.', 'success');
          } catch (err) {
            Swal.fire('Error', err?.response?.data?.message || 'Failed to delete exam', 'error');
          }
        }
      });
    } else if (action === 'duplicate' || action === 'edit') {
       setSelectedExam(action === 'edit' ? ex : null);
       const durVal = (ex.duration || '60 min').replace(' min', '').trim();
       setForm({
          title: action === 'edit' ? ex.title : `${ex.title} (Copy)`, 
          subject: ex.subject || ex.subjectName || subjects[0], 
          class: ex.class || ex.className || classes[0],
          date: action === 'edit' ? (ex.date || '') : '', 
          time: action === 'edit' ? (ex.time || '') : '', 
          duration: durVal || '60', 
          marks: String(ex.marks || ex.totalMarks || 50), 
          instructions: ex.instructions || '',
          shuffleQ: ex.shuffleQ !== undefined ? ex.shuffleQ : true, 
          showResult: ex.showResult !== undefined ? ex.showResult : true, 
          negativeMarking: !!ex.negativeMarking,
       });
       setActiveView('form');
    } else if (action === 'stop') {
       Swal.fire({
          title: 'Stop Live Exam?',
          text: `Are you sure you want to forcefully stop "${ex.title}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, stop it'
       }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await onlineExamService.updateExam(examId, { status: 'Completed' });
              setExamList(prev => prev.map(e => (e._id === examId || e.id === examId) ? { ...e, status: 'Completed' } : e));
              Swal.fire('Stopped!', 'The exam is now marked as Completed.', 'success');
            } catch (err) {
              Swal.fire('Error', err?.response?.data?.message || 'Failed to update status', 'error');
            }
          }
       });
    }
  };

  const handleSaveExam = async (targetStatus) => {
    if (!form.title.trim()) {
      Swal.fire('Required Field', 'Please enter Exam Title', 'warning');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        subject: form.subject,
        subjectName: form.subject,
        class: form.class,
        className: form.class,
        date: form.date,
        time: form.time,
        duration: `${form.duration} min`,
        durationMinutes: parseInt(form.duration) || 60,
        marks: parseInt(form.marks) || 50,
        totalMarks: parseInt(form.marks) || 50,
        instructions: form.instructions,
        shuffleQ: form.shuffleQ,
        showResult: form.showResult,
        negativeMarking: form.negativeMarking,
        status: targetStatus
      };

      if (selectedExam) {
        const examId = selectedExam._id || selectedExam.id;
        await onlineExamService.updateExam(examId, payload);
        Swal.fire('Saved!', `Exam updated and saved as ${targetStatus}.`, 'success');
      } else {
        await onlineExamService.createExam(payload);
        Swal.fire('Success!', `Exam created and saved as ${targetStatus}.`, 'success');
      }

      await fetchExams();
      setActiveView('list');
    } catch (err) {
      console.error('Error saving exam:', err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to save exam', 'error');
    } finally {
      setSaving(false);
    }
  };

  const exportAllExamsCSV = () => {
    if (examList.length === 0) {
      Swal.fire('No Data', 'No exams available to export', 'info');
      return;
    }
    const headers = ['#', 'Exam Title', 'Subject', 'Class', 'Date', 'Time', 'Duration', 'Marks', 'Attempts', 'Status'];
    const rows = examList.map((e, idx) => [
      idx + 1,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${e.subject || e.subjectName || ''}"`,
      `"${e.class || e.className || ''}"`,
      `"${e.date || ''}"`,
      `"${e.time || ''}"`,
      `"${e.duration || ''}"`,
      e.marks || e.totalMarks || '',
      `"${e.attempts || 0}/${e.maxStudents || 30}"`,
      `"${e.status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `online_exams_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: 'Downloaded',
      text: 'Exam report downloaded successfully!',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  };

  const exportResultsCSV = () => {
    if (!selectedExam || resultsList.length === 0) {
      Swal.fire('No Data', 'No results available to export', 'info');
      return;
    }
    const headers = ['#', 'Student Name', 'Roll Number', 'Score', 'Total Marks', 'Percentage', 'Time Taken', 'Result'];
    const rows = resultsList.map((r, idx) => [
      idx + 1,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${r.roll || ''}"`,
      r.score,
      r.total,
      `${r.percentage || Math.round((r.score / r.total) * 100)}%`,
      `"${r.time || ''}"`,
      `"${r.status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(selectedExam.title || 'exam').replace(/\s+/g, '_')}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: 'Downloaded',
      text: 'Student results exported successfully!',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  };

  const filtered = examList.filter(e => {
    const s = e.status === 'Scheduled' ? 'Upcoming' : e.status;
    const matchesStatus = filterStatus === 'All' || s === filterStatus;
    const query = search.toLowerCase();
    const matchesSearch = 
      (e.title && e.title.toLowerCase().includes(query)) || 
      (e.subject && e.subject.toLowerCase().includes(query)) ||
      (e.class && e.class.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: 'Total Exams',  val: examList.length,                                    icon: FileText,  color: 'text-indigo-500 bg-indigo-50'  },
    { label: 'Live Now',     val: examList.filter(e => e.status === 'Live').length,     icon: Play,      color: 'text-red-500 bg-red-50'        },
    { label: 'Upcoming',     val: examList.filter(e => e.status === 'Upcoming' || e.status === 'Scheduled').length, icon: Calendar,  color: 'text-blue-500 bg-blue-50'      },
    { label: 'Completed',    val: examList.filter(e => e.status === 'Completed').length,icon: CheckCircle, color: 'text-green-500 bg-green-50'  },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 text-purple-600 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Manage Online Exams</h1>
              <p className="text-sm text-gray-500">Create, schedule and manage online exams for your classes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={exportAllExamsCSV} 
              title="Download Exam Report"
              className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { 
                setSelectedExam(null); 
                setForm({
                  title: '', 
                  subject: subjects[0] || 'Mathematics', 
                  class: classes[0] || 'Class X',
                  date: '', 
                  time: '', 
                  duration: '60', 
                  marks: '50', 
                  instructions: '',
                  shuffleQ: true, 
                  showResult: true, 
                  negativeMarking: false,
                });
                setActiveView('form'); 
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 flex items-center gap-2 text-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Exam
            </button>
          </div>
        </div>
      </div>

      {activeView === 'list' && (
        <div className="p-6 max-w-7xl mx-auto space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, val, icon: Icon, color }) => (
              <div key={label} className="bg-white border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                <div className={`w-11 h-11 flex items-center justify-center flex-shrink-0 ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-black text-gray-800">{val}</p>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center flex-wrap gap-2">
              {['All', 'Live', 'Upcoming', 'Completed', 'Draft'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer ${filterStatus === s ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                >
                  {s === 'Live' && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>}
                  {s}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search exams..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-200 text-xs w-52 focus:outline-none focus:ring-1 focus:ring-purple-300 bg-white" 
              />
            </div>
          </div>

          {/* Exams Table */}
          <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
                <p className="text-sm font-semibold">Loading exams from database...</p>
              </div>
            ) : (
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="bg-gray-50">
                    {['#', 'Exam Title', 'Subject', 'Class', 'Date & Time', 'Duration', 'Marks', 'Attempts', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ex, i) => {
                    const normStatus = ex.status === 'Scheduled' ? 'Upcoming' : ex.status;
                    const st = statusStyle[normStatus] || statusStyle.Draft;
                    const totalQCount = ex.totalQ || (ex.questions ? ex.questions.length : 0);
                    const maxStudents = ex.maxStudents || 30;
                    const attempts = ex.attempts || 0;
                    const progressPct = maxStudents > 0 ? Math.min(100, Math.round((attempts / maxStudents) * 100)) : 0;

                    return (
                      <tr key={ex._id || ex.id || i} className="hover:bg-purple-50/20 transition-colors">
                        <td className="px-4 py-3 border border-gray-200 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3 border border-gray-200">
                          <p className="font-semibold text-gray-800 max-w-[220px]">{ex.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{totalQCount} Questions</p>
                        </td>
                        <td className="px-4 py-3 border border-gray-200">
                          <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 font-semibold">{ex.subject || ex.subjectName}</span>
                        </td>
                        <td className="px-4 py-3 border border-gray-200 text-gray-700 font-medium text-xs">{ex.class || ex.className}</td>
                        <td className="px-4 py-3 border border-gray-200 text-xs">
                          <p className="text-gray-700 font-medium">{ex.date || 'TBD'}</p>
                          <p className="text-gray-400">{ex.time || '10:00 AM'}</p>
                        </td>
                        <td className="px-4 py-3 border border-gray-200 text-gray-600 text-xs">{ex.duration || `${ex.durationMinutes || 60} min`}</td>
                        <td className="px-4 py-3 border border-gray-200 text-gray-700 font-semibold">{ex.marks || ex.totalMarks}</td>
                        <td className="px-4 py-3 border border-gray-200">
                          <span className="text-xs font-bold text-gray-700">{attempts}/{maxStudents}</span>
                          <div className="w-20 h-1.5 bg-gray-100 mt-1 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${progressPct}%` }}></div>
                          </div>
                        </td>
                        <td className="px-4 py-3 border border-gray-200">
                          <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 w-fit ${st.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>{normStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 border border-gray-200">
                          <div className="flex items-center gap-1 flex-nowrap whitespace-nowrap">
                            <button 
                              onClick={() => { setSelectedExam(ex); setActiveView('view'); }} 
                              className="p-1.5 bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 cursor-pointer" 
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {normStatus === 'Completed' && (
                              <button 
                                onClick={() => handleOpenResults(ex)} 
                                className="p-1.5 bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 cursor-pointer" 
                                title="Results"
                              >
                                <BarChart2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {(normStatus === 'Draft' || normStatus === 'Upcoming') && (
                              <button 
                                onClick={() => handleAction('edit', ex)} 
                                className="p-1.5 bg-indigo-50 text-indigo-500 border border-indigo-200 hover:bg-indigo-100 cursor-pointer" 
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {normStatus === 'Live' && (
                              <button 
                                onClick={() => handleAction('stop', ex)} 
                                className="p-1.5 bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 cursor-pointer" 
                                title="Stop Exam"
                              >
                                <Square className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleAction('duplicate', ex)} 
                              className="p-1.5 bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 cursor-pointer" 
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleAction('delete', ex)} 
                              className="p-1.5 bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 cursor-pointer" 
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-14 text-gray-400 border border-gray-200">
                        <PenTool className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-semibold">No exams found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ===== EXAM FORM PAGE ===== */}
      {activeView === 'form' && (
        <div className="p-6 max-w-5xl mx-auto">
          <div className="bg-white w-full shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-600" /> {selectedExam ? 'Edit Exam' : 'Create New Exam'}
              </h2>
              <button 
                onClick={() => setActiveView('list')} 
                className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-sm font-semibold flex gap-1 items-center px-3 cursor-pointer"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Exam Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mid-Term Mathematics Test" 
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300/40" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subject</label>
                <select 
                  value={form.subject} 
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                >
                  {subjects.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Class</label>
                <select 
                  value={form.class} 
                  onChange={e => setForm({ ...form, class: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                >
                  {classes.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Exam Date</label>
                <input 
                  type="date" 
                  value={form.date} 
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Start Time</label>
                <input 
                  type="time" 
                  value={form.time} 
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Duration (min)</label>
                <select 
                  value={form.duration} 
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                >
                  {['15', '30', '45', '60', '90', '120', '180'].map(v => <option key={v} value={v}>{v} min</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Total Marks</label>
                <input 
                  type="number" 
                  value={form.marks} 
                  onChange={e => setForm({ ...form, marks: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Instructions</label>
                <textarea 
                  rows={3} 
                  placeholder="Exam instructions for students..." 
                  value={form.instructions}
                  onChange={e => setForm({ ...form, instructions: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none" 
                />
              </div>

              {/* Toggles */}
              <div className="md:col-span-2 bg-gray-50 border border-gray-100 p-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase">Exam Settings</p>
                {[
                  { label: 'Shuffle Questions',        key: 'shuffleQ'         },
                  { label: 'Show Result After Submit', key: 'showResult'     },
                  { label: 'Negative Marking',         key: 'negativeMarking'  },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">{label}</span>
                    <input 
                      type="checkbox" 
                      checked={form[key]} 
                      onChange={e => setForm({ ...form, [key]: e.target.checked })}
                      className="w-4 h-4 accent-purple-600" 
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button 
                disabled={saving}
                onClick={() => handleSaveExam('Draft')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Create & Save Draft'}
              </button>
              <button 
                disabled={saving}
                onClick={() => handleSaveExam('Upcoming')}
                className="px-5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish Now'}
              </button>
              <button 
                onClick={() => setActiveView('list')} 
                className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW EXAM DETAILS PAGE ===== */}
      {activeView === 'view' && selectedExam && (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white w-full shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Exam Details
              </h2>
              <button 
                onClick={() => setActiveView('list')} 
                className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-sm font-semibold flex items-center gap-1 px-3 cursor-pointer"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black text-gray-800 pr-4">{selectedExam.title}</h3>
                <span className={`text-xs font-bold px-3 py-1.5 flex-shrink-0 ${statusStyle[selectedExam.status === 'Scheduled' ? 'Upcoming' : selectedExam.status]?.cls || ''}`}>
                  {selectedExam.status === 'Scheduled' ? 'Upcoming' : selectedExam.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Subject',     val: selectedExam.subject || selectedExam.subjectName,  icon: BookOpen  },
                  { label: 'Class',       val: selectedExam.class || selectedExam.className,      icon: Users     },
                  { label: 'Date',        val: selectedExam.date || 'TBD',     icon: Calendar  },
                  { label: 'Time',        val: selectedExam.time || '10:00 AM',icon: Clock     },
                  { label: 'Duration',    val: selectedExam.duration || `${selectedExam.durationMinutes || 60} min`, icon: Clock },
                  { label: 'Total Marks', val: selectedExam.marks || selectedExam.totalMarks, icon: FileText },
                  { label: 'Questions',   val: selectedExam.totalQ || (selectedExam.questions ? selectedExam.questions.length : 0),  icon: PenTool  },
                  { label: 'Attempts',    val: `${selectedExam.attempts || 0}/${selectedExam.maxStudents || 30}`, icon: Users },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Icon className="w-3 h-3" />{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{val}</p>
                  </div>
                ))}
              </div>

              {selectedExam.instructions && (
                <div className="bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Instructions</p>
                  <p className="text-sm text-gray-700">{selectedExam.instructions}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between bg-gray-50">
              <button 
                onClick={() => {
                  const durVal = (selectedExam.duration || '60 min').replace(' min', '').trim();
                  setForm({
                    title: selectedExam.title, 
                    subject: selectedExam.subject || selectedExam.subjectName || subjects[0], 
                    class: selectedExam.class || selectedExam.className || classes[0],
                    date: selectedExam.date || '', 
                    time: selectedExam.time || '', 
                    duration: durVal || '60', 
                    marks: String(selectedExam.marks || selectedExam.totalMarks || 50), 
                    instructions: selectedExam.instructions || '',
                    shuffleQ: selectedExam.shuffleQ !== undefined ? selectedExam.shuffleQ : true, 
                    showResult: selectedExam.showResult !== undefined ? selectedExam.showResult : true, 
                    negativeMarking: !!selectedExam.negativeMarking,
                  });
                  setActiveView('form');
                }} 
                className="px-5 py-2 font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-4 h-4" /> Edit Settings
              </button>
              <button 
                onClick={() => setActiveView('list')} 
                className="px-5 py-2 bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RESULTS PAGE ===== */}
      {activeView === 'results' && selectedExam && (
        <div className="p-6 max-w-5xl mx-auto">
          <div className="bg-white w-full shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Results: {selectedExam.title}</h2>
                  <p className="text-xs text-gray-500">View final scores and student performance</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveView('list')} 
                className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-sm font-semibold flex items-center gap-1 px-3 cursor-pointer"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
            <div className="p-6">
              {/* Mini stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { 
                    label: 'Avg Score', 
                    val: resultsList.length > 0 
                      ? `${Math.round(resultsList.reduce((a, r) => a + (r.score || 0), 0) / resultsList.length)}/${selectedExam.marks || selectedExam.totalMarks || 50}` 
                      : '0/0' 
                  },
                  { label: 'Pass', val: resultsList.filter(r => r.status === 'Pass').length },
                  { label: 'Fail', val: resultsList.filter(r => r.status === 'Fail').length },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-gray-50 border border-gray-200 p-3 text-center">
                    <p className="text-lg font-black text-gray-800">{val}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {resultsLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                  <Loader2 className="w-7 h-7 animate-spin text-green-600 mb-2" />
                  <p className="text-sm font-semibold">Loading student submissions...</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr className="bg-gray-50">
                        {['#', 'Student', 'Roll', 'Score', 'Time Taken', 'Result'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-200">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {resultsList.map((r, i) => (
                        <tr key={r.id || i} className={`${r.status === 'Fail' ? 'bg-red-50/10' : 'hover:bg-gray-50'} transition-colors`}>
                          <td className="px-4 py-3 border border-gray-200 text-gray-400 text-xs">{i + 1}</td>
                          <td className="px-4 py-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <img src={r.photo || `https://i.pravatar.cc/60?img=${i + 1}`} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                              <span className="font-semibold text-gray-800 text-sm">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 border border-gray-200 text-indigo-600 font-bold text-xs">{r.roll}</td>
                          <td className="px-4 py-3 border border-gray-200">
                            <span className="font-black text-gray-800 text-base">{r.score}</span>
                            <span className="text-gray-400 text-xs ml-0.5">/{r.total}</span>
                            <div className="w-20 h-1.5 bg-gray-100 mt-1 rounded-full overflow-hidden flex">
                              <div 
                                className={`h-full rounded-full ${(r.score / (r.total || 1)) >= 0.4 ? 'bg-green-400' : 'bg-red-400'}`} 
                                style={{ width: `${Math.min(100, (r.score / (r.total || 1)) * 100)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border border-gray-200 text-gray-500 text-xs font-medium">{r.time}</td>
                          <td className="px-4 py-3 border border-gray-200">
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 ${r.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {resultsList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-gray-400 border border-gray-200">
                            <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm font-semibold">No student submissions recorded for this exam yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between bg-gray-50">
              <button 
                onClick={exportResultsCSV}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Results
              </button>
              <button 
                onClick={() => setActiveView('list')} 
                className="px-5 py-2 bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOnlineExams;

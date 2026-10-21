import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  FileText, Printer, BarChart2, Plus, List, Grid as GridIcon, 
  Search, Calendar, Settings, Edit, Trash2, Eye, CheckCircle2, 
  Clock, AlertCircle, ArrowUpRight, Download, PenTool
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../../api/examService';

export default function ManageOfflineExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    fetchExams();
  }, [activeFilter]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await examService.getExams({
        status: activeFilter !== 'All' ? activeFilter : undefined,
        search: searchQuery || undefined
      });
      if (res.success) {
        setExams(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchExams();
  };

  const handleDelete = async (id, examName) => {
    const result = await Swal.fire({
      title: 'Delete Examination?',
      text: `Permanently delete "${examName}" and its schedules & marks?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await examService.deleteExam(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Exam deleted successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          setExams(prev => prev.filter(e => (e._id || e.id) !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete exam.', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ongoing':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><Clock className="w-3 h-3 text-amber-600"/> Ongoing</span>;
      case 'Completed':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600"/> Completed</span>;
      case 'Scheduled':
        return <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><Calendar className="w-3 h-3 text-sky-600"/> Scheduled</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  const exportCSV = () => {
    if (!exams.length) return Swal.fire('No data', 'No exams to export', 'info');
    const headers = ['Exam Name', 'Type', 'Session', 'Start Date', 'End Date', 'Status', 'Results Published'];
    const rows = exams.map(e => [
      `"${e.examName}"`,
      `"${e.examType}"`,
      `"${e.session}"`,
      `"${new Date(e.startDate).toLocaleDateString()}"`,
      `"${new Date(e.endDate).toLocaleDateString()}"`,
      `"${e.status}"`,
      `"${e.publishResults ? 'Yes' : 'No'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `offline_exams_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filters = ['All', 'Scheduled', 'Ongoing', 'Completed'];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manage Offline Examinations</h1>
            <p className="text-xs text-slate-500 mt-1">
              Active sessions, timetable schedules, admit card generation and marks entry status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/offline-exams/admit-cards')}
              className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" /> Admit Cards
            </button>
            <button 
              onClick={() => navigate('/offline-exams/quick-setup')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Exam
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search exam name, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </form>

            <button
              onClick={exportCSV}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Export CSV"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Export</span>
            </button>

            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <GridIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Exams Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3 bg-white rounded-2xl border border-slate-200/80">
            <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-xs font-medium">Loading examination roster...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Examinations Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No examination records match current filter criteria. Use Quick Setup to schedule an exam.
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Exam Name</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Academic Session</th>
                    <th className="py-3.5 px-4">Timeline</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Results</th>
                    <th className="py-3.5 px-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exams.map((exam) => {
                    const examId = exam._id || exam.id;
                    return (
                      <tr key={examId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 block text-xs">{exam.examName}</span>
                          <span className="text-[11px] text-slate-400">{exam.description || 'Offline School Exam'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-700">
                            {exam.examType || 'Term Exam'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700 font-mono text-xs">
                          {exam.session || '2026-2027'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-600">
                          {new Date(exam.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} — {new Date(exam.endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(exam.status)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            exam.publishResults ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {exam.publishResults ? 'Published' : 'Draft / Private'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/offline-exams/datesheet?examId=${examId}`)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                              title="Datesheet"
                            >
                              <Calendar className="w-3 h-3" /> Datesheet
                            </button>
                            <button
                              onClick={() => navigate(`/offline-exams/enter-marks?examId=${examId}`)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                              title="Enter Marks"
                            >
                              <Edit className="w-3 h-3" /> Marks
                            </button>
                            <button
                              onClick={() => handleDelete(examId, exam.examName)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                              title="Delete Exam"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const examId = exam._id || exam.id;
              return (
                <div key={examId} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {exam.examType || 'Term Exam'}
                      </span>
                      {getStatusBadge(exam.status)}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mt-2.5 leading-snug">{exam.examName}</h3>
                    <p className="text-xs text-slate-400 mt-1">{exam.description || 'Standard evaluation test'}</p>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Session:</span>
                        <span className="font-semibold text-slate-700 font-mono">{exam.session}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dates:</span>
                        <span className="font-semibold text-slate-700">
                          {new Date(exam.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} — {new Date(exam.endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/offline-exams/datesheet?examId=${examId}`)}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition cursor-pointer text-center"
                    >
                      Datesheet
                    </button>
                    <button
                      onClick={() => navigate(`/offline-exams/enter-marks?examId=${examId}`)}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer text-center"
                    >
                      Enter Marks
                    </button>
                    <button
                      onClick={() => handleDelete(examId, exam.examName)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

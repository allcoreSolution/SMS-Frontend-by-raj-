import React, { useState, useEffect } from 'react';
import { 
  Building2, Printer, BarChart2, Plus, List, Grid, 
  Copy, FileText, Download, Columns, Search, ChevronLeft, ChevronRight,
  Eye, Edit, Trash2, X, Calendar, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../api/examService';
import { academicService } from '../api/academicService';

const ManageOfflineExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionFilter, setSessionFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [viewingExam, setViewingExam] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Admit Cards Modal
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [admitExam, setAdmitExam] = useState('');
  const [admitClass, setAdmitClass] = useState('');
  const [admitCards, setAdmitCards] = useState([]);
  const [loadingAdmit, setLoadingAdmit] = useState(false);
  const [classesList, setClassesList] = useState([]);

  // Result Analytics Modal
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // New Exam Form State
  const [formData, setFormData] = useState({
    examName: '',
    session: '2026-2027',
    appliesTo: '',
    startDate: '',
    endDate: '',
    status: 'Scheduled',
    description: ''
  });

  useEffect(() => {
    fetchExams();
    fetchClasses();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await examService.getExams();
      if (res && res.data) {
        setExams(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch offline exams:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not load exams. Please try again.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await academicService.getClasses();
      if (res && res.data) {
        setClassesList(res.data);
        if (res.data.length > 0) {
          setAdmitClass(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const toInputDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Filter exams based on search and session filter
  const filteredExams = exams.filter(exam => {
    const nameMatch = (exam.examName || exam.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const appliesMatch = (exam.appliesTo || '').toLowerCase().includes(searchTerm.toLowerCase());
    const sessionMatch = sessionFilter === 'All' || (exam.session || '') === sessionFilter;
    return (nameMatch || appliesMatch) && sessionMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage) || 1;
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Create or Update
  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (!formData.examName || !formData.startDate || !formData.endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields Missing',
        text: 'Please fill in Exam Name, Start Date, and End Date.'
      });
      return;
    }

    try {
      if (editingExam) {
        const res = await examService.updateExam(editingExam._id, formData);
        if (res.success || res.data) {
          Swal.fire({
            icon: 'success',
            title: 'Exam Updated',
            text: 'Exam details have been updated successfully!',
            timer: 2000,
            showConfirmButton: false
          });
          setEditingExam(null);
          setShowAddModal(false);
          fetchExams();
        }
      } else {
        const res = await examService.createExam(formData);
        if (res.success || res.data) {
          Swal.fire({
            icon: 'success',
            title: 'Exam Created',
            text: 'New offline exam added to the system!',
            timer: 2000,
            showConfirmButton: false
          });
          setShowAddModal(false);
          resetForm();
          fetchExams();
        }
      }
    } catch (err) {
      console.error('Error saving exam:', err);
      Swal.fire({
        icon: 'error',
        title: 'Action Failed',
        text: err.response?.data?.message || 'Error occurred while saving the exam.'
      });
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      examName: exam.examName || exam.name || '',
      session: exam.session || '2026-2027',
      appliesTo: exam.appliesTo || '',
      startDate: toInputDate(exam.startDate),
      endDate: toInputDate(exam.endDate),
      status: exam.status || 'Scheduled',
      description: exam.description || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Exam?',
      text: `Are you sure you want to delete "${name}"? All associated marks and schedules will be deleted!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await examService.deleteExam(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The exam was removed successfully.',
          timer: 1800,
          showConfirmButton: false
        });
        fetchExams();
      } catch (err) {
        console.error('Error deleting exam:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Could not delete the exam. Please try again.'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      examName: '',
      session: '2026-2027',
      appliesTo: '',
      startDate: '',
      endDate: '',
      status: 'Scheduled',
      description: ''
    });
    setEditingExam(null);
  };

  // Admit Cards Fetching
  const handleFetchAdmitCards = async () => {
    if (!admitExam || !admitClass) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Criteria',
        text: 'Please select both Exam and Class to generate admit cards.'
      });
      return;
    }
    setLoadingAdmit(true);
    try {
      const res = await examService.getAdmitCards({ examId: admitExam, classId: admitClass });
      if (res && res.data) {
        setAdmitCards(res.data);
      }
    } catch (err) {
      console.error('Error fetching admit cards:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not generate admit cards for the selected class.'
      });
    } finally {
      setLoadingAdmit(false);
    }
  };

  // Export functions
  const exportCSV = () => {
    if (filteredExams.length === 0) return;
    const headers = ['Exam Name,Session,Applies To,Start Date,End Date,Status'];
    const rows = filteredExams.map(e => 
      `"${e.examName || e.name || ''}","${e.session || ''}","${e.appliesTo || ''}","${formatDateDisplay(e.startDate)}","${formatDateDisplay(e.endDate)}","${e.status || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `offline_exams_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    const text = filteredExams.map(e => 
      `${e.examName || e.name} | ${e.session} | ${e.appliesTo} | ${formatDateDisplay(e.startDate)} to ${formatDateDisplay(e.endDate)}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Copied to Clipboard',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const printTable = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm">
      
      {/* Header section */}
      <div className="bg-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Offline Exams</h1>
          <p className="text-xs text-gray-500 mt-0.5">Define term assessments, schedule datesheets, and manage admit credentials</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded shadow-sm hover:bg-gray-50 font-medium text-xs focus:outline-none"
            >
              <option value="All">All Sessions</option>
              <option value="2026-2027">Session 2026-2027</option>
              <option value="2025-2026">Session 2025-2026</option>
              <option value="2024-2025">Session 2024-2025</option>
            </select>
          </div>

          <button 
            onClick={() => {
              if (exams.length > 0 && !admitExam) {
                setAdmitExam(exams[0]._id);
              }
              setShowAdmitModal(true);
            }}
            className="flex items-center gap-2 bg-[#ffb822] hover:bg-[#eaa411] text-white px-4 py-2 rounded shadow-sm font-medium transition-all"
          >
            <Printer className="w-4 h-4" /> Print Admit Cards
          </button>

          <button 
            onClick={() => setShowAnalyticsModal(true)}
            className="flex items-center gap-2 bg-[#1dc9b7] hover:bg-[#19b1a1] text-white px-4 py-2 rounded shadow-sm font-medium transition-all"
          >
            <BarChart2 className="w-4 h-4" /> Result Analytics
          </button>

          <button 
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-[#5d78ff] hover:bg-[#4b65e6] text-white px-4 py-2 rounded shadow-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Exam
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="p-6">
        <div className="bg-white rounded shadow-sm border border-gray-200">
          
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
              <List className="w-4 h-4 text-purple-600" /> Exams — this session ({filteredExams.length})
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchExams}
                className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                title="Refresh Exams"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex bg-gray-100 rounded p-0.5">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Card Toolbar */}
          <div className="px-6 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-white">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span>Show</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={copyToClipboard} className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50" title="Copy to clipboard">
                  <Copy className="w-4 h-4"/>
                </button>
                <button onClick={exportCSV} className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 font-medium text-xs">
                  CSV
                </button>
                <button onClick={exportCSV} className="px-3 py-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 font-medium text-xs">
                  Excel
                </button>
                <button onClick={printTable} className="p-1.5 border border-gray-300 rounded text-gray-600 hover:bg-gray-50" title="Print List">
                  <Printer className="w-4 h-4"/>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search exams, classes..." 
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 border border-gray-300 rounded w-64 focus:outline-none focus:border-blue-400 text-sm" 
              />
              <Search className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Table / Grid */}
          <div className="overflow-x-auto min-h-[220px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <RefreshCw className="w-7 h-7 animate-spin text-indigo-500 mb-2" />
                <span>Loading examination schedules...</span>
              </div>
            ) : viewMode === 'list' ? (
              <table className="w-full text-left border-b border-gray-200">
                <thead>
                  <tr className="bg-[#f8f9fe]">
                    <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase tracking-wider border-b border-gray-200 w-[24%]">Exam Name</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase tracking-wider border-b border-gray-200 border-l border-white w-[14%]">Session</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase tracking-wider border-b border-gray-200 border-l border-white w-[22%]">Applies To</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase tracking-wider border-b border-gray-200 border-l border-white w-[14%]">Start Date</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase tracking-wider border-b border-gray-200 border-l border-white w-[14%]">End Date</th>
                    <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase tracking-wider border-b border-gray-200 border-l border-white w-[12%] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExams.length > 0 ? (
                    paginatedExams.map(exam => (
                      <tr key={exam._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-800">{exam.examName || exam.name}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              exam.status === 'Ongoing' ? 'bg-amber-400 animate-pulse' :
                              exam.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-400'
                            }`}></span>
                            <span>{exam.status || 'Scheduled'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{exam.session || '2026-2027'}</td>
                        <td className="px-6 py-4 text-gray-600">{exam.appliesTo || 'All Classes'}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDateDisplay(exam.startDate)}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDateDisplay(exam.endDate)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setViewingExam(exam)} 
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(exam)} 
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" 
                              title="Edit Exam"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(exam._id, exam.examName || exam.name)} 
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                              title="Delete Exam"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-white">
                        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        No examination records found. Click <strong>"Add New Exam"</strong> to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              /* Grid View */
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50">
                {paginatedExams.length > 0 ? (
                  paginatedExams.map(exam => (
                    <div key={exam._id} className="bg-white p-5 border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-[#5d78ff] text-base leading-snug">{exam.examName || exam.name}</h3>
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs font-semibold rounded">{exam.session || '2026-2027'}</span>
                      </div>
                      <p className="text-gray-600 text-xs mb-4">
                        <span className="font-semibold text-gray-700">Applies To:</span> {exam.appliesTo || 'All Classes'}
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                        <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                          <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Start Date</p>
                          <p className="font-semibold text-gray-800">{formatDateDisplay(exam.startDate)}</p>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                          <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">End Date</p>
                          <p className="font-semibold text-gray-800">{formatDateDisplay(exam.endDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          exam.status === 'Ongoing' ? 'bg-amber-100 text-amber-700' :
                          exam.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {exam.status || 'Scheduled'}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => setViewingExam(exam)} className="p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleEdit(exam)} className="p-1.5 text-gray-500 hover:bg-amber-50 hover:text-amber-600 rounded"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(exam._id, exam.examName || exam.name)} className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-gray-200 rounded">
                    No examination records found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Pagination */}
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 bg-white rounded-b">
            <span className="text-xs text-gray-500">
              {filteredExams.length === 0 ? 'No records' : `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredExams.length)} of ${filteredExams.length} records`}
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4"/>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-xs rounded font-medium ${
                    currentPage === pageNum 
                      ? 'bg-[#5d78ff] text-white shadow-sm' 
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-2.5 py-1 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ===== Add / Edit Exam Modal ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800">
                {editingExam ? 'Edit Examination' : 'Add New Offline Exam'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSaveExam} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Exam Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.examName}
                    onChange={e => setFormData({...formData, examName: e.target.value})}
                    placeholder="e.g. Mid Term Assessment 2026-2027" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Academic Session</label>
                    <select 
                      value={formData.session}
                      onChange={e => setFormData({...formData, session: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="2026-2027">2026-2027</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="2024-2025">2024-2025</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Applies To (Target Classes)</label>
                  <input 
                    type="text" 
                    value={formData.appliesTo}
                    onChange={e => setFormData({...formData, appliesTo: e.target.value})}
                    placeholder="e.g. Class I, II, III or All Classes" 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      required
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      required
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Description / Notes</label>
                  <textarea 
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Instructions, guidelines, or passing criteria..." 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#5d78ff] text-white rounded text-sm font-medium hover:bg-[#4b65e6] shadow-sm"
                >
                  {editingExam ? 'Update Exam' : 'Save Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== View Exam Details Modal ===== */}
      {viewingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewingExam(null)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800">Exam Overview</h2>
              <button onClick={() => setViewingExam(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Exam Title</span>
                <p className="text-lg font-bold text-indigo-700 mt-0.5">{viewingExam.examName || viewingExam.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-[11px] text-gray-400 font-bold uppercase">Session</span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{viewingExam.session || '2026-2027'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-[11px] text-gray-400 font-bold uppercase">Status</span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{viewingExam.status || 'Scheduled'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-[11px] text-gray-400 font-bold uppercase">Target Classes</span>
                <p className="text-sm font-medium text-gray-800 mt-1">{viewingExam.appliesTo || 'All Standard Classes'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 p-3 rounded">
                  <span className="text-[11px] text-gray-400 font-bold uppercase">Start Date</span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{formatDateDisplay(viewingExam.startDate)}</p>
                </div>
                <div className="border border-gray-200 p-3 rounded">
                  <span className="text-[11px] text-gray-400 font-bold uppercase">End Date</span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{formatDateDisplay(viewingExam.endDate)}</p>
                </div>
              </div>
              {viewingExam.description && (
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase">Notes</span>
                  <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-3 rounded">{viewingExam.description}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setViewingExam(null)}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Admit Cards Modal ===== */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAdmitModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#fffbf0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ffb822] text-white flex items-center justify-center font-bold">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">Print Student Admit Cards</h2>
                  <p className="text-xs text-gray-500">Generate and print examination hall tickets with timetable</p>
                </div>
              </div>
              <button onClick={() => setShowAdmitModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>

            {/* Criteria Bar */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Exam</label>
                <select 
                  value={admitExam}
                  onChange={e => setAdmitExam(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Exam --</option>
                  {exams.map(e => (
                    <option key={e._id} value={e._id}>{e.examName || e.name} ({e.session})</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Class</label>
                <select 
                  value={admitClass}
                  onChange={e => setAdmitClass(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Class --</option>
                  {classesList.map(c => (
                    <option key={c._id} value={c._id}>{c.className}</option>
                  ))}
                </select>
              </div>

              <div>
                <button 
                  onClick={handleFetchAdmitCards}
                  disabled={loadingAdmit}
                  className="px-5 py-2 bg-[#ffb822] hover:bg-[#eaa411] text-white rounded text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  {loadingAdmit ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Search className="w-3.5 h-3.5"/>}
                  Fetch Admit Cards
                </button>
              </div>

              {admitCards.length > 0 && (
                <div>
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print All ({admitCards.length})
                  </button>
                </div>
              )}
            </div>

            {/* Admit Cards Display Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-6">
              {loadingAdmit ? (
                <div className="py-20 text-center text-gray-500">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-2" />
                  Generating examination hall tickets...
                </div>
              ) : admitCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1">
                  {admitCards.map((card, idx) => (
                    <div key={idx} className="bg-white border-2 border-indigo-200 rounded-lg p-5 shadow-sm print:break-inside-avoid">
                      <div className="border-b border-indigo-100 pb-3 flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-indigo-900 text-sm tracking-wide">SPRINGDALE CENTRAL ACADEMY</h4>
                          <p className="text-[11px] text-gray-500 font-semibold">{card.examName} • {card.session}</p>
                        </div>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                          HALL TICKET
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs my-3 bg-indigo-50/50 p-2.5 rounded">
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold">Student Name</span>
                          <p className="font-bold text-gray-900">{card.studentName}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold">Roll / Adm No</span>
                          <p className="font-bold text-gray-900">Roll: {card.rollNo} • Adm: {card.admissionNo}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold">Class & Section</span>
                          <p className="font-bold text-gray-900">{card.class} - {card.section}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold">Ticket No</span>
                          <p className="font-mono text-indigo-600 font-bold">{card.admitCardNo}</p>
                        </div>
                      </div>

                      <div className="text-[11px]">
                        <p className="font-bold text-gray-700 mb-1">Paper Schedule</p>
                        <table className="w-full text-left border border-gray-200 text-[10px]">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-1 border border-gray-200">Date</th>
                              <th className="p-1 border border-gray-200">Subject</th>
                              <th className="p-1 border border-gray-200">Time</th>
                              <th className="p-1 border border-gray-200">Room</th>
                            </tr>
                          </thead>
                          <tbody>
                            {card.timetable.map((t, tidx) => (
                              <tr key={tidx} className="border-t border-gray-200">
                                <td className="p-1 font-medium">{t.date}</td>
                                <td className="p-1 font-bold text-indigo-800">{t.subject}</td>
                                <td className="p-1">{t.time}</td>
                                <td className="p-1 font-mono">{t.room}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
                        <span>Invigilator Signature: ____________</span>
                        <span>Controller of Exams</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-gray-400">
                  <Printer className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  Select an exam and class, then click <strong>"Fetch Admit Cards"</strong>.
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setShowAdmitModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Result Analytics Modal ===== */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAnalyticsModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#f0fbf9]">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#1dc9b7]" />
                <h2 className="text-base font-bold text-gray-800">Exam Results & Session Analytics</h2>
              </div>
              <button onClick={() => setShowAnalyticsModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-center">
                  <p className="text-[11px] text-indigo-500 font-bold uppercase">Total Exams</p>
                  <p className="text-2xl font-extrabold text-indigo-700 mt-1">{exams.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center">
                  <p className="text-[11px] text-emerald-500 font-bold uppercase">Classes Covered</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">{classesList.length}</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-center">
                  <p className="text-[11px] text-amber-500 font-bold uppercase">Current Session</p>
                  <p className="text-sm font-extrabold text-amber-700 mt-2">2026-2027</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Examination Progress</h4>
                <div className="space-y-2">
                  {exams.slice(0, 4).map(e => (
                    <div key={e._id} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-200 last:border-0">
                      <span className="font-medium text-gray-800">{e.examName || e.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        e.status === 'Ongoing' ? 'bg-amber-100 text-amber-700' :
                        e.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {e.status || 'Scheduled'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
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

export default ManageOfflineExams;

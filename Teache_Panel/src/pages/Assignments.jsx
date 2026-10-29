import React, { useState, useEffect } from 'react';
import { 
  Plus, BookOpen, Layers, Edit, Video, 
  Search, ChevronDown, Eye, Trash2, CheckCircle, FileText,
  Calendar, Clock, DownloadCloud, ExternalLink, RefreshCw, AlertCircle, X, Award
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { studyService } from '../api/studyService';
import { academicService } from '../api/academicService';

const Assignments = () => {
  const navigate = useNavigate();
  const activeTab = 'Homework & Assignments';
  
  // Data states
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedHw, setSelectedHw] = useState(null);

  // Evaluation state within View Modal
  const [evaluatingStudent, setEvaluatingStudent] = useState(null);
  const [evalForm, setEvalForm] = useState({
    studentName: '',
    rollNumber: '',
    marksObtained: '',
    remarks: ''
  });

  // Create Form State
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    className: 'Class X',
    sectionName: 'Section A',
    subjectName: 'Mathematics',
    dueDate: '',
    totalMarks: 20,
    attachment: null
  });

  // Edit Form State
  const [editAssignment, setEditAssignment] = useState({
    title: '',
    description: '',
    className: 'Class X',
    sectionName: 'Section A',
    subjectName: 'Mathematics',
    dueDate: '',
    totalMarks: 20,
    status: 'Active',
    attachment: null
  });

  useEffect(() => {
    fetchMetadata();
    fetchAssignments();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [clsRes, secRes, subRes] = await Promise.all([
        academicService.getClasses().catch(() => ({ success: false })),
        academicService.getSections().catch(() => ({ success: false })),
        academicService.getSubjects().catch(() => ({ success: false }))
      ]);
      
      if (clsRes.success && clsRes.data?.length > 0) setClasses(clsRes.data);
      if (secRes.success && secRes.data?.length > 0) setSections(secRes.data);
      if (subRes.success && subRes.data?.length > 0) setSubjects(subRes.data);
    } catch (e) {
      console.error('Error fetching academics metadata', e);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await studyService.getHomework();
      if (res.success && res.data) {
        setAssignments(res.data);
      }
    } catch (e) {
      console.error('Error fetching homework', e);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { name: 'Classwork & Logbook', icon: <BookOpen className="w-4 h-4" />, path: '/classwork' },
    { name: 'Manage Resources', icon: <Layers className="w-4 h-4" />, path: '/classwork' },
    { name: 'Homework & Assignments', icon: <Edit className="w-4 h-4" />, path: '/assignments' },
    { name: 'Live Classes', icon: <Video className="w-4 h-4" />, path: '/live/manage' },
  ];

  // Filtering
  const filteredAssignments = assignments.filter(a => {
    const s = searchTerm.toLowerCase();
    const searchMatch = !searchTerm ||
      (a.title && a.title.toLowerCase().includes(s)) ||
      (a.description && a.description.toLowerCase().includes(s)) ||
      (a.subjectName && a.subjectName.toLowerCase().includes(s)) ||
      (a.teacherName && a.teacherName.toLowerCase().includes(s));
      
    const clsPart = classFilter.replace('Class ', '').trim();
    const classMatch = classFilter === 'All Classes' || 
      (a.className && (a.className === classFilter || a.className.includes(clsPart)));

    // Determine computed status (handle overdue)
    let compStatus = a.status || 'Active';
    if (compStatus === 'Active' && a.dueDate) {
      if (new Date(a.dueDate).getTime() < Date.now() - 86400000) {
        compStatus = 'Overdue';
      }
    }

    const statusMatch = statusFilter === 'All' || compStatus === statusFilter;
    
    return searchMatch && classMatch && statusMatch;
  });

  // Calculate dynamic KPIs
  const total = assignments.length;
  const activeCount = assignments.filter(a => {
    if (a.status !== 'Active') return false;
    if (a.dueDate && new Date(a.dueDate).getTime() < Date.now() - 86400000) return false;
    return true;
  }).length;
  const overdueCount = assignments.filter(a => {
    if (a.status === 'Overdue') return true;
    if (a.status === 'Active' && a.dueDate && new Date(a.dueDate).getTime() < Date.now() - 86400000) return true;
    return false;
  }).length;
  const evaluatedCount = assignments.filter(a => a.status === 'Evaluated').length;

  // --- Handlers: Create Homework ---
  const handleOpenAddModal = () => {
    setNewAssignment({
      title: '',
      description: '',
      className: classes.length > 0 ? classes[0].className : 'Class X',
      sectionName: sections.length > 0 ? sections[0].sectionName : 'Section A',
      subjectName: subjects.length > 0 ? subjects[0].subjectName : 'Mathematics',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      totalMarks: 20,
      attachment: null
    });
    setShowAddModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate) {
      Swal.fire('Required Fields', 'Please fill in Title, Description, and Due Date.', 'warning');
      return;
    }
    
    try {
      setLoading(true);
      const fd = new FormData();
      Object.keys(newAssignment).forEach(key => {
        if (key === 'attachment') {
          if (newAssignment.attachment) fd.append('attachment', newAssignment.attachment);
        } else {
          fd.append(key, newAssignment[key]);
        }
      });
      
      const res = await studyService.createHomework(fd);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Homework Assigned!',
          text: 'New homework task created and assigned to students.',
          timer: 1500,
          showConfirmButton: false
        });
        setShowAddModal(false);
        fetchAssignments();
      }
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Failed to save homework assignment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers: Edit Homework ---
  const handleOpenEditModal = (hw) => {
    setSelectedHw(hw);
    setEditAssignment({
      title: hw.title || '',
      description: hw.description || '',
      className: hw.className || 'Class X',
      sectionName: hw.sectionName || 'Section A',
      subjectName: hw.subjectName || 'Mathematics',
      dueDate: hw.dueDate ? new Date(hw.dueDate).toISOString().slice(0, 10) : '',
      totalMarks: hw.totalMarks || 20,
      status: hw.status || 'Active',
      attachment: null
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedHw) return;

    try {
      setLoading(true);
      const fd = new FormData();
      Object.keys(editAssignment).forEach(key => {
        if (key === 'attachment') {
          if (editAssignment.attachment) fd.append('attachment', editAssignment.attachment);
        } else {
          fd.append(key, editAssignment[key]);
        }
      });

      const res = await studyService.updateHomework(selectedHw._id, fd);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Assignment Updated!',
          text: 'Homework assignment details updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        setShowEditModal(false);
        setSelectedHw(null);
        fetchAssignments();
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update assignment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers: Delete Homework ---
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this Assignment?',
      text: 'This will delete the homework and any student submissions attached to it.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await studyService.deleteHomework(id);
        if (res.success) {
          Swal.fire('Deleted!', 'Homework assignment deleted.', 'success');
          setAssignments(assignments.filter(a => a._id !== id));
        }
      } catch (e) {
        console.error(e);
        Swal.fire('Error', 'Failed to delete assignment.', 'error');
      }
    }
  };

  // --- Handlers: View & Submissions Evaluation ---
  const handleOpenViewModal = (hw) => {
    setSelectedHw(hw);
    setEvaluatingStudent(null);
    setEvalForm({ studentName: '', rollNumber: '', marksObtained: '', remarks: '' });
    setShowViewModal(true);
  };

  const handleStartEvaluate = (sub) => {
    setEvaluatingStudent(sub);
    setEvalForm({
      studentName: sub.studentName,
      rollNumber: sub.rollNumber || '',
      marksObtained: sub.marksObtained !== null && sub.marksObtained !== undefined ? sub.marksObtained : '',
      remarks: sub.remarks || ''
    });
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedHw) return;

    try {
      const res = await studyService.evaluateHomework(selectedHw._id, {
        studentName: evalForm.studentName,
        rollNumber: evalForm.rollNumber,
        marksObtained: evalForm.marksObtained ? Number(evalForm.marksObtained) : null,
        remarks: evalForm.remarks
      });

      if (res.success && res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Graded Successfully!',
          text: `Marks & remarks saved for ${evalForm.studentName}.`,
          timer: 1500,
          showConfirmButton: false
        });
        setSelectedHw(res.data);
        setEvaluatingStudent(null);
        setEvalForm({ studentName: '', rollNumber: '', marksObtained: '', remarks: '' });
        fetchAssignments();
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to evaluate submission.', 'error');
    }
  };

  // --- Export Utilities ---
  const handleExportCSV = () => {
    const headers = ['Title', 'Class', 'Section', 'Subject', 'Due Date', 'Total Marks', 'Status', 'Submissions'];
    const rows = filteredAssignments.map(a => [
      `"${(a.title || '').replace(/"/g, '""')}"`,
      `"${a.className || ''}"`,
      `"${a.sectionName || ''}"`,
      `"${a.subjectName || ''}"`,
      a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '',
      a.totalMarks || 20,
      a.status || 'Active',
      `"${a.submissionCount || 0}/${a.totalStudents || 40}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Homework_Assignments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm">
      
      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Study Center</h1>
          <p className="text-[13px] text-gray-500 mt-1">Manage syllabus, learning resources, classwork, homework, and live sessions.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#008cba] hover:bg-[#007399] text-white px-4 py-2 rounded shadow-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Homework
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="px-6 bg-white border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
        {tabs.map(t => (
          <button 
            key={t.name}
            onClick={() => navigate(t.path)}
            className={`flex items-center gap-2 px-5 py-3.5 font-semibold text-[13px] whitespace-nowrap transition-colors border-b-[3px] ${
              activeTab === t.name 
                ? 'text-[#008cba] border-[#008cba]' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {/* Total */}
           <div className="bg-white border border-gray-200 rounded shadow-sm p-5 text-center flex flex-col justify-center items-center hover:border-blue-400 transition-all">
             <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">Total Homeworks</h3>
             <span className="text-3xl font-black text-[#007bff]">{total}</span>
           </div>
           {/* Active */}
           <div className="bg-white border border-gray-200 rounded shadow-sm p-5 text-center flex flex-col justify-center items-center hover:border-green-400 transition-all">
             <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">Active Assignments</h3>
             <span className="text-3xl font-black text-[#28a745]">{activeCount}</span>
           </div>
           {/* Overdue */}
           <div className="bg-white border border-gray-200 rounded shadow-sm p-5 text-center flex flex-col justify-center items-center hover:border-red-400 transition-all">
             <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">Overdue / Pending</h3>
             <span className="text-3xl font-black text-[#dc3545]">{overdueCount}</span>
           </div>
           {/* Evaluated */}
           <div className="bg-white border border-gray-200 rounded shadow-sm p-5 text-center flex flex-col justify-center items-center hover:border-teal-400 transition-all">
             <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1">Fully Evaluated</h3>
             <span className="text-3xl font-black text-[#17a2b8]">{evaluatedCount}</span>
           </div>
        </div>

        {/* Filter Area */}
        <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end flex-1">
            <div className="min-w-[160px]">
               <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Filter By Class</label>
               <select 
                 value={classFilter}
                 onChange={e => setClassFilter(e.target.value)}
                 className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400"
               >
                 <option value="All Classes">All Classes</option>
                 {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
               </select>
            </div>

            <div className="min-w-[140px]">
               <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Status Filter</label>
               <select 
                 value={statusFilter}
                 onChange={e => setStatusFilter(e.target.value)}
                 className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400"
               >
                 <option value="All">All Statuses</option>
                 <option value="Active">Active</option>
                 <option value="Overdue">Overdue</option>
                 <option value="Closed">Closed</option>
                 <option value="Evaluated">Evaluated</option>
               </select>
            </div>
          </div>

          <button 
            onClick={fetchAssignments}
            title="Refresh List"
            className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Header Row Teal */}
          <div className="bg-[#17a2b8] px-5 py-3 flex justify-between items-center text-white">
            <h2 className="font-bold text-[14px] flex items-center gap-2">
              <FileText className="w-4 h-4 fill-white" /> Assignments List — Homework & Worksheets ({filteredAssignments.length})
            </h2>
            <button 
              onClick={handleOpenAddModal}
              className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-gray-50"
            >
              <Plus className="w-3.5 h-3.5 text-[#17a2b8]" /> New Assignment
            </button>
          </div>

          <div className="p-5">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center flex-wrap gap-1.5">
                <button 
                  onClick={handleExportCSV}
                  className="px-3 py-1 text-xs border border-gray-300 rounded font-semibold text-gray-600 hover:bg-gray-50 bg-white"
                >
                  Export CSV
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-3 py-1 text-xs border border-gray-300 rounded font-semibold text-gray-600 hover:bg-gray-50 bg-white"
                >
                  Print
                </button>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <label className="text-xs text-gray-600 font-semibold">Search:</label>
                <div className="relative w-full md:w-56">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search title, description..."
                    className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#17a2b8]" 
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border-t border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Assignment Title</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Class & Section</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Subject</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Due Date</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Submissions</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700">Assigned By</th>
                    <th className="px-4 py-3 text-[12px] font-bold text-gray-700 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map(a => {
                      const isOverdue = a.status === 'Active' && a.dueDate && new Date(a.dueDate).getTime() < Date.now() - 86400000;
                      const displayStatus = isOverdue ? 'Overdue' : (a.status || 'Active');

                      return (
                        <tr key={a._id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-[#008cba] text-[13px]">{a.title}</p>
                            <p className="text-[11px] text-gray-500 line-clamp-1">{a.description}</p>
                          </td>
                          <td className="px-4 py-3.5 text-[12px] font-semibold text-gray-700">
                            {a.className} {a.sectionName ? `(${a.sectionName})` : ''}
                          </td>
                          <td className="px-4 py-3.5 text-[12px] text-gray-600 font-medium">{a.subjectName}</td>
                          <td className="px-4 py-3.5 text-[12px] font-medium text-gray-800 whitespace-nowrap">
                            {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${
                              displayStatus === 'Active' ? 'bg-green-100 text-green-700' :
                              displayStatus === 'Overdue' ? 'bg-red-100 text-red-700' :
                              displayStatus === 'Evaluated' ? 'bg-teal-100 text-teal-800' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {displayStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-[12px] font-mono font-bold text-gray-700">
                            {a.submissionCount || (a.submissions ? a.submissions.length : 0)} / {a.totalStudents || 40}
                          </td>
                          <td className="px-4 py-3.5 text-[12px] text-gray-600">{a.teacherName || 'Teacher Faculty'}</td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => handleOpenViewModal(a)}
                                title="View Submissions & Grade"
                                className="text-gray-500 hover:text-[#008cba] p-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleOpenEditModal(a)}
                                title="Edit Assignment"
                                className="text-gray-500 hover:text-emerald-600 p-1 rounded hover:bg-emerald-50 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(a._id)}
                                title="Delete Assignment"
                                className="text-gray-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-[12px] text-gray-500 bg-gray-50/50">
                        No homework assignments found. Click "Create New Homework" to assign tasks.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-4 flex justify-between items-center text-xs text-gray-500">
              <span>Showing {filteredAssignments.length} assignments</span>
            </div>
          </div>
        </div>

      </div>

      {/* --- MODAL: CREATE HOMEWORK --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#008cba]" /> Create New Homework Assignment
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assignment Title *</label>
                <input 
                  type="text" 
                  required
                  value={newAssignment.title}
                  onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                  placeholder="e.g. Maths Worksheet: Quadratic Roots & Discriminant" 
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description / Instructions *</label>
                <textarea 
                  required
                  rows="3"
                  value={newAssignment.description}
                  onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                  placeholder="e.g. Solve all questions from Exercise 4.1 in fair homework register. Show step-by-step discriminant calculation..." 
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class *</label>
                  <select 
                    value={newAssignment.className}
                    onChange={e => setNewAssignment({...newAssignment, className: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                    {classes.length === 0 && <option value="Class X">Class X</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section</label>
                  <select 
                    value={newAssignment.sectionName}
                    onChange={e => setNewAssignment({...newAssignment, sectionName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {sections.map(s => <option key={s._id} value={s.sectionName}>{s.sectionName}</option>)}
                    {sections.length === 0 && (
                      <>
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <select 
                    value={newAssignment.subjectName}
                    onChange={e => setNewAssignment({...newAssignment, subjectName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {subjects.map(sub => <option key={sub._id} value={sub.subjectName}>{sub.subjectName}</option>)}
                    {subjects.length === 0 && (
                      <>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Due Date *</label>
                  <input 
                    type="date" 
                    required
                    value={newAssignment.dueDate}
                    onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Marks</label>
                  <input 
                    type="number"
                    min="1"
                    value={newAssignment.totalMarks}
                    onChange={e => setNewAssignment({...newAssignment, totalMarks: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Attach Worksheet / File</label>
                <input 
                  type="file"
                  onChange={e => setNewAssignment({...newAssignment, attachment: e.target.files[0]})}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" 
                />
              </div>
              
              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-5 py-2 bg-[#008cba] hover:bg-[#007399] text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT HOMEWORK --- */}
      {showEditModal && selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-600" /> Edit Homework Assignment
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assignment Title *</label>
                <input 
                  type="text" 
                  required
                  value={editAssignment.title}
                  onChange={e => setEditAssignment({...editAssignment, title: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
                <textarea 
                  required
                  rows="3"
                  value={editAssignment.description}
                  onChange={e => setEditAssignment({...editAssignment, description: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Class</label>
                  <select 
                    value={editAssignment.className}
                    onChange={e => setEditAssignment({...editAssignment, className: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
                    {classes.length === 0 && <option value="Class X">Class X</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Section</label>
                  <input 
                    type="text" 
                    value={editAssignment.sectionName}
                    onChange={e => setEditAssignment({...editAssignment, sectionName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={editAssignment.subjectName}
                    onChange={e => setEditAssignment({...editAssignment, subjectName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    required
                    value={editAssignment.dueDate}
                    onChange={e => setEditAssignment({...editAssignment, dueDate: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Marks</label>
                  <input 
                    type="number"
                    value={editAssignment.totalMarks}
                    onChange={e => setEditAssignment({...editAssignment, totalMarks: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select 
                    value={editAssignment.status}
                    onChange={e => setEditAssignment({...editAssignment, status: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Evaluated">Evaluated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Replace Attachment</label>
                <input 
                  type="file"
                  onChange={e => setEditAssignment({...editAssignment, attachment: e.target.files[0]})}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" 
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: VIEW & EVALUATE SUBMISSIONS --- */}
      {showViewModal && selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700 mr-2">
                  {selectedHw.subjectName}
                </span>
                <span className="text-base font-bold text-gray-800">{selectedHw.title}</span>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Assignment Details Banner */}
              <div className="bg-blue-50/50 border border-blue-100 rounded p-4 text-xs space-y-2">
                <p className="text-gray-700 leading-relaxed font-medium">{selectedHw.description}</p>
                <div className="flex flex-wrap gap-4 text-gray-600 pt-2 border-t border-blue-100">
                  <span><strong>Class:</strong> {selectedHw.className} ({selectedHw.sectionName || 'A'})</span>
                  <span><strong>Due Date:</strong> {selectedHw.dueDate ? new Date(selectedHw.dueDate).toLocaleDateString() : 'N/A'}</span>
                  <span><strong>Total Marks:</strong> {selectedHw.totalMarks || 20}</span>
                  {selectedHw.fileUrl && (
                    <a 
                      href={selectedHw.fileUrl.startsWith('http') ? selectedHw.fileUrl : `http://localhost:5050/${selectedHw.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" /> Download Worksheet
                    </a>
                  )}
                </div>
              </div>

              {/* Evaluation Panel if evaluating a student */}
              {evaluatingStudent && (
                <div className="bg-emerald-50 border border-emerald-200 rounded p-4 animate-in fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" /> Grade Student: {evalForm.studentName} (Roll: {evalForm.rollNumber})
                    </h4>
                    <button onClick={() => setEvaluatingStudent(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">&times;</button>
                  </div>
                  <form onSubmit={handleSaveEvaluation} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Marks Obtained (Out of {selectedHw.totalMarks || 20}) *</label>
                        <input 
                          type="number"
                          required
                          max={selectedHw.totalMarks || 20}
                          min="0"
                          value={evalForm.marksObtained}
                          onChange={e => setEvalForm({...evalForm, marksObtained: e.target.value})}
                          placeholder="e.g. 18"
                          className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-bold" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Teacher Remarks / Feedback</label>
                        <input 
                          type="text"
                          value={evalForm.remarks}
                          onChange={e => setEvalForm({...evalForm, remarks: e.target.value})}
                          placeholder="e.g. Good derivation, minor calculation slip"
                          className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setEvaluatingStudent(null)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-xs"
                      >
                        Save Evaluation
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Submissions Table */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Student Submissions ({selectedHw.submissions ? selectedHw.submissions.length : 0} Submitted)
                  </h3>
                  {!evaluatingStudent && (
                    <button 
                      onClick={() => handleStartEvaluate({ studentName: '', rollNumber: '', marksObtained: '', remarks: '' })}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Grade New Student
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2 font-bold text-gray-700">Student Name</th>
                        <th className="px-3 py-2 font-bold text-gray-700">Roll No</th>
                        <th className="px-3 py-2 font-bold text-gray-700">Status</th>
                        <th className="px-3 py-2 font-bold text-gray-700">Marks</th>
                        <th className="px-3 py-2 font-bold text-gray-700">Remarks</th>
                        <th className="px-3 py-2 font-bold text-gray-700 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedHw.submissions && selectedHw.submissions.length > 0 ? (
                        selectedHw.submissions.map(sub => (
                          <tr key={sub._id} className="hover:bg-gray-50">
                            <td className="px-3 py-2.5 font-bold text-gray-800">{sub.studentName}</td>
                            <td className="px-3 py-2.5 text-gray-600 font-mono">{sub.rollNumber || '—'}</td>
                            <td className="px-3 py-2.5">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                                sub.status === 'Evaluated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 font-mono font-bold text-gray-800">
                              {sub.marksObtained !== null && sub.marksObtained !== undefined ? `${sub.marksObtained} / ${selectedHw.totalMarks || 20}` : '—'}
                            </td>
                            <td className="px-3 py-2.5 text-gray-600 line-clamp-1">{sub.remarks || '—'}</td>
                            <td className="px-3 py-2.5 text-center">
                              <button 
                                onClick={() => handleStartEvaluate(sub)}
                                className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                              >
                                {sub.status === 'Evaluated' ? 'Re-grade' : 'Grade'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                            No student submissions recorded yet. Click "Grade New Student" above to grade student copy.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-800 text-white rounded text-xs font-semibold hover:bg-gray-900"
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
};

export default Assignments;

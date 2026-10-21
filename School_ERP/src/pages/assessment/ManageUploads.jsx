import React, { useState, useEffect } from 'react';
import { 
  FileText, Copy, FileSpreadsheet, Printer, Columns, 
  RotateCcw, Eye, CheckCircle2, Clock, Trash2, Check, X,
  LayoutGrid, List as ListIcon, FileIcon, Search, UploadCloud,
  Download, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { examService } from '../../api/examService';
import { academicService } from '../../api/academicService';

export default function ManageUploads() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [uploads, setUploads] = useState([
    {
      id: '1',
      studentName: 'Aarav Sharma',
      rollNo: '101',
      className: 'Class 10-A',
      examName: 'Mid-Term Examination 2026',
      fileName: 'aarav_sharma_midterm_marksheet.pdf',
      fileSize: '342 KB',
      uploadedAt: '12 Oct 2026, 04:30 PM',
      published: true
    },
    {
      id: '2',
      studentName: 'Diya Patel',
      rollNo: '102',
      className: 'Class 10-A',
      examName: 'Mid-Term Examination 2026',
      fileName: 'diya_patel_midterm_marksheet.pdf',
      fileSize: '298 KB',
      uploadedAt: '12 Oct 2026, 04:35 PM',
      published: true
    },
    {
      id: '3',
      studentName: 'Rohan Gupta',
      rollNo: '103',
      className: 'Class 10-B',
      examName: 'Annual Examination 2026',
      fileName: 'rohan_gupta_annual_transcript.pdf',
      fileSize: '412 KB',
      uploadedAt: '13 Oct 2026, 10:15 AM',
      published: false
    },
    {
      id: '4',
      studentName: 'Ananya Verma',
      rollNo: '104',
      className: 'Class 9-A',
      examName: 'Periodic Assessment 1',
      fileName: 'ananya_pa1_marksheet.pdf',
      fileSize: '185 KB',
      uploadedAt: '13 Oct 2026, 11:20 AM',
      published: true
    }
  ]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [examsRes, classesRes] = await Promise.all([
        examService.getExams().catch(() => ({ exams: [] })),
        academicService.getClasses().catch(() => ({ classes: [] }))
      ]);
      setExams(Array.isArray(examsRes) ? examsRes : (examsRes?.data || examsRes?.exams || []));
      setClasses(Array.isArray(classesRes) ? classesRes : (classesRes?.data || classesRes?.classes || []));
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = (id) => {
    setUploads(uploads.map(u => {
      if (u.id === id) {
        const nextState = !u.published;
        Swal.fire({
          icon: 'info',
          title: nextState ? 'Published to Parents' : 'Withheld from Parents',
          text: `Marksheet for ${u.studentName} is now ${nextState ? 'accessible' : 'hidden'}.`,
          timer: 1500,
          showConfirmButton: false
        });
        return { ...u, published: nextState };
      }
      return u;
    }));
  };

  const handleDelete = async (id, studentName) => {
    const res = await Swal.fire({
      title: `Delete Marksheet?`,
      text: `Remove archived file for ${studentName}? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete'
    });

    if (res.isConfirmed) {
      setUploads(uploads.filter(u => u.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Document removed from archive.',
        timer: 1400,
        showConfirmButton: false
      });
    }
  };

  const filtered = uploads.filter(u => {
    const matchSearch = u.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.rollNo.includes(searchTerm) ||
                        u.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Digital Archive
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">External Uploaded Transcripts Repository</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-indigo-600" />
                Manage Uploaded Marksheets
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/offline-exams/upload-marksheet')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                Upload New Marksheet
              </button>
            </div>
          </div>

          <div className="mt-4">
            <OfflineExamsTabs />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Search & Mode Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, roll number, or file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content view */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Exam Term</th>
                    <th className="py-3 px-4">File Name & Size</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4 text-center">Parent Access</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {item.studentName}
                        <span className="block text-[11px] text-slate-400 font-normal">Roll: {item.rollNo}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{item.className}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{item.examName}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-indigo-600 font-mono font-medium">
                          <FileIcon className="w-3.5 h-3.5" />
                          {item.fileName}
                        </div>
                        <span className="text-[10px] text-slate-400">{item.fileSize}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{item.uploadedAt}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => togglePublish(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            item.published 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.published ? 'Live to Parents' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => Swal.fire({ icon: 'info', title: 'File Download', text: `Initiating download for ${item.fileName}` })}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.studentName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{item.studentName}</h3>
                    <p className="text-xs text-slate-500">Roll: {item.rollNo} • {item.className}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.published ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-mono text-slate-700 truncate">{item.fileName}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{item.fileSize}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePublish(item.id)}
                      className="px-2 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.studentName)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

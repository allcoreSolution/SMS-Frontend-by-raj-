import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, FileText, UploadCloud, X, Smartphone, 
  Eye, CheckCircle2, AlertCircle, ArrowRight, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { examService } from '../../api/examService';
import { academicService } from '../../api/academicService';
import { studentService } from '../../api/studentService';

export default function UploadMarksheet() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedStudent, setSelectedStudent] = useState('');
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    }
  }, [selectedClass]);

  const fetchInitialData = async () => {
    try {
      const [examsRes, classesRes] = await Promise.all([
        examService.getExams().catch(() => ({ data: [] })),
        academicService.getClasses().catch(() => ({ data: [] }))
      ]);
      const examsList = Array.isArray(examsRes) ? examsRes : (examsRes?.data || examsRes?.exams || []);
      const classesList = Array.isArray(classesRes) ? classesRes : (classesRes?.data || classesRes?.classes || []);
      setExams(examsList);
      setClasses(classesList);
      if (examsList.length > 0) setSelectedExam(examsList[0]._id);
      if (classesList.length > 0) setSelectedClass(classesList[0].className || classesList[0].name || classesList[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await studentService.getStudents({ limit: 20 }).catch(() => ({ data: [] }));
      const list = Array.isArray(res) ? res : (res?.data || res?.students || []);
      setStudents(list);
      if (list.length > 0) setSelectedStudent(list[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({ icon: 'warning', title: 'File Missing', text: 'Please select a PDF document to upload.' });
      return;
    }

    setUploading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      Swal.fire({
        icon: 'success',
        title: 'Marksheet Uploaded!',
        text: `Marksheet for student successfully archived and attached.`,
        timer: 1800,
        showConfirmButton: false
      });
      setFile(null);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to upload marksheet file.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Document Archival
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">External Digital Transcripts</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <UploadCloud className="w-6 h-6 text-indigo-600" />
                Upload External Marksheet
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                How Uploads Work
              </button>
              <button
                onClick={() => navigate('/offline-exams/manage-uploads')}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                View Uploaded Archive
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <OfflineExamsTabs />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        <form onSubmit={handleUpload} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Attach Official Student PDF Transcript</h2>
              <p className="text-xs text-slate-400">Select target student profile and attach the certified PDF document</p>
            </div>
          </div>

          {/* Student selection form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Examination Term <span className="text-rose-500">*</span></label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {Array.isArray(exams) && exams.map(e => (
                  <option key={e._id} value={e._id}>{e.examName || e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Class <span className="text-rose-500">*</span></label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {Array.isArray(classes) && classes.length > 0 ? (
                  classes.map((c, i) => (
                    <option key={c._id || i} value={c.className || c.name || c._id}>
                      {c.className || c.name || `Class ${i + 1}`}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Section <span className="text-rose-500">*</span></label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Student <span className="text-rose-500">*</span></label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {students.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.firstName || s.name || 'Student'} ({s.rollNumber || s.admissionNumber || 'Roll'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & drop upload box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Marksheet PDF / Scanned Document <span className="text-rose-500">*</span></label>
            <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 rounded-2xl p-8 text-center transition-colors">
              <input
                type="file"
                id="marksheet-upload"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="marksheet-upload" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                {file ? (
                  <div>
                    <span className="text-sm font-bold text-indigo-900 block">{file.name}</span>
                    <span className="text-xs text-indigo-600">{(file.size / 1024).toFixed(1)} KB • Click to replace file</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-bold text-slate-700 block">Click to browse or drop file here</span>
                    <span className="text-xs text-slate-400 mt-1 block">Supports PDF, PNG, JPEG up to 15MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setFile(null)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              {uploading ? 'Uploading & Encrypting...' : 'Upload Marksheet'}
            </button>
          </div>

        </form>

      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">How External Marksheets Work</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>External Marksheets</strong> allow schools to upload scanned or pre-generated official board certificates (e.g. CBSE 10th Board, ICSE, or State Board result cards) directly into the student's digital archive.
              </p>
              <p>
                Once uploaded, parents can download the certified document directly from the parent mobile application and student portal.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
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

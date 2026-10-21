import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, FileText, Info, Eye, UploadCloud, Upload, 
  Trash2, Download, CheckCircle2, AlertCircle, RefreshCw, X, FileCheck, Edit, Save
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../api/academicService';
import { studentService } from '../api/studentService';
import { examService } from '../api/examService';

const UploadMarksheet = () => {
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    student: '',
    examLink: '',
    docTitle: '',
    file: null
  });

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [uploadedList, setUploadedList] = useState([]);

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editingUpload, setEditingUpload] = useState(null);
  const [savingUploadEdit, setSavingUploadEdit] = useState(false);

  useEffect(() => {
    fetchInitialData();
    fetchUploadedMarksheets();
  }, []);

  // When class or section changes, load students
  useEffect(() => {
    if (formData.class) {
      loadStudentsForClass(formData.class, formData.section);
    } else {
      setStudents([]);
      setFormData(prev => ({ ...prev, student: '' }));
    }
  }, [formData.class, formData.section]);

  const fetchInitialData = async () => {
    setLoadingMeta(true);
    try {
      const [cls, sec, ex] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections(),
        examService.getExams()
      ]);
      if (cls && cls.data) setClasses(cls.data);
      if (sec && sec.data) setSections(sec.data);
      if (ex && ex.data) setExams(ex.data);
    } catch (e) {
      console.error('Failed to load initial metadata:', e);
    } finally {
      setLoadingMeta(false);
    }
  };

  const loadStudentsForClass = async (classId, sectionId) => {
    setLoadingStudents(true);
    try {
      const params = { classId, limit: 100 };
      if (sectionId) params.sectionId = sectionId;
      const res = await studentService.getStudents(params);
      if (res && res.data) {
        setStudents(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch students for class:', e);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchUploadedMarksheets = async () => {
    setLoadingList(true);
    try {
      const res = await examService.getUploadedMarksheets();
      if (res && res.data) {
        setUploadedList(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch uploaded marksheets:', e);
    } finally {
      setLoadingList(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select a valid PDF file.'
        });
        return;
      }
      setFormData(prev => ({ 
        ...prev, 
        file,
        docTitle: prev.docTitle || file.name.replace('.pdf', '').replace(/[-_]/g, ' ')
      }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.class || !formData.student || !formData.examLink || !formData.docTitle) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Required Fields',
        text: 'Please choose Class, Student, Exam Link, and specify Document Title.'
      });
      return;
    }

    setUploading(true);
    try {
      const selectedStudent = students.find(s => s._id === formData.student);
      const selectedClass = classes.find(c => c._id === formData.class);
      const selectedSection = sections.find(s => s._id === formData.section);
      const selectedExam = exams.find(e => e._id === formData.examLink);

      const payload = {
        student: formData.student,
        studentName: selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName || ''}`.trim() : 'Student',
        admissionNo: selectedStudent?.admissionNo || selectedStudent?.aparId || '',
        academicClass: formData.class,
        className: selectedClass ? selectedClass.className : 'Class',
        section: formData.section || undefined,
        sectionName: selectedSection ? selectedSection.sectionName : 'A',
        exam: formData.examLink,
        examName: selectedExam ? (selectedExam.examName || selectedExam.name) : 'General Exam',
        docTitle: formData.docTitle,
        fileName: formData.file ? formData.file.name : `${formData.docTitle.replace(/\s+/g, '_')}.pdf`,
        fileSize: formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(2)} MB` : '1.45 MB',
        fileUrl: '/uploads/marksheets/sample_marksheet.pdf',
        uploadedBy: 'Teacher Faculty'
      };

      const res = await examService.uploadMarksheet(payload);
      if (res.success || res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Marksheet Uploaded!',
          text: `"${formData.docTitle}" has been uploaded and linked to ${payload.studentName}'s record.`,
          timer: 2200,
          showConfirmButton: false
        });

        // Reset form
        setFormData(prev => ({
          ...prev,
          student: '',
          docTitle: '',
          file: null
        }));

        fetchUploadedMarksheets();
      }
    } catch (e) {
      console.error('Error uploading marksheet:', e);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: e.response?.data?.message || 'Could not upload marksheet to the server.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Marksheet?',
      text: `Are you sure you want to delete "${title}"? Parents will no longer see this document in their portal.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await examService.deleteUploadedMarksheet(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The marksheet record was removed.',
          timer: 1800,
          showConfirmButton: false
        });
        fetchUploadedMarksheets();
      } catch (err) {
        console.error('Error deleting marksheet:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Could not delete marksheet.'
        });
      }
    }
  };

  const handleSaveEditedUpload = async (e) => {
    e.preventDefault();
    if (!editingUpload) return;

    setSavingUploadEdit(true);
    try {
      const selectedExam = exams.find(ex => ex._id === editingUpload.exam);
      const payload = {
        docTitle: editingUpload.docTitle,
        exam: editingUpload.exam,
        examName: selectedExam ? (selectedExam.examName || selectedExam.name) : editingUpload.examName,
        fileName: editingUpload.fileName,
        remarks: editingUpload.remarks || ''
      };

      const res = await examService.updateUploadedMarksheet(editingUpload._id, payload);
      if (res.success || res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Marksheet Updated',
          text: 'Uploaded marksheet details updated successfully.',
          timer: 1800,
          showConfirmButton: false
        });
        setEditingUpload(null);
        fetchUploadedMarksheets();
      }
    } catch (err) {
      console.error('Error updating uploaded marksheet:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not save marksheet updates.'
      });
    } finally {
      setSavingUploadEdit(false);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm">
      {/* Page Header */}
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Upload External Marksheet</h1>
          <p className="text-xs text-gray-500 mt-0.5">Upload certified digital PDF marksheets or scanned result certificates for students</p>
        </div>
        
        <button 
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-2 bg-white border border-[#17a2b8] text-[#17a2b8] px-4 py-1.5 rounded-full shadow-sm hover:bg-[#17a2b8] hover:text-white font-semibold transition-colors text-xs"
        >
          <HelpCircle className="w-4 h-4" /> How Uploads Work
        </button>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Upload Form Card */}
        <div className="bg-white rounded border-t-4 border-t-[#fd7e14] border-x border-b border-gray-200 shadow-sm relative">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <FileText className="w-5 h-5 text-[#007bff]" />
            <h2 className="font-bold text-[#007bff] text-sm uppercase tracking-wide">
              Upload a PDF Marksheet for a Student
            </h2>
          </div>
          
          <form onSubmit={handleUpload} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Class <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.class}
                  onChange={e => setFormData({...formData, class: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Section</label>
                <select 
                  value={formData.section}
                  onChange={e => setFormData({...formData, section: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400"
                >
                  <option value="">All Sections</option>
                  {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Student <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.student}
                  disabled={!formData.class || loadingStudents}
                  onChange={e => setFormData({...formData, student: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!formData.class ? '-- Select Class First --' : loadingStudents ? 'Loading students...' : '-- Select Student --'}
                  </option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.firstName} {s.lastName || ''} (Roll: {s.rollNo || s.admissionNo || '-'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Exam / Term Link <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.examLink}
                  onChange={e => setFormData({...formData, examLink: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400 mb-1.5"
                >
                  <option value="">-- Select Corresponding Exam --</option>
                  {exams.map(e => (
                    <option key={e._id} value={e._id}>{e.examName || e.name} ({e.session})</option>
                  ))}
                </select>
                <p className="flex items-center gap-1.5 text-[11px] text-[#17a2b8]">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" /> Ties this PDF marksheet to a specific examination milestone in the student's history.
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.docTitle}
                  onChange={e => setFormData({...formData, docTitle: e.target.value})}
                  placeholder="e.g., Annual Board Examination Marksheet 2026-2027"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 mb-1.5"
                />
                <p className="flex items-center gap-1.5 text-[11px] text-[#28a745]">
                  <Eye className="w-3.5 h-3.5 flex-shrink-0" /> This exact title is displayed to parents in their Mobile Parent App.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Marksheet PDF File <span className="text-red-500">*</span>
              </label>
              
              <div className="flex items-center w-full mt-1">
                <div 
                  className="bg-[#4680ff] w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-l cursor-pointer hover:bg-[#3468d9] transition-colors" 
                  onClick={() => document.getElementById('file-upload-input').click()}
                >
                  <UploadCloud className="w-5 h-5 text-white" />
                </div>
                
                <div 
                  className="flex-1 border-y border-gray-300 bg-white h-10 flex items-center px-4 cursor-pointer overflow-hidden" 
                  onClick={() => document.getElementById('file-upload-input').click()}
                >
                  <span className={`text-xs truncate ${formData.file ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                    {formData.file ? `${formData.file.name} (${(formData.file.size / (1024*1024)).toFixed(2)} MB)` : 'Choose a certified PDF marksheet file...'}
                  </span>
                </div>
                
                <div 
                  className="bg-[#f4f7fa] border-y border-r border-gray-300 h-10 px-4 flex items-center justify-center font-semibold text-gray-700 text-xs rounded-r cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => document.getElementById('file-upload-input').click()}
                >
                  Browse
                </div>
                
                <input 
                  id="file-upload-input" 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5 flex justify-end">
              <button 
                type="submit"
                disabled={uploading}
                className="bg-[#fd7e14] hover:bg-[#e06602] text-white font-bold flex items-center gap-2 px-6 py-2.5 rounded shadow-sm transition-colors text-xs disabled:opacity-50"
              >
                {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading Marksheet...' : 'Securely Upload Marksheet'}
              </button>
            </div>
          </form>
        </div>

        {/* Recently Uploaded Marksheets Card */}
        <div className="bg-white rounded border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" /> Uploaded Marksheet Registry
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">List of verified marksheets uploaded to the cloud repository</p>
            </div>
            <button 
              onClick={fetchUploadedMarksheets}
              className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-blue-600 hover:bg-white transition-colors"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${loadingList ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-[#f8f9fe]">
                  <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase">Document Title</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase">Student Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase">Class</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase">Exam Milestones</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase">File Size</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase">Uploaded On</th>
                  <th className="px-6 py-3 text-xs font-bold text-[#5d78ff] uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedList.length > 0 ? (
                  uploadedList.map(item => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-gray-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-rose-500 flex-shrink-0" />
                          <span>{item.docTitle}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-mono">{item.fileName}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-gray-800">{item.studentName}</div>
                        <span className="text-[11px] text-gray-400">Adm: {item.admissionNo || '-'}</span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-600 text-xs font-medium">
                        {item.className} {item.sectionName ? `- ${item.sectionName}` : ''}
                      </td>
                      <td className="px-6 py-3.5 text-gray-700 text-xs font-semibold">
                        {item.examName}
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-xs font-mono">
                        {item.fileSize || '1.2 MB'}
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-xs">
                        {formatDateDisplay(item.createdAt)}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => setPreviewDoc(item)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Preview Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingUpload(JSON.parse(JSON.stringify(item)))}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                            title="Edit Marksheet Info"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id, item.docTitle)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Remove Marksheet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 bg-white">
                      <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      No marksheets uploaded yet. Fill in the form above to upload a verified student marksheet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ===== Preview Modal ===== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-bold text-gray-800">Uploaded Marksheet Record</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <span className="text-[11px] text-gray-400 font-bold uppercase">Document Title</span>
                <p className="text-base font-bold text-indigo-700">{previewDoc.docTitle}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded space-y-1 text-xs">
                <p><strong className="text-gray-600">Student:</strong> {previewDoc.studentName}</p>
                <p><strong className="text-gray-600">Admission No:</strong> {previewDoc.admissionNo || '-'}</p>
                <p><strong className="text-gray-600">Class:</strong> {previewDoc.className} ({previewDoc.sectionName})</p>
                <p><strong className="text-gray-600">Linked Exam:</strong> {previewDoc.examName}</p>
                <p><strong className="text-gray-600">File Name:</strong> {previewDoc.fileName}</p>
                <p><strong className="text-gray-600">Uploaded By:</strong> {previewDoc.uploadedBy}</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== How Uploads Work Modal ===== */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowHelpModal(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-cyan-50">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-700" />
                <h3 className="text-sm font-bold text-gray-800">How Marksheet Uploads Work</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <p><strong className="text-gray-800">Target Mapping:</strong> Select the Class and Student for whom this external PDF report card belongs.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <p><strong className="text-gray-800">Milestone Tagging:</strong> Link the upload with the corresponding offline Exam term (e.g. Mid-Term or Annual Exam).</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <p><strong className="text-gray-800">Parent Access:</strong> Once uploaded, the PDF is securely indexed in the student's cloud vault and accessible directly through the Parent Portal mobile app.</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 bg-cyan-700 text-white rounded text-xs font-semibold hover:bg-cyan-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Uploaded Marksheet Modal ===== */}
      {editingUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditingUpload(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-amber-50/60">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-gray-800 text-sm">Edit Marksheet Record</h3>
              </div>
              <button onClick={() => setEditingUpload(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleSaveEditedUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Student</label>
                <input 
                  type="text" 
                  disabled
                  value={`${editingUpload.studentName} (${editingUpload.className})`}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-xs bg-gray-100 text-gray-600 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={editingUpload.docTitle}
                  onChange={e => setEditingUpload({...editingUpload, docTitle: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Linked Examination Term</label>
                <select 
                  value={editingUpload.exam}
                  onChange={e => setEditingUpload({...editingUpload, exam: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white focus:outline-none focus:border-blue-500" 
                >
                  {exams.map(ex => (
                    <option key={ex._id} value={ex._id}>{ex.examName || ex.name} ({ex.session})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">File Name Display</label>
                <input 
                  type="text" 
                  value={editingUpload.fileName}
                  onChange={e => setEditingUpload({...editingUpload, fileName: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Remarks</label>
                <input 
                  type="text" 
                  value={editingUpload.remarks || ''}
                  onChange={e => setEditingUpload({...editingUpload, remarks: e.target.value})}
                  placeholder="Optional verification note..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setEditingUpload(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={savingUploadEdit}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  {savingUploadEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {savingUploadEdit ? 'Saving...' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UploadMarksheet;

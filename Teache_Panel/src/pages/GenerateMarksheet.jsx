import React, { useState, useEffect } from 'react';
import { 
  Download, Monitor, CheckSquare, Search, Printer, 
  Eye, RefreshCw, AlertCircle, Award, CheckCircle2, X, FileText, Edit, Plus, Trash2, Save
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../api/academicService';
import { examService } from '../api/examService';

const GenerateMarksheet = () => {
  const [formData, setFormData] = useState({
    exam: '',
    class: '',
    section: '',
    show: 'full'
  });

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [exams, setExams] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedExamObj, setSelectedExamObj] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Preview Marksheet Modal
  const [previewStudent, setPreviewStudent] = useState(null);

  // Edit Student Marksheet Modal
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    setLoadingMeta(true);
    try {
      const [cls, sec, ex, sub] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections(),
        examService.getExams(),
        academicService.getSubjects()
      ]);
      if (cls && cls.data) setClasses(cls.data);
      if (sec && sec.data) setSections(sec.data);
      if (sub && sub.data) setAllSubjects(sub.data);
      if (ex && ex.data) {
        setExams(ex.data);
        if (ex.data.length > 0) {
          setFormData(prev => ({ ...prev, exam: ex.data[0]._id }));
        }
      }
    } catch (e) {
      console.error('Failed to load metadata in GenerateMarksheet:', e);
    } finally {
      setLoadingMeta(false);
    }
  };

  const handleSearch = async () => {
    if (!formData.exam || !formData.class) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Criteria',
        text: 'Please select both Exam and Class to generate marksheet registers.'
      });
      return;
    }

    setLoading(true);
    try {
      const params = {
        examId: formData.exam,
        classId: formData.class,
        ...(formData.section ? { sectionId: formData.section } : {})
      };
      const res = await examService.getClassMarksheets(params);
      if (res && res.data) {
        setStudents(res.data);
        setSelectedExamObj(res.exam || exams.find(e => e._id === formData.exam));
        setSelectedStudentIds(res.data.map(s => s.studentId));
        setLoaded(true);
      }
    } catch (e) {
      console.error('Error fetching class marksheets:', e);
      Swal.fire({
        icon: 'error',
        title: 'Search Failed',
        text: 'Could not fetch student marksheets for the selected class.'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s.studentId));
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePrintSingle = (student) => {
    setPreviewStudent(student);
  };

  const handlePrintAll = () => {
    if (students.length === 0) return;
    window.print();
  };

  // Open Edit Marksheet Modal for a Student
  const handleOpenEdit = (student) => {
    // If student has subjects recorded, use them; if empty, initialize with default academic subjects
    let subs = [];
    if (student.subjects && student.subjects.length > 0) {
      subs = student.subjects.map(s => ({
        subjectId: s.subject?._id || s.subject || allSubjects.find(sub => sub.subjectName === s.subjectName)?._id,
        subjectName: s.subjectName,
        marksObtained: s.marksObtained != null ? String(s.marksObtained) : '0',
        maxMarks: s.maxMarks || 100,
        grade: s.grade || 'C',
        attendance: s.attendance || 'Present',
        remarks: s.remarks || ''
      }));
    } else {
      subs = allSubjects.slice(0, 5).map(sub => ({
        subjectId: sub._id,
        subjectName: sub.subjectName,
        marksObtained: '0',
        maxMarks: 100,
        grade: 'D',
        attendance: 'Present',
        remarks: ''
      }));
    }

    setEditingStudent({
      ...student,
      subjects: subs
    });
  };

  // Handle inline changes in Edit Marksheet modal
  const handleEditSubjectChange = (index, field, value) => {
    setEditingStudent(prev => {
      const newSubs = [...prev.subjects];
      newSubs[index][field] = value;

      // Auto recalculate grade for this subject
      if (field === 'marksObtained' || field === 'maxMarks') {
        const marks = Number(newSubs[index].marksObtained) || 0;
        const max = Number(newSubs[index].maxMarks) || 100;
        const pct = max > 0 ? (marks / max) * 100 : 0;
        let g = 'D';
        if (pct >= 90) g = 'A1';
        else if (pct >= 80) g = 'A2';
        else if (pct >= 70) g = 'B1';
        else if (pct >= 60) g = 'B2';
        else if (pct >= 50) g = 'C1';
        else if (pct >= 40) g = 'C2';
        newSubs[index].grade = g;
      }

      return { ...prev, subjects: newSubs };
    });
  };

  const handleAddSubjectToStudent = () => {
    const existingIds = editingStudent.subjects.map(s => s.subjectId);
    const available = allSubjects.find(s => !existingIds.includes(s._id)) || allSubjects[0];

    setEditingStudent(prev => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          subjectId: available?._id || 'sub-custom',
          subjectName: available?.subjectName || 'Elective Subject',
          marksObtained: '0',
          maxMarks: 100,
          grade: 'D',
          attendance: 'Present',
          remarks: ''
        }
      ]
    }));
  };

  const handleRemoveSubjectFromStudent = (index) => {
    setEditingStudent(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  // Save edited marksheet
  const handleSaveEditedMarksheet = async (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    setSavingEdit(true);
    try {
      const payload = {
        examId: formData.exam,
        studentId: editingStudent.studentId,
        academicClass: formData.class,
        subjects: editingStudent.subjects.map(s => ({
          subjectId: s.subjectId,
          subjectName: s.subjectName,
          marksObtained: Number(s.marksObtained) || 0,
          maxMarks: Number(s.maxMarks) || 100,
          grade: s.grade,
          attendance: s.attendance,
          remarks: s.remarks || ''
        }))
      };

      const res = await examService.updateStudentMarksheet(payload);
      if (res.success || res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Marksheet Updated!',
          text: `Scholastic records for ${editingStudent.name} saved to database.`,
          timer: 2000,
          showConfirmButton: false
        });

        // Close modal and refresh marksheet list
        setEditingStudent(null);
        if (previewStudent && previewStudent.studentId === editingStudent.studentId) {
          setPreviewStudent(null);
        }
        handleSearch();
      }
    } catch (err) {
      console.error('Error updating student marksheet:', err);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.response?.data?.message || 'Could not save student marksheet.'
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter based on "Show" dropdown
  const displayedStudents = students.filter(s => {
    if (formData.show === 'active') {
      return s.status !== 'Pending';
    }
    return true;
  });

  // Calculate live stats for the student being edited
  const editTotalObtained = editingStudent?.subjects?.reduce((acc, s) => acc + (Number(s.marksObtained) || 0), 0) || 0;
  const editTotalMax = editingStudent?.subjects?.reduce((acc, s) => acc + (Number(s.maxMarks) || 100), 0) || 0;
  const editPercentage = editTotalMax > 0 ? ((editTotalObtained / editTotalMax) * 100).toFixed(1) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm">
      {/* Page Header */}
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Generate & Edit Student Marksheets</h1>
          <p className="text-xs text-gray-500 mt-0.5">Calculate aggregate scores, assign CGPA grades, edit individual marks, and produce printable CBSE/State report cards</p>
        </div>
      </div>

      <div className="p-6">
        {/* Select Criteria Card */}
        <div className="bg-white rounded border border-gray-200 shadow-sm mb-6">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="font-bold text-gray-700 text-sm">Select Criteria for Marksheet Generation</h2>
            {loadingMeta && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading criteria...
              </span>
            )}
          </div>
          
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Exam <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.exam} 
                onChange={e => setFormData({...formData, exam: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400"
              >
                <option value="">Select Exam</option>
                {exams.map(ex => (
                  <option key={ex._id} value={ex._id}>{ex.examName || ex.name} ({ex.session})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                Class <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.class} 
                onChange={e => setFormData({...formData, class: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400"
              >
                <option value="">Select Class</option>
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
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Filter Register</label>
              <select 
                value={formData.show} 
                onChange={e => setFormData({...formData, show: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400"
              >
                <option value="full">Full register (All enrolled)</option>
                <option value="active">Active with marks entered</option>
              </select>
            </div>

            <div>
              <button 
                onClick={handleSearch} 
                disabled={loading}
                className="w-full bg-[#f06e33] hover:bg-[#de5e24] text-white font-bold px-5 py-2 rounded text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 h-[35px]"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Area after Search */}
        {loaded && (
          <div className="bg-white rounded border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-[#f8f9fe]">
              <div>
                <h2 className="font-bold text-gray-800 text-sm">
                  Student Marksheet Register ({displayedStudents.length})
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedExamObj ? `${selectedExamObj.examName || selectedExamObj.name} (${selectedExamObj.session})` : 'Offline Examination'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {displayedStudents.length > 0 && (
                  <>
                    <button 
                      onClick={() => setPreviewStudent(displayedStudents[0])}
                      className="flex items-center gap-1.5 bg-[#5d78ff] hover:bg-[#4b65e6] text-white px-3.5 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Monitor className="w-3.5 h-3.5"/> Preview Marksheet
                    </button>
                    <button 
                      onClick={handlePrintAll}
                      className="flex items-center gap-1.5 bg-[#1dc9b7] hover:bg-[#19b1a1] text-white px-3.5 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5"/> Print Register
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedStudentIds.length === displayedStudents.length && displayedStudents.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer" 
                      />
                    </th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase w-20">Roll No</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Student Name</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase w-32">Aggregate Score</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase w-24 text-center">Grade</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase w-32">Result Status</th>
                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase text-center w-52">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStudents.map((student) => (
                    <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedStudentIds.includes(student.studentId)}
                          onChange={() => toggleSelectStudent(student.studentId)}
                          className="w-4 h-4 rounded text-blue-600 cursor-pointer" 
                        />
                      </td>
                      <td className="px-5 py-3 text-gray-800 font-bold font-mono text-xs">{student.roll}</td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-gray-800">{student.name}</div>
                        <span className="text-[11px] text-gray-400">Adm: {student.admissionNo || '-'}</span>
                      </td>
                      <td className="px-5 py-3 text-xs">
                        {student.hasMarks ? (
                          <div>
                            <span className="font-bold text-gray-800">{student.totalObtained}</span> / {student.totalMax}
                            <span className="text-gray-500 font-medium ml-1">({student.percentage}%)</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No marks entered</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {student.hasMarks ? (
                          <span className={`inline-block px-2.5 py-0.5 rounded font-bold text-xs ${
                            student.grade === 'A1' || student.grade === 'A2' ? 'bg-emerald-100 text-emerald-800' :
                            student.grade === 'B1' || student.grade === 'B2' ? 'bg-blue-100 text-blue-800' :
                            student.grade === 'C1' || student.grade === 'C2' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {student.grade}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                          student.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' :
                          student.status === 'Needs Improvement' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {student.status === 'Passed' && <CheckSquare className="w-3 h-3" />}
                          {student.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleOpenEdit(student)}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Edit Subject Marks & Grades"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit Marks
                          </button>
                          <button 
                            onClick={() => handlePrintSingle(student)}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                            title="View / Print Marksheet Card"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Card
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayedStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        No students found for this class and examination.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ===== EDIT MARKSHEET MODAL ===== */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditingStudent(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-amber-50/60">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    Edit Marksheet: <span className="text-indigo-700">{editingStudent.name}</span>
                  </h3>
                  <p className="text-xs text-gray-500">Roll No: {editingStudent.roll} • Adm: {editingStudent.admissionNo || '-'}</p>
                </div>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleSaveEditedMarksheet} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Live Aggregate Summary Banner */}
              <div className="bg-indigo-50/70 border border-indigo-200 p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-700 font-bold uppercase">Aggregate Total</span>
                  <p className="text-xl font-extrabold text-indigo-950 mt-0.5">
                    {editTotalObtained} <span className="text-xs font-normal text-gray-500">/ {editTotalMax}</span>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-indigo-700 font-bold uppercase">Percentage</span>
                  <p className="text-xl font-extrabold text-indigo-950 mt-0.5">{editPercentage}%</p>
                </div>
                <div>
                  <span className="text-xs text-indigo-700 font-bold uppercase">Overall Grade</span>
                  <p className="text-xl font-extrabold text-indigo-950 mt-0.5">
                    {editPercentage >= 90 ? 'A1' : editPercentage >= 80 ? 'A2' : editPercentage >= 70 ? 'B1' : editPercentage >= 60 ? 'B2' : editPercentage >= 50 ? 'C1' : editPercentage >= 40 ? 'C2' : 'D'}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={handleAddSubjectToStudent}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subject
                </button>
              </div>

              {/* Subject Marks Rows */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 px-2 uppercase">
                  <div className="col-span-4">Subject Name</div>
                  <div className="col-span-2 text-center">Marks (Score)</div>
                  <div className="col-span-2 text-center">Max Marks</div>
                  <div className="col-span-2 text-center">Attendance</div>
                  <div className="col-span-1 text-center">Grade</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {editingStudent.subjects && editingStudent.subjects.map((sub, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    <div className="col-span-4">
                      <select
                        value={sub.subjectId}
                        onChange={e => {
                          const matched = allSubjects.find(s => s._id === e.target.value);
                          handleEditSubjectChange(idx, 'subjectId', e.target.value);
                          if (matched) handleEditSubjectChange(idx, 'subjectName', matched.subjectName);
                        }}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold bg-white"
                      >
                        {allSubjects.map(s => (
                          <option key={s._id} value={s._id}>{s.subjectName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <input 
                        type="number"
                        min="0"
                        max={sub.maxMarks}
                        value={sub.marksObtained}
                        onChange={e => handleEditSubjectChange(idx, 'marksObtained', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-center font-bold focus:border-blue-500 bg-white"
                        placeholder="85"
                      />
                    </div>

                    <div className="col-span-2">
                      <input 
                        type="number"
                        min="1"
                        value={sub.maxMarks}
                        onChange={e => handleEditSubjectChange(idx, 'maxMarks', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-center font-medium bg-white"
                        placeholder="100"
                      />
                    </div>

                    <div className="col-span-2">
                      <select
                        value={sub.attendance}
                        onChange={e => handleEditSubjectChange(idx, 'attendance', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white font-medium"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Exempt">Exempt</option>
                      </select>
                    </div>

                    <div className="col-span-1 text-center font-bold text-indigo-700 text-xs">
                      {sub.grade}
                    </div>

                    <div className="col-span-1 text-center">
                      <button 
                        type="button"
                        onClick={() => handleRemoveSubjectFromStudent(idx)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Remove Subject"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={savingEdit}
                  className="px-5 py-2 bg-[#5d78ff] hover:bg-[#4b65e6] text-white rounded text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  {savingEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {savingEdit ? 'Saving Changes...' : 'Save Marksheet to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Official Student Marksheet Preview Modal ===== */}
      {previewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreviewStudent(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 print:hidden">
              <h3 className="font-bold text-gray-800 text-sm">Official Marksheet Card</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    handleOpenEdit(previewStudent);
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit This Marksheet
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Marksheet
                </button>
                <button onClick={() => setPreviewStudent(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              </div>
            </div>

            {/* Marksheet Document */}
            <div className="flex-1 overflow-y-auto p-8 bg-white print:p-4">
              <div className="border-4 border-double border-indigo-900 p-6 rounded-lg">
                {/* Header */}
                <div className="text-center border-b-2 border-indigo-900 pb-4 mb-4">
                  <h2 className="text-xl font-black text-indigo-950 tracking-wider">SPRINGDALE CENTRAL ACADEMY</h2>
                  <p className="text-xs text-gray-600 font-medium">Affiliated to CBSE / State Board of Education • School Code: 89402</p>
                  <div className="mt-2 inline-block bg-indigo-50 border border-indigo-200 px-4 py-1 rounded-full">
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">
                      {selectedExamObj ? (selectedExamObj.examName || selectedExamObj.name) : 'Official Term Assessment'}
                    </span>
                  </div>
                </div>

                {/* Student Details Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-5 bg-gray-50 p-3 rounded border border-gray-200">
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Student Name:</span>
                    <p className="font-extrabold text-gray-900 text-sm">{previewStudent.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Roll No / Admission No:</span>
                    <p className="font-bold text-gray-900">Roll: {previewStudent.roll} • Adm: {previewStudent.admissionNo || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Class & Section:</span>
                    <p className="font-bold text-gray-900">{previewStudent.class} - {previewStudent.section}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[10px]">Academic Session:</span>
                    <p className="font-bold text-gray-900">{selectedExamObj?.session || '2026-2027'}</p>
                  </div>
                </div>

                {/* Subject-Wise Marks Breakdown Table */}
                <div className="mb-5">
                  <h4 className="text-xs font-extrabold text-indigo-950 uppercase mb-1.5 tracking-wider">
                    Scholastic Performance
                  </h4>
                  <table className="w-full text-left border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-indigo-900 text-white">
                        <th className="p-2 border border-indigo-900">Subject Name</th>
                        <th className="p-2 border border-indigo-900 text-center w-24">Max Marks</th>
                        <th className="p-2 border border-indigo-900 text-center w-28">Marks Obtained</th>
                        <th className="p-2 border border-indigo-900 text-center w-20">Grade</th>
                        <th className="p-2 border border-indigo-900 text-center w-24">Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewStudent.subjects && previewStudent.subjects.length > 0 ? (
                        previewStudent.subjects.map((sub, idx) => (
                          <tr key={idx} className="border-b border-gray-200 even:bg-gray-50">
                            <td className="p-2 font-semibold text-gray-800 border-r border-gray-200">{sub.subjectName}</td>
                            <td className="p-2 text-center text-gray-600 border-r border-gray-200">{sub.maxMarks}</td>
                            <td className="p-2 text-center font-bold text-gray-900 border-r border-gray-200">{sub.marksObtained}</td>
                            <td className="p-2 text-center font-bold text-indigo-700 border-r border-gray-200">{sub.grade}</td>
                            <td className="p-2 text-center text-emerald-700 font-semibold">{sub.attendance}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-400 italic">
                            No subject marks recorded yet.
                          </td>
                        </tr>
                      )}
                      <tr className="bg-indigo-50 font-bold text-gray-900 border-t-2 border-indigo-900">
                        <td className="p-2">Grand Total</td>
                        <td className="p-2 text-center">{previewStudent.totalMax || 0}</td>
                        <td className="p-2 text-center text-indigo-900 font-black">{previewStudent.totalObtained || 0}</td>
                        <td className="p-2 text-center text-indigo-900">{previewStudent.grade || '-'}</td>
                        <td className="p-2 text-center text-xs">{previewStudent.percentage}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Final Assessment Summary */}
                <div className="grid grid-cols-3 gap-3 text-center my-4 p-3 bg-gray-50 rounded border border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Percentage</span>
                    <p className="text-base font-extrabold text-indigo-800 mt-0.5">{previewStudent.percentage}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Overall Grade</span>
                    <p className="text-base font-extrabold text-indigo-800 mt-0.5">{previewStudent.grade}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Final Status</span>
                    <p className={`text-base font-extrabold mt-0.5 ${
                      previewStudent.status === 'Passed' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {previewStudent.status}
                    </p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-end text-[11px] text-gray-600">
                  <div className="text-center">
                    <p className="border-t border-gray-400 pt-1 w-32 font-medium">Class Teacher</p>
                  </div>
                  <div className="text-center">
                    <p className="border-t border-gray-400 pt-1 w-32 font-medium">Exam Controller</p>
                  </div>
                  <div className="text-center">
                    <p className="border-t border-gray-400 pt-1 w-32 font-bold text-indigo-950">Principal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end print:hidden">
              <button 
                onClick={() => setPreviewStudent(null)}
                className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
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

export default GenerateMarksheet;

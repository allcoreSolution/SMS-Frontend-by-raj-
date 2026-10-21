import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Save, RefreshCw, AlertCircle, Users, Award, 
  TrendingUp, ArrowLeft, Filter, FileSpreadsheet
} from 'lucide-react';
import Swal from 'sweetalert2';
import { studentService } from '../api/studentService';
import { examService } from '../api/examService';
import { academicService } from '../api/academicService';

const EnterMarks = () => {
  const [formData, setFormData] = useState({
    exam: '',
    class: '',
    section: '',
    subject: '',
    show: 'full',
    maxMarks: 100
  });

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingMarks, setSavingMarks] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    setLoadingMeta(true);
    try {
      const [cls, sec, sub, ex] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections(),
        academicService.getSubjects(),
        examService.getExams()
      ]);

      if (cls && cls.data) setClasses(cls.data);
      if (sec && sec.data) setSections(sec.data);
      if (sub && sub.data) setSubjects(sub.data);
      if (ex && ex.data) setExams(ex.data);
    } catch (e) {
      console.error('Failed to load metadata in EnterMarks:', e);
    } finally {
      setLoadingMeta(false);
    }
  };

  const handleLoad = async () => {
    if (!formData.exam || !formData.class || !formData.subject) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Criteria',
        text: 'Please select Exam, Class, and Subject to load the student marksheet.'
      });
      return;
    }

    setLoadingStudents(true);
    try {
      // 1. Fetch Students
      const studentParams = { 
        classId: formData.class, 
        limit: 100 
      };
      if (formData.section) {
        studentParams.sectionId = formData.section;
      }
      const studentResp = await studentService.getStudents(studentParams);
      const studentList = studentResp.data || [];

      // 2. Fetch Existing Marks for this exam & subject
      const marksResp = await examService.getMarks({
        examId: formData.exam,
        subjectId: formData.subject,
        classId: formData.class,
        ...(formData.section ? { sectionId: formData.section } : {})
      });
      const existingResults = marksResp.data || [];

      // Map existing results by student ID
      const resultsMap = {};
      existingResults.forEach(r => {
        const sId = r.student?._id || r.student;
        if (sId) resultsMap[sId.toString()] = r;
      });

      // Construct student rows
      const rows = studentList.map(s => {
        const existing = resultsMap[s._id.toString()];
        return {
          id: s._id,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          roll: s.rollNo || s.admissionNo || s.aparId || '-',
          admissionNo: s.admissionNo || s.aparId || '',
          marks: existing && existing.marksObtained != null ? String(existing.marksObtained) : '',
          maxMarks: existing?.maxMarks || formData.maxMarks || 100,
          attendance: existing?.attendance || 'Present',
          grade: existing?.grade || '-',
          remarks: existing?.remarks || ''
        };
      });

      setStudents(rows);
      setLoaded(true);
    } catch (e) {
      console.error('Error loading students and marks:', e);
      Swal.fire({
        icon: 'error',
        title: 'Load Failed',
        text: 'Could not load student roster. Please check network connection.'
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleMarkChange = (id, val) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== id) return s;
      const numVal = Number(val);
      const max = Number(s.maxMarks) || 100;
      
      let calculatedGrade = '-';
      if (val !== '' && !isNaN(numVal)) {
        const pct = (numVal / max) * 100;
        if (pct >= 90) calculatedGrade = 'A1';
        else if (pct >= 80) calculatedGrade = 'A2';
        else if (pct >= 70) calculatedGrade = 'B1';
        else if (pct >= 60) calculatedGrade = 'B2';
        else if (pct >= 50) calculatedGrade = 'C1';
        else if (pct >= 40) calculatedGrade = 'C2';
        else calculatedGrade = 'D';
      }

      return {
        ...s,
        marks: val,
        grade: calculatedGrade
      };
    }));
  };

  const handleAttendanceChange = (id, val) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        attendance: val,
        marks: val === 'Absent' ? '0' : s.marks,
        grade: val === 'Absent' ? 'Ab' : s.grade
      };
    }));
  };

  const handleRemarksChange = (id, val) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, remarks: val } : s));
  };

  const handleMarkAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, attendance: 'Present' })));
  };

  const handleSaveMarks = async () => {
    // Collect all entered marks
    const entered = students.filter(s => s.marks !== '' || s.attendance === 'Absent');
    if (entered.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Marks Entered',
        text: 'Please enter marks for at least one student before saving.'
      });
      return;
    }

    // Validate that marks do not exceed maxMarks
    for (const item of entered) {
      const val = Number(item.marks);
      const max = Number(item.maxMarks) || 100;
      if (val < 0 || val > max) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Marks Value',
          text: `Marks for "${item.name}" (${val}) must be between 0 and ${max}.`
        });
        return;
      }
    }

    setSavingMarks(true);
    try {
      const payload = {
        exam: formData.exam,
        subject: formData.subject,
        academicClass: formData.class,
        academicSection: formData.section || undefined,
        marksList: entered.map(s => ({
          studentId: s.id,
          marksObtained: Number(s.marks) || 0,
          maxMarks: Number(s.maxMarks) || 100,
          attendance: s.attendance,
          remarks: s.remarks || ''
        }))
      };

      const res = await examService.saveMarksBatch(payload);
      if (res.success || res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Marks Saved Successfully!',
          text: `Persisted results for ${entered.length} student(s) into database.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (e) {
      console.error('Error saving marks:', e);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: e.response?.data?.message || 'Could not save examination marks to the server.'
      });
    } finally {
      setSavingMarks(false);
    }
  };

  // Filter based on "Show" dropdown
  const displayedStudents = students.filter(s => {
    if (formData.show === 'present') {
      return s.attendance === 'Present';
    }
    return true;
  });

  // Calculate statistics
  const enteredCount = students.filter(s => s.marks !== '').length;
  const marksValues = students.filter(s => s.marks !== '' && !isNaN(Number(s.marks))).map(s => Number(s.marks));
  const avgMarks = marksValues.length > 0 
    ? (marksValues.reduce((a, b) => a + b, 0) / marksValues.length).toFixed(1) 
    : '0';
  const highestMark = marksValues.length > 0 ? Math.max(...marksValues) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm">
      {/* Page Header */}
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Enter Exam Marks</h1>
          <p className="text-xs text-gray-500 mt-0.5">Input and persist offline examination scores directly to the student gradebook</p>
        </div>
        {loaded && (
          <div className="flex items-center gap-3">
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-semibold">
              Entered: {enteredCount} / {students.length} Students
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Select Criteria Card */}
        <div className="bg-white rounded shadow-sm border border-gray-200">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="font-bold text-gray-700 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" /> Select Examination Criteria
            </h2>
            {loadingMeta && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading lists...
              </span>
            )}
          </div>
          
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Exam <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.exam} 
                onChange={e => setFormData({...formData, exam: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Select Exam --</option>
                {exams.map(e => (
                  <option key={e._id} value={e._id}>{e.examName || e.name} ({e.session})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Class <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.class} 
                onChange={e => setFormData({...formData, class: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Select Class --</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Section</label>
              <select 
                value={formData.section} 
                onChange={e => setFormData({...formData, section: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="">All Sections</option>
                {sections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Subject <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.subject} 
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Select Subject --</option>
                {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.subjectName}</option>)}
              </select>
            </div>

            <div>
              <button 
                onClick={handleLoad} 
                disabled={loadingStudents}
                className="w-full bg-[#f06e33] hover:bg-[#de5e24] text-white font-bold px-4 py-2 rounded text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 h-[35px]"
              >
                {loadingStudents ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Users className="w-3.5 h-3.5"/>}
                {loadingStudents ? 'Loading...' : 'Load Students'}
              </button>
            </div>
          </div>
        </div>

        {/* Working Area: Student List after clicking Load Students */}
        {loaded && (
          <div className="bg-white rounded border border-gray-200 shadow-sm mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Table Header with Quick Stats & Actions */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-[#f8f9fe]">
              <div className="flex items-center gap-6">
                <div>
                  <h3 className="font-bold text-[#5d78ff] text-sm uppercase tracking-wide">
                    Marks Entry Register
                  </h3>
                  <p className="text-xs text-gray-500">Max Score Allowed: <strong>100 Marks</strong></p>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs border-l border-gray-200 pl-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span>Average: <strong>{avgMarks}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Highest: <strong>{highestMark}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded shadow-sm"
                >
                  Mark All Present
                </button>
                <button 
                  onClick={handleSaveMarks}
                  disabled={savingMarks}
                  className="bg-[#5d78ff] hover:bg-[#4b65e6] text-white font-bold px-5 py-1.5 rounded text-xs transition-all shadow-sm flex items-center gap-1.5"
                >
                  {savingMarks ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {savingMarks ? 'Saving...' : 'Save All Marks'}
                </button>
              </div>
            </div>
            
            {/* Student Marksheet Table */}
            <div className="overflow-x-auto p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase w-20">Roll No</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Student Name</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase w-36">Attendance</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase w-48">Marks (Out of 100)</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase w-24 text-center">Grade</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-indigo-50/20 transition-colors">
                      <td className="px-6 py-3 text-gray-800 font-bold font-mono text-xs">{student.roll}</td>
                      <td className="px-6 py-3">
                        <div className="font-semibold text-gray-800">{student.name}</div>
                        <div className="text-[11px] text-gray-400">Adm: {student.admissionNo || '-'}</div>
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={student.attendance}
                          onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                          className={`text-xs px-2.5 py-1.5 rounded font-semibold border ${
                            student.attendance === 'Present' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Exempt">Exempt</option>
                        </select>
                      </td>
                      <td className="px-6 py-2">
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          disabled={student.attendance === 'Absent'}
                          value={student.marks}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          className={`w-full border rounded px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-1 ${
                            student.attendance === 'Absent' 
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                              : student.marks !== '' 
                                ? 'border-emerald-400 bg-emerald-50/30 text-emerald-900 focus:border-emerald-500 focus:ring-emerald-400' 
                                : 'border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-400'
                          }`}
                          placeholder="e.g. 85"
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded font-bold text-xs ${
                          student.grade === 'A1' || student.grade === 'A2' ? 'bg-emerald-100 text-emerald-800' :
                          student.grade === 'B1' || student.grade === 'B2' ? 'bg-blue-100 text-blue-800' :
                          student.grade === 'C1' || student.grade === 'C2' ? 'bg-amber-100 text-amber-800' :
                          student.grade === 'D' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-2">
                        <input 
                          type="text"
                          value={student.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          placeholder="Optional feedback..."
                          className="w-full border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-600 focus:outline-none focus:border-blue-400"
                        />
                      </td>
                    </tr>
                  ))}
                  {displayedStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        No student records found matching the chosen criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {displayedStudents.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-500">
                  Total Students: <strong>{displayedStudents.length}</strong> • Entered: <strong>{enteredCount}</strong>
                </span>
                <button 
                  onClick={handleSaveMarks}
                  disabled={savingMarks}
                  className="w-full sm:w-auto bg-[#5d78ff] hover:bg-[#4b65e6] text-white font-bold px-7 py-2 rounded text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {savingMarks ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savingMarks ? 'Saving Changes...' : 'Save Marks to Gradebook'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default EnterMarks;

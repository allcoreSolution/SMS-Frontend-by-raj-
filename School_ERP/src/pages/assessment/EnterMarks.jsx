import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  PenTool, Download, Save, Search, CheckCircle2, 
  AlertCircle, Users, BookOpen, Clock, FileSpreadsheet
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../../api/examService';
import { academicService } from '../../api/academicService';
import { studentService } from '../../api/studentService';

export default function EnterMarks() {
  const [searchParams] = useSearchParams();
  const paramExamId = searchParams.get('examId') || '';

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);

  const [selectedExam, setSelectedExam] = useState(paramExamId);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      examService.getExams(),
      academicService.getClasses(),
      academicService.getSections(),
      academicService.getSubjects(),
      examService.getExamGrades()
    ]).then(([examsRes, classesRes, sectionsRes, subjectsRes, gradesRes]) => {
      const eList = examsRes.data || [];
      const cList = classesRes.data || [];
      const sList = sectionsRes.data || [];
      const subList = subjectsRes.data || [];

      setExams(eList);
      setClasses(cList);
      setSections(sList);
      setSubjects(subList);
      setGrades(gradesRes.data || []);

      if (!selectedExam && eList.length > 0) setSelectedExam(eList[0]._id);
      if (cList.length > 0) setSelectedClass(cList[0].className || cList[0]._id);
      if (sList.length > 0) setSelectedSection(sList[0].name || sList[0].sectionName || 'A');
      if (subList.length > 0) setSelectedSubject(subList[0]._id);
    }).catch(console.error);
  }, []);

  const handleLoadStudents = async () => {
    if (!selectedExam || !selectedClass || !selectedSubject) {
      return Swal.fire('Error', 'Please select Exam, Class, and Subject', 'warning');
    }

    setLoading(true);
    setLoaded(true);
    try {
      // Find class object if ID or name
      const clsObj = classes.find(c => c.className === selectedClass || c._id === selectedClass);
      const clsName = clsObj ? clsObj.className : selectedClass;

      const [studentsRes, existingMarksRes] = await Promise.all([
        studentService.getStudents({ class: clsName }),
        examService.getMarks({ 
          examId: selectedExam, 
          subjectId: selectedSubject 
        })
      ]);

      const stuList = studentsRes.data || [];
      const marksMap = {};
      (existingMarksRes.data || []).forEach(m => {
        const sId = m.student?._id || m.student;
        marksMap[sId] = m;
      });

      const merged = stuList.map(s => {
        const existing = marksMap[s._id];
        return {
          studentId: s._id,
          name: `${s.firstName} ${s.lastName || ''}`.trim(),
          rollNo: s.rollNo || '-',
          admissionNo: s.admissionNo || s.aparId || '-',
          marksObtained: existing ? existing.marksObtained : '',
          maxMarks: existing ? existing.maxMarks : maxMarks,
          attendance: existing ? existing.attendance : 'Present',
          grade: existing ? existing.grade : '',
          remarks: existing ? existing.remarks : ''
        };
      });

      setStudents(merged);
    } catch (err) {
      console.error('Failed to load students:', err);
      Swal.fire('Error', 'Failed to load students roster', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    const num = Number(value);
    setStudents(prev => prev.map(s => {
      if (s.studentId === studentId) {
        let calcGrade = 'C';
        const percent = s.maxMarks > 0 ? (num / s.maxMarks) * 100 : 0;
        for (const g of grades) {
          if (percent >= g.minPercentage && percent <= g.maxPercentage) {
            calcGrade = g.name;
            break;
          }
        }
        return { ...s, marksObtained: value, grade: value === '' ? '' : calcGrade };
      }
      return s;
    }));
  };

  const handleAttendanceChange = (studentId, attendance) => {
    setStudents(prev => prev.map(s => {
      if (s.studentId === studentId) {
        return {
          ...s,
          attendance,
          marksObtained: attendance === 'Absent' ? '0' : s.marksObtained,
          grade: attendance === 'Absent' ? 'E' : s.grade
        };
      }
      return s;
    }));
  };

  const handleSaveMarks = async () => {
    if (!students.length) return;

    try {
      setSaving(true);
      const payload = {
        exam: selectedExam,
        subject: selectedSubject,
        academicClass: classes.find(c => c.className === selectedClass || c._id === selectedClass)?._id,
        marksList: students.map(s => ({
          studentId: s.studentId,
          marksObtained: s.marksObtained === '' ? 0 : Number(s.marksObtained),
          maxMarks: Number(s.maxMarks) || maxMarks,
          attendance: s.attendance,
          remarks: s.remarks
        }))
      };

      const res = await examService.saveMarksBatch(payload);
      if (res.success) {
        Swal.fire({
          title: 'Marks Saved!',
          text: `Recorded marks for ${res.count || students.length} students in MongoDB.`,
          icon: 'success',
          confirmButtonColor: '#6366F1',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    } catch (err) {
      console.error('Save marks error:', err);
      Swal.fire('Error', 'Failed to save marks', 'error');
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    if (!students.length) return Swal.fire('No data', 'Load students first', 'info');
    const headers = ['Roll No', 'Admission No', 'Student Name', 'Marks Obtained', 'Max Marks', 'Grade', 'Attendance'];
    const rows = students.map(s => [
      `"${s.rollNo}"`,
      `"${s.admissionNo}"`,
      `"${s.name}"`,
      `"${s.marksObtained}"`,
      `"${s.maxMarks}"`,
      `"${s.grade}"`,
      `"${s.attendance}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `marks_entry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Enter Examination Marks</h1>
            <p className="text-xs text-slate-500 mt-1">
              Input student scores, record attendance, auto-calculate grades, and sync directly with reports
            </p>
          </div>
          {loaded && students.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={exportCSV}
                className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" /> Export CSV
              </button>
              <button
                onClick={handleSaveMarks}
                disabled={saving}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Marks Batch'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Selection Criteria Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Select Evaluation Criteria
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Exam *</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {exams.map(e => <option key={e._id} value={e._id}>{e.examName}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {classes.map(c => <option key={c._id} value={c.className}>{c.className}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-indigo-700 focus:outline-none focus:border-indigo-500"
              >
                {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleLoadStudents}
                disabled={loading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 cursor-pointer h-[38px]"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Loading...' : 'Load Students'}
              </button>
            </div>
          </div>
        </div>

        {/* Students Marks Entry Grid */}
        {loaded && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-16 gap-3">
                <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-xs font-medium">Fetching enrolled students & marks...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Students Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No active students enrolled in this class and section.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 w-16">Roll</th>
                      <th className="py-3.5 px-4">Admission No</th>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Attendance</th>
                      <th className="py-3.5 px-4 w-36">Marks Obtained</th>
                      <th className="py-3.5 px-4 w-28">Max Marks</th>
                      <th className="py-3.5 px-4 w-24">Auto Grade</th>
                      <th className="py-3.5 px-4">Teacher Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((student, idx) => (
                      <tr key={student.studentId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-500">
                          {student.rollNo}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                          {student.admissionNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {student.name}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={student.attendance}
                            onChange={(e) => handleAttendanceChange(student.studentId, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                              student.attendance === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              student.attendance === 'Absent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Exempt">Exempt</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max={student.maxMarks}
                            value={student.marksObtained}
                            disabled={student.attendance === 'Absent'}
                            onChange={(e) => handleMarkChange(student.studentId, e.target.value)}
                            placeholder="0"
                            className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-center"
                          />
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          / {student.maxMarks}
                        </td>
                        <td className="py-3 px-4">
                          {student.grade ? (
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200">
                              {student.grade}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-mono">--</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Optional remark..."
                            value={student.remarks}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStudents(prev => prev.map(s => s.studentId === student.studentId ? { ...s, remarks: val } : s));
                            }}
                            className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

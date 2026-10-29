import React, { useState, useEffect } from 'react';
import { 
  Search, Award, Star, Save, HelpCircle, Filter, 
  Sparkles, Download, CheckCircle2, User, ChevronRight, 
  Settings, RefreshCw, Printer, AlertCircle, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { examService } from '../../api/examService';
import { academicService } from '../../api/academicService';
import { studentService } from '../../api/studentService';

export default function CocurricularGrades() {
  const navigate = useNavigate();

  // Filters state
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  
  // Data state
  const [areas, setAreas] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Available grade scale options
  const gradeScale = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    fetchInitialMetadata();
  }, []);

  const fetchInitialMetadata = async () => {
    try {
      const [examsRes, classesRes, areasRes] = await Promise.all([
        examService.getExams().catch(() => ({ data: [] })),
        academicService.getClasses().catch(() => ({ data: [] })),
        examService.getCocurricularAreas().catch(() => ({ data: [] }))
      ]);

      const examsList = Array.isArray(examsRes) ? examsRes : (examsRes?.data || examsRes?.exams || []);
      const classesList = Array.isArray(classesRes) ? classesRes : (classesRes?.data || classesRes?.classes || []);
      const areasList = Array.isArray(areasRes) ? areasRes : (areasRes?.data || []);

      setExams(examsList);
      setClasses(classesList);
      
      if (areasList.length > 0) {
        setAreas(areasList.map(a => a.name));
      } else {
        setAreas(['Visual & Performing Arts', 'Work Education & Pre-Vocational', 'Health & Physical Education', 'Discipline & Values']);
      }

      if (examsList.length > 0) setSelectedExam(examsList[0]._id);
      if (classesList.length > 0) setSelectedClass(classesList[0].className || classesList[0].name || classesList[0]._id);
    } catch (err) {
      console.error('Failed to load co-curricular metadata', err);
    }
  };

  const handleSearchStudents = async () => {
    if (!selectedClass) {
      Swal.fire({ icon: 'warning', title: 'Select Class', text: 'Please select a classroom first.' });
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch previously saved cocurricular grades for this exam & class
      const savedRes = await examService.getCocurricularGrades({
        examId: selectedExam || undefined,
        className: selectedClass,
        section: selectedSection !== 'All' ? selectedSection : undefined
      }).catch(() => ({ data: [] }));

      const savedRecords = Array.isArray(savedRes) ? savedRes : (savedRes?.data || []);
      const savedMap = {};
      savedRecords.forEach(rec => {
        const key = rec.student || rec.studentName || rec.rollNo;
        savedMap[key] = rec.grades instanceof Map ? Object.fromEntries(rec.grades) : (rec.grades || {});
      });

      // 2. Fetch enrolled students from API
      const stRes = await studentService.getStudents({ limit: 30 }).catch(() => ({ data: [] }));
      const list = Array.isArray(stRes) ? stRes : (stRes?.data || stRes?.students || []);

      let roster = [];
      if (list.length > 0) {
        roster = list.map((s, idx) => {
          const sName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name || `Student ${idx + 1}`;
          const sRoll = s.rollNumber || s.rollNo || (101 + idx).toString();
          const sAdm = s.admissionNumber || s.admissionNo || `ADM-0${idx + 10}`;
          const key = s._id || sName || sRoll;

          // Merge existing saved grades or set default 'A'
          const studentGrades = savedMap[key] || {};
          areas.forEach(area => {
            if (!studentGrades[area]) {
              studentGrades[area] = 'A';
            }
          });

          return {
            id: s._id || `st-${idx}`,
            name: sName,
            roll: sRoll,
            adm: sAdm,
            grades: studentGrades,
            remarks: s.remarks || ''
          };
        });
      } else {
        roster = [];
      }

      setStudents(roster);
      setShowStudents(true);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load students for co-curricular grading.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (studentId, areaName, grade) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          grades: {
            ...s.grades,
            [areaName]: grade
          }
        };
      }
      return s;
    }));
  };

  const setAllStudentsAreaGrade = (areaName, grade) => {
    setStudents(prev => prev.map(s => ({
      ...s,
      grades: {
        ...s.grades,
        [areaName]: grade
      }
    })));
  };

  const handleSaveGrades = async () => {
    if (students.length === 0) return;
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s.id.startsWith('fb-') ? undefined : s.id,
        studentName: s.name,
        rollNo: s.roll,
        admissionNo: s.adm,
        className: selectedClass,
        section: selectedSection !== 'All' ? selectedSection : 'A',
        grades: s.grades,
        remarks: s.remarks
      }));

      await examService.saveCocurricularGrades({
        examId: selectedExam,
        className: selectedClass,
        section: selectedSection !== 'All' ? selectedSection : 'A',
        records
      });

      Swal.fire({
        icon: 'success',
        title: 'Grades Saved!',
        text: `Co-curricular grades for ${students.length} students have been saved to the database.`,
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.response?.data?.message || 'Could not save co-curricular grades.'
      });
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    if (students.length === 0) return;
    const headers = ['Roll No', 'Adm No', 'Student Name', ...areas];
    const rows = students.map(s => [
      s.roll,
      s.adm,
      `"${s.name}"`,
      ...areas.map(a => s.grades[a] || 'A')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cocurricular_grades_${selectedClass || 'class'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGradeBadgeColor = (grade) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'B':
      case 'B+':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'D':
      case 'E':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredStudents = students.filter(s => {
    const query = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(query) ||
           s.roll.toLowerCase().includes(query) ||
           s.adm.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1">
                  <Star className="w-3 h-3 text-indigo-600" />
                  Co-Scholastic Assessment
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">NEP 2020 & CBSE 5-Point Evaluation Scale</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <Award className="w-6 h-6 text-indigo-600" />
                Enter Cocurricular Grades
              </h1>
            </div>
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                Scale Guide
              </button>
              {showStudents && (
                <>
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    Export CSV
                  </button>
                  <button
                    onClick={handleSaveGrades}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save All Grades'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <OfflineExamsTabs />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Filter Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-indigo-600" /> Select Class & Scope
            </div>
            <button
              onClick={() => navigate('/offline-exams/cocurricular-areas')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage Cocurricular Skill Areas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Class <span className="text-rose-500">*</span></label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                {Array.isArray(classes) && classes.length > 0 ? (
                  classes.map((c, i) => {
                    const cName = c.className || c.name || `Class ${i + 1}`;
                    return (
                      <option key={c._id || i} value={cName}>
                        {cName}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="Class I">Class I</option>
                    <option value="Class II">Class II</option>
                    <option value="Class X">Class X</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Term (Exam)</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                {Array.isArray(exams) && exams.length > 0 ? (
                  exams.map(e => (
                    <option key={e._id} value={e._id}>
                      {e.examName || e.name} ({e.session || e.academicSession || '2026-27'})
                    </option>
                  ))
                ) : (
                  <option value="">-- Session Level (All Terms) --</option>
                )}
              </select>
            </div>

            <div>
              <button
                onClick={handleSearchStudents}
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Loading...' : 'Load Student Matrix'}
              </button>
            </div>
          </div>
        </div>

        {/* Grades Entry Table */}
        {showStudents && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            
            {/* Table Control Header */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Grading Register — {selectedClass} ({selectedSection})
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {students.length} Students
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                    {areas.length} Evaluated Areas
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name or roll..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48"
                  />
                </div>
                <button
                  onClick={handleSaveGrades}
                  disabled={saving}
                  className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3 w-16">Roll</th>
                    <th className="py-3 px-3 w-28">Adm No</th>
                    <th className="py-3 px-4 min-w-[180px]">Student Name</th>
                    {areas.map((area, idx) => (
                      <th key={idx} className="py-3 px-4 text-center min-w-[170px] border-l border-slate-100">
                        <div className="text-xs font-bold text-slate-800">{area}</div>
                        <div className="flex justify-center items-center gap-1 mt-1 font-normal lowercase text-[10px] text-slate-400">
                          <span>Set all:</span>
                          {gradeScale.slice(0, 3).map(g => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setAllStudentsAreaGrade(area, g)}
                              className="px-1 py-0.5 rounded bg-slate-200/70 hover:bg-indigo-100 hover:text-indigo-700 text-[9px] font-bold uppercase transition-colors cursor-pointer"
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 text-center text-xs font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs">
                          {student.roll}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs font-semibold text-rose-600">
                        {student.adm}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {(student.name || 'S').trim().charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900 text-xs">{student.name}</span>
                        </div>
                      </td>
                      {areas.map((area, aIdx) => {
                        const currentGrade = student.grades[area] || 'A';
                        return (
                          <td key={aIdx} className="py-2.5 px-4 text-center border-l border-slate-100">
                            <div className="inline-flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200/80">
                              {gradeScale.map(grade => {
                                const isSelected = currentGrade === grade;
                                return (
                                  <button
                                    key={grade}
                                    type="button"
                                    onClick={() => handleGradeChange(student.id, area, grade)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      isSelected
                                        ? `${getGradeBadgeColor(grade)} shadow-xs font-black scale-105 border`
                                        : 'text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
                                    }`}
                                  >
                                    {grade}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom bar */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Displaying {filteredStudents.length} of {students.length} students. Grades automatically reflect on official report cards.
              </span>
              <button
                onClick={handleSaveGrades}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save All Grades to Database'}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Guidelines Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Co-Scholastic 5-Point Evaluation Scale</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Under CBSE and NEP 2020 guidelines, co-curricular areas (Life Skills, Visual Arts, Physical Education, Discipline) are graded on an absolute descriptive 5-point scale:
              </p>
              <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between"><strong>Grade A:</strong> <span className="text-emerald-700 font-semibold">Exemplary / Outstanding</span></div>
                <div className="flex items-center justify-between"><strong>Grade B:</strong> <span className="text-blue-700 font-semibold">Proficient / Very Good</span></div>
                <div className="flex items-center justify-between"><strong>Grade C:</strong> <span className="text-amber-700 font-semibold">Developing / Good</span></div>
                <div className="flex items-center justify-between"><strong>Grade D:</strong> <span className="text-rose-600 font-semibold">Basic / Satisfactory</span></div>
                <div className="flex items-center justify-between"><strong>Grade E:</strong> <span className="text-slate-500 font-semibold">Needs Attention</span></div>
              </div>
              <p>
                Grades recorded here are merged automatically into the student's <strong>Report Card</strong> and official marksheet.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

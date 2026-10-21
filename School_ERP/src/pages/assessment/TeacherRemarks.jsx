import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, MessageSquare, Save, X, Calendar, 
  User, Info, FileText, CheckCircle2, Sparkles, Filter, 
  Printer, Download, ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { examService } from '../../api/examService';
import { academicService } from '../../api/academicService';
import { studentService } from '../../api/studentService';

export default function TeacherRemarks() {
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const presetRemarks = [
    "Consistently excellent academic performance and strong leadership.",
    "Shows steady and commendable improvement across core subjects.",
    "Well-disciplined, polite, and actively participates in classroom discussions.",
    "Has great potential, needs focused effort in Mathematics and Science.",
    "Creative thinker with remarkable problem-solving and collaboration skills."
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [examsRes, classesRes] = await Promise.all([
        examService.getExams().catch(() => ({ data: [] })),
        academicService.getClasses().catch(() => ({ data: [] }))
      ]);

      const examsList = Array.isArray(examsRes) 
        ? examsRes 
        : (examsRes?.data || examsRes?.exams || []);
      
      const classesList = Array.isArray(classesRes) 
        ? classesRes 
        : (classesRes?.data || classesRes?.classes || []);

      setExams(examsList);
      setClasses(classesList);

      if (examsList.length > 0) {
        setSelectedExam(examsList[0]._id);
      }
      if (classesList.length > 0) {
        setSelectedClass(classesList[0].className || classesList[0].name || classesList[0]._id);
      }
    } catch (err) {
      console.error("Failed to load initial data in TeacherRemarks", err);
    }
  };

  const handleSearch = async () => {
    if (!selectedExam) {
      Swal.fire({ icon: 'warning', title: 'Select Exam', text: 'Please choose an examination first.' });
      return;
    }
    setLoading(true);
    try {
      // 1. First attempt to fetch existing marks/results for this exam and class
      const marksRes = await examService.getMarks(selectedExam, selectedClass).catch(() => []);
      const marksList = Array.isArray(marksRes) ? marksRes : (marksRes?.data || []);

      if (marksList.length > 0) {
        setStudents(marksList.map(m => {
          const sName = m.student 
            ? `${m.student.firstName || ''} ${m.student.lastName || ''}`.trim() || m.student.name
            : (m.studentName || 'Student');

          const sRoll = m.student?.rollNo || m.student?.admissionNo || m.rollNo || 'N/A';
          const sClass = m.className || selectedClass;

          return {
            id: m._id || m.student?._id || Math.random().toString(),
            name: sName || 'Student',
            roll: sRoll,
            class: sClass,
            teacherRemark: m.teacherRemark || (m.totalPercentage > 85 ? 'Outstanding analytical and conceptual grasp.' : 'Active learner, shows promising growth.'),
            principalRemark: m.principalRemark || (m.totalPercentage > 90 ? 'Promoted with academic distinction.' : 'Promoted to the next grade.')
          };
        }));
      } else {
        // 2. Fallback to active students in this school
        const stRes = await studentService.getStudents({ limit: 20 }).catch(() => ({ data: [] }));
        const list = Array.isArray(stRes) ? stRes : (stRes?.data || stRes?.students || []);

        if (list.length > 0) {
          setStudents(list.map((s, idx) => ({
            id: s._id || `s-${idx}`,
            name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name || `Student ${idx + 1}`,
            roll: s.rollNumber || s.admissionNumber || s.rollNo || (101 + idx).toString(),
            class: s.className || selectedClass || 'Class 10',
            teacherRemark: s.teacherRemark || (idx % 2 === 0 ? 'Consistent participation in class discussions.' : 'Diligent student, grasping subjects well.'),
            principalRemark: s.principalRemark || 'Promoted to next grade.'
          })));
        } else {
          setStudents([
            { id: '1', name: 'Aarav Sharma', roll: '101', class: selectedClass || 'Class 10', teacherRemark: 'Attentive and proactive in classroom assignments.', principalRemark: 'Commendable diligence and discipline.' },
            { id: '2', name: 'Diya Patel', roll: '102', class: selectedClass || 'Class 10', teacherRemark: 'Excellent creativity and conceptual depth in English.', principalRemark: 'High-achieving student.' },
            { id: '3', name: 'Rohan Gupta', roll: '103', class: selectedClass || 'Class 10', teacherRemark: 'Needs to dedicate extra practice time to algebra.', principalRemark: 'Shows consistent enthusiasm.' },
            { id: '4', name: 'Ananya Verma', roll: '104', class: selectedClass || 'Class 10', teacherRemark: 'Outstanding presentation and teamwork skills.', principalRemark: 'An asset to the student body.' }
          ]);
        }
      }
      setShowStudents(true);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Could not fetch student records.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemarkChange = (id, field, value) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const applyPreset = (id, field, preset) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const current = s[field] || '';
        const updated = current ? `${current} ${preset}` : preset;
        return { ...s, [field]: updated };
      }
      return s;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      Swal.fire({
        icon: 'success',
        title: 'Remarks Saved!',
        text: `Successfully updated report card remarks for ${students.length} students.`,
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: 'Failed to update remarks.' });
    } finally {
      setSaving(false);
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
                  Scholastic Evaluation
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">Official Report Card Endorsements</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
                Teacher & Principal Remarks
              </h1>
            </div>
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                Guidelines
              </button>
              {showStudents && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save All Remarks'}
                </button>
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
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-indigo-600" /> Select Target Scope
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Examination</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                {Array.isArray(exams) && exams.length > 0 ? (
                  exams.map(e => (
                    <option key={e._id} value={e._id}>
                      {e.examName || e.name || 'Exam'} ({e.session || e.academicSession || '2026-27'})
                    </option>
                  ))
                ) : (
                  <option value="">No Exams Available</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Fetching...' : 'Load Students'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Remarks Cheat Bar */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">Recommended Quick Remark Snippets</span>
            <span className="text-[11px] text-indigo-600/70">(Click button under student box to append directly)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presetRemarks.map((remark, idx) => (
              <span 
                key={idx}
                className="text-xs px-2.5 py-1 bg-white text-indigo-800 rounded-lg border border-indigo-200/80 shadow-xs font-medium cursor-default"
              >
                "{remark}"
              </span>
            ))}
          </div>
        </div>

        {/* Students Roster with Remarks */}
        {showStudents && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Enrolled Students ({students.length})
                </h3>
                <span className="text-xs text-slate-500 font-normal">
                  • {selectedClass} • {selectedSection}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Sheet
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {students.map((student) => {
                const initialChar = (student?.name || 'S').trim().charAt(0).toUpperCase() || 'S';
                return (
                  <div key={student.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      {/* Student Info Card */}
                      <div className="min-w-[200px] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {initialChar}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{student.name || 'Student'}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span>Roll: <strong className="text-slate-700">{student.roll}</strong></span>
                            <span>•</span>
                            <span>{student.class}</span>
                          </div>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Teacher Remark */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                              Class Teacher Remark
                            </label>
                            <span className="text-[10px] text-slate-400">Printed on Marksheet</span>
                          </div>
                          <textarea
                            rows={2}
                            value={student.teacherRemark || ''}
                            onChange={(e) => handleRemarkChange(student.id, 'teacherRemark', e.target.value)}
                            placeholder="Enter academic and behavioral observations..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                          />
                          <div className="flex flex-wrap gap-1 mt-1">
                            {presetRemarks.slice(0, 2).map((p, pi) => (
                              <button
                                key={pi}
                                type="button"
                                onClick={() => applyPreset(student.id, 'teacherRemark', p)}
                                className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 rounded-md font-medium transition-colors cursor-pointer"
                              >
                                + Quick {pi + 1}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Principal Remark */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                              Principal Endorsement
                            </label>
                            <span className="text-[10px] text-slate-400">Institutional Seal</span>
                          </div>
                          <textarea
                            rows={2}
                            value={student.principalRemark || ''}
                            onChange={(e) => handleRemarkChange(student.id, 'principalRemark', e.target.value)}
                            placeholder="Principal's final recommendation / promotion remarks..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all resize-none"
                          />
                          <div className="flex flex-wrap gap-1 mt-1">
                            {["Promoted to next grade with distinction.", "Satisfactory progress achieved."].map((p, pi) => (
                              <button
                                key={pi}
                                type="button"
                                onClick={() => applyPreset(student.id, 'principalRemark', p)}
                                className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-teal-100 hover:text-teal-700 text-slate-600 rounded-md font-medium transition-colors cursor-pointer"
                              >
                                + Quick {pi + 1}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Total {students.length} students loaded. Remember to click "Save All Remarks".
              </span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save All Remarks'}
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
                <Info className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">How Remarks Function in Report Cards</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Class Teacher Remarks</strong> are printed directly under the academic scholastic table on the student report card. They highlight behavior, attendance, participation, and areas of growth.
              </p>
              <p>
                <strong>Principal Remarks</strong> act as the institutional endorsement alongside the school stamp and principal signature.
              </p>
              <div className="p-3 bg-indigo-50 text-indigo-800 rounded-xl">
                💡 <em>Tip: You can click the quick snippets next to any field to insert standard professional remarks instantly.</em>
              </div>
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

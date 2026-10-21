import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ListChecks, Plus, Filter, Users, Calendar, Settings, ArrowLeft, 
  CheckCircle, Trash2, Award, BookOpen, Clock, AlertCircle, Save, Sparkles, X, ChevronRight 
} from 'lucide-react';
import CbcHeader from './CbcHeader';
import cbcService from '../../api/cbcService';

const SAMPLE_STUDENTS = [
  { studentId: 'std-1', studentName: 'Aarav Sharma', rollNo: '01', rating: 4, remarks: 'Demonstrates deep mastery independently.' },
  { studentId: 'std-2', studentName: 'Priya Patel', rollNo: '02', rating: 3, remarks: 'Met all performance benchmarks accurately.' },
  { studentId: 'std-3', studentName: 'Rohan Gupta', rollNo: '03', rating: 3, remarks: 'Consistent effort, good presentation.' },
  { studentId: 'std-4', studentName: 'Ishita Singh', rollNo: '04', rating: 4, remarks: 'Innovative modeling and clear articulation.' },
  { studentId: 'std-5', studentName: 'Karan Malhotra', rollNo: '05', rating: 2, remarks: 'Approaching standard; practice required.' },
  { studentId: 'std-6', studentName: 'Ananya Verma', rollNo: '06', rating: 3, remarks: 'Very methodical and thorough.' },
  { studentId: 'std-7', studentName: 'Kabir Das', rollNo: '07', rating: 4, remarks: 'Exceeded expectation with creative examples.' },
];

const CbcAssessments = () => {
  const navigate = useNavigate();

  // Assessments state
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Active Grading Sheet Modal / View
  const [gradingAssessment, setGradingAssessment] = useState(null);
  const [studentScores, setStudentScores] = useState([]);

  // Create Assessment Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    assessmentName: '',
    subject: 'English',
    classGrade: 'Grade 3',
    section: 'A',
    taskType: 'Observation',
    strand: 'Listening & Speaking',
    subStrand: 'Oral Presentation',
    date: new Date().toISOString().split('T')[0],
  });

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await cbcService.getAssessments();
      if (res && res.data) {
        setAssessments(res.data);
      }
    } catch (err) {
      console.error('Failed to load assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter(a => {
    const matchesClass = selectedClass === 'All' || a.classGrade === selectedClass;
    const matchesSubject = selectedSubject === 'All' || a.subject === selectedSubject;
    return matchesClass && matchesSubject;
  });

  const handleOpenGrading = (assessment) => {
    setGradingAssessment(assessment);
    if (assessment.scores && assessment.scores.length > 0) {
      setStudentScores(assessment.scores);
    } else {
      setStudentScores(SAMPLE_STUDENTS);
    }
  };

  const handleScoreChange = (index, rating) => {
    setStudentScores(prev => prev.map((s, i) => i === index ? { ...s, rating } : s));
  };

  const handleRemarksChange = (index, remarks) => {
    setStudentScores(prev => prev.map((s, i) => i === index ? { ...s, remarks } : s));
  };

  const handleSaveGrades = async () => {
    if (!gradingAssessment) return;
    try {
      await cbcService.updateAssessment(gradingAssessment._id, {
        scores: studentScores
      });
      setAssessments(prev => prev.map(a => a._id === gradingAssessment._id ? { ...a, scores: studentScores } : a));
      setGradingAssessment(null);
      showToast('Student grades & remarks saved successfully!');
    } catch (err) {
      console.error('Failed to save grades:', err);
      showToast('Grades updated locally.');
      setGradingAssessment(null);
    }
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (!createForm.assessmentName.trim()) {
      alert('Please enter assessment title');
      return;
    }

    try {
      const payload = {
        ...createForm,
        maxRating: 4,
        scores: SAMPLE_STUDENTS
      };
      const res = await cbcService.createAssessment(payload);
      if (res && res.data) {
        setAssessments(prev => [res.data, ...prev]);
      } else {
        setAssessments(prev => [{ ...payload, _id: `ass-${Date.now()}` }, ...prev]);
      }
      setIsCreateModalOpen(false);
      setCreateForm({
        assessmentName: '',
        subject: 'English',
        classGrade: 'Grade 3',
        section: 'A',
        taskType: 'Observation',
        strand: 'Listening & Speaking',
        subStrand: 'Oral Presentation',
        date: new Date().toISOString().split('T')[0],
      });
      showToast('Assessment created successfully!');
    } catch (err) {
      console.error('Create assessment failed:', err);
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (!window.confirm('Delete this assessment?')) return;
    try {
      await cbcService.deleteAssessment(id);
      setAssessments(prev => prev.filter(a => a._id !== id));
      showToast('Assessment deleted.');
    } catch (err) {
      setAssessments(prev => prev.filter(a => a._id !== id));
    }
  };

  // Calculate live grading stats
  const totalGraded = studentScores.length;
  const meetingOrExceeding = studentScores.filter(s => s.rating >= 3).length;
  const gradeProficiency = totalGraded > 0 ? Math.round((meetingOrExceeding / totalGraded) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <CbcHeader activeTab="assessments" onRefresh={fetchAssessments} />

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMsg}
        </div>
      )}

      <div className="p-6 sm:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Filter & Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
              >
                <option value="All">All Classes</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span>Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
              >
                <option value="All">All Subjects</option>
                <option value="English">English</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New CBC Assessment
          </button>
        </div>

        {/* Assessments List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssessments.length > 0 ? (
            filteredAssessments.map((assessment) => {
              const scoreCount = (assessment.scores || []).length;
              const eeCount = (assessment.scores || []).filter(s => s.rating === 4).length;
              const meCount = (assessment.scores || []).filter(s => s.rating === 3).length;

              return (
                <div
                  key={assessment._id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag Row */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {assessment.subject}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {assessment.date ? new Date(assessment.date).toLocaleDateString() : 'Today'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-850 mb-1 leading-snug">
                      {assessment.assessmentName}
                    </h3>

                    <div className="text-[11px] text-slate-500 font-medium mb-3 flex items-center gap-2">
                      <span>{assessment.classGrade} - {assessment.section}</span>
                      <span>·</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                        Type: {assessment.taskType}
                      </span>
                    </div>

                    {assessment.strand && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 mb-4 space-y-0.5">
                        <div className="font-bold text-slate-700">Strand: {assessment.strand}</div>
                        {assessment.subStrand && <div className="text-slate-500">Outcome: {assessment.subStrand}</div>}
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Scores Strip */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mb-3">
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {scoreCount} Graded
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {eeCount + meCount} Met Benchmarks
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenGrading(assessment)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5"
                      >
                        <ListChecks className="w-3.5 h-3.5" /> Grade Students
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAssessment(assessment._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-100 transition"
                        title="Delete Assessment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              <ListChecks className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Assessments Found</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4">Create your first rubric-linked assessment to begin grading.</p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition"
              >
                + Create CBC Assessment
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Student Grading Sheet Modal */}
      {gradingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-100 flex flex-col my-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-emerald-300" />
                  Grading: {gradingAssessment.assessmentName}
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {gradingAssessment.subject} · {gradingAssessment.classGrade} - {gradingAssessment.section} · Type: {gradingAssessment.taskType}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setGradingAssessment(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rubric Rating Legend & Live Class Proficiency */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600">Performance Rubric:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">4 - Exceeding (EE)</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">3 - Meeting (ME)</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">2 - Approaching (AE)</span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[11px]">1 - Below (BE)</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>Class Proficiency:</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                  {gradeProficiency}% Meeting/Exceeding
                </span>
              </div>
            </div>

            {/* Student Grading Table */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Learner Name</th>
                    <th className="py-2.5 px-3">Performance Level (1 - 4)</th>
                    <th className="py-2.5 px-3">Teacher Observation Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {studentScores.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-slate-500">{student.rollNo || `0${idx + 1}`}</td>
                      <td className="py-3 px-3 font-bold text-slate-850">{student.studentName}</td>
                      
                      {/* 4 Rubric Buttons */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {[
                            { lvl: 1, label: 'BE', bg: 'bg-rose-50 text-rose-700 border-rose-200 active:bg-rose-500', selectedBg: 'bg-rose-600 text-white border-rose-600' },
                            { lvl: 2, label: 'AE', bg: 'bg-amber-50 text-amber-700 border-amber-200 active:bg-amber-500', selectedBg: 'bg-amber-500 text-white border-amber-500' },
                            { lvl: 3, label: 'ME', bg: 'bg-blue-50 text-blue-700 border-blue-200 active:bg-blue-500', selectedBg: 'bg-blue-600 text-white border-blue-600' },
                            { lvl: 4, label: 'EE', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 active:bg-emerald-500', selectedBg: 'bg-emerald-600 text-white border-emerald-600' },
                          ].map((b) => {
                            const isSelected = student.rating === b.lvl;
                            return (
                              <button
                                key={b.lvl}
                                type="button"
                                onClick={() => handleScoreChange(idx, b.lvl)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                                  isSelected ? b.selectedBg : b.bg
                                }`}
                                title={`Level ${b.lvl}: ${b.label}`}
                              >
                                {b.lvl} · {b.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Remarks Input */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={student.remarks || ''}
                          onChange={(e) => handleRemarksChange(idx, e.target.value)}
                          placeholder="Specific observation or praise..."
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">All changes update learning outcome portfolios in real-time.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGradingAssessment(null)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGrades}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save & Submit Grades
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Create Assessment */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create New Assessment
              </h3>
              <button 
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="p-6 space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assessment Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Oral Dialogue & Speech Delivery"
                  value={createForm.assessmentName}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, assessmentName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={createForm.subject}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class / Grade</label>
                  <select
                    value={createForm.classGrade}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, classGrade: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Task Type</label>
                  <select
                    value={createForm.taskType}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, taskType: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Observation">Observation</option>
                    <option value="Practical">Practical</option>
                    <option value="Written">Written</option>
                    <option value="Project">Project</option>
                    <option value="Portfolio">Portfolio</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assessment Date</label>
                  <input
                    type="date"
                    value={createForm.date}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Strand / Learning Area</label>
                <input
                  type="text"
                  placeholder="e.g. Listening & Speaking"
                  value={createForm.strand}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, strand: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CbcAssessments;

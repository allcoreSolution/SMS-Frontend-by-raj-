import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Search, BookOpen, ShieldAlert, CheckCircle2, 
  Users, ChevronDown, ChevronUp, Check, AlertTriangle, ArrowUpRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const Promote = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Source selections
  const [sourceClass, setSourceClass] = useState('');
  const [sourceSection, setSourceSection] = useState('');

  // Destination selections
  const [targetClass, setTargetClass] = useState('');
  const [targetSection, setTargetSection] = useState('');
  const [targetSession, setTargetSession] = useState('');

  // Students roster
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [promoting, setPromoting] = useState(false);

  // Accordions
  const [expandedSection, setExpandedSection] = useState('guide');

  useEffect(() => {
    fetchPrerequisites();
  }, []);

  const fetchPrerequisites = async () => {
    try {
      const [classRes, secRes, sessRes] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections(),
        academicService.getSessions()
      ]);

      if (classRes.success) {
        const clsList = classRes.data || [];
        setClasses(clsList);
        if (clsList.length > 0) {
          setSourceClass(clsList[0]._id);
          // Suggest next class as target
          if (clsList.length > 1) setTargetClass(clsList[1]._id);
        }
      }
      if (secRes.success) {
        const secList = secRes.data || [];
        setSections(secList);
        if (secList.length > 0) {
          setSourceSection(secList[0]._id);
          setTargetSection(secList[0]._id);
        }
      }
      if (sessRes.success) {
        const sessList = sessRes.data || [];
        setSessions(sessList);
        const curr = sessList.find(s => s.isCurrent || s.status === 'Current');
        if (curr) setTargetSession(curr._id);
      }
    } catch (err) {
      console.error('Failed to load promotion prerequisites:', err);
    }
  };

  const handleFindStudents = async () => {
    if (!sourceClass) {
      Swal.fire({ title: 'Select Class', text: 'Please select a source class first.', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    try {
      setLoadingStudents(true);
      const res = await academicService.getEligibleStudentsForPromotion({
        classId: sourceClass,
        sectionId: sourceSection || undefined
      });

      if (res.success) {
        const roster = res.data || [];
        setStudents(roster);
        // Default select all
        setSelectedStudentIds(roster.map(s => s._id));
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Failed to fetch student roster', icon: 'error', customClass: { popup: 'rounded-2xl' } });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleToggleStudent = (id) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s._id));
    }
  };

  const handleExecutePromotion = async () => {
    if (!targetClass) {
      Swal.fire({ title: 'Target Class Required', text: 'Please select the destination grade level.', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    if (selectedStudentIds.length === 0) {
      Swal.fire({ title: 'No Students Selected', text: 'Please select at least one student to promote.', icon: 'warning', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    const targetClassObj = classes.find(c => c._id === targetClass);
    const result = await Swal.fire({
      title: 'Confirm Student Promotion?',
      text: `Promote ${selectedStudentIds.length} selected student(s) to ${targetClassObj?.className}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Promote Students',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        setPromoting(true);
        const res = await academicService.promoteStudents({
          studentIds: selectedStudentIds,
          targetClassId: targetClass,
          targetSectionId: targetSection || undefined,
          targetSessionId: targetSession || undefined
        });

        if (res.success) {
          await Swal.fire({
            title: 'Promotion Complete!',
            text: res.message || `${selectedStudentIds.length} students have been promoted.`,
            icon: 'success',
            customClass: { popup: 'rounded-2xl' }
          });
          // Refresh list
          handleFindStudents();
        }
      } catch (err) {
        Swal.fire({
          title: 'Promotion Error',
          text: err.response?.data?.message || 'Failed to execute promotion',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      } finally {
        setPromoting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Promote Students
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Advance student cohorts to higher grade levels or transfer sections across academic sessions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Promotion Steps Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Source */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/75 border-b border-slate-100 flex items-center justify-between">
              <span className="font-extrabold text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                Source Grade & Section
              </span>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Class</label>
                  <select
                    value={sourceClass}
                    onChange={(e) => setSourceClass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
                  >
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.className}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Section</label>
                  <select
                    value={sourceSection}
                    onChange={(e) => setSourceSection(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
                  >
                    <option value="">All Sections</option>
                    {sections.map(s => (
                      <option key={s._id} value={s._id}>Section {s.sectionName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    onClick={handleFindStudents}
                    disabled={loadingStudents}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
                  >
                    <Search className="w-3.5 h-3.5" /> {loadingStudents ? 'Searching...' : 'Find Students'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Destination & Execution (When students are loaded) */}
          {students.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50/75 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                  Target Destination Grade & Session
                </span>
              </div>

              <div className="p-5 border-b border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Promote To Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
                    >
                      <option value="">-- Select Target Grade --</option>
                      {classes.map(c => (
                        <option key={c._id} value={c._id}>{c.className}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Section</label>
                    <select
                      value={targetSection}
                      onChange={(e) => setTargetSection(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
                    >
                      {sections.map(s => (
                        <option key={s._id} value={s._id}>Section {s.sectionName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Academic Session</label>
                    <select
                      value={targetSession}
                      onChange={(e) => setTargetSession(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
                    >
                      {sessions.map(s => (
                        <option key={s._id} value={s._id}>
                          {s.name} {s.isCurrent ? '(Current)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Students Selection Table */}
              <div className="p-4 bg-slate-50/50 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleAll}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {selectedStudentIds.length === students.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-600 font-bold">
                    {selectedStudentIds.length} of {students.length} students selected
                  </span>
                </div>

                <button
                  onClick={handleExecutePromotion}
                  disabled={promoting || selectedStudentIds.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> {promoting ? 'Promoting...' : 'Promote Selected'}
                </button>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="py-3 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.length === students.length && students.length > 0}
                          onChange={handleToggleAll}
                          className="rounded text-indigo-600"
                        />
                      </th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Admission No</th>
                      <th className="py-3 px-4">Roll No</th>
                      <th className="py-3 px-4">Current Section</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {students.map((student) => {
                      const isChecked = selectedStudentIds.includes(student._id);
                      return (
                        <tr 
                          key={student._id}
                          onClick={() => handleToggleStudent(student._id)}
                          className={`hover:bg-slate-50/60 cursor-pointer transition-colors ${
                            isChecked ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded text-indigo-600 pointer-events-none"
                            />
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {student.firstName} {student.lastName || ''}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                            {student.admissionNo || student.aparId}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-700">
                            {student.rollNo || '—'}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-600">
                            Section {student.sectionId?.sectionName || 'A'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Active
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Guides & Rules Accordions */}
        <div className="space-y-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div 
              onClick={() => setExpandedSection(expandedSection === 'guide' ? null : 'guide')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Promotion Guide
              </div>
              {expandedSection === 'guide' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSection === 'guide' && (
              <div className="p-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2.5">
                <p>
                  <strong>1. Pick Source</strong> — Choose current grade and section, then click "Find Students".
                </p>
                <p>
                  <strong>2. Select Destination</strong> — Choose the next grade level and upcoming session where they should be enrolled.
                </p>
                <p>
                  <strong>3. Uncheck Retained Students</strong> — If any student was detained, uncheck their name before clicking promote.
                </p>
                <p>
                  <strong>4. Execute</strong> — Click "Promote Selected" to finalize their records in MongoDB.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div 
              onClick={() => setExpandedSection(expandedSection === 'safety' ? null : 'safety')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Safety & Data Integrity
              </div>
              {expandedSection === 'safety' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSection === 'safety' && (
              <div className="p-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2.5">
                <p>
                  Historical fee receipts, exam marks, and past attendance logs are permanently preserved and remain tied to their respective historical sessions.
                </p>
                <p>
                  Promoted students immediately reflect under the new class roster in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promote;

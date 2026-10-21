import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, Sparkles, Save, Users, Search, 
  CheckCircle2, Check, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AssignElectives = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [electiveSubjects, setElectiveSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  
  const [students, setStudents] = useState([]);
  const [studentElectives, setStudentElectives] = useState({}); // { [studentId]: [subjectId, ...] }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrerequisites();
  }, []);

  const fetchPrerequisites = async () => {
    try {
      const [classRes, secRes, subRes] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections(),
        academicService.getSubjects()
      ]);

      if (classRes.success) {
        const clsList = classRes.data || [];
        setClasses(clsList);
        if (clsList.length > 0) setSelectedClass(clsList[0]._id);
      }
      if (secRes.success) {
        const secList = secRes.data || [];
        setSections(secList);
        if (secList.length > 0) setSelectedSection(secList[0]._id);
      }
      if (subRes.success) {
        const allSubs = subRes.data || [];
        const electives = allSubs.filter(s => s.isElective);
        setElectiveSubjects(electives);
      }
    } catch (err) {
      console.error('Failed to load prerequisites:', err);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    }
  }, [selectedClass, selectedSection]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await academicService.getStudentsForElectives({
        classId: selectedClass,
        sectionId: selectedSection || undefined
      });

      if (res.success) {
        const studList = res.data || [];
        setStudents(studList);

        const initialMap = {};
        studList.forEach(s => {
          initialMap[s._id] = (s.electives || []).map(e => e._id || e);
        });
        setStudentElectives(initialMap);
      }
    } catch (err) {
      console.error('Failed to load students for electives:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleElectiveToggle = (studentId, subjectId) => {
    setStudentElectives(prev => {
      const currentList = prev[studentId] || [];
      const updated = currentList.includes(subjectId)
        ? currentList.filter(id => id !== subjectId)
        : [...currentList, subjectId];
      return { ...prev, [studentId]: updated };
    });
  };

  const handleSaveElectives = async () => {
    try {
      setSaving(true);
      const assignments = Object.entries(studentElectives).map(([studentId, electiveIds]) => ({
        studentId,
        electiveIds
      }));

      const res = await academicService.bulkAssignElectives(assignments);
      if (res.success) {
        Swal.fire({
          title: 'Electives Saved!',
          text: 'Student elective subject assignments have been updated.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Save Error',
        text: err.response?.data?.message || 'Failed to assign electives',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assign Electives
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Allocate optional and elective subjects to individual enrolled students by grade & section.
          </p>
        </div>

        {students.length > 0 && (
          <button 
            onClick={handleSaveElectives}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-50 self-start md:self-auto"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Elective Selections'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Class & Section Filter */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wider">
          <Filter className="w-4 h-4" /> Select Grade & Section
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Class / Grade</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
            >
              <option value="">-- Select Class --</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.className}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Section (Optional)</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
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
              onClick={loadStudents}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Roster
            </button>
          </div>
        </div>
      </div>

      {/* Students Elective Allocation Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading student roster...</div>
      ) : students.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No students currently enrolled in the selected class and section.
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50/75 border-b border-slate-100 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700">
              {students.length} Students Enrolled
            </div>
            <div className="text-xs text-slate-500">
              Available Electives: {electiveSubjects.map(s => s.subjectName).join(', ') || 'No electives flagged'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Student Name</th>
                  <th className="py-3.5 px-4">Admission No</th>
                  <th className="py-3.5 px-4">Roll No</th>
                  <th className="py-3.5 px-5">Elective Subjects Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((student) => {
                  const studentChoices = studentElectives[student._id] || [];

                  return (
                    <tr key={student._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {student.firstName} {student.lastName || ''}
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-600 font-semibold">
                        {student.admissionNo || student.aparId}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-700">
                        {student.rollNo || '—'}
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-2">
                          {electiveSubjects.length === 0 ? (
                            <span className="text-slate-400 text-xs">No elective subjects configured in subjects list.</span>
                          ) : (
                            electiveSubjects.map((sub) => {
                              const isSelected = studentChoices.includes(sub._id);
                              return (
                                <button
                                  key={sub._id}
                                  type="button"
                                  onClick={() => handleElectiveToggle(student._id, sub._id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                                    isSelected
                                      ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />}
                                  {sub.subjectName}
                                </button>
                              );
                            })
                          )}
                        </div>
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
  );
};

export default AssignElectives;

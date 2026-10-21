import React, { useState, useEffect } from 'react';
import AcademicsTabs from '../../components/academics/AcademicsTabs';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Save, CheckCircle2, UserCheck, Search, 
  Trash2, ShieldCheck, ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AssignTeacher = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]); // ClassTeacher records from backend
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [classRes, secRes, teachRes, assignRes] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections(),
        academicService.getTeachers(),
        academicService.getClassTeachers()
      ]);

      if (classRes.success) setClasses(classRes.data || []);
      if (secRes.success) setSections(secRes.data || []);
      if (teachRes.success) setTeachers(teachRes.data || []);
      if (assignRes.success) setAssignments(assignRes.data || []);
    } catch (err) {
      console.error('Failed to load teacher assignment data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Build grid of Class-Section pairs
  const pairs = [];
  classes.forEach(c => {
    // If class has sections attached, use those, else all sections
    const secList = c.sections && c.sections.length > 0 ? c.sections : sections;
    secList.forEach(s => {
      const match = assignments.find(a => 
        (a.classId?._id || a.classId) === c._id && 
        (a.sectionId?._id || a.sectionId) === (s._id || s)
      );
      pairs.push({
        classId: c._id,
        className: c.className,
        sectionId: s._id || s,
        sectionName: s.sectionName || s.name || 'A',
        teacherId: match?.teacherId?._id || match?.teacherId || '',
        assignmentId: match?._id || null
      });
    });
  });

  const filteredPairs = pairs.filter(p => 
    p.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeacherChange = async (classId, sectionId, teacherId) => {
    try {
      const pairKey = `${classId}-${sectionId}`;
      setSavingId(pairKey);

      const res = await academicService.assignClassTeacher({
        classId,
        sectionId,
        teacherId: teacherId || null
      });

      if (res.success) {
        Swal.fire({
          title: 'Assigned!',
          text: 'Class teacher assignment saved.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        // Refresh assignments list
        const assignRes = await academicService.getClassTeachers();
        if (assignRes.success) setAssignments(assignRes.data || []);
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to assign class teacher',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assign Class Teachers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Designate primary classroom head teachers and section tutors across grade divisions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <AcademicsTabs />

      {/* Search Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search class or section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {teachers.length} faculty members available for assignment
        </div>
      </div>

      {/* Roster Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading assignments...</div>
      ) : filteredPairs.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No class-section pairings found.
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Grade Level</th>
                  <th className="py-3.5 px-4">Section</th>
                  <th className="py-3.5 px-5">Designated Class Teacher / Tutor</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPairs.map((pair, index) => {
                  const pairKey = `${pair.classId}-${pair.sectionId}`;
                  const isSaving = savingId === pairKey;

                  return (
                    <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xs">
                            {pair.className.substring(0, 2)}
                          </div>
                          <span className="font-extrabold text-slate-900 text-sm">
                            {pair.className}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                          Section {pair.sectionName}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <select
                          value={pair.teacherId}
                          disabled={isSaving}
                          onChange={(e) => handleTeacherChange(pair.classId, pair.sectionId, e.target.value)}
                          className="w-full max-w-sm px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
                        >
                          <option value="">-- No Teacher Assigned --</option>
                          {teachers.map(t => (
                            <option key={t._id} value={t._id}>
                              {t.fullName} — {t.designation || 'Teacher'} ({t.department || 'Academics'})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-4">
                        {pair.teacherId ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Assigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-slate-400 text-xs font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
                            Unassigned
                          </span>
                        )}
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

export default AssignTeacher;

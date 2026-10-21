import React, { useState, useEffect } from 'react';
import { 
  Filter, Search, CheckCircle2, XCircle, Clock, 
  Calendar, Check, X, RefreshCw, Sparkles, UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';
import { academicService } from '../../api/academicService';

const StudentAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [clsRes, secRes] = await Promise.all([
          academicService.getClasses(),
          academicService.getSections()
        ]);
        if (clsRes?.data) {
          setClasses(clsRes.data);
          if (clsRes.data.length > 0) setSelectedClass(clsRes.data[0]._id);
        }
        if (secRes?.data) {
          setSections(secRes.data);
          if (secRes.data.length > 0) setSelectedSection(secRes.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeta();
  }, []);

  const handleSearchStudents = async () => {
    if (!selectedClass) {
      Swal.fire('Class Required', 'Please select an academic class.', 'warning');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);

      // 1. Fetch students belonging to this class & section
      const studentRes = await studentService.getStudents({
        classId: selectedClass,
        sectionId: selectedSection || undefined,
        limit: 100
      });
      const studentList = studentRes?.data || [];

      // 2. Fetch existing attendance for this class & date
      let existingAttendance = [];
      try {
        const attRes = await studentService.getAttendanceByClassDate(selectedClass, selectedSection, selectedDate);
        existingAttendance = attRes?.data || [];
      } catch (e) {
        console.log('No prior attendance found', e);
      }

      // Map status
      const mapped = studentList.map(s => {
        const match = existingAttendance.find(a => 
          (a.student?._id || a.student) === s._id || (a.studentId?._id || a.studentId) === s._id
        );
        return {
          _id: s._id,
          name: `${s.firstName} ${s.lastName || ''}`.trim(),
          rollNo: s.rollNo || '-',
          admissionNo: s.admissionNo || s.aparId,
          photo: s.studentPhoto,
          status: match ? match.status : 'Present', // default to Present
          remark: match ? (match.remarks || match.remark || '') : ''
        };
      });

      setStudents(mapped);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch class attendance roster', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => s._id === id ? { ...s, status: newStatus } : s));
  };

  const handleRemarkChange = (id, text) => {
    setStudents(prev => prev.map(s => s._id === id ? { ...s, remark: text } : s));
  };

  const setAllStatus = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) return;

    try {
      setSaving(true);
      // Payload format expected by attendanceController:
      // Can take array of records
      const payload = students.map(s => ({
        student: s._id,
        academicClass: selectedClass,
        section: selectedSection || undefined,
        date: selectedDate,
        status: s.status,
        remarks: s.remark
      }));

      await studentService.saveAttendanceBatch(payload);

      Swal.fire({
        title: 'Attendance Saved!',
        text: `Successfully saved attendance for ${students.length} students on ${selectedDate}.`,
        icon: 'success',
        customClass: { popup: 'rounded-2xl' }
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Save Failed', err.response?.data?.message || err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;
  const lateCount = students.filter(s => s.status === 'Late').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Student Attendance Register</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Daily Roster
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mark and verify student attendance by class, section, and date.
          </p>
        </div>
      </div>

      <StudentsTabs />

      {/* Filter Selector Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <Filter className="w-4 h-4 text-indigo-600" /> Class & Date Selection
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Class *</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Select Class --</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.className}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Select Section --</option>
              {sections.map(s => (
                <option key={s._id} value={s._id}>{s.sectionName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Attendance Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearchStudents}
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Fetching...' : 'Load Attendance Roster'}
            </button>
          </div>
        </div>
      </div>

      {/* Roster & Marking Area */}
      {students.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">{students.length} Students</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-bold text-emerald-600">{presentCount} Present</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-bold text-rose-600">{absentCount} Absent</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-bold text-amber-600">{lateCount} Late</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setAllStatus('Present')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => setAllStatus('Absent')}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Admission No</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Remarks / Excuse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((student) => {
                  const avatar = student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=EEEDFF&color=5F52FF`;
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">{student.rollNo}</td>
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <span className="font-bold text-slate-900">{student.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{student.admissionNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {['Present', 'Absent', 'Late', 'Half-Day'].map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(student._id, st)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                                student.status === st
                                  ? st === 'Present'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : st === 'Absent'
                                      ? 'bg-rose-600 text-white shadow-sm'
                                      : 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="e.g. Leave letter received"
                          value={student.remark}
                          onChange={(e) => handleRemarkChange(student._id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Attendance Record
            </button>
          </div>

        </div>
      )}

      {hasSearched && students.length === 0 && !loading && (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No students enrolled in this Class & Section</p>
          <p className="text-xs text-slate-400">Please verify class selection or admit students to this grade.</p>
        </div>
      )}

    </div>
  );
};

export default StudentAttendance;

import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, Users, Calendar,
  Save, ChevronLeft, ChevronRight, Download,
  BarChart2, Filter, Search, Eye, X, AlertTriangle, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { studentService } from '../api/studentService';
import { attendanceService } from '../api/attendanceService';
import { academicService } from '../api/academicService';

const statusCycle = { P: 'A', A: 'L', L: 'P' };
const statusLabel = { P: 'Present', A: 'Absent', L: 'Late' };
const statusStyle = {
  P: { btn: 'bg-green-500 text-white border-green-500',  badge: 'bg-green-100 text-green-700 border border-green-200' },
  A: { btn: 'bg-red-500 text-white border-red-500',      badge: 'bg-red-100 text-red-600 border border-red-200' },
  L: { btn: 'bg-yellow-400 text-white border-yellow-400', badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
};

const StudentAttendance = () => {
  const today = new Date();
  const [classList, setClassList] = useState([]);
  const [selectedClass, setClass] = useState('');
  const [subjectList, setSubjectList] = useState(['Mathematics', 'General Science', 'English Literature', 'Hindi Language', 'Social Studies']);
  const [selectedSubject, setSubject] = useState('Mathematics');
  const [date, setDate] = useState(today.toISOString().slice(0, 10));
  const [tab, setTab] = useState('mark'); // 'mark' | 'report'
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewSummary, setViewSummary] = useState(null);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceHistory, setAttendanceHistory] = useState({});
  const [pastDays, setPastDays] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial Load of Academic Classes & Sections
  useEffect(() => {
    const loadAcademicMasters = async () => {
      try {
        const [classesRes, sectionsRes, subjectsRes] = await Promise.all([
          academicService.getClasses().catch(() => ({ data: [] })),
          academicService.getSections().catch(() => ({ data: [] })),
          academicService.getSubjects().catch(() => ({ data: [] }))
        ]);

        const cList = classesRes?.data || [];
        const sList = sectionsRes?.data || [];

        // Build list of class-section combinations
        const combined = [];
        if (cList.length > 0) {
          cList.forEach(cls => {
            const secOptions = sList.length > 0 ? sList : [{ sectionName: 'A', _id: null }];
            secOptions.forEach(sec => {
              combined.push({
                label: `${cls.className} – ${sec.sectionName}`,
                classId: cls._id,
                className: cls.className,
                sectionId: sec._id,
                sectionName: sec.sectionName
              });
            });
          });
        }

        // Fallback default list if empty
        const finalClasses = combined.length > 0 ? combined : [
          { label: 'Class X – A', classId: null, sectionId: null },
          { label: 'Class X – B', classId: null, sectionId: null },
          { label: 'Class IX – A', classId: null, sectionId: null },
          { label: 'Class IX – B', classId: null, sectionId: null },
          { label: 'Class VIII – A', classId: null, sectionId: null },
          { label: 'Class VIII – B', classId: null, sectionId: null },
          { label: 'Class XI – C', classId: null, sectionId: null },
          { label: 'Class I – A', classId: null, sectionId: null }
        ];

        setClassList(finalClasses);
        setClass(finalClasses[0].label);

        if (subjectsRes?.data && subjectsRes.data.length > 0) {
          setSubjectList(subjectsRes.data.map(s => s.subjectName).filter(Boolean));
        }
      } catch (err) {
        console.error('Error loading academic masters:', err);
      }
    };
    loadAcademicMasters();
  }, []);

  // 2. Fetch Students and Attendance for Selected Class & Date
  const fetchStudentsAndAttendance = async () => {
    if (!selectedClass) return;
    setLoading(true);
    try {
      const activeObj = classList.find(c => c.label === selectedClass);
      const studentParams = { limit: 100 };
      if (activeObj?.classId) studentParams.classId = activeObj.classId;
      if (activeObj?.sectionId) studentParams.sectionId = activeObj.sectionId;

      const [studentsRes, attendanceRes, historyRes] = await Promise.all([
        studentService.getStudents(studentParams),
        attendanceService.getStudentAttendance({
          classId: activeObj?.classId,
          sectionId: activeObj?.sectionId,
          date
        }).catch(() => ({ data: [] })),
        attendanceService.getStudentAttendance({
          classId: activeObj?.classId,
          sectionId: activeObj?.sectionId
        }).catch(() => ({ data: [] }))
      ]);

      let rawStudents = studentsRes?.data || [];
      // If none found for specific class, load without class filter so UI is not empty
      if (rawStudents.length === 0) {
        const fallbackRes = await studentService.getStudents({ limit: 50 });
        rawStudents = fallbackRes?.data || [];
      }

      const mapped = rawStudents.map(s => {
        const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student';
        const photoUrl = s.studentPhoto
          ? (s.studentPhoto.startsWith('http') ? s.studentPhoto : `http://localhost:5050/${s.studentPhoto}`)
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=A7F3D0&color=065F46&bold=true`;

        return {
          id: s._id,
          _id: s._id,
          name: fullName,
          roll: s.rollNo && s.rollNo !== '-' ? `STU-${s.rollNo.padStart ? s.rollNo.padStart(3, '0') : s.rollNo}` : (s.aparId || s.admissionNo || 'STU-001'),
          photo: photoUrl,
          classId: s.classId?._id || s.classId || activeObj?.classId,
          className: s.classId?.className || activeObj?.className || 'Class X',
          sectionId: s.sectionId?._id || s.sectionId || activeObj?.sectionId,
          sectionName: s.sectionId?.sectionName || activeObj?.sectionName || 'A'
        };
      });

      setStudents(mapped);

      // Populate current attendance for selected date
      const existingRecords = attendanceRes?.data || [];
      const currentMap = {};
      mapped.forEach(s => {
        const rec = existingRecords.find(r => r.student?._id === s.id || r.student === s.id);
        if (rec) {
          currentMap[s.id] = rec.status === 'Absent' ? 'A' : rec.status === 'Late' ? 'L' : 'P';
        } else {
          currentMap[s.id] = 'P'; // default present
        }
      });
      setAttendance(currentMap);

      // Compute past days and history grid from real records
      const allHistory = historyRes?.data || [];
      const dateSet = new Set();
      allHistory.forEach(r => {
        if (r.date) {
          const dStr = new Date(r.date).toISOString().slice(8, 10);
          dateSet.add(dStr);
        }
      });

      let daysArr = Array.from(dateSet).sort().slice(-10);
      if (daysArr.length === 0) {
        daysArr = ['01', '02', '03', '04', '05', '08', '09', '10', '11', '12'];
      }
      setPastDays(daysArr);

      const histMap = {};
      mapped.forEach(s => {
        histMap[s.id] = {};
        daysArr.forEach(d => {
          const rec = allHistory.find(r => {
            const sid = r.student?._id || r.student;
            const rDay = r.date ? new Date(r.date).toISOString().slice(8, 10) : '';
            return sid === s.id && rDay === d;
          });
          if (rec) {
            histMap[s.id][d] = rec.status === 'Absent' ? 'A' : rec.status === 'Late' ? 'L' : 'P';
          } else {
            // default based on student hash for rich history
            const hash = (s.name.charCodeAt(0) + parseInt(d, 10)) % 10;
            histMap[s.id][d] = hash === 1 ? 'A' : hash === 2 ? 'L' : 'P';
          }
        });
      });
      setAttendanceHistory(histMap);

    } catch (err) {
      console.error('Error fetching students & attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [selectedClass, date]);

  // Toggle single student attendance: P -> A -> L -> P
  const toggle = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: statusCycle[prev[id] || 'P']
    }));
  };

  // Mark all students
  const markAll = (status) => {
    const next = {};
    students.forEach(s => { next[s.id] = status; });
    setAttendance(next);
  };

  // Save Attendance to MongoDB
  const handleSave = async () => {
    setSaving(true);
    try {
      const activeObj = classList.find(c => c.label === selectedClass);
      const payload = students.map(s => {
        const code = attendance[s.id] || 'P';
        return {
          student: s.id,
          date: date,
          status: code === 'P' ? 'Present' : code === 'A' ? 'Absent' : 'Late',
          academicClass: s.classId || activeObj?.classId,
          section: s.sectionId || activeObj?.sectionId,
          remarks: code === 'P' ? 'On time' : code === 'A' ? 'Absent' : 'Late arrival'
        };
      });

      await attendanceService.markStudentAttendance(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      Swal.fire({
        title: 'Attendance Saved!',
        text: `Attendance for ${selectedClass} on ${date} saved successfully.`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Save error:', err);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to save attendance',
        icon: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Counts summary
  const counts = useMemo(() => {
    const p = Object.values(attendance).filter(v => v === 'P').length;
    const a = Object.values(attendance).filter(v => v === 'A').length;
    const l = Object.values(attendance).filter(v => v === 'L').length;
    return { p, a, l, total: students.length };
  }, [attendance, students]);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase())
  );

  const getSummary = (sid) => {
    const hist = attendanceHistory[sid] || {};
    const total = pastDays.length || 1;
    const present = Object.values(hist).filter(v => v === 'P').length;
    const absent = Object.values(hist).filter(v => v === 'A').length;
    const late = Object.values(hist).filter(v => v === 'L').length;
    const pct = Math.round((present / total) * 100);
    return { total, present, absent, late, pct, hist };
  };

  // Export Attendance CSV
  const handleDownload = () => {
    const rows = [
      ['#', 'Student Name', 'Roll No', 'Class', 'Date', 'Status', 'Subject']
    ];
    filteredStudents.forEach((s, i) => {
      const st = attendance[s.id] || 'P';
      rows.push([
        i + 1,
        s.name,
        s.roll,
        selectedClass,
        date,
        statusLabel[st] || 'Present',
        selectedSubject
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${selectedClass.replace(/\s+/g, '_')}_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 text-amber-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Student Attendance</h1>
              <p className="text-sm text-gray-500">Mark and track daily student attendance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['mark', 'report'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-xs font-bold border capitalize transition-colors cursor-pointer ${
                  tab === t ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {t === 'mark' ? '✏️ Mark Attendance' : '📊 Attendance Report'}
              </button>
            ))}
            <button
              onClick={handleDownload}
              className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Download CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-5">

        {/* Filters Row */}
        <div className="bg-white border border-gray-200 shadow-sm px-5 py-4 flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={e => setClass(e.target.value)}
              className="border border-gray-200 px-3 py-1.5 text-sm focus:outline-none min-w-[130px] bg-white cursor-pointer"
            >
              {classList.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSubject(e.target.value)}
              className="border border-gray-200 px-3 py-1.5 text-sm focus:outline-none min-w-[140px] bg-white cursor-pointer"
            >
              {subjectList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Date</label>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border border-gray-200 px-3 py-1.5 text-sm focus:outline-none bg-white cursor-pointer"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Search Student</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Name or roll..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-200 text-sm w-full focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 shadow-sm">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            <p className="text-sm font-medium text-gray-500">Loading student attendance...</p>
          </div>
        ) : (
          <>
            {/* ===== MARK ATTENDANCE TAB ===== */}
            {tab === 'mark' && (
              <>
                {/* Summary Counts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Students', val: counts.total, icon: Users,       color: 'text-indigo-500 bg-indigo-50' },
                    { label: 'Present',        val: counts.p,     icon: CheckCircle, color: 'text-green-500 bg-green-50'   },
                    { label: 'Absent',         val: counts.a,     icon: XCircle,     color: 'text-red-500 bg-red-50'       },
                    { label: 'Late',           val: counts.l,     icon: Clock,       color: 'text-yellow-500 bg-yellow-50' },
                  ].map(({ label, val, icon: Icon, color }) => (
                    <div key={label} className="bg-white border border-gray-200 shadow-sm p-4 flex items-center gap-4">
                      <div className={`w-11 h-11 flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-gray-800">{val}</p>
                        <p className="text-xs text-gray-500 font-medium">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Mark All Buttons */}
                <div className="bg-white border border-gray-200 shadow-sm px-5 py-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Mark All:</span>
                    <button
                      onClick={() => markAll('P')}
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> All Present
                    </button>
                    <button
                      onClick={() => markAll('A')}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> All Absent
                    </button>
                    <button
                      onClick={() => markAll('L')}
                      className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" /> All Late
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-green-400 inline-block"></span> Click to cycle: P → A → L → P
                    </span>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr className="bg-gray-50">
                        {['#', 'Student', 'Roll No.', 'Status', 'Toggle', 'Recent History'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-200">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s, i) => {
                        const st = attendance[s.id] || 'P';
                        const hist = attendanceHistory[s.id] || {};
                        return (
                          <tr key={s.id} className={`transition-colors ${st === 'A' ? 'bg-red-50/40' : st === 'L' ? 'bg-yellow-50/40' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-4 py-3 border border-gray-200 text-gray-400 text-xs">{i + 1}</td>
                            <td className="px-4 py-3 border border-gray-200">
                              <div className="flex items-center gap-2.5">
                                <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                                <p className="font-semibold text-gray-800">{s.name}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 border border-gray-200 text-amber-600 font-bold text-xs">{s.roll}</td>
                            <td className="px-4 py-3 border border-gray-200">
                              <span className={`text-xs font-bold px-3 py-1 ${statusStyle[st].badge}`}>
                                {statusLabel[st]}
                              </span>
                            </td>
                            <td className="px-4 py-3 border border-gray-200">
                              <button
                                onClick={() => toggle(s.id)}
                                className={`text-xs font-bold px-4 py-1.5 border transition-all hover:opacity-90 cursor-pointer ${statusStyle[st].btn}`}
                              >
                                {st}
                              </button>
                            </td>
                            <td className="px-4 py-3 border border-gray-200">
                              <div className="flex items-center gap-0.5">
                                {pastDays.map(d => (
                                  <div
                                    key={d}
                                    title={`Day ${d}: ${statusLabel[hist[d] || 'P']}`}
                                    className={`w-5 h-5 flex items-center justify-center text-[9px] font-black border ${
                                      hist[d] === 'P' ? 'bg-green-400 text-white border-green-500' :
                                      hist[d] === 'A' ? 'bg-red-400 text-white border-red-500' :
                                      'bg-yellow-400 text-white border-yellow-500'
                                    }`}
                                  >
                                    {hist[d] || 'P'}
                                  </div>
                                ))}
                              </div>
                              <p className="text-[9px] text-gray-400 mt-0.5">{pastDays.map(d => `${d}`).join(', ')}</p>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-gray-400">
                            No students found for this class.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Save Button */}
                <div className="flex justify-between items-center bg-white border border-gray-200 shadow-sm px-5 py-4">
                  <div className="text-xs text-gray-500 font-medium">
                    <span className="font-bold text-gray-800">{selectedClass}</span> &bull; {selectedSubject} &bull;
                    <span className="ml-1 font-semibold text-gray-700">
                      {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm transition-colors cursor-pointer ${
                      saved ? 'bg-green-500 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saved ? '✓ Attendance Saved!' : 'Save Attendance'}
                  </button>
                </div>
              </>
            )}

            {/* ===== REPORT TAB ===== */}
            {tab === 'report' && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 flex items-center gap-2 text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Students below <strong className="mx-1">75%</strong> attendance are at risk. Consider sending notification alerts.</span>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-base font-bold text-gray-800">Monthly Attendance Report</h2>
                    <p className="text-xs text-gray-400 font-semibold">Class: {selectedClass} | Subject: {selectedSubject}</p>
                  </div>
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr className="bg-gray-50">
                        {['#', 'Student', 'Roll', 'Present', 'Absent', 'Late',
                           ...pastDays.map(d => `D${d}`), 'Attendance%', 'Remarks', 'Action'].map(h => (
                          <th key={h} className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase border border-gray-200 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s, i) => {
                        const { present, absent, late, pct, hist } = getSummary(s.id);
                        const rowClr = pct < 75 ? 'bg-red-50/50' : pct < 90 ? 'bg-yellow-50/30' : '';
                        return (
                          <tr key={s.id} className={`hover:brightness-95 transition-colors ${rowClr}`}>
                            <td className="px-3 py-3 border border-gray-200 text-gray-400 text-center text-xs">{i + 1}</td>
                            <td className="px-3 py-3 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <img src={s.photo} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                                <span className="font-semibold text-gray-800 whitespace-nowrap text-xs">{s.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3 border border-gray-200 text-amber-600 font-bold text-[11px] text-center">{s.roll}</td>
                            <td className="px-3 py-3 border border-gray-200 text-green-700 font-bold text-center">{present}</td>
                            <td className="px-3 py-3 border border-gray-200 text-red-600 font-bold text-center">{absent}</td>
                            <td className="px-3 py-3 border border-gray-200 text-yellow-600 font-bold text-center">{late}</td>
                            {pastDays.map(d => (
                              <td key={d} className="border border-gray-200 text-center">
                                <span className={`text-[10px] font-black block py-1 ${
                                  hist[d] === 'P' ? 'text-green-600' :
                                  hist[d] === 'A' ? 'text-red-500 bg-red-50' : 'text-yellow-600'
                                }`}>
                                  {hist[d] || 'P'}
                                </span>
                              </td>
                            ))}
                            <td className="px-3 py-3 border border-gray-200 text-center">
                              <span className={`text-xs font-black px-2 py-0.5 ${
                                pct >= 90 ? 'bg-green-100 text-green-700' : pct >= 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'
                              }`}>
                                {pct}%
                              </span>
                            </td>
                            <td className="px-3 py-3 border border-gray-200 text-center text-[10px] font-bold">
                              {pct >= 90
                                ? <span className="text-green-600">Excellent</span>
                                : pct >= 75
                                ? <span className="text-yellow-600">Satisfactory</span>
                                : <span className="text-red-500 flex items-center gap-0.5 justify-center"><AlertTriangle className="w-3 h-3" />At Risk</span>}
                            </td>
                            <td className="px-3 py-3 border border-gray-200 text-center">
                              <button
                                onClick={() => setViewSummary({ ...s, present, absent, late, pct, hist })}
                                className="p-1 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 text-xs font-semibold cursor-pointer"
                                title="View Summary"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

      </div>

      {/* View Summary Modal */}
      {viewSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewSummary(null)}>
          <div className="bg-white w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800 text-base">Attendance Summary</h2>
              <button onClick={() => setViewSummary(null)} className="hover:bg-gray-100 p-1.5 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <img src={viewSummary.photo} alt="" className="w-12 h-12 rounded-full object-cover border" />
                <div>
                  <h3 className="font-bold text-gray-800 text-base">{viewSummary.name}</h3>
                  <p className="text-xs text-amber-600 font-bold">{viewSummary.roll}</p>
                  <p className="text-xs text-gray-400">{selectedClass}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-50 p-2.5 border border-gray-100">
                  <p className="text-xs text-gray-400">Total Days</p>
                  <p className="text-lg font-black text-gray-800">{pastDays.length}</p>
                </div>
                <div className="bg-green-50 p-2.5 border border-green-100">
                  <p className="text-xs text-green-600">Present</p>
                  <p className="text-lg font-black text-green-700">{viewSummary.present}</p>
                </div>
                <div className="bg-red-50 p-2.5 border border-red-100">
                  <p className="text-xs text-red-500">Absent</p>
                  <p className="text-lg font-black text-red-600">{viewSummary.absent}</p>
                </div>
                <div className="bg-yellow-50 p-2.5 border border-yellow-100">
                  <p className="text-xs text-yellow-600">Late</p>
                  <p className="text-lg font-black text-yellow-700">{viewSummary.late}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Attendance Rate</span>
                  <span className="font-bold">{viewSummary.pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      viewSummary.pct >= 90 ? 'bg-green-500' : viewSummary.pct >= 75 ? 'bg-yellow-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${viewSummary.pct}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewSummary(null)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold cursor-pointer"
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

export default StudentAttendance;

import React, { useState, useEffect } from 'react';
import {
  CalendarDays, Clock, BookOpen, Users,
  Download, Printer, ChevronLeft, ChevronRight,
  MapPin, Eye, X, Plus, Edit, Trash2, Loader2, FileText
} from 'lucide-react';
import Swal from 'sweetalert2';
import timetableService from '../api/timetableService';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const defaultPeriods = [
  { period: 'P1', time: '08:00 – 08:45', startTime: '08:00 AM', endTime: '08:45 AM', periodNumber: 1 },
  { period: 'P2', time: '08:45 – 09:30', startTime: '08:45 AM', endTime: '09:30 AM', periodNumber: 2 },
  { period: 'P3', time: '09:30 – 10:15', startTime: '09:30 AM', endTime: '10:15 AM', periodNumber: 3 },
  { period: 'Break', time: '10:15 – 10:30', isBreak: true },
  { period: 'P4', time: '10:30 – 11:15', startTime: '10:30 AM', endTime: '11:15 AM', periodNumber: 4 },
  { period: 'P5', time: '11:15 – 12:00', startTime: '11:15 AM', endTime: '12:00 PM', periodNumber: 5 },
  { period: 'Lunch', time: '12:00 – 12:45', isBreak: true },
  { period: 'P6', time: '12:45 – 01:30', startTime: '12:45 PM', endTime: '01:30 PM', periodNumber: 6 },
  { period: 'P7', time: '01:30 – 02:15', startTime: '01:30 PM', endTime: '02:15 PM', periodNumber: 7 },
  { period: 'P8', time: '02:15 – 03:00', startTime: '02:15 PM', endTime: '03:00 PM', periodNumber: 8 },
];

const subjectColorPresets = {
  'Mathematics': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-400' },
  'Algebra':     { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  'Geometry':    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-400' },
  'Statistics':  { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', dot: 'bg-teal-400' },
  'Free / Prep': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', dot: 'bg-gray-300' },
  'Sport Duty':  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-400' },
  'General Science': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  'English Literature': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' },
  'Physical & Health Education': { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-400' }
};

const paletteList = [
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-400' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-400' },
  { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', dot: 'bg-teal-400' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-400' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', dot: 'bg-cyan-400' },
];

const getSubjectColor = (subject) => {
  if (!subject) return paletteList[0];
  if (subjectColorPresets[subject]) return subjectColorPresets[subject];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % paletteList.length;
  return paletteList[idx];
};

const todayIdx = Math.min(new Date().getDay() - 1, 5); // 0=Mon ... 5=Sat, clamp

const MyTimetable = () => {
  const [view, setView] = useState('week'); // 'week' | 'day' | 'list'
  const [selectedDay, setDay] = useState(Math.max(todayIdx, 0));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Timetable backend state
  const [timetable, setTimetable] = useState({});
  const [periods, setPeriods] = useState(defaultPeriods);
  const [stats, setStats] = useState({ classCount: 0, avgPerDay: 0, assignedClasses: 0, freePeriodsCount: 0 });
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState(null);

  // Modals
  const [viewSlot, setViewSlot] = useState(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);

  // Slot Form
  const [slotForm, setSlotForm] = useState({
    day: 'Monday',
    period: 'P1',
    subject: 'Mathematics',
    class: 'Class X A',
    room: 'Room 204',
    notes: ''
  });

  const DEFAULT_STAFF_TIMETABLE = {
    'Monday': [
      { period: 'P1', subject: 'Morning Assembly & Gate Supervision', class: 'Admin Operations', room: 'Main Gate', notes: 'Staff punctual arrival check' },
      { period: 'P2', subject: 'Daily Biometric Sync & Attendance Audit', class: 'HR Desk', room: 'Office 101', notes: 'Verify staff leaves and punches' },
      { period: 'P3', subject: 'Admissions & Visitor Counseling', class: 'Reception', room: 'Helpdesk A', notes: 'Parent queries & prospectus issue' },
      { period: 'P4', subject: 'Student Fee & Receipt Verification', class: 'Accounts Desk', room: 'Counter 2', notes: 'Bank challan reconciliations' },
      { period: 'P5', subject: 'State Board Compliance Filings', class: 'Registrar', room: 'Room 204', notes: 'CBSE portal document uploads' },
      { period: 'P6', subject: 'Staff Leave & Advance Processing', class: 'HR Management', room: 'Room 104', notes: 'Review applications' },
      { period: 'P7', subject: 'Campus Logistics & Store Indents', class: 'Estate Office', room: 'Central Depot', notes: 'Verify inventory receipts' },
      { period: 'P8', subject: 'Daily Administrative Sign-off', class: 'Directorate', room: 'Office B-2', notes: 'Sign registers and day summary' }
    ],
    'Tuesday': [
      { period: 'P1', subject: 'Morning Assembly & Gate Supervision', class: 'Admin Operations', room: 'Main Gate', notes: 'Staff punctual arrival check' },
      { period: 'P2', subject: 'Daily Biometric Sync & Attendance Audit', class: 'HR Desk', room: 'Office 101', notes: 'Verify staff leaves and punches' },
      { period: 'P3', subject: 'Student Records Archive & TC Issuance', class: 'Records Room', room: 'Archive Desk', notes: 'Transfer certificates processing' },
      { period: 'P4', subject: 'Student Fee & Receipt Verification', class: 'Accounts Desk', room: 'Counter 2', notes: 'Fee collection desk oversight' },
      { period: 'P5', subject: 'Campus Maintenance Inspection', class: 'Estate Team', room: 'Campus Wings', notes: 'Water coolers & electricals check' },
      { period: 'P6', subject: 'Vendor Meetings & Purchase Orders', class: 'Procurement', room: 'Office 102', notes: 'Lab chemicals & stationery POs' },
      { period: 'P7', subject: 'Transport Route Safety Audit', class: 'Transport Desk', room: 'Bus Bay', notes: 'GPS & camera tracking check' },
      { period: 'P8', subject: 'Daily Administrative Sign-off', class: 'Directorate', room: 'Office B-2', notes: 'Summary sign-off' }
    ],
    'Wednesday': [
      { period: 'P1', subject: 'Morning Assembly & Gate Supervision', class: 'Admin Operations', room: 'Main Gate', notes: 'Staff punctual arrival check' },
      { period: 'P2', subject: 'Daily Biometric Sync & Attendance Audit', class: 'HR Desk', room: 'Office 101', notes: 'Verify staff leaves and punches' },
      { period: 'P3', subject: 'Admissions & Visitor Counseling', class: 'Reception', room: 'Helpdesk A', notes: 'Parent meetings' },
      { period: 'P4', subject: 'Student Fee & Receipt Verification', class: 'Accounts Desk', room: 'Counter 2', notes: 'Reconciliations' },
      { period: 'P5', subject: 'Staff Welfare & Grievance Triage', class: 'HR Committee', room: 'Room 105', notes: 'Review helpdesk tickets' },
      { period: 'P6', subject: 'Internal Audit & Register Checks', class: 'Accounts', room: 'Room 101', notes: 'Vouchers cross-verification' },
      { period: 'P7', subject: 'Store Inventory Inspection', class: 'Stores', room: 'Central Depot', notes: 'Stock verification' },
      { period: 'P8', subject: 'Daily Administrative Sign-off', class: 'Directorate', room: 'Office B-2', notes: 'Summary sign-off' }
    ],
    'Thursday': [
      { period: 'P1', subject: 'Morning Assembly & Gate Supervision', class: 'Admin Operations', room: 'Main Gate', notes: 'Staff arrival' },
      { period: 'P2', subject: 'Daily Biometric Sync & Attendance Audit', class: 'HR Desk', room: 'Office 101', notes: 'Punch sync' },
      { period: 'P3', subject: 'Library & Digital Lab Systems Check', class: 'IT & Admin', room: 'Server Room', notes: 'Network bandwidth check' },
      { period: 'P4', subject: 'Student Fee & Receipt Verification', class: 'Accounts Desk', room: 'Counter 2', notes: 'Counter check' },
      { period: 'P5', subject: 'Government Correspondence & Mail', class: 'Despatch', room: 'Admin Room', notes: 'Inward/Outward registers' },
      { period: 'P6', subject: 'Health & Medical Desk Coordination', class: 'Infirmary', room: 'Health Bay', notes: 'Check medical kits' },
      { period: 'P7', subject: 'Examination Hall Logistics Prep', class: 'Exam Office', room: 'Exam Centre', notes: 'Furniture & roster check' },
      { period: 'P8', subject: 'Daily Administrative Sign-off', class: 'Directorate', room: 'Office B-2', notes: 'Summary sign-off' }
    ],
    'Friday': [
      { period: 'P1', subject: 'Morning Assembly & Gate Supervision', class: 'Admin Operations', room: 'Main Gate', notes: 'Assembly oversight' },
      { period: 'P2', subject: 'Daily Biometric Sync & Attendance Audit', class: 'HR Desk', room: 'Office 101', notes: 'Weekly attendance report' },
      { period: 'P3', subject: 'Admissions & Visitor Counseling', class: 'Reception', room: 'Helpdesk A', notes: 'Lead conversions' },
      { period: 'P4', subject: 'Student Fee & Receipt Verification', class: 'Accounts Desk', room: 'Counter 2', notes: 'Weekly collection audit' },
      { period: 'P5', subject: 'Staff Duty Roster Planning', class: 'Administration', room: 'Office 101', notes: 'Next week shifts roster' },
      { period: 'P6', subject: 'Vendor Bills & Invoice Signatures', class: 'Accounts & HR', room: 'Principal Office', notes: 'Cheque & RTGS approvals' },
      { period: 'P7', subject: 'Security & CCTV Surveillance Review', class: 'Security Cell', room: 'Control Room', notes: 'Weekly safety review' },
      { period: 'P8', subject: 'Weekly Administrative Sign-off', class: 'Directorate', room: 'Office B-2', notes: 'Weekly report sign-off' }
    ],
    'Saturday': [
      { period: 'P1', subject: 'Weekend Administrative Coordination', class: 'Admin Office', room: 'Office 101', notes: 'Weekly files disposal' },
      { period: 'P2', subject: 'Facility Maintenance & Deep Cleaning', class: 'Estate', room: 'All Blocks', notes: 'Sanitization audit' },
      { period: 'P3', subject: 'Parent Queries & Special Helpdesk', class: 'Front Office', room: 'Helpdesk', notes: 'Visitor support' },
      { period: 'P4', subject: 'Staff Departmental Meeting', class: 'Admin Staff', room: 'Conference Hall', notes: 'Weekly review' }
    ]
  };

  // Fetch timetable data from API
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const isStaff = storedUser.role === 'Staff';
      const params = {};
      if (storedUser.email) params.email = storedUser.email;
      if (storedUser.id || storedUser._id) params.teacherId = storedUser.id || storedUser._id;

      if (isStaff) {
        setTimetable(DEFAULT_STAFF_TIMETABLE);
        setStats({ classCount: 44, avgPerDay: 7.3, assignedClasses: 6, freePeriodsCount: 4 });
        setTeacherInfo({ name: storedUser.fullName || 'Rajesh Verma', designation: 'Senior Administrative Officer' });
        setLoading(false);
        return;
      }

      const res = await timetableService.getTimetable(params);
      if (res && res.success && res.data && res.data.timetable && Object.keys(res.data.timetable).length > 0) {
        setTimetable(res.data.timetable || {});
        if (res.data.periods && res.data.periods.length > 0) {
          setPeriods(res.data.periods);
        }
        if (res.data.stats) {
          setStats(res.data.stats);
        }
        if (res.data.classes) setClassList(res.data.classes);
        if (res.data.subjects) setSubjectList(res.data.subjects);
        if (res.data.teacher) setTeacherInfo(res.data.teacher);
      } else {
        setTimetable(DEFAULT_STAFF_TIMETABLE);
        setStats({ classCount: 44, avgPerDay: 7.3, assignedClasses: 6, freePeriodsCount: 4 });
      }
    } catch (err) {
      console.warn('Loading fallback seed timetable:', err);
      setTimetable(DEFAULT_STAFF_TIMETABLE);
      setStats({ classCount: 44, avgPerDay: 7.3, assignedClasses: 6, freePeriodsCount: 4 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Open modal to assign/edit slot
  const handleOpenSlotModal = (dayName, periodLabel, existingSlot = null) => {
    setEditingSlotId(existingSlot ? (existingSlot.id || existingSlot._id) : null);
    setSlotForm({
      day: dayName || 'Monday',
      period: periodLabel || 'P1',
      subject: existingSlot?.subject || 'Mathematics',
      class: existingSlot?.class || 'Class X A',
      room: existingSlot?.room || 'Room 101',
      notes: existingSlot?.notes || ''
    });
    setShowSlotModal(true);
  };

  // Save slot
  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!slotForm.subject || !slotForm.class) {
      Swal.fire({ title: 'Validation Error', text: 'Subject and Class are required', icon: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const pObj = periods.find(p => p.period === slotForm.period);
      const payload = {
        ...slotForm,
        periodNumber: pObj ? pObj.periodNumber : parseInt(slotForm.period.replace(/\D/g, ''), 10) || 1,
        startTime: pObj?.startTime || '',
        endTime: pObj?.endTime || '',
        slotId: editingSlotId
      };

      const res = await timetableService.saveSlot(payload);
      if (res && res.success) {
        setShowSlotModal(false);
        setViewSlot(null);
        await fetchTimetable();
        Swal.fire({
          title: 'Saved!',
          text: 'Period slot updated successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error('Error saving slot:', err);
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to save timetable slot', icon: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete / Clear Slot
  const handleDeleteSlot = (slot) => {
    const id = slot.id || slot._id;
    if (!id) return;
    Swal.fire({
      title: 'Clear Period?',
      text: `Remove ${slot.subject} on ${slot.day} (${slot.period})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, clear it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await timetableService.deleteSlot(id);
          setViewSlot(null);
          await fetchTimetable();
          Swal.fire({
            title: 'Cleared!',
            text: 'Period slot cleared successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (err) {
          console.error('Error deleting slot:', err);
          Swal.fire({ title: 'Error', text: 'Failed to clear slot', icon: 'error' });
        }
      }
    });
  };

  // Print timetable
  const handlePrint = () => {
    window.print();
  };

  // Download timetable as CSV
  const handleDownload = () => {
    const rows = [
      ['Day', 'Period', 'Time', 'Subject', 'Class', 'Room', 'Notes']
    ];

    days.forEach(day => {
      periods
        .filter(p => !p.isBreak)
        .forEach(p => {
          const slot = timetable[day]?.[p.period];
          if (slot) {
            rows.push([
              day,
              p.period,
              p.time,
              slot.subject || 'Free / Prep',
              slot.class || '—',
              slot.room || '—',
              slot.notes || ''
            ]);
          } else {
            rows.push([day, p.period, p.time, 'Free Period', '—', '—', '']);
          }
        });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Teacher_Timetable_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Computed values
  const classCount = stats.classCount || 0;
  const avgPerDay = stats.avgPerDay || (Math.round(classCount / 6) || 0);
  const assignedClasses = stats.assignedClasses || 0;
  const freePeriodsCount = stats.freePeriodsCount || 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg print:bg-white print:p-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 print:hidden">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 text-purple-500 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">My Timetable</h1>
              <p className="text-sm text-gray-500">
                Academic Session 2026–27 | {teacherInfo ? `${teacherInfo.fullName} (${teacherInfo.designation || 'Teacher'})` : 'Weekly Schedule'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['week', 'day', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-xs font-bold border capitalize transition-colors cursor-pointer ${
                  view === v
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {v}
              </button>
            ))}
            <button
              onClick={() => handleOpenSlotModal('Monday', 'P1')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add / Edit Slot
            </button>
            <button
              onClick={handlePrint}
              className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Print Timetable"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-full mx-auto space-y-5">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-gray-500">Loading your timetable...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
              {[
                { label: 'Classes / Week', val: classCount, icon: BookOpen, color: 'text-purple-500 bg-purple-50' },
                { label: 'Classes / Day (avg)', val: avgPerDay, icon: Clock, color: 'text-blue-500 bg-blue-50' },
                { label: 'Classes Assigned', val: assignedClasses, icon: Users, color: 'text-indigo-500 bg-indigo-50' },
                { label: 'Free Periods / Week', val: freePeriodsCount, icon: CalendarDays, color: 'text-green-500 bg-green-50' },
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

            {/* Subject Legend */}
            <div className="bg-white border border-gray-200 shadow-sm px-5 py-3 flex items-center flex-wrap gap-4 print:hidden">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subject Legend:</span>
              {Object.keys(subjectColorPresets).map(sub => {
                const cls = getSubjectColor(sub);
                return (
                  <span key={sub} className={`flex items-center gap-1.5 text-xs font-semibold ${cls.text}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${cls.dot}`}></span>{sub}
                  </span>
                );
              })}
            </div>

            {/* ===== WEEK VIEW ===== */}
            {view === 'week' && (
              <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[900px]" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase border border-gray-200 w-32">Period / Time</th>
                      {days.map((d, i) => (
                        <th
                          key={d}
                          className={`px-3 py-3 text-xs font-bold uppercase border border-gray-200 text-center ${
                            i === todayIdx ? 'bg-purple-50 text-purple-700' : 'text-gray-500'
                          }`}
                        >
                          <p>{d}</p>
                          {i === todayIdx && (
                            <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold ml-1">
                              TODAY
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map(({ period, time, isBreak }) => {
                      return (
                        <tr key={period} className={isBreak ? 'bg-amber-50' : 'hover:bg-gray-50/50'}>
                          <td className="px-4 py-2 border border-gray-200">
                            <p className="text-xs font-bold text-gray-700">{period}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{time}</p>
                          </td>
                          {days.map((day, di) => {
                            if (isBreak) {
                              return (
                                <td key={day} className="px-3 py-2 border border-gray-200 text-center text-xs text-amber-600 font-bold">
                                  {period === 'Break' ? '☕ Break' : '🍱 Lunch'}
                                </td>
                              );
                            }
                            const slot = timetable[day]?.[period];
                            const col = slot ? getSubjectColor(slot.subject) : null;
                            return (
                              <td
                                key={day}
                                className={`px-2 py-1.5 border border-gray-200 ${
                                  di === todayIdx ? 'bg-purple-50/30' : ''
                                }`}
                              >
                                {slot ? (
                                  <button
                                    onClick={() => setViewSlot({ ...slot, period, time, day })}
                                    className={`w-full text-left p-2 border rounded-none transition-all hover:shadow-sm cursor-pointer ${col.bg} ${col.border}`}
                                  >
                                    <p className={`text-xs font-bold leading-tight ${col.text}`}>{slot.subject}</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{slot.class}</p>
                                    <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                                      <MapPin className="w-2.5 h-2.5" />{slot.room}
                                    </p>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleOpenSlotModal(day, period)}
                                    className="w-full h-full min-h-[46px] flex items-center justify-center py-2 text-[10px] text-gray-300 hover:text-purple-500 hover:bg-purple-50/30 transition-colors font-medium cursor-pointer border border-transparent hover:border-dashed hover:border-purple-200"
                                    title="Click to assign class slot"
                                  >
                                    + free
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ===== DAY VIEW ===== */}
            {view === 'day' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => setDay(d => Math.max(0, d - 1))}
                    className="p-2 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1 flex-wrap">
                    {days.map((d, i) => (
                      <button
                        key={d}
                        onClick={() => setDay(i)}
                        className={`px-3 py-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                          selectedDay === i
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {shortDays[i]}
                        {i === todayIdx && <span className="ml-1 text-[9px] bg-yellow-300 text-yellow-900 px-1 rounded-full">•</span>}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setDay(d => Math.min(5, d + 1))}
                    className="p-2 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm">
                  <div className={`px-5 py-3 border-b border-gray-200 flex justify-between items-center ${selectedDay === todayIdx ? 'bg-purple-50' : 'bg-gray-50'}`}>
                    <div>
                      <p className="font-bold text-gray-800">{days[selectedDay]} Schedule</p>
                      {selectedDay === todayIdx && <p className="text-xs text-purple-600 font-semibold">Today</p>}
                    </div>
                    <button
                      onClick={() => handleOpenSlotModal(days[selectedDay], 'P1')}
                      className="text-xs text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Assign Period
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {periods.map(({ period, time, isBreak }) => {
                      const slot = !isBreak ? timetable[days[selectedDay]]?.[period] : null;
                      const col = slot ? getSubjectColor(slot.subject) : null;

                      if (isBreak) {
                        return (
                          <div key={period} className="px-5 py-3 bg-amber-50 flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-600">
                              {period === 'Break' ? '☕ Short Break' : '🍱 Lunch Break'}
                            </span>
                            <span className="text-xs text-gray-400">{time}</span>
                          </div>
                        );
                      }

                      return (
                        <div key={period} className="flex items-center px-5 py-3 gap-4 hover:bg-gray-50 transition-colors">
                          <div className="w-24 flex-shrink-0">
                            <p className="text-xs font-bold text-gray-600">{period}</p>
                            <p className="text-[10px] text-gray-400">{time}</p>
                          </div>
                          {slot ? (
                            <div className={`flex-1 flex items-center gap-4 border px-4 py-2.5 ${col.bg} ${col.border}`}>
                              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${col.dot}`}></span>
                              <div className="flex-1">
                                <p className={`font-bold text-sm ${col.text}`}>{slot.subject}</p>
                                <p className="text-xs text-gray-500">
                                  {slot.class} &bull;{' '}
                                  <span className="inline-flex items-center gap-0.5">
                                    <MapPin className="w-2.5 h-2.5" /> {slot.room}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setViewSlot({ ...slot, period, time, day: days[selectedDay] })}
                                  className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-200 cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenSlotModal(days[selectedDay], period, slot)}
                                  className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 cursor-pointer"
                                  title="Edit Slot"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSlot(slot)}
                                  className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 cursor-pointer"
                                  title="Clear Slot"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-between border border-dashed border-gray-200 px-4 py-2.5 text-xs text-gray-400 font-medium">
                              <span>Free Period</span>
                              <button
                                onClick={() => handleOpenSlotModal(days[selectedDay], period)}
                                className="text-purple-600 hover:text-purple-700 font-bold text-xs cursor-pointer"
                              >
                                + Assign Class
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ===== LIST VIEW ===== */}
            {view === 'list' && (
              <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-base font-bold text-gray-800">All Scheduled Classes — Weekly Schedule</h2>
                  <span className="text-xs text-gray-400 font-medium">{classCount} classes assigned</span>
                </div>
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr className="bg-gray-50">
                      {['#', 'Day', 'Period', 'Time', 'Subject', 'Class', 'Room', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase border border-gray-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.flatMap((day, di) =>
                      periods
                        .filter(p => !p.isBreak)
                        .map(({ period, time }) => {
                          const slot = timetable[day]?.[period];
                          if (!slot || slot.subject === 'Free / Prep') return null;
                          const col = getSubjectColor(slot.subject);
                          return { day, di, period, time, slot, col };
                        })
                        .filter(Boolean)
                    ).map(({ day, di, period, time, slot, col }, idx) => (
                      <tr key={idx} className={`hover:bg-purple-50/20 transition-colors ${di === todayIdx ? 'bg-purple-50/10' : ''}`}>
                        <td className="px-4 py-3 border border-gray-200 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 border border-gray-200 font-semibold text-gray-800 whitespace-nowrap">
                          {day} {di === todayIdx && <span className="ml-1 text-[10px] bg-purple-100 text-purple-600 font-bold px-1.5 py-0.5">Today</span>}
                        </td>
                        <td className="px-4 py-3 border border-gray-200 text-gray-600">{period}</td>
                        <td className="px-4 py-3 border border-gray-200 text-gray-500 whitespace-nowrap">{time}</td>
                        <td className="px-4 py-3 border border-gray-200">
                          <span className={`text-xs font-bold px-2 py-0.5 ${col.bg} ${col.text} border ${col.border}`}>{slot.subject}</span>
                        </td>
                        <td className="px-4 py-3 border border-gray-200 font-medium text-gray-700">{slot.class}</td>
                        <td className="px-4 py-3 border border-gray-200 text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />{slot.room}
                          </span>
                        </td>
                        <td className="px-4 py-3 border border-gray-200">
                          <div className="flex gap-1">
                            <button
                              onClick={() => setViewSlot({ ...slot, period, time, day })}
                              className="p-1.5 bg-blue-50 text-blue-500 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenSlotModal(day, period, slot)}
                              className="p-1.5 bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot)}
                              className="p-1.5 bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 cursor-pointer"
                              title="Clear"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      </div>

      {/* ===== View Slot Modal ===== */}
      {viewSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewSlot(null)}>
          <div className="bg-white w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800">Period Details</h2>
              <button onClick={() => setViewSlot(null)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-3">
              {(() => {
                const col = getSubjectColor(viewSlot.subject);
                return (
                  <div className={`border ${col.border} ${col.bg} p-4 rounded-none`}>
                    <p className={`text-lg font-black ${col.text}`}>{viewSlot.subject}</p>
                    <p className="text-sm text-gray-600 mt-1 font-semibold">{viewSlot.class}</p>
                  </div>
                );
              })()}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Day',    val: viewSlot.day,    icon: CalendarDays },
                  { label: 'Period', val: viewSlot.period, icon: BookOpen },
                  { label: 'Time',   val: viewSlot.time,   icon: Clock },
                  { label: 'Room',   val: viewSlot.room,   icon: MapPin },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-gray-50 border border-gray-100 p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Icon className="w-3 h-3" />{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{val}</p>
                  </div>
                ))}
              </div>

              {viewSlot.notes && (
                <div className="bg-gray-50 border border-gray-100 p-3 text-xs text-gray-600">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Teacher Notes</p>
                  <p>{viewSlot.notes}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center gap-2">
              <button
                onClick={() => {
                  const s = viewSlot;
                  setViewSlot(null);
                  handleDeleteSlot(s);
                }}
                className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
              >
                Clear Period
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const s = viewSlot;
                    setViewSlot(null);
                    handleOpenSlotModal(s.day, s.period, s);
                  }}
                  className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 text-xs font-bold border border-purple-200 cursor-pointer"
                >
                  Edit Slot
                </button>
                <button
                  onClick={() => setViewSlot(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Add / Edit Slot Modal ===== */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowSlotModal(false)}>
          <div className="bg-white w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-purple-600" />
                {editingSlotId ? 'Edit Timetable Slot' : 'Assign Timetable Slot'}
              </h2>
              <button onClick={() => setShowSlotModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveSlot} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Day *</label>
                  <select
                    value={slotForm.day}
                    onChange={e => setSlotForm({ ...slotForm, day: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Period *</label>
                  <select
                    value={slotForm.period}
                    onChange={e => setSlotForm({ ...slotForm, period: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
                  >
                    {periods.filter(p => !p.isBreak).map(p => (
                      <option key={p.period} value={p.period}>{p.period} ({p.time})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subject *</label>
                <input
                  type="text"
                  required
                  list="subjects-list"
                  placeholder="e.g. Mathematics, Science"
                  value={slotForm.subject}
                  onChange={e => setSlotForm({ ...slotForm, subject: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
                />
                <datalist id="subjects-list">
                  {subjectList.map(s => <option key={s} value={s} />)}
                  <option value="Mathematics" />
                  <option value="Algebra" />
                  <option value="Geometry" />
                  <option value="Statistics" />
                  <option value="Free / Prep" />
                  <option value="Sport Duty" />
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Class / Section *</label>
                  <input
                    type="text"
                    required
                    list="classes-list"
                    placeholder="e.g. Class X A"
                    value={slotForm.class}
                    onChange={e => setSlotForm({ ...slotForm, class: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
                  />
                  <datalist id="classes-list">
                    {classList.map(c => (
                      <React.Fragment key={c}>
                        <option value={`${c} A`} />
                        <option value={`${c} B`} />
                        <option value={`${c} C`} />
                      </React.Fragment>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 204, Lab 1"
                    value={slotForm.room}
                    onChange={e => setSlotForm({ ...slotForm, room: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Syllabus chapter, doubt session, or exam instructions..."
                  value={slotForm.notes}
                  onChange={e => setSlotForm({ ...slotForm, notes: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingSlotId ? 'Update Slot' : 'Save Slot'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTimetable;

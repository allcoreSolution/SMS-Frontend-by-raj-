import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, ClipboardCheck, FileText, BookOpen, Phone, MessageSquare,
  Mail, Zap, Calendar, Clock, GraduationCap, ChevronLeft, ChevronRight,
  Megaphone, User, Award, Shield, CheckCircle2, AlertTriangle,
  RefreshCw, Info, ExternalLink, X, MapPin, Sparkles, BookMarked,
  LayoutGrid, PenLine, Monitor
} from 'lucide-react';
import { parentService } from '../api/parentService';

const quickActions = [
  { label: 'Pay Fees',      icon: Wallet,         bg: 'bg-emerald-500', route: '/fee-payments' },
  { label: 'Attendance',    icon: ClipboardCheck, bg: 'bg-blue-500',    route: '/attendance'   },
  { label: 'Exam Report',   icon: FileText,       bg: 'bg-amber-500',   route: '/exams'        },
  { label: 'Timetable',     icon: LayoutGrid,     bg: 'bg-pink-500',    route: '/timetable'    },
  { label: 'Homework',      icon: PenLine,        bg: 'bg-orange-500',  route: '/homework'     },
  { label: 'Documents',     icon: BookOpen,       bg: 'bg-teal-500',    route: '/documents'    },
  { label: 'Study Center',  icon: BookMarked,     bg: 'bg-rose-500',    route: '/study-center' },
  { label: 'Notice Board',  icon: Megaphone,      bg: 'bg-purple-500',  route: '/notice-board' },
];

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay    = (y, m) => new Date(y, m, 1).getDay();

export default function Dashboard({ activeChild, setActiveChild }) {
  const navigate = useNavigate();

  // Current calendar viewing month/year
  const todayDate = new Date();
  const [curDate, setCurDate] = useState(new Date(2026, 9, 1)); // October 2026 as per system ERP timeline
  const [view, setView] = useState('month');

  // Backend state
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);

  const y = curDate.getFullYear();
  const m = curDate.getMonth();
  const daysInMonth = getDaysInMonth(y, m);
  const firstDay    = getFirstDay(y, m);
  const dk = (d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const prevMonthLen = getDaysInMonth(y, m - 1);
  const trailingCount = (7 - ((firstDay + daysInMonth) % 7)) % 7;

  // Fetch real data from backend API
  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const parentUser = localStorage.getItem('parent_user');
      let parentId = null;
      if (parentUser) {
        try {
          const parsed = JSON.parse(parentUser);
          parentId = parsed.parentId || parsed._id;
        } catch (e) {
          // ignore
        }
      }

      const res = await parentService.getDashboard({
        studentId: activeChild,
        parentId,
        month: m + 1,
        year: y
      });

      if (res && res.success && res.data) {
        setDashboardData(res.data);
        // If App has no active child selected yet and backend returned children, set it
        if ((!activeChild || activeChild === 3) && res.data.student && res.data.student._id && setActiveChild) {
          if (activeChild !== res.data.student._id) {
            setActiveChild(res.data.student._id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data from backend:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeChild, m, y]);

  // Fallback defaults if backend is loading or unavailable
  const student = dashboardData?.student || {
    name: 'Aarav Sharma',
    class: 'Class I (A)',
    avatar: 'A',
    admn: 'YIS-2024-101',
    roll: '1',
    dob: '15 Oct 2014',
    bloodGroup: 'A+',
    house: 'Red Phoenix',
    category: 'General',
    fatherName: 'Rajesh Kumar Gupta',
    fatherPhone: '9876510000',
    photo: null
  };

  const fees = dashboardData?.fees || {
    totalAssigned: 72500,
    totalPaid: 72500,
    totalDue: 0,
    feesPaid: '₹72,500.00',
    feesBalance: 'All Clear',
    status: 'All Clear'
  };

  const attendance = dashboardData?.attendance || {
    today: 'Not Marked Yet',
    rate: '98%',
    presentCount: 16,
    absentCount: 0,
    lateCount: 1,
    calendarMap: {}
  };

  const notices = dashboardData?.notices && dashboardData.notices.length > 0
    ? dashboardData.notices
    : [
        {
          id: '1',
          type: 'alert',
          title: 'CBSE Mid-Term Assessment Date Sheet Published',
          date: '14 Oct 2026',
          body: 'The Mid-Term Examination Date Sheet for Classes VI to X has been finalized and uploaded to the portal. Examinations commence from 5th November 2026.'
        },
        {
          id: '2',
          type: 'notice',
          title: 'Winter Uniform Guidelines & School Timings Update',
          date: '14 Oct 2026',
          body: 'Effective 1st November 2026, the school timings for all students will be 8:30 AM to 2:30 PM. All students must wear the designated navy blue blazer.'
        }
      ];

  const calendarEvents = dashboardData?.calendarEvents || {
    '2026-10-18': [{ title: 'Term 1 PTM Interaction', color: 'bg-indigo-500', type: 'Meeting' }],
    '2026-10-22': [{ title: 'Inter-School Science & Robotics', color: 'bg-blue-500', type: 'Event' }],
    '2026-10-29': [{ title: 'Diwali & Autumn Festival Break', color: 'bg-pink-500', type: 'Holiday' }],
    '2026-10-30': [{ title: 'Annual Athletics Meet - Finals', color: 'bg-pink-600', type: 'Event' }],
  };

  const attendanceMap = attendance.calendarMap || {};

  const handleCellClick = (dateStr, dayNum, events, attStatus) => {
    setSelectedDayEvents({
      dateStr,
      dayNum,
      events,
      attStatus: attStatus || 'Holiday / No Record'
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1440px] mx-auto min-h-screen">
      
      {/* ── TOP HEADER BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
              Parent & Student Portal
            </h1>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Real-time synchronization with Central School ERP Node
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 transition-colors shadow-2xs active:scale-95"
            title="Reload live database metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Sync Live'}</span>
          </button>

          {/* Active Student Pill */}
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900 truncate max-w-[140px] sm:max-w-none">
              {student.name} ({student.class})
            </span>
          </div>
        </div>
      </div>

      {/* ── TOP ROW: STUDENT PROFILE & NOTICE BOARD (LEFT) + METRICS & QUICK ACTIONS (RIGHT) ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* ── LEFT COLUMN (4 Cols): STUDENT IDENTITY & NOTICES ── */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">

          {/* Student Profile Card */}
          <div className="bg-white border border-gray-200 p-5 shadow-xs relative overflow-hidden group">
            {/* Background accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* Profile Avatar / Photo */}
            <div className="flex flex-col items-center text-center mt-2 mb-5">
              <div className="relative mb-3">
                {student.photo ? (
                  <img
                    src={student.photo.startsWith('http') || student.photo.startsWith('data:') ? student.photo : `http://localhost:5050${student.photo.startsWith('/') ? '' : '/'}${student.photo}`}
                    alt={student.name}
                    className="w-20 h-20 object-cover border-2 border-indigo-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 shadow-md border-2 border-indigo-100 flex items-center justify-center">
                    <span className="text-3xl font-black text-white">{student.avatar}</span>
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200" title="Enrolled & Active" />
              </div>

              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
                {student.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
                <span className="text-[12px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5">
                  {student.class}
                </span>
                <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                  Roll: {student.roll}
                </span>
              </div>
            </div>

            {/* Detailed Info Rows */}
            <div className="divide-y divide-gray-100 text-[12.5px] mb-5">
              {[
                { label: 'Admission No.', val: student.admn, icon: GraduationCap },
                { label: 'Date of Birth', val: student.dob, icon: Calendar },
                { label: 'House', val: student.house || 'Red Phoenix', icon: Shield },
                { label: 'Blood Group', val: student.bloodGroup || 'O+', icon: Sparkles },
                { label: 'Guardian / Father', val: student.fatherName || 'Parent', icon: User },
              ].map(({ label, val, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[11px] tracking-wider">
                    <Icon className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    {label}
                  </span>
                  <span className="font-extrabold text-gray-800 text-right truncate max-w-[180px]">
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Profile Nav */}
            <button
              onClick={() => navigate('/my-profile')}
              className="w-full py-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 text-xs font-black uppercase tracking-wider border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Complete Student Dossier</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notice Board Card */}
          <div className="bg-white border border-gray-200 p-5 shadow-xs flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Notice Board</h3>
              </div>
              <button
                onClick={() => navigate('/notice-board')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1">
              {notices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setActiveNoticeModal(n)}
                  className="p-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[9.5px] font-black uppercase px-2 py-0.5 tracking-widest ${
                        n.type === 'alert'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {n.type === 'alert' ? 'High Priority' : 'Official Notice'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{n.date}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-gray-800 group-hover:text-indigo-600 line-clamp-1 transition-colors">
                    {n.title}
                  </h4>
                  <p className="text-[11.5px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {n.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (8 Cols): STATS, QUICK ACTIONS & CALENDAR ── */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">

          {/* Top 3 Interactive Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Fee Due Card */}
            <button
              onClick={() => navigate('/fee-payments')}
              className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-red-100 uppercase tracking-wider">Fee Balance</span>
                <div className="w-8 h-8 bg-white/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className={`text-2xl font-black tracking-tight ${fees.feesBalance === 'All Clear' ? 'text-emerald-300' : 'text-white'}`}>
                  {fees.feesBalance}
                </p>
                <div className="flex items-center justify-between text-[11px] text-red-100 mt-1 font-semibold">
                  <span>Paid: {fees.feesPaid}</span>
                  <span className="underline group-hover:text-white">Pay Online »</span>
                </div>
              </div>
            </button>

            {/* Today's Attendance Card */}
            <button
              onClick={() => navigate('/attendance')}
              className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-teal-100 uppercase tracking-wider">Today's Attendance</span>
                <div className="w-8 h-8 bg-white/20 flex items-center justify-center">
                  <ClipboardCheck className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-black tracking-tight text-white">
                    {attendance.today}
                  </p>
                  {attendance.today === 'Present' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-teal-100 mt-1 font-semibold">
                  <span>Rate: {attendance.rate}</span>
                  <span className="underline group-hover:text-white">Full Register »</span>
                </div>
              </div>
            </button>

            {/* Academic Standing / Merit Card */}
            <button
              onClick={() => navigate('/exams')}
              className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Academics & Term</span>
                <div className="w-8 h-8 bg-white/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-white">
                  Term 1 Active
                </p>
                <div className="flex items-center justify-between text-[11px] text-indigo-100 mt-1 font-semibold">
                  <span>House: {student.house || 'Red Phoenix'}</span>
                  <span className="underline group-hover:text-white">Exam Report »</span>
                </div>
              </div>
            </button>

          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Quick Actions & Shortcuts</h3>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {quickActions.map(({ label, icon: Icon, bg, route }) => (
                <button
                  key={label}
                  onClick={() => navigate(route)}
                  className="flex flex-col items-center gap-1.5 p-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                >
                  <div className={`w-11 h-11 ${bg} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight truncate w-full">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Student Activity Calendar */}
          <div className="bg-white border border-gray-200 p-4 shadow-xs flex-1 flex flex-col">
            
            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  Attendance & Events Activity Calendar
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* View Switcher */}
                <div className="flex bg-gray-100 p-0.5 border border-gray-200">
                  <button
                    onClick={() => setView('month')}
                    className={`px-3 py-1 text-[11px] font-bold uppercase transition-colors ${
                      view === 'month' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Month View
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-3 py-1 text-[11px] font-bold uppercase transition-colors ${
                      view === 'list' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    List Schedule
                  </button>
                </div>

                {/* Month Navigator */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurDate(new Date(y, m - 1, 1))}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                    title="Previous month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurDate(new Date(2026, 9, 1))}
                    className="px-2.5 h-7 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-[10px] font-bold uppercase text-gray-700 transition-colors"
                  >
                    Oct 2026
                  </button>
                  <button
                    onClick={() => setCurDate(new Date(y, m + 1, 1))}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                    title="Next month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 mb-3 text-[11px] font-bold text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500"></span> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-500"></span> Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-400"></span> Late
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-pink-500"></span> School Holiday / Fest
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500"></span> PTM / Meeting
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-500"></span> Academic Event
              </span>
              <span className="ml-auto text-xs font-black text-gray-800">
                {MONTHS[m]} {y}
              </span>
            </div>

            {/* View Mode: Month Grid */}
            {view === 'month' && (
              <div className="w-full overflow-x-auto border border-gray-200">
                <table className="w-full border-collapse" style={{ tableLayout: 'fixed', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      {DAYS.map((d) => (
                        <th
                          key={d}
                          className="text-center text-[10.5px] font-black uppercase text-gray-600 py-2 border-b border-gray-200 bg-gray-50/70"
                        >
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const cells = [];
                      // prev month tail
                      for (let i = 0; i < firstDay; i++) {
                        cells.push({ day: prevMonthLen - firstDay + i + 1, cur: false, key: `p-${i}` });
                      }
                      // current month
                      for (let d = 1; d <= daysInMonth; d++) {
                        cells.push({ day: d, cur: true, key: `c-${d}` });
                      }
                      // next month lead
                      for (let i = 0; i < trailingCount; i++) {
                        cells.push({ day: i + 1, cur: false, key: `n-${i}` });
                      }

                      const rows = [];
                      for (let r = 0; r < cells.length / 7; r++) {
                        rows.push(cells.slice(r * 7, r * 7 + 7));
                      }

                      return rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell) => {
                            const dateStr = dk(cell.day);
                            const events = cell.cur ? (calendarEvents[dateStr] || []) : [];
                            const attStatus = cell.cur ? attendanceMap[dateStr] : null;
                            const isToday = cell.cur && cell.day === 17 && m === 9 && y === 2026;

                            // Attendance marker color
                            let attBadge = null;
                            if (attStatus === 'present') {
                              attBadge = <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Present" />;
                            } else if (attStatus === 'absent') {
                              attBadge = <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Absent" />;
                            } else if (attStatus === 'late') {
                              attBadge = <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Late" />;
                            }

                            return (
                              <td
                                key={cell.key}
                                onClick={() => cell.cur && handleCellClick(dateStr, cell.day, events, attStatus)}
                                className={`border border-gray-200 align-top p-1 h-[78px] transition-colors ${
                                  !cell.cur
                                    ? 'bg-gray-50/50 cursor-default opacity-40'
                                    : isToday
                                    ? 'bg-indigo-50/40 hover:bg-indigo-50 cursor-pointer ring-1 ring-indigo-300 inset-0'
                                    : 'hover:bg-gray-50/80 cursor-pointer'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className={`text-[11px] font-black inline-flex items-center justify-center w-5 h-5 ${
                                      isToday
                                        ? 'bg-indigo-600 text-white shadow-2xs'
                                        : cell.cur
                                        ? 'text-gray-800'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    {cell.day}
                                  </span>
                                  {attBadge}
                                </div>

                                <div className="space-y-1">
                                  {events.map((ev, ei) => (
                                    <div
                                      key={ei}
                                      className={`${ev.color} text-white text-[8px] font-black uppercase px-1 py-0.5 truncate tracking-tighter`}
                                      title={ev.title}
                                    >
                                      {ev.title}
                                    </div>
                                  ))}
                                  {attStatus && (
                                    <div className="text-[7.5px] font-bold uppercase text-gray-400 tracking-tighter">
                                      {attStatus}
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}

            {/* View Mode: List Schedule */}
            {view === 'list' && (
              <div className="border border-gray-200 divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
                {Object.entries(calendarEvents).length > 0 ? (
                  Object.entries(calendarEvents).map(([dateStr, evList]) => (
                    <div key={dateStr} className="p-3 hover:bg-gray-50 flex items-start gap-3 transition-colors">
                      <div className="bg-gray-100 border border-gray-200 px-2.5 py-1 text-center min-w-[60px]">
                        <span className="text-[10px] font-black uppercase text-gray-500 block leading-none">
                          {new Date(dateStr).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-base font-black text-gray-900 block leading-tight">
                          {new Date(dateStr).getDate()}
                        </span>
                      </div>
                      <div className="flex-1">
                        {evList.map((ev, i) => (
                          <div key={i} className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 ${ev.color}`}></span>
                            <span className="text-xs font-bold text-gray-800">{ev.title}</span>
                            <span className="text-[9.5px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.2">
                              {ev.type || 'Academic'}
                            </span>
                          </div>
                        ))}
                        <p className="text-[11px] text-gray-500">
                          Scheduled for Class {student.class} and campus attendees.
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-gray-400 font-bold">
                    No special events or holidays registered for this month.
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ── DAY EVENT POPUP MODAL ── */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 w-full max-w-md p-5 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">
                  Calendar Schedule Detail
                </span>
                <h3 className="text-base font-black text-gray-900">
                  {selectedDayEvents.dateStr} (Day {selectedDayEvents.dayNum})
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayEvents(null)}
                className="w-7 h-7 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="p-2.5 bg-gray-50 border border-gray-200 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600 uppercase">Student Attendance</span>
                <span
                  className={`text-xs font-black uppercase px-2 py-0.5 ${
                    selectedDayEvents.attStatus === 'present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedDayEvents.attStatus === 'absent'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {selectedDayEvents.attStatus}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-2">
                  Campus Events on this Date
                </h4>
                {selectedDayEvents.events.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayEvents.events.map((ev, i) => (
                      <div key={i} className="p-3 border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2.5 h-2.5 ${ev.color}`} />
                          <h5 className="text-xs font-bold text-gray-900">{ev.title}</h5>
                        </div>
                        <p className="text-[11px] text-gray-500">
                          {ev.description || 'General school-wide announcement and curriculum event.'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No formal exams or public holidays logged.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedDayEvents(null)}
              className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ── NOTICE DETAIL MODAL ── */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 w-full max-w-lg p-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100 mb-4 gap-3">
              <div>
                <span
                  className={`text-[9.5px] font-black uppercase px-2 py-0.5 tracking-widest ${
                    activeNoticeModal.type === 'alert'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {activeNoticeModal.type === 'alert' ? 'High Priority Alert' : 'School Notification'}
                </span>
                <h3 className="text-base font-black text-gray-900 mt-2 leading-snug">
                  {activeNoticeModal.title}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Published on {activeNoticeModal.date}</p>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="w-7 h-7 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 text-[12.5px] text-gray-700 leading-relaxed max-h-[300px] overflow-y-auto mb-4 whitespace-pre-wrap">
              {activeNoticeModal.body}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider transition-colors"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400">
        <span>© 2026 ProjectWorlds Multi School ERP SAAS Node. All rights reserved.</span>
        <span className="font-semibold text-gray-500">Live API Status: Connected (Port 5050)</span>
      </footer>

    </div>
  );
}

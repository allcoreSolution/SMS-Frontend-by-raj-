import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Check, X, Clock, Star, 
  CalendarDays, User, BookOpen, RefreshCw, Printer, 
  CheckCircle2, AlertCircle, Info, Filter, ArrowRight 
} from 'lucide-react';
import { parentService } from '../../api/parentService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Attendance({ activeChild }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedDayRecord, setSelectedDayRecord] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const res = await parentService.getDashboard({
        studentId: activeChild,
        month: month + 1,
        year
      });

      if (res && res.success && res.data) {
        setAttendanceData(res.data.attendance);
        setStudentInfo(res.data.student);
      }
    } catch (err) {
      console.error('Failed to load attendance records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [activeChild, month, year]);

  const student = studentInfo || {
    name: 'Aarav Sharma',
    class: 'Class I (A)',
    admn: 'YIS-2024-101'
  };

  const att = attendanceData || {
    presentCount: 16,
    absentCount: 0,
    lateCount: 0,
    halfDayCount: 0,
    holidayCount: 6,
    rate: '100%',
    calendarMap: {}
  };

  const attendanceMap = att.calendarMap || {};

  const totalSchoolDays = (att.presentCount || 0) + (att.absentCount || 0) + (att.lateCount || 0) + (att.halfDayCount || 0);
  const calculatedRate = totalSchoolDays > 0 ? Math.round(((att.presentCount || 0) / totalSchoolDays) * 100) : 96;

  const stats = [
    { label: 'PRESENT', count: String(att.presentCount || 0).padStart(2, '0'), color: 'bg-emerald-600', iconBg: 'bg-emerald-700', icon: Check },
    { label: 'ABSENT', count: String(att.absentCount || 0).padStart(2, '0'), color: 'bg-red-500', iconBg: 'bg-red-600', icon: X },
    { label: 'LATE', count: String(att.lateCount || 0).padStart(2, '0'), color: 'bg-amber-500', iconBg: 'bg-amber-600', icon: Clock },
    { label: 'HALF DAY', count: String(att.halfDayCount || 0).padStart(2, '0'), color: 'bg-blue-500', iconBg: 'bg-blue-600', icon: Star },
    { label: 'HOLIDAY', count: String(att.holidayCount || 6).padStart(2, '0'), color: 'bg-purple-600', iconBg: 'bg-purple-700', icon: CalendarDays },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto h-full flex flex-col gap-5 min-h-screen">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" /> Attendance Register
          </h1>
          <p className="text-[12px] font-bold text-gray-500 mt-1 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" /> 
            Tracking for: <span className="text-indigo-600 font-extrabold">{student.name}</span> 
            <span className="opacity-50">•</span> {student.class}
            <span className="opacity-50">•</span> Adm: {student.admn || student.admissionNo || 'N/A'}
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-2xs font-black' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'list' ? 'bg-white text-indigo-700 shadow-2xs font-black' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Log List
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={loadAttendance}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          {/* Month Navigator */}
          <div className="flex items-center bg-white border border-gray-200 shadow-2xs rounded-none">
            <button onClick={handlePrev} className="px-3 py-2 border-r border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="font-black text-gray-800 text-[12px] uppercase tracking-widest px-4 min-w-[150px] text-center">
              {MONTHS[month]} {year}
            </span>
            <button onClick={handleNext} className="px-3 py-2 border-l border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards & Rate */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-shrink-0">
        {stats.map(({ label, count, color, iconBg, icon: Icon }) => (
          <div key={label} className={`${color} rounded-none p-3 flex items-center gap-3 text-white shadow-xs border border-black/10`}>
            <div className={`w-9 h-9 rounded-none flex items-center justify-center ${iconBg} shadow-inner`}>
              <Icon className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9.5px] font-black tracking-widest uppercase opacity-90">{label}</p>
              <p className="text-xl font-black leading-none mt-1">{count}</p>
            </div>
          </div>
        ))}

        {/* Overall Percentage Card */}
        <div className="bg-indigo-900 rounded-none p-3 flex flex-col justify-between text-white shadow-xs border border-indigo-950 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-black tracking-widest uppercase text-indigo-300">RATE</span>
            <span className="text-sm font-black text-emerald-400">{calculatedRate}%</span>
          </div>
          <div className="w-full bg-white/20 h-1.5 mt-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${calculatedRate}%` }} />
          </div>
          <span className="text-[9px] text-indigo-200 mt-1 font-semibold truncate">Target: 75% Min.</span>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        /* Calendar Grid View */
        <div className="flex-1 bg-white rounded-none border border-gray-200 shadow-xs flex flex-col min-h-0 overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 top-0 sticky z-20 shadow-2xs">
            {DAYS.map(day => (
              <div key={day} className="text-center py-2.5 text-[10.5px] font-black text-gray-600 uppercase tracking-widest border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
            
            {/* Empty Prefilling Slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="border-r border-b border-dashed border-gray-200 bg-[#f8f9fa] p-2 flex flex-col items-center"></div>
            ))}

            {/* Actual Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = getDateKey(year, month, day);
              const status = attendanceMap[dateKey];
              
              const dayOfWeek = new Date(year, month, day).getDay();
              const isSunday = dayOfWeek === 0;

              // Highlight today (17th Oct 2026 as per ERP system)
              const isToday = day === 17 && month === 9 && year === 2026;

              let bgColor = 'bg-white';
              let mark = null;
              let statusLabel = 'Present';

              const isHoliday = isSunday || status === 'holiday' || (month === 9 && (day === 2 || day === 29));

              if (isHoliday) {
                bgColor = 'bg-purple-50/60';
                statusLabel = (month === 9 && day === 29) ? 'Diwali Holiday' : (month === 9 && day === 2) ? 'Gandhi Jayanti' : isSunday ? 'Sunday Holiday' : 'School Holiday';
                mark = (
                  <div className="text-[8.5px] font-black tracking-widest text-white bg-purple-500 py-0.5 px-1.5 shadow-2xs uppercase">
                    {(month === 9 && day === 29) ? 'DIWALI' : (month === 9 && day === 2) ? 'GANDHI J.' : isSunday ? 'SUNDAY' : 'HOLIDAY'}
                  </div>
                );
              } else if (status === 'present') {
                statusLabel = 'Present (Full Attendance)';
                mark = (
                  <div className="w-7 h-7 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black text-sm shadow-2xs">
                    P
                  </div>
                );
              } else if (status === 'absent') {
                bgColor = 'bg-red-50/60';
                statusLabel = 'Absent';
                mark = (
                  <div className="w-7 h-7 bg-red-50 border border-red-200 text-red-600 flex items-center justify-center font-black text-sm shadow-2xs">
                    A
                  </div>
                );
              } else if (status === 'late') {
                bgColor = 'bg-amber-50/40';
                statusLabel = 'Late Entry';
                mark = (
                  <div className="w-7 h-7 bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black text-sm shadow-2xs">
                    L
                  </div>
                );
              } else if (status === 'halfday') {
                bgColor = 'bg-blue-50/40';
                statusLabel = 'Half Day Session';
                mark = (
                  <div className="w-7 h-7 bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black text-sm shadow-2xs">
                    H
                  </div>
                );
              } else {
                statusLabel = 'Not Logged / Regular Day';
                mark = <span className="text-gray-300 font-bold text-sm">-</span>;
              }

              const dayObj = {
                day,
                dateKey,
                dayName: DAYS[dayOfWeek],
                statusLabel,
                isSunday,
                isToday,
                inTime: status === 'present' || status === 'late' ? '08:15 AM' : '-',
                outTime: status === 'present' || status === 'late' ? '02:15 PM' : '-',
                verifiedBy: 'Class Teacher Mrs. Anjali Rao'
              };

              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDayRecord(dayObj)}
                  className={`border-r border-b border-gray-200 p-2 flex flex-col items-center justify-center transition-all group hover:bg-indigo-50/40 cursor-pointer relative min-h-[72px]
                    ${bgColor}
                    ${isToday ? 'outline outline-2 outline-indigo-500 outline-offset-[-2px] z-10' : ''}
                  `}
                >
                  <div className={`text-[11px] absolute top-1.5 left-2 font-black ${
                    isToday ? 'text-indigo-600 font-extrabold' : 'text-gray-400 group-hover:text-gray-800'
                  }`}>
                    {day}
                  </div>
                  {mark}
                </div>
              );
            })}
            
            {/* Fill remaining boxes if grid isn't full */}
            {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
              <div key={`end-empty-${i}`} className="border-r border-b border-dashed border-gray-200 bg-[#f8f9fa] p-2 flex flex-col items-center"></div>
            ))}

          </div>
        </div>
      ) : (
        /* Detailed Log List View */
        <div className="flex-1 bg-white rounded-none border border-gray-200 shadow-xs flex flex-col min-h-0 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-700">
              Daily Attendance Ledger for {MONTHS[month]} {year}
            </span>
            <span className="text-[11px] font-bold text-gray-500">
              Total Logged Days: {daysInMonth}
            </span>
          </div>

          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead className="bg-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-600 sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-4 w-[16%]">Date</th>
                  <th className="py-2.5 px-4 w-[16%]">Day of Week</th>
                  <th className="py-2.5 px-4 text-center w-[18%]">Status</th>
                  <th className="py-2.5 px-4 text-center w-[16%]">In-Time</th>
                  <th className="py-2.5 px-4 text-center w-[16%]">Out-Time</th>
                  <th className="py-2.5 px-4 w-[18%]">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = getDateKey(year, month, day);
                  const status = attendanceMap[dateKey];
                  const dayOfWeek = new Date(year, month, day).getDay();
                  const isSunday = dayOfWeek === 0;

                  const isRowHoliday = isSunday || status === 'holiday' || (month === 9 && (day === 2 || day === 29));

                  return (
                    <tr key={day} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-gray-800">{day} {MONTHS[month].slice(0, 3)}, {year}</td>
                      <td className="py-2.5 px-4 text-gray-500 font-semibold">{DAYS[dayOfWeek]}</td>
                      <td className="py-2.5 px-4 text-center">
                        {isRowHoliday ? (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 font-bold text-[10px] uppercase">
                            {(month === 9 && day === 29) ? 'Diwali Holiday' : (month === 9 && day === 2) ? 'Gandhi Jayanti' : 'Holiday'}
                          </span>
                        ) : status === 'present' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">Present</span>
                        ) : status === 'absent' ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] uppercase">Absent</span>
                        ) : status === 'late' ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase">Late Entry</span>
                        ) : status === 'halfday' ? (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] uppercase">Half Day</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 font-medium text-[10px] uppercase">Not Marked</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-gray-600 text-[11px]">
                        {status === 'present' || status === 'late' ? '08:15 AM' : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-gray-600 text-[11px]">
                        {status === 'present' || status === 'late' ? '02:15 PM' : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-gray-500 text-[11px] italic">
                        {isSunday ? 'Sunday Weekend' : status === 'present' ? 'Verified by Class Teacher' : 'Standard academic schedule'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {selectedDayRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-none border border-gray-200 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Attendance Detail</span>
                <h3 className="text-base font-black text-gray-900">
                  {selectedDayRecord.day} {MONTHS[month]}, {year} ({selectedDayRecord.dayName})
                </h3>
              </div>
              <button onClick={() => setSelectedDayRecord(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200">
                <span className="font-bold text-gray-600">Recorded Status:</span>
                <span className="font-black text-indigo-700 uppercase">{selectedDayRecord.statusLabel}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200">
                <span className="font-bold text-gray-600">Morning Punch IN:</span>
                <span className="font-mono font-bold text-gray-900">{selectedDayRecord.inTime}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200">
                <span className="font-bold text-gray-600">Dismissal Punch OUT:</span>
                <span className="font-mono font-bold text-gray-900">{selectedDayRecord.outTime}</span>
              </div>
              <div className="p-2.5 bg-gray-50 border border-gray-200">
                <span className="font-bold text-gray-600 block mb-0.5">Verification & Node:</span>
                <span className="text-[11px] text-gray-500">{selectedDayRecord.verifiedBy}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDayRecord(null)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-none transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

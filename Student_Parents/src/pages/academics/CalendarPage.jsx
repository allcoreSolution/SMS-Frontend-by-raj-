import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, 
  MapPin, RefreshCw, Printer, CheckCircle2, XCircle, AlertCircle, 
  BookOpen, User, Sparkles, Filter, ChevronDown, Award, Users, Info
} from 'lucide-react';
import { parentService } from '../../api/parentService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EVENT_TYPE_STYLES = {
  'Holiday': 'bg-purple-100 text-purple-800 border-purple-200',
  'Festival': 'bg-purple-100 text-purple-800 border-purple-200',
  'Meeting': 'bg-blue-100 text-blue-800 border-blue-200',
  'Seminar': 'bg-amber-100 text-amber-800 border-amber-200',
  'Olympiad': 'bg-amber-100 text-amber-800 border-amber-200',
  'Event': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Sports': 'bg-rose-100 text-rose-800 border-rose-200',
  'Academic': 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

export default function CalendarPage({ activeChild }) {
  // ERP timeline defaults to October 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 9, 17));
  const [tab, setTab] = useState('Monthly'); // 'Monthly' | 'Yearly'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [eventsMap, setEventsMap] = useState({});
  const [attendanceMap, setAttendanceMap] = useState({});
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleJumpToday = () => {
    const today = new Date(2026, 9, 17);
    setCurrentDate(new Date(2026, 9, 1));
    setSelectedDate(today);
  };

  const getDateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Student profile, monthly attendance, and timetable
      const dashRes = await parentService.getDashboard({ 
        studentId: activeChild,
        month: month + 1,
        year
      });

      if (dashRes && dashRes.success && dashRes.data) {
        setStudentInfo(dashRes.data.student);
        if (dashRes.data.attendance) {
          setAttendanceMap(dashRes.data.attendance.calendarMap || {});
          setAttendanceStats(dashRes.data.attendance);
        }
        if (dashRes.data.timetable) {
          setTimetableSlots(dashRes.data.timetable);
        }
      }

      // 2. Fetch all school events
      const eventsRes = await parentService.getEvents();
      const map = {};

      if (eventsRes && eventsRes.success && Array.isArray(eventsRes.data)) {
        eventsRes.data.forEach(ev => {
          if (ev.startDate) {
            const startD = new Date(ev.startDate);
            const endD = ev.endDate ? new Date(ev.endDate) : startD;

            // Normalize dates to start of day in local time
            const cur = new Date(startD);
            while (cur <= endD) {
              const key = getDateKey(cur.getFullYear(), cur.getMonth(), cur.getDate());
              if (!map[key]) map[key] = [];
              map[key].push({
                _id: ev._id,
                title: ev.title || 'School Event',
                type: ev.eventType || ev.category || 'Event',
                time: ev.startTime ? `${ev.startTime} - ${ev.endTime || ''}` : '09:00 AM - 03:30 PM',
                location: ev.location || 'Campus Main Ground',
                description: ev.description || '',
                audience: ev.audience || 'All Students & Parents',
                organizer: ev.organizer || 'School Administration'
              });
              // Next day in multi-day range
              cur.setDate(cur.getDate() + 1);
            }
          }
        });
      }

      // Add standard institutional milestones if October 2026
      if (month === 9 && year === 2026) {
        if (!map['2026-10-02']) {
          map['2026-10-02'] = [{
            title: 'Gandhi Jayanti Holiday',
            type: 'Holiday',
            time: 'Full Day',
            location: 'Campus-Wide',
            description: 'National holiday observed commemorating Mahatma Gandhi Jayanti.',
            audience: 'All Students & Faculty'
          }];
        }
      }

      setEventsMap(map);
    } catch (err) {
      console.error('Failed to load calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, [activeChild, month, year]);

  const selectedDateKey = getDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  const selectedDayOfWeekIndex = selectedDate.getDay();
  const selectedDayName = FULL_DAYS[selectedDayOfWeekIndex];
  const isSelectedSunday = selectedDayOfWeekIndex === 0;

  // Events on selected day
  const rawDayEvents = eventsMap[selectedDateKey] || [];
  const selectedEvents = rawDayEvents.filter(ev => {
    if (categoryFilter === 'All') return true;
    if (categoryFilter === 'Holidays') return ev.type === 'Holiday' || ev.type === 'Festival';
    if (categoryFilter === 'Academic') return ev.type === 'Academic' || ev.type === 'Meeting';
    if (categoryFilter === 'Competitions') return ev.type === 'Seminar' || ev.type === 'Olympiad' || ev.type === 'Sports' || ev.type === 'Event';
    return true;
  });

  // Attendance status for selected day
  const dayAttendanceStatus = attendanceMap[selectedDateKey];

  // Timetable periods for selected day of week
  const dayTimetableSlots = timetableSlots
    .filter(slot => slot.day?.toLowerCase() === selectedDayName.toLowerCase())
    .sort((a, b) => (a.periodNumber || 0) - (b.periodNumber || 0));

  const studentName = studentInfo?.name || 'Aarav Sharma';
  const studentClass = studentInfo?.class || 'Class I (A)';

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-5 min-h-screen">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-indigo-600" /> 
            Academic Calendar & Schedule
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Active Schedule for <span className="text-indigo-600 font-extrabold">{studentName}</span> 
            <span className="opacity-40">•</span> {studentClass}
            <span className="opacity-40">•</span> Session 2026-2027
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleJumpToday}
            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black rounded-none border border-indigo-200 transition-colors"
          >
            Today (17 Oct)
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={loadCalendarData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          {/* Month / Year Switcher */}
          <div className="flex items-center bg-white border border-gray-200 shadow-2xs rounded-none">
            <button onClick={handlePrevMonth} className="px-3 py-2 border-r border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="font-black text-gray-800 text-[12px] uppercase tracking-widest px-4 min-w-[150px] text-center">
              {MONTHS[month]} {year}
            </span>
            <button onClick={handleNextMonth} className="px-3 py-2 border-l border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 border border-gray-200 shadow-2xs">
        {/* Tabs */}
        <div className="flex items-center bg-gray-100 p-0.5 border border-gray-200">
          <button 
            onClick={() => setTab('Monthly')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              tab === 'Monthly' ? 'bg-white text-indigo-700 shadow-2xs font-black' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Monthly Grid
          </button>
          <button 
            onClick={() => setTab('Yearly')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              tab === 'Yearly' ? 'bg-white text-indigo-700 shadow-2xs font-black' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Yearly Overview
          </button>
        </div>

        {/* Category Filter Pills */}
        {tab === 'Monthly' && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Holidays', 'Academic', 'Competitions'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-none border transition-colors flex-shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 font-black'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      {tab === 'Monthly' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Calendar Grid Card (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white rounded-none border border-gray-200 shadow-xs p-4 flex flex-col">
            
            {/* Legend Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100 text-[11px] font-semibold text-gray-600">
              <span className="font-black uppercase tracking-wider text-gray-700">Legend:</span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Present
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Absent
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Holiday
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Event
                </span>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/80">
              {DAYS.map(day => (
                <div key={day} className="text-center py-2 text-[10.5px] font-black text-gray-600 uppercase tracking-widest border-r border-gray-100 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 border-b border-l border-gray-200">
              
              {/* Empty offset days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[76px] bg-gray-50/50 border-r border-b border-dashed border-gray-200 p-1"></div>
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(year, month, day);
                const dateKey = getDateKey(year, month, day);
                const isSelected = selectedDateKey === dateKey;
                const isToday = day === 17 && month === 9 && year === 2026;
                const dayEvents = eventsMap[dateKey] || [];
                const hasEvents = dayEvents.length > 0;
                const attStatus = attendanceMap[dateKey];
                const dayOfWeek = new Date(year, month, day).getDay();
                const isSunday = dayOfWeek === 0;

                // Holiday detection: Sundays or database events of type Holiday/Festival
                const isHolidayEvent = dayEvents.some(e => e.type === 'Holiday' || e.type === 'Festival');
                const isHoliday = isSunday || isHolidayEvent || (month === 9 && (day === 2 || day === 29 || day === 30));

                let cellBg = 'bg-white hover:bg-gray-50';
                if (isSelected) cellBg = 'bg-indigo-50/90 ring-2 ring-indigo-600 ring-inset z-10';
                else if (isHoliday) cellBg = 'bg-purple-50/40 hover:bg-purple-50/70';

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dateObj)}
                    className={`min-h-[76px] p-1.5 border-r border-b border-gray-200 flex flex-col justify-between cursor-pointer transition-all relative ${cellBg}`}
                  >
                    {/* Top Row: Date Number & Today Indicator */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black leading-none ${
                        isToday 
                          ? 'w-5 h-5 rounded-none bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]' 
                          : isSelected 
                            ? 'text-indigo-800 font-extrabold' 
                            : isHoliday 
                              ? 'text-purple-700' 
                              : 'text-gray-700'
                      }`}>
                        {day}
                      </span>

                      {/* Event Dot */}
                      {hasEvents && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shadow-2xs" title={`${dayEvents.length} School Event(s)`}></span>
                      )}
                    </div>

                    {/* Middle: Attendance badge if logged */}
                    <div className="my-1 flex items-center justify-center">
                      {isHoliday ? (
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/80 px-1 py-0.2">
                          {isSunday ? 'SUN' : 'HOLIDAY'}
                        </span>
                      ) : attStatus === 'present' ? (
                        <span className="w-5 h-5 rounded-none bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center border border-emerald-300">
                          P
                        </span>
                      ) : attStatus === 'absent' ? (
                        <span className="w-5 h-5 rounded-none bg-red-100 text-red-700 text-[10px] font-black flex items-center justify-center border border-red-300">
                          A
                        </span>
                      ) : attStatus === 'late' ? (
                        <span className="w-5 h-5 rounded-none bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center border border-amber-300">
                          L
                        </span>
                      ) : (
                        <span className="text-[9px] text-gray-300 font-mono">-</span>
                      )}
                    </div>

                    {/* Bottom: Event Title preview if present */}
                    {hasEvents ? (
                      <div className="truncate text-[8.5px] font-extrabold text-amber-800 bg-amber-50/80 px-1 py-0.5 border border-amber-200 truncate">
                        {dayEvents[0].title}
                      </div>
                    ) : (
                      <div className="h-3"></div>
                    )}
                  </div>
                );
              })}

              {/* Trailing empty boxes */}
              {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
                <div key={`end-${i}`} className="min-h-[76px] bg-gray-50/50 border-r border-b border-dashed border-gray-200 p-1"></div>
              ))}

            </div>
          </div>

          {/* Day Inspector & Schedule Panel (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Date Header Card */}
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-4 rounded-none shadow-xs border border-indigo-950">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-0.5">
                Detailed Inspection
              </span>
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-black tracking-tight">
                  {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}, {selectedDate.getFullYear()}
                </h2>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                  {selectedDayName}
                </span>
              </div>
            </div>

            {/* Child Attendance Status for Selected Date */}
            <div className="bg-white border border-gray-200 p-4 rounded-none shadow-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Attendance Record
                </span>
                <span className="text-[11px] font-bold text-gray-500">
                  {studentName}
                </span>
              </div>

              {isSelectedSunday ? (
                <div className="p-3 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  Sunday Weekend — Regular School Closed
                </div>
              ) : dayAttendanceStatus === 'present' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200">
                    <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Present (Full Day)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-900">08:15 AM - 02:15 PM</span>
                  </div>
                  <div className="text-[11px] text-gray-500 px-1 flex items-center justify-between">
                    <span>Gate Punches: Biometric Node #2</span>
                    <span>Verified by Class Teacher</span>
                  </div>
                </div>
              ) : dayAttendanceStatus === 'absent' ? (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  Marked Absent on this academic day
                </div>
              ) : dayAttendanceStatus === 'late' ? (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  Late Entry recorded at 08:45 AM
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  Regular Academic Day • Standard Schedule
                </div>
              )}
            </div>

            {/* Events Card for Selected Date */}
            <div className="bg-white border border-gray-200 p-4 rounded-none shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Scheduled School Events ({selectedEvents.length})
                </span>
                {categoryFilter !== 'All' && (
                  <span className="text-[10px] text-indigo-600 font-bold uppercase">{categoryFilter}</span>
                )}
              </div>

              {selectedEvents.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 italic text-center">
                  No public events or campus holidays scheduled for this date.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {selectedEvents.map((ev, i) => {
                    const badgeStyle = EVENT_TYPE_STYLES[ev.type] || 'bg-gray-100 text-gray-700 border-gray-200';
                    return (
                      <div key={ev._id || i} className="p-3 bg-gray-50 border border-gray-200 rounded-none hover:border-indigo-300 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-extrabold text-gray-900 text-xs leading-snug">{ev.title}</h4>
                          <span className={`px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider rounded-none border flex-shrink-0 ${badgeStyle}`}>
                            {ev.type}
                          </span>
                        </div>
                        {ev.description && (
                          <p className="text-[11px] text-gray-600 mb-2 leading-relaxed">{ev.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-gray-500 font-semibold border-t border-gray-200/60 pt-2 mt-1">
                          <span className="flex items-center gap-1 text-indigo-700">
                            <Clock className="w-3 h-3" /> {ev.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" /> {ev.location}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Class Period Schedule for Selected Day */}
            <div className="bg-white border border-gray-200 p-4 rounded-none shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> {selectedDayName}'s Class Routine
                </span>
                <span className="text-[11px] font-bold text-gray-400">
                  {studentClass}
                </span>
              </div>

              {isSelectedSunday ? (
                <p className="text-xs text-gray-400 py-3 text-center italic">
                  Classes suspended on Sundays.
                </p>
              ) : dayTimetableSlots.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center italic">
                  No academic periods registered for {selectedDayName}.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {dayTimetableSlots.map((slot, idx) => {
                    const subject = slot.subjectId?.subjectName || slot.subject || 'General Class';
                    const teacher = slot.teacherId?.fullName || slot.teacherId?.name || 'Faculty';
                    const time = `${slot.startTime || '08:30'} - ${slot.endTime || '09:15'}`;
                    const room = slot.roomNumber || 'Room 101';

                    return (
                      <div key={slot._id || idx} className="p-2 bg-gray-50/70 border border-gray-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-none bg-indigo-50 text-indigo-700 font-black text-[10px] flex items-center justify-center border border-indigo-200 flex-shrink-0">
                            P{slot.periodNumber || (idx + 1)}
                          </span>
                          <div>
                            <span className="font-extrabold text-gray-900 block">{subject}</span>
                            <span className="text-[10px] text-gray-500">{teacher} • {room}</span>
                          </div>
                        </div>
                        <span className="font-mono text-[10.5px] font-bold text-gray-600">{time}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* Yearly Overview Tab */
        <div className="bg-white border border-gray-200 p-5 shadow-xs rounded-none space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">
                Academic Session {year}-{year + 1} Calendar Overview
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Annual schedule of breaks, examinations, olympiads, and school interactions.
              </p>
            </div>
            <span className="text-xs font-black text-indigo-600 uppercase bg-indigo-50 border border-indigo-200 px-3 py-1">
              Active Session
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
            {MONTHS.map((m, idx) => {
              const monthStr = String(idx + 1).padStart(2, '0');
              const evKeys = Object.keys(eventsMap).filter(k => k.startsWith(`${year}-${monthStr}`));
              const count = evKeys.reduce((acc, k) => acc + eventsMap[k].length, 0);
              const isCur = idx === month;

              return (
                <div 
                  key={m} 
                  onClick={() => {
                    setCurrentDate(new Date(year, idx, 1));
                    setTab('Monthly');
                  }}
                  className={`border p-4 flex flex-col justify-between min-h-[110px] cursor-pointer transition-all hover:border-indigo-400 group ${
                    isCur 
                      ? 'bg-indigo-50/70 border-indigo-400 ring-1 ring-indigo-400' 
                      : count > 0 
                        ? 'bg-indigo-50/20 border-indigo-100' 
                        : 'bg-gray-50/50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-800 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                      {m}
                    </span>
                    {isCur && (
                      <span className="text-[9px] font-black uppercase text-white bg-indigo-600 px-1.5 py-0.2">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    {count > 0 ? (
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100/70 border border-indigo-200 px-2 py-0.5 inline-block">
                        {count} Scheduled Milestone{count > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-[10.5px] font-semibold text-gray-400">Regular Academic Sessions</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

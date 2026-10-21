import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, CalendarX2, Clock, BookOpen, User, 
  MapPin, RefreshCw, Printer, Search, Sparkles, 
  Layers, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { parentService } from '../../api/parentService';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SUBJECT_COLORS = {
  'Mathematics': 'bg-blue-50 text-blue-700 border-blue-200',
  'General Science': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'English Literature': 'bg-purple-50 text-purple-700 border-purple-200',
  'Hindi Language': 'bg-amber-50 text-amber-700 border-amber-200',
  'Social Studies': 'bg-rose-50 text-rose-700 border-rose-200',
  'Computer Science': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Physical Education': 'bg-teal-50 text-teal-700 border-teal-200',
  'Art & Craft': 'bg-pink-50 text-pink-700 border-pink-200'
};

export default function Timetable({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState(null);
  const [slots, setSlots] = useState([]);
  const [viewFormat, setViewFormat] = useState('cards'); // 'cards' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const cur = dayNames[new Date().getDay()];
    return cur === 'Sunday' ? 'Monday' : cur;
  });

  const loadTimetable = async () => {
    setLoading(true);
    try {
      // 1. Fetch Student profile & dashboard timetable
      const dashRes = await parentService.getDashboard({ studentId: activeChild });
      let student = null;
      if (dashRes && dashRes.success && dashRes.data) {
        student = dashRes.data.student;
        setStudentInfo(student);
        if (dashRes.data.timetable && dashRes.data.timetable.length > 0) {
          setSlots(dashRes.data.timetable);
          setLoading(false);
          return;
        }
      }

      // 2. Fetch specific class timetable from academics API
      const classId = student?.classId;
      const sectionId = student?.sectionId;
      const res = await parentService.getTimetable(classId ? { classId, sectionId } : {});

      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSlots(res.data);
      } else {
        const fallbackRes = await parentService.getTimetable();
        if (fallbackRes && fallbackRes.success && Array.isArray(fallbackRes.data)) {
          setSlots(fallbackRes.data);
        } else {
          setSlots([]);
        }
      }
    } catch (err) {
      console.error('Failed to load timetable:', err);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, [activeChild]);

  const studentName = studentInfo?.name || 'Aarav Sharma';
  const studentClass = studentInfo?.class || 'Class I (A)';

  // Filter slots for the selected day and search query
  const daySlots = slots
    .filter(s => s.day?.toLowerCase() === selectedDay.toLowerCase())
    .filter(s => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const subName = (s.subjectId?.subjectName || s.subject || '').toLowerCase();
      const teacher = (s.teacherId?.fullName || s.teacherId?.name || '').toLowerCase();
      return subName.includes(q) || teacher.includes(q);
    })
    .sort((a, b) => (a.periodNumber || 0) - (b.periodNumber || 0));

  // Build matrix for Master Grid View: Days -> Periods 1 to 5
  const periodsList = [1, 2, 3, 4, 5];

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-5 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            Class Timetable & Schedule
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Viewing Weekly Period Schedule for <span className="text-indigo-600 font-bold">{studentName}</span> • {studentClass}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format Switcher */}
          <div className="flex items-center bg-gray-100 p-0.5 border border-gray-200">
            <button
              onClick={() => setViewFormat('cards')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewFormat === 'cards' ? 'bg-white text-indigo-700 shadow-2xs font-black' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day Cards
            </button>
            <button
              onClick={() => setViewFormat('grid')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                viewFormat === 'grid' ? 'bg-white text-indigo-700 shadow-2xs font-black' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Master Grid
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
            onClick={loadTimetable}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject or faculty..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-none focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold w-full sm:w-auto justify-between sm:justify-end">
          <span>Active Session: <strong className="text-gray-900">2026-2027</strong></span>
          <span>•</span>
          <span>Room: <strong className="text-gray-900">Room 101</strong></span>
          <span>•</span>
          <span>Total Weekly Slots: <strong className="text-indigo-600">{slots.length}</strong></span>
        </div>
      </div>

      {/* Day Selector Tabs (Shown for Cards View) */}
      {viewFormat === 'cards' && (
        <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 bg-white p-1.5 shadow-2xs">
          {DAYS.map(day => {
            const isSelected = selectedDay === day;
            const count = slots.filter(s => s.day?.toLowerCase() === day.toLowerCase()).length;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 rounded-none border-b-2 ${
                  isSelected 
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50 font-black' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{day}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-none font-black ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Timetable Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center space-y-3 shadow-xs">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Loading Timetable for {studentName}...
          </p>
        </div>
      ) : viewFormat === 'cards' ? (
        /* Cards View */
        daySlots.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="w-14 h-14 bg-indigo-50 rounded-none flex items-center justify-center mb-3 text-indigo-600">
              <CalendarX2 className="w-7 h-7" strokeWidth={2} />
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-1">
              No Periods Scheduled for {selectedDay}
            </h2>
            <p className="text-xs text-gray-400 max-w-md">
              There are no classes scheduled matching your filter for {studentClass}. Select another day above or sync with central schedule.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daySlots.map((slot, idx) => {
              const subjectName = slot.subjectId?.subjectName || slot.subject || 'General Subject';
              const subjectCode = slot.subjectId?.subjectCode || 'SUB101';
              const teacherName = slot.teacherId?.fullName || slot.teacherId?.name || (slot.teacherId?.firstName ? `${slot.teacherId.firstName} ${slot.teacherId.lastName || ''}`.trim() : 'Assigned Faculty');
              const designation = slot.teacherId?.designation || 'Faculty Instructor';
              const room = slot.roomNumber || 'Room 101';
              const timeStr = `${slot.startTime || '08:30 AM'} - ${slot.endTime || '09:15 AM'}`;
              const colorClass = SUBJECT_COLORS[subjectName] || 'bg-indigo-50 text-indigo-700 border-indigo-200';

              return (
                <div 
                  key={slot._id || idx}
                  className="bg-white border border-gray-200 p-4 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Period Badge & Time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-200">
                        {slot.periodName || `Period ${slot.periodNumber || (idx + 1)}`}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 font-mono">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{timeStr}</span>
                      </div>
                    </div>

                    {/* Subject Name & Code */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-block px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-none border ${colorClass}`}>
                          {subjectName}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 font-mono">
                          {subjectCode}
                        </span>
                      </div>
                    </div>

                    {/* Teacher & Room */}
                    <div className="space-y-2 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-none bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          {teacherName.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-gray-900 truncate">{teacherName}</span>
                          <span className="text-[10px] text-gray-400 truncate">{designation}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 pl-8">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-[11px] font-medium">{room}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 flex items-center justify-between text-[10px] font-bold border-t border-gray-50 text-gray-400">
                    <span>{studentClass}</span>
                    <span className="text-emerald-600 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Mandatory Slot
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Master Grid View (Full Week Schedule) */
        <div className="bg-white rounded-none border border-gray-200 shadow-xs overflow-x-auto">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-800">
              Institutional Master Timetable — {studentClass}
            </span>
            <span className="text-[11px] font-bold text-indigo-600">
              Session 2026-2027
            </span>
          </div>

          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-700 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-[12%] border-r border-gray-200">Day</th>
                {periodsList.map(p => (
                  <th key={p} className="py-3 px-3 text-center border-r border-gray-200 last:border-r-0">
                    Period {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {DAYS.map(day => {
                const dayEntries = slots.filter(s => s.day?.toLowerCase() === day.toLowerCase());
                return (
                  <tr key={day} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-black text-gray-900 bg-gray-50/50 border-r border-gray-200">
                      {day}
                    </td>
                    {periodsList.map(pNum => {
                      const entry = dayEntries.find(s => (s.periodNumber || 0) === pNum);
                      if (!entry) {
                        return (
                          <td key={pNum} className="py-3 px-2 text-center text-gray-300 border-r border-gray-200 last:border-r-0">
                            -
                          </td>
                        );
                      }
                      const subName = entry.subjectId?.subjectName || entry.subject || 'Subject';
                      const teacher = entry.teacherId?.fullName || entry.teacherId?.name || 'Faculty';
                      const color = SUBJECT_COLORS[subName] || 'bg-indigo-50 text-indigo-700 border-indigo-200';

                      return (
                        <td key={pNum} className="py-3 px-2 text-center border-r border-gray-200 last:border-r-0">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-none border truncate max-w-[130px] ${color}`}>
                              {subName}
                            </span>
                            <span className="text-[10px] text-gray-600 font-semibold truncate max-w-[120px]">
                              {teacher}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono">
                              {entry.startTime || '08:30'}
                            </span>
                          </div>
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

    </div>
  );
}

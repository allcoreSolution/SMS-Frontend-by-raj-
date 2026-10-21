import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Filter, FolderClosed, BookOpen, Clock, 
  User, CheckCircle, ArrowRight, Search, RefreshCw, 
  GraduationCap, Layers, Eye, X, BookMarked, FileText
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { Link } from 'react-router-dom';

export default function Classwork() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);

  // Filters
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'table'

  // Selected Log for detail modal
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadChildrenAndData();
  }, []);

  const loadChildrenAndData = async () => {
    try {
      setLoading(true);
      const kids = await parentService.getChildren();
      if (kids && kids.length > 0) {
        setChildren(kids);
        const current = kids[0];
        setActiveChild(current);
        await fetchClasswork(current.className || 'Class I');
      } else {
        const fallback = { firstName: 'Aarav', lastName: 'Sharma', className: 'Class I', section: 'A' };
        setActiveChild(fallback);
        await fetchClasswork('Class I');
      }
    } catch (err) {
      console.error('Error loading kids for classwork:', err);
      await fetchClasswork('Class I');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasswork = async (clsName) => {
    try {
      const classNameParam = clsName || activeChild?.className || 'Class I';
      const params = { className: classNameParam };
      if (selectedDate) params.date = selectedDate;
      if (selectedSubject !== 'All') params.subjectName = selectedSubject;
      if (selectedType !== 'All') params.type = selectedType;
      if (searchQuery) params.search = searchQuery;

      const res = await parentService.getClasswork(params);
      if (res?.success && Array.isArray(res.data)) {
        setLogs(res.data);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error('Error fetching classwork logs:', error);
      setLogs([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClasswork(activeChild?.className || 'Class I');
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleFilterApply = () => {
    fetchClasswork(activeChild?.className || 'Class I');
  };

  const handleResetFilters = () => {
    setSelectedDate('');
    setSelectedSubject('All');
    setSelectedType('All');
    setSearchQuery('');
    fetchClasswork(activeChild?.className || 'Class I');
  };

  // Distinct subjects
  const subjectsList = useMemo(() => {
    const set = new Set();
    logs.forEach(l => { if (l.subjectName) set.add(l.subjectName); });
    return ['All', ...Array.from(set)];
  }, [logs]);

  // Client-side filtered list
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSubject = selectedSubject === 'All' || log.subjectName?.toLowerCase() === selectedSubject.toLowerCase();
      const matchType = selectedType === 'All' || (log.type || 'Classwork').toLowerCase() === selectedType.toLowerCase();
      const matchDate = !selectedDate || (log.date && new Date(log.date).toISOString().slice(0, 10) === selectedDate);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        log.topicTaught?.toLowerCase().includes(q) ||
        log.classworkSummary?.toLowerCase().includes(q) ||
        log.homeworkAssigned?.toLowerCase().includes(q) ||
        log.teacherName?.toLowerCase().includes(q) ||
        log.subjectName?.toLowerCase().includes(q);

      return matchSubject && matchType && matchDate && matchSearch;
    });
  }, [logs, selectedSubject, selectedType, selectedDate, searchQuery]);

  // Group by Date for Timeline View
  const groupedLogs = useMemo(() => {
    const groups = {};
    filteredLogs.forEach(log => {
      const dateKey = log.date ? new Date(log.date).toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) : 'Recent Classwork';
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    });
    return groups;
  }, [filteredLogs]);

  // Summary Metrics
  const summaryStats = useMemo(() => {
    const totalPeriods = filteredLogs.length;
    const subjects = new Set(filteredLogs.map(l => l.subjectName)).size;
    let totalPresent = 0;
    let totalStudents = 0;
    let hwCount = 0;

    filteredLogs.forEach(l => {
      if (l.attendanceCount && l.totalStudents) {
        totalPresent += l.attendanceCount;
        totalStudents += l.totalStudents;
      }
      if (l.homeworkAssigned && l.homeworkAssigned.trim() !== '') {
        hwCount++;
      }
    });

    const avgAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 95;

    return {
      totalPeriods,
      subjects,
      avgAttendance,
      hwCount
    };
  }, [filteredLogs]);

  // Badge color helper
  const getSubjectBadge = (subj) => {
    const s = (subj || '').toLowerCase();
    if (s.includes('math')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s.includes('sci') || s.includes('evs') || s.includes('environ')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('eng')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (s.includes('hin')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s.includes('comp')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-[#6366f1] rounded-lg">
              <BookMarked className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Classwork & Daily Logbook</h1>
          </div>
          <p className="text-[13px] text-gray-500 mt-1 pl-10">
            Daily lecture summaries, topics taught in school, and teacher period logbooks for{' '}
            <span className="font-semibold text-gray-700">{activeChild?.firstName} {activeChild?.lastName}</span>
          </p>
        </div>

        {/* Child Badge & Refresh */}
        <div className="flex items-center gap-3 self-start md:self-auto pl-10 md:pl-0">
          <div className="bg-[#5b21b6] text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold shadow-xs">
            <GraduationCap className="w-4 h-4" />
            <span>{activeChild?.className || 'Class I'} {activeChild?.section ? `- ${activeChild.section}` : ''}</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh Entries"
            className="p-2 text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Summary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Periods Logged</span>
            <span className="text-2xl font-black text-gray-800 leading-none">{summaryStats.totalPeriods}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Subjects Taught</span>
            <span className="text-2xl font-black text-gray-800 leading-none">{summaryStats.subjects}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Class Attendance</span>
            <span className="text-2xl font-black text-emerald-600 leading-none">{summaryStats.avgAttendance}%</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Homework Linked</span>
            <span className="text-2xl font-black text-gray-800 leading-none">{summaryStats.hwCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Top Filter Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Date Picker */}
          <div className="relative border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-blue-500 bg-gray-50/50">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Date</label>
            <div className="flex items-center justify-between">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="outline-none text-xs w-full text-gray-700 bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Subject Dropdown */}
          <div className="relative border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-blue-500 bg-gray-50/50">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs font-semibold outline-none bg-transparent text-gray-700 cursor-pointer"
            >
              {subjectsList.map(subj => (
                <option key={subj} value={subj}>{subj === 'All' ? 'All Subjects' : subj}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-blue-500 bg-gray-50/50">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Entry Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs font-semibold outline-none bg-transparent text-gray-700 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Classwork">Classwork Only</option>
              <option value="Logbook">Teacher Logbook</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-blue-500 bg-gray-50/50">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Search Keywords</label>
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Topic, summary, teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs outline-none bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'timeline' ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Timeline Feed
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tabular View
            </button>
          </div>

          {(selectedDate || selectedSubject !== 'All' || selectedType !== 'All' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Content Feed */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-700">Loading daily classwork...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl min-h-[360px] flex flex-col items-center justify-center p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
            <FolderClosed className="w-7 h-7 text-[#6366f1]" strokeWidth={2} />
          </div>
          <h2 className="text-base font-bold text-gray-800 mb-1">No classwork entries found</h2>
          <p className="text-xs text-gray-400 max-w-sm">
            There are no teacher logbook entries matching your selected date or subject filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-[#5b21b6] text-white text-xs font-bold rounded-lg hover:bg-[#4c1d95] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* TIMELINE FEED VIEW */
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([dateStr, dayLogs]) => (
            <div key={dateStr} className="space-y-3">
              {/* Date Header Badge */}
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 bg-[#353A40] text-white text-xs font-extrabold rounded-lg shadow-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {dateStr}
                </span>
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-xs font-semibold text-gray-400">
                  {dayLogs.length} {dayLogs.length === 1 ? 'Period' : 'Periods'}
                </span>
              </div>

              {/* Day Period Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dayLogs.map((log) => {
                  const attendancePct = log.attendanceCount && log.totalStudents
                    ? Math.round((log.attendanceCount / log.totalStudents) * 100)
                    : null;

                  return (
                    <div
                      key={log._id}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Period & Subject Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-[11px] rounded-md border border-indigo-200">
                              Period {log.period || 1}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${getSubjectBadge(log.subjectName)}`}>
                              {log.subjectName}
                            </span>
                          </div>

                          {attendancePct !== null && (
                            <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                              {log.attendanceCount}/{log.totalStudents} ({attendancePct}%)
                            </span>
                          )}
                        </div>

                        {/* Topic Taught */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 leading-snug">
                            {log.topicTaught}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1.5 line-clamp-3 leading-relaxed">
                            {log.classworkSummary}
                          </p>
                        </div>

                        {/* Homework Assigned Note */}
                        {log.homeworkAssigned && (
                          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 text-xs text-amber-900 flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <span className="font-bold text-[10px] uppercase text-amber-800 block">Homework Given:</span>
                              <p className="font-medium text-amber-950 mt-0.5 truncate">{log.homeworkAssigned}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer: Teacher & Details button */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-[10px]">
                            {log.teacherName ? log.teacherName.charAt(0) : 'T'}
                          </div>
                          <span>{log.teacherName || 'Faculty'}</span>
                        </div>

                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABULAR SPREADSHEET VIEW */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Topic Taught</th>
                  <th className="py-3 px-4">Teacher</th>
                  <th className="py-3 px-4">Homework</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredLogs.map(log => (
                  <tr key={log._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold whitespace-nowrap">
                      {log.date ? new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                        Period {log.period || 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold border ${getSubjectBadge(log.subjectName)}`}>
                        {log.subjectName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800 max-w-xs truncate" title={log.topicTaught}>
                      {log.topicTaught}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                      {log.teacherName || 'Faculty'}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-amber-700" title={log.homeworkAssigned}>
                      {log.homeworkAssigned || '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {log.attendanceCount ? `${log.attendanceCount}/${log.totalStudents}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-indigo-600 hover:text-indigo-800 font-bold px-2 py-1 rounded hover:bg-indigo-50"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Detailed Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-md">
                    Period {selectedLog.period || 1}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold border ${getSubjectBadge(selectedLog.subjectName)}`}>
                    {selectedLog.subjectName}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {selectedLog.topicTaught}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs text-gray-700">
              {/* Teaching Summary */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Classwork Summary</span>
                <p className="leading-relaxed font-medium text-gray-800 text-xs">
                  {selectedLog.classworkSummary}
                </p>
              </div>

              {/* Homework Given */}
              {selectedLog.homeworkAssigned && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Assigned Homework / Task</span>
                  <p className="font-semibold text-amber-950 text-xs">
                    {selectedLog.homeworkAssigned}
                  </p>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Faculty Teacher</span>
                  <span className="font-semibold text-gray-800">{selectedLog.teacherName || 'Faculty'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Date Conducted</span>
                  <span className="font-semibold text-gray-800">
                    {selectedLog.date ? new Date(selectedLog.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Today'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Class & Section</span>
                  <span className="font-semibold text-gray-800">{selectedLog.className} {selectedLog.sectionName ? `(${selectedLog.sectionName})` : ''}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Period Attendance</span>
                  <span className="font-semibold text-gray-800">
                    {selectedLog.attendanceCount ? `${selectedLog.attendanceCount} of ${selectedLog.totalStudents} Present` : 'Full Attendance'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full bg-[#353A40] hover:bg-[#23272b] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs"
              >
                Close Logbook Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

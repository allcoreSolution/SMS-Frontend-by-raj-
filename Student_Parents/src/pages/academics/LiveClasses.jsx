import React, { useEffect, useState, useMemo } from 'react';
import { 
  Video, VideoOff, History, Archive, List, Calendar as CalIcon, 
  ExternalLink, Clock, User, CheckCircle2, Copy, Check, 
  PlayCircle, RefreshCw, GraduationCap, Search, Sparkles
} from 'lucide-react';
import { parentService } from '../../api/parentService';

export default function LiveClasses() {
  const [view, setView] = useState('List View'); // 'List View' | 'Calendar View'
  const [activeClasses, setActiveClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeChild, setActiveChild] = useState(null);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const kids = await parentService.getChildren();
      let currentChild = null;
      if (kids && kids.length > 0) {
        currentChild = kids[0];
        setActiveChild(currentChild);
      } else {
        currentChild = { firstName: 'Aarav', lastName: 'Sharma', className: 'Class I', section: 'A' };
        setActiveChild(currentChild);
      }

      await fetchClasses(currentChild?.className || 'Class I');
    } catch (err) {
      console.error('Error in live classes load:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async (clsName) => {
    try {
      const res = await parentService.getLiveClasses({ className: clsName || activeChild?.className || 'Class I' });
      if (res?.success && Array.isArray(res.data)) {
        const act = [];
        const pst = [];
        res.data.forEach(c => {
          if (c.status === 'Completed' || c.status === 'Cancelled') {
            pst.push(c);
          } else {
            act.push(c);
          }
        });
        setActiveClasses(act);
        setPastClasses(pst);
      }
    } catch (error) {
      console.error('Error fetching live classes:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClasses(activeChild?.className || 'Class I');
    setTimeout(() => setRefreshing(false), 500);
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Distinct subjects
  const subjectsList = useMemo(() => {
    const set = new Set();
    [...activeClasses, ...pastClasses].forEach(c => {
      const name = c.subjectName || c.subject?.subjectName;
      if (name) set.add(name);
    });
    return ['All', ...Array.from(set)];
  }, [activeClasses, pastClasses]);

  // Filtered Active
  const filteredActive = useMemo(() => {
    return activeClasses.filter(c => {
      const sName = c.subjectName || c.subject?.subjectName || '';
      const matchSubject = selectedSubject === 'All' || sName.toLowerCase() === selectedSubject.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.teacherName?.toLowerCase().includes(q) ||
        sName.toLowerCase().includes(q);
      return matchSubject && matchSearch;
    });
  }, [activeClasses, selectedSubject, searchQuery]);

  // Filtered Past
  const filteredPast = useMemo(() => {
    return pastClasses.filter(c => {
      const sName = c.subjectName || c.subject?.subjectName || '';
      const matchSubject = selectedSubject === 'All' || sName.toLowerCase() === selectedSubject.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        c.title?.toLowerCase().includes(q) ||
        c.teacherName?.toLowerCase().includes(q) ||
        sName.toLowerCase().includes(q);
      return matchSubject && matchSearch;
    });
  }, [pastClasses, selectedSubject, searchQuery]);

  // Live Now Count
  const liveNowCount = activeClasses.filter(c => c.status === 'Live').length;

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Video className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Live Classes & Online Rooms</h1>
          </div>
          <p className="text-[13px] text-gray-500 mt-1 pl-10">
            Join interactive live classrooms and track scheduled lectures for{' '}
            <span className="font-semibold text-gray-700">{activeChild?.firstName} {activeChild?.lastName}</span>
          </p>
        </div>

        {/* Child Badge & Refresh */}
        <div className="flex items-center gap-3 self-start md:self-auto pl-10 md:pl-0">
          <div className="bg-[#0ea5e9] text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold shadow-xs">
            <GraduationCap className="w-4 h-4" />
            <span>{activeChild?.className || 'Class I'} {activeChild?.section ? `- ${activeChild.section}` : ''}</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh Schedules"
            className="p-2 text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Live Right Now</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-rose-600 leading-none">{liveNowCount}</span>
              {liveNowCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Upcoming Scheduled</span>
            <span className="text-2xl font-black text-gray-800 leading-none">{activeClasses.length - liveNowCount}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Completed Sessions</span>
            <span className="text-2xl font-black text-emerald-600 leading-none">{pastClasses.length}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Recordings Saved</span>
            <span className="text-2xl font-black text-gray-800 leading-none">
              {pastClasses.filter(c => c.recordingUrl).length}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filters and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search live classes, topic, teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="py-1.5 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:border-blue-500"
          >
            {subjectsList.map(subj => (
              <option key={subj} value={subj}>{subj === 'All' ? 'All Subjects' : subj}</option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-0.5">
          <button
            onClick={() => setView('List View')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              view === 'List View' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
          <button
            onClick={() => setView('Calendar View')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              view === 'Calendar View' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CalIcon className="w-3.5 h-3.5" /> Calendar View
          </button>
        </div>
      </div>

      {/* 4. Active & Scheduled Classes */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5" strokeWidth={2.5} />
            <h2 className="text-sm font-bold tracking-wide">Active & Scheduled Live Classes</h2>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
            {filteredActive.length} Available
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw className="w-7 h-7 text-green-600 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading live classroom schedule...</p>
          </div>
        ) : filteredActive.length === 0 ? (
          <div className="py-14 text-center">
            <VideoOff className="w-12 h-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-gray-600 font-bold">No active or scheduled live classes found</p>
            <p className="text-xs text-gray-400 mt-1">Check back later or review past recorded sessions below.</p>
          </div>
        ) : view === 'List View' ? (
          <div className="divide-y divide-gray-100">
            {filteredActive.map((c) => {
              const isLive = c.status === 'Live';
              const subjectName = c.subjectName || c.subject?.subjectName || 'General';
              const teacherName = c.teacherName || (c.hostId ? `${c.hostId.firstName || ''} ${c.hostId.lastName || ''}` : 'Faculty');

              return (
                <div key={c._id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isLive ? 'bg-rose-100 text-rose-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Video className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-600 text-white animate-pulse">
                            ● LIVE NOW
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">
                            Scheduled
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold text-[11px] rounded">
                          {subjectName}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {c.provider || 'Zoom'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-800 leading-snug">
                        {c.title || 'Online Lecture'}
                      </h3>

                      {c.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {c.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {teacherName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(c.startTime).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} ({c.durationMinutes || 45} mins)
                        </span>

                        {c.meetingId && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-mono text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                              ID: {c.meetingId}
                              <button
                                onClick={() => copyToClipboard(c.meetingId, c._id + '-id')}
                                title="Copy ID"
                                className="text-gray-400 hover:text-gray-700"
                              >
                                {copiedId === c._id + '-id' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </span>
                          </>
                        )}

                        {c.passcode && (
                          <span className="flex items-center gap-1 font-mono text-[11px] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-amber-800">
                            Passcode: {c.passcode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Join Button */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <a
                      href={c.meetingUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                        isLive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isLive ? 'Join Live Class' : 'Enter Meeting Room'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* CALENDAR CARDS VIEW */
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActive.map(c => {
              const isLive = c.status === 'Live';
              return (
                <div key={c._id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {c.subjectName || c.subject?.subjectName || 'General'}
                    </span>
                    {isLive ? (
                      <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {c.durationMinutes || 45} mins
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-gray-800 line-clamp-2">
                    {c.title}
                  </h3>

                  <div className="text-[11px] text-gray-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(c.startTime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>{c.teacherName || 'Faculty'}</span>
                    </div>
                  </div>

                  <a
                    href={c.meetingUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#353A40] hover:bg-[#23272b] text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors block text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Join Room
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Past Classes Archive */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-[#4b5563] to-[#374151] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" strokeWidth={2.5} />
            <h2 className="text-sm font-bold tracking-wide">Past Classes & Recordings Archive</h2>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
            {filteredPast.length} Past Lectures
          </span>
        </div>

        {filteredPast.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Archive className="w-10 h-10 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs font-semibold">No past completed classes in archive.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Lecture Title</th>
                  <th className="py-3 px-4 text-center">Subject</th>
                  <th className="py-3 px-4 text-center">Teacher</th>
                  <th className="py-3 px-4 text-center">Conducted On</th>
                  <th className="py-3 px-4 text-center">Duration</th>
                  <th className="py-3 px-4 text-center">Recording</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredPast.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-800">
                      {c.title || 'Completed Session'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold rounded">
                        {c.subjectName || c.subject?.subjectName || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {c.teacherName || (c.hostId ? `${c.hostId.firstName || ''} ${c.hostId.lastName || ''}` : 'Faculty')}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap text-gray-600">
                      {new Date(c.startTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {c.durationMinutes || 45} mins
                    </td>
                    <td className="py-3 px-4 text-center">
                      {c.recordingUrl ? (
                        <a
                          href={c.recordingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded text-xs transition-colors"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Watch Recording
                        </a>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Not Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

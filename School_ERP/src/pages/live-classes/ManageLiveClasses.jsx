import React, { useState, useEffect } from 'react';
import { 
  Settings, Plus, AlertTriangle, Clock, History, Search, 
  Grid, List, Filter, BookOpen, User, Calendar, Hourglass, 
  Trash2, Edit2, Users, ExternalLink, Video, CheckCircle, 
  Play, StopCircle, Copy, Check, Eye, RefreshCw, X, Shield, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScheduleClassModal from './ScheduleClassModal';
import { liveClassService } from '../../api/liveClassService';

export default function ManageLiveClasses() {
  const navigate = useNavigate();

  // State
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({ total: 0, liveNow: 0, scheduled: 0, completed: 0, totalAttendees: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [providerFilter, setProviderFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); 
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Modals for Attendee Roster & Edit
  const [rosterModalClass, setRosterModalClass] = useState(null);
  const [editModalClass, setEditModalClass] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch data from real backend API
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [classesRes, statsRes] = await Promise.all([
        liveClassService.getLiveClasses(),
        liveClassService.getStats()
      ]);

      if (classesRes.success) {
        setClasses(classesRes.data || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data || {});
      }
    } catch (err) {
      console.error('Error loading live classes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Action: Launch / Join Live Class
  const handleJoinClass = async (cls) => {
    try {
      // Record attendance / join log in backend
      await liveClassService.joinClass(cls._id, {
        studentName: 'Admin / Faculty Host',
        rollNumber: 'FACULTY'
      });

      // Open meeting in new tab
      if (cls.meetingUrl) {
        window.open(cls.meetingUrl, '_blank', 'noopener,noreferrer');
      } else {
        showToast('Meeting link is not configured for this class');
      }

      fetchData();
    } catch (err) {
      console.error('Failed to join live class', err);
      if (cls.meetingUrl) {
        window.open(cls.meetingUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Action: Change Status (e.g. Scheduled -> Live, or Live -> Completed)
  const handleStatusChange = async (classId, newStatus) => {
    try {
      await liveClassService.updateStatus(classId, newStatus);
      showToast(`Class status changed to ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
      showToast('Error updating class status');
    }
  };

  // Action: Delete Class
  const handleDeleteClass = async (classId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await liveClassService.deleteClass(classId);
      showToast('Class deleted successfully');
      fetchData();
    } catch (err) {
      console.error('Failed to delete class', err);
      showToast('Error deleting class');
    }
  };

  // Copy Meeting Link helper
  const handleCopyLink = (classId, url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(classId);
    showToast('Meeting invite URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered list
  const filteredClasses = classes.filter(cls => {
    const matchesFilter = activeFilter === 'All' || cls.status === activeFilter;
    const matchesProvider = providerFilter === 'All' || cls.provider === providerFilter;
    
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      cls.title?.toLowerCase().includes(q) ||
      cls.subjectName?.toLowerCase().includes(q) ||
      cls.teacherName?.toLowerCase().includes(q) ||
      cls.className?.toLowerCase().includes(q);

    return matchesFilter && matchesProvider && matchesSearch;
  });

  return (
    <div className="p-6 bg-slate-50/70 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Virtual Live Classrooms</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Live Sync Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Host, monitor attendance, and launch video classes across Jitsi, Zoom, and Meet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={fetchData}
              disabled={refreshing}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center transition-colors"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => navigate('/live-classes/settings')}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              Provider Settings
            </button>
            <button 
              onClick={() => setIsScheduleOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Schedule Class
            </button>
          </div>
        </div>

        {/* Provider Notice Alert */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-4 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-900 leading-relaxed font-medium">
            <strong className="text-amber-950 font-bold">Multi-Provider Virtual Campus:</strong> Classes can be hosted via <strong>Jitsi Meet</strong> (in-app room, zero setup), <strong>Zoom Cloud</strong>, or <strong>Google Meet</strong>. Students can join instantly from their student portal or via the direct invite link.
          </div>
        </div>

        {/* Hero Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Live Now */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600"></span>
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.liveNow || 0}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Right Now</div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-rose-500 rounded-r-3xl" />
          </div>

          {/* Upcoming / Scheduled */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.scheduled || 0}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Lectures</div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-r-3xl" />
          </div>

          {/* Past Completed */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.completed || 0}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Sessions</div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-r-3xl" />
          </div>

          {/* Total Attendees */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0 text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.totalAttendees || 0}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Participations</div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-purple-500 rounded-r-3xl" />
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by topic, teacher, subject..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl overflow-x-auto max-w-full">
            {[
              { id: 'All', label: 'All', count: classes.length },
              { id: 'Live', label: 'Live Now', count: stats.liveNow, isLive: true },
              { id: 'Scheduled', label: 'Scheduled', count: stats.scheduled },
              { id: 'Completed', label: 'Archive', count: stats.completed }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.isLive && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  activeFilter === tab.id ? 'bg-slate-100 text-slate-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Provider Filter & Grid/List View Switch */}
          <div className="flex items-center gap-3">
            <select
              value={providerFilter}
              onChange={e => setProviderFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Providers</option>
              <option value="Jitsi">Jitsi Meet</option>
              <option value="Zoom">Zoom</option>
              <option value="GoogleMeet">Google Meet</option>
              <option value="Teams">MS Teams</option>
            </select>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section: Grid or List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 border border-slate-200/80 text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Syncing virtual classes with database...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-slate-200/80 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No live classes match your filters</h3>
              <p className="text-xs text-slate-500 mt-1">Schedule a new live class or try adjusting your search terms.</p>
            </div>
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Schedule First Class
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map(cls => {
              const isLive = cls.status === 'Live';
              const isScheduled = cls.status === 'Scheduled';
              const isCompleted = cls.status === 'Completed';

              return (
                <div 
                  key={cls._id} 
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden relative group"
                >
                  {/* Status Indicator Bar */}
                  <div className={`h-1.5 w-full ${
                    isLive ? 'bg-gradient-to-r from-rose-500 to-red-600' :
                    isScheduled ? 'bg-gradient-to-r from-indigo-500 to-purple-600' :
                    'bg-slate-300'
                  }`} />

                  <div className="p-5 flex-grow space-y-4">
                    {/* Badge Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isLive ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            LIVE NOW
                          </span>
                        ) : isScheduled ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Scheduled
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Completed
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {cls.provider}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditModalClass(cls)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Class Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(cls._id, cls.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1" title={cls.title}>
                        {cls.title}
                      </h3>
                      {cls.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {cls.description}
                        </p>
                      )}
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-500">
                          <BookOpen className="w-4 h-4 text-indigo-600" /> Subject & Class
                        </span>
                        <span className="font-bold text-slate-800">
                          {cls.subjectName} · {cls.className} ({cls.sectionName})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-500">
                          <User className="w-4 h-4 text-indigo-600" /> Faculty
                        </span>
                        <span className="font-bold text-slate-800">
                          {cls.teacherName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-500">
                          <Calendar className="w-4 h-4 text-indigo-600" /> Start Time
                        </span>
                        <span className="font-semibold text-slate-700">
                          {new Date(cls.startTime).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-500">
                          <Hourglass className="w-4 h-4 text-indigo-600" /> Duration
                        </span>
                        <span className="font-semibold text-slate-700">
                          {cls.durationMinutes || 45} mins
                        </span>
                      </div>
                    </div>

                    {/* Attendance Meter */}
                    <div 
                      onClick={() => setRosterModalClass(cls)}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 cursor-pointer transition-colors flex items-center justify-between"
                      title="Click to view joined attendees"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-slate-700">Attendance</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-black rounded-lg text-xs">
                          {cls.attendeeCount || 0} / {cls.maxStudents || 50}
                        </span>
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                    {isLive ? (
                      <>
                        <button
                          onClick={() => handleJoinClass(cls)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Play className="w-4 h-4 fill-white" /> Join / Host Classroom
                        </button>
                        <button
                          onClick={() => handleStatusChange(cls._id, 'Completed')}
                          className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                          title="End Classroom"
                        >
                          <StopCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : isScheduled ? (
                      <>
                        <button
                          onClick={() => {
                            handleStatusChange(cls._id, 'Live');
                            handleJoinClass(cls);
                          }}
                          className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Play className="w-4 h-4 fill-white" /> Start Class
                        </button>
                        <button
                          onClick={() => handleCopyLink(cls._id, cls.meetingUrl)}
                          className="px-3 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-colors"
                          title="Copy Meeting Invite URL"
                        >
                          {copiedId === cls._id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </>
                    ) : (
                      <>
                        {cls.recordingUrl ? (
                          <a
                            href={cls.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Video className="w-4 h-4" /> Watch Recording
                          </a>
                        ) : (
                          <button
                            onClick={() => setRosterModalClass(cls)}
                            className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Users className="w-4 h-4 text-slate-500" /> View Attendance Roster
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(cls._id, 'Scheduled')}
                          className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs"
                          title="Re-schedule this session"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Status & Title</th>
                    <th className="px-6 py-4">Class & Subject</th>
                    <th className="px-6 py-4">Host Teacher</th>
                    <th className="px-6 py-4">Scheduled Date</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4 text-center">Attendance</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClasses.map(cls => (
                    <tr key={cls._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {cls.status === 'Live' ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                          ) : cls.status === 'Scheduled' ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{cls.title}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{cls.meetingId || 'Auto Room'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{cls.className} ({cls.sectionName})</div>
                        <div className="text-[11px] text-slate-500 font-medium">{cls.subjectName}</div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {cls.teacherName}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">
                          {new Date(cls.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(cls.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({cls.durationMinutes}m)
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] uppercase">
                          {cls.provider}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setRosterModalClass(cls)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{cls.attendeeCount || 0}</span>
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {cls.status === 'Live' ? (
                            <button
                              onClick={() => handleJoinClass(cls)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" /> Join
                            </button>
                          ) : cls.status === 'Scheduled' ? (
                            <button
                              onClick={() => {
                                handleStatusChange(cls._id, 'Live');
                                handleJoinClass(cls);
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" /> Start
                            </button>
                          ) : (
                            <button
                              onClick={() => setRosterModalClass(cls)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-colors"
                            >
                              Roster
                            </button>
                          )}

                          <button
                            onClick={() => handleCopyLink(cls._id, cls.meetingUrl)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                            title="Copy Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls._id, cls.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="Delete"
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
          </div>
        )}

      </div>

      {/* Schedule Class Modal */}
      <ScheduleClassModal 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
        onSuccess={() => {
          showToast('Live classroom successfully scheduled!');
          fetchData();
        }}
      />

      {/* Attendee Roster Sheet Modal */}
      {rosterModalClass && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Class Attendance Roster</h3>
                  <p className="text-xs text-purple-100">{rosterModalClass.title}</p>
                </div>
              </div>
              <button
                onClick={() => setRosterModalClass(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b pb-2">
                <span>Class: {rosterModalClass.className} · {rosterModalClass.subjectName}</span>
                <span>Total Joined: {rosterModalClass.attendeeCount || rosterModalClass.attendees?.length || 0} students</span>
              </div>

              {(!rosterModalClass.attendees || rosterModalClass.attendees.length === 0) ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">No student participants logged yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {rosterModalClass.attendees.map((att, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{att.studentName}</div>
                          <div className="text-[10px] text-slate-400">Roll: {att.rollNumber || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-500 font-medium">
                        Joined: {new Date(att.joinedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setRosterModalClass(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {editModalClass && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Edit Virtual Classroom</h3>
              <button
                onClick={() => setEditModalClass(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await liveClassService.updateClass(editModalClass._id, editModalClass);
                  showToast('Class updated successfully!');
                  setEditModalClass(null);
                  fetchData();
                } catch (err) {
                  showToast('Failed to update class');
                }
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Class Title</label>
                <input
                  type="text"
                  required
                  value={editModalClass.title}
                  onChange={e => setEditModalClass({ ...editModalClass, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={editModalClass.subjectName}
                    onChange={e => setEditModalClass({ ...editModalClass, subjectName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teacher</label>
                  <input
                    type="text"
                    value={editModalClass.teacherName}
                    onChange={e => setEditModalClass({ ...editModalClass, teacherName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Meeting Link</label>
                <input
                  type="url"
                  required
                  value={editModalClass.meetingUrl}
                  onChange={e => setEditModalClass({ ...editModalClass, meetingUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={editModalClass.durationMinutes}
                    onChange={e => setEditModalClass({ ...editModalClass, durationMinutes: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editModalClass.status}
                    onChange={e => setEditModalClass({ ...editModalClass, status: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalClass(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

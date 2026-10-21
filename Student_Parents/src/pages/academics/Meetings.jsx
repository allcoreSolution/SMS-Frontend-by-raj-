import React, { useState, useEffect } from 'react';
import { 
  Handshake, Calendar, Clock, MapPin, Video, User, 
  CheckCircle2, AlertCircle, RefreshCw, Printer, Plus, 
  X, ExternalLink, ShieldCheck, Tag, FileText, ChevronRight 
} from 'lucide-react';
import { parentService } from '../../api/parentService';

export default function Meetings({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('meetings'); // 'meetings' | 'followups'
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Request form state
  const [agenda, setAgenda] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date(Date.now() + 3 * 24 * 3600 * 1000);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [preferredMode, setPreferredMode] = useState('In person');
  const [teacherSelected, setTeacherSelected] = useState('Class Teacher (Mrs. Anjali Rao)');

  const loadMeetingsData = async () => {
    setLoading(true);
    try {
      // 1. Fetch student profile
      const dashRes = await parentService.getDashboard({ studentId: activeChild });
      if (dashRes && dashRes.success && dashRes.data?.student) {
        setStudentInfo(dashRes.data.student);
      }

      // 2. Fetch PTM meetings
      const res = await parentService.getMeetings({ studentId: activeChild });
      if (res && res.success && Array.isArray(res.data)) {
        setMeetings(res.data);
      } else {
        setMeetings([]);
      }
    } catch (err) {
      console.error('Failed to load meetings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetingsData();
  }, [activeChild]);

  const studentName = studentInfo?.name || 'Aarav Sharma';
  const studentClass = studentInfo?.class || 'Class I (A)';

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: `1-on-1 Consultation: ${agenda || 'Academic Progress Discussion'}`,
        studentId: activeChild,
        meetingDate: new Date(preferredDate),
        startTime: preferredTime,
        endTime: '11:30 AM',
        mode: preferredMode,
        venue: preferredMode === 'Online' ? 'Virtual (Google Meet)' : 'Faculty Discussion Room 102',
        meetingLink: preferredMode === 'Online' ? 'https://meet.google.com/yis-ptm-consult' : '',
        description: `Requested by parent for ${studentName}. Agenda: ${agenda}. Preferred faculty: ${teacherSelected}`,
        status: 'Scheduled',
        className: studentClass,
        roster: [{
          studentId: activeChild,
          name: studentName,
          className: studentClass,
          slot: `${preferredTime} - 11:30 AM`,
          attendance: 'Pending',
          remarks: 'Parent initiated consultation',
          tags: ['Parent Request']
        }]
      };

      const res = await parentService.requestMeeting(payload);
      if (res && res.success) {
        setSuccessToast('Consultation request sent successfully to the faculty coordinator.');
        setShowRequestModal(false);
        setAgenda('');
        await loadMeetingsData();
        setTimeout(() => setSuccessToast(''), 5000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request meeting');
    } finally {
      setSubmitting(false);
    }
  };

  // Collect all follow-ups across all meetings
  const allFollowUps = [];
  meetings.forEach(m => {
    if (Array.isArray(m.followUps)) {
      m.followUps.forEach(f => {
        allFollowUps.push({
          ...f,
          meetingTitle: m.title,
          meetingDate: m.meetingDate
        });
      });
    }
  });

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-5 min-h-screen">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Handshake className="w-6 h-6 text-indigo-600" />
            Parent-Teacher Meetings & Consultations
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            Active Schedule for <span className="text-indigo-600 font-bold">{studentName}</span> • {studentClass}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-none shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Request 1-on-1 Meeting</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={loadMeetingsData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200 shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Scheduled Conferences</span>
          <span className="text-2xl font-black text-gray-900">
            {meetings.filter(m => m.status === 'Scheduled').length}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Upcoming interactions</p>
        </div>
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Completed Interactions</span>
          <span className="text-2xl font-black text-emerald-600">
            {meetings.filter(m => m.status === 'Completed').length}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Documented sessions</p>
        </div>
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Action Items / Follow-ups</span>
          <span className="text-2xl font-black text-indigo-700">{allFollowUps.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Post-meeting resolutions</p>
        </div>
        <div className="bg-white p-3.5 border border-gray-200 shadow-xs">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Format Modes</span>
          <span className="text-sm font-black text-purple-700 block mt-1">In-Person & Online</span>
          <p className="text-[10px] text-gray-400">Campus Hall & Google Meet</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-gray-100 p-0.5 border border-gray-200 shadow-2xs">
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
            activeTab === 'meetings'
              ? 'bg-white text-indigo-700 font-black shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Scheduled Conferences ({meetings.length})
        </button>
        <button
          onClick={() => setActiveTab('followups')}
          className={`flex-1 sm:flex-none px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
            activeTab === 'followups'
              ? 'bg-white text-indigo-700 font-black shadow-2xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Action Items & Follow-ups ({allFollowUps.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center space-y-3 shadow-xs">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Loading PTM Schedules...
          </p>
        </div>
      ) : activeTab === 'meetings' ? (
        meetings.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center shadow-xs">
            <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-800">No Meetings Scheduled</h3>
            <p className="text-xs text-gray-400 mt-1">You can request a 1-on-1 consultation with the class teacher above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => {
              const dateStr = meeting.meetingDate 
                ? new Date(meeting.meetingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' })
                : 'Upcoming';

              const isOnline = meeting.mode === 'Online';
              const isCompleted = meeting.status === 'Completed';

              // Find if active child has a slot in roster
              const rosterEntry = meeting.roster?.find(
                r => r.name?.toLowerCase().includes('aarav') || (r.studentId && r.studentId === activeChild)
              );

              return (
                <div 
                  key={meeting._id}
                  className={`bg-white border p-5 shadow-xs transition-all ${
                    isCompleted ? 'border-gray-200 bg-gray-50/30' : 'border-indigo-200 ring-1 ring-indigo-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider border rounded-none ${
                          isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {meeting.mode || 'In person'}
                        </span>
                        <span className={`px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider border rounded-none ${
                          isCompleted ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {meeting.status}
                        </span>
                        {meeting.scope && (
                          <span className="text-[10px] text-gray-400 font-semibold">
                            Scope: {meeting.scope}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-gray-900 leading-snug">
                        {meeting.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {meeting.description}
                      </p>
                    </div>

                    {isOnline && meeting.meetingLink && !isCompleted && (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-none transition-colors shadow-2xs flex-shrink-0"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Google Meet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Timing & Venue Badges */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-3 border-t border-gray-100 font-medium">
                    <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{meeting.startTime} - {meeting.endTime}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{meeting.venue || 'Campus Auditorium'}</span>
                    </span>
                  </div>

                  {/* Candidate Specific Slot & Teacher Feedback */}
                  {rosterEntry && (
                    <div className="mt-3.5 p-3 bg-indigo-50/70 border border-indigo-200 text-xs space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          Allocated Slot for {studentName}: <strong className="font-mono">{rosterEntry.slot}</strong>
                        </span>
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5">
                          Status: {rosterEntry.attendance}
                        </span>
                      </div>
                      {rosterEntry.remarks && (
                        <p className="text-[11px] text-gray-700 italic pt-1">
                          Teacher Feedback: "{rosterEntry.remarks}"
                        </p>
                      )}
                      {rosterEntry.tags && rosterEntry.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          {rosterEntry.tags.map((t, i) => (
                            <span key={i} className="text-[9.5px] font-bold text-indigo-700 bg-white border border-indigo-200 px-1.5 py-0.2">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Action Items & Follow-ups Tab */
        allFollowUps.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-800">No Action Items Logged</h3>
            <p className="text-xs text-gray-400 mt-1">All PTM commitments and tasks are up to date.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-800">
                PTM Post-Conference Action Plans
              </span>
              <span className="text-[11px] font-bold text-gray-500">
                Total Tasks: {allFollowUps.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead className="bg-gray-100/70 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4 w-[25%]">Student & Conference</th>
                    <th className="py-2.5 px-4 w-[35%]">Resolution / Action Plan</th>
                    <th className="py-2.5 px-4 w-[15%]">Assignee</th>
                    <th className="py-2.5 px-4 text-center w-[12%]">Target Due</th>
                    <th className="py-2.5 px-4 text-center w-[13%]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {allFollowUps.map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-gray-900 block font-bold">{item.student}</strong>
                        <span className="text-[10px] text-gray-400 truncate block">{item.meetingTitle}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 leading-snug">
                        {item.actionPlan}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-semibold">
                        {item.assignee || 'Class Teacher'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px] font-bold text-gray-700">
                        {item.due || 'Immediate'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-none border ${
                          item.status === 'Done' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : item.status === 'In Progress' 
                              ? 'bg-amber-50 text-amber-800 border-amber-200' 
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {item.status || 'Open'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Request 1-on-1 Consultation Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-none border border-gray-200 shadow-xl max-w-md w-full p-5 space-y-4">
            
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  Parent Consultation Request
                </span>
                <h3 className="text-base font-black text-gray-900 leading-tight mt-0.5">
                  Book 1-on-1 Academic Review
                </h3>
              </div>
              <button 
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Student:</label>
                <input
                  type="text"
                  disabled
                  value={`${studentName} • ${studentClass}`}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-none text-gray-700 font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Preferred Faculty / Mentor:</label>
                <select
                  value={teacherSelected}
                  onChange={(e) => setTeacherSelected(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-xs font-semibold"
                >
                  <option value="Class Teacher (Mrs. Anjali Rao)">Class Teacher (Mrs. Anjali Rao)</option>
                  <option value="Mathematics Mentor (Priya Singh)">Mathematics Mentor (Priya Singh)</option>
                  <option value="General Science Lead (Rahul Verma)">General Science Lead (Rahul Verma)</option>
                  <option value="School Counselor & Psychologist">School Counselor & Psychologist</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Preferred Date:</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Preferred Time:</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-xs font-mono"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Interaction Format:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredMode('In person')}
                    className={`py-2 px-3 border text-xs font-bold uppercase tracking-wider rounded-none transition-colors ${
                      preferredMode === 'In person'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-black'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    Campus In-Person
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredMode('Online')}
                    className={`py-2 px-3 border text-xs font-bold uppercase tracking-wider rounded-none transition-colors ${
                      preferredMode === 'Online'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-black'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    Google Meet Video
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Agenda / Discussion Points:</label>
                <textarea
                  rows={2}
                  required
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="e.g. Review mid-term performance in math and study habits..."
                  className="w-full p-2 border border-gray-300 rounded-none focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider text-[11px] shadow-sm flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>{submitting ? 'Submitting...' : 'Send Request'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

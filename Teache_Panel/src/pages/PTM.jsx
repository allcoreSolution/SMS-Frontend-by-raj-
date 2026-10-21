import React, { useState, useEffect } from 'react';
import { 
  Handshake, Calendar, Video, Clock, 
  LayoutDashboard, ClipboardCheck, PhoneCall, BookOpen, 
  Search, Plus, CheckCircle, XCircle, FileText, 
  ChevronRight, User, MessageSquare, Phone, X, RefreshCw, Trash2, Edit3, ExternalLink
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ptmService } from '../api/ptmService';

const tabs = [
  { name: 'PTM Dashboard', icon: LayoutDashboard, route: '/ptm-dashboard' },
  { name: 'Attendance & Remarks', icon: ClipboardCheck, route: '/ptm-attendance' },
  { name: 'Follow-ups', icon: PhoneCall, route: '/ptm-followups' },
  { name: 'PTM Guide', icon: BookOpen, route: '/ptm-guide' },
];

const PTM = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [activeTab, setActiveTab] = useState('PTM Dashboard');
  const [search, setSearch] = useState('');
  
  // Selected meeting for attendance/remarks tab
  const [selectedMeetingId, setSelectedMeetingId] = useState('');
  
  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  
  const [form, setForm] = useState({
    title: 'Parent-Teacher Meeting',
    student: 'Aarav Sharma',
    guardianName: 'Mr. Rajesh Sharma',
    phone: '+91 98765 43210',
    className: 'Class 10',
    meetingDate: new Date().toISOString().slice(0, 10),
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    mode: 'In person',
    venue: 'Room 204 (Main Academic Wing)',
    meetingLink: '',
    description: 'Academic progress discussion and term exam review.'
  });

  const [followupForm, setFollowupForm] = useState({
    student: '',
    actionPlan: '',
    assignee: 'Class Teacher',
    due: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    priority: 'Medium'
  });

  useEffect(() => {
    const currentTab = tabs.find(t => location.pathname.includes(t.route));
    if (currentTab) setActiveTab(currentTab.name);
  }, [location]);

  useEffect(() => {
    loadMeetings();
    loadFollowups();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const res = await ptmService.getMeetings();
      const list = res?.data || [];
      setMeetings(list);
      if (list.length > 0 && !selectedMeetingId) {
        setSelectedMeetingId(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load PTM meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowups = async () => {
    try {
      const res = await ptmService.getFollowUps();
      setFollowups(res?.data || []);
    } catch (err) {
      console.error('Failed to load PTM followups:', err);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    navigate(tab.route);
  };

  // Schedule New Meeting
  const handleSchedulePTM = async () => {
    try {
      if (!form.student || !form.meetingDate) {
        Swal.fire({ icon: 'warning', title: 'Required Fields', text: 'Please fill student and meeting date.' });
        return;
      }

      const payload = {
        title: form.title || `PTM — ${form.student}`,
        className: form.className,
        meetingDate: form.meetingDate,
        startTime: form.startTime,
        endTime: form.endTime,
        mode: form.mode,
        venue: form.venue,
        meetingLink: form.mode === 'Online' ? (form.meetingLink || 'https://meet.google.com/sch-ptm-call') : '',
        description: form.description,
        status: 'Scheduled',
        roster: [
          {
            name: form.student,
            guardianName: form.guardianName,
            phone: form.phone,
            className: form.className,
            slot: `${form.startTime} - ${form.endTime}`,
            notified: 'Dispatched SMS/Email',
            attendance: 'Pending',
            remarks: form.description
          }
        ]
      };

      await ptmService.createMeeting(payload);
      setShowScheduleModal(false);
      Swal.fire({
        title: 'Meeting Scheduled!',
        text: `PTM with parent of ${form.student} has been created and saved in MongoDB.`,
        icon: 'success',
        confirmButtonColor: '#e11d48'
      });
      loadMeetings();
    } catch (err) {
      console.error('Error creating PTM:', err);
      Swal.fire({ icon: 'error', title: 'Failed to Schedule', text: err?.message || 'Server error' });
    }
  };

  // Delete Meeting
  const handleDeleteMeeting = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this PTM record?',
      text: 'This will remove the meeting and attendance roster permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#e11d48'
    });
    if (confirm.isConfirmed) {
      try {
        await ptmService.deleteMeeting(id);
        Swal.fire({ icon: 'success', title: 'Deleted', text: 'Meeting removed.', timer: 1200, showConfirmButton: false });
        loadMeetings();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Delete Failed', text: err.message });
      }
    }
  };

  // Copy Link
  const handleCopyLink = (link) => {
    const url = link || 'https://meet.google.com/sch-ptm-call';
    navigator.clipboard.writeText(url);
    Swal.fire({
      title: 'Link Copied',
      text: `Meeting link ${url} copied to clipboard.`,
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Approve Meeting
  const handleApprove = async (id) => {
    try {
      await ptmService.updateMeeting(id, { status: 'Scheduled' });
      Swal.fire({
        title: 'Meeting Confirmed!',
        text: 'The meeting status is now officially scheduled with parent notification.',
        icon: 'success',
        confirmButtonColor: '#059669'
      });
      loadMeetings();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Update Failed', text: err.message });
    }
  };

  // Start Session
  const handleStartSession = async (meeting) => {
    if (meeting.mode === 'Online' && meeting.meetingLink) {
      window.open(meeting.meetingLink, '_blank');
    }
    Swal.fire({
      title: 'Session Started',
      text: `Meeting session for ${meeting.title} is now active.`,
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    });
    try {
      await ptmService.updateMeeting(meeting._id, { status: 'Completed' });
      loadMeetings();
    } catch (e) {
      console.warn(e);
    }
  };

  // Update Roster Attendee Attendance
  const handleAttendanceChange = async (meetingId, attendeeId, newStatus) => {
    try {
      await ptmService.updateAttendee(meetingId, attendeeId, { attendance: newStatus });
      setMeetings(prev => prev.map(m => {
        if (m._id !== meetingId) return m;
        return {
          ...m,
          roster: m.roster?.map(r => r._id === attendeeId ? { ...r, attendance: newStatus } : r)
        };
      }));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to record attendance', text: err.message });
    }
  };

  // Save Attendee Remarks
  const handleSaveRemarks = async (meetingId, attendeeId, remarks) => {
    try {
      await ptmService.updateAttendee(meetingId, attendeeId, { remarks });
      Swal.fire({ icon: 'success', title: 'Remarks Saved', text: 'Teacher feedback recorded.', timer: 1000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
    }
  };

  // Add Follow-up
  const handleCreateFollowup = async () => {
    if (!followupForm.student || !followupForm.actionPlan) {
      Swal.fire({ icon: 'warning', title: 'Missing fields', text: 'Please enter student and action plan.' });
      return;
    }
    try {
      await ptmService.addFollowUp(followupForm);
      setShowFollowupModal(false);
      Swal.fire({ icon: 'success', title: 'Follow-up Scheduled', text: 'Action item created.', timer: 1500, showConfirmButton: false });
      loadFollowups();
      setFollowupForm({ student: '', actionPlan: '', assignee: 'Class Teacher', due: '', priority: 'Medium' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
    }
  };

  // Log Phone Call
  const handleLogFollowupCall = (parent) => {
    Swal.fire({
      title: 'Log Parent Call',
      text: `Record parent consultation call with ${parent}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, log call'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Logged!',
          text: 'Call successfully logged into School CRM.',
          icon: 'success',
          confirmButtonColor: '#059669'
        });
      }
    });
  };

  // --------------------------------------------------------------------------
  // TAB 1: PTM DASHBOARD
  // --------------------------------------------------------------------------
  const renderDashboard = () => {
    const filteredMeetings = meetings.filter(m => {
      const q = search.toLowerCase();
      const titleMatch = m.title?.toLowerCase().includes(q);
      const studentMatch = m.roster?.some(r => r.name?.toLowerCase().includes(q) || r.guardianName?.toLowerCase().includes(q));
      return titleMatch || studentMatch;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student, parent or meeting..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border-2 border-gray-300 text-[13px] font-bold w-72 rounded-none focus:outline-none focus:border-rose-500 bg-white"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={loadMeetings}
              className="px-3 py-2 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-black px-5 py-2 flex items-center gap-2 text-[12px] uppercase tracking-wider rounded-none shadow-sm transition-all cursor-pointer border border-rose-800"
            >
              <Plus className="w-4 h-4" /> Schedule PTM
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
            Loading parent-teacher meetings from database...
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="bg-white p-12 text-center border-2 border-dashed border-gray-300">
            <Handshake className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-bold text-gray-700 text-sm">No PTM meetings found</p>
            <p className="text-gray-400 text-xs mt-1">Click "Schedule PTM" to schedule an in-person or virtual conference.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredMeetings.map(m => {
              const studentName = m.roster?.[0]?.name || m.title;
              const guardianName = m.roster?.[0]?.guardianName || 'Parent';
              const meetingDateStr = m.meetingDate ? new Date(m.meetingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD';

              return (
                <div key={m._id} className="bg-white border-2 border-gray-300 shadow-sm p-0 rounded-none flex flex-col hover:border-rose-400 transition-colors">
                  <div className="p-5 flex-1 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-[16px] font-black text-gray-800 leading-tight">{m.title}</h3>
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                          {studentName} • {guardianName}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border rounded-none shadow-sm ${
                        m.status === 'Scheduled' ? 'bg-green-100 text-green-700 border-green-300' :
                        m.status === 'Completed' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                      }`}>{m.status}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[13px] font-bold text-gray-600">
                        <div className="w-6 h-6 flex items-center justify-center bg-gray-100 border border-gray-200"><Calendar className="w-3 h-3 text-gray-500"/></div>
                        {meetingDateStr} ({m.startTime || '10:00 AM'} - {m.endTime || '10:30 AM'})
                      </div>
                      <div className="flex items-center gap-3 text-[13px] font-bold text-gray-600">
                        <div className="w-6 h-6 flex items-center justify-center bg-gray-100 border border-gray-200">
                          {m.mode === 'Online' ? <Video className="w-3 h-3 text-rose-500" /> : <Clock className="w-3 h-3 text-gray-500"/>}
                        </div>
                        Mode: <span className="font-extrabold text-gray-800">{m.mode}</span> — {m.venue || 'School Campus'}
                      </div>
                      {m.description && (
                        <div className="flex items-start gap-3 text-[13px] font-bold text-gray-600">
                          <div className="w-6 h-6 flex items-center justify-center bg-gray-100 border border-gray-200"><MessageSquare className="w-3 h-3 text-gray-500"/></div>
                          <span className="mt-0.5">Agenda: {m.description}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {m.mode === 'Online' && (
                        <>
                          <button 
                            onClick={() => handleCopyLink(m.meetingLink)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Copy Meet Link
                          </button>
                          <button 
                            onClick={() => handleStartSession(m)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                          >
                            Join Video Call
                          </button>
                        </>
                      )}
                      {m.status !== 'Scheduled' && m.status !== 'Completed' && (
                        <button 
                          onClick={() => handleApprove(m._id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Confirm & Notify
                        </button>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDeleteMeeting(m._id)}
                      className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Delete meeting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // TAB 2: ATTENDANCE & REMARKS
  // --------------------------------------------------------------------------
  const renderAttendance = () => {
    const currentMeeting = meetings.find(m => m._id === selectedMeetingId) || meetings[0];
    const roster = currentMeeting?.roster || [];

    return (
      <div className="space-y-6">
        <div className="bg-white p-5 border-2 border-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Select Conference</label>
            <select 
              value={selectedMeetingId} 
              onChange={e => setSelectedMeetingId(e.target.value)}
              className="border-2 border-gray-300 px-3 py-2 text-xs font-bold bg-white outline-none focus:border-rose-500 min-w-[280px]"
            >
              {meetings.map(m => (
                <option key={m._id} value={m._id}>{m.title} ({m.className || 'General'})</option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Roster Attendance Status:</span>
            <div className="flex gap-2 mt-1">
              <span className="bg-green-100 text-green-800 text-[11px] font-bold px-2 py-0.5 border border-green-300">
                Present: {roster.filter(r => r.attendance === 'Present').length}
              </span>
              <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2 py-0.5 border border-red-300">
                Absent: {roster.filter(r => r.attendance === 'Absent').length}
              </span>
              <span className="bg-gray-100 text-gray-800 text-[11px] font-bold px-2 py-0.5 border border-gray-300">
                Pending: {roster.filter(r => r.attendance === 'Pending').length}
              </span>
            </div>
          </div>
        </div>

        {/* Roster Table */}
        <div className="bg-white border-2 border-gray-300 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 border-b-2 border-gray-300 text-gray-700 font-black uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5">Student / Roll</th>
                <th className="p-3.5">Guardian & Contact</th>
                <th className="p-3.5">Slot Time</th>
                <th className="p-3.5">Attendance</th>
                <th className="p-3.5">Teacher Observation Remarks</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roster.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No student attendees listed for this meeting.
                  </td>
                </tr>
              ) : (
                roster.map(att => (
                  <tr key={att._id} className="hover:bg-gray-50/80">
                    <td className="p-3.5 font-bold text-gray-900">
                      <div>{att.name}</div>
                      <div className="text-[11px] text-gray-400 font-normal">Roll: {att.roll || 'N/A'} • {att.className}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-gray-800">{att.guardianName}</div>
                      <div className="text-gray-400 text-[11px]">{att.phone}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-gray-600">{att.slot}</td>
                    <td className="p-3.5">
                      <div className="flex gap-1">
                        {['Present', 'Absent', 'Pending'].map(st => (
                          <button
                            key={st}
                            onClick={() => handleAttendanceChange(currentMeeting._id, att._id, st)}
                            className={`px-2 py-1 text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              att.attendance === st 
                                ? (st === 'Present' ? 'bg-green-600 text-white' : st === 'Absent' ? 'bg-red-600 text-white' : 'bg-gray-700 text-white')
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <input 
                        type="text"
                        defaultValue={att.remarks}
                        onBlur={e => handleSaveRemarks(currentMeeting._id, att._id, e.target.value)}
                        placeholder="Click to type and record feedback..."
                        className="w-full p-1.5 border border-gray-300 text-xs rounded-none bg-white focus:border-rose-500 outline-none"
                      />
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
                        onClick={() => handleLogFollowupCall(att.guardianName)}
                        className="text-rose-600 hover:underline font-bold text-[11px] cursor-pointer"
                      >
                        Log Call
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // TAB 3: FOLLOW-UPS
  // --------------------------------------------------------------------------
  const renderFollowups = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-gray-900 text-base uppercase tracking-tight">Active Academic Follow-up Tickets</h3>
        <button
          onClick={() => setShowFollowupModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Action Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followups.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white border border-dashed border-gray-300 text-gray-400">
            No active follow-ups. All PTM commitments are resolved!
          </div>
        ) : (
          followups.map((fp, i) => (
            <div key={fp._id || i} className="bg-white p-5 border-2 border-gray-300 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 text-sm">{fp.student}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border ${
                    fp.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {fp.priority} Priority
                  </span>
                </div>
                <p className="text-gray-700 text-xs font-medium leading-relaxed">{fp.actionPlan}</p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Assignee: <strong>{fp.assignee}</strong></span>
                  <span>Due: <strong>{fp.due || 'Upcoming'}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  Status: {fp.status}
                </span>
                <button
                  onClick={() => handleLogFollowupCall(fp.student)}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Call Parent
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // TAB 4: GUIDE
  // --------------------------------------------------------------------------
  const renderGuide = () => (
    <div className="bg-white border-2 border-gray-300 p-8 space-y-6">
      <h2 className="text-[18px] font-black text-gray-900 border-b-2 border-gray-100 pb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-rose-500"/> Guidelines for Effective Parent-Teacher Meetings
      </h2>
      <div className="space-y-4 text-xs text-gray-700 leading-relaxed font-medium">
        <p><strong>1. Preparation is Key:</strong> Always review the student's academic and holistic progress cards prior to the meeting. Keep specific examples of work ready.</p>
        <p><strong>2. The 'Sandwich' Feedback Method:</strong> Start with positive remarks, discuss areas of improvement critically but respectfully, and end with an actionable, positive note.</p>
        <p><strong>3. Time Management:</strong> Stick to the allocated 15-minute slot per parent. If a discussion requires more time, schedule a follow-up via the Follow-ups tab.</p>
        <p><strong>4. Active Listening:</strong> Listen to parental concerns without interruption. Often, behavioral traits observed at home co-relate with classroom activities.</p>
        <p><strong>5. Digital Record Keeping:</strong> Always record attendance in the Attendance & Remarks tab and enter meaningful teacher observations for the official school record.</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 theme-app-bg text-sm">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-rose-600 text-white flex items-center justify-center rounded-none shadow-sm">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-black text-gray-800 tracking-tight">Parent-Teacher Meetings</h1>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Virtual & In-Person Conference Manager</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="px-6 bg-white border-b border-gray-300 flex overflow-x-auto hide-scrollbar">
        {tabs.map(t => {
          const isActive = activeTab === t.name;
          return (
            <button 
              key={t.name}
              onClick={() => handleTabClick(t)}
              className={`flex items-center gap-2 px-5 py-4 font-black text-[12px] uppercase tracking-wider whitespace-nowrap transition-colors border-b-[3px] cursor-pointer 
              ${isActive 
                  ? 'text-rose-700 border-rose-600 bg-rose-50/50' 
                  : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {React.createElement(t.icon, { className: `w-4 h-4 ${isActive ? 'text-rose-600' : 'text-gray-400'}` })}
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Main Body */}
      <div className="p-7 max-w-7xl mx-auto min-h-[500px]">
        {activeTab === 'PTM Dashboard' && renderDashboard()}
        {activeTab === 'Attendance & Remarks' && renderAttendance()}
        {activeTab === 'Follow-ups' && renderFollowups()}
        {activeTab === 'PTM Guide' && renderGuide()}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in p-4" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white w-full max-w-lg shadow-2xl rounded-none border border-gray-300" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[15px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" /> Schedule Parent Conference
              </h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-red-500 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Meeting Title</label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })} 
                  className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Student Name</label>
                  <input 
                    type="text" 
                    value={form.student} 
                    onChange={e => setForm({ ...form, student: e.target.value })} 
                    className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Class</label>
                  <input 
                    type="text" 
                    value={form.className} 
                    onChange={e => setForm({ ...form, className: e.target.value })} 
                    className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Guardian Name</label>
                  <input 
                    type="text" 
                    value={form.guardianName} 
                    onChange={e => setForm({ ...form, guardianName: e.target.value })} 
                    className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Parent Phone</label>
                  <input 
                    type="text" 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                    className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Date</label>
                  <input type="date" value={form.meetingDate} onChange={e => setForm({...form, meetingDate: e.target.value})} className="w-full border-2 border-gray-300 px-2 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"/>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Start Time</label>
                  <input type="text" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} placeholder="10:00 AM" className="w-full border-2 border-gray-300 px-2 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"/>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">End Time</label>
                  <input type="text" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} placeholder="10:30 AM" className="w-full border-2 border-gray-300 px-2 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Meeting Mode</label>
                  <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white">
                    <option value="In person">In person (Campus)</option>
                    <option value="Online">Online (Google Meet)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Venue / Room</label>
                  <input type="text" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"/>
                </div>
              </div>

              {form.mode === 'Online' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Google Meet Link</label>
                  <input type="text" value={form.meetingLink} onChange={e => setForm({...form, meetingLink: e.target.value})} placeholder="https://meet.google.com/abc-xyz" className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"/>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Meeting Agenda & Notes</label>
                <textarea rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"></textarea>
              </div>
            </div>

            <div className="flex gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-row-reverse">
              <button onClick={handleSchedulePTM} className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 font-black uppercase text-[11px] tracking-widest shadow-sm rounded-none border border-rose-800 cursor-pointer">
                Confirm & Save
              </button>
              <button onClick={() => setShowScheduleModal(false)} className="bg-white border-2 border-gray-300 px-5 py-2.5 font-black uppercase text-[11px] tracking-widest text-gray-700 hover:bg-gray-100 rounded-none cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Follow-up Modal */}
      {showFollowupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in p-4" onClick={() => setShowFollowupModal(false)}>
          <div className="bg-white w-full max-w-md shadow-2xl rounded-none border border-gray-300" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[15px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-600" /> New Action Follow-up
              </h2>
              <button onClick={() => setShowFollowupModal(false)} className="text-gray-400 hover:text-red-500 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Student Name</label>
                <input 
                  type="text" 
                  value={followupForm.student} 
                  onChange={e => setFollowupForm({ ...followupForm, student: e.target.value })} 
                  placeholder="e.g. Aarav Sharma"
                  className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Action Plan / Commitment</label>
                <textarea 
                  rows="3" 
                  value={followupForm.actionPlan} 
                  onChange={e => setFollowupForm({ ...followupForm, actionPlan: e.target.value })} 
                  placeholder="e.g. Schedule extra revision class for physics numericals"
                  className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Priority</label>
                  <select 
                    value={followupForm.priority} 
                    onChange={e => setFollowupForm({ ...followupForm, priority: e.target.value })}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Target Due Date</label>
                  <input 
                    type="date" 
                    value={followupForm.due} 
                    onChange={e => setFollowupForm({ ...followupForm, due: e.target.value })} 
                    className="w-full border-2 border-gray-300 px-3 py-2 text-xs font-bold focus:border-rose-500 outline-none rounded-none bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-row-reverse">
              <button onClick={handleCreateFollowup} className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 font-black uppercase text-[11px] tracking-widest shadow-sm rounded-none border border-rose-800 cursor-pointer">
                Save Follow-up
              </button>
              <button onClick={() => setShowFollowupModal(false)} className="bg-white border-2 border-gray-300 px-5 py-2.5 font-black uppercase text-[11px] tracking-widest text-gray-700 hover:bg-gray-100 rounded-none cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PTM;

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Handshake, Info, Users, Clock, Edit, 
  RefreshCw, Send, CheckCircle2, XCircle, HelpCircle, 
  MessageSquare, Search, Filter, Check, X, Download, Share2, 
  Plus, Tag, AlertCircle, PhoneCall, Video, MapPin, Printer
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PTMNavHeader from './PTMNavHeader';
import ptmService from '../../api/ptmService';

export default function PTMDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('All');

  // Remark Modal
  const [activeStudent, setActiveStudent] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [slotText, setSlotText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [createFollowUp, setCreateFollowUp] = useState(false);
  const [followUpPlan, setFollowUpPlan] = useState('');

  // Send Invitations Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [sendingInvites, setSendingInvites] = useState(false);

  // Edit Meeting Modal
  const [showEditMeeting, setShowEditMeeting] = useState(false);
  const [editMeetingForm, setEditMeetingForm] = useState({
    title: '',
    meetingDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    mode: '',
    status: '',
    description: '',
  });

  const availableTags = [
    'Top Performer', 'Needs Math Help', 'Active Speaker', 
    'Good Conduct', 'Irregular Homework', 'Reading Practice', 'Creative Arts'
  ];

  useEffect(() => {
    loadMeeting();
  }, [id]);

  const loadMeeting = async () => {
    setLoading(true);
    try {
      const data = await ptmService.getMeetingById(id);
      setMeeting(data);
    } catch (err) {
      console.error('Failed to load meeting details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (studentId, newStatus) => {
    if (!meeting) return;
    try {
      await ptmService.updateAttendee(meeting.id, studentId, { attendance: newStatus });
      // Update local state smoothly
      setMeeting(prev => ({
        ...prev,
        roster: prev.roster.map(s => s.id === studentId ? { ...s, attendance: newStatus } : s)
      }));
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  const handleBulkAttendance = async (status) => {
    if (!meeting) return;
    try {
      await ptmService.recordBulkAttendance(meeting.id, status);
      setMeeting(prev => ({
        ...prev,
        roster: prev.roster.map(s => ({ ...s, attendance: status }))
      }));
    } catch (err) {
      console.error('Bulk attendance update failed:', err);
    }
  };

  const openRemarkModal = (student) => {
    setActiveStudent(student);
    setRemarkText(student.remarks || '');
    setSlotText(student.slot === '--' ? '' : (student.slot || ''));
    setSelectedTags(student.tags || []);
    setCreateFollowUp(student.followUpNeeded || false);
    setFollowUpPlan(student.remarks ? `Follow-up on: ${student.remarks.slice(0, 40)}...` : '');
  };

  const handleSaveRemark = async () => {
    if (!meeting || !activeStudent) return;
    try {
      await ptmService.updateAttendee(meeting.id, activeStudent.id, {
        remarks: remarkText,
        slot: slotText || '--',
        tags: selectedTags,
        followUpNeeded: createFollowUp
      });

      // If follow-up requested, create in followups table
      if (createFollowUp && followUpPlan.trim()) {
        await ptmService.createFollowUp({
          student: activeStudent.name,
          meetingId: meeting.id,
          meeting: meeting.title,
          actionPlan: followUpPlan,
          assignee: 'Class Teacher',
          due: meeting.meetingDate,
          priority: 'Medium',
          status: 'Open'
        });
      }

      setMeeting(prev => ({
        ...prev,
        roster: prev.roster.map(s => s.id === activeStudent.id ? {
          ...s,
          remarks: remarkText,
          slot: slotText || '--',
          tags: selectedTags,
          followUpNeeded: createFollowUp
        } : s)
      }));

      setActiveStudent(null);
    } catch (err) {
      console.error('Failed to save remark:', err);
      alert('Failed to save remark.');
    }
  };

  const handleSendInvitations = async () => {
    setSendingInvites(true);
    try {
      await ptmService.sendInvitations(meeting.id);
      setMeeting(prev => ({
        ...prev,
        status: 'Notified',
        roster: prev.roster.map(s => ({ ...s, notified: 'Sent (WhatsApp)' }))
      }));
      setShowInviteModal(false);
      alert(`Invitations dispatched to ${meeting.roster?.length || 0} guardians via WhatsApp/SMS gateway.`);
    } catch (err) {
      console.error(err);
      alert('Failed to send invitations.');
    } finally {
      setSendingInvites(false);
    }
  };

  const handleRefreshRoster = async () => {
    try {
      const refreshed = await ptmService.refreshRoster(meeting.id);
      if (refreshed) {
        setMeeting(refreshed);
        alert('Student directory synchronized! Roster is up to date.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditMeetingModal = () => {
    setEditMeetingForm({
      title: meeting.title || '',
      meetingDate: meeting.meetingDate || '',
      startTime: meeting.startTime || '',
      endTime: meeting.endTime || '',
      venue: meeting.venue || '',
      mode: meeting.mode || 'In person',
      status: meeting.status || 'Scheduled',
      description: meeting.description || '',
    });
    setShowEditMeeting(true);
  };

  const handleSaveMeetingEdits = async () => {
    try {
      const updated = await ptmService.updateMeeting(meeting.id, editMeetingForm);
      if (updated) {
        setMeeting(prev => ({ ...prev, ...updated }));
        setShowEditMeeting(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] font-sans pb-10">
        <PTMNavHeader />
        <div className="p-12 text-center text-slate-400">Loading meeting attendee details...</div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-[#f8fafc] font-sans pb-10">
        <PTMNavHeader />
        <div className="p-12 text-center text-slate-500">
          <p className="text-base font-bold text-slate-700">Meeting session not found.</p>
          <button 
            onClick={() => navigate('/ptm/attendance')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Back to Attendance Directory
          </button>
        </div>
      </div>
    );
  }

  // Filter roster
  const roster = meeting.roster || [];
  const filteredRoster = roster.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.roll && s.roll.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.phone && s.phone.includes(searchQuery));
    
    if (attendanceFilter === 'All') return matchesSearch;
    if (attendanceFilter === 'Present') return matchesSearch && s.attendance === 'Present';
    if (attendanceFilter === 'Absent') return matchesSearch && s.attendance === 'Absent';
    if (attendanceFilter === 'Pending') return matchesSearch && s.attendance === 'Pending';
    if (attendanceFilter === 'Remarked') return matchesSearch && s.remarks && s.remarks.trim().length > 0;
    return matchesSearch;
  });

  // Calculate live counts
  const totalInvited = roster.length;
  const presentCount = roster.filter(s => s.attendance === 'Present').length;
  const absentCount = roster.filter(s => s.attendance === 'Absent').length;
  const pendingCount = roster.filter(s => s.attendance === 'Pending').length;
  const remarkedCount = roster.filter(s => s.remarks && s.remarks.trim().length > 0).length;
  const followUpCount = roster.filter(s => s.followUpNeeded).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <PTMNavHeader />

      {/* Top Breadcrumb & Action Banner */}
      <div className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button 
                onClick={() => navigate('/ptm/attendance')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Sessions
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-700">Guardian Roster</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{meeting.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                {meeting.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> {meeting.meetingDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {meeting.startTime} — {meeting.endTime}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> {meeting.scope || 'Whole school'}
              </span>
              <span className="flex items-center gap-1">
                {meeting.mode === 'Online' ? <Video className="w-3.5 h-3.5 text-purple-600" /> : <MapPin className="w-3.5 h-3.5 text-slate-400" />}
                {meeting.mode} {meeting.venue ? `(${meeting.venue})` : ''}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={openEditMeetingModal}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" /> Edit Info
            </button>
            <button 
              onClick={handleRefreshRoster}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Sync Roster
            </button>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Send Invitations
            </button>
            <button 
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Sheet
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Description Banner if exists */}
        {meeting.description && (
          <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              <span className="font-bold">Meeting Agenda:</span> {meeting.description}
            </p>
          </div>
        )}

        {/* Live Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-2xs">
            <div className="flex justify-center mb-1"><Users className="w-5 h-5 text-blue-600" /></div>
            <div className="text-2xl font-extrabold text-slate-900">{totalInvited}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Invited</div>
          </div>

          <div className="bg-white border border-emerald-200 bg-emerald-50/20 rounded-2xl p-4 text-center shadow-2xs">
            <div className="flex justify-center mb-1"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
            <div className="text-2xl font-extrabold text-emerald-600">{presentCount}</div>
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Present</div>
          </div>

          <div className="bg-white border border-rose-200 bg-rose-50/20 rounded-2xl p-4 text-center shadow-2xs">
            <div className="flex justify-center mb-1"><XCircle className="w-5 h-5 text-rose-500" /></div>
            <div className="text-2xl font-extrabold text-rose-600">{absentCount}</div>
            <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Absent</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-2xs">
            <div className="flex justify-center mb-1"><Clock className="w-5 h-5 text-slate-400" /></div>
            <div className="text-2xl font-extrabold text-slate-600">{pendingCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Marking</div>
          </div>

          <div className="bg-white border border-indigo-200 bg-indigo-50/20 rounded-2xl p-4 text-center shadow-2xs">
            <div className="flex justify-center mb-1"><MessageSquare className="w-5 h-5 text-indigo-600" /></div>
            <div className="text-2xl font-extrabold text-indigo-600">{remarkedCount}</div>
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Remarks Written</div>
          </div>

          <div className="bg-white border border-amber-200 bg-amber-50/20 rounded-2xl p-4 text-center shadow-2xs">
            <div className="flex justify-center mb-1"><AlertCircle className="w-5 h-5 text-amber-500" /></div>
            <div className="text-2xl font-extrabold text-amber-600">{followUpCount}</div>
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Action Plans</div>
          </div>
        </div>

        {/* Roster Controls & Search Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student by name, roll no, or phone..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Filter Pills */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['All', 'Present', 'Absent', 'Pending', 'Remarked'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setAttendanceFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    attendanceFilter === tab ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Bulk:</span>
            <button 
              onClick={() => handleBulkAttendance('Present')}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> All Present
            </button>
            <button 
              onClick={() => handleBulkAttendance('Absent')}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> All Absent
            </button>
            <button 
              onClick={() => handleBulkAttendance('Pending')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Guardian Roster Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3.5 w-12 text-center">#</th>
                  <th className="px-4 py-3.5">Student / Enrolment</th>
                  <th className="px-4 py-3.5">Guardian Contact</th>
                  <th className="px-4 py-3.5">Slot Time</th>
                  <th className="px-4 py-3.5">Notification</th>
                  <th className="px-4 py-3.5 text-center">Attendance</th>
                  <th className="px-4 py-3.5">Teacher Remark</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredRoster.length > 0 ? (
                  filteredRoster.map((s, index) => {
                    const isPresent = s.attendance === 'Present';
                    const isAbsent = s.attendance === 'Absent';
                    const isPending = s.attendance === 'Pending';

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 text-center text-slate-400 font-medium">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-slate-400">{s.roll} {s.className ? `· ${s.className}` : ''}</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{s.guardianName || 'Guardian'}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <PhoneCall className="w-3 h-3 text-slate-400" />
                            {s.phone}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-slate-600 font-medium">
                          {s.slot && s.slot !== '--' ? (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                              {s.slot}
                            </span>
                          ) : (
                            <span className="text-slate-400">--</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {s.notified?.includes('Sent') ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {s.notified}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Interactive Attendance Toggle Buttons */}
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleAttendanceChange(s.id, 'Present')}
                              title="Mark Present"
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                isPresent 
                                  ? 'bg-emerald-600 text-white shadow-2xs' 
                                  : 'text-slate-600 hover:text-emerald-700'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAttendanceChange(s.id, 'Absent')}
                              title="Mark Absent"
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                isAbsent 
                                  ? 'bg-rose-600 text-white shadow-2xs' 
                                  : 'text-slate-600 hover:text-rose-700'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAttendanceChange(s.id, 'Pending')}
                              title="Set Pending"
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                isPending 
                                  ? 'bg-slate-700 text-white shadow-2xs' 
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Pending
                            </button>
                          </div>
                        </td>

                        {/* Teacher Remark Preview */}
                        <td className="px-4 py-3 max-w-xs">
                          {s.remarks ? (
                            <div>
                              <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed">
                                {s.remarks}
                              </p>
                              {s.tags && s.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {s.tags.map(t => (
                                    <span key={t} className="px-1.5 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No remark added</span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => openRemarkModal(s)}
                            className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-600 text-blue-700 hover:text-white font-semibold text-xs transition-all flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>{s.remarks ? 'Edit Note' : 'Add Note'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Remark & Observation Modal */}
      {activeStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  PTM Remark: {activeStudent.name}
                </h3>
                <p className="text-xs text-slate-500">{activeStudent.roll} · Guardian: {activeStudent.guardianName}</p>
              </div>
              <button 
                onClick={() => setActiveStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Individual Consultation Slot
                </label>
                <input 
                  type="text" 
                  value={slotText}
                  onChange={(e) => setSlotText(e.target.value)}
                  placeholder="e.g. 10:15 AM - 10:30 AM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Remark */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teacher's Observation & Academic Feedback
                </label>
                <textarea 
                  rows="4"
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Note student performance, strengths, co-curricular highlights, or concerns discussed with the parent..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>

              {/* Quick Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Quick Evaluation Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSelectedTags(prev => 
                            isSelected ? prev.filter(t => t !== tag) : [...prev, tag]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-2xs' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Follow-up Checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="createFollowUpCheck"
                    checked={createFollowUp}
                    onChange={(e) => setCreateFollowUp(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded-md border-slate-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="createFollowUpCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Flag for teacher follow-up / action plan
                  </label>
                </div>

                {createFollowUp && (
                  <div>
                    <input 
                      type="text" 
                      value={followUpPlan}
                      onChange={(e) => setFollowUpPlan(e.target.value)}
                      placeholder="Specify follow-up action plan (e.g. weekly progress check)..."
                      className="w-full px-3 py-1.5 border border-amber-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
              <button 
                onClick={() => setActiveStudent(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveRemark}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Save Observation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Invitations Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Broadcast Guardian Invitations</h3>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 font-mono">
                <div className="text-[11px] font-bold text-slate-400 uppercase font-sans">Template Preview (WhatsApp / SMS):</div>
                <p>
                  "Dear Parent, Parent-Teacher Meeting for <span className="font-bold">{meeting.title}</span> is scheduled on <span className="font-bold">{meeting.meetingDate}</span> from {meeting.startTime} to {meeting.endTime}. Venue: {meeting.venue || 'Main Campus'}. Kindly attend to review student progress."
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 py-1">
                <span>Target Recipients:</span>
                <span className="font-bold text-slate-900">{roster.length} Registered Guardians</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 py-1 border-t border-slate-100">
                <span>Channel:</span>
                <span className="font-semibold text-emerald-600">WhatsApp Official Gateway (Fallback SMS)</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendInvitations}
                disabled={sendingInvites}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {sendingInvites ? 'Sending...' : 'Confirm & Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Meeting Details Modal */}
      {showEditMeeting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Edit Meeting Setup</h3>
              <button 
                onClick={() => setShowEditMeeting(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={editMeetingForm.title} 
                  onChange={(e) => setEditMeetingForm({ ...editMeetingForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={editMeetingForm.meetingDate} 
                    onChange={(e) => setEditMeetingForm({ ...editMeetingForm, meetingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={editMeetingForm.status} 
                    onChange={(e) => setEditMeetingForm({ ...editMeetingForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Notified">Notified</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                  <input 
                    type="text" 
                    value={editMeetingForm.startTime} 
                    onChange={(e) => setEditMeetingForm({ ...editMeetingForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                  <input 
                    type="text" 
                    value={editMeetingForm.endTime} 
                    onChange={(e) => setEditMeetingForm({ ...editMeetingForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
                <input 
                  type="text" 
                  value={editMeetingForm.venue} 
                  onChange={(e) => setEditMeetingForm({ ...editMeetingForm, venue: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Agenda / Description</label>
                <textarea 
                  rows="3"
                  value={editMeetingForm.description} 
                  onChange={(e) => setEditMeetingForm({ ...editMeetingForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-y" 
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
              <button 
                onClick={() => setShowEditMeeting(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveMeetingEdits}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

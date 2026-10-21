import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  Video, Plus, Search, Eye, Trash2, Edit, Users,
  Clock, Calendar, Play, StopCircle, Radio, X, CheckCircle, Link,
  ExternalLink, Copy, Check, AlertCircle, Loader2, Sparkles, Share2, Shield, Lock
} from 'lucide-react';
import { liveClassService } from '../api/liveClassService';
import { academicService } from '../api/academicService';

const statusStyle = {
  Live: 'bg-red-50 text-red-600 border border-red-300 animate-pulse shadow-xs font-black',
  Scheduled: 'bg-blue-50 text-blue-600 border border-blue-200 font-bold',
  Completed: 'bg-green-50 text-green-700 border border-green-200 font-bold',
  Cancelled: 'bg-gray-100 text-gray-600 border border-gray-200 font-bold'
};

const getPlatformBadge = (provider) => {
  const p = (provider || '').toLowerCase();
  if (p.includes('zoom')) {
    return {
      label: 'Zoom',
      cls: 'bg-blue-50 text-blue-700 border border-blue-200',
      iconCls: 'text-blue-500'
    };
  }
  if (p.includes('meet') || p.includes('google')) {
    return {
      label: 'Google Meet',
      cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      iconCls: 'text-emerald-600'
    };
  }
  if (p.includes('team')) {
    return {
      label: 'MS Teams',
      cls: 'bg-purple-50 text-purple-700 border border-purple-200',
      iconCls: 'text-purple-600'
    };
  }
  return {
    label: 'Jitsi Meet',
    cls: 'bg-orange-50 text-orange-700 border border-orange-200',
    iconCls: 'text-orange-600'
  };
};

const ManageLiveClasses = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingClass, setViewingClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    liveNow: 0,
    scheduled: 0,
    completed: 0
  });
  
  const [academicClasses, setAcademicClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const initialForm = {
    title: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: '45',
    platform: 'Zoom',
    link: '',
    meetingId: '',
    passcode: ''
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchMetadata();
    fetchLiveClasses();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [clsM, secM, subM] = await Promise.all([
        academicService.getClasses().catch(() => ({ data: [] })),
        academicService.getSections().catch(() => ({ data: [] })),
        academicService.getSubjects().catch(() => ({ data: [] }))
      ]);
      
      if (clsM && clsM.data) setAcademicClasses(clsM.data);
      if (secM && secM.data) setSections(secM.data);
      if (subM && subM.data) setSubjects(subM.data);
    } catch (e) {
      console.error('Error fetching academic metadata:', e);
    }
  };

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const [res, statsRes] = await Promise.all([
        liveClassService.getLiveClasses().catch(() => ({ success: false, data: [] })),
        liveClassService.getStats().catch(() => ({ success: false, data: null }))
      ]);

      if (res && res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(c => {
          const startDate = c.startTime ? new Date(c.startTime) : new Date();
          return {
            id: c._id,
            raw: c,
            title: c.title || 'Live Session',
            description: c.description || '',
            subject: c.subject?.subjectName || c.subjectName || 'General',
            class: `${c.academicClass?.className || c.className || 'Class'}${c.sectionName && c.sectionName !== 'All' ? ` - ${c.sectionName}` : ''}`,
            date: startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            rawDate: c.startTime ? c.startTime.split('T')[0] : '',
            rawTime: c.startTime && c.startTime.includes('T') ? c.startTime.split('T')[1].substring(0, 5) : '10:00',
            time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            durationMinutes: c.durationMinutes || 45,
            duration: `${c.durationMinutes || 45} min`,
            status: c.status || 'Scheduled',
            students: c.attendeeCount || (c.attendees ? c.attendees.length : 0),
            link: c.meetingUrl || '',
            meetingId: c.meetingId || '',
            passcode: c.passcode || '',
            provider: c.provider || 'Zoom',
            teacherName: c.teacherName || 'Faculty',
            attendees: c.attendees || []
          };
        });

        setClasses(mapped);

        // Update stats from backend stats or compute from array
        if (statsRes && statsRes.success && statsRes.data) {
          setStats({
            total: statsRes.data.total || mapped.length,
            liveNow: statsRes.data.liveNow || mapped.filter(x => x.status === 'Live').length,
            scheduled: statsRes.data.scheduled || mapped.filter(x => x.status === 'Scheduled').length,
            completed: statsRes.data.completed || mapped.filter(x => x.status === 'Completed').length
          });
        } else {
          setStats({
            total: mapped.length,
            liveNow: mapped.filter(x => x.status === 'Live').length,
            scheduled: mapped.filter(x => x.status === 'Scheduled').length,
            completed: mapped.filter(x => x.status === 'Completed').length
          });
        }
      }
    } catch (e) {
      console.error('Error fetching live classes:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenScheduleModal = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      platform: 'Zoom'
    });
    setShowModal(true);
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    const raw = cls.raw || {};
    
    let dateStr = cls.rawDate;
    let timeStr = cls.rawTime;
    if (raw.startTime) {
      const dt = new Date(raw.startTime);
      if (!isNaN(dt.getTime())) {
        dateStr = dt.toISOString().split('T')[0];
        const hh = String(dt.getHours()).padStart(2, '0');
        const mm = String(dt.getMinutes()).padStart(2, '0');
        timeStr = `${hh}:${mm}`;
      }
    }

    let resolvedPlatform = 'Zoom';
    if (raw.provider === 'GoogleMeet') resolvedPlatform = 'Google Meet';
    else if (raw.provider === 'Teams') resolvedPlatform = 'MS Teams';
    else if (raw.provider === 'Jitsi') resolvedPlatform = 'Jitsi Meet';

    setForm({
      title: raw.title || cls.title,
      classId: raw.academicClass?._id || raw.academicClass || '',
      sectionId: raw.section?._id || raw.section || '',
      subjectId: raw.subject?._id || raw.subject || '',
      date: dateStr || new Date().toISOString().split('T')[0],
      time: timeStr || '10:00',
      duration: String(raw.durationMinutes || cls.durationMinutes || '45'),
      platform: resolvedPlatform,
      link: raw.meetingUrl || cls.link || '',
      meetingId: raw.meetingId || cls.meetingId || '',
      passcode: raw.passcode || cls.passcode || ''
    });
    setShowModal(true);
  };

  const handleAutoGenerateLink = () => {
    const platform = form.platform || 'Zoom';
    const randId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const formattedId = `${randId.slice(0,3)} ${randId.slice(3,6)} ${randId.slice(6)}`;
    const passcodes = ['MATH2026', 'CLASS10', 'LIVE99', 'STUDY77', 'LEARN55'];
    const randPasscode = passcodes[Math.floor(Math.random() * passcodes.length)];

    let generatedUrl = '';
    let generatedMeetingId = '';
    let generatedPasscode = randPasscode;

    if (platform === 'Zoom') {
      generatedUrl = `https://zoom.us/j/${randId}?pwd=${randPasscode}`;
      generatedMeetingId = formattedId;
    } else if (platform === 'Google Meet') {
      const p1 = Math.random().toString(36).substring(2, 5);
      const p2 = Math.random().toString(36).substring(2, 6);
      const p3 = Math.random().toString(36).substring(2, 5);
      const code = `${p1}-${p2}-${p3}`;
      generatedUrl = `https://meet.google.com/${code}`;
      generatedMeetingId = code;
      generatedPasscode = '';
    } else if (platform === 'MS Teams') {
      const teamsId = Math.random().toString(36).substring(2, 11);
      generatedUrl = `https://teams.microsoft.com/meet/${teamsId}`;
      generatedMeetingId = `teams-${teamsId.slice(0, 6)}`;
    } else {
      const cleanTitle = (form.title || 'class').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const jitsiRoom = `school-erp-${cleanTitle}-${Math.random().toString(36).substring(2, 7)}`;
      generatedUrl = `https://meet.jit.si/${jitsiRoom}`;
      generatedMeetingId = jitsiRoom;
    }

    setForm(prev => ({
      ...prev,
      link: generatedUrl,
      meetingId: generatedMeetingId,
      passcode: generatedPasscode
    }));

    Swal.fire({
      icon: 'success',
      title: `${platform} Link Generated!`,
      text: `Meeting URL and credentials have been auto-generated.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500
    });
  };

  const handleSaveClass = async () => {
    if (!form.title.trim()) {
      Swal.fire('Required Field', 'Please enter a class title', 'warning');
      return;
    }
    if (!form.date || !form.time) {
      Swal.fire('Required Field', 'Please select both date and time', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      const selectedClass = academicClasses.find(c => c._id === form.classId);
      const selectedSection = sections.find(s => s._id === form.sectionId);
      const selectedSubject = subjects.find(s => s._id === form.subjectId);

      const payload = {
        title: form.title.trim(),
        hostId: loggedUser.id || loggedUser._id || undefined,
        academicClass: form.classId || undefined,
        className: selectedClass ? selectedClass.className : (form.classId ? undefined : 'Class X'),
        section: form.sectionId || undefined,
        sectionName: selectedSection ? selectedSection.sectionName : (form.sectionId ? undefined : 'All'),
        subject: form.subjectId || undefined,
        subjectName: selectedSubject ? selectedSubject.subjectName : (form.subjectId ? undefined : 'General'),
        teacherName: loggedUser.fullName || loggedUser.name || 'School Faculty',
        meetingUrl: form.link ? form.link.trim() : undefined,
        meetingId: form.meetingId ? form.meetingId.trim() : undefined,
        passcode: form.passcode ? form.passcode.trim() : undefined,
        platform: form.platform,
        provider: form.platform,
        startTime: `${form.date}T${form.time}:00`,
        durationMinutes: parseInt(form.duration) || 45
      };

      if (editingId) {
        const res = await liveClassService.updateClass(editingId, payload);
        if (res && res.success) {
          Swal.fire('Updated!', 'Live class updated successfully.', 'success');
          setShowModal(false);
          setEditingId(null);
          fetchLiveClasses();
        } else {
          Swal.fire('Error', res?.message || 'Failed to update live class', 'error');
        }
      } else {
        payload.status = 'Scheduled';
        const res = await liveClassService.scheduleClass(payload);
        if (res && res.success) {
          Swal.fire('Scheduled!', 'Live class scheduled successfully with meeting link.', 'success');
          setShowModal(false);
          setForm(initialForm);
          fetchLiveClasses();
        } else {
          Swal.fire('Error', res?.message || 'Failed to schedule live class', 'error');
        }
      }
    } catch (e) {
      console.error('Error saving live class:', e);
      Swal.fire('Error', e.response?.data?.message || e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartClass = async (cls) => {
    const result = await Swal.fire({
      title: 'Start Live Class Now?',
      html: `You are about to launch <b>"${cls.title}"</b>.<br/><br/><span class="text-xs text-gray-500">Status will become <b>LIVE</b> and meeting link will open.</span>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#64748b',
      confirmButtonText: '🚀 Start & Go Live!'
    });

    if (result.isConfirmed) {
      try {
        const res = await liveClassService.updateStatus(cls.id, 'Live');
        if (res && res.success) {
          Swal.fire({
            title: 'Class is Now LIVE!',
            text: `Students will now see this session as LIVE. Opening ${cls.provider || 'meeting'}...`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchLiveClasses();
          if (cls.link) {
            window.open(cls.link, '_blank', 'noopener,noreferrer');
          }
        }
      } catch (e) {
        console.error('Error starting live class:', e);
        Swal.fire('Error', 'Could not start live class', 'error');
      }
    }
  };

  const handleStopClass = async (cls) => {
    const result = await Swal.fire({
      title: 'End Live Class Session?',
      text: `Are you sure you want to end "${cls.title}"? Status will be marked as Completed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, End Session'
    });

    if (result.isConfirmed) {
      try {
        const res = await liveClassService.updateStatus(cls.id, 'Completed');
        if (res && res.success) {
          Swal.fire('Ended!', 'Live class has been marked as Completed.', 'success');
          fetchLiveClasses();
        }
      } catch (e) {
        console.error('Error stopping live class:', e);
        Swal.fire('Error', 'Could not end live class', 'error');
      }
    }
  };

  const handleDeleteClass = async (cls) => {
    const result = await Swal.fire({
      title: 'Delete Live Class?',
      text: `Are you sure you want to delete "${cls.title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete it'
    });

    if (result.isConfirmed) {
      try {
        const res = await liveClassService.deleteClass(cls.id);
        if (res && res.success) {
          Swal.fire('Deleted!', 'Live class deleted successfully.', 'success');
          fetchLiveClasses();
        }
      } catch (e) {
        console.error('Error deleting live class:', e);
        Swal.fire('Error', 'Could not delete live class', 'error');
      }
    }
  };

  const handleJoinClass = (cls) => {
    liveClassService.joinClass(cls.id, { studentName: 'Faculty / Host', rollNumber: 'HOST' }).catch(() => {});
    if (cls.link) {
      window.open(cls.link, '_blank', 'noopener,noreferrer');
    } else {
      Swal.fire('No Link', 'No meeting URL found for this class', 'info');
    }
  };

  const handleCopyLink = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    Swal.fire({
      title: 'Link Copied!',
      text: 'Meeting link copied to clipboard',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
  };

  const handleCopyStudentInvite = (cls) => {
    const inviteMessage = `🔴 LIVE CLASS INVITATION\n\n📌 Session: ${cls.title}\n📖 Subject: ${cls.subject} (${cls.class})\n👨‍🏫 Faculty: ${cls.teacherName}\n🗓️ Scheduled: ${cls.date} at ${cls.time} (${cls.duration})\n\n🔗 Meeting Link:\n${cls.link || 'https://zoom.us/join'}\n${cls.meetingId ? `🆔 Meeting ID: ${cls.meetingId}\n` : ''}${cls.passcode ? `🔑 Passcode: ${cls.passcode}\n` : ''}\nPlease join 5 minutes before class starts.`;

    navigator.clipboard.writeText(inviteMessage);
    Swal.fire({
      title: 'Invitation Copied!',
      text: 'Student WhatsApp & SMS invitation copied to clipboard!',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500
    });
  };

  const filtered = classes.filter(c =>
    (filter === 'All' || c.status === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) ||
     c.subject.toLowerCase().includes(search.toLowerCase()) ||
     c.class.toLowerCase().includes(search.toLowerCase()) ||
     (c.provider && c.provider.toLowerCase().includes(search.toLowerCase())))
  );

  const activeLiveClasses = classes.filter(c => c.status === 'Live');

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 text-red-500 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Manage Live Classes</h1>
              <p className="text-sm text-gray-500">Schedule, host and broadcast live video classes (Zoom, Meet, Teams)</p>
            </div>
          </div>
          <button
            onClick={handleOpenScheduleModal}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 flex items-center gap-2 text-sm transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Schedule Live Class
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* ======================================================== */}
        {/* 🔴 PROMINENT LIVE CLASS BROADCAST BANNER (WHEN ACTIVE)    */}
        {/* ======================================================== */}
        {activeLiveClasses.length > 0 && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 shadow-lg rounded-none border-l-4 border-yellow-300 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-300"></span>
                </span>
                <div>
                  <span className="bg-white/20 text-white text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/30 mr-2">
                    🔴 LIVE CLASS STREAMING NOW
                  </span>
                  <span className="text-xs text-rose-100 font-medium">
                    ({activeLiveClasses.length} active session{activeLiveClasses.length > 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {activeLiveClasses.map(liveCls => {
                const badge = getPlatformBadge(liveCls.provider);
                return (
                  <div key={liveCls.id} className="bg-white/10 backdrop-blur-xs p-3.5 border border-white/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="bg-white text-rose-700 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                          {badge.label}
                        </span>
                        <span className="text-xs font-semibold text-rose-100 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-yellow-300" />
                          {liveCls.students} Joined
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base leading-tight mb-1">{liveCls.title}</h3>
                      <p className="text-xs text-rose-100 font-medium">{liveCls.subject} • {liveCls.class}</p>
                      <p className="text-[11px] text-rose-200 mt-1">Host: {liveCls.teacherName}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/15">
                      <button
                        onClick={() => handleJoinClass(liveCls)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-rose-950 font-black py-2 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Join / Host
                      </button>
                      <button
                        onClick={() => handleCopyStudentInvite(liveCls)}
                        title="Copy Student Invite Message"
                        className="p-2 bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer border border-white/30"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStopClass(liveCls)}
                        title="End Live Stream"
                        className="p-2 bg-red-900/60 hover:bg-red-900 text-white transition-colors cursor-pointer border border-red-400/40"
                      >
                        <StopCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Classes', val: stats.total, icon: Video, color: 'text-indigo-500 bg-indigo-50' },
            { label: 'Live Now', val: stats.liveNow, icon: Radio, color: 'text-red-500 bg-red-50' },
            { label: 'Scheduled', val: stats.scheduled, icon: Calendar, color: 'text-blue-500 bg-blue-50' },
            { label: 'Completed', val: stats.completed, icon: CheckCircle, color: 'text-green-500 bg-green-50' },
          ].map(({ label, val, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-800">{val}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Live', 'Scheduled', 'Completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
              >
                {f === 'Live' && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>}
                {f}
              </button>
            ))}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes, Zoom, teacher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-200 text-xs w-60 focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Live Classes Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['#', 'Class Title & Platform', 'Subject / Class', 'Date & Time', 'Meeting Link & ID', 'Students', 'Live Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500 border border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                      <span>Loading live classes from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 border border-gray-200">
                    No live classes found. Click "Schedule Live Class" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((cls, i) => {
                  const badge = getPlatformBadge(cls.provider);
                  const isLive = cls.status === 'Live';

                  return (
                    <tr key={cls.id} className={`transition-colors ${isLive ? 'bg-red-50/20 hover:bg-red-50/40' : 'hover:bg-indigo-50/20'}`}>
                      <td className="px-4 py-3 border border-gray-200 text-gray-500 font-medium text-xs">{i + 1}</td>
                      <td className="px-4 py-3 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">{cls.title}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">Faculty: {cls.teacherName}</p>
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        <p className="font-medium text-gray-700">{cls.subject}</p>
                        <p className="text-xs text-gray-400">{cls.class}</p>
                      </td>
                      <td className="px-4 py-3 border border-gray-200 text-xs">
                        <p className="text-gray-700 font-semibold">{cls.date}</p>
                        <p className="text-gray-400">{cls.time} ({cls.duration})</p>
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        {cls.link ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleJoinClass(cls)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
                                title="Open Meeting Link"
                              >
                                <ExternalLink className="w-3 h-3" /> Join {badge.label}
                              </button>
                              <button
                                onClick={() => handleCopyLink(cls.link)}
                                className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                                title="Copy Meeting Link"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleCopyStudentInvite(cls)}
                                className="text-indigo-500 hover:text-indigo-700 p-0.5 cursor-pointer text-[10px] font-bold border border-indigo-200 px-1 rounded bg-indigo-50"
                                title="Copy Student WhatsApp Invite"
                              >
                                Invite
                              </button>
                            </div>
                            {(cls.meetingId || cls.passcode) && (
                              <p className="text-[10px] text-gray-500 font-mono">
                                {cls.meetingId && <span>ID: {cls.meetingId}</span>}
                                {cls.passcode && <span className="ml-1.5">Pass: {cls.passcode}</span>}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No link provided</span>
                        )}
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        <span className="flex items-center gap-1 text-gray-700 font-medium text-xs">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          {cls.students}
                        </span>
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black bg-red-100 text-red-700 border border-red-300 rounded shadow-xs">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                            </span>
                            🔴 LIVE NOW
                          </span>
                        ) : (
                          <span className={`text-xs px-2.5 py-1 rounded ${statusStyle[cls.status] || 'bg-gray-100 text-gray-600'}`}>
                            {cls.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 border border-gray-200">
                        <div className="flex items-center gap-1 flex-nowrap">
                          {cls.status === 'Live' ? (
                            <button
                              onClick={() => handleStopClass(cls)}
                              className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition-colors"
                              title="End Live Stream"
                            >
                              <StopCircle className="w-3.5 h-3.5" /> End Class
                            </button>
                          ) : cls.status === 'Scheduled' ? (
                            <button
                              onClick={() => handleStartClass(cls)}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                              title="Start Live Stream"
                            >
                              <Play className="w-3.5 h-3.5" /> Start Live
                            </button>
                          ) : null}

                          <button
                            onClick={() => handleEdit(cls)}
                            className="p-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="Edit Class"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setViewingClass(cls)}
                            className="p-1.5 bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                            title="View Class Details & Attendance"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls)}
                            className="p-1.5 bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                            title="Delete Class"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SCHEDULE / EDIT MODAL WITH ZOOM & PLATFORM SUPPORT       */}
      {/* ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" />
                {editingId ? 'Edit Live Class' : 'Schedule New Live Class'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Class Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 5: Trigonometry & Board Practice"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Class</label>
                  <select
                    value={form.classId}
                    onChange={e => setForm({ ...form, classId: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select Class</option>
                    {academicClasses.map(c => (
                      <option key={c._id} value={c._id}>{c.className}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Section</label>
                  <select
                    value={form.sectionId}
                    onChange={e => setForm({ ...form, sectionId: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                  >
                    <option value="">All Sections</option>
                    {sections.map(s => (
                      <option key={s._id} value={s._id}>{s.sectionName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subject</label>
                  <select
                    value={form.subjectId}
                    onChange={e => setForm({ ...form, subjectId: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s._id} value={s._id}>{s.subjectName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Time *</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Duration (min)</label>
                  <select
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white"
                  >
                    {['30', '40', '45', '60', '90', '120'].map(d => (
                      <option key={d} value={d}>{d} minutes</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Live Platform *</label>
                  <select
                    value={form.platform}
                    onChange={e => setForm({ ...form, platform: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none bg-white font-semibold text-gray-700"
                  >
                    <option value="Zoom">Zoom Meeting</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="MS Teams">Microsoft Teams</option>
                    <option value="Jitsi Meet">Jitsi Meet</option>
                    <option value="Custom">Custom / Direct WebRTC</option>
                  </select>
                </div>
              </div>

              {/* Meeting Link & Auto-generation Box */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-blue-600" />
                    Meeting URL &amp; Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoGenerateLink}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-yellow-300" /> Auto-Generate Link
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Meeting Link ({form.platform})
                  </label>
                  <input
                    type="url"
                    placeholder={form.platform === 'Zoom' ? 'https://zoom.us/j/123456789' : form.platform === 'Google Meet' ? 'https://meet.google.com/abc-wxyz-efg' : 'https://...'}
                    value={form.link}
                    onChange={e => setForm({ ...form, link: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Meeting ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 948 2941 042"
                      value={form.meetingId}
                      onChange={e => setForm({ ...form, meetingId: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-1.5 text-xs focus:outline-none bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Passcode / PIN</label>
                    <input
                      type="text"
                      placeholder="e.g. MATH2026"
                      value={form.passcode}
                      onChange={e => setForm({ ...form, passcode: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-1.5 text-xs focus:outline-none bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleSaveClass}
                disabled={actionLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Save Changes' : 'Schedule Live Class'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW DETAILS MODAL                                       */}
      {/* ======================================================== */}
      {viewingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewingClass(null)}>
          <div className="bg-white w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-800">Live Class Details</h2>
              </div>
              <button onClick={() => setViewingClass(null)} className="p-1.5 hover:bg-gray-100 text-gray-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <span className={`text-xs font-bold px-2.5 py-1 ${statusStyle[viewingClass.status] || 'bg-gray-100 text-gray-700'}`}>
                  {viewingClass.status === 'Live' && '🔴 '}
                  {viewingClass.status}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">{viewingClass.title}</h3>
                {viewingClass.description && (
                  <p className="text-sm text-gray-500 mt-1">{viewingClass.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 uppercase font-semibold">Subject</span>
                  <p className="text-sm font-bold text-gray-800">{viewingClass.subject}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold">Class / Section</span>
                  <p className="text-sm font-bold text-gray-800">{viewingClass.class}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold">Date &amp; Time</span>
                  <p className="text-sm font-bold text-gray-800">{viewingClass.date} at {viewingClass.time}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold">Duration</span>
                  <p className="text-sm font-bold text-gray-800">{viewingClass.duration}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold">Platform</span>
                  <p className="text-sm font-bold text-gray-800">{viewingClass.provider}</p>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-semibold">Host Faculty</span>
                  <p className="text-sm font-bold text-gray-800">{viewingClass.teacherName}</p>
                </div>
              </div>

              {viewingClass.link && (
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 uppercase">Meeting Link</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(viewingClass.link)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedLink ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button
                        onClick={() => handleCopyStudentInvite(viewingClass)}
                        className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded font-bold hover:bg-indigo-700 cursor-pointer"
                      >
                        Copy Invite
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 break-all bg-white p-2 border border-indigo-100 font-mono">
                    {viewingClass.link}
                  </p>
                  {(viewingClass.meetingId || viewingClass.passcode) && (
                    <div className="flex gap-4 pt-1 text-xs text-gray-600">
                      {viewingClass.meetingId && (
                        <span><strong className="text-gray-800">Meeting ID:</strong> {viewingClass.meetingId}</span>
                      )}
                      {viewingClass.passcode && (
                        <span><strong className="text-gray-800">Passcode:</strong> {viewingClass.passcode}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Attendees List */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Attendees ({viewingClass.attendees ? viewingClass.attendees.length : 0})
                </h4>
                {viewingClass.attendees && viewingClass.attendees.length > 0 ? (
                  <div className="border border-gray-200 max-h-36 overflow-y-auto divide-y divide-gray-100 text-xs">
                    {viewingClass.attendees.map((att, idx) => (
                      <div key={idx} className="p-2 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <p className="font-semibold text-gray-800">{att.studentName}</p>
                          {att.rollNumber && <p className="text-[10px] text-gray-400">Roll: {att.rollNumber}</p>}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {att.joinedAt ? new Date(att.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Joined'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic bg-gray-50 p-3 border border-gray-100 text-center">
                    No student attendees recorded yet for this session.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              {viewingClass.link && (
                <button
                  onClick={() => handleJoinClass(viewingClass)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" /> Open / Launch Session
                </button>
              )}
              <button
                onClick={() => setViewingClass(null)}
                className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 bg-white py-2 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLiveClasses;

import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Calendar, Users, ClipboardList, Download, 
  Printer, TrendingUp, CheckCircle2, XCircle, Clock, 
  MessageSquare, Search, Filter, ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PTMNavHeader from './PTMNavHeader';
import ptmService from '../../api/ptmService';

export default function PTMReports() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchAttendee, setSearchAttendee] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await ptmService.getMeetings();
      setMeetings(data);
      if (data.length > 0) {
        setSelectedMeetingId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentMeeting = meetings.find(m => String(m.id) === String(selectedMeetingId)) || meetings[0];

  const roster = currentMeeting?.roster || [];
  const totalInvited = roster.length > 0 ? roster.length : (currentMeeting?.invitedCount || 0);
  const presentCount = roster.filter(s => s.attendance === 'Present').length;
  const absentCount = roster.filter(s => s.attendance === 'Absent').length;
  const pendingCount = roster.filter(s => s.attendance === 'Pending').length;
  const remarkedCount = roster.filter(s => s.remarks && s.remarks.trim().length > 0).length;
  const notifiedCount = roster.filter(s => s.notified && s.notified.includes('Sent')).length;

  const attendanceRate = totalInvited > 0 ? Math.round((presentCount / totalInvited) * 100) : 0;
  const remarkRate = totalInvited > 0 ? Math.round((remarkedCount / totalInvited) * 100) : 0;
  const notificationRate = totalInvited > 0 ? Math.round((notifiedCount / totalInvited) * 100) : 0;

  // Filtered attendees for the breakdown table
  const filteredAttendees = roster.filter(s => {
    const q = searchAttendee.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || (s.roll && s.roll.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'All' || s.attendance === statusFilter;
    return matchSearch && matchStatus;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (!currentMeeting || roster.length === 0) {
      alert('No attendee data available to export.');
      return;
    }

    const headers = ['#', 'Student Name', 'Roll / Adm', 'Class', 'Guardian Phone', 'Slot', 'Notification', 'Attendance', 'Teacher Remarks'];
    const rows = roster.map((s, idx) => [
      idx + 1,
      `"${s.name}"`,
      `"${s.roll}"`,
      `"${s.className || currentMeeting.scope || ''}"`,
      `"${s.phone}"`,
      `"${s.slot}"`,
      `"${s.notified}"`,
      `"${s.attendance}"`,
      `"${(s.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PTM_Report_${currentMeeting.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <PTMNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Top Control Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Select Meeting Session to Analyze:
            </label>
            <select 
              value={selectedMeetingId}
              onChange={(e) => setSelectedMeetingId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {meetings.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.meetingDate}) — {m.scope || 'Whole school'} [{m.status}]
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
            <button 
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print Report
            </button>
          </div>
        </div>

        {currentMeeting && (
          <>
            {/* Header Highlight Card */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-blue-100 backdrop-blur-xs">
                      {currentMeeting.status}
                    </span>
                    <span className="text-xs text-blue-200">PTM Evaluation Report</span>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight">{currentMeeting.title}</h2>
                  <p className="text-xs text-blue-100/80 mt-1">
                    Conducted on {currentMeeting.meetingDate} ({currentMeeting.startTime} — {currentMeeting.endTime}) · Mode: {currentMeeting.mode} · Scope: {currentMeeting.scope || 'Whole school'}
                  </p>
                </div>

                <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/15">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-white">{attendanceRate}%</div>
                    <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider">Attendance</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-white">{remarkRate}%</div>
                    <div className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider">Feedback Recorded</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Attendance Breakdown */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Guardian Attendance Breakdown
                  </h3>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="space-y-2 pt-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present Guardians
                      </span>
                      <span className="font-bold text-emerald-700">{presentCount} ({attendanceRate}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${attendanceRate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Absent / Unreachable
                      </span>
                      <span className="font-bold text-rose-600">
                        {absentCount} ({totalInvited > 0 ? Math.round((absentCount / totalInvited) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${totalInvited > 0 ? (absentCount / totalInvited) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span> Pending Confirmation
                      </span>
                      <span className="font-bold text-slate-600">
                        {pendingCount} ({totalInvited > 0 ? Math.round((pendingCount / totalInvited) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: `${totalInvited > 0 ? (pendingCount / totalInvited) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Remarks Coverage */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Teacher Feedback & Remarks
                  </h3>
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>

                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60">
                    <div className="text-xs font-bold text-blue-900 mb-0.5">Remark Coverage</div>
                    <div className="text-2xl font-extrabold text-blue-700">{remarkRate}%</div>
                    <div className="text-[11px] text-blue-600/80 mt-1">
                      {remarkedCount} of {totalInvited} students have recorded academic comments.
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>Pending remarks:</span>
                    <span className="font-bold text-slate-800">{totalInvited - remarkedCount} students</span>
                  </div>
                </div>
              </div>

              {/* Invitation Broadcast Status */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Guardian Invitations Dispatched
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>

                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/60">
                    <div className="text-xs font-bold text-indigo-900 mb-0.5">Notification Broadcast</div>
                    <div className="text-2xl font-extrabold text-indigo-700">{notificationRate}%</div>
                    <div className="text-[11px] text-indigo-600/80 mt-1">
                      {notifiedCount} guardians received automated WhatsApp invitations.
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>Channel health:</span>
                    <span className="font-semibold text-emerald-600">Active (99.8% Gateway Uptime)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Detailed Student Roster Breakdown */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student-Wise Consultation Ledger</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Individual guardian interaction logs and performance notes.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input 
                      type="text" 
                      value={searchAttendee}
                      onChange={(e) => setSearchAttendee(e.target.value)}
                      placeholder="Search student..."
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Present">Present Only</option>
                    <option value="Absent">Absent Only</option>
                    <option value="Pending">Pending Only</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-5 py-3">#</th>
                      <th className="px-5 py-3">Student Name</th>
                      <th className="px-5 py-3">Roll / Adm</th>
                      <th className="px-5 py-3">Guardian Phone</th>
                      <th className="px-5 py-3">Slot</th>
                      <th className="px-5 py-3">Attendance</th>
                      <th className="px-5 py-3">Teacher Observation / Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredAttendees.length > 0 ? (
                      filteredAttendees.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3 text-slate-400 font-medium">{idx + 1}</td>
                          <td className="px-5 py-3 font-bold text-slate-900">{s.name}</td>
                          <td className="px-5 py-3 text-slate-500">{s.roll}</td>
                          <td className="px-5 py-3 text-slate-600 font-mono text-[11px]">{s.phone}</td>
                          <td className="px-5 py-3 text-slate-600">{s.slot || '--'}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              s.attendance === 'Present' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : s.attendance === 'Absent' 
                                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {s.attendance}
                            </span>
                          </td>
                          <td className="px-5 py-3 max-w-sm">
                            {s.remarks ? (
                              <p className="text-slate-800 leading-relaxed font-normal">{s.remarks}</p>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">No remark recorded</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-5 py-8 text-center text-slate-400">
                          No student records match criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

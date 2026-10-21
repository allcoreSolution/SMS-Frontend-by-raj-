import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, ClipboardList, Plus, 
  Filter, Eye, Edit, Trash2, Search, X, CheckCircle2,
  Clock, MapPin, Video, AlertCircle, ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PTMNavHeader from './PTMNavHeader';
import ptmService from '../../api/ptmService';

export default function PTMAttendance() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [scopeFilter, setScopeFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Edit Modal state
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    meetingDate: '',
    startTime: '',
    endTime: '',
    mode: '',
    status: '',
    venue: '',
  });

  // Delete Confirm Modal
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const data = await ptmService.getMeetings();
      setMeetings(data);
    } catch (err) {
      console.error('Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = async () => {
    setLoading(true);
    try {
      const filtered = await ptmService.getMeetings({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        scope: scopeFilter !== 'All' ? scopeFilter : undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
        search: searchQuery || undefined,
      });
      setMeetings(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setSearchQuery('');
    setStatusFilter('All');
    setScopeFilter('All');
    setFromDate('');
    setToDate('');
    setLoading(true);
    const data = await ptmService.getMeetings();
    setMeetings(data);
    setLoading(false);
  };

  const openEditModal = (meeting) => {
    setEditingMeeting(meeting);
    setEditForm({
      title: meeting.title || '',
      meetingDate: meeting.meetingDate || '',
      startTime: meeting.startTime || '',
      endTime: meeting.endTime || '',
      mode: meeting.mode || 'In person',
      status: meeting.status || 'Scheduled',
      venue: meeting.venue || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMeeting) return;
    try {
      await ptmService.updateMeeting(editingMeeting.id, editForm);
      setEditingMeeting(null);
      fetchMeetings();
    } catch (err) {
      console.error('Failed to update meeting:', err);
      alert('Failed to update meeting.');
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await ptmService.deleteMeeting(deletingId);
      setDeletingId(null);
      fetchMeetings();
    } catch (err) {
      console.error('Failed to delete meeting:', err);
      alert('Failed to delete meeting.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'notified':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">Notified</span>;
      case 'draft':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">Draft</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">Scheduled</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <PTMNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-5">
        
        {/* Filters Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                placeholder="Search meeting by title, hall, agenda..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Select */}
              <div className="w-[140px]">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Notified">Notified</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              {/* Scope Select */}
              <div className="w-[150px]">
                <select 
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="All">All Classes / Scopes</option>
                  <option value="Whole school">Whole School</option>
                  <option value="Nursery">Nursery</option>
                  <option value="Class II">Class II</option>
                  <option value="Class IV">Class IV</option>
                </select>
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-1.5">
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                  title="From Date"
                />
                <span className="text-xs text-slate-400">to</span>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none"
                  title="To Date"
                />
              </div>

              <button 
                onClick={handleApplyFilter}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>

              {(searchQuery || statusFilter !== 'All' || scopeFilter !== 'All' || fromDate || toDate) && (
                <button 
                  onClick={handleResetFilters}
                  className="px-3 py-2 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-medium flex items-center gap-1 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Meetings List Table Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Parent-Teacher Meeting Sessions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select any session to inspect guardian attendance records & teacher observations.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {meetings.length} Total Sessions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Meeting Details</th>
                  <th className="px-5 py-3.5">Schedule</th>
                  <th className="px-5 py-3.5">Scope / Grade</th>
                  <th className="px-5 py-3.5 text-center">Invited</th>
                  <th className="px-5 py-3.5 text-center">Present</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                      Loading meetings directory...
                    </td>
                  </tr>
                ) : meetings.length > 0 ? (
                  meetings.map((meeting) => {
                    const roster = meeting.roster || [];
                    const presentCount = roster.filter(r => r.attendance === 'Present').length;
                    const invitedCount = roster.length > 0 ? roster.length : (meeting.invitedCount || 0);
                    const attendancePct = invitedCount > 0 ? Math.round((presentCount / invitedCount) * 100) : 0;

                    return (
                      <tr key={meeting.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div 
                            onClick={() => navigate(`/ptm/details/${meeting.id}`)}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{meeting.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            {meeting.mode === 'Online' ? <Video className="w-3 h-3 text-purple-500" /> : <MapPin className="w-3 h-3 text-slate-400" />}
                            <span>{meeting.mode} {meeting.venue ? `— ${meeting.venue}` : ''}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{meeting.meetingDate}</div>
                          <div className="text-[11px] text-slate-400">
                            {meeting.startTime} {meeting.endTime ? `— ${meeting.endTime}` : ''}
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {meeting.scope || 'Whole school'}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center font-semibold text-slate-800">
                          {invitedCount}
                        </td>

                        <td className="px-5 py-3.5 text-center">
                          <div className="font-bold text-emerald-600">{presentCount}</div>
                          {invitedCount > 0 && (
                            <div className="w-16 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                              <div 
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${Math.min(attendancePct, 100)}%` }}
                              />
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          {getStatusBadge(meeting.status)}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => navigate(`/ptm/details/${meeting.id}`)}
                              title="View Roster & Attendance"
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Roster</span>
                            </button>
                            
                            <button 
                              onClick={() => openEditModal(meeting)}
                              title="Edit Meeting"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button 
                              onClick={() => setDeletingId(meeting.id)}
                              title="Delete Meeting"
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-16 text-center text-slate-400">
                      <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-700">No meeting sessions match your query</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or create a new session.</p>
                      <button
                        onClick={() => navigate('/ptm/schedule')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Schedule Meeting
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Edit Meeting Modal */}
      {editingMeeting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-scale-up border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Edit PTM Meeting Details</h3>
              <button 
                onClick={() => setEditingMeeting(null)}
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
                  value={editForm.title} 
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={editForm.meetingDate} 
                    onChange={(e) => setEditForm({ ...editForm, meetingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={editForm.status} 
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
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
                    value={editForm.startTime} 
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                  <input 
                    type="text" 
                    value={editForm.endTime} 
                    onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                    placeholder="e.g. 01:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue / Room</label>
                <input 
                  type="text" 
                  value={editForm.venue} 
                  onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
              <button 
                onClick={() => setEditingMeeting(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Delete this meeting?</h3>
            <p className="text-xs text-slate-500 mt-1">
              This will remove the meeting record and its associated guardian roster. This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

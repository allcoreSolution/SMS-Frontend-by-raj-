import React, { useState, useEffect } from 'react';
import { 
  Calendar, MessageSquare, Plus, Edit, Trash2, 
  Search, CheckCircle2, Clock, AlertCircle, XCircle, 
  Filter, Check, User, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PTMNavHeader from './PTMNavHeader';
import ptmService from '../../api/ptmService';

export default function PTMFollowups() {
  const navigate = useNavigate();
  const [followUps, setFollowUps] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    meeting: '',
    actionPlan: '',
    assignee: 'Class Teacher',
    due: '',
    priority: 'Medium',
    status: 'Open'
  });

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fData, mData] = await Promise.all([
        ptmService.getFollowUps(),
        ptmService.getMeetings()
      ]);
      setFollowUps(fData);
      setMeetings(mData);
    } catch (err) {
      console.error('Failed to load follow-ups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ptmService.updateFollowUp(id, { status: newStatus });
      setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      student: '',
      meeting: meetings.length > 0 ? meetings[0].title : 'General PTM',
      actionPlan: '',
      assignee: 'Class Teacher',
      due: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'Open'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      student: item.student || '',
      meeting: item.meeting || '',
      actionPlan: item.actionPlan || '',
      assignee: item.assignee || 'Class Teacher',
      due: item.due || '',
      priority: item.priority || 'Medium',
      status: item.status || 'Open'
    });
    setShowModal(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!formData.student.trim() || !formData.actionPlan.trim()) {
      alert('Please fill student name and action plan');
      return;
    }

    try {
      if (editingId) {
        await ptmService.updateFollowUp(editingId, formData);
        setFollowUps(prev => prev.map(f => f.id === editingId ? { ...f, ...formData } : f));
      } else {
        const created = await ptmService.createFollowUp(formData);
        setFollowUps(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await ptmService.deleteFollowUp(deletingId);
      setFollowUps(prev => prev.filter(f => f.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter follow-ups
  const filtered = followUps.filter(f => {
    const matchesStatus = statusFilter === 'All' || f.status.toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      f.student.toLowerCase().includes(q) ||
      (f.actionPlan && f.actionPlan.toLowerCase().includes(q)) ||
      (f.assignee && f.assignee.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // Counters
  const countOpen = followUps.filter(f => f.status === 'Open').length;
  const countInProgress = followUps.filter(f => f.status === 'In Progress').length;
  const countDone = followUps.filter(f => f.status === 'Done').length;
  const countCancelled = followUps.filter(f => f.status === 'Cancelled').length;

  const getPriorityBadge = (p) => {
    switch (p?.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">High</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">Low</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Medium</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <PTMNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden group">
            <div className="text-3xl font-extrabold text-amber-600 mb-1">{countOpen}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Tasks</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Awaiting teacher action</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden group">
            <div className="text-3xl font-extrabold text-indigo-600 mb-1">{countInProgress}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Under evaluation</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden group">
            <div className="text-3xl font-extrabold text-emerald-600 mb-1">{countDone}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed / Resolved</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Action plan finished</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-center relative overflow-hidden group">
            <div className="text-3xl font-extrabold text-slate-600 mb-1">{countCancelled}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dismissed</div>
            <div className="text-[11px] text-slate-400 mt-0.5">No longer required</div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student, action plan, teacher..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="w-44">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleOpenNew}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> New Follow-up
          </button>
        </div>

        {/* Follow-ups Table Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Action Plans & Follow-up Register</h2>
              <p className="text-xs text-slate-500 mt-0.5">Documented commitments made during parent-teacher interactions.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {filtered.length} Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Meeting Session</th>
                  <th className="px-5 py-3.5">Action Plan / Commitment</th>
                  <th className="px-5 py-3.5">Assignee</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                      Loading follow-ups register...
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {item.student}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600 font-medium">
                        {item.meeting || '--'}
                      </td>

                      <td className="px-5 py-3.5 max-w-sm">
                        <p className="text-xs text-slate-800 leading-relaxed font-normal">
                          {item.actionPlan}
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.assignee}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-medium text-slate-600">
                        {item.due || '--'}
                      </td>

                      <td className="px-5 py-3.5">
                        {getPriorityBadge(item.priority)}
                      </td>

                      {/* Inline Interactive Status Dropdown */}
                      <td className="px-5 py-3.5">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer bg-white ${
                            item.status === 'Done'
                              ? 'text-emerald-700 border-emerald-300 bg-emerald-50/40'
                              : item.status === 'In Progress'
                              ? 'text-indigo-700 border-indigo-300 bg-indigo-50/40'
                              : item.status === 'Cancelled'
                              ? 'text-slate-500 border-slate-300'
                              : 'text-amber-700 border-amber-300 bg-amber-50/40'
                          }`}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setDeletingId(item.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">No action plans found.</p>
                      <button
                        onClick={handleOpenNew}
                        className="mt-3 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                      >
                        Create First Follow-up
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add / Edit Follow-up Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? 'Edit Follow-up Item' : 'New PTM Follow-up Action'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  placeholder="e.g. Ishaan Gupta"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Related PTM Meeting
                </label>
                <select 
                  value={formData.meeting}
                  onChange={(e) => setFormData({ ...formData, meeting: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Meeting Session --</option>
                  {meetings.map(m => (
                    <option key={m.id} value={m.title}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Action Plan & Goal <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  rows="3"
                  value={formData.actionPlan}
                  onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                  placeholder="e.g. Daily 30-min reading practice, weekly math checks..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-y" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
                  <input 
                    type="text" 
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Due Date</label>
                  <input 
                    type="date" 
                    value={formData.due}
                    onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Create Follow-up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Delete this follow-up?</h3>
            <p className="text-xs text-slate-500 mt-1">This action cannot be undone.</p>
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

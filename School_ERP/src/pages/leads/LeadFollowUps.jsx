import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Columns, Bell, Layers, Book, Calendar, Check, 
  MoreHorizontal, User, Phone, CheckCircle2, Plus, Clock, AlertCircle, X, Sparkles 
} from 'lucide-react';
import LeadHeader from './LeadHeader';
import LeadDetailsModal from './LeadDetailsModal';
import leadService from '../../api/leadService';

const LeadFollowUps = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [filterType, setFilterType] = useState('All'); // 'All', 'Call', 'Meeting', 'Campus Visit', 'Email'
  
  // New task modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    leadId: '',
    title: '',
    type: 'Call',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadService.getLeads();
      if (res && res.data) {
        setLeads(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch leads for follow-ups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Today boundaries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Group leads with followUps
  const leadsWithFollowUps = leads.filter(l => l.followUpDate || l.followUpTitle);

  const overdueTasks = [];
  const todayTasks = [];
  const upcomingTasks = [];
  const completedTasks = [];

  leads.forEach(l => {
    if (l.followUpStatus === 'completed') {
      completedTasks.push(l);
      return;
    }
    if (l.followUpDate) {
      const d = new Date(l.followUpDate);
      if (d < today) {
        overdueTasks.push(l);
      } else if (d >= today && d < tomorrow) {
        todayTasks.push(l);
      } else {
        upcomingTasks.push(l);
      }
    } else if (l.followUpTitle) {
      todayTasks.push(l);
    }
  });

  const toggleTaskComplete = async (lead) => {
    const newStatus = lead.followUpStatus === 'completed' ? 'pending' : 'completed';
    // Optimistic
    setLeads(prev => prev.map(l => l._id === lead._id ? { ...l, followUpStatus: newStatus } : l));

    try {
      await leadService.updateLead(lead._id, { followUpStatus: newStatus });
    } catch (err) {
      console.error('Failed to toggle status:', err);
      fetchLeads();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.leadId) {
      alert('Please select a candidate');
      return;
    }

    try {
      await leadService.updateLead(taskForm.leadId, {
        followUpDate: new Date(taskForm.date),
        followUpType: taskForm.type,
        followUpTitle: taskForm.title,
        followUpStatus: 'pending',
        notes: taskForm.notes ? taskForm.notes : undefined,
      });
      setIsTaskModalOpen(false);
      setTaskForm({
        leadId: '',
        title: '',
        type: 'Call',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      fetchLeads();
    } catch (err) {
      console.error('Failed to create follow-up task:', err);
    }
  };

  const renderTaskCard = (lead, badgeClass) => {
    const isCompleted = lead.followUpStatus === 'completed';
    const cleanPhone = (lead.contactNumber || lead.phone || '').replace(/[^0-9]/g, '');

    return (
      <div 
        key={lead._id}
        className={`p-4 hover:bg-slate-50/80 transition-all flex items-start gap-3.5 border-b border-slate-100 last:border-b-0 cursor-pointer ${
          isCompleted ? 'opacity-60 bg-slate-50/40' : ''
        }`}
        onClick={() => setSelectedLead(lead)}
      >
        {/* Complete checkmark */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleTaskComplete(lead); }}
          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shadow-2xs ${
            isCompleted 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-transparent hover:text-emerald-500'
          }`}
          title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`text-xs sm:text-[13px] font-bold text-slate-800 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
              {lead.followUpTitle || `${lead.followUpType || 'Call'} inquiry candidate`}
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeClass}`}>
              {lead.followUpType || 'Call'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
              <User className="w-3 h-3 text-[#5F52FF]" /> {lead.studentName} ({lead.targetClass || lead.cls || lead.class})
            </span>
            <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
              <Calendar className="w-3 h-3 text-slate-400" />
              {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Today'}
            </span>
            {lead.contactNumber && (
              <span className="text-slate-500 font-semibold">
                Phone: {lead.contactNumber}
              </span>
            )}
          </div>

          {lead.notes && (
            <p className="text-[11px] text-slate-500 mt-2 line-clamp-1 italic">
              "{lead.notes}"
            </p>
          )}
        </div>

        {/* Quick action icons */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {lead.contactNumber && (
            <a
              href={`tel:${lead.contactNumber}`}
              title={`Call ${lead.studentName}`}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="px-2 py-1 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold text-[10px] transition"
            >
              WA
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <LeadHeader 
        activeTab="follow-ups" 
        onLeadCreated={fetchLeads}
        stats={{ total: leads.length, followUps: { today: todayTasks.length, overdue: overdueTasks.length } }}
        onRefresh={fetchLeads}
      />

      <div className="p-6 sm:p-8 w-full max-w-6xl mx-auto flex flex-col gap-6">

        {/* Sub-header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5F52FF]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-850 tracking-tight">Follow-up Inbox</h2>
              <p className="text-xs text-slate-500 font-medium">Daily reminders to connect with candidates & parents</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-[#5F52FF] hover:bg-[#4E41E6] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Schedule Follow-up
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Task List (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            
            {/* Overdue Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="px-5 py-3.5 bg-rose-50/70 border-b border-rose-100 flex justify-between items-center text-rose-900">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
                  Overdue Follow-ups ({overdueTasks.length})
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800">
                  Needs immediate attention
                </span>
              </div>
              <div>
                {overdueTasks.length > 0 ? (
                  overdueTasks.map(l => renderTaskCard(l, 'bg-rose-50 text-rose-700 border border-rose-200'))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No overdue tasks! You are all caught up.
                  </div>
                )}
              </div>
            </div>

            {/* Today's Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="px-5 py-3.5 bg-amber-50/70 border-b border-amber-100 flex justify-between items-center text-amber-900">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  Due Today ({todayTasks.length})
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-800">
                  Scheduled for today
                </span>
              </div>
              <div>
                {todayTasks.length > 0 ? (
                  todayTasks.map(l => renderTaskCard(l, 'bg-amber-50 text-amber-700 border border-amber-200'))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No follow-ups due today.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/70 flex justify-between items-center text-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                  Upcoming Follow-ups ({upcomingTasks.length})
                </h3>
              </div>
              <div>
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map(l => renderTaskCard(l, 'bg-indigo-50 text-indigo-700 border border-indigo-200'))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No upcoming follow-up tasks scheduled.
                  </div>
                )}
              </div>
            </div>

            {/* Completed Section */}
            {completedTasks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="px-5 py-3.5 bg-emerald-50/50 border-b border-emerald-100 flex justify-between items-center text-emerald-900">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Completed Tasks ({completedTasks.length})
                  </h3>
                </div>
                <div>
                  {completedTasks.map(l => renderTaskCard(l, 'bg-emerald-50 text-emerald-700 border border-emerald-200'))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Summary (1 col) */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Task Summary & Pipeline
              </h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Overdue Tasks
                  </span>
                  <span className="font-black text-rose-600 text-sm">{overdueTasks.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Due Today
                  </span>
                  <span className="font-black text-amber-600 text-sm">{todayTasks.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div> Upcoming Tasks
                  </span>
                  <span className="font-black text-slate-800 text-sm">{upcomingTasks.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Completed
                  </span>
                  <span className="font-black text-emerald-600 text-sm">{completedTasks.length}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(true)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-[#5F52FF] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Schedule Next Task
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-indigo-500 to-[#5F52FF] text-white rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-bold flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" /> Best Practice Tip
              </h4>
              <p className="text-[11px] text-white/90 leading-relaxed font-medium">
                Research shows candidates contacted within 24 hours of inquiry are 4x more likely to complete admission. Log every conversation note so colleagues can smoothly pick up the case.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Schedule Follow-up Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#5F52FF] text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Schedule New Follow-up
              </h3>
              <button 
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Candidate <span className="text-red-500">*</span></label>
                <select
                  value={taskForm.leadId}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, leadId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20"
                  required
                >
                  <option value="">-- Choose Candidate --</option>
                  {leads.map(l => (
                    <option key={l._id} value={l._id}>
                      {l.studentName} ({l.targetClass || l.cls || l.class}) - Parent: {l.parentName || l.guardian}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title / Goal <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Schedule campus tour or review fee structure"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={taskForm.date}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={taskForm.type}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Campus Visit">Campus Visit</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Conversation Notes</label>
                <textarea
                  rows="2"
                  placeholder="Additional context or remarks..."
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5F52FF] text-white font-bold hover:bg-[#4E41E6] shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <LeadDetailsModal 
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        onLeadUpdated={fetchLeads}
        onLeadDeleted={fetchLeads}
      />

    </div>
  );
};

export default LeadFollowUps;

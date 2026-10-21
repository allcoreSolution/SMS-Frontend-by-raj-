import React, { useState, useMemo, useEffect } from 'react';
import { Search, CheckCircle, Clock, Bell, Filter, ChevronRight, X, Send, AlertTriangle, Trash2 } from 'lucide-react';
import { tenantService } from '../api/tenantService';

const PRIORITIES = {
  Urgent: 'text-orange-600 font-bold',
  High:   'text-red-600   font-bold',
  Normal: 'text-blue-600  font-semibold',
  Low:    'text-gray-500  font-semibold',
};

const STATUS_BADGE = {
  Open:      'text-orange-600 border border-orange-300 bg-orange-50',
  Resolved:  'text-emerald-600 border border-emerald-300 bg-emerald-50',
  'In Progress': 'text-blue-600 border border-blue-300 bg-blue-50',
};

export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [schoolFilter, setSchoolFilter] = useState('All schools');
  const [viewTicket, setViewTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [deleteTicket, setDeleteTicket] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await tenantService.getAllTickets();
      if(res.data && res.data.length > 0) {
         setTickets(res.data.map(t => ({
           id: t._id,
           tkt: 'TKT-' + t._id.substring(t._id.length - 6).toUpperCase(),
           subject: t.title,
           school: t.schoolId?.schoolName || 'Unknown School',
           category: 'Support', // Or parse from dynamic tags if available
           priority: t.priority,
           status: t.status,
           updated: new Date(t.updatedAt).toLocaleDateString()
         })));
      } else {
         setTickets([]); // removed fallback
      }
    } catch(err) {
      console.log(err);
      setTickets([]); // removed fallback
    }
  };

  const stats = useMemo(() => ({
    open:       tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved:   tickets.filter(t => t.status === 'Resolved').length,
    unread:     0,
  }), [tickets]);

  const uniqueSchools = useMemo(() => ['All schools', ...new Set(tickets.map(t => t.school))], [tickets]);

  const filtered = useMemo(() => tickets.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (schoolFilter !== 'All schools' && t.school !== schoolFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.subject.toLowerCase().includes(q) || t.tkt.toLowerCase().includes(q) || t.school.toLowerCase().includes(q);
    }
    return true;
  }), [tickets, search, statusFilter, priorityFilter, schoolFilter]);

  const handleReply = () => {
    if (!reply.trim() || !viewTicket) return;
    const msg = { from: 'Support', text: reply.trim(), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => ({ ...prev, [viewTicket.id]: [...(prev[viewTicket.id] || []), msg] }));
    setTickets(prev => prev.map(t => t.id === viewTicket.id ? { ...t, status: 'In Progress', updated: 'just now' } : t));
    setReply('');
  };

  const handleDelete = () => {
    setTickets(prev => prev.filter(t => t.id !== deleteTicket.id));
    setDeleteTicket(null);
    if (viewTicket?.id === deleteTicket?.id) setViewTicket(null);
  };

  const StatCard = ({ icon, value, label, iconBg }) => (
    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-11 h-11 rounded-none ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[24px] font-black text-gray-900 leading-none">{value}</p>
        <p className="text-[12px] text-gray-500 font-medium mt-1">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 pb-12 w-full bg-[#f8f9fa] min-h-screen">

      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-violet-600 rounded-none flex items-center justify-center shadow">
            <span className="text-lg">🎧</span>
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-gray-800 tracking-tight">Support Tickets</h1>
            <p className="text-[13px] text-gray-500">Queries raised by schools — triage, reply and resolve</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<span className="text-[20px]">📂</span>} value={stats.open}       label="Open"            iconBg="bg-amber-50" />
        <StatCard icon={<Clock className="w-5 h-5 text-blue-500" />}              value={stats.inProgress} label="In Progress"     iconBg="bg-blue-50" />
        <StatCard icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}    value={stats.resolved}   label="Resolved"        iconBg="bg-emerald-50" />
        <StatCard icon={<Bell className="w-5 h-5 text-red-500" />}               value={stats.unread}     label="Unread activity" iconBg="bg-red-50" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-none shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Subject or TKT-..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-none pl-9 pr-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#554bb9] focus:ring-1 focus:ring-[#554bb9]/20"
              />
            </div>
          </div>

          {/* Status */}
          <div className="min-w-[130px]">
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#554bb9]">
              {['All', 'Open', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Priority */}
          <div className="min-w-[130px]">
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Priority</label>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#554bb9]">
              {['All', 'Urgent', 'High', 'Normal', 'Low'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* School */}
          <div className="min-w-[200px] flex-1">
            <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">School</label>
            <select value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)} className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#554bb9]">
              {uniqueSchools.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 bg-[#554bb9] hover:bg-[#463ca0] text-white px-5 py-2 rounded-none text-[13px] font-bold shadow-sm transition-colors shrink-0">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-none shadow-sm overflow-hidden">
        <table className="w-full text-[13px] text-left border-collapse">
          <thead>
            <tr className="bg-[#f5f6fa]">
              <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider w-8">#</th>
              <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider">Ticket</th>
              <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider">School</th>
              <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider">Category</th>
              <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider">Priority</th>
              <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider">Status</th>
              <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider">Updated</th>
              <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => (
              <tr key={t.id} className="hover:bg-[#f8f9ff] transition-colors">
                <td className="px-4 py-3 border border-gray-200 text-gray-400 font-medium text-center">{idx + 1}</td>
                <td className="px-4 py-3 border border-gray-200">
                  <p className={`font-semibold hover:underline cursor-pointer ${t.status === 'Open' ? 'text-orange-600' : 'text-gray-700'}`}
                     onClick={() => setViewTicket(t)}>
                    {t.subject}
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">{t.tkt}</p>
                </td>
                <td className="px-4 py-3 border border-gray-200 text-gray-700 font-medium">{t.school}</td>
                <td className={`px-4 py-3 border border-gray-200 font-medium ${t.category === 'Technical issue' ? 'text-orange-500' : 'text-blue-500'}`}>{t.category}</td>
                <td className={`px-4 py-3 border border-gray-200 ${PRIORITIES[t.priority] || 'text-gray-600'}`}>{t.priority}</td>
                <td className="px-4 py-3 border border-gray-200">
                  <span className={`px-2.5 py-0.5 rounded-none text-[11px] font-bold ${STATUS_BADGE[t.status] || 'bg-gray-100 text-gray-600'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-200 text-gray-400 text-[12px] whitespace-nowrap">{t.updated}</td>
                <td className="px-4 py-3 border border-gray-200 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => setViewTicket(t)}
                      className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-none text-[12px] font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                      Open <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-400 text-sm">
                  No tickets match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View & Reply Drawer */}
      {viewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-none shadow-xl w-full max-w-lg flex flex-col" style={{ maxHeight: '90vh' }}>
            {/* Modal Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-none text-[11px] font-bold ${STATUS_BADGE[viewTicket.status]}`}>{viewTicket.status}</span>
                  <span className={`text-[12px] font-bold ${PRIORITIES[viewTicket.priority]}`}>{viewTicket.priority}</span>
                </div>
                <h2 className="font-bold text-gray-800 text-[15px]">{viewTicket.subject}</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">{viewTicket.tkt} · {viewTicket.school}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setDeleteTicket(viewTicket)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-none transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewTicket(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-none transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Update */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Update Status:</label>
              {['Open', 'In Progress', 'Resolved'].map(s => (
                <button key={s}
                  onClick={() => setTickets(prev => prev.map(t => t.id === viewTicket.id ? { ...t, status: s } : t))}
                  className={`px-3 py-1 rounded-none text-[11px] font-bold border transition-all
                    ${viewTicket.status === s ? (STATUS_BADGE[s] + ' border-current') : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {s}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50/50">
              <div className="bg-white border border-gray-200 rounded-none p-3 text-[13px] text-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Original Message · {viewTicket.school}</p>
                <p>{viewTicket.subject}</p>
              </div>
              {(messages[viewTicket.id] || []).map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'Support' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-none px-3 py-2 text-[13px] ${msg.from === 'Support' ? 'bg-[#554bb9] text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                    <p className="text-[10px] font-bold uppercase opacity-70 mb-1">{msg.from}</p>
                    <p>{msg.text}</p>
                    <p className="text-[10px] opacity-60 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReply()}
                placeholder="Type your reply..."
                className="flex-1 border border-gray-200 rounded-none px-3 py-2 text-[13px] focus:outline-none focus:border-[#554bb9] focus:ring-1 focus:ring-[#554bb9]/20"
              />
              <button onClick={handleReply} className="bg-[#554bb9] hover:bg-[#463ca0] text-white px-4 py-2 rounded-none transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTicket && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-none shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-[16px] mb-2">Delete Ticket?</h2>
            <p className="text-[13px] text-gray-500 mb-6">This will permanently delete <span className="font-bold text-gray-700">{deleteTicket.tkt}</span>. This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTicket(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-[13px] font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-[13px] font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

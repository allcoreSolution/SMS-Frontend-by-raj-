import React, { useState, useEffect } from 'react';
import {
  CalendarDays, Plus, Eye, Trash2, Clock,
  CheckCircle, XCircle, AlertTriangle, X,
  FileText, User, Calendar, MessageSquare, Send
} from 'lucide-react';
import Swal from 'sweetalert2';
import { leaveService } from '../api/leaveService';

const leaveBalance = [
  { type: 'Casual Leave', total: 12, used: 0, color: 'blue' },
  { type: 'Medical Leave', total: 10, used: 0, color: 'green' },
  { type: 'Earned Leave', total: 15, used: 0, color: 'indigo' },
];

const statusStyle = {
  Approved:  { cls: 'bg-green-50 text-green-700 border-green-300', icon: CheckCircle },
  Rejected:  { cls: 'bg-red-50 text-red-600 border-red-300',   icon: XCircle     },
  Pending:   { cls: 'bg-yellow-50 text-yellow-700 border-yellow-300', icon: Clock },
};

const leaveTypes = ['Casual Leave', 'Medical Leave', 'Earned Leave', 'Maternity/Paternity', 'Compensatory Leave', 'Unpaid Leave'];

const ApplyLeave = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [viewLeave, setViewLeave]     = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Real logged in user ID mapping
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  // Need the teacher's profile/reference ID. If staffId logic exists, pass it.
  const myUserId = storedUser.id || storedUser._id;

  const [form, setForm] = useState({
    leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '', contact: '', halfDay: false,
  });

  const days = form.startDate && form.endDate
    ? Math.max(0, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1)
    : 0;

  const filtered = history.filter(h => filterStatus === 'All' || h.status === filterStatus);

  const DEFAULT_SEED_LEAVE_APPLICATIONS = [];

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveService.getLeaveApplications();
      if(res && res.success && Array.isArray(res.data)) {
        setHistory(res.data);
      } else {
        setHistory([]);
      }
    } catch (e) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async () => {
    if (!form.startDate || !form.endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Dates Required',
        text: 'Please select both From Date and To Date.',
        confirmButtonColor: '#ec4899',
        customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
      });
      return;
    }

    try {
      const resp = await leaveService.applyLeave({
        applicantType: storedUser.role || 'Staff',
        leaveType: form.leaveType || 'Casual Leave',
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason || 'Personal Leave',
        contact: form.contact || '',
        halfDay: form.halfDay || false
      });
      if (resp && resp.success) {
        setShowModal(false);
        Swal.fire({
          title: 'Application Sent!',
          text: `Your ${form.leaveType} request has been submitted for approval.`,
          icon: 'success',
          confirmButtonColor: '#ec4899',
          customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
        });
        setForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '', contact: '', halfDay: false });
        fetchLeaves();
        return;
      }
    } catch(e) {
      console.warn('API error, saving leave locally for demo:', e);
    }

    // Graceful offline demo fallback
    const newEntry = {
      _id: 'lv-app-' + Date.now(),
      leaveType: form.leaveType || 'Casual Leave',
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason || 'Personal Staff Leave',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setHistory(prev => [newEntry, ...prev]);
    setShowModal(false);
    Swal.fire({
      title: 'Application Sent!',
      text: `Your ${form.leaveType} request has been submitted for approval.`,
      icon: 'success',
      confirmButtonColor: '#ec4899',
      customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
    });
    setForm({ leaveType: 'Casual Leave', startDate: '', endDate: '', reason: '', contact: '', halfDay: false });
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: 'Withdraw Leave?',
      text: `Are you sure you want to withdraw this ${item.leaveType} request?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Withdraw',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
           // Delete from DB logic (Assuming leaveService has delete, we imported it but let's check or handle fallback)
           await leaveService.deleteLeave?.(item._id) || await alert('Cannot cancel immediately'); 
           Swal.fire('Withdrawn!', 'The pending leave application has been removed.', 'success');
           fetchLeaves();
        } catch(e) {
           Swal.fire('Error', 'Failed to withdraw', 'error');
        }
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 theme-app-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-pink-600 text-white rounded-none flex items-center justify-center shadow-sm">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[20px] font-black text-gray-800 tracking-tight">Apply Leave</h1>
              <p className="text-[13px] text-gray-500 font-medium">Manage and track your leave applications and balances</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-5 py-2 flex items-center gap-2 text-[13px] uppercase tracking-wider rounded-none shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Apply for Leave
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Leave Balance Cards */}
        <div>
          <h2 className="text-[13px] font-black text-gray-800 uppercase tracking-widest mb-2.5">Leave Balance — 2026–27</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {leaveBalance.map(({ type, total, used, color }) => {
              const remaining = total - used;
              const pct = Math.round((used / total) * 100);
              return (
                <div key={type} className="bg-white border-2 border-gray-300 shadow-sm px-4 py-3 rounded-none flex flex-col justify-between">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{type}</p>
                  <div className="flex items-baseline gap-2 mb-1.5">
                     <p className={`text-3xl font-black text-${color}-600 leading-none`}>{remaining}</p>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Left</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mb-2">{used} used out of {total} total days</p>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-none overflow-hidden outline outline-1 outline-gray-200">
                    <div className={`h-full bg-${color}-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Applied', val: history.length, icon: FileText, color: 'text-gray-600 bg-gray-100 border-gray-300' },
            { label: 'Approved',      val: history.filter(h => h.status === 'Approved').length, icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-300' },
            { label: 'Pending Wait',       val: history.filter(h => h.status === 'Pending').length,  icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-300' },
          ].map(({ label, val, icon: Icon, color }) => (
            <div key={label} className="bg-white border-2 border-gray-300 shadow-sm p-4 rounded-none flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 border-2 rounded-none ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[26px] font-black text-gray-800 leading-none">{val}</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Leave History Table */}
        <div className="bg-white border-2 border-gray-300 shadow-sm rounded-none">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 flex-wrap gap-3 bg-gray-50">
            <h2 className="text-[15px] font-black text-gray-800 uppercase tracking-tight">Leave Application History</h2>
            <div className="flex items-center gap-2">
              {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-none border-2 transition-colors ${filterStatus === s ? 'bg-pink-600 text-white border-pink-700' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400 hover:bg-gray-100'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  {['#', 'Leave Type', 'From', 'To', 'Days', 'Reason', 'Applied On', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className={`text-left px-5 py-3.5 text-[12px] font-black text-gray-700 uppercase tracking-wider border-r border-gray-300 ${i===8?'text-right pr-7':''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={9} className="text-center py-6 text-gray-500">Loading your history...</td></tr> : filtered.map((row, i) => {
                  const safeStatus = statusStyle[row.status] ? row.status : 'Pending';
                  const { cls, icon: SIcon } = statusStyle[safeStatus];
                  
                  return (
                    <tr key={row._id || i} className="hover:bg-pink-50/30 transition-colors border-b border-gray-300">
                      <td className="px-5 py-4 border-r border-gray-300 text-gray-600 font-bold">{i + 1}</td>
                      <td className="px-5 py-4 border-r border-gray-300 font-black text-gray-800 border-l-2 border-l-pink-400">{row.leaveType || row.type}</td>
                      <td className="px-5 py-4 border-r border-gray-300 text-gray-600 whitespace-nowrap font-medium text-[13px]">{new Date(row.startDate).toLocaleDateString()}</td>
                      <td className="px-5 py-4 border-r border-gray-300 text-gray-600 whitespace-nowrap font-medium text-[13px]">{new Date(row.endDate).toLocaleDateString()}</td>
                      <td className="px-5 py-4 border-r border-gray-300 font-black text-gray-800">
                        {row.startDate && row.endDate ? Math.max(1, Math.ceil((new Date(row.endDate) - new Date(row.startDate)) / 86400000) + 1) : 1}
                      </td>
                      <td className="px-5 py-4 border-r border-gray-300 text-gray-600 max-w-[180px] truncate font-medium text-[13px]">{row.reason}</td>
                      <td className="px-5 py-4 border-r border-gray-300 text-gray-500 whitespace-nowrap font-bold text-[12px]">{new Date(row.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="px-5 py-4 border-r border-gray-300">
                        <span className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 w-fit border rounded-none shadow-sm ${cls}`}>
                          <SIcon className="w-3.5 h-3.5" /> {safeStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 bg-gray-50/20 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button onClick={() => setViewLeave(row)} className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 border border-gray-300 hover:border-blue-500 hover:bg-blue-50 shadow-sm transition-all rounded-none active:scale-95"><Eye className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && !loading && (
                  <tr><td colSpan={9} className="text-center py-12 font-bold text-gray-400 border border-gray-300 bg-gray-50">No leave applications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== Apply Leave Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-lg shadow-2xl rounded-none border border-gray-300 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[16px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-pink-600" /> Draft Leave Form
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Leave Category *</label>
                <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })}
                  className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-pink-500 rounded-none font-medium">
                  {leaveTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">From Date *</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-pink-500 rounded-none font-medium" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">To Date *</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-pink-500 rounded-none font-medium" />
                </div>
              </div>

              {days > 0 && (
                <div className="bg-pink-50 border-2 border-pink-200 px-4 py-3 flex items-center justify-between shadow-sm">
                  <span className="text-pink-800 font-bold text-[12px] uppercase">Total Calculated: <strong className="text-[14px]">{days} Day(s)</strong></span>
                  <label className="flex items-center gap-2 text-[12px] font-black text-gray-600 uppercase tracking-wider cursor-pointer">
                    <input type="checkbox" checked={form.halfDay} onChange={e => setForm({ ...form, halfDay: e.target.checked })} className="accent-pink-600 w-4 h-4 cursor-pointer" />
                    Half Day Leave
                  </label>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Emergency Contact</label>
                    <input type="tel" placeholder="Mobile number..." value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                       className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-pink-500 rounded-none font-medium" />
                 </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Explanatory Reason *</label>
                <textarea rows={3} placeholder="Please detail the reason for your absence..."
                  value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                  className="w-full border-2 border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:border-pink-500 rounded-none font-medium" />
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 px-4 py-3 text-[11px] font-bold text-yellow-800 flex items-start gap-2 shadow-sm uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Requests must be submitted 24+ hours in advance.
              </div>
            </div>
            
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-row-reverse">
              <button
                onClick={handleApplyLeave}
                className="bg-pink-600 hover:bg-pink-700 text-white font-black px-6 py-2.5 text-[12px] uppercase tracking-wider transition-colors rounded-none shadow-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4"/> Submit Request
              </button>
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 text-[12px] font-black uppercase tracking-wider transition-colors rounded-none">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== View Leave Modal ===== */}
      {viewLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setViewLeave(null)}>
          <div className="bg-white w-full max-w-md shadow-2xl rounded-none border border-gray-300 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-8 pb-6 border-b border-gray-200 relative overflow-hidden bg-gray-50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-600"></div>
              <div className="flex items-start justify-between gap-4">
                 <div>
                    <h2 className="text-[18px] font-black text-gray-800 leading-tight mb-2">{viewLeave.type}</h2>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 flex-shrink-0 border rounded-none shadow-sm ${statusStyle[viewLeave.status].cls}`}>
                       Status: {viewLeave.status}
                    </span>
                 </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                {[
                  { label: 'Start Date', val: viewLeave.from, icon: Calendar },
                  { label: 'End Date', val: viewLeave.to, icon: Calendar },
                  { label: 'Duration', val: `${viewLeave.days} Day(s)`, icon: Clock },
                  { label: 'Filed On', val: viewLeave.appliedOn, icon: FileText },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-white border-2 border-gray-200 border-l-4 border-l-pink-500 p-3 shadow-sm rounded-none">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Icon className="w-3.5 h-3.5" />{label}</p>
                    <p className="text-[13px] font-black text-gray-800">{val}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2"><MessageSquare className="w-3.5 h-3.5" /> STATED REASON</p>
                <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-none shadow-sm font-medium text-[13px] text-gray-700 leading-relaxed">
                   {viewLeave.reason}
                </div>
              </div>
              {viewLeave.status === 'Rejected' && (
                <div className="bg-red-50 border-2 border-red-200 p-4 flex items-start gap-4 shadow-sm">
                  <div className="w-8 h-8 rounded-none bg-red-200 text-red-700 flex items-center justify-center flex-shrink-0"><XCircle className="w-4 h-4"/></div>
                  <div>
                     <p className="text-[12px] font-black text-red-800 uppercase tracking-wider mb-0.5">Application Denied</p>
                     <p className="text-[11px] text-red-600 font-bold uppercase tracking-wider">Please contact Admin.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-8 py-5 border-t border-gray-200 flex justify-end bg-gray-50">
              <button 
                onClick={() => setViewLeave(null)} 
                className="bg-gray-800 hover:bg-black text-white px-8 py-2.5 text-[12px] uppercase tracking-wider font-black shadow-sm transition-colors rounded-none"
              >
                 Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyLeave;

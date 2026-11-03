import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HandCoins, Plus, CheckCircle2, PlaneTakeoff, Clock, XCircle, 
  Trash2, Edit, Eye, RefreshCw, Search, X, Save, FileText
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Forms
  const todayStr = new Date().toISOString().split('T')[0];
  const [applyForm, setApplyForm] = useState({
    type: 'Casual Leave',
    fromDate: todayStr,
    toDate: todayStr,
    halfDay: false,
    payType: 'Paid',
    reason: '',
    contact: '',
  });

  const [editForm, setEditForm] = useState({
    id: '',
    type: 'Casual Leave',
    fromDate: todayStr,
    toDate: todayStr,
    halfDay: false,
    payType: 'Paid',
    reason: '',
    status: 'Pending',
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch Leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await accountantService.getLeaves();
      if (res.success && Array.isArray(res.data)) {
        setLeaves(res.data);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Calculate days for apply form
  const getCalculatedDays = (from, to, halfDay) => {
    if (halfDay) return 0.5;
    if (!from || !to) return 1.0;
    const diff = new Date(to) - new Date(from);
    if (diff < 0) return 0;
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  // Filtered leaves
  const filteredLeaves = leaves.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      (item.type && item.type.toLowerCase().includes(q)) ||
      (item.reason && item.reason.toLowerCase().includes(q)) ||
      (item.dates && item.dates.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // Calculate dynamic balances
  const totalApprovedDays = leaves
    .filter(l => l.status === 'Approved')
    .reduce((sum, l) => sum + (Number(l.days) || 0), 0);
  const totalPendingDays = leaves
    .filter(l => l.status === 'Pending')
    .reduce((sum, l) => sum + (Number(l.days) || 0), 0);

  // ── APPLY LEAVE ──────────────────────────────────────────
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.reason.trim()) {
      return Swal.fire('Error', 'Please provide a reason for the leave.', 'error');
    }
    if (new Date(applyForm.toDate) < new Date(applyForm.fromDate)) {
      return Swal.fire('Error', 'End Date cannot be earlier than Start Date.', 'error');
    }

    setSubmitting(true);
    try {
      const days = getCalculatedDays(applyForm.fromDate, applyForm.toDate, applyForm.halfDay);
      const res = await accountantService.applyLeave({
        type: applyForm.type,
        payType: applyForm.payType,
        fromDate: applyForm.fromDate,
        toDate: applyForm.toDate,
        dates: `${applyForm.fromDate} - ${applyForm.toDate}`,
        days: days,
        halfDay: applyForm.halfDay,
        reason: applyForm.reason.trim(),
        contact: applyForm.contact.trim(),
        applicantName: 'Accountant',
        status: 'Pending',
      });

      if (res.success || res) {
        Swal.fire({
          title: 'Leave Applied!',
          text: `Your ${applyForm.type} application for ${days} day(s) has been submitted for approval.`,
          icon: 'success',
          timer: 1800,
          showConfirmButton: false,
        });
        setShowApplyModal(false);
        setApplyForm({
          type: 'Casual Leave',
          fromDate: todayStr,
          toDate: todayStr,
          halfDay: false,
          payType: 'Paid',
          reason: '',
          contact: '',
        });
        fetchLeaves();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── EDIT LEAVE ───────────────────────────────────────────
  const openEdit = (leave) => {
    setEditForm({
      id: leave.id || leave._id,
      type: leave.type || 'Casual Leave',
      fromDate: leave.fromDate || leave.dates?.split(' - ')[0] || todayStr,
      toDate: leave.toDate || leave.dates?.split(' - ')[1] || todayStr,
      halfDay: Boolean(leave.halfDay),
      payType: leave.payType || 'Paid',
      reason: leave.reason || '',
      status: leave.status || 'Pending',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.reason.trim()) {
      return Swal.fire('Error', 'Please provide a reason.', 'error');
    }

    setSubmitting(true);
    try {
      const days = getCalculatedDays(editForm.fromDate, editForm.toDate, editForm.halfDay);
      const res = await accountantService.updateLeave(editForm.id, {
        type: editForm.type,
        payType: editForm.payType,
        fromDate: editForm.fromDate,
        toDate: editForm.toDate,
        dates: `${editForm.fromDate} - ${editForm.toDate}`,
        days: days,
        halfDay: editForm.halfDay,
        reason: editForm.reason.trim(),
        status: editForm.status,
      });

      if (res.success || res) {
        Swal.fire({
          title: 'Updated!',
          text: 'Leave application updated successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        setShowEditModal(false);
        fetchLeaves();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE / WITHDRAW LEAVE ──────────────────────────────
  const handleDelete = async (leave) => {
    const confirm = await Swal.fire({
      title: 'Withdraw Leave Request?',
      text: `Are you sure you want to withdraw this ${leave.type || 'leave'} request?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Withdraw',
    });

    if (confirm.isConfirmed) {
      try {
        await accountantService.deleteLeave(leave.id || leave._id);
        Swal.fire({
          title: 'Withdrawn!',
          text: 'Leave application removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchLeaves();
      } catch (err) {
        Swal.fire('Error', 'Failed to withdraw leave.', 'error');
      }
    }
  };

  // Open View Details
  const openView = (leave) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 text-[#00a65a] bg-green-50 border border-green-200 font-bold text-[12px] px-2.5 py-0.5 rounded-[3px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 border border-red-200 font-bold text-[12px] px-2.5 py-0.5 rounded-[3px]">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-200 font-bold text-[12px] px-2.5 py-0.5 rounded-[3px]">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#333] mb-1 flex items-center gap-2">
            <PlaneTakeoff className="w-6 h-6 text-[#5a52d7]" /> Human Resource - Leave Management
          </h1>
          <p className="text-[13px] text-gray-500">Apply and track staff leaves, medical leaves, unpaid LOP, and approval status.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeaves}
            title="Refresh"
            className="p-2 border border-gray-300 rounded-[3px] bg-white text-gray-600 hover:text-[#5a52d7] hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#5a52d7]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex gap-6">
        <NavLink 
          to="/leave" 
          className="flex items-center gap-2 pb-3 px-1 text-[14px] font-bold text-[#5a52d7] border-b-2 border-[#5a52d7]"
        >
          <PlaneTakeoff className="w-4 h-4" />
          Apply Leave
        </NavLink>
        <NavLink 
          to="/loans" 
          className="flex items-center gap-2 pb-3 px-1 text-[14px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <HandCoins className="w-4 h-4" />
          Loans & Advances
        </NavLink>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-[3px] border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Casual Leave</p>
            <p className="text-[22px] font-black text-[#5a52d7] mt-0.5">9.0 <span className="text-[12px] text-gray-400 font-normal">/ 12 Available</span></p>
          </div>
          <span className="w-10 h-10 rounded-full bg-purple-50 text-[#5a52d7] flex items-center justify-center font-bold text-xs">CL</span>
        </div>
        <div className="bg-white p-4 rounded-[3px] border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Medical Leave</p>
            <p className="text-[22px] font-black text-emerald-600 mt-0.5">9.0 <span className="text-[12px] text-gray-400 font-normal">/ 10 Available</span></p>
          </div>
          <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">ML</span>
        </div>
        <div className="bg-white p-4 rounded-[3px] border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Approved Taken</p>
            <p className="text-[22px] font-black text-gray-800 mt-0.5">{totalApprovedDays.toFixed(1)} <span className="text-[12px] text-gray-400 font-normal">Days ({totalPendingDays} Pending)</span></p>
          </div>
          <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">REQ</span>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-[3px] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Panel Header & Toolbar */}
        <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 gap-4 bg-[#fdfdfd]">
          <div className="flex items-center gap-2">
            <PlaneTakeoff className="w-5 h-5 text-[#5a52d7]" />
            <h2 className="text-[16px] font-bold text-[#333]">My Leave Requests</h2>
            <span className="text-[12px] bg-purple-100 text-[#5a52d7] font-bold px-2 py-0.5 rounded-full ml-1">
              {filteredLeaves.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leaves..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-[13px] border border-gray-200 rounded-[3px] focus:outline-none focus:border-[#5a52d7] bg-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[13px] border border-gray-200 rounded-[3px] px-3 py-1.5 focus:outline-none focus:border-[#5a52d7] bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Apply Button */}
            <button 
              onClick={() => setShowApplyModal(true)}
              className="bg-[#5a52d7] hover:bg-[#4a42c0] text-white px-4 py-2 rounded-[3px] flex items-center gap-2 text-[13px] font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Apply For Leave
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f2ff] text-[#5a52d7] text-[11px] font-bold tracking-[0.5px] uppercase border-b border-purple-100/50">
                <th className="py-4 px-5 w-12 text-center">#</th>
                <th className="py-4 px-5 border-l border-purple-100/60">Leave Type</th>
                <th className="py-4 px-5 border-l border-purple-100/60">Dates</th>
                <th className="py-4 px-5 border-l border-purple-100/60 text-center">Requested Days</th>
                <th className="py-4 px-5 border-l border-purple-100/60">Reason</th>
                <th className="py-4 px-5 border-l border-purple-100/60 text-center">Status</th>
                <th className="py-4 px-5 border-l border-purple-100/60 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#5a52d7]" />
                      Loading leave applications...
                    </div>
                  </td>
                </tr>
              ) : filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave, idx) => (
                  <tr key={leave.id || leave._id || idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-5 text-center text-gray-500 font-medium">{idx + 1}</td>
                    <td className="py-5 px-5 border-l border-gray-100">
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="font-bold text-[#333]">{leave.type || 'Casual Leave'}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-[3px] font-medium ${
                          leave.payType?.includes('Unpaid') 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {leave.payType || 'Paid'}
                        </span>
                        {leave.halfDay && (
                          <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.2 rounded font-semibold">Half Day</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-5 border-l border-gray-100 text-[#555] font-medium">
                      {leave.dates || `${leave.fromDate || ''} - ${leave.toDate || ''}`}
                    </td>
                    <td className="py-5 px-5 border-l border-gray-100 text-center font-bold text-[#333]">
                      {Number(leave.days || 1).toFixed(1)}
                    </td>
                    <td className="py-5 px-5 border-l border-gray-100 text-[#555] max-w-xs truncate" title={leave.reason}>
                      {leave.reason || <span className="text-gray-300 italic">No reason specified</span>}
                    </td>
                    <td className="py-5 px-5 border-l border-gray-100 text-center">
                      {getStatusBadge(leave.status)}
                    </td>
                    <td className="py-5 px-5 border-l border-gray-100 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openView(leave)}
                          title="View Details"
                          className="p-1.5 text-gray-500 hover:text-[#5a52d7] hover:bg-purple-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(leave)}
                          title="Edit Request"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(leave)}
                          title="Withdraw Leave"
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                        <PlaneTakeoff className="w-7 h-7 text-[#5a52d7]" />
                      </div>
                      <h3 className="text-[15px] font-bold text-[#333] mb-1">
                        {search || statusFilter !== 'ALL' ? 'No matching leave requests' : 'No leave applications yet'}
                      </h3>
                      <p className="text-[13px] text-gray-500 max-w-sm mb-4">
                        {search || statusFilter !== 'ALL' 
                          ? 'Try adjusting your search query or filter.' 
                          : 'Click below to submit your leave request.'}
                      </p>
                      <button
                        onClick={() => setShowApplyModal(true)}
                        className="bg-[#5a52d7] hover:bg-[#4a42c0] text-white px-4 py-2 rounded-[3px] flex items-center gap-2 text-[13px] font-medium transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Apply For Leave
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── APPLY FOR LEAVE MODAL ─────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {showApplyModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowApplyModal(false)}
        >
          <div 
            className="bg-white rounded-[4px] w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#fbfbfb]">
              <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5 text-[#5a52d7]" /> Apply For Leave
              </h2>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-[14px]">
                
                {/* Leave Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Leave Type *
                  </label>
                  <select
                    value={applyForm.type}
                    onChange={(e) => {
                      const val = e.target.value;
                      setApplyForm({
                        ...applyForm,
                        type: val,
                        payType: val === 'Unpaid Leave (LOP)' ? 'Unpaid (LOP)' : 'Paid'
                      });
                    }}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                    required
                  >
                    <option value="Casual Leave">Casual Leave (CL)</option>
                    <option value="Medical Leave">Medical Leave (ML)</option>
                    <option value="Earned Leave">Earned Leave (EL)</option>
                    <option value="Compensatory Leave">Compensatory Leave</option>
                    <option value="Unpaid Leave (LOP)">Unpaid Leave (LOP)</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      From Date *
                    </label>
                    <input
                      type="date"
                      value={applyForm.fromDate}
                      onChange={(e) => {
                        const newFrom = e.target.value;
                        setApplyForm(prev => ({
                          ...prev,
                          fromDate: newFrom,
                          toDate: prev.toDate < newFrom ? newFrom : prev.toDate
                        }));
                      }}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      To Date *
                    </label>
                    <input
                      type="date"
                      value={applyForm.toDate}
                      min={applyForm.fromDate}
                      onChange={(e) => setApplyForm({ ...applyForm, toDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                      required
                    />
                  </div>
                </div>

                {/* Half Day & Pay Type */}
                <div className="flex items-center justify-between p-3 bg-purple-50/70 border border-purple-200/60 rounded-[3px]">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={applyForm.halfDay}
                      onChange={(e) => setApplyForm({ ...applyForm, halfDay: e.target.checked })}
                      className="w-4 h-4 text-[#5a52d7] rounded focus:ring-0"
                    />
                    Half Day Leave
                  </label>

                  <div className="text-right">
                    <span className="text-xs text-gray-500 mr-2">Duration:</span>
                    <span className="font-bold text-[#5a52d7] bg-white px-2.5 py-1 rounded border border-purple-200 text-xs">
                      {getCalculatedDays(applyForm.fromDate, applyForm.toDate, applyForm.halfDay).toFixed(1)} Day(s)
                    </span>
                  </div>
                </div>

                {/* Pay Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Salary Pay Type
                  </label>
                  <select
                    value={applyForm.payType}
                    onChange={(e) => setApplyForm({ ...applyForm, payType: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                  >
                    <option value="Paid">Paid Leave</option>
                    <option value="Unpaid (LOP)">Unpaid (Loss of Pay - LOP)</option>
                  </select>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Reason for Leave *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the reason for leave (e.g. fever, family emergency, personal work)..."
                    value={applyForm.reason}
                    onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#5a52d7]"
                    required
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Emergency Contact Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={applyForm.contact}
                    onChange={(e) => setApplyForm({ ...applyForm, contact: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-[#fafafa]">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-semibold rounded-[3px] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#5a52d7] hover:bg-[#4a42c0] text-white font-semibold py-2 text-sm rounded-[3px] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Leave Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── EDIT LEAVE MODAL ─────────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {showEditModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="bg-white rounded-[4px] w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#fbfbfb]">
              <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" /> Edit Leave Application
              </h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-[14px]">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Leave Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Medical Leave">Medical Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Compensatory Leave">Compensatory Leave</option>
                    <option value="Unpaid Leave (LOP)">Unpaid Leave (LOP)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">From Date</label>
                    <input
                      type="date"
                      value={editForm.fromDate}
                      onChange={(e) => setEditForm({ ...editForm, fromDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">To Date</label>
                    <input
                      type="date"
                      value={editForm.toDate}
                      onChange={(e) => setEditForm({ ...editForm, toDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Pay Type</label>
                    <select
                      value={editForm.payType}
                      onChange={(e) => setEditForm({ ...editForm, payType: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid (LOP)">Unpaid (LOP)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Reason</label>
                  <textarea
                    rows={3}
                    value={editForm.reason}
                    onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#5a52d7]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-[#fafafa]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-semibold rounded-[3px] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-sm rounded-[3px] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── VIEW LEAVE MODAL ─────────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {showViewModal && selectedLeave && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowViewModal(false)}
        >
          <div 
            className="bg-white rounded-[4px] w-full max-w-md shadow-2xl overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#fbfbfb]">
              <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5a52d7]" /> Leave Request Details
              </h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Leave Type:</span>
                <span className="font-bold text-gray-800">{selectedLeave.type}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Requested Dates:</span>
                <span className="font-bold text-gray-800">{selectedLeave.dates || `${selectedLeave.fromDate} - ${selectedLeave.toDate}`}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Duration:</span>
                <span className="font-bold text-[#5a52d7]">{Number(selectedLeave.days || 1).toFixed(1)} Day(s)</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Pay Classification:</span>
                <span className="font-semibold text-gray-700">{selectedLeave.payType || 'Paid'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Current Status:</span>
                <span>{getStatusBadge(selectedLeave.status)}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block mb-1">Reason:</span>
                <p className="bg-gray-50 p-3 rounded text-gray-700 text-xs leading-relaxed">
                  {selectedLeave.reason || 'No detailed reason provided.'}
                </p>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-gray-100 bg-[#fafafa] flex justify-end">
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-[3px] transition-colors"
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

export default Leave;

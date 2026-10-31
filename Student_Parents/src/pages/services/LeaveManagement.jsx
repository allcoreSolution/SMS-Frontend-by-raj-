import React, { useState, useEffect } from 'react';
import {
  FileWarning,
  Plus,
  History,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCw,
  Search,
  Filter,
  Paperclip,
  Trash2,
  User,
  ShieldCheck,
  Building,
  Info,
  Check,
  X,
  FileText,
  AlertTriangle
} from 'lucide-react';
import parentService from '../../api/parentService';

export default function LeaveManagement({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Apply Modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const [form, setForm] = useState({
    leaveType: 'Medical / Sick Leave',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null
  });

  // Fetch Leave Dashboard Data
  const fetchLeaves = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const params = {};
      if (activeChild) params.studentId = activeChild;

      const res = await parentService.getStudentLeaves(params);
      if (res && res.success && res.data) {
        setDashboardData(res.data);
      } else {
        setError('Failed to load leave records');
      }
    } catch (err) {
      console.error('Error fetching student leaves:', err);
      setError(err?.response?.data?.message || err?.message || 'Error connecting to Leave API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [activeChild]);

  // Compute Days between dates
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (e < s) return 0;
    const diff = Math.abs(e - s);
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculatedDays = calculateDays(form.startDate, form.endDate);

  // Handle Form Submit
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!form.leaveType) {
      alert('Please select a leave category');
      return;
    }
    if (!form.startDate || !form.endDate) {
      alert('Please specify both start date and end date');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert('End date cannot be earlier than start date');
      return;
    }
    if (!form.reason.trim()) {
      alert('Please provide a reason for the leave');
      return;
    }

    try {
      setSubmitting(true);
      const studentId = dashboardData?.student?.id || activeChild;

      let payload;
      if (form.attachment) {
        payload = new FormData();
        payload.append('studentId', studentId);
        payload.append('leaveType', form.leaveType);
        payload.append('startDate', form.startDate);
        payload.append('endDate', form.endDate);
        payload.append('reason', form.reason);
        payload.append('document', form.attachment);
      } else {
        payload = {
          studentId,
          leaveType: form.leaveType,
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason
        };
      }

      const res = await parentService.applyStudentLeave(payload);
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: res.message || 'Leave application submitted successfully!'
        });
        setApplyModalOpen(false);
        setForm({
          leaveType: 'Medical / Sick Leave',
          startDate: '',
          endDate: '',
          reason: '',
          attachment: null
        });
        fetchLeaves(true);
      } else {
        alert(res?.message || 'Failed to submit leave application');
      }
    } catch (err) {
      console.error('Error applying for leave:', err);
      alert(err?.response?.data?.message || 'Error submitting leave application');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Withdraw
  const handleWithdraw = async (leaveId, leaveCode) => {
    if (!window.confirm(`Are you sure you want to withdraw Leave Application #${leaveCode}?`)) {
      return;
    }

    try {
      setWithdrawingId(leaveId);
      const res = await parentService.withdrawStudentLeave(leaveId);
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: res.message || 'Leave application withdrawn successfully.'
        });
        fetchLeaves(true);
      } else {
        alert(res?.message || 'Failed to withdraw leave application');
      }
    } catch (err) {
      console.error('Error withdrawing leave:', err);
      alert(err?.response?.data?.message || 'Error withdrawing leave');
    } finally {
      setWithdrawingId(null);
    }
  };

  const student = dashboardData?.student || { name: "—", admissionNo: "—", className: "—", fatherName: "—" };

  const stats = dashboardData?.stats || { totalAllowed: 0, leavesTaken: 0, pendingCount: 0, available: 0, approvedCount: 0, rejectedCount: 0 };

  const leaves = dashboardData?.leaves || [];
  const guidelines = dashboardData?.guidelines || [
    'Leave applications should be submitted at least 24 hours in advance.',
    'Medical absences exceeding 2 consecutive days mandate submitting a doctor certificate.',
    'Attendance during Periodic Assessments and Term Examinations is compulsory.'
  ];

  const leaveTypes = dashboardData?.leaveTypes || [
    { id: 'med', label: 'Medical / Sick Leave' },
    { id: 'fam', label: 'Family Function / Urgent Domestic' },
    { id: 'comp', label: 'Academic Olympiad / Sports Event' },
    { id: 'emerg', label: 'Emergency / Compassionate' },
    { id: 'other', label: 'Other Special Absence' }
  ];

  // Filtered Leaves
  const filteredLeaves = leaves.filter((item) => {
    const matchStatus =
      statusFilter === 'ALL' || item.status?.toUpperCase() === statusFilter;
    const matchSearch =
      !searchQuery.trim() ||
      item.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leaveType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leaveCode?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-full flex flex-col p-3 sm:p-5 space-y-5 pb-24 bg-slate-50">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900/95 backdrop-blur text-white text-xs font-bold rounded-2xl shadow-xl border border-white/20 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-3 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. HEADER SECTION (Royal Blue Gradient Hero)              */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-blue-400/20 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Glow circle */}
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
              Services & Resources
            </span>
            <span className="text-blue-300/60">•</span>
            <span className="text-[10px] font-bold text-amber-300 bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-0.5 rounded-full">
              Digital Absence Gate
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
            Student Leave Management
          </h1>
          <p className="text-[12px] text-blue-100 mt-1">
            Submit, track, and monitor digital absence permissions for{' '}
            <strong className="text-white">{student.name || 'Kabir Singh'}</strong> ({student.className || 'Class 10th (A)'} • Adm: #{student.admissionNo || 'STU-2024-101'})
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0 relative z-10">
          <button
            onClick={() => fetchLeaves(true)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
            title="Refresh Leave Records"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setApplyModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Apply Leave
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. STATS & LEAVE BALANCE CARDS                            */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Annual Quota
            </span>
            <span className="text-xl font-black text-slate-900 leading-tight">{stats.totalAllowed} Days</span>
            <span className="text-[10px] text-slate-500 block">Session Allowance</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Leaves Availed
            </span>
            <span className="text-xl font-black text-indigo-900 leading-tight">{stats.leavesTaken} Days</span>
            <span className="text-[10px] text-indigo-600 font-semibold block">{stats.approvedCount} approved absences</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pending Review
            </span>
            <span className="text-xl font-black text-amber-700 leading-tight">{stats.pendingCount}</span>
            <span className="text-[10px] text-amber-600 font-semibold block">Under Teacher Review</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Available Balance
            </span>
            <span className="text-xl font-black text-emerald-700 leading-tight">{stats.available} Days</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Remaining in quota</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE: HISTORY & GUIDELINES                   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: Applications List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-2xl shadow-inner">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {st === 'ALL' ? `All (${leaves.length})` : st}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reason or ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:bg-white focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Records List Container */}
          {loading ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-3 shadow-xs min-h-[350px]">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-sm font-bold text-slate-800">Loading Student Leave Records...</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Fetching leave history and balance quota from Central School ERP.
              </p>
            </div>
          ) : error ? (
            <div className="bg-white border border-rose-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-3 shadow-xs">
              <AlertCircle className="w-10 h-10 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-800">{error}</h3>
              <button
                onClick={() => fetchLeaves(true)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-3 shadow-xs">
              <FileWarning className="w-12 h-12 text-slate-300" strokeWidth={1.5} />
              <h3 className="text-sm font-bold text-slate-800">No Leave Applications Found</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'No applications match your active filter criteria.'
                  : 'You have not submitted any leave applications for your student.'}
              </p>
              <button
                onClick={() => setApplyModalOpen(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Apply Leave Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLeaves.map((lve) => {
                const isPending = lve.status === 'Pending';
                const isApproved = lve.status === 'Approved';
                const isRejected = lve.status === 'Rejected';

                const sDate = new Date(lve.startDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                const eDate = new Date(lve.endDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <div
                    key={lve._id}
                    className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                          #{lve.leaveCode || `LVE-${lve._id?.slice(-4)}`}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {lve.leaveType}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold">
                          ({lve.daysCount || 1} Day{lve.daysCount > 1 ? 's' : ''})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : isPending
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {lve.status}
                        </span>

                        {isPending && (
                          <button
                            type="button"
                            disabled={withdrawingId === lve._id}
                            onClick={() => handleWithdraw(lve._id, lve.leaveCode)}
                            className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 text-[10px] font-bold transition-colors flex items-center gap-1"
                            title="Withdraw Application"
                          >
                            <Trash2 className="w-3 h-3" />
                            {withdrawingId === lve._id ? 'Withdrawing...' : 'Withdraw'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Date Window & Reason */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                        <span className="font-bold text-gray-900">
                          {sDate} {sDate !== eDate ? ` → ${eDate}` : ''}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-[11px] text-gray-500">
                          Applied by {lve.appliedBy || 'Parent'}
                        </span>
                      </div>

                      <p className="text-gray-800 bg-gray-50/70 p-2.5 border border-gray-100 font-medium leading-relaxed">
                        "{lve.reason}"
                      </p>

                      {lve.remarks && (
                        <div className="flex items-start gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/60 p-2 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Faculty Remark:</strong> {lve.remarks}
                          </span>
                        </div>
                      )}

                      {lve.attachmentUrl && (
                        <div className="pt-1">
                          <a
                            href={`http://localhost:5050/${lve.attachmentUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 hover:bg-indigo-100 transition-colors"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span>View Medical Certificate Attachment</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT 1 COL: Guidelines & Class Teacher Panel */}
        <div className="space-y-4">
          
          {/* Class Teacher Panel */}
          <div className="bg-white border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <User className="w-4 h-4 text-orange-600" />
              <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider">
                Reviewing Faculty
              </h3>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Class Teacher</span>
                <span className="font-bold text-gray-900 block text-sm">Mrs. Anita Roy</span>
                <span className="text-[11px] text-gray-500">Class I - Section A Primary Wing</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Staff Room Venue</span>
                <span className="font-medium text-gray-800">Primary Block, 1st Floor (#F-12)</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Academic Secretariat</span>
                <span className="font-medium text-indigo-700">+91 11 2808 9015 (Ext. 104)</span>
              </div>
            </div>
          </div>

          {/* Absence Guidelines */}
          <div className="bg-white border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Info className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider">
                Attendance Rules & Guidelines
              </h3>
            </div>

            <ul className="text-xs text-gray-600 space-y-2.5">
              {guidelines.map((g, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-1.5"></span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Support Box */}
          <div className="bg-orange-50/60 border border-orange-200 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-orange-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span>Exam / Assessment Absences</span>
            </div>
            <p className="text-[11px] text-orange-950 leading-relaxed">
              Absence during Periodic Assessments (PA-1, Half-Yearly, Term-2) requires direct prior sanction from the Principal Dr. Rajeshwar Sen.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. MODAL: APPLY STUDENT LEAVE                             */}
      {/* ========================================================= */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-300 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#353A40] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Apply Student Leave
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-5 space-y-4 text-xs">
              
              {/* Student Context Readonly */}
              <div className="bg-gray-50 border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Student</span>
                  <span className="font-bold text-gray-900 text-sm">{student.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Class & Admission</span>
                  <span className="font-semibold text-gray-700">{student.className} • #{student.admissionNo}</span>
                </div>
              </div>

              {/* Leave Category */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Leave Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.leaveType}
                  onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-hidden focus:bg-white focus:border-indigo-600"
                >
                  {leaveTypes.map((t) => (
                    <option key={t.id || t.label} value={t.label}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Leave From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Leave To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-hidden focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Calculated Days Notice */}
              {calculatedDays > 0 && (
                <div className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs flex items-center justify-between">
                  <span>Calculated Absence Duration:</span>
                  <span className="font-mono bg-indigo-600 text-white px-2 py-0.5 text-[11px]">
                    {calculatedDays} Day{calculatedDays > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Reason for Leave */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Reason for Absence <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the specific reason (e.g. viral flu, medical appointment, out-of-station travel)..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 text-xs focus:outline-hidden focus:bg-white focus:border-indigo-600 leading-relaxed"
                />
              </div>

              {/* Optional Medical Slip / Certificate Upload */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Medical Certificate / Attachment (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setForm({ ...form, attachment: e.target.files[0] });
                    }
                  }}
                  className="w-full p-2 bg-gray-50 border border-gray-200 text-xs focus:outline-hidden"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Supported formats: PDF, JPG, PNG (Max 5MB). Recommended for medical leave &gt; 2 days.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Leave Application'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

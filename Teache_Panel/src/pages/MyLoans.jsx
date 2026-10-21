import React, { useState, useEffect } from 'react';
import {
  Users, CalendarDays, CreditCard, Plus, History,
  Wallet, Clock, TrendingDown, Eye, FileText, X, CheckCircle,
  AlertCircle, Calendar, RefreshCw, Trash2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { loanService } from '../api/loanService';
import { leaveService } from '../api/leaveService';
import { attendanceService } from '../api/attendanceService';

const StatCard = ({ icon: Icon, label, value, iconBg }) => (
  <div className="bg-white border border-gray-200 shadow-sm p-5 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-black text-gray-800 mt-0.5">{value}</p>
    </div>
  </div>
);

const applyTabs = ['Attendance', 'Apply Leave', 'Loans'];

const formatCurrency = (val) => {
  const num = Number(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[d.getMonth()]}, ${d.getFullYear()}`;
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Active':
    case 'Approved':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Closed':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-green-100 text-green-700 border-green-200';
  }
};

const getAttStatusBadgeClass = (status) => {
  switch (status) {
    case 'Present':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Late':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Half Day':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Absent':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const MyLoans = () => {
  const [activeTab, setActiveTab] = useState('Loans');
  
  // Loans state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [form, setForm] = useState({ amount: '', duration: '6', reason: '', type: 'Loan' });
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [submittingLoan, setSubmittingLoan] = useState(false);
  const [loans, setLoans] = useState([]);
  const [loanStats, setLoanStats] = useState({
    activeLoanAmount: 0,
    remainingBalance: 0,
    monthlyEmiDeduction: 0,
  });

  // Leaves state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leavesList, setLeavesList] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Casual Leave (CL)',
    startDate: '',
    endDate: '',
    reason: '',
    halfDay: false
  });

  // Attendance state
  const [attendanceData, setAttendanceData] = useState({
    summary: { present: 0, absent: 0, late: 0, halfDay: 0, totalWorkingDays: 0, percentage: '0%' },
    records: []
  });
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // 1. Fetch Loans Data
  const fetchLoansData = async () => {
    try {
      setLoadingLoans(true);
      const res = await loanService.getLoans();
      if (res && res.success) {
        setLoans(res.data || []);
        if (res.stats) {
          setLoanStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching teacher loans:', err);
    } finally {
      setLoadingLoans(false);
    }
  };

  // 2. Fetch Leaves Data
  const fetchLeavesData = async () => {
    try {
      setLoadingLeaves(true);
      const res = await leaveService.getTeacherLeaves();
      if (res && res.success) {
        setLeavesList(res.data || []);
        setLeaveBalances(res.balances || []);
      }
    } catch (err) {
      console.error('Error fetching teacher leaves:', err);
    } finally {
      setLoadingLeaves(false);
    }
  };

  // 3. Fetch Attendance Data
  const fetchAttendanceData = async () => {
    try {
      setLoadingAttendance(true);
      const res = await attendanceService.getTeacherAttendance();
      if (res && res.success) {
        setAttendanceData({
          summary: res.summary || {},
          records: res.records || []
        });
      }
    } catch (err) {
      console.error('Error fetching teacher attendance:', err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchLoansData();
    fetchLeavesData();
    fetchAttendanceData();
  }, []);

  // Loan Submit
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Please enter a valid amount greater than 0.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    try {
      setSubmittingLoan(true);
      const res = await loanService.applyLoan({
        amount: Number(form.amount),
        duration: Number(form.duration),
        reason: form.reason,
        type: form.type
      });

      if (res && res.success) {
        setShowApplyModal(false);
        setForm({ amount: '', duration: '6', reason: '', type: 'Loan' });

        Swal.fire({
          icon: 'success',
          title: 'Application Submitted',
          text: 'Your application has been submitted successfully and is pending administrative approval.',
          confirmButtonColor: '#4f46e5'
        });

        await fetchLoansData();
      }
    } catch (err) {
      console.error('Error applying for loan:', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err?.response?.data?.message || 'Could not submit application. Please try again.',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setSubmittingLoan(false);
    }
  };

  const handleOpenSchedule = (loan) => {
    setSelectedLoan(loan);
    setShowScheduleModal(true);
  };

  // Leave Submit
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Dates Required',
        text: 'Please select both start and end dates.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    try {
      setSubmittingLeave(true);
      const res = await leaveService.applyLeave({
        applicantType: 'Staff',
        leaveType: leaveForm.leaveType,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason
      });

      if (res && res.success) {
        setShowLeaveModal(false);
        setLeaveForm({
          leaveType: 'Casual Leave (CL)',
          startDate: '',
          endDate: '',
          reason: '',
          halfDay: false
        });

        Swal.fire({
          icon: 'success',
          title: 'Leave Request Sent',
          text: 'Your leave application has been submitted successfully.',
          confirmButtonColor: '#4f46e5'
        });

        await fetchLeavesData();
      }
    } catch (err) {
      console.error('Error applying for leave:', err);
      Swal.fire({
        icon: 'error',
        title: 'Application Failed',
        text: err?.response?.data?.message || 'Could not submit leave request.',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setSubmittingLeave(false);
    }
  };

  const handleWithdrawLeave = (leave) => {
    Swal.fire({
      title: 'Withdraw Leave Request?',
      text: `Are you sure you want to withdraw your ${leave.leaveType} request?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, Withdraw'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await leaveService.deleteLeave(leave._id);
          Swal.fire({
            icon: 'success',
            title: 'Withdrawn',
            text: 'Leave application has been withdrawn.',
            timer: 1500,
            showConfirmButton: false
          });
          fetchLeavesData();
        } catch (err) {
          Swal.fire('Error', 'Failed to withdraw leave application.', 'error');
        }
      }
    });
  };

  const activeSchedule = (selectedLoan?.repaymentSchedule && selectedLoan.repaymentSchedule.length > 0)
    ? selectedLoan.repaymentSchedule.map((s, i) => ({
        month: s.month || `Month ${i + 1}`,
        dueDate: s.dueDate || '',
        emi: typeof s.emi === 'number' ? formatCurrency(s.emi) : s.emi,
        status: s.status || 'Pending'
      }))
    : [];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-gray-800">Human Resource</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage staff, <span className="text-blue-500">attendance</span>,{' '}
          <span className="text-blue-500">leaves</span>,{' '}
          <span className="text-blue-500">payroll</span>, and{' '}
          <span className="text-blue-500">loans</span> across the school.
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-0 mt-5">
          {applyTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab === 'Attendance' && <Users className="w-4 h-4" />}
              {tab === 'Apply Leave' && <CalendarDays className="w-4 h-4" />}
              {tab === 'Loans' && <CreditCard className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* ===== Loans Tab ===== */}
        {activeTab === 'Loans' && (
          <>
            {/* Apply Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 flex items-center gap-2 text-sm transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Apply for Loan / Advance
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={Wallet}
                label="Active Loan Amount"
                value={formatCurrency(loanStats.activeLoanAmount)}
                iconBg="bg-indigo-100 text-indigo-500"
              />
              <StatCard
                icon={Clock}
                label="Remaining Balance"
                value={formatCurrency(loanStats.remainingBalance)}
                iconBg="bg-orange-100 text-orange-500"
              />
              <StatCard
                icon={TrendingDown}
                label="Monthly EMI Deduction"
                value={formatCurrency(loanStats.monthlyEmiDeduction)}
                iconBg="bg-emerald-100 text-emerald-500"
              />
            </div>

            {/* Loan History Table */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <History className="w-4 h-4 text-indigo-500" />
                <h2 className="text-base font-bold text-gray-800">Loan Application History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200" style={{borderCollapse:'collapse'}}>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Application Date</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Requested Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Duration</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Monthly EMI</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Remaining Balance</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((row, i) => (
                      <tr key={row._id || i} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-4 py-3 text-gray-700 font-medium border border-gray-200">{formatDate(row.createdAt || row.disbursementDate)}</td>
                        <td className="px-4 py-3 text-gray-800 font-semibold border border-gray-200">{formatCurrency(row.amount)}</td>
                        <td className="px-4 py-3 text-gray-600 border border-gray-200">{row.repaymentMonths || 6} Months</td>
                        <td className="px-4 py-3 text-gray-700 border border-gray-200">{formatCurrency(row.monthlyDeduction || Math.round(row.amount / (row.repaymentMonths || 6)))}</td>
                        <td className="px-4 py-3 text-orange-500 font-bold border border-gray-200">{formatCurrency(row.remainingAmount ?? row.amount)}</td>
                        <td className="px-4 py-3 border border-gray-200">
                          <span className={`text-xs font-bold px-3 py-1 border ${getStatusBadgeClass(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 border border-gray-200">
                          <button
                            onClick={() => handleOpenSchedule(row)}
                            className="flex items-center gap-1.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 border border-gray-200 hover:border-indigo-200 px-3 py-1.5 text-xs font-semibold transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            View Schedule
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loans.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No loan applications found.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ===== Attendance Tab ===== */}
        {activeTab === 'Attendance' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={CheckCircle}
                label="Present Days"
                value={attendanceData.summary?.present ?? 0}
                iconBg="bg-emerald-100 text-emerald-500"
              />
              <StatCard
                icon={AlertCircle}
                label="Absent Days"
                value={attendanceData.summary?.absent ?? 0}
                iconBg="bg-rose-100 text-rose-500"
              />
              <StatCard
                icon={Clock}
                label="Late Arrivals"
                value={attendanceData.summary?.late ?? 0}
                iconBg="bg-amber-100 text-amber-500"
              />
              <StatCard
                icon={TrendingDown}
                label="Monthly Average"
                value={attendanceData.summary?.percentage || '0%'}
                iconBg="bg-indigo-100 text-indigo-500"
              />
            </div>

            {/* Attendance Records Table */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-base font-bold text-gray-800">Monthly Attendance Report — October 2026</h2>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                  Total Working Days: {attendanceData.summary?.totalWorkingDays || 0}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200" style={{borderCollapse:'collapse'}}>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Day</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Check In</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Check Out</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.records.map((row, i) => (
                      <tr key={row._id || i} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-4 py-3 text-gray-700 font-medium border border-gray-200">{formatDate(row.date)}</td>
                        <td className="px-4 py-3 text-gray-600 border border-gray-200">{row.day || 'Weekday'}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium font-mono text-xs border border-gray-200">{row.checkIn || '—'}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium font-mono text-xs border border-gray-200">{row.checkOut || '—'}</td>
                        <td className="px-4 py-3 border border-gray-200">
                          <span className={`text-xs font-bold px-3 py-1 border ${getAttStatusBadgeClass(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs border border-gray-200">{row.remarks || 'Regular Shift'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {attendanceData.records.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No attendance records found for this period.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== Apply Leave Tab ===== */}
        {activeTab === 'Apply Leave' && (
          <div className="space-y-6">
            {/* Top Action Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowLeaveModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 flex items-center gap-2 text-sm transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Apply for Leave
              </button>
            </div>

            {/* Leave Balances Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={CalendarDays}
                label="Casual Leave (CL)"
                value={`${leaveBalances[0]?.remaining ?? 9} / ${leaveBalances[0]?.total ?? 12} Left`}
                iconBg="bg-blue-100 text-blue-500"
              />
              <StatCard
                icon={AlertCircle}
                label="Medical Leave (ML)"
                value={`${leaveBalances[1]?.remaining ?? 9} / ${leaveBalances[1]?.total ?? 10} Left`}
                iconBg="bg-emerald-100 text-emerald-500"
              />
              <StatCard
                icon={Wallet}
                label="Earned Leave (EL)"
                value={`${leaveBalances[2]?.remaining ?? 11} / ${leaveBalances[2]?.total ?? 15} Left`}
                iconBg="bg-indigo-100 text-indigo-500"
              />
            </div>

            {/* Leave Applications History */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <History className="w-4 h-4 text-indigo-500" />
                <h2 className="text-base font-bold text-gray-800">My Leave Applications</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200" style={{borderCollapse:'collapse'}}>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Leave Type</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">From Date</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">To Date</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Duration</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Reason</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-indigo-600 uppercase tracking-wider border border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leavesList.map((row, i) => {
                      const days = row.startDate && row.endDate
                        ? Math.max(1, Math.ceil((new Date(row.endDate) - new Date(row.startDate)) / (1000 * 60 * 60 * 24)) + 1)
                        : 1;
                      return (
                        <tr key={row._id || i} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-4 py-3 text-gray-800 font-semibold border border-gray-200">{row.leaveType}</td>
                          <td className="px-4 py-3 text-gray-700 font-medium border border-gray-200">{formatDate(row.startDate)}</td>
                          <td className="px-4 py-3 text-gray-700 font-medium border border-gray-200">{formatDate(row.endDate)}</td>
                          <td className="px-4 py-3 text-gray-600 border border-gray-200">{days} Day{days > 1 ? 's' : ''}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs border border-gray-200 max-w-xs truncate">{row.reason}</td>
                          <td className="px-4 py-3 border border-gray-200">
                            <span className={`text-xs font-bold px-3 py-1 border ${getStatusBadgeClass(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 border border-gray-200">
                            {row.status === 'Pending' ? (
                              <button
                                onClick={() => handleWithdrawLeave(row)}
                                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 text-xs font-semibold transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Withdraw
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No action</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {leavesList.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No leave applications found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ===== Apply for Loan Modal ===== */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-500" /> Apply for Loan / Advance
              </h2>
              <button onClick={() => setShowApplyModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleApplySubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Loan">Loan</option>
                    <option value="Advance Salary">Advance Salary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    required
                    min="1"
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Repayment Duration</label>
                  <select
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {[3, 6, 9, 12, 18, 24].map(m => (
                      <option key={m} value={m}>{m} Months</option>
                    ))}
                  </select>
                </div>
                {form.amount && form.duration && (
                  <div className="bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm">
                    <p className="text-indigo-700 font-semibold">
                      Monthly EMI: ₹{(Number(form.amount) / Number(form.duration)).toFixed(2)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Reason</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe the reason..."
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={submittingLoan}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition-colors disabled:opacity-50"
                >
                  {submittingLoan ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Apply for Leave Modal ===== */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLeaveModal(false)}>
          <div className="bg-white w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-500" /> Apply for Leave
              </h2>
              <button onClick={() => setShowLeaveModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleLeaveSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Leave Type</label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                    <option value="Medical Leave (ML)">Medical Leave (ML)</option>
                    <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                    <option value="Duty Leave (DL)">Duty Leave (DL)</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">From Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.startDate}
                      onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">To Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.endDate}
                      onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
                {leaveForm.startDate && leaveForm.endDate && (
                  <div className="bg-indigo-50 border border-indigo-100 px-4 py-2.5 text-xs text-indigo-700 font-semibold flex items-center justify-between">
                    <span>Total Leave Days:</span>
                    <span className="text-sm font-bold">
                      {Math.max(1, Math.ceil((new Date(leaveForm.endDate) - new Date(leaveForm.startDate)) / (1000 * 60 * 60 * 24)) + 1)} Day(s)
                    </span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Reason</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="State the reason for leave..."
                    value={leaveForm.reason}
                    onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={submittingLeave}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-sm transition-colors disabled:opacity-50"
                >
                  {submittingLeave ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-5 border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EMI Schedule Modal ===== */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" /> EMI Repayment Schedule
              </h2>
              <button onClick={() => setShowScheduleModal(false)} className="p-1.5 hover:bg-gray-100 text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm border border-gray-200" style={{borderCollapse:'collapse'}}>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border border-gray-200">Installment</th>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border border-gray-200">Due Date</th>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border border-gray-200">EMI Amount</th>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSchedule.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700 font-medium border border-gray-200">{row.month}</td>
                      <td className="px-4 py-3 text-gray-600 border border-gray-200">{row.dueDate}</td>
                      <td className="px-4 py-3 text-gray-800 font-semibold border border-gray-200">{row.emi}</td>
                      <td className="px-4 py-3 border border-gray-200">
                        <span className={`text-xs font-bold px-2 py-0.5 ${
                          row.status === 'Paid' ? 'bg-green-100 text-green-700' :
                          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Total Loan: {formatCurrency(selectedLoan?.amount)} | Paid: {formatCurrency(selectedLoan?.totalRepaid)} | Remaining: {formatCurrency(selectedLoan?.remainingAmount ?? selectedLoan?.amount)}
              </p>
              <button onClick={() => setShowScheduleModal(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 text-sm font-semibold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyLoans;

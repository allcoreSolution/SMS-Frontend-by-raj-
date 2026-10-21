import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Send, HandCoins, Plus, Hourglass, Coins, History, 
  Calendar, CheckCircle2, Clock, Trash2, Edit, Search, 
  X, Save, Calculator, RefreshCw, ChevronRight, FileText
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, subtext }) => (
  <div className="bg-white p-4 sm:p-5 rounded-[3px] border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
    <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[11px] font-semibold text-[#777] uppercase tracking-wider">{label}</span>
      <span className="text-[22px] font-bold text-[#222] leading-tight mt-1 truncate">{value}</span>
      {subtext && <span className="text-[11px] text-gray-400 mt-0.5 truncate">{subtext}</span>}
    </div>
  </div>
);

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Form states
  const [applyForm, setApplyForm] = useState({
    type: 'Personal Loan',
    applicantName: 'Rajesh Kumar (Accountant)',
    amount: '',
    duration: '12',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    purpose: '',
  });

  const [editForm, setEditForm] = useState({
    id: '',
    type: 'Personal Loan',
    amount: '',
    duration: '12',
    remaining: '',
    status: 'Pending',
    purpose: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Load loans
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await accountantService.getLoans();
      if (res.success && Array.isArray(res.data)) {
        setLoans(res.data);
      }
    } catch (err) {
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Real-time calculated summary stats
  const activeLoans = loans.filter(l => l.status === 'Active' || l.status === 'Approved');
  
  const totalActiveAmount = activeLoans.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const totalRemainingBalance = loans
    .filter(l => l.status !== 'Rejected' && l.status !== 'Completed')
    .reduce((sum, l) => sum + (Number(l.remaining) || 0), 0);
  const totalMonthlyEmi = activeLoans.reduce((sum, l) => sum + (Number(l.emi) || 0), 0);

  // Filtered loans
  const filteredLoans = loans.filter((l) => {
    const matchesStatus = statusFilter === 'ALL' || (l.status && l.status.toLowerCase() === statusFilter.toLowerCase());
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      (l.type && l.type.toLowerCase().includes(q)) ||
      (l.purpose && l.purpose.toLowerCase().includes(q)) ||
      (l.reason && l.reason.toLowerCase().includes(q)) ||
      (l.applicantName && l.applicantName.toLowerCase().includes(q)) ||
      (String(l.amount).includes(q));
    return matchesStatus && matchesSearch;
  });

  // Calculate EMI helper for apply form
  const getCalculatedApplyEmi = () => {
    const amt = Number(applyForm.amount) || 0;
    const dur = Number(applyForm.duration) || 12;
    return dur > 0 && amt > 0 ? (amt / dur).toFixed(2) : '0.00';
  };

  // ── CREATE / APPLY LOAN ──────────────────────────────────
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.amount || Number(applyForm.amount) <= 0) {
      return Swal.fire('Error', 'Please enter a valid loan amount', 'error');
    }
    if (!applyForm.purpose.trim()) {
      return Swal.fire('Error', 'Please enter the reason/purpose for the loan', 'error');
    }

    setSubmitting(true);
    try {
      const emi = Math.round(Number(applyForm.amount) / Number(applyForm.duration));
      const res = await accountantService.applyLoan({
        type: applyForm.type,
        applicantName: applyForm.applicantName,
        amount: Number(applyForm.amount),
        tenureMonths: Number(applyForm.duration),
        duration: `${applyForm.duration} Months`,
        emi: emi,
        remaining: Number(applyForm.amount),
        paidAmount: 0,
        status: applyForm.status || 'Pending',
        purpose: applyForm.purpose,
        reason: applyForm.purpose,
        date: applyForm.date,
      });

      if (res.success || res) {
        Swal.fire({
          title: 'Success!',
          text: 'Loan application submitted successfully.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false,
        });
        setShowApplyModal(false);
        setApplyForm({
          type: 'Personal Loan',
          applicantName: 'Rajesh Kumar (Accountant)',
          amount: '',
          duration: '12',
          date: new Date().toISOString().split('T')[0],
          status: 'Pending',
          purpose: '',
        });
        fetchLoans();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── EDIT LOAN ─────────────────────────────────────────────
  const openEditModal = (loan) => {
    const months = loan.tenureMonths || parseInt(loan.duration) || 12;
    setEditForm({
      id: loan.id || loan._id,
      type: loan.type || 'Personal Loan',
      amount: loan.amount || '',
      duration: String(months),
      remaining: loan.remaining !== undefined ? loan.remaining : loan.amount,
      status: loan.status || 'Pending',
      purpose: loan.purpose || loan.reason || '',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.amount || Number(editForm.amount) <= 0) {
      return Swal.fire('Error', 'Please enter a valid loan amount', 'error');
    }

    setSubmitting(true);
    try {
      const amt = Number(editForm.amount);
      const dur = Number(editForm.duration);
      const emi = Math.round(amt / dur);
      const rem = editForm.remaining !== '' ? Number(editForm.remaining) : amt;

      const res = await accountantService.updateLoan(editForm.id, {
        type: editForm.type,
        amount: amt,
        tenureMonths: dur,
        duration: `${dur} Months`,
        emi: emi,
        remaining: rem,
        status: rem === 0 ? 'Completed' : editForm.status,
        purpose: editForm.purpose,
        reason: editForm.purpose,
      });

      if (res.success || res) {
        Swal.fire({
          title: 'Updated!',
          text: 'Loan details updated successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        setShowEditModal(false);
        fetchLoans();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE LOAN ───────────────────────────────────────────
  const handleDeleteLoan = async (loan) => {
    const id = loan.id || loan._id;
    const confirm = await Swal.fire({
      title: 'Delete this Loan?',
      text: `Are you sure you want to delete ${loan.type || 'this loan'} of ₹${Number(loan.amount).toLocaleString('en-IN')}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await accountantService.deleteLoan(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Loan has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchLoans();
      } catch (err) {
        Swal.fire('Error', 'Could not delete this loan record.', 'error');
      }
    }
  };

  // ── VIEW SCHEDULE & REPAY EMI ─────────────────────────────
  const openScheduleModal = (loan) => {
    setSelectedLoan(loan);
    setShowScheduleModal(true);
  };

  const handlePayEmi = async () => {
    if (!selectedLoan) return;
    const emiAmount = Number(selectedLoan.emi) || Math.round((Number(selectedLoan.amount) || 0) / (Number(selectedLoan.tenureMonths) || 12));
    const confirm = await Swal.fire({
      title: 'Record EMI Repayment?',
      text: `Deduct monthly installment of ₹${emiAmount.toLocaleString('en-IN')} from remaining balance?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5a52d7',
      confirmButtonText: 'Yes, Record Payment',
    });

    if (confirm.isConfirmed) {
      try {
        const id = selectedLoan.id || selectedLoan._id;
        const res = await accountantService.repayLoanEmi(id, emiAmount);
        if (res.success && res.data) {
          setSelectedLoan(res.data);
          Swal.fire({
            title: 'Payment Recorded!',
            text: `₹${emiAmount.toLocaleString('en-IN')} paid successfully.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          fetchLoans();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to process installment repayment', 'error');
      }
    }
  };

  // Build schedule installments array for selected loan
  const generateScheduleRows = (loan) => {
    if (!loan) return [];
    const count = Number(loan.tenureMonths) || parseInt(loan.duration) || 6;
    const emiVal = Number(loan.emi) || (count > 0 ? Math.round(Number(loan.amount) / count) : 0);
    const totalAmount = Number(loan.amount) || 0;
    const remainingVal = Number(loan.remaining) !== undefined ? Number(loan.remaining) : totalAmount;
    const paidVal = totalAmount - remainingVal;
    const paidInstallmentsCount = emiVal > 0 ? Math.floor(paidVal / emiVal) : 0;

    const baseDate = loan.date ? new Date(loan.date) : new Date();

    return Array.from({ length: Math.min(count, 36) }, (_, i) => {
      const d = new Date(baseDate);
      d.setMonth(d.getMonth() + i + 1);
      const isPaid = i < paidInstallmentsCount;
      const isPending = i === paidInstallmentsCount && remainingVal > 0;
      return {
        month: `Month ${i + 1}`,
        dueDate: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        emi: `₹${emiVal.toLocaleString('en-IN')}`,
        status: isPaid ? 'Paid' : isPending ? 'Pending' : 'Upcoming',
      };
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-[3px]"><CheckCircle2 className="w-3 h-3" /> Active</span>;
      case 'Approved':
        return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-[3px]"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'Completed':
        return <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold px-2.5 py-0.5 rounded-[3px]"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-0.5 rounded-[3px]"><X className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-[3px]"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#333] mb-1 flex items-center gap-2">
            <HandCoins className="w-6 h-6 text-[#5a52d7]" /> Human Resource - Loans & Advances
          </h1>
          <p className="text-[13px] text-gray-500">
            Manage staff loan applications, salary advances, monthly EMI deductions, and repayment history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/loans/add"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-[3px] text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4 text-[#5a52d7]" /> Dedicated Form
          </Link>
          <button
            onClick={fetchLoans}
            title="Refresh Data"
            className="p-2 bg-white border border-gray-300 rounded-[3px] text-gray-600 hover:text-[#5a52d7] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#5a52d7]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex gap-6">
        <NavLink 
          to="/leave" 
          className="flex items-center gap-2 pb-3 px-1 text-[14px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          Apply Leave
        </NavLink>
        <NavLink 
          to="/loans" 
          className="flex items-center gap-2 pb-3 px-1 text-[14px] font-semibold text-[#5a52d7] border-b-2 border-[#5a52d7]"
        >
          <HandCoins className="w-4 h-4" />
          Loans & Advances
        </NavLink>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <StatCard 
          icon={HandCoins}
          iconBg="bg-purple-50"
          iconColor="text-[#5a52d7]"
          label="Active Loan Amount"
          value={`₹${totalActiveAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext={`${activeLoans.length} active application(s)`}
        />
        <StatCard
          icon={Hourglass}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          label="Remaining Balance"
          value={`₹${totalRemainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Total pending recovery across staff"
        />
        <StatCard
          icon={Coins}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Monthly EMI Deduction"
          value={`₹${totalMonthlyEmi.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Total monthly deduction from payroll"
        />
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-[3px] border border-gray-100 shadow-sm flex flex-col">
        {/* Panel Header & Actions */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#fdfdfd]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#5a52d7]" />
            <h2 className="text-[15px] font-bold text-[#333]">Loan Application History</h2>
            <span className="text-[12px] bg-purple-100 text-[#5a52d7] font-bold px-2 py-0.5 rounded-full ml-1">
              {filteredLoans.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search loans..."
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
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Apply Button */}
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-[#5a52d7] hover:bg-[#4a42c0] text-white px-4 py-1.5 rounded-[3px] flex items-center gap-2 text-[13px] font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Apply for Loan / Advance
            </button>
          </div>
        </div>
        
        {/* Loan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fc] text-[#5a52d7] text-[11px] font-bold tracking-[0.5px] uppercase border-b border-purple-100/60">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 border-l border-gray-100">Application Date</th>
                <th className="py-3.5 px-4 border-l border-gray-100">Type & Applicant</th>
                <th className="py-3.5 px-4 border-l border-gray-100 text-right">Amount</th>
                <th className="py-3.5 px-4 border-l border-gray-100 text-center">Duration</th>
                <th className="py-3.5 px-4 border-l border-gray-100 text-right">Monthly EMI</th>
                <th className="py-3.5 px-4 border-l border-gray-100">Repayment Progress</th>
                <th className="py-3.5 px-4 border-l border-gray-100 text-center">Status</th>
                <th className="py-3.5 px-4 border-l border-gray-100 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333] divide-y divide-gray-100">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan, idx) => {
                  const amt = Number(loan.amount) || 0;
                  const rem = loan.remaining !== undefined ? Number(loan.remaining) : amt;
                  const paid = Math.max(0, amt - rem);
                  const progressPct = amt > 0 ? Math.min(100, Math.round((paid / amt) * 100)) : 0;

                  return (
                    <tr key={loan.id || loan._id || idx} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-4 px-4 text-center text-gray-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 border-l border-gray-100 text-gray-600 font-medium">
                        {loan.date ? new Date(loan.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="py-4 px-4 border-l border-gray-100">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#333] flex items-center gap-1.5">
                            {loan.type || 'Personal Loan'}
                          </span>
                          <span className="text-[11px] text-gray-500 truncate max-w-[200px]" title={loan.purpose || loan.reason}>
                            {loan.purpose || loan.reason || loan.applicantName || 'Staff Loan'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-l border-gray-100 text-right font-bold text-[#222]">
                        ₹{amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 border-l border-gray-100 text-center text-gray-700">
                        <span className="bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                          {loan.duration || `${loan.tenureMonths || 12} Months`}
                        </span>
                      </td>
                      <td className="py-4 px-4 border-l border-gray-100 text-right font-semibold text-[#5a52d7]">
                        ₹{Number(loan.emi || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 border-l border-gray-100 min-w-[170px]">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[11px] font-semibold">
                            <span className="text-emerald-600">₹{paid.toLocaleString('en-IN')} paid</span>
                            <span className="text-orange-600">₹{rem.toLocaleString('en-IN')} left</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${progressPct === 100 ? 'bg-emerald-500' : 'bg-[#5a52d7]'}`} 
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 border-l border-gray-100 text-center">
                        {getStatusBadge(loan.status)}
                      </td>
                      <td className="py-4 px-4 border-l border-gray-100 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Schedule */}
                          <button
                            onClick={() => openScheduleModal(loan)}
                            title="Repayment Schedule & EMI"
                            className="p-1.5 text-gray-600 hover:text-[#5a52d7] hover:bg-purple-50 rounded transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(loan)}
                            title="Edit Loan"
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteLoan(loan)}
                            title="Delete Loan"
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                        <HandCoins className="w-7 h-7 text-[#5a52d7]" />
                      </div>
                      <h3 className="text-[15px] font-bold text-[#333] mb-1">
                        {search || statusFilter !== 'ALL' ? 'No matching loans found' : 'You have no loan history'}
                      </h3>
                      <p className="text-[13px] text-gray-500 max-w-sm mb-4">
                        {search || statusFilter !== 'ALL' 
                          ? 'Try adjusting your search query or status filter.' 
                          : 'Apply for a short-term advance or salary loan to manage unexpected expenses.'}
                      </p>
                      <button
                        onClick={() => setShowApplyModal(true)}
                        className="bg-[#5a52d7] hover:bg-[#4a42c0] text-white px-4 py-2 rounded-[3px] flex items-center gap-2 text-[13px] font-medium transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Apply for Loan / Advance
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
      {/* ── APPLY FOR LOAN MODAL ─────────────────────────────────────── */}
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
                <HandCoins className="w-5 h-5 text-[#5a52d7]" /> Apply for Loan / Advance
              </h2>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-[14px]">
                
                {/* Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Loan / Advance Type *
                  </label>
                  <select
                    value={applyForm.type}
                    onChange={(e) => setApplyForm({ ...applyForm, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                    required
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Salary Advance">Salary Advance</option>
                    <option value="Emergency Advance">Emergency Advance</option>
                    <option value="Medical Loan">Medical Loan</option>
                    <option value="Education Advance">Education Advance</option>
                    <option value="Home Appliance Loan">Home Appliance Loan</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Requested Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      min="500"
                      step="100"
                      value={applyForm.amount}
                      onChange={(e) => setApplyForm({ ...applyForm, amount: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                      required
                    />
                  </div>
                </div>

                {/* Repayment Tenure */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Repayment Duration *
                  </label>
                  <select
                    value={applyForm.duration}
                    onChange={(e) => setApplyForm({ ...applyForm, duration: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                    required
                  >
                    {[3, 6, 9, 12, 18, 24, 36].map((m) => (
                      <option key={m} value={m}>{m} Months</option>
                    ))}
                  </select>
                </div>

                {/* Live Monthly EMI Preview */}
                <div className="bg-purple-50/80 border border-purple-200/70 p-3.5 rounded-[3px] text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5a52d7] font-semibold flex items-center gap-1.5">
                      <Calculator className="w-4 h-4" /> Estimated Monthly EMI:
                    </span>
                    <span className="text-[17px] font-black text-[#5a52d7]">
                      ₹{getCalculatedApplyEmi()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Deducted from monthly payroll over {applyForm.duration} months.
                  </p>
                </div>

                {/* Application Date & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Application Date
                    </label>
                    <input
                      type="date"
                      value={applyForm.date}
                      onChange={(e) => setApplyForm({ ...applyForm, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Initial Status
                    </label>
                    <select
                      value={applyForm.status}
                      onChange={(e) => setApplyForm({ ...applyForm, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Active">Active</option>
                    </select>
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Reason / Purpose *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state the reason for this loan request..."
                    value={applyForm.purpose}
                    onChange={(e) => setApplyForm({ ...applyForm, purpose: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#5a52d7]"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-[#fafafa]">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-semibold rounded-[3px] hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#5a52d7] hover:bg-[#4a42c0] text-white font-semibold py-2 text-sm rounded-[3px] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── EDIT LOAN MODAL ─────────────────────────────────────────── */}
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
                <Edit className="w-5 h-5 text-blue-600" /> Edit Loan Details
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
                
                {/* Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Loan Type
                  </label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Salary Advance">Salary Advance</option>
                    <option value="Emergency Advance">Emergency Advance</option>
                    <option value="Medical Loan">Medical Loan</option>
                    <option value="Education Advance">Education Advance</option>
                    <option value="Home Appliance Loan">Home Appliance Loan</option>
                  </select>
                </div>

                {/* Amount & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Total Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Duration (Months)
                    </label>
                    <select
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                    >
                      {[3, 6, 9, 12, 18, 24, 36].map((m) => (
                        <option key={m} value={m}>{m} Months</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Remaining & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Remaining Balance (₹)
                    </label>
                    <input
                      type="number"
                      value={editForm.remaining}
                      onChange={(e) => setEditForm({ ...editForm, remaining: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm focus:outline-none focus:border-[#5a52d7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#5a52d7]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Reason / Purpose
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.purpose}
                    onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#5a52d7]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
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
      {/* ── EMI REPAYMENT SCHEDULE MODAL ─────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {showScheduleModal && selectedLoan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowScheduleModal(false)}
        >
          <div 
            className="bg-white rounded-[4px] w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#fbfbfb]">
              <div>
                <h2 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#5a52d7]" /> EMI Repayment Schedule
                </h2>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  {selectedLoan.type} • Requested ₹{Number(selectedLoan.amount).toLocaleString('en-IN')}
                </p>
              </div>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary Highlights */}
            <div className="grid grid-cols-3 gap-2 px-6 py-3 bg-purple-50/50 border-b border-purple-100 text-center text-xs">
              <div>
                <span className="text-gray-500 font-semibold uppercase">Total Loan</span>
                <p className="text-[14px] font-bold text-[#333] mt-0.5">
                  ₹{Number(selectedLoan.amount || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-gray-500 font-semibold uppercase">Paid</span>
                <p className="text-[14px] font-bold text-emerald-600 mt-0.5">
                  ₹{((Number(selectedLoan.amount) || 0) - (Number(selectedLoan.remaining) || 0)).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-gray-500 font-semibold uppercase">Remaining</span>
                <p className="text-[14px] font-bold text-orange-600 mt-0.5">
                  ₹{Number(selectedLoan.remaining || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Table of installments */}
            <div className="p-4 max-h-[55vh] overflow-y-auto">
              <table className="w-full text-left text-xs border border-gray-200 rounded overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-bold uppercase border-b border-gray-200">
                    <th className="px-3 py-2.5">Installment</th>
                    <th className="px-3 py-2.5">Due Date</th>
                    <th className="px-3 py-2.5 text-right">EMI Amount</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {generateScheduleRows(selectedLoan).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/60">
                      <td className="px-3 py-2.5 font-medium text-gray-700">{row.month}</td>
                      <td className="px-3 py-2.5 text-gray-500">{row.dueDate}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-gray-800">{row.emi}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          row.status === 'Paid' ? 'bg-green-100 text-green-700' :
                          row.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3.5 border-t border-gray-200 bg-[#fafafa] flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={handlePayEmi}
                disabled={Number(selectedLoan.remaining) <= 0}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[3px] flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Coins className="w-3.5 h-3.5" />
                Record EMI Payment (₹{Number(selectedLoan.emi || 0).toLocaleString('en-IN')})
              </button>

              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
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

export default Loans;

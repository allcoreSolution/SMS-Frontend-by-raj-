import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Plus, Search, CheckCircle2, Clock, 
  Trash2, RefreshCw, X, IndianRupee, AlertCircle, 
  User, Check, ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import HRTabs from '../../components/hr/HRTabs';
import { hrService } from '../../api/hrService';

export default function HRLoans() {
  const [loans, setLoans] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    staff: '',
    staffName: '',
    employeeCode: '',
    amount: 50000,
    interestRate: 0,
    repaymentMonths: 10,
    purpose: 'Personal Emergency'
  });

  useEffect(() => {
    fetchLoans();
    fetchStaff();
  }, [activeFilter]);

  const fetchStaff = async () => {
    try {
      const res = await hrService.getStaff({ limit: 100 });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setStaffList(list);
      if (list.length > 0) {
        setFormData(prev => ({
          ...prev,
          staff: list[0]._id,
          staffName: list[0].fullName,
          employeeCode: list[0].staffId
        }));
      }
    } catch (err) {
      console.warn('Could not load staff', err);
    }
  };

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await hrService.getStaffLoans({
        status: activeFilter !== 'All' ? activeFilter : undefined
      });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setLoans(list);
    } catch (err) {
      console.error('Error fetching loans:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Loans',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSelect = (staffId) => {
    const selected = staffList.find(s => s._id === staffId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        staff: selected._id,
        staffName: selected.fullName,
        employeeCode: selected.staffId
      }));
    }
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) {
      Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Please enter a valid loan amount' });
      return;
    }

    try {
      setSubmitting(true);
      await hrService.createStaffLoan(formData);
      Swal.fire({
        icon: 'success',
        title: 'Loan Application Submitted',
        timer: 1500,
        showConfirmButton: false
      });
      setIsModalOpen(false);
      fetchLoans();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status, staffName) => {
    const result = await Swal.fire({
      title: `${status} Loan?`,
      text: `Confirm updating status to "${status}" for ${staffName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'Approved' ? '#10b981' : '#64748b',
      confirmButtonText: `Yes, Set to ${status}`
    });

    if (result.isConfirmed) {
      try {
        await hrService.updateLoanStatus(id, status);
        Swal.fire({ icon: 'success', title: `Status set to ${status}`, timer: 1300, showConfirmButton: false });
        fetchLoans();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err?.response?.data?.message || err.message });
      }
    }
  };

  const handleDelete = async (id, staffName) => {
    const result = await Swal.fire({
      title: 'Delete Loan Record?',
      text: `Remove loan entry for ${staffName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await hrService.deleteStaffLoan(id);
        Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
        fetchLoans();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Delete Failed', text: err?.response?.data?.message || err.message });
      }
    }
  };

  const filteredLoans = loans.filter(l => 
    !searchQuery || 
    (l.staffName && l.staffName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.purpose && l.purpose.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.employeeCode && l.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculations
  const totalDisbursed = loans.reduce((acc, l) => acc + (l.amount || 0), 0);
  const totalOutstanding = loans.reduce((acc, l) => acc + (l.remainingAmount || 0), 0);
  const monthlyRecoveries = loans.filter(l => l.status === 'Active').reduce((acc, l) => acc + (l.monthlyDeduction || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                Staff Loans & Salary Advances
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Issue welfare loans, track monthly payroll deductions, and monitor recovery ledgers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button 
              onClick={fetchLoans}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Issue / Apply Loan
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <HRTabs />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-800">₹{totalDisbursed.toLocaleString()}</div>
              <div className="text-xs font-semibold text-slate-400">Total Loans Disbursed</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-rose-600">₹{totalOutstanding.toLocaleString()}</div>
              <div className="text-xs font-semibold text-slate-400">Outstanding Balance</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-emerald-600">₹{monthlyRecoveries.toLocaleString()}</div>
              <div className="text-xs font-semibold text-slate-400">Monthly EMI Recoveries</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex-1 relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by staff name, employee ID, or purpose..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 self-center">
            {['All', 'Active', 'Pending', 'Closed'].map(status => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === status
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Loan Purpose</th>
                  <th className="py-3.5 px-4">Principal Amount</th>
                  <th className="py-3.5 px-4">Monthly Deduction</th>
                  <th className="py-3.5 px-4">Balance Remaining</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-14 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
                      <span className="font-medium text-xs">Loading loan records...</span>
                    </td>
                  </tr>
                ) : filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-14 text-center text-slate-400">
                      <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <span className="font-semibold text-slate-700 text-sm">No Loan Records Found</span>
                      <span className="text-xs text-slate-400 block mt-1">Click "Issue / Apply Loan" to record an advance.</span>
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan, idx) => (
                    <tr key={loan._id || idx} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{loan.staffName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{loan.employeeCode || 'STF-EMP'}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-700">
                        {loan.purpose}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800">
                        ₹{(loan.amount || 0).toLocaleString()}
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">{loan.repaymentMonths} Months Duration</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-purple-600">
                        ₹{(loan.monthlyDeduction || 0).toLocaleString()} / mo
                      </td>
                      <td className="py-4 px-4 font-bold text-rose-600">
                        ₹{(loan.remainingAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          loan.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : loan.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {loan.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(loan._id, 'Active', loan.staffName)}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {loan.status === 'Active' && (
                            <button
                              onClick={() => handleUpdateStatus(loan._id, 'Closed', loan.staffName)}
                              className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[11px] font-bold hover:bg-slate-900 transition-colors cursor-pointer"
                            >
                              Close
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(loan._id, loan.staffName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ===================== APPLY LOAN MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-200">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Issue Staff Loan</h3>
                  <p className="text-[11px] text-slate-500">Record loan and repayment terms</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Staff Member <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={formData.staff}
                  onChange={(e) => handleStaffSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {staffList.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.fullName} ({s.staffId}) - {s.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Principal Amount (₹)</label>
                  <input 
                    type="number"
                    min="1000"
                    step="1000"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tenure (Months)</label>
                  <input 
                    type="number"
                    min="1"
                    max="60"
                    value={formData.repaymentMonths}
                    onChange={(e) => setFormData({...formData, repaymentMonths: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Loan Purpose</label>
                <input 
                  type="text"
                  placeholder="e.g. Festival Advance, Medical Emergency, Higher Studies"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-700 font-medium">
                Estimated Monthly EMI: <strong>₹{Math.round(formData.amount / (formData.repaymentMonths || 12))} / month</strong>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{submitting ? 'Recording...' : 'Disburse Loan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

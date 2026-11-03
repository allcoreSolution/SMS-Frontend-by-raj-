import React, { useState } from 'react';
import { Save, X, Calendar as CalendarIcon, Tag, CreditCard, Link as LinkIcon, FileText, HandCoins, User, Calculator } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const AddLoan = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'Personal Loan',
    applicantName: 'Accountant',
    amount: '',
    duration: '12',
    date: new Date().toISOString().split('T')[0],
    mode: 'Bank Transfer',
    status: 'Pending',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);

  const calculateEmi = () => {
    const amt = Number(form.amount) || 0;
    const dur = Number(form.duration) || 12;
    if (amt > 0 && dur > 0) {
      return (amt / dur).toFixed(2);
    }
    return '0.00';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.amount || Number(form.amount) <= 0) {
      return Swal.fire('Error', 'Please enter a valid loan amount and type', 'error');
    }
    if (!form.purpose.trim()) {
      return Swal.fire('Error', 'Please describe the reason/purpose for the loan', 'error');
    }

    setLoading(true);
    try {
      const emi = Number(calculateEmi());
      const res = await accountantService.applyLoan({
        type: form.type,
        applicantName: form.applicantName,
        amount: Number(form.amount),
        tenureMonths: Number(form.duration),
        duration: `${form.duration} Months`,
        emi: emi,
        remaining: Number(form.amount),
        paidAmount: 0,
        paymentMode: form.mode,
        status: form.status,
        purpose: form.purpose,
        reason: form.purpose,
        date: form.date,
      });

      if (res.success || res) {
        await Swal.fire({
          title: 'Success!',
          text: 'Loan application submitted successfully.',
          icon: 'success',
          confirmButtonColor: '#5a52d7',
        });
        navigate('/loans');
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] flex items-center gap-2">
            <HandCoins className="w-6 h-6 text-[#5a52d7]" /> Apply for Loan / Advance
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Submit staff loan or salary advance request with customized repayment tenure.</p>
        </div>
        <div className="text-[13px] text-gray-500 flex items-center gap-2 bg-white px-3 py-1.5 rounded-[3px] border border-gray-200 shadow-sm">
          <Link to="/accounts/dashboard" className="hover:text-[#5a52d7]">Home</Link>
          <span>&gt;</span>
          <Link to="/loans" className="hover:text-[#5a52d7]">Loans</Link>
          <span>&gt;</span>
          <span className="text-gray-400">Apply</span>
        </div>
      </div>

      <div className="bg-white rounded-[3px] border-t-[3px] border-t-[#5a52d7] shadow-sm max-w-4xl mx-auto">
        <div className="border-b border-gray-100 px-5 py-4 bg-[#fdfdfd] flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#333] flex items-center gap-2">
            <HandCoins className="w-4 h-4 text-[#5a52d7]" />
            Fill Loan / Advance Application Details
          </h3>
          <span className="text-[12px] bg-purple-50 text-[#5a52d7] font-semibold px-2.5 py-1 rounded">
            Accountant HR Module
          </span>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-[14px]">
            {/* Loan Type */}
            <div className="flex flex-col gap-1.5 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Loan / Advance Type *</label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-[#d2d6de] rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#5a52d7] appearance-none"
                  required
                >
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Salary Advance">Salary Advance</option>
                  <option value="Emergency Advance">Emergency Advance</option>
                  <option value="Medical Loan">Medical Loan</option>
                  <option value="Education Advance">Education / Tuition Advance</option>
                  <option value="Home Appliance Loan">Home Appliance Loan</option>
                </select>
              </div>
            </div>

            {/* Applicant Name */}
            <div className="flex flex-col gap-1.5 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Applicant Staff Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.applicantName}
                  onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                  placeholder="Staff Name & Designation"
                  className="w-full border border-[#d2d6de] rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#5a52d7]"
                  required
                />
              </div>
            </div>

            {/* Loan Amount */}
            <div className="flex flex-col gap-1.5 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Requested Amount (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="e.g. 25000"
                  min="500"
                  step="100"
                  className="w-full border border-[#d2d6de] rounded-[3px] pl-8 pr-3 py-2 bg-white focus:outline-none focus:border-[#5a52d7]"
                  required
                />
              </div>
            </div>

            {/* Repayment Duration */}
            <div className="flex flex-col gap-1.5 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Repayment Tenure (Months) *</label>
              <div className="relative">
                <Calculator className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full border border-[#d2d6de] rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#5a52d7] appearance-none"
                  required
                >
                  <option value="3">3 Months (Short Term)</option>
                  <option value="6">6 Months (Half Year)</option>
                  <option value="9">9 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="18">18 Months (1.5 Years)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                </select>
              </div>
            </div>

            {/* Application Date */}
            <div className="flex flex-col gap-1.5 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Application Date *</label>
              <div className="relative">
                <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-[#d2d6de] rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#5a52d7]"
                  required
                />
              </div>
            </div>

            {/* Disbursement Mode */}
            <div className="flex flex-col gap-1.5 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Disbursement Mode</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  className="w-full border border-[#d2d6de] rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#5a52d7] appearance-none"
                >
                  <option value="Bank Transfer">Bank Transfer (Salary Account)</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / Digital</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Initial Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-[#d2d6de] rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#5a52d7]"
              >
                <option value="Pending">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Active">Active (Disbursed)</option>
              </select>
            </div>

            {/* Live EMI calculation callout */}
            <div className="flex flex-col justify-center bg-purple-50/70 border border-purple-200/60 rounded-[3px] p-4 text-[13px]">
              <div className="flex items-center gap-2 text-[#5a52d7] font-bold text-[14px]">
                <Calculator className="w-4 h-4" />
                Estimated Monthly Deduction:
              </div>
              <div className="text-[20px] font-black text-[#5a52d7] mt-1">
                ₹{calculateEmi()} <span className="text-[12px] font-normal text-gray-600">/ month for {form.duration} months</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Deducted automatically from monthly salary slip until full amount is recovered.
              </p>
            </div>

            {/* Document attachment */}
            <div className="flex flex-col gap-1.5 md:col-span-2 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Supporting Documents (Optional)</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="file"
                  className="w-full border border-[#d2d6de] rounded-[3px] pl-9 pr-3 py-1.5 bg-white text-[13px] focus:outline-none focus:border-[#5a52d7]"
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="flex flex-col gap-1.5 md:col-span-2 focus-within:text-[#5a52d7]">
              <label className="font-semibold text-[#333]">Purpose / Reason for Loan *</label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <textarea
                  rows="3"
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  placeholder="Detail the requirement for advance or loan (e.g. medical emergency, household expenses, education fee)..."
                  className="w-full border border-[#d2d6de] rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#5a52d7] resize-y"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3 bg-[#fdfdfd] -mx-6 -mb-6 px-6 py-4 border-t border-gray-100">
            <Link
              to="/loans"
              className="px-5 py-2 text-[14px] bg-white border border-[#d2d6de] text-[#444] rounded-[3px] hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-[14px] bg-[#5a52d7] text-white rounded-[3px] hover:bg-[#4a42c0] flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-70 font-semibold"
            >
              <Save className="w-4 h-4" /> {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLoan;

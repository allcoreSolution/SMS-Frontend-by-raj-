import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpFromLine, Save, ArrowLeft, Building2, 
  Calendar, DollarSign, FileText, CheckCircle2, Zap 
} from 'lucide-react';
import Swal from 'sweetalert2';
import AccountsTabs from '../../components/accounts/AccountsTabs';
import { accountsService } from '../../api/accountsService';

const AddNewExpense = () => {
  const navigate = useNavigate();
  const [heads, setHeads] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    expenseHead: '',
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    invoiceNumber: `EXP-${Date.now().toString().slice(-5)}`,
    paymentMode: 'Cash',
    bankAccount: '',
    description: ''
  });

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const [headsRes, banksRes] = await Promise.all([
        accountsService.getExpenseHeads(),
        accountsService.getBankAccounts()
      ]);
      const headsList = headsRes.data || headsRes || [];
      const banksList = banksRes.data || banksRes || [];
      setHeads(headsList);
      setBankAccounts(banksList);
      if (headsList.length > 0) {
        setFormData(prev => ({ ...prev, expenseHead: headsList[0]._id }));
      }
      if (banksList.length > 0) {
        setFormData(prev => ({ ...prev, bankAccount: banksList[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load heads/banks:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.expenseHead || !formData.amount) {
      Swal.fire('Missing Information', 'Please fill in payee name, expense head, and amount.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await accountsService.createExpense({
        name: formData.name,
        title: formData.name,
        expenseHeadId: formData.expenseHead,
        date: formData.date,
        amount: Number(formData.amount),
        invoiceNumber: formData.invoiceNumber,
        paymentMode: formData.paymentMode,
        bankAccount: formData.bankAccount || undefined,
        description: formData.description
      });

      if (res && res.success) {
        await Swal.fire({
          title: 'Expense Voucher Recorded!',
          html: `<div class="text-left text-sm space-y-1">
            <p class="text-rose-600 font-semibold">✓ Debit entry posted to school accounts</p>
            <p><strong>Voucher:</strong> ${formData.invoiceNumber}</p>
            <p><strong>Particulars:</strong> ${formData.name}</p>
            <p><strong>Amount:</strong> ₹${Number(formData.amount).toLocaleString('en-IN')}</p>
          </div>`,
          icon: 'success',
          confirmButtonColor: '#e11d48'
        });
        navigate('/accounts/expense');
      }
    } catch (err) {
      console.error('Error saving expense:', err);
      Swal.fire('Failed', err?.response?.data?.message || 'Error recording expense', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/accounts/expense')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xs"
            title="Back to Expense List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Record New Expense Voucher</h1>
            <p className="text-xs text-slate-500">Log institutional operational expenses, bills, or maintenance payments</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <AccountsTabs />

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Particulars / Payee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Particulars / Payee Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. State Electricity Board, Lab Chemicals Supplier..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Expense Head */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Expense Head / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.expenseHead}
                onChange={(e) => setFormData({ ...formData, expenseHead: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              >
                {heads.map(h => (
                  <option key={h._id} value={h._id}>{h.name}</option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter debit amount in INR"
                required
                min="1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-bold"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Payment Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              />
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Payment Mode
              </label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                <option value="UPI/Online">UPI / QR Code / NetBanking</option>
                <option value="Cheque">Cheque</option>
                <option value="Demand Draft">Demand Draft</option>
              </select>
            </div>

            {/* Paid From Bank Account */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Paid From Bank Account
              </label>
              <select
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
              >
                <option value="">Cash In Hand (Counter)</option>
                {bankAccounts.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.accountTitle || b.bankName} ({b.accountNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice / Reference Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Voucher / Bill Number
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-indigo-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Description / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Narration / Purpose
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional remark or vendor invoice reference..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/accounts/expense')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all disabled:opacity-60"
            >
              <Save className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Posting Voucher...' : 'Save & Post Expense'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AddNewExpense;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowDownToLine, Save, ArrowLeft, Building2, 
  Calendar, DollarSign, FileText, CheckCircle2, Zap 
} from 'lucide-react';
import Swal from 'sweetalert2';
import AccountsTabs from '../../components/accounts/AccountsTabs';
import { accountsService } from '../../api/accountsService';

const AddNewIncome = () => {
  const navigate = useNavigate();
  const [heads, setHeads] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    incomeHead: '',
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    invoiceNumber: `INC-${Date.now().toString().slice(-5)}`,
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
        accountsService.getIncomeHeads(),
        accountsService.getBankAccounts()
      ]);
      const headsList = headsRes.data || headsRes || [];
      const banksList = banksRes.data || banksRes || [];
      setHeads(headsList);
      setBankAccounts(banksList);
      if (headsList.length > 0) {
        setFormData(prev => ({ ...prev, incomeHead: headsList[0]._id }));
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
    if (!formData.name.trim() || !formData.incomeHead || !formData.amount) {
      Swal.fire('Missing Information', 'Please fill in particulars name, income head, and amount.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await accountsService.createIncome({
        name: formData.name,
        incomeHeadId: formData.incomeHead,
        date: formData.date,
        amount: Number(formData.amount),
        invoiceNumber: formData.invoiceNumber,
        paymentMode: formData.paymentMode,
        bankAccount: formData.bankAccount || undefined,
        description: formData.description
      });

      if (res && res.success) {
        await Swal.fire({
          title: 'Income Voucher Recorded!',
          html: `<div class="text-left text-sm space-y-1">
            <p class="text-emerald-600 font-semibold">✓ Credit entry added to school accounts</p>
            <p><strong>Voucher:</strong> ${formData.invoiceNumber}</p>
            <p><strong>Particulars:</strong> ${formData.name}</p>
            <p><strong>Amount:</strong> ₹${Number(formData.amount).toLocaleString('en-IN')}</p>
          </div>`,
          icon: 'success',
          confirmButtonColor: '#059669'
        });
        navigate('/accounts/income');
      }
    } catch (err) {
      console.error('Error saving income:', err);
      Swal.fire('Failed', err?.response?.data?.message || 'Error recording income', 'error');
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
            onClick={() => navigate('/accounts/income')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xs"
            title="Back to Income List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Record New Income Voucher</h1>
            <p className="text-xs text-slate-500">Log incoming educational grants, donations, or departmental receipts</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <AccountsTabs />

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Particulars / Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Particulars / Source Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. State Infrastructure Grant, Canteen Lease..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Income Head */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Income Head / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.incomeHead}
                onChange={(e) => setFormData({ ...formData, incomeHead: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
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
                placeholder="Enter credit amount in INR"
                required
                min="1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Receipt Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                <option value="UPI/Online">UPI / QR Code / NetBanking</option>
                <option value="Cheque">Cheque</option>
                <option value="Demand Draft">Demand Draft</option>
              </select>
            </div>

            {/* Deposit Bank Account */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Target Bank Account
              </label>
              <select
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
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
                Voucher / Reference No
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-indigo-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Description / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Narration / Notes
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional remark or transaction reference..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/accounts/income')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all disabled:opacity-60"
            >
              <Save className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Recording Voucher...' : 'Save & Post Income'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AddNewIncome;

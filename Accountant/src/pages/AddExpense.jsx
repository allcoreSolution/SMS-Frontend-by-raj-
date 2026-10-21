import React, { useState, useEffect } from 'react';
import { Save, X, Calendar as CalendarIcon, Tag, CreditCard, ArrowUpCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const AddExpense = () => {
  const navigate = useNavigate();
  const [heads, setHeads] = useState([]);
  const [form, setForm] = useState({
    head: '',
    name: '',
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    mode: 'Cash',
    description: '',
    voucherNo: `EXP-${Date.now().toString().slice(-5)}`
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    accountantService.getExpenseHeads()
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setHeads(res.data);
          setForm(prev => ({ ...prev, head: res.data[0].name }));
        } else {
          setForm(prev => ({ ...prev, head: 'Staff & Faculty Salaries' }));
        }
      })
      .catch(() => {
        setForm(prev => ({ ...prev, head: 'Staff & Faculty Salaries' }));
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.head || !form.name.trim() || !form.amount || Number(form.amount) <= 0) {
      return Swal.fire('Error', 'Please fill all required fields with a valid amount', 'error');
    }
    
    setLoading(true);
    try {
      const res = await accountantService.addExpense({
        date: form.date,
        amount: Number(form.amount) || 0,
        description: form.description,
        note: form.description,
        paymentMode: form.mode,
        head: form.head,
        expenseHead: form.head,
        name: form.name.trim(),
        entityName: form.name.trim(),
        voucherNo: form.voucherNo || `EXP-${Date.now().toString().slice(-5)}`
      });

      if (res.success) {
        Swal.fire({ 
          title: 'Success!', 
          text: `Payment Voucher ${res.data?.voucherNo || form.voucherNo} posted successfully`, 
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/accounts/expense');
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
            <ArrowUpCircle className="w-6 h-6 text-[#dd4b39]" /> Add Payment & Expense Voucher
          </h1>
          <p className="text-[13px] text-gray-500">Record a debit payment voucher against verified school expense heads.</p>
        </div>
        <div className="text-[13px] text-gray-500 flex items-center gap-2 bg-white px-3 py-1.5 rounded-[3px] border border-gray-200 shadow-sm">
          <Link to="/accounts/dashboard" className="hover:text-[#dd4b39]">Home</Link>
          <span>&gt;</span>
          <Link to="/accounts/expense" className="hover:text-[#dd4b39]">Expense</Link>
          <span>&gt;</span>
          <span className="text-gray-400 font-semibold">New Voucher</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        
        {/* Form Panel (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-[3px] border-t-[3px] border-t-[#dd4b39] shadow-sm border border-gray-200">
          <div className="border-b border-gray-100 px-5 py-3.5 bg-[#fdfdfd] flex justify-between items-center">
            <h3 className="text-[15px] font-bold text-[#333]">Fill Expenditure Details</h3>
            <span className="font-mono text-[12px] bg-red-50 text-[#dd4b39] font-bold px-2 py-0.5 rounded border border-red-200">
              {form.voucherNo}
            </span>
          </div>
          
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-[14px]">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[12px] text-gray-700">Expense Head Category *</label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    value={form.head} 
                    onChange={e => setForm({...form, head: e.target.value})} 
                    className="w-full border border-gray-300 rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#dd4b39] text-[13px]" 
                    required
                  >
                    {heads.map((h, i) => (
                      <option key={i} value={h.name}>{h.name}</option>
                    ))}
                    {heads.length === 0 && <option value="Staff & Faculty Salaries">Staff & Faculty Salaries</option>}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[12px] text-gray-700">Voucher / Ref Number *</label>
                <input 
                  type="text" 
                  value={form.voucherNo} 
                  onChange={e => setForm({...form, voucherNo: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#dd4b39] font-mono text-[13px]" 
                  required 
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-[12px] text-gray-700">Disbursed To (Payee / Vendor) *</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. Modern Printers & Offset or Campus Security Agency" 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#dd4b39] text-[13px]" 
                  required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[12px] text-gray-700">Disbursement Amount (₹) *</label>
                <input 
                  type="number" 
                  value={form.amount} 
                  onChange={e => setForm({...form, amount: e.target.value})} 
                  placeholder="0.00" 
                  min="1" 
                  step="1" 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#dd4b39] font-bold text-[#dd4b39] text-[15px]" 
                  required 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[12px] text-gray-700">Disbursement Date *</label>
                <div className="relative">
                  <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="date" 
                    value={form.date} 
                    onChange={e => setForm({...form, date: e.target.value})} 
                    className="w-full border border-gray-300 rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#dd4b39] text-[13px]" 
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[12px] text-gray-700">Payment Mode *</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    value={form.mode} 
                    onChange={e => setForm({...form, mode: e.target.value})} 
                    className="w-full border border-gray-300 rounded-[3px] pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-[#dd4b39] text-[13px]"
                  >
                    <option value="Cash">Cash Counter</option>
                    <option value="UPI">UPI / Digital QR</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cheque">Demand Draft / Cheque</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-bold text-[12px] text-gray-700">Particulars / Payment Details</label>
                <textarea 
                  rows="3" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="Invoice UTR, vendor tax invoice number, bill notes, or warranty terms..." 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 bg-white focus:outline-none focus:border-[#dd4b39] resize-none text-[13px]"
                />
              </div>

            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => navigate('/accounts/expense')} 
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-[3px] hover:bg-gray-50 text-[13px] font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Ledger
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-5 py-2 bg-[#dd4b39] hover:bg-[#d73925] text-white rounded-[3px] text-[13px] font-semibold shadow-xs flex items-center gap-2 flex-1 justify-center transition-colors"
              >
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Confirm & Save Payment Voucher'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Voucher Preview Card (1 column) */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Live Voucher Preview</span>
              <span className="text-[10px] bg-red-100 text-[#dd4b39] font-bold px-2 py-0.5 rounded">Debit Passed</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="text-center py-2 bg-red-50 rounded border border-red-100">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Disbursed Amount</span>
                <span className="text-[22px] font-bold text-[#dd4b39]">
                  ₹{Number(form.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="divide-y divide-gray-100 text-gray-600 pt-2">
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400 font-medium">Voucher No:</span>
                  <span className="font-mono font-bold text-gray-800">{form.voucherNo}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400 font-medium">Cost Head:</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[150px]">{form.head || '—'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400 font-medium">Paid To:</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[150px]">{form.name || 'Unspecified'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400 font-medium">Date:</span>
                  <span className="font-medium text-gray-700">{form.date}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400 font-medium">Payment Mode:</span>
                  <span className="font-medium text-gray-700">{form.mode}</span>
                </div>
              </div>

              {form.description && (
                <div className="p-2.5 bg-gray-50 rounded text-gray-500 text-[11px] mt-2 italic">
                  "{form.description}"
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Passed for audit and general ledger posting</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AddExpense;

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, PlusCircle, Search, Download, Trash2, 
  Edit, RefreshCw, FileText, Wallet, CheckCircle2, 
  X, Save, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import AccountsTabs from '../../components/accounts/AccountsTabs';
import { accountsService } from '../../api/accountsService';

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountTitle: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Current',
    openingBalance: '0'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await accountsService.getBankAccounts();
      setAccounts(res.data || res || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormData({
      accountTitle: '',
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'Current',
      openingBalance: '0'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setFormData({
      accountTitle: acc.accountTitle || '',
      bankName: acc.bankName || '',
      branchName: acc.branchName || '',
      accountNumber: acc.accountNumber || '',
      ifscCode: acc.ifscCode || '',
      accountType: acc.accountType || 'Current',
      openingBalance: acc.openingBalance || '0'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.accountTitle.trim() || !formData.bankName.trim() || !formData.accountNumber.trim()) {
      Swal.fire('Required Fields', 'Please fill account title, bank name, and account number.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      if (editingAccount) {
        const res = await accountsService.updateBankAccount(editingAccount._id, formData);
        if (res && res.success) {
          Swal.fire('Updated', 'Bank account updated successfully', 'success');
          setIsModalOpen(false);
          await fetchAccounts();
        }
      } else {
        const res = await accountsService.createBankAccount({
          ...formData,
          openingBalance: Number(formData.openingBalance) || 0
        });
        if (res && res.success) {
          Swal.fire('Created', 'New bank account added successfully', 'success');
          setIsModalOpen(false);
          await fetchAccounts();
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to save bank account', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Remove Bank Account?',
      text: `Are you sure you want to remove "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e11d48'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await accountsService.deleteBankAccount(id);
      if (res && res.success) {
        Swal.fire('Deleted!', 'Bank account removed.', 'success');
        setAccounts(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to delete account', 'error');
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        (acc.accountTitle || '').toLowerCase().includes(q) ||
        (acc.bankName || '').toLowerCase().includes(q) ||
        (acc.accountNumber || '').toLowerCase().includes(q) ||
        (acc.ifscCode || '').toLowerCase().includes(q)
      );
    });
  }, [accounts, searchTerm]);

  const totalLiquidity = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + (acc.currentBalance !== undefined ? acc.currentBalance : (acc.openingBalance || 0)), 0);
  }, [accounts]);

  const exportCSV = () => {
    if (!filteredAccounts.length) {
      Swal.fire('No Data', 'No bank accounts to export', 'info');
      return;
    }
    const headers = ['ACCOUNT TITLE', 'BANK NAME', 'BRANCH', 'ACCOUNT NUMBER', 'IFSC CODE', 'TYPE', 'OPENING BALANCE', 'CURRENT BALANCE'];
    const rows = filteredAccounts.map(a => [
      `"${a.accountTitle}"`,
      `"${a.bankName}"`,
      `"${a.branchName || '—'}"`,
      `'${a.accountNumber}`,
      a.ifscCode || '—',
      a.accountType || 'Current',
      a.openingBalance || 0,
      a.currentBalance !== undefined ? a.currentBalance : a.openingBalance || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bank_accounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Bank Accounts &amp; Treasury</h1>
            <p className="text-xs text-slate-500">Manage institutional bank accounts, balances, and deposit ledgers</p>
          </div>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Add Bank Account
        </button>
      </div>

      {/* Tabs */}
      <AccountsTabs />

      {/* Liquidity Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE BANK ACCOUNTS</span>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{accounts.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL LIQUID RESERVES</span>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">₹{totalLiquidity.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TREASURY STATUS</span>
            <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>All Ledgers Reconciled</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Bank Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filteredAccounts.map((acc) => {
          const balance = acc.currentBalance !== undefined ? acc.currentBalance : (acc.openingBalance || 0);
          return (
            <div 
              key={acc._id} 
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base shadow-xs">
                    {acc.bankName?.[0] || 'B'}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {acc.accountType || 'Current'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{acc.accountTitle}</h3>
                <p className="text-xs text-slate-500">{acc.bankName} • {acc.branchName || 'Main Branch'}</p>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account No:</span>
                    <span className="font-mono font-bold text-slate-800">{acc.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-mono text-slate-600">{acc.ifscCode || '—'}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CURRENT BALANCE</span>
                  <div className="text-2xl font-black text-emerald-600 mt-0.5">
                    ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(acc)}
                  className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Edit Account Details"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(acc._id, acc.accountTitle)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">
                {editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Account Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountTitle}
                  onChange={(e) => setFormData({ ...formData, accountTitle: e.target.value })}
                  placeholder="e.g. SBI School Operating Account"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bank Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="e.g. State Bank of India"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    placeholder="e.g. Civil Lines, Raipur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="e.g. 40992381293"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    placeholder="e.g. SBIN0001234"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Current">Current Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Escrow">Escrow Account</option>
                    <option value="Cash in Hand">Cash in Hand</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opening Balance (₹)</label>
                  <input
                    type="number"
                    value={formData.openingBalance}
                    onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
                    required
                    min="0"
                    disabled={!!editingAccount}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20"
                >
                  {submitting ? 'Saving...' : 'Save Bank Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BankAccounts;

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowUpFromLine, PlusCircle, Search, Download, 
  Printer, Trash2, Edit, RefreshCw, FileText, 
  Calendar, Building2, Filter, Zap, X, Save, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import AccountsTabs from '../../components/accounts/AccountsTabs';
import { accountsService } from '../../api/accountsService';

const Expense = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [headFilter, setHeadFilter] = useState('ALL');
  const [expenseData, setExpenseData] = useState([]);
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', amount: '', expenseHead: '', date: '', description: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [expenseRes, headsRes] = await Promise.all([
        accountsService.getExpenses(),
        accountsService.getExpenseHeads()
      ]);

      const rawExpenses = expenseRes.data || expenseRes || [];
      const rawHeads = headsRes.data || headsRes || [];

      setExpenseData(rawExpenses);
      setHeads(rawHeads);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Expense Record?',
      text: `Are you sure you want to delete "${name}"? This debit entry will be removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e11d48'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await accountsService.deleteExpense(id);
      if (res && res.success) {
        Swal.fire('Deleted!', 'Expense entry removed.', 'success');
        setExpenseData(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to delete record', 'error');
    }
  };

  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setEditForm({
      name: rec.name || rec.title || '',
      amount: rec.amount || '',
      expenseHead: rec.expenseHead?._id || rec.expenseHead || '',
      date: rec.date ? new Date(rec.date).toISOString().slice(0, 10) : '',
      description: rec.description || ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await accountsService.updateExpense(editingRecord._id, {
        name: editForm.name,
        title: editForm.name,
        amount: Number(editForm.amount),
        expenseHead: editForm.expenseHead,
        date: editForm.date,
        description: editForm.description
      });

      if (res && res.success) {
        Swal.fire('Updated!', 'Expense record updated successfully', 'success');
        setEditingRecord(null);
        await fetchInitialData();
      }
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error', 'Failed to update expense record', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Filtered
  const filteredExpenses = useMemo(() => {
    return expenseData.filter(item => {
      if (headFilter !== 'ALL') {
        const headName = item.expenseHead?.name || '';
        const headId = item.expenseHead?._id || item.expenseHead || '';
        if (headName !== headFilter && headId !== headFilter) return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const nameMatch = (item.name || item.title || '').toLowerCase().includes(q);
        const invMatch = (item.invoiceNumber || '').toLowerCase().includes(q);
        const headMatch = (item.expenseHead?.name || item.category || '').toLowerCase().includes(q);
        if (!nameMatch && !invMatch && !headMatch) return false;
      }
      return true;
    });
  }, [expenseData, headFilter, searchTerm]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [filteredExpenses]);

  const exportCSV = () => {
    if (!filteredExpenses.length) {
      Swal.fire('No Data', 'No expense records to export', 'info');
      return;
    }
    const headers = ['VOUCHER NO', 'PARTICULARS', 'EXPENSE HEAD', 'DATE', 'AMOUNT (INR)', 'PAYMENT MODE', 'BANK ACCOUNT', 'DESCRIPTION'];
    const rows = filteredExpenses.map(r => [
      r.invoiceNumber || `EXP-${r._id.toString().slice(-4)}`,
      `"${r.name || r.title || 'Expense'}"`,
      `"${r.expenseHead?.name || r.category || 'General'}"`,
      new Date(r.date).toISOString().slice(0, 10),
      r.amount || 0,
      r.paymentMode || 'Cash',
      `"${r.bankAccount?.accountTitle || r.bankAccount?.bankName || '—'}"`,
      `"${(r.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `expense_vouchers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans print:p-0 print:bg-white">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 mb-5 shadow-sm shadow-rose-500/10 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
            <ArrowUpFromLine className="w-4 h-4 text-white" />
          </div>
          <p className="leading-relaxed">
            <strong className="font-semibold">Departmental Expenditures & Day Book:</strong> Record all operating outlays (staff salaries, campus utilities, science lab supplies, exam printing, generator fuel) against verified expense heads.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <ArrowUpFromLine className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Expense Vouchers Registry</h1>
            <p className="text-xs text-slate-500">Track and manage all debited institutional payments & bills</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/accounts/expense/add')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-rose-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Record New Expense
          </button>
        </div>
      </div>

      {/* Tabs */}
      <AccountsTabs />

      {/* KPI Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 print:hidden">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL EXPENSES LOGGED</span>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{expenseData.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FILTERED OUTFLOW TOTAL</span>
            <p className="text-2xl font-bold text-rose-600 mt-0.5">₹{totalFilteredAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowUpFromLine className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE EXPENSE HEADS</span>
            <p className="text-2xl font-bold text-violet-600 mt-0.5">{heads.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden mb-6">
        
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white print:hidden">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-600" /> Expense Payment Vouchers &amp; Audit Trail
            </h2>
            <p className="text-xs text-slate-500">Live debit vouchers synchronized with verified bank outflows</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              onClick={exportCSV}
              className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" /> Print
            </button>
            <button 
              onClick={fetchInitialData}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xs"
              title="Refresh Expense Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-3 print:hidden">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by payee, voucher no, or category..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter Head:</span>
            <select
              value={headFilter}
              onChange={(e) => setHeadFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
            >
              <option value="ALL">All Heads</option>
              {heads.map(h => (
                <option key={h._id} value={h._id}>{h.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Particulars / Payee</th>
                <th className="py-3 px-4">Expense Head</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Bank Account</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                    <span>Loading expense records...</span>
                  </td>
                </tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp, i) => (
                  <tr key={exp._id || i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                      {i + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {exp.invoiceNumber || `EXP-${exp._id.toString().slice(-4)}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {exp.name || exp.title}
                      {exp.description && (
                        <p className="text-[11px] text-slate-400 font-normal truncate max-w-xs">{exp.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        {exp.expenseHead?.name || exp.category || 'General Expense'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {exp.paymentMode || 'Cash'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {exp.bankAccount?.accountTitle || exp.bankAccount?.bankName || 'Cash In Hand'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-600">
                      -₹{(exp.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 print:hidden">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                          title="Edit Expense Record"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id, exp.name || exp.title)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No expense records found</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Record New Expense" to log an expenditure.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Showing {filteredExpenses.length} vouchers</span>
          <span className="font-medium text-slate-700">
            Total Displayed: ₹{totalFilteredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">Edit Expense Voucher</span>
              <button 
                onClick={() => setEditingRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Particulars / Payee</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Expense Head</label>
                <select
                  value={editForm.expenseHead}
                  onChange={(e) => setEditForm({ ...editForm, expenseHead: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="">Select Head</option>
                  {heads.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/20"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Expense;

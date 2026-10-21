import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gauge, ArrowDown, ArrowUp, FileSearch, Tag,
  Plus, List, Grid, Copy, Printer, Search, Edit, Trash2,
  RefreshCw, X, Eye, DollarSign, Wallet, Calendar, CheckCircle2,
  FileSpreadsheet, ArrowDownCircle, Building2, CreditCard
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const ACCOUNTS_NAV_TABS = [
  { label: 'Dashboard', icon: Gauge, path: '/accounts/dashboard' },
  { label: 'Income', icon: ArrowDown, path: '/accounts/income', active: true },
  { label: 'Expense', icon: ArrowUp, path: '/accounts/expense' },
  { label: 'Day Book', icon: FileSearch, path: '/accounts/day-book' },
  { label: 'Income Heads', icon: Tag, path: '/accounts/income-heads' },
  { label: 'Expense Heads', icon: Tag, path: '/accounts/expense-heads' },
];

const ToolbarButton = ({ label, icon: Icon, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-[13px] bg-white hover:bg-gray-50 transition-colors"
  >
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {label}
  </button>
);

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [headFilter, setHeadFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  // Forms
  const [addForm, setAddForm] = useState({
    head: '',
    name: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMode: 'Cash',
    note: '',
    invoiceNo: ''
  });

  const [editForm, setEditForm] = useState({
    id: '',
    head: '',
    name: '',
    amount: '',
    date: '',
    paymentMode: 'Cash',
    note: '',
    invoiceNo: ''
  });

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const [incRes, headRes] = await Promise.all([
        accountantService.getIncomes(),
        accountantService.getIncomeHeads()
      ]);

      if (incRes.success && Array.isArray(incRes.data)) {
        setIncomeData(incRes.data.map(d => ({
          id: d.id || d._id,
          name: d.name || d.note || d.entityName || 'General Inflow',
          head: d.head || 'General',
          date: d.date || new Date().toISOString().slice(0, 10),
          amount: Number(d.amount) || 0,
          paymentMode: d.paymentMode || d.mode || 'Cash',
          invoiceNo: d.invoiceNo || d.refNo || `INC-${(d.id || '1001').slice(-4)}`,
          note: d.note || d.description || ''
        })));
      }

      if (headRes.success && Array.isArray(headRes.data)) {
        setHeads(headRes.data);
      }
    } catch (e) {
      console.error('Error loading incomes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered income records
  const filteredIncome = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const thisMonth = today.slice(0, 7);

    return incomeData.filter(inc => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        inc.name.toLowerCase().includes(q) || 
        inc.head.toLowerCase().includes(q) || 
        (inc.invoiceNo && inc.invoiceNo.toLowerCase().includes(q)) ||
        (inc.note && inc.note.toLowerCase().includes(q)) ||
        String(inc.amount).includes(q);

      const matchesHead = headFilter === 'ALL' || inc.head === headFilter;
      const matchesMode = modeFilter === 'ALL' || (inc.paymentMode || '').toLowerCase() === modeFilter.toLowerCase();

      let matchesDate = true;
      if (dateFilter === 'TODAY') matchesDate = inc.date === today;
      else if (dateFilter === 'MONTH') matchesDate = (inc.date || '').startsWith(thisMonth);

      return matchesSearch && matchesHead && matchesMode && matchesDate;
    });
  }, [incomeData, search, headFilter, modeFilter, dateFilter]);

  // KPI Calculations
  const todayStr = new Date().toISOString().slice(0, 10);
  const thisMonthStr = todayStr.slice(0, 7);

  const totalIncome = incomeData.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const thisMonthIncome = incomeData
    .filter(i => (i.date || '').startsWith(thisMonthStr))
    .reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const avgIncome = incomeData.length > 0 ? Math.round(totalIncome / incomeData.length) : 0;

  // Top Category
  const headCounts = incomeData.reduce((acc, curr) => {
    acc[curr.head] = (acc[curr.head] || 0) + curr.amount;
    return acc;
  }, {});
  const topHead = Object.entries(headCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Tuition Fee';

  // Handle Add Income
  const handleOpenAdd = () => {
    setAddForm({
      head: heads[0]?.name || 'Tuition Fee Collection',
      name: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      paymentMode: 'Cash',
      note: '',
      invoiceNo: `INC-${Date.now().toString().slice(-5)}`
    });
    setShowAddModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return Swal.fire('Error', 'Payer/Entity name is required', 'error');
    if (!addForm.amount || Number(addForm.amount) <= 0) return Swal.fire('Error', 'Valid amount is required', 'error');

    try {
      const res = await accountantService.addIncome({
        head: addForm.head || 'General',
        name: addForm.name.trim(),
        amount: Number(addForm.amount),
        date: addForm.date,
        paymentMode: addForm.paymentMode,
        note: addForm.note,
        invoiceNo: addForm.invoiceNo || `INC-${Date.now().toString().slice(-5)}`
      });

      if (res.success) {
        Swal.fire({
          title: 'Income Added!',
          text: `Voucher ${res.data?.invoiceNo || addForm.invoiceNo} saved successfully.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        setShowAddModal(false);
        loadData();
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to save income', 'error');
    }
  };

  // Handle Edit
  const handleOpenEdit = (inc) => {
    setSelectedIncome(inc);
    setEditForm({
      id: inc.id,
      head: inc.head,
      name: inc.name,
      amount: inc.amount,
      date: inc.date,
      paymentMode: inc.paymentMode || 'Cash',
      note: inc.note || '',
      invoiceNo: inc.invoiceNo
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return Swal.fire('Error', 'Name is required', 'error');
    if (!editForm.amount || Number(editForm.amount) <= 0) return Swal.fire('Error', 'Valid amount is required', 'error');

    try {
      const res = await accountantService.updateIncome(editForm.id, {
        head: editForm.head,
        name: editForm.name.trim(),
        amount: Number(editForm.amount),
        date: editForm.date,
        paymentMode: editForm.paymentMode,
        note: editForm.note,
        invoiceNo: editForm.invoiceNo
      });

      if (res.success) {
        Swal.fire({
          title: 'Updated!',
          text: 'Income record updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        setShowEditModal(false);
        loadData();
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to update', 'error');
    }
  };

  // Handle Delete
  const handleDelete = async (id, invoiceNo) => {
    const conf = await Swal.fire({
      title: 'Delete Income Record?',
      text: `Are you sure you want to delete ${invoiceNo || 'this entry'}? This will adjust your ledger balances.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete'
    });

    if (conf.isConfirmed) {
      try {
        await accountantService.deleteIncome(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Income entry deleted successfully',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false
        });
        loadData();
      } catch (e) {
        Swal.fire('Error', 'Could not delete entry', 'error');
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (incomeData.length === 0) return Swal.fire('Info', 'No income records to export', 'info');
    const headers = ['#', 'Voucher No', 'Payer / Entity', 'Income Head', 'Date', 'Payment Mode', 'Amount (INR)', 'Note'];
    const rows = incomeData.map((inc, idx) => [
      idx + 1,
      `"${inc.invoiceNo || ''}"`,
      `"${inc.name || ''}"`,
      `"${inc.head || ''}"`,
      `"${inc.date || ''}"`,
      `"${inc.paymentMode || ''}"`,
      inc.amount,
      `"${inc.note || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `income_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to clipboard
  const handleCopy = () => {
    const text = incomeData.map(i => `${i.invoiceNo}\t${i.name}\t${i.head}\t${i.date}\t₹${i.amount}\t${i.paymentMode}`).join('\n');
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: 'Copied!',
      text: `${incomeData.length} income entries copied to clipboard`,
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    });
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] leading-tight flex items-center gap-2">
            <ArrowDownCircle className="w-6 h-6 text-[#00a65a]" /> Income & Revenue Ledger
          </h1>
          <p className="text-[13px] text-gray-500">
            Record, track, and audit revenue receipts across Tuition, Grants, Store, and Miscellaneous heads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] text-white font-semibold text-[13px] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Income
          </button>
          <button 
            onClick={loadData} 
            title="Refresh Data"
            className="p-1.5 border border-gray-300 rounded-[3px] bg-white text-gray-600 hover:bg-gray-50 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#00a65a]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Unified Accounts Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-300 pb-2">
        {ACCOUNTS_NAV_TABS.map((tab, idx) => {
          const Icon = tab.icon;
          return (
            <Link
              key={idx}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-[3px] text-[13px] font-semibold transition-all ${
                tab.active
                  ? 'bg-white text-[#00a65a] border-t-2 border-t-[#00a65a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#00a65a] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Recorded Income</span>
            <h3 className="text-[24px] font-bold mt-1">₹{totalIncome.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">{incomeData.length} Verified Inflow Vouchers</span>
          </div>
          <ArrowDown className="w-10 h-10 text-black/10" />
        </div>

        <div className="bg-[#00c0ef] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">This Month's Inflow</span>
            <h3 className="text-[24px] font-bold mt-1">₹{thisMonthIncome.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Cycle: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          </div>
          <Calendar className="w-10 h-10 text-black/10" />
        </div>

        <div className="bg-[#3c8dbc] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Average Transaction</span>
            <h3 className="text-[24px] font-bold mt-1">₹{avgIncome.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Per Income Voucher</span>
          </div>
          <Wallet className="w-10 h-10 text-black/10" />
        </div>

        <div className="bg-[#605ca8] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Dominant Category</span>
            <h3 className="text-[18px] font-bold mt-1 truncate max-w-[160px]" title={topHead}>{topHead}</h3>
            <span className="text-[11px] opacity-80">Highest Contributing Head</span>
          </div>
          <Tag className="w-10 h-10 text-black/10" />
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm flex flex-col mb-4">
        
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 bg-[#fefefe]">
          <div className="flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-[#00a65a]" />
            <h2 className="text-[16px] font-bold text-[#333]">All Income Transactions</h2>
            <span className="text-[12px] bg-emerald-100 text-[#00a65a] font-bold px-2 py-0.5 rounded-full ml-1">
              {filteredIncome.length} Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Head Filter */}
            <select
              value={headFilter}
              onChange={(e) => setHeadFilter(e.target.value)}
              className="border border-gray-200 rounded-[3px] px-2 py-1.5 text-[12px] bg-white focus:outline-none focus:border-[#00a65a]"
            >
              <option value="ALL">All Income Heads</option>
              {heads.map((h, i) => (
                <option key={i} value={h.name}>{h.name}</option>
              ))}
            </select>

            {/* Mode Filter */}
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="border border-gray-200 rounded-[3px] px-2 py-1.5 text-[12px] bg-white focus:outline-none focus:border-[#00a65a]"
            >
              <option value="ALL">All Payment Modes</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-200 rounded-[3px] px-2 py-1.5 text-[12px] bg-white focus:outline-none focus:border-[#00a65a]"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today Only</option>
              <option value="MONTH">This Month</option>
            </select>
          </div>
        </div>

        {/* Action Toolbar & Search */}
        <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0 rounded-[3px] overflow-hidden border border-gray-200">
              <ToolbarButton icon={Copy} label="Copy" onClick={handleCopy} />
              <ToolbarButton label="CSV" onClick={handleExportCSV} />
              <ToolbarButton label="Excel" onClick={handleExportCSV} />
              <ToolbarButton label="Print" icon={Printer} onClick={() => window.print()} />
            </div>
          </div>

          <div className="relative w-full lg:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by payer, head, voucher, amount..."
              className="w-full border border-gray-200 rounded-[3px] pl-3 pr-10 py-1.5 text-[13px] focus:outline-none focus:border-[#00a65a]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#f0f9f4] text-[#00a65a] text-[11px] font-bold tracking-[0.5px] uppercase border-b border-emerald-100/60">
                <th className="py-3.5 px-4 w-14 text-center">#</th>
                <th className="py-3.5 px-4 border-l border-emerald-100/60 w-32">VOUCHER NO</th>
                <th className="py-3.5 px-4 border-l border-emerald-100/60">PAYER / DESCRIPTION</th>
                <th className="py-3.5 px-4 border-l border-emerald-100/60 w-48">INCOME HEAD</th>
                <th className="py-3.5 px-4 border-l border-emerald-100/60 w-28">DATE</th>
                <th className="py-3.5 px-4 border-l border-emerald-100/60 w-32">MODE</th>
                <th className="py-3.5 px-4 border-l border-emerald-100/60 text-right w-36">AMOUNT (₹)</th>
                <th className="py-3.5 px-4 border-l border-emerald-100/60 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#00a65a]" />
                      Loading income entries...
                    </div>
                  </td>
                </tr>
              ) : filteredIncome.length > 0 ? (
                filteredIncome.map((inc, i) => (
                  <tr key={inc.id || i} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-gray-400 font-medium">{i + 1}</td>
                    <td className="py-3.5 px-4 border-l border-gray-100 font-mono text-[12px] font-semibold text-gray-700">
                      {inc.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100">
                      <div className="font-semibold text-gray-800">{inc.name}</div>
                      {inc.note && <div className="text-[11px] text-gray-400 mt-0.5">{inc.note}</div>}
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100">
                      <span className="inline-block bg-emerald-50 text-[#008d4c] font-semibold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        {inc.head}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100 text-gray-600 font-medium">
                      {inc.date}
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100">
                      <span className="inline-block bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded text-[11px]">
                        {inc.paymentMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100 text-right font-bold text-[#00a65a] text-[14px]">
                      ₹{inc.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => { setSelectedIncome(inc); setShowReceiptModal(true); }}
                          title="View Voucher"
                          className="text-gray-500 hover:text-[#00a65a] hover:bg-emerald-50 p-1.5 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(inc)}
                          title="Edit Entry"
                          className="text-gray-500 hover:text-[#3c8dbc] hover:bg-blue-50 p-1.5 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(inc.id, inc.invoiceNo)}
                          title="Delete Entry"
                          className="text-gray-500 hover:text-[#d9534f] hover:bg-red-50 p-1.5 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <ArrowDown className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#00a65a]" />
                    <p className="font-semibold text-gray-600">No income records matched</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {search ? 'Try clearing or modifying your search query' : 'Click "Add Income" above to create your first voucher.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="p-3 border-t border-gray-100 bg-[#fbfbfb] flex flex-col sm:flex-row justify-between items-center text-[12px] text-gray-500 gap-2">
          <div>
            Showing <span className="font-semibold text-gray-700">{filteredIncome.length}</span> of <span className="font-semibold text-gray-700">{incomeData.length}</span> recorded entries
          </div>
          <div className="font-semibold text-gray-700">
            Filtered Subtotal: <span className="text-[#00a65a]">₹{filteredIncome.reduce((s, i) => s + i.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* ── ADD INCOME MODAL ────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <h3 className="font-bold text-[#333] flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-[#00a65a]" /> Add New Income Voucher
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Income Head *</label>
                  <select 
                    required 
                    value={addForm.head} 
                    onChange={e => setAddForm({...addForm, head: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#00a65a] bg-white"
                  >
                    {heads.map((h, i) => (
                      <option key={i} value={h.name}>{h.name}</option>
                    ))}
                    {heads.length === 0 && <option value="Tuition Fee Collection">Tuition Fee Collection</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Voucher / Invoice No *</label>
                  <input 
                    required 
                    type="text" 
                    value={addForm.invoiceNo} 
                    onChange={e => setAddForm({...addForm, invoiceNo: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#00a65a] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Payer / Source Entity Name *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Anand Sharma (Parent) or State Bank of India"
                  value={addForm.name} 
                  onChange={e => setAddForm({...addForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#00a65a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Amount (₹) *</label>
                  <input 
                    required 
                    type="number" 
                    min="1"
                    step="1"
                    placeholder="0.00"
                    value={addForm.amount} 
                    onChange={e => setAddForm({...addForm, amount: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#00a65a] font-bold text-[#00a65a]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Transaction Date *</label>
                  <input 
                    required 
                    type="date" 
                    value={addForm.date} 
                    onChange={e => setAddForm({...addForm, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#00a65a] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Payment Mode *</label>
                  <select 
                    value={addForm.paymentMode} 
                    onChange={e => setAddForm({...addForm, paymentMode: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#00a65a] bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / QR</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Particulars / Memo Note</label>
                <textarea 
                  rows="2"
                  placeholder="Optional details, cheque number, or reference note..."
                  value={addForm.note} 
                  onChange={e => setAddForm({...addForm, note: e.target.value})}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#00a65a] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#00a65a] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#008d4c] flex-1 shadow-sm"
                >
                  Save Income Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT INCOME MODAL ───────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <h3 className="font-bold text-[#333] flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#3c8dbc]" /> Edit Income Entry ({editForm.invoiceNo})
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Income Head *</label>
                  <select 
                    required 
                    value={editForm.head} 
                    onChange={e => setEditForm({...editForm, head: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] bg-white"
                  >
                    {heads.map((h, i) => (
                      <option key={i} value={h.name}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Voucher / Invoice No</label>
                  <input 
                    type="text" 
                    value={editForm.invoiceNo} 
                    onChange={e => setEditForm({...editForm, invoiceNo: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Payer / Source Name *</label>
                <input 
                  required 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Amount (₹) *</label>
                  <input 
                    required 
                    type="number" 
                    min="1"
                    value={editForm.amount} 
                    onChange={e => setEditForm({...editForm, amount: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] font-bold text-[#00a65a]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Date *</label>
                  <input 
                    required 
                    type="date" 
                    value={editForm.date} 
                    onChange={e => setEditForm({...editForm, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1">Payment Mode</label>
                  <select 
                    value={editForm.paymentMode} 
                    onChange={e => setEditForm({...editForm, paymentMode: e.target.value})}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / QR</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Note</label>
                <textarea 
                  rows="2"
                  value={editForm.note} 
                  onChange={e => setEditForm({...editForm, note: e.target.value})}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#3c8dbc] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#367fa9] flex-1 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRINTABLE VOUCHER / RECEIPT MODAL ─────────────── */}
      {showReceiptModal && selectedIncome && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="bg-[#00a65a] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[16px] tracking-wide">OFFICIAL INCOME VOUCHER</h3>
                <p className="text-[11px] opacity-85">School Financial & Treasury Department</p>
              </div>
              <button onClick={() => setShowReceiptModal(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Voucher No</span>
                  <span className="font-mono font-bold text-[14px] text-gray-800">{selectedIncome.invoiceNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Date</span>
                  <span className="font-semibold text-gray-800">{selectedIncome.date}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-dashed border-gray-100">
                  <span className="text-gray-500 font-medium">Income Head:</span>
                  <span className="font-bold text-gray-800">{selectedIncome.head}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-gray-100">
                  <span className="text-gray-500 font-medium">Received From:</span>
                  <span className="font-bold text-gray-800">{selectedIncome.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-gray-100">
                  <span className="text-gray-500 font-medium">Payment Mode:</span>
                  <span className="font-bold text-gray-800">{selectedIncome.paymentMode}</span>
                </div>
                {selectedIncome.note && (
                  <div className="flex justify-between py-1 border-b border-dashed border-gray-100">
                    <span className="text-gray-500 font-medium">Particulars:</span>
                    <span className="font-semibold text-gray-700 text-right max-w-[200px]">{selectedIncome.note}</span>
                  </div>
                )}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-4 text-center">
                <span className="text-gray-500 text-[11px] uppercase font-bold block mb-1">Total Amount Received</span>
                <span className="text-[26px] font-bold text-[#00a65a]">
                  ₹{Number(selectedIncome.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-6 flex justify-between items-end text-[11px] text-gray-400">
                <div className="text-center">
                  <div className="w-24 border-b border-gray-300 pb-1 mb-1 font-mono text-[9px]">AUTHORIZED</div>
                  <span>Accountant Sign</span>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b border-gray-300 pb-1 mb-1 font-mono text-[9px]">OFFICE STAMP</div>
                  <span>Cashier / Stamp</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-semibold hover:bg-gray-100"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Income;

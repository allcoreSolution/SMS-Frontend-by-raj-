import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Gauge, ArrowDown, ArrowUp, FileSearch, Tag,
  Plus, Edit, Trash2, X, RefreshCw, Copy, Printer, Search,
  Bookmark
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const ACCOUNTS_NAV_TABS = [
  { label: 'Dashboard', icon: Gauge, path: '/accounts/dashboard' },
  { label: 'Income', icon: ArrowDown, path: '/accounts/income' },
  { label: 'Expense', icon: ArrowUp, path: '/accounts/expense' },
  { label: 'Day Book', icon: FileSearch, path: '/accounts/day-book' },
  { label: 'Income Heads', icon: Tag, path: '/accounts/income-heads' },
  { label: 'Expense Heads', icon: Tag, path: '/accounts/expense-heads', active: true },
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

const ExpenseHeads = () => {
  const [heads, setHeads] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [headsRes, expRes] = await Promise.all([
        accountantService.getExpenseHeads(),
        accountantService.getExpenses()
      ]);
      if (headsRes.success) setHeads(headsRes.data || []);
      if (expRes.success) setExpenses(expRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Filtered Heads
  const filteredHeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return heads;
    return heads.filter(h => 
      (h.name && h.name.toLowerCase().includes(q)) ||
      (h.code && h.code.toLowerCase().includes(q)) ||
      (h.description && h.description.toLowerCase().includes(q))
    );
  }, [heads, search]);

  // Aggregate disbursement per head
  const headTotals = useMemo(() => {
    const map = {};
    expenses.forEach(exp => {
      const hName = exp.head || 'General';
      map[hName] = (map[hName] || 0) + (Number(exp.amount) || 0);
    });
    return map;
  }, [expenses]);

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', code: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (h) => {
    setEditId(h.id || h._id);
    setForm({ name: h.name || '', code: h.code || '', description: h.description || '' });
    setShowModal(true);
  };

  const handleNameChange = (val) => {
    const codeGen = val.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4);
    setForm(prev => ({
      ...prev,
      name: val,
      code: prev.code ? prev.code : codeGen
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return Swal.fire('Error', 'Expense Head Name is required', 'error');
    try {
      if (editId) {
        await accountantService.updateExpenseHead(editId, {
          name: form.name.trim(),
          code: form.code.trim().toUpperCase() || 'EH',
          description: form.description.trim()
        });
      } else {
        await accountantService.addExpenseHead({
          name: form.name.trim(),
          code: form.code.trim().toUpperCase() || form.name.slice(0, 3).toUpperCase(),
          description: form.description.trim()
        });
      }
      Swal.fire({ 
        title: editId ? 'Updated!' : 'Saved!', 
        text: 'Expense Head saved successfully', 
        icon: 'success', 
        timer: 1200, 
        showConfirmButton: false 
      });
      setShowModal(false);
      load();
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to save', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    const conf = await Swal.fire({ 
      title: 'Delete Expense Head?', 
      text: `Are you sure you want to delete "${name}"?`,
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete'
    });
    if (conf.isConfirmed) {
      await accountantService.deleteExpenseHead(id);
      Swal.fire({ title: 'Deleted', icon: 'success', timer: 1000, showConfirmButton: false });
      load();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (heads.length === 0) return Swal.fire('Info', 'No heads to export', 'info');
    const headers = ['#', 'Expense Head Name', 'Code', 'Description', 'Total Outflow (INR)'];
    const rows = heads.map((h, idx) => [
      idx + 1,
      `"${h.name || ''}"`,
      `"${h.code || ''}"`,
      `"${h.description || ''}"`,
      headTotals[h.name] || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expense_heads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    const text = heads.map(h => `${h.name} (${h.code || 'N/A'}) - ${h.description || ''}`).join('\n');
    navigator.clipboard.writeText(text);
    Swal.fire({ title: 'Copied!', text: 'Expense heads copied to clipboard', icon: 'success', timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] leading-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#e83e8c]" /> Expense Heads & Cost Centers
          </h1>
          <p className="text-[13px] text-gray-500">
            Categorize operational overheads, staff payroll, utilities, transport fuel, and stationery disbursements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-[3px] bg-[#e83e8c] hover:bg-[#d63384] text-white font-semibold text-[13px] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Expense Head
          </button>
          <button 
            onClick={load} 
            title="Refresh Data"
            className="p-1.5 border border-gray-300 rounded-[3px] bg-white text-gray-600 hover:bg-gray-50 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#e83e8c]' : ''}`} />
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
                  ? 'bg-white text-[#e83e8c] border-t-2 border-t-[#e83e8c] shadow-xs'
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#e83e8c] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Configured Expense Heads</span>
            <h3 className="text-[26px] font-bold mt-1">{heads.length}</h3>
            <span className="text-[11px] opacity-80">Budgetary Categories</span>
          </div>
          <Tag className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#dd4b39] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Outflow Disbursed</span>
            <h3 className="text-[26px] font-bold mt-1">₹{Object.values(headTotals).reduce((a, b) => a + b, 0).toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Mapped Across Expense Vouchers</span>
          </div>
          <ArrowUp className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#605ca8] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Ledger Compliance</span>
            <h3 className="text-[26px] font-bold mt-1">100%</h3>
            <span className="text-[11px] opacity-80">Audited Expenditure Heads</span>
          </div>
          <Bookmark className="w-12 h-12 text-black/10" />
        </div>
      </div>

      {/* Table Panel */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm flex flex-col mb-4">
        
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#fefefe]">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#e83e8c]" />
            <h2 className="text-[16px] font-bold text-[#333]">Configured Expense Heads</h2>
            <span className="text-[12px] bg-pink-100 text-[#e83e8c] font-bold px-2 py-0.5 rounded-full ml-1">
              {filteredHeads.length} Heads
            </span>
          </div>
        </div>

        {/* Action Toolbar & Search */}
        <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-0 rounded-[3px] overflow-hidden border border-gray-200">
            <ToolbarButton icon={Copy} label="Copy" onClick={handleCopy} />
            <ToolbarButton label="CSV" onClick={handleExportCSV} />
            <ToolbarButton label="Excel" onClick={handleExportCSV} />
            <ToolbarButton label="Print" icon={Printer} onClick={() => window.print()} />
          </div>

          <div className="relative w-full lg:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expense head or code..."
              className="w-full border border-gray-200 rounded-[3px] pl-3 pr-10 py-1.5 text-[13px] focus:outline-none focus:border-[#e83e8c]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#fff5f9] text-[#e83e8c] text-[11px] font-bold tracking-[0.5px] uppercase border-b border-pink-100/60">
                <th className="py-3.5 px-5 w-16 text-center">#</th>
                <th className="py-3.5 px-5 border-l border-pink-100/60 w-1/4">EXPENSE HEAD</th>
                <th className="py-3.5 px-5 border-l border-pink-100/60 w-28">CODE</th>
                <th className="py-3.5 px-5 border-l border-pink-100/60">DESCRIPTION</th>
                <th className="py-3.5 px-5 border-l border-pink-100/60 text-right w-40">MAPPED OUTFLOW (₹)</th>
                <th className="py-3.5 px-5 border-l border-pink-100/60 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#e83e8c]" />
                      Loading expense heads...
                    </div>
                  </td>
                </tr>
              ) : filteredHeads.length > 0 ? (
                filteredHeads.map((h, i) => (
                  <tr key={h.id || i} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-5 text-center text-gray-400 font-medium">{i + 1}</td>
                    <td className="py-4 px-5 border-l border-gray-100 font-bold text-gray-800">
                      {h.name}
                    </td>
                    <td className="py-4 px-5 border-l border-gray-100">
                      <span className="inline-block bg-pink-50 text-[#c2185b] font-mono font-bold px-2 py-0.5 rounded text-[11px] border border-pink-200">
                        {h.code || 'EH'}
                      </span>
                    </td>
                    <td className="py-4 px-5 border-l border-gray-100 text-gray-500 text-[12px]">
                      {h.description || '—'}
                    </td>
                    <td className="py-4 px-5 border-l border-gray-100 text-right font-bold text-[#dd4b39] text-[13px]">
                      ₹{(headTotals[h.name] || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5 border-l border-gray-100 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEdit(h)}
                          title="Edit Head"
                          className="text-gray-500 hover:text-[#3c8dbc] hover:bg-blue-50 p-1.5 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(h.id || h._id, h.name)}
                          title="Delete Head"
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
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#e83e8c]" />
                    <p className="font-semibold text-gray-600">No expense heads found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD / EDIT MODAL ────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <h3 className="font-bold text-[#333] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#e83e8c]" /> {editId ? 'Edit Expense Head' : 'Add New Expense Head'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Expense Head Name *</label>
                <input 
                  required 
                  type="text" 
                  value={form.name} 
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Sports & Annual Function"
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#e83e8c]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Head Code / Abbreviation</label>
                <input 
                  type="text" 
                  value={form.code} 
                  onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SPT"
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#e83e8c] font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Description / Notes</label>
                <textarea 
                  rows="3"
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Detailed description of this expenditure category..."
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#e83e8c] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#e83e8c] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#d63384] flex-1 shadow-sm"
                >
                  {editId ? 'Update Head' : 'Save Head'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpenseHeads;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  List, LayoutGrid, Copy, Download, Printer, 
  Search, FileSymlink, RefreshCw, CheckCircle2, 
  X, Check, ShieldCheck, ArrowRight, ExternalLink, Calendar, Wallet
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { Link } from 'react-router-dom';

export default function Transactions({ activeChild }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  // Filters & State
  const [search, setSearch] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');
  const [view, setView] = useState('list'); // 'list' | 'grid'
  const [copiedText, setCopiedText] = useState(false);

  // Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [activeChild]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const [txRes, ledgerRes] = await Promise.all([
        parentService.getTransactions(activeChild ? { studentId: activeChild } : {}),
        parentService.getFeeLedger(activeChild ? { studentId: activeChild } : {})
      ]);

      if (txRes?.success && Array.isArray(txRes.data)) {
        setTransactions(txRes.data);
      } else {
        setTransactions([]);
      }

      if (ledgerRes?.success && ledgerRes.data?.student) {
        setStudentInfo(ledgerRes.data.student);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Filtered
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchMode = selectedMode === 'All' || t.mode?.toLowerCase() === selectedMode.toLowerCase();
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        t.id?.toLowerCase().includes(q) ||
        t.group?.toLowerCase().includes(q) ||
        t.referenceNo?.toLowerCase().includes(q) ||
        t.date?.toLowerCase().includes(q);

      return matchMode && matchSearch;
    });
  }, [transactions, selectedMode, search]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalCount = transactions.length;
    const totalAmount = transactions.reduce((s, t) => s + (t.amount || 0), 0);
    const onlineCount = transactions.filter(t => t.mode === 'Online' || t.mode === 'UPI' || t.mode === 'Card').length;
    return {
      totalCount,
      totalAmount,
      onlineCount
    };
  }, [transactions]);

  // CSV Export
  const downloadCSV = () => {
    const headers = ['RECEIPT NO', 'DATE', 'FEE GROUP / HEAD', 'PAYMENT MODE', 'AMOUNT (INR)', 'REFERENCE NO', 'STATUS'];
    const rows = filtered.map(t => [
      t.id, 
      `"${t.date}"`, 
      `"${t.group}"`, 
      t.mode, 
      t.amount, 
      `"${t.referenceNo || ''}"`, 
      t.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_${studentInfo?.name ? studentInfo.name.replace(/\s+/g, '_') : 'history'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy
  const handleCopy = () => {
    const text = filtered.map(t => `${t.id}\t${t.date}\t${t.group}\t${t.mode}\tRs ${t.amount}\t${t.status}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const studentName = studentInfo?.name || '—';
  const studentClass = studentInfo?.class || '—';

  return (
    <div className="p-3 sm:p-5 max-w-[1240px] mx-auto space-y-5 min-h-screen pb-24 bg-slate-50">
      {/* Royal Blue Hero Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-blue-400/20 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Glow circle */}
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
              Financial Records
            </span>
            <span className="text-blue-300/60">•</span>
            <span className="text-[10px] font-bold text-amber-300 bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-0.5 rounded-full">
              Verified Receipts
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
            Payment & Transaction Records
          </h1>
          <p className="text-[12px] text-blue-100 mt-1">
            Verified bank receipts & online clearance history for: <strong className="text-white">{studentName || 'Kabir Singh'}</strong> ({studentClass || 'Class 10th (A)'})
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center flex-shrink-0 relative z-10">
          <Link
            to="/fee-payments"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold transition-all shadow-xs backdrop-blur-sm cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-amber-300" />
            <span>Fee Ledger</span>
          </Link>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
            <FileSymlink className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Receipts</span>
            <span className="text-2xl font-black text-slate-900 leading-none">{stats.totalCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Settled Amount</span>
            <span className="text-2xl font-black text-emerald-600 leading-none">₹ {stats.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Online Authorizations</span>
            <span className="text-2xl font-black text-indigo-600 leading-none">{stats.onlineCount} Receipts</span>
          </div>
        </div>
      </div>

      {/* Main Table / Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by receipt ID, fee head..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white shadow-2xs font-medium"
              />
            </div>

            {/* Mode Filter */}
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={downloadCSV}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            {/* View Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-0.5">
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading verified transactions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            No matching transactions found.
          </div>
        ) : view === 'list' ? (
          /* List View */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px] text-xs">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Receipt ID</th>
                  <th className="px-5 py-3.5">Payment Date</th>
                  <th className="px-5 py-3.5">Fee Head / Purpose</th>
                  <th className="px-5 py-3.5">Mode</th>
                  <th className="px-5 py-3.5 text-right">Amount Paid</th>
                  <th className="px-5 py-3.5 text-center">Clearance Status</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filtered.map((t, idx) => (
                  <tr key={t._id || idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      {t.id}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {t.date}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800">
                      {t.group}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        {t.mode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-emerald-600 whitespace-nowrap">
                      ₹ {(t.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Successful
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => setActiveReceipt(t)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 mx-auto"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t, idx) => (
              <div key={t._id || idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/40 hover:bg-white hover:border-indigo-300 transition-all space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700">{t.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">{t.mode}</span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-1">{t.group}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">{t.date}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-base font-black text-emerald-600">₹ {t.amount.toLocaleString()}</span>
                  <button
                    onClick={() => setActiveReceipt(t)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" /> Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Printable Fee Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Official Digital Fee Receipt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </button>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Container */}
            <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-5">
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-4 border-b border-dashed border-gray-200">
                <h2 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tight">
                  ALL CORE SOLUTIONS
                </h2>
                <p className="text-[11px] text-gray-500 font-medium">Affiliated to CBSE | Institutional Area, New Delhi</p>
                <p className="text-[10px] text-gray-400 font-mono">School ERP Electronic Fee Clearance Receipt</p>
              </div>

              {/* Receipt Details Meta */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">Receipt Number</span>
                  <span className="font-mono font-black text-indigo-700 text-sm">{activeReceipt.id}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">Payment Date & Time</span>
                  <span className="font-semibold text-gray-800">{activeReceipt.dateTime || activeReceipt.date}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">Student Name</span>
                  <span className="font-bold text-gray-900">{studentName}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">Class & Section</span>
                  <span className="font-bold text-gray-900">{studentClass}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">Payment Mode</span>
                  <span className="font-semibold text-gray-800">{activeReceipt.mode}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase font-bold">Transaction Reference</span>
                  <span className="font-mono font-semibold text-gray-800">{activeReceipt.referenceNo}</span>
                </div>
              </div>

              {/* Fee Line Items */}
              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-[10px] font-black uppercase text-gray-700">
                    <tr>
                      <th className="p-2.5">Description / Fee Head</th>
                      <th className="p-2.5 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-2.5 font-bold text-gray-800">{activeReceipt.group}</td>
                      <td className="p-2.5 text-right font-semibold">₹ {activeReceipt.amount.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-gray-50 font-black text-gray-900">
                      <td className="p-2.5 uppercase">Total Paid in Full</td>
                      <td className="p-2.5 text-right text-emerald-600 text-sm">₹ {activeReceipt.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Seal and note */}
              <div className="pt-3 flex items-center justify-between text-xs text-gray-400 border-t border-dashed border-gray-200">
                <div>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Online
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">This is a system generated receipt. No physical signature required.</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Accounts Department</span>
                  <span className="font-bold text-gray-800 text-xs">Authorized Signatory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSearch, Search, Printer, Download, Gauge, ArrowDown, ArrowUp, Tag,
  Calendar, RefreshCw, Copy, CheckCircle2, DollarSign, Wallet, ArrowDownCircle, ArrowUpCircle, Layers
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const ACCOUNTS_NAV_TABS = [
  { label: 'Dashboard', icon: Gauge, path: '/accounts/dashboard' },
  { label: 'Income', icon: ArrowDown, path: '/accounts/income' },
  { label: 'Expense', icon: ArrowUp, path: '/accounts/expense' },
  { label: 'Day Book', icon: FileSearch, path: '/accounts/day-book', active: true },
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

const DayBook = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [showAllDates, setShowAllDates] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (targetDate = date, all = showAllDates) => {
    setLoading(true);
    try {
      // Fetch day book or all records
      let mapped = [];

      if (all) {
        // Fetch all incomes, collections, expenses
        const [incRes, expRes, colRes] = await Promise.all([
          accountantService.getIncomes(),
          accountantService.getExpenses(),
          accountantService.getCollections ? accountantService.getCollections() : { success: true, data: [] }
        ]);

        const incs = incRes.success ? incRes.data : [];
        const exps = expRes.success ? expRes.data : [];
        const cols = colRes.success ? colRes.data : [];

        mapped = [
          ...incs.map(i => ({
            id: i.id || i._id,
            voucher: i.invoiceNo || i.refNo || `INC-${(i.id || '101').slice(-4)}`,
            date: i.date || targetDate,
            type: 'Income',
            head: i.head || 'General',
            party: i.name || i.note || 'Revenue Inflow',
            note: i.note || '',
            inflow: Number(i.amount) || 0,
            outflow: 0,
            mode: i.paymentMode || i.mode || 'Cash'
          })),
          ...cols.map(c => ({
            id: c.id || c._id,
            voucher: c.receipt || `RCP-${(c.id || '101').slice(-4)}`,
            date: c.date || targetDate,
            type: 'Fee Collection',
            head: 'Student Fee',
            party: `${c.studentName || 'Student'} (${c.className || 'General'})`,
            note: c.note || 'Fee Payment',
            inflow: Number(c.amount) || 0,
            outflow: 0,
            mode: c.mode || 'UPI'
          })),
          ...exps.map(e => ({
            id: e.id || e._id,
            voucher: e.voucherNo || e.refNo || `EXP-${(e.id || '201').slice(-4)}`,
            date: e.date || targetDate,
            type: 'Expense',
            head: e.head || 'General',
            party: e.name || e.note || 'Vendor / Disbursement',
            note: e.note || '',
            inflow: 0,
            outflow: Number(e.amount) || 0,
            mode: e.paymentMode || e.mode || 'Cash'
          }))
        ];
      } else {
        const res = await accountantService.getDayBook(targetDate);
        if (res.success && res.data) {
          const { incomes = [], expenses = [], collections = [] } = res.data;
          mapped = [
            ...incomes.map(i => ({
              id: i.id || i._id,
              voucher: i.invoiceNo || i.refNo || `INC-${(i.id || '101').slice(-4)}`,
              date: i.date || targetDate,
              type: 'Income',
              head: i.head || 'General',
              party: i.name || i.note || 'Revenue Inflow',
              note: i.note || '',
              inflow: Number(i.amount) || 0,
              outflow: 0,
              mode: i.paymentMode || i.mode || 'Cash'
            })),
            ...collections.map(c => ({
              id: c.id || c._id,
              voucher: c.receipt || `RCP-${(c.id || '101').slice(-4)}`,
              date: c.date || targetDate,
              type: 'Fee Collection',
              head: 'Student Fee',
              party: `${c.studentName || 'Student'} (${c.className || 'General'})`,
              note: c.note || 'Fee Payment',
              inflow: Number(c.amount) || 0,
              outflow: 0,
              mode: c.mode || 'UPI'
            })),
            ...expenses.map(e => ({
              id: e.id || e._id,
              voucher: e.voucherNo || e.refNo || `EXP-${(e.id || '201').slice(-4)}`,
              date: e.date || targetDate,
              type: 'Expense',
              head: e.head || 'General',
              party: e.name || e.note || 'Vendor / Disbursement',
              note: e.note || '',
              inflow: 0,
              outflow: Number(e.amount) || 0,
              mode: e.paymentMode || e.mode || 'Cash'
            }))
          ];
        }
      }

      // Sort chronological
      mapped.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setRows(mapped);
    } catch (e) {
      console.error('Error fetching day book:', e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date, showAllDates);
  }, [date, showAllDates]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q ||
        (r.voucher && r.voucher.toLowerCase().includes(q)) ||
        (r.party && r.party.toLowerCase().includes(q)) ||
        (r.head && r.head.toLowerCase().includes(q)) ||
        (r.note && r.note.toLowerCase().includes(q)) ||
        String(r.inflow).includes(q) ||
        String(r.outflow).includes(q);

      let matchesType = true;
      if (typeFilter === 'INCOME') matchesType = r.type === 'Income' || r.type === 'Fee Collection';
      else if (typeFilter === 'EXPENSE') matchesType = r.type === 'Expense';
      else if (typeFilter === 'FEES') matchesType = r.type === 'Fee Collection';

      return matchesSearch && matchesType;
    });
  }, [rows, search, typeFilter]);

  // Totals
  const totalInflow = filteredRows.reduce((s, r) => s + r.inflow, 0);
  const totalOutflow = filteredRows.reduce((s, r) => s + r.outflow, 0);
  const netBalance = totalInflow - totalOutflow;

  // Preset Date Handlers
  const handleSetToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
    setShowAllDates(false);
  };

  const handleSetYesterday = () => {
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    setDate(yest.toISOString().slice(0, 10));
    setShowAllDates(false);
  };

  const handleSetAllDates = () => {
    setShowAllDates(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredRows.length === 0) return Swal.fire('Info', 'No records to export', 'info');
    const headers = ['#', 'Date', 'Voucher / Receipt', 'Type', 'Head', 'Party / Description', 'Mode', 'Inflow (+INR)', 'Outflow (-INR)'];
    const csvRows = filteredRows.map((r, idx) => [
      idx + 1,
      `"${r.date}"`,
      `"${r.voucher}"`,
      `"${r.type}"`,
      `"${r.head}"`,
      `"${r.party}"`,
      `"${r.mode}"`,
      r.inflow,
      r.outflow
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daybook_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy
  const handleCopy = () => {
    const text = filteredRows.map(r => `${r.date}\t${r.voucher}\t${r.type}\t${r.party}\t+₹${r.inflow}\t-₹${r.outflow}`).join('\n');
    navigator.clipboard.writeText(text);
    Swal.fire({ title: 'Copied!', text: 'Day Book entries copied to clipboard', icon: 'success', timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] leading-tight flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-[#3c8dbc]" /> Daily Day Book & Cash Ledger
          </h1>
          <p className="text-[13px] text-gray-500">
            Real-time daily audit log combining Fee Collections, Miscellaneous Incomes, and Expense Disbursements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => load(date, showAllDates)} 
            title="Refresh Ledger"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-[3px] bg-white text-gray-600 hover:bg-gray-50 shadow-xs text-[13px]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#3c8dbc]' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded-[3px] text-[13px] font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4" /> Print Day Sheet
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
                  ? 'bg-white text-[#3c8dbc] border-t-2 border-t-[#3c8dbc] shadow-xs'
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
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Day Inflow</span>
            <h3 className="text-[24px] font-bold mt-1">+₹{totalInflow.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Fees + Revenue Received</span>
          </div>
          <ArrowDownCircle className="w-10 h-10 text-black/10" />
        </div>

        <div className="bg-[#dd4b39] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Day Outflow</span>
            <h3 className="text-[24px] font-bold mt-1">-₹{totalOutflow.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Disbursements & Overheads</span>
          </div>
          <ArrowUpCircle className="w-10 h-10 text-black/10" />
        </div>

        <div className={`${netBalance >= 0 ? 'bg-[#3c8dbc]' : 'bg-[#e08e0b]'} text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between`}>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Net Day Position</span>
            <h3 className="text-[24px] font-bold mt-1">₹{netBalance.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">{netBalance >= 0 ? 'Surplus Balance' : 'Deficit Outflow'}</span>
          </div>
          <Wallet className="w-10 h-10 text-black/10" />
        </div>

        <div className="bg-[#605ca8] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Audit Scope</span>
            <h3 className="text-[24px] font-bold mt-1">{filteredRows.length}</h3>
            <span className="text-[11px] opacity-80">{showAllDates ? 'All-Time Records' : `Date: ${date}`}</span>
          </div>
          <FileSearch className="w-10 h-10 text-black/10" />
        </div>
      </div>

      {/* Date Filter & Range Ribbon */}
      <div className="bg-white rounded-[3px] border border-gray-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-[13px] font-bold text-gray-700">Audit Date:</span>
            <input
              type="date"
              value={date}
              disabled={showAllDates}
              onChange={(e) => { setDate(e.target.value); setShowAllDates(false); }}
              className={`border border-gray-300 rounded-[3px] px-3 py-1 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc] ${showAllDates ? 'opacity-40 cursor-not-allowed' : ''}`}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSetToday}
              className={`px-3 py-1 rounded-[3px] text-[12px] font-semibold border transition-colors ${!showAllDates && date === new Date().toISOString().slice(0, 10) ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
            >
              Today
            </button>
            <button
              onClick={handleSetYesterday}
              className="px-3 py-1 rounded-[3px] text-[12px] font-semibold border bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors"
            >
              Yesterday
            </button>
            <button
              onClick={handleSetAllDates}
              className={`px-3 py-1 rounded-[3px] text-[12px] font-semibold border transition-colors ${showAllDates ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
            >
              Show All Time Ledger
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-[3px] px-3 py-1.5 text-[12px] bg-white focus:outline-none focus:border-[#3c8dbc]"
          >
            <option value="ALL">All Transaction Streams</option>
            <option value="INCOME">All Inflows (Income + Fees)</option>
            <option value="EXPENSE">Only Outflows (Expenses)</option>
            <option value="FEES">Only Fee Collections</option>
          </select>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm flex flex-col mb-4">
        
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 bg-[#fefefe]">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-[#3c8dbc]" />
            <h2 className="text-[16px] font-bold text-[#333]">
              {showAllDates ? 'Consolidated Ledger Records' : `Daily Ledger Sheet (${date})`}
            </h2>
            <span className="text-[12px] bg-blue-100 text-[#3c8dbc] font-bold px-2 py-0.5 rounded-full ml-1">
              {filteredRows.length} Items
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by voucher, party, head..."
              className="w-full border border-gray-200 rounded-[3px] pl-3 pr-10 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 flex justify-between items-center bg-white border-b border-gray-100">
          <div className="flex items-center gap-0 rounded-[3px] overflow-hidden border border-gray-200">
            <ToolbarButton icon={Copy} label="Copy" onClick={handleCopy} />
            <ToolbarButton label="CSV" onClick={handleExportCSV} />
            <ToolbarButton label="Print" icon={Printer} onClick={() => window.print()} />
          </div>

          <div className="text-[12px] text-gray-500">
            Audit status: <span className="text-emerald-600 font-semibold">Active & Balanced</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-[#f2f7fb] text-[#3c8dbc] text-[11px] font-bold tracking-[0.5px] uppercase border-b border-blue-100/60">
                <th className="py-3.5 px-4 w-14 text-center">#</th>
                <th className="py-3.5 px-4 border-l border-blue-100/60 w-28">DATE</th>
                <th className="py-3.5 px-4 border-l border-blue-100/60 w-32">VOUCHER / RCP</th>
                <th className="py-3.5 px-4 border-l border-blue-100/60 w-36">STREAM TYPE</th>
                <th className="py-3.5 px-4 border-l border-blue-100/60">PARTICULARS / PARTY</th>
                <th className="py-3.5 px-4 border-l border-blue-100/60 w-28">MODE</th>
                <th className="py-3.5 px-4 border-l border-blue-100/60 text-right w-36 text-emerald-700">INFLOW (+₹)</th>
                <th className="py-3.5 px-4 border-l border-blue-100/60 text-right w-36 text-rose-700">OUTFLOW (-₹)</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#3c8dbc]" />
                      Loading ledger transactions...
                    </div>
                  </td>
                </tr>
              ) : filteredRows.length > 0 ? (
                filteredRows.map((r, i) => (
                  <tr key={r.id || i} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-gray-400 font-medium">{i + 1}</td>
                    <td className="py-3.5 px-4 border-l border-gray-100 text-gray-600 font-medium">
                      {r.date}
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100 font-mono font-semibold text-gray-700 text-[12px]">
                      {r.voucher}
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100">
                      <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] border ${
                        r.type === 'Fee Collection' 
                          ? 'bg-purple-50 text-[#605ca8] border-purple-200' 
                          : r.type === 'Income'
                            ? 'bg-emerald-50 text-[#00a65a] border-emerald-200'
                            : 'bg-red-50 text-[#dd4b39] border-red-200'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100">
                      <div className="font-semibold text-gray-800">{r.party}</div>
                      <div className="text-[11px] text-gray-400">Head: {r.head} {r.note ? `• ${r.note}` : ''}</div>
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100">
                      <span className="inline-block bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded text-[11px]">
                        {r.mode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100 text-right font-bold text-[#00a65a] text-[13px]">
                      {r.inflow > 0 ? `+₹${r.inflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 border-l border-gray-100 text-right font-bold text-[#dd4b39] text-[13px]">
                      {r.outflow > 0 ? `-₹${r.outflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <FileSearch className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#3c8dbc]" />
                    <p className="font-semibold text-gray-600">No transactions recorded for this period</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Select a different date or click "Show All Time Ledger" above.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table Summary Footer */}
            {filteredRows.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50/90 font-bold text-[13px] border-t-2 border-gray-200">
                  <td colSpan={6} className="py-3.5 px-4 text-right text-gray-700">
                    TOTAL AUDIT BALANCE:
                  </td>
                  <td className="py-3.5 px-4 border-l border-gray-200 text-right text-[#00a65a]">
                    +₹{totalInflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 border-l border-gray-200 text-right text-[#dd4b39]">
                    -₹{totalOutflow.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        
        {/* Table Bottom Ribbon */}
        <div className="p-3 border-t border-gray-100 bg-[#fbfbfb] flex flex-col sm:flex-row justify-between items-center text-[12px] text-gray-500 gap-2">
          <div>
            Showing <span className="font-semibold text-gray-700">{filteredRows.length}</span> audit line items
          </div>
          <div className="font-semibold">
            Net Surplus / Deficit: <span className={netBalance >= 0 ? 'text-[#00a65a]' : 'text-[#dd4b39]'}>₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DayBook;

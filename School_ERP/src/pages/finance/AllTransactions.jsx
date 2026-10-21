import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Download, Printer, LayoutGrid, List as ListIcon, 
  ArrowRightLeft, FileText, CheckCircle2, Filter, X, 
  RefreshCw, Receipt, CreditCard, Calendar, Eye, Sparkles
} from 'lucide-react';
import QuickSetupModal from '../../components/finance/QuickSetupModal';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';

const AllTransactions = () => {
  const navigate = useNavigate();
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState(null);

  const fetchTransactions = async (params = {}) => {
    try {
      setLoading(true);
      const res = await feeCollectionService.getAllTransactions(params);
      const raw = res?.data || [];
      const mapped = raw.map((t, i) => {
        const amt = t.amountPaid !== undefined ? t.amountPaid : (t.amount || 0);
        const sName = t.student ? `${t.student.firstName || ''} ${t.student.lastName || ''}`.trim() : 'Enrolled Student';
        const sAdm = t.student?.aparId || t.student?.admissionNo || 'N/A';
        const sClass = t.student?.classId?.className || 'Class I';

        return {
          no: i + 1,
          _id: t._id,
          receiptNo: t.receiptNo || `REC-${i + 1001}`,
          studentName: sName,
          admissionNo: sAdm,
          className: sClass,
          groupName: t.feeGroup?.name || 'Academic Fee',
          paymentMode: t.paymentMode || 'Cash',
          referenceNo: t.referenceNo || 'Counter',
          amountPaid: amt,
          fineAmount: t.fineAmount || 0,
          paymentDate: t.paymentDate || t.createdAt || new Date(),
          formattedDate: new Date(t.paymentDate || t.createdAt || new Date()).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }),
          status: 'Cleared'
        };
      });

      setTransactions(mapped);
      setFilteredTxns(mapped);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setTransactions([]);
      setFilteredTxns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];
    if (selectedMode !== 'All') {
      result = result.filter(t => t.paymentMode === selectedMode);
    }
    if (dateFrom) {
      const fromD = new Date(dateFrom);
      result = result.filter(t => new Date(t.paymentDate) >= fromD);
    }
    if (dateTo) {
      const toD = new Date(dateTo);
      toD.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.paymentDate) <= toD);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.receiptNo.toLowerCase().includes(q) || 
        t.studentName.toLowerCase().includes(q) ||
        t.admissionNo.toLowerCase().includes(q) ||
        t.referenceNo.toLowerCase().includes(q)
      );
    }
    setFilteredTxns(result);
  }, [selectedMode, dateFrom, dateTo, searchQuery, transactions]);

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedMode('All');
    setSearchQuery('');
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Receipt No', 'Student Name', 'Admission No', 'Class', 'Fee Group', 'Payment Mode', 'Reference No', 'Amount Paid', 'Date'];
    const rows = filteredTxns.map(t => [
      t.no,
      t.receiptNo,
      `"${t.studentName}"`,
      t.admissionNo,
      t.className,
      `"${t.groupName}"`,
      t.paymentMode,
      t.referenceNo,
      t.amountPaid,
      `"${t.formattedDate}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fee_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI calculations
  const totalVolume = filteredTxns.reduce((sum, t) => sum + t.amountPaid, 0);
  const onlineVolume = filteredTxns.filter(t => t.paymentMode === 'Online').reduce((sum, t) => sum + t.amountPaid, 0);
  const cashVolume = filteredTxns.filter(t => t.paymentMode === 'Cash').reduce((sum, t) => sum + t.amountPaid, 0);
  const chequeVolume = filteredTxns.filter(t => t.paymentMode === 'Cheque' || t.paymentMode === 'DD').reduce((sum, t) => sum + t.amountPaid, 0);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/10 mb-6 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2 border border-white/10">
              <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Institutional Audit & Payment Journal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              All Fee Transactions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Complete chronological audit trail of all receipts processed across counters, bank drafts, and digital gateways.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchTransactions()}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      <FinanceTabs />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Volume</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">₹{totalVolume.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-slate-500 font-semibold">{filteredTxns.length} receipts</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online & UPI</p>
            <h3 className="text-xl font-black text-emerald-600 mt-0.5">₹{onlineVolume.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Digital Gateways</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cash Counter</p>
            <h3 className="text-xl font-black text-blue-600 mt-0.5">₹{cashVolume.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-blue-600 font-semibold">Physical Cashiers</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cheques & DD</p>
            <h3 className="text-xl font-black text-violet-600 mt-0.5">₹{chequeVolume.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-violet-600 font-semibold">Bank Clearances</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Date & Filter Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filter Transactions Journal</span>
          </h3>
          {(dateFrom || dateTo || selectedMode !== 'All' || searchQuery) && (
            <button 
              onClick={handleClearFilters}
              className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Payment Mode</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Modes (Cash, Online, Cheque, DD)</option>
              <option value="Online">Online UPI / Card</option>
              <option value="Cash">Cash Counter</option>
              <option value="Cheque">Bank Cheque</option>
              <option value="DD">Demand Draft</option>
            </select>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Search Receipt / Student / Ref No</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by receipt number, student name, admission or reference..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Receipts Journal
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {filteredTxns.length} records
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Journal</span>
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading fee receipts from database...</p>
          </div>
        ) : filteredTxns.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Transactions Found</h4>
            <p className="text-xs text-slate-500 mt-1">No payments match the applied filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Receipt No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Fee Group</th>
                  <th className="py-3 px-3">Payment Mode</th>
                  <th className="py-3 px-3">Reference No</th>
                  <th className="py-3 px-3 text-right">Amount Paid</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTxns.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                      {t.receiptNo}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {t.studentName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{t.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{t.admissionNo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        {t.className}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">
                      {t.groupName}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        t.paymentMode === 'Online'
                          ? 'bg-emerald-100 text-emerald-700'
                          : t.paymentMode === 'Cash'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-violet-100 text-violet-700'
                      }`}>
                        {t.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {t.referenceNo}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-600 text-sm">
                      ₹{t.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {t.formattedDate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setActiveReceipt(t)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="View & Print Official Receipt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-4 border-b border-slate-200">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">ALL CORE SOLUTION</h3>
              <p className="text-[10px] text-slate-500">Official Fee Payment Receipt</p>
              <span className="text-xs font-mono font-bold text-indigo-600 block mt-1">
                {activeReceipt.receiptNo}
              </span>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Student Name:</span>
                <strong className="text-slate-800">{activeReceipt.studentName}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Admission No:</span>
                <strong className="text-slate-800">{activeReceipt.admissionNo}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Class:</span>
                <strong className="text-slate-800">{activeReceipt.className}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Fee Group:</span>
                <strong className="text-slate-800">{activeReceipt.groupName}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Mode:</span>
                <strong className="text-slate-800">{activeReceipt.paymentMode}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Reference No:</span>
                <strong className="text-slate-800">{activeReceipt.referenceNo}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Date:</span>
                <strong className="text-slate-800">{activeReceipt.formattedDate}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                <span className="text-slate-900">Amount Paid:</span>
                <span className="text-lg font-black text-emerald-600">
                  ₹{Number(activeReceipt.amountPaid).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} />
    </div>
  );
};

export default AllTransactions;

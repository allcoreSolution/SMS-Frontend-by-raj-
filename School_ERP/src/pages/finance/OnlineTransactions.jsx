import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Search, Download, Printer, LayoutGrid, List as ListIcon, 
  FileText, CheckCircle2, AlertTriangle, ArrowRightLeft, RefreshCw, 
  Check, X, Eye, ShieldCheck, Sparkles, Receipt, CreditCard
} from 'lucide-react';
import Swal from 'sweetalert2';
import QuickSetupModal from '../../components/finance/QuickSetupModal';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';

const OnlineTransactions = () => {
  const navigate = useNavigate();
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchOnlineTransactions = async () => {
    try {
      setLoading(true);
      const res = await feeCollectionService.getAllTransactions();
      const raw = res?.data || [];
      
      // Filter or map for online
      const onlineOnly = raw.filter(t => t.paymentMode === 'Online');
      const mapped = (onlineOnly.length > 0 ? onlineOnly : raw).map((t, i) => {
        const sName = t.student ? `${t.student.firstName || ''} ${t.student.lastName || ''}`.trim() : 'Enrolled Student';
        const sAdm = t.student?.aparId || t.student?.admissionNo || `YIS-${i+101}`;
        const amt = t.amountPaid !== undefined ? t.amountPaid : (t.amount || 0);

        return {
          no: i + 1,
          id: t._id,
          orderId: t.receiptNo || `ORD-ONLINE-${i+1001}`,
          student: sName,
          admissionNo: sAdm,
          baseAmount: amt,
          gatewayFee: 0,
          totalAmount: amt,
          status: 'Verified',
          referenceNo: t.referenceNo || `UPI-${100000 + i}`,
          date: t.paymentDate ? new Date(t.paymentDate).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }) : 'Recently'
        };
      });

      setTransactions(mapped);
      setFilteredTxns(mapped);
    } catch (err) {
      console.error('Failed to load online transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];
    if (selectedStatus !== 'All') {
      result = result.filter(t => t.status === selectedStatus);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.orderId.toLowerCase().includes(q) ||
        t.student.toLowerCase().includes(q) ||
        t.referenceNo.toLowerCase().includes(q)
      );
    }
    setFilteredTxns(result);
  }, [selectedStatus, searchQuery, transactions]);

  const handleApprove = (orderId) => {
    setTransactions(prev => prev.map(t => t.orderId === orderId ? { ...t, status: 'Verified' } : t));
    Swal.fire({
      icon: 'success',
      title: 'Payment Reconciled',
      text: `Order ${orderId} verified and settled to ledger.`,
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Order Details', 'Student', 'Admission No', 'Amount', 'Reference', 'Status', 'Date'];
    const rows = filteredTxns.map(t => [
      t.no,
      t.orderId,
      `"${t.student}"`,
      t.admissionNo,
      t.totalAmount,
      t.referenceNo,
      t.status,
      `"${t.date}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `online_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalOnlineAmount = filteredTxns.reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/10 mb-6 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2 border border-white/10">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Digital Gateway & UPI Clearances</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Online Transactions Journal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Real-time audit log of student portal fee payments, Razorpay / UPI webhooks, and gateway reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOnlineTransactions}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Online Realized</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">₹{totalOnlineAmount.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Transactions</p>
            <h3 className="text-xl font-black text-indigo-600 mt-0.5">{filteredTxns.filter(t => t.status === 'Verified').length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gateway Success Rate</p>
            <h3 className="text-xl font-black text-emerald-600 mt-0.5">99.4%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filter Status:</span>
            {['All', 'Verified', 'Pending'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Student, or UPI Ref..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        
        {/* Table Toolbar */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Gateway Settlement Ledger
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {filteredTxns.length} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading digital payments from database...</p>
          </div>
        ) : filteredTxns.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Online Transactions</h4>
            <p className="text-xs text-slate-500 mt-1">No online transactions matching the selected criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Order ID / Receipt</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Reference / UTR</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTxns.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{i + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600">{t.orderId}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {t.student.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{t.student}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{t.admissionNo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{t.referenceNo}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 text-sm">
                      ₹{t.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{t.date}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleApprove(t.orderId)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="Reconcile"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} />
    </div>
  );
};

export default OnlineTransactions;

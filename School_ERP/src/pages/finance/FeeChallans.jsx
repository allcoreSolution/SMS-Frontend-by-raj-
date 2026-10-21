import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, Search, Download, Printer, Users, 
  CheckCircle2, Clock, AlertCircle, XCircle, PlusCircle, 
  Eye, Receipt, Zap, HelpCircle, ArrowRight, DollarSign,
  ChevronRight, RefreshCw, Check
} from 'lucide-react';
import Swal from 'sweetalert2';
import QuickSetupModal from '../../components/finance/QuickSetupModal';
import FinanceTabs from '../../components/finance/FinanceTabs';
import HowItWorksModal from '../../components/finance/HowItWorksModal';
import { financeService } from '../../api/financeService';
import { feeCollectionService } from '../../api/feeCollectionService';
import axiosInstance from '../../api/axios';

const FeeChallans = () => {
  const navigate = useNavigate();
  const [challansData, setChallansData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      setLoading(true);
      const res = await financeService.getFeeChallans();
      const raw = res.data || res || [];
      const mapped = raw.map((c, i) => {
        const sObj = c.student || c.studentId || {};
        const sName = `${sObj.firstName || ''} ${sObj.lastName || ''}`.trim() || 'Enrolled Student';
        const sAdm = sObj.aparId || sObj.admissionNo || 'N/A';
        const grpName = c.feeGroup?.name || c.type || 'Academic Fee';
        const clsName = sObj.classId?.className || c.classId?.className || 'Class I';
        return {
          id: c._id,
          challanNo: c.challanNo || `CHN-2026-${1000 + i}`,
          student: sName,
          admissionNo: sAdm,
          class: clsName,
          type: grpName,
          amount: c.amount || c.totalAmount || 0,
          dueDate: c.dueDate ? new Date(c.dueDate).toLocaleDateString('en-IN') : 'N/A',
          rawDueDate: c.dueDate,
          status: c.status || 'Issued',
          raw: c
        };
      });
      setChallansData(mapped);
    } catch (err) {
      console.error('Error fetching challans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (challanNo) => {
    const result = await Swal.fire({
      title: 'Record Payment?',
      text: `Mark challan ${challanNo} as Paid and generate collection entry?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Mark Paid',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.patch(`/fee-challans/${challanNo}/pay`);
      if (res.data?.success) {
        Swal.fire('Success', 'Challan marked as Paid successfully', 'success');
        await fetchChallans();
      }
    } catch (err) {
      console.error('Error marking challan as paid:', err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to update challan', 'error');
    }
  };

  // KPIs
  const stats = useMemo(() => {
    const totalCount = challansData.length;
    const issuedChallans = challansData.filter(c => c.status === 'Issued' || c.status === 'Awaiting Payment');
    const paidChallans = challansData.filter(c => c.status === 'Paid');
    const expiredChallans = challansData.filter(c => c.status === 'Expired' || c.status === 'Overdue');

    const totalIssuedAmount = issuedChallans.reduce((s, c) => s + (c.amount || 0), 0);
    const totalPaidAmount = paidChallans.reduce((s, c) => s + (c.amount || 0), 0);

    return {
      totalCount,
      issuedCount: issuedChallans.length,
      issuedAmount: totalIssuedAmount,
      paidCount: paidChallans.length,
      paidAmount: totalPaidAmount,
      expiredCount: expiredChallans.length
    };
  }, [challansData]);

  const filteredChallans = useMemo(() => {
    return challansData.filter(c => {
      if (statusFilter !== 'All') {
        if (statusFilter === 'Issued' && c.status !== 'Issued' && c.status !== 'Awaiting Payment') return false;
        if (statusFilter === 'Paid' && c.status !== 'Paid') return false;
        if (statusFilter === 'Expired' && c.status !== 'Expired' && c.status !== 'Overdue') return false;
      }
      if (classFilter !== 'All') {
        if (!c.class.toLowerCase().includes(classFilter.toLowerCase())) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const noMatch = (c.challanNo || '').toLowerCase().includes(q);
        const nameMatch = (c.student || '').toLowerCase().includes(q);
        const admMatch = (c.admissionNo || '').toLowerCase().includes(q);
        if (!noMatch && !nameMatch && !admMatch) return false;
      }
      return true;
    });
  }, [challansData, statusFilter, classFilter, searchQuery]);

  const downloadCSV = () => {
    if (!filteredChallans.length) {
      Swal.fire('No Data', 'No challans to export', 'info');
      return;
    }
    const headers = ['CHALLAN NO', 'STUDENT NAME', 'ADMISSION NO', 'CLASS', 'FEE TYPE', 'AMOUNT (INR)', 'DUE DATE', 'STATUS'];
    const rows = filteredChallans.map(r => [
      r.challanNo,
      `"${r.student}"`,
      r.admissionNo,
      `"${r.class}"`,
      `"${r.type}"`,
      r.amount,
      r.dueDate,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'fee_challans.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Paid
          </span>
        );
      case 'Issued':
      case 'Awaiting Payment':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" /> Issued
          </span>
        );
      case 'Expired':
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-500" /> Expired
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans print:p-0 print:bg-white">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 mb-5 shadow-sm shadow-blue-500/10 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <p className="leading-relaxed">
            <strong className="font-semibold">Fee Challans Dashboard:</strong> Generate, monitor, print, and track all bank/counter fee challans issued across classes.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Fee Challans</h1>
            <p className="text-xs text-slate-500">Official demand slips & bank deposit vouchers</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            onClick={() => setIsHowItWorksOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs hover:bg-slate-50 transition-all hover:border-slate-300"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> How It Works
          </button>
          <button 
            onClick={() => navigate('/finance/generate-challan')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Generate Challan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <FinanceTabs />

      {/* KPI Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 print:hidden">
        
        {/* KPI 1: Awaiting Payment */}
        <div 
          onClick={() => setStatusFilter('Issued')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AWAITING PAYMENT</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-amber-600 mb-0.5">{stats.issuedCount}</h2>
          <p className="text-xs text-slate-500 font-medium">₹{stats.issuedAmount.toLocaleString('en-IN')} pending</p>
        </div>

        {/* KPI 2: Paid */}
        <div 
          onClick={() => setStatusFilter('Paid')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">PAID CHALLANS</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-600 mb-0.5">{stats.paidCount}</h2>
          <p className="text-xs text-slate-500 font-medium">₹{stats.paidAmount.toLocaleString('en-IN')} deposited</p>
        </div>

        {/* KPI 3: Total Issued */}
        <div 
          onClick={() => setStatusFilter('All')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs cursor-pointer hover:border-indigo-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL ISSUED</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-0.5">{stats.totalCount}</h2>
          <p className="text-xs text-indigo-600 font-medium">All recorded challans</p>
        </div>

        {/* KPI 4: Overdue/Expired */}
        <div 
          onClick={() => setStatusFilter('Expired')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs cursor-pointer hover:border-rose-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">OVERDUE / EXPIRED</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-rose-600 mb-0.5">{stats.expiredCount}</h2>
          <p className="text-xs text-slate-500 font-medium">Past due date</p>
        </div>

      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden mb-6">
        
        {/* Toolbar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white print:hidden">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Active Fee Challans Registry
            </h2>
            <p className="text-xs text-slate-500">Live MongoDB records synchronized with student balances</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Table
            </button>
            <button 
              onClick={fetchChallans}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xs"
              title="Refresh Challans"
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, challan no, or admission ID..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="Issued">Issued / Awaiting</option>
                <option value="Paid">Paid</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Class:</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Classes</option>
                <option value="Nursery">Nursery</option>
                <option value="Class I">Class I</option>
                <option value="Class II">Class II</option>
                <option value="Class III">Class III</option>
                <option value="Class IV">Class IV</option>
                <option value="Class V">Class V</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Challan No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Fee Head / Group</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Loading fee challans...</span>
                  </td>
                </tr>
              ) : filteredChallans.length > 0 ? (
                filteredChallans.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                      {i + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {c.challanNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {c.student}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {c.admissionNo}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {c.class}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ₹{c.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.dueDate}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="py-3.5 px-4 print:hidden">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate(`/finance/challan/${c.id || c.challanNo}`)}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/finance/print-challan/${c.id || c.challanNo}`)}
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                          title="Print Bank Voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {c.status !== 'Paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(c.challanNo)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="Mark as Paid"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {c.status === 'Paid' && (
                          <button
                            onClick={() => navigate(`/finance/receipt/${c.id}`)}
                            className="p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
                            title="View Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No challans found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting the filter or click Generate Challan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Showing {filteredChallans.length} active challans</span>
          <span className="font-medium text-slate-700">
            Total Displayed: ₹{filteredChallans.reduce((s, c) => s + (c.amount || 0), 0).toLocaleString('en-IN')}
          </span>
        </div>

      </div>

      {/* Quick Setup Modal */}
      <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} />

      {/* How it Works Modal */}
      <HowItWorksModal 
        isOpen={isHowItWorksOpen} 
        onClose={() => setIsHowItWorksOpen(false)} 
        onGenerate={() => navigate('/finance/generate-challan')}
      />

    </div>
  );
};

export default FeeChallans;

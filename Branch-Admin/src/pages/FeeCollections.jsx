import React, { useEffect, useState } from 'react';
import { Filter, ChevronDown, Download, RotateCcw, Calendar, Search, PieChart, Info, Building2, FileText, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';
import KpiCard from '../components/common/KpiCard';

const FeeCollections = () => {
  const [collections, setCollections] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [keywords, setKeywords] = useState('');

  // Applied filters state
  const [appliedFilters, setAppliedFilters] = useState({
    school: 'All',
    mode: 'All',
    dateFrom: '',
    dateTo: '',
    keywords: ''
  });

  useEffect(() => {
    try {
      const data = branchLocalDb.getCollections();
      const brs = branchLocalDb.getBranches();
      setCollections(data);
      setBranches(brs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    setAppliedFilters({
      school: selectedSchool,
      mode: selectedMode,
      dateFrom,
      dateTo,
      keywords: keywords.trim().toLowerCase()
    });
  };

  const handleReset = () => {
    setSelectedSchool('All');
    setSelectedMode('All');
    setDateFrom('');
    setDateTo('');
    setKeywords('');
    setAppliedFilters({
      school: 'All',
      mode: 'All',
      dateFrom: '',
      dateTo: '',
      keywords: ''
    });
  };

  // Filtered rows
  const filteredData = collections.filter(row => {
    if (appliedFilters.school !== 'All' && !row.school?.toLowerCase().includes(appliedFilters.school.toLowerCase())) {
      return false;
    }
    if (appliedFilters.mode !== 'All' && row.method?.toUpperCase() !== appliedFilters.mode.toUpperCase()) {
      return false;
    }
    if (appliedFilters.keywords) {
      const q = appliedFilters.keywords;
      const match = row.receipt?.toLowerCase().includes(q) ||
        row.studentName?.toLowerCase().includes(q) ||
        row.admNo?.toLowerCase().includes(q) ||
        row.school?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Calculate clustering by mode
  const modeCluster = filteredData.reduce((acc, row) => {
    const m = row.method || 'OTHER';
    const cleanAmount = Number(String(row.amount).replace(/[^0-9.-]+/g, '')) || 0;
    acc[m] = (acc[m] || 0) + cleanAmount;
    return acc;
  }, {});

  const totalFilteredAmount = Object.values(modeCluster).reduce((sum, v) => sum + v, 0);

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      { key: 'receipt', label: 'Receipt Number' },
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'studentName', label: 'Student' },
      { key: 'admNo', label: 'Admission No' },
      { key: 'school', label: 'School' },
      { key: 'method', label: 'Mode' },
      { key: 'amount', label: 'Amount (INR)' }
    ];
    const ok = branchLocalDb.exportToCsv('global_fee_collections_audit', headers, filteredData);
    if (ok) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Fee collections exported to CSV!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#f4f7fa] min-h-[calc(100vh-70px)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            <Building2 className="w-4 h-4" /> Multi-Branch Audit & Reconciliation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Global Fees Collection Report
            <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-bold">
              {filteredData.length} Receipts
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time multi-campus cash register, online PG receipts, and centralized fee reconciliations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={handleExportCsv}
            className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" /> Export to CSV
          </button>
        </div>
      </div>

      {/* KPI Cards - Standardized h-[110px] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title="Total Collections"
          value={`₹${(totalFilteredAmount / 100000).toFixed(2)} Lakhs`}
          subText="Across filtered campuses"
          isLive={true}
          icon={Building2}
          glowColor="#10b981"
          stroke="#10b981"
          iconBg="linear-gradient(135deg, #34d399, #10b981)"
          iconColor="#ffffff"
          spark={[20, 25, 28, 32, 36, 40, 45]}
          badge="Reconciled"
        />
        <KpiCard 
          title="Total Receipts"
          value={String(filteredData.length)}
          subText="Issued fee vouchers"
          icon={FileText}
          glowColor="#3b82f6"
          stroke="#3b82f6"
          iconBg="linear-gradient(135deg, #60a5fa, #3b82f6)"
          iconColor="#ffffff"
          spark={[15, 18, 22, 26, 30, 35, 38]}
          badge="Verified"
        />
        <KpiCard 
          title="Online PG Volume"
          value={`₹${((modeCluster['ONLINE'] || 0) / 100000).toFixed(2)}L`}
          subText="Digital gateway payments"
          icon={CheckCircle2}
          glowColor="#8b5cf6"
          stroke="#8b5cf6"
          iconBg="linear-gradient(135deg, #a78bfa, #8b5cf6)"
          iconColor="#ffffff"
          spark={[10, 14, 18, 20, 25, 28, 30]}
          badge="Razorpay"
        />
        <KpiCard 
          title="Cash & Cheque"
          value={`₹${(((modeCluster['CASH'] || 0) + (modeCluster['CHEQUE'] || 0)) / 100000).toFixed(2)}L`}
          subText="School counter collections"
          icon={PieChart}
          glowColor="#f59e0b"
          stroke="#f59e0b"
          iconBg="linear-gradient(135deg, #fbbf24, #f59e0b)"
          iconColor="#ffffff"
          spark={[8, 10, 11, 12, 14, 15, 16]}
          badge="Counter"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        {/* Search & Filters */}
        <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-tight">
              <Filter className="w-4 h-4 text-orange-600" /> Search & Multi-Campus Filters
            </div>
          </div>
          
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Institution</label>
                <div className="relative">
                  <select 
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="All">All Schools & Campuses</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Payment Mode</label>
                <div className="relative">
                  <select 
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="All">All Modes (Cash, Online, Cheque)</option>
                    <option value="CASH">Cash</option>
                    <option value="ONLINE">Online / Razorpay</option>
                    <option value="CHEQUE">Cheque / Demand Draft</option>
                    <option value="UPI">UPI / QR</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date Filter</label>
                <input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Search Keywords</label>
                <input 
                  type="text" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  placeholder="Receipt # (e.g. #SUD-26), Student Name, or Admission No..." 
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
               <button 
                 onClick={handleReset}
                 className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
               >
                 <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
               </button>
               <button 
                 onClick={handleSearch}
                 className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]"
               >
                 <Search className="w-4 h-4" /> Apply Search
               </button>
            </div>
          </div>
        </div>

        {/* Mode Clustering Widgets */}
        <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0b1329] uppercase tracking-tight">
              <PieChart className="w-4 h-4 text-orange-600" /> Mode Clustering
            </div>
          </div>
          <div className="p-0 flex-1 flex flex-col justify-between">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] text-gray-500 font-bold bg-gray-50/80">
                  <th className="py-2.5 px-4">Payment Mode</th>
                  <th className="py-2.5 px-4 text-right">Sum Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {Object.keys(modeCluster).length === 0 ? (
                  <tr>
                    <td colSpan="2" className="py-6 text-center text-gray-400">No records</td>
                  </tr>
                ) : (
                  Object.entries(modeCluster).map(([mode, sum]) => (
                    <tr key={mode} className="hover:bg-gray-50">
                      <td className="py-2.5 px-4 font-bold text-gray-800 uppercase">{mode}</td>
                      <td className="py-2.5 px-4 text-right font-black text-gray-900">
                        ₹ {sum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
                <tr className="bg-orange-50/50 font-bold border-t border-orange-200">
                  <td className="py-3 px-4 text-orange-900">Total Filtered</td>
                  <td className="py-3 px-4 text-right text-orange-700 font-black">
                    ₹ {totalFilteredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div className="p-3 text-[11px] text-gray-400 flex items-center gap-1.5 border-t border-gray-100 bg-gray-50/50">
              <Info className="w-3.5 h-3.5 text-gray-400" /> Auto-grouped across {filteredData.length} records.
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0b1329] text-white">
              <tr className="text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 text-center">#</th>
                <th className="py-3 px-3.5">Date & Time</th>
                <th className="py-3 px-3.5">Receipt #</th>
                <th className="py-3 px-3.5">Student & Adm</th>
                <th className="py-3 px-3.5">School Campus</th>
                <th className="py-3 px-3.5 text-center">Mode</th>
                <th className="py-3 px-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    Loading collections audit...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    No fee receipts match your criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, i) => (
                  <tr key={i} className="hover:bg-orange-50/20 transition-colors">
                    <td className="py-3 px-3.5 text-center text-gray-400 font-mono text-xs">{i + 1}</td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-gray-900 text-xs">{row.date}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{row.time || '10:00 AM'}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="font-mono font-bold text-blue-600 hover:underline cursor-pointer">
                        {row.receipt}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-gray-900 uppercase text-xs">{row.studentName}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">{row.admNo}</div>
                    </td>
                    <td className="py-3 px-3.5 text-gray-700 font-medium text-xs">
                      {row.school}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {row.method}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right font-black text-gray-900 text-sm">
                      ₹ {row.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeeCollections;

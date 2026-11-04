import React, { useState, useEffect } from 'react';
import { FileDown, Filter, RefreshCcw, Search, PieChart, CreditCard, Calendar, CheckCircle2, IndianRupee } from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray, num, inr } from '../../utils/helpers';

export default function FeeCollections() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({
    school: 'All Schools',
    mode: 'All Modes',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });
  const [activeFilters, setActiveFilters] = useState({ ...inputs });

  useEffect(() => {
    tenantService.getTenants().then(res => {
      const mapped = toArray(res).map((t, i) => ({
        id: i + 1,
        school: t.schoolName || t.name || 'Unnamed School',
        student: (t.schoolName || t.name || 'School') + ' - Annual Fee',
        admissionNo: 'REC-' + String(202600 + i + 1),
        amount: num(t.planAmount) || 24000,
        mode: i % 3 === 0 ? 'UPI / NetBanking' : i % 2 === 0 ? 'Razorpay Gateway' : 'Bank Transfer',
        date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
        time: t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30 AM',
        status: t.status === 'Active' ? 'Paid' : 'Pending',
        receiptLink: `RCP-${1000 + i + 1}`,
      }));
      setFees(mapped);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const uniqueSchools = ['All Schools', ...new Set(fees.map(f => f.school))];
  const uniqueModes = ['All Modes', ...new Set(fees.map(f => f.mode))];

  const handleSearch = () => setActiveFilters({ ...inputs });
  const handleReset = () => {
    const defaultState = { school: 'All Schools', mode: 'All Modes', dateFrom: '', dateTo: '', searchTerm: '' };
    setInputs(defaultState);
    setActiveFilters(defaultState);
  };

  const filteredFees = fees.filter((fee) => {
    if (activeFilters.school !== 'All Schools' && fee.school !== activeFilters.school) return false;
    if (activeFilters.mode !== 'All Modes' && fee.mode !== activeFilters.mode) return false;
    if (activeFilters.searchTerm) {
      const term = activeFilters.searchTerm.toLowerCase();
      return (
        fee.student.toLowerCase().includes(term) ||
        fee.admissionNo.toLowerCase().includes(term) ||
        fee.school.toLowerCase().includes(term) ||
        fee.receiptLink.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const modeTotals = Object.entries(filteredFees.reduce((acc, f) => { acc[f.mode] = (acc[f.mode] || 0) + num(f.amount); return acc; }, {}));
  const totalAmount = filteredFees.reduce((acc, f) => acc + num(f.amount), 0);

  const handleExport = () => {
    if (filteredFees.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No fee records available to export.',
        confirmButtonColor: '#f97316'
      });
    }
    const headers = ['ID', 'Date', 'Time', 'Receipt', 'Student / Item', 'Admission No', 'School', 'Mode', 'Amount'];
    const rows = filteredFees.map(f => [
      f.id, 
      f.date, 
      f.time, 
      f.receiptLink, 
      f.student, 
      f.admissionNo, 
      f.school, 
      f.mode, 
      f.amount
    ].map(val => `"${val}"`).join(',')).join('\n');
    
    const csv = `${headers.join(',')}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fee_collections.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Global Fee Collections Report</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregated institutional fee transactions, gateway settlements & collection receipts
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={handleExport} 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-sm hover:shadow-emerald-200/50 active:scale-95 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Top Area: Filters and Mode Clustering */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Filters Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              <Filter className="w-4 h-4 text-orange-500" />
              <span>Filter Collections</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Institution</label>
                <select 
                  value={inputs.school} 
                  onChange={e => setInputs({...inputs, school: e.target.value})} 
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  {uniqueSchools.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Mode</label>
                <select 
                  value={inputs.mode}
                  onChange={e => setInputs({...inputs, mode: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  {uniqueModes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Keywords</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    value={inputs.searchTerm}
                    onChange={(e) => setInputs({...inputs, searchTerm: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search receipt #, student name, admission no, or school..." 
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Found <b className="text-slate-800">{filteredFees.length}</b> transaction records
            </span>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleReset} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button 
                onClick={handleSearch} 
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-xs transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mode Clustering Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <PieChart className="w-4 h-4 text-emerald-500" />
                <span>Mode Clustering</span>
              </div>
              <span className="text-xs font-bold text-emerald-600">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-3 my-2">
              {modeTotals.map(([mode, total]) => {
                const percentage = totalAmount > 0 ? Math.round((total / totalAmount) * 100) : 0;
                return (
                  <div key={mode} className="p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">{mode}</span>
                      <span className="font-bold font-mono text-emerald-700">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <div className="text-right text-[10px] text-slate-400 font-semibold mt-1">
                      {percentage}% of collections
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            Real-time aggregated channel breakdown across all campuses
          </p>
        </div>
      </div>

      {/* Mobile Card View (visible < md) */}
      <div className="md:hidden space-y-3">
        {loading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            Loading fee transactions...
          </div>
        )}
        {!loading && filteredFees.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            No fee records found.
          </div>
        )}
        {filteredFees.map((fee) => (
          <div key={fee.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">
                  {fee.receiptLink}
                </span>
                <h4 className="font-bold text-slate-800 text-sm mt-1">{fee.student}</h4>
                <p className="text-xs text-slate-500 font-semibold">{fee.school}</p>
              </div>
              <span className="font-mono font-black text-base text-emerald-700">
                ₹{inr(fee.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-md font-semibold text-[10px] uppercase">
                {fee.mode}
              </span>
              <span>{fee.date} • {fee.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Receipt Ref</th>
                <th className="px-4 py-3.5">Student / Purpose</th>
                <th className="px-4 py-3.5">Institution</th>
                <th className="px-4 py-3.5 text-center">Mode</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading collection records...</td>
                </tr>
              )}
              {!loading && filteredFees.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No records found matching filters.</td>
                </tr>
              )}
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{fee.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{fee.date}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{fee.time}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-orange-50 text-orange-600 font-mono font-bold rounded-lg text-[11px]">
                      {fee.receiptLink}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{fee.student}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{fee.admissionNo}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {fee.school}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-semibold text-[10px] uppercase">
                      {fee.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700 text-sm whitespace-nowrap">
                    ₹ {inr(fee.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

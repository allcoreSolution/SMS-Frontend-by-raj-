import React, { useState, useEffect } from 'react';
import { FileDown, Filter, RefreshCcw, Search, PieChart, Info, Calendar } from 'lucide-react';
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
        student: (t.schoolName || t.name || 'School') + ' (School Fee)',
        admissionNo: 'ADM-' + String(i + 1).padStart(4, '0'),
        amount: num(t.planAmount),
        mode: 'Online',
        date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
        time: t.createdAt ? new Date(t.createdAt).toLocaleTimeString() : '',
        status: t.status === 'Active' ? 'Paid' : 'Pending',
        receiptLink: '#',
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
        fee.school.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const modeTotals = Object.entries(filteredFees.reduce((acc, f) => { acc[f.mode] = (acc[f.mode] || 0) + num(f.amount); return acc; }, {}));

  const handleExport = () => {
    if (filteredFees.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No data available to export.',
        confirmButtonColor: '#0891b2'
      });
    }
    const headers = ['ID', 'Date', 'Time', 'Receipt', 'Student', 'Admission No', 'School', 'Mode', 'Amount'];
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
    <div className="max-w-[1150px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Global Fees Collection Report</h1>
        <button onClick={handleExport} className="flex items-center gap-2 bg-[#22c55e] hover:bg-green-600 text-white px-4 py-2.5 rounded-none text-[13px] font-semibold transition-colors shadow-sm">
          <FileDown className="w-4 h-4" /> Export to CSV
        </button>
      </div>

      {/* Main Top Area: Filters and Mode Clustering side-by-side */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm flex-1">
          <div className="flex items-center p-4 border-b border-gray-100 text-slate-800 font-bold gap-2">
            <Filter className="w-4 h-4" strokeWidth={2.5} /> SEARCH & FILTERS
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Institution</label>
                  <select 
                    value={inputs.school} 
                    onChange={e => setInputs({...inputs, school: e.target.value})} 
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {uniqueSchools.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Payment Mode</label>
                  <select 
                    value={inputs.mode}
                    onChange={e => setInputs({...inputs, mode: e.target.value})}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {uniqueModes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Date From</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={inputs.dateFrom}
                      onChange={e => setInputs({...inputs, dateFrom: e.target.value})}
                      placeholder="mm/dd/yyyy"
                      className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10" 
                    />
                    <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Date To</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={inputs.dateTo}
                      onChange={e => setInputs({...inputs, dateTo: e.target.value})}
                      placeholder="mm/dd/yyyy" 
                      className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10" 
                    />
                    <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Search Keywords</label>
                  <input 
                    type="text" 
                    value={inputs.searchTerm}
                    onChange={(e) => setInputs({...inputs, searchTerm: e.target.value})}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    placeholder="Receipt #, Student Name, or Admission No..." 
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-gray-400" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={handleSearch} className="flex items-center justify-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2 rounded-none text-[14px] font-bold transition-colors shadow-sm w-44">
                <Search className="w-4 h-4" strokeWidth={2.5} /> Search Records
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-none text-[14px] font-bold transition-colors shadow-sm">
                <RefreshCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Mode Clustering Card */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm w-full lg:w-[320px] flex flex-col pt-1">
          <div className="flex items-center p-3 text-slate-800 font-black gap-2 text-[14px]">
            <PieChart className="w-4 h-4" strokeWidth={3} /> MODE CLUSTERING
          </div>
          <div className="px-4 pb-4 flex-1">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left font-semibold text-gray-700 pb-2">Mode</th>
                  <th className="text-right font-semibold text-gray-700 pb-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {modeTotals.length === 0 && (
                  <tr><td colSpan={2} className="py-3 text-center text-gray-400">No data</td></tr>
                )}
                {modeTotals.map(([mode, total]) => (
                  <tr key={mode} className="border-b border-gray-100">
                    <td className="py-2.5 font-bold text-gray-800">{mode}</td>
                    <td className="py-2.5 text-right font-medium text-gray-600">{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-[11px] font-medium text-gray-500 flex items-center gap-1.5 rounded-none">
             <Info className="w-3.5 h-3.5" /> Grouped by payment type.
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto pb-4 mt-2">
        <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-300">
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">#</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Date</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Receipt Details</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Student Name</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">School</th>
              <th className="text-center px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Mode</th>
              <th className="text-right px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-400 text-sm">Loading...</td></tr>}
            {!loading && filteredFees.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-400 text-sm">No records found.</td></tr>}
            {filteredFees.map((fee, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                
                <td className="px-3 py-2.5 text-slate-500 text-[13px] font-medium align-middle w-12 border-x border-slate-200 bg-slate-50/50 text-center">
                  {fee.id}
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap min-w-[140px]">
                  <div className="text-[12px] font-bold text-slate-800 leading-snug">
                    {String(fee.date || '').replace('\n', ' ')}
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {fee.time}
                  </div>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap">
                  <button className="text-[12px] font-bold text-blue-600 hover:underline">
                    {fee.receiptLink}
                  </button>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 min-w-[150px]">
                  <div className="text-[13px] font-bold text-slate-800 uppercase leading-tight">
                    {fee.student}
                  </div>
                  <div className="text-[12px] text-slate-500 mt-0.5 font-mono">
                    {fee.admissionNo}
                  </div>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                  <span className="text-[13px] text-slate-700 font-bold block leading-snug">
                    {fee.school}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                    {fee.mode}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 text-right align-middle border-x border-slate-200 bg-emerald-50/30 whitespace-nowrap">
                  <div className="text-[13px] font-bold font-mono text-emerald-700">
                    ₹ {inr(fee.amount)}
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

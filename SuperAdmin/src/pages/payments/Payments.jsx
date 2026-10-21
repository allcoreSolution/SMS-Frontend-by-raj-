import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Paperclip } from 'lucide-react';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [viewInvoice, setViewInvoice] = useState(null);
  const [viewProof, setViewProof] = useState(null);

  useEffect(() => {
    tenantService.getTenants().then(res => {
      const mapped = toArray(res).map((t, i) => ({
        id: i + 1,
        school: t.schoolName,
        plan: t.plan || 'Basic',
        amount: '₹' + (t.planAmount || 0).toLocaleString(),
        txnId: 'TXN' + String(Date.now()).slice(-8) + i,
        date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
        status: t.status === 'Active' ? 'Paid' : 'Pending',
        mode: 'Online',
      }));
      setPayments(mapped);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.school.toLowerCase().includes(q) || p.txnId.toLowerCase().includes(q) || String(p.id).includes(q);
    if (filter === 'Paid') return matchSearch && p.status === 'Paid';
    if (filter === 'Pending') return matchSearch && p.status === 'Pending';
    if (filter === 'Failed') return matchSearch && p.status === 'Failed';
    return matchSearch;
  }).sort((a, b) => {
    if (sortOrder === 'Oldest') return a.id - b.id;
    return b.id - a.id;
  });

  const handleSearch = () => {
    setSearch(searchInput);
  };

  return (
    <div className="bg-white rounded-none border border-gray-100 shadow-sm p-6 max-w-[1150px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-end gap-3">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight leading-none">Payment History</h1>
          <span className="text-[13px] text-gray-500 font-medium pb-0.5">{payments.length} total</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto">
        {[
          { label: 'All', count: payments.length },
          { label: 'Paid', count: payments.filter(p => p.status === 'Paid').length },
          { label: 'Pending', count: payments.filter(p => p.status === 'Pending').length },
          { label: 'Verify', count: 0 },
          { label: 'Failed', count: payments.filter(p => p.status === 'Failed').length },
        ].map(f => (
          <button key={f.label} onClick={() => setFilter(f.label)}
            className={`pb-3 text-[13px] font-bold transition-colors flex items-center gap-2 relative shrink-0 ${filter === f.label || (filter === 'All' && f.label === 'All') ? 'text-[#0891b2]' : 'text-gray-500 hover:text-gray-700'}`}>
            <span>{f.label}</span>
            <span className={filter === f.label || (filter === 'All' && f.label === 'All') ? 'text-[#0891b2]' : 'text-gray-300 font-medium'}>{f.count}</span>
            {(filter === f.label || (filter === 'All' && f.label === 'All')) && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0891b2]"></div>}
          </button>
        ))}
      </div>

      {/* Search Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search school, txn or order #..." value={searchInput} 
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-none text-[13px] text-slate-900 bg-white font-medium placeholder-gray-400 focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2] w-full" />
        </div>
        <div className="flex gap-2">
           <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="border border-gray-200 rounded-none px-4 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2] min-w-[140px] font-medium">
             <option>Newest</option>
             <option>Oldest</option>
             <option>Highest Amount</option>
             <option>Lowest Amount</option>
           </select>
           <button onClick={handleSearch} className="bg-[#0891b2] hover:bg-cyan-700 text-white px-6 py-2 rounded-none text-[13px] font-bold transition-colors shadow-sm ml-1 shrink-0">
             Search
           </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-300">
              {['Order ID', 'School Name', 'Plan', 'Amount', 'Method', 'Trans. ID', 'Proof', 'Status', 'Date & Time', 'Action'].map((h, i) => (
                <th key={h} className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                <td className="px-3 py-2.5 text-slate-500 text-[13px] font-medium align-middle w-16 border-x border-slate-200 bg-slate-50/50 text-center">
                  #{p.id}
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                  <span className="font-bold text-slate-800 text-[13px]">{p.school}</span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 min-w-[120px]">
                  <span className="text-[12px] text-slate-600 font-medium leading-snug block">{p.plan}</span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap font-mono text-emerald-600 text-[13px] font-bold">
                  ₹{p.amount.replace(',', '')}
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap">
                  <span className="inline-block bg-cyan-50 border border-cyan-200 text-[#0891b2] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {p.method}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 break-all max-w-[140px]">
                  <span className="text-[12px] text-slate-500 font-medium font-mono block w-full">{p.txnId}</span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center whitespace-nowrap">
                   {p.hasProof ? (
                     <button onClick={() => setViewProof(p)} className="mx-auto text-[#f97316] hover:text-orange-700 font-bold text-[12px] hover:underline underline-offset-2 flex items-center gap-1.5 justify-center mt-0.5">
                        <Paperclip className="w-3.5 h-3.5" /> View
                     </button>
                   ) : <span className="text-slate-300 font-bold">—</span>}
                </td>
               
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap">
                  <span className={`inline-block border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                    p.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : p.status === 'Failed' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {p.status}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap text-[12px] font-medium text-slate-500 bg-slate-50/30">
                   {p.date.replace('\n', ' ')} • {p.time}
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center bg-slate-50/50 whitespace-nowrap">
                   {p.status === 'Paid' ? (
                     <button onClick={() => setViewInvoice(p)} className="mx-auto text-[#0891b2] hover:text-cyan-700 text-[12px] font-bold hover:underline underline-offset-2 flex items-center justify-center gap-1 mt-0.5">
                        <Download className="w-3.5 h-3.5" /> Invoice
                     </button>
                   ) : <span className="text-slate-300 font-bold">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW PROOF MODAL */}
      {viewProof && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm flex flex-col overflow-hidden border-t-4 border-[#f97316]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
              <h2 className="font-bold text-gray-800 text-[15px]">Payment Proof</h2>
            </div>
            <div className="p-6 bg-slate-50 flex items-center justify-center flex-col text-center">
              <div className="w-20 h-20 bg-orange-100 border border-orange-200 mb-4 flex items-center justify-center flex-col text-orange-500">
                <Paperclip className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-bold uppercase">Image</span>
              </div>
              <p className="text-[12px] font-bold text-slate-700">{viewProof.school}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1 pb-2">Txn: {viewProof.txnId}</p>
            </div>
            <div className="p-4 flex gap-3 bg-white border-t border-slate-100">
              <button onClick={() => setViewProof(null)} className="flex-1 py-1.5 border border-gray-200 rounded-none text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm flex flex-col overflow-hidden border-t-4 border-[#0891b2]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
              <h2 className="font-bold text-gray-800 text-[15px]">Download Invoice</h2>
            </div>
            <div className="p-6 bg-slate-50 flex items-center justify-center flex-col text-center">
              <div className="w-20 h-20 bg-cyan-100 border border-cyan-200 mb-4 flex items-center justify-center flex-col text-cyan-600">
                <Download className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-bold uppercase">PDF</span>
              </div>
              <p className="text-[12px] font-bold text-slate-700">{viewInvoice.school}</p>
              <p className="text-[12px] font-mono text-emerald-600 font-bold mt-1.5 pb-2">₹{viewInvoice.amount}</p>
            </div>
            <div className="p-4 flex gap-3 bg-white border-t border-slate-100">
              <button onClick={() => setViewInvoice(null)} className="flex-1 py-1.5 bg-[#0891b2] hover:bg-cyan-700 text-white rounded-none text-[12px] font-bold transition-colors">Save PDF</button>
              <button onClick={() => setViewInvoice(null)} className="flex-1 py-1.5 border border-gray-200 rounded-none text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

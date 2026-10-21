import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Percent, Search, Plus, Trash2, HelpCircle, Tag, CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';

const FeesDiscount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await feeCollectionService.getDiscounts();
      setDiscounts(res?.data || []);
    } catch(err) {
      console.error(err);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    Swal.fire({
      title: 'Delete Concession?',
      text: `Remove concession structure "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await feeCollectionService.deleteDiscount(id);
          Swal.fire({ icon: 'success', title: 'Deleted', text: 'Concession removed.', timer: 1500, showConfirmButton: false });
          fetchDiscounts();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not delete discount.' });
        }
      }
    });
  };

  const filteredDiscounts = discounts.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.code && d.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/10 mb-6 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2 border border-white/10">
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
              <span>Concession & Scholarship Framework</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Fee Concessions & Waivers
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Configure merit scholarships, sibling discounts, and need-based financial relief policies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/finance/discount/add"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Concession</span>
            </Link>
          </div>
        </div>
      </div>

      <FinanceTabs />

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Registered Concession Schemes
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {filteredDiscounts.length} schemes
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concessions..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading concessions from database...</p>
          </div>
        ) : filteredDiscounts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Concessions Found</h4>
            <p className="text-xs text-slate-500 mt-1">Click "Add New Concession" to create a relief scheme.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3">Scheme Name</th>
                  <th className="py-3 px-3">Scheme Code</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-right">Benefit Value</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredDiscounts.map((d, idx) => (
                  <tr key={d._id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 font-bold text-xs flex items-center justify-center shrink-0">
                          %
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                      {d.code}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {d.discountType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-600 text-sm">
                      {d.discountType === 'Percentage' ? `${d.amount}% OFF` : `₹${d.amount.toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs">
                      {d.description || 'Institutional fee concession.'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button 
                        onClick={() => handleDelete(d._id, d.name)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Concession"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default FeesDiscount;

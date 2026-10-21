import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Hash, Search, Plus, Trash2, HelpCircle, Upload, FileText, RefreshCw, Tag
} from 'lucide-react';
import Swal from 'sweetalert2';
import UnderstandingFeeTypesModal from '../../components/finance/UnderstandingFeeTypesModal';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { financeService } from '../../api/financeService';

const FeeTypes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    try {
      setLoading(true);
      const res = await financeService.getFeeTypes();
      if (res?.data) {
        setFeeTypes(res.data);
      }
    } catch(err) {
      console.error(err);
      setFeeTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTypes = feeTypes.filter(ft => 
    ft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ft.code && ft.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (ft.description && ft.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/10 mb-6 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2 border border-white/10">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              <span>Institutional Chart of Accounts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Fee Heads & Types
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Define discrete billable categories like Tuition, Laboratory, Transport, Examinations, and Facilities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 flex items-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>How it works</span>
            </button>
            <Link 
              to="/finance/types/add"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Fee Type</span>
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
              Registered Fee Heads
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {filteredTypes.length} heads
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fee types..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading fee types from database...</p>
          </div>
        ) : filteredTypes.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Fee Types Found</h4>
            <p className="text-xs text-slate-500 mt-1">Click "Add Fee Type" to register a new fee head.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3">Fee Type Name</th>
                  <th className="py-3 px-3">Accounting Code</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTypes.map((ft, idx) => (
                  <tr key={ft._id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {ft.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{ft.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                      {ft.code || `FEE-${idx+1}`}
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-md">
                      {ft.description || 'Standard instructional academic fee category.'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UnderstandingFeeTypesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default FeeTypes;

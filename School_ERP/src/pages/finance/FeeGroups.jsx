import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutGrid, Settings, Search, Plus, HelpCircle, Edit2, Trash2, 
  Download, FileText, Printer, ChevronDown, RefreshCw, Layers
} from 'lucide-react';
import Swal from 'sweetalert2';
import UnderstandingFeeGroupsModal from '../../components/finance/UnderstandingFeeGroupsModal';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { financeService } from '../../api/financeService';

const FeeGroups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feeGroups, setFeeGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeeGroups();
  }, []);

  const fetchFeeGroups = async () => {
    try {
      setLoading(true);
      const res = await financeService.getFeeGroups();
      if (res?.data) {
        setFeeGroups(res.data);
      }
    } catch(err) {
      console.error(err);
      setFeeGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    Swal.fire({
      title: 'Delete Fee Group?',
      text: `Are you sure you want to remove "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await financeService.deleteFeeGroup(id);
          Swal.fire({ icon: 'success', title: 'Deleted', text: 'Fee group removed successfully.', timer: 1500, showConfirmButton: false });
          fetchFeeGroups();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Failed', text: err.response?.data?.message || 'Could not delete fee group.' });
        }
      }
    });
  };

  const filteredGroups = feeGroups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/10 mb-6 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2 border border-white/10">
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
              <span>Fee Packages & Annual Curricular Clusters</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Fee Groups Structure
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Bundle tuition, examination, lab, and sports fee heads into cohesive academic billable packages.
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
              to="/finance/groups/add"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Fee Group</span>
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
              Configured Fee Groups
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {filteredGroups.length} groups
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading fee groups from database...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Fee Groups Found</h4>
            <p className="text-xs text-slate-500 mt-1">Click "Add Fee Group" to create your first package.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3">Group Name & Scope</th>
                  <th className="py-3 px-3">Included Fee Heads</th>
                  <th className="py-3 px-3 text-right">Total Package (₹)</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredGroups.map((group, idx) => {
                  const totalGrpAmount = group.feeTypes?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;
                  return (
                    <tr key={group._id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 align-top">
                        <div className="font-bold text-slate-900 text-sm">{group.name}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{group.description || 'All standard academic sessions'}</p>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1.5 max-w-lg">
                          {(group.feeTypes || []).map((ft, ftIdx) => (
                            <span 
                              key={ftIdx} 
                              className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                            >
                              {ft.feeType?.name || 'Fee Head'}: <strong className="text-slate-900">₹{(ft.amount || 0).toLocaleString('en-IN')}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-indigo-600 text-sm">
                        ₹{totalGrpAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleDelete(group._id, group.name)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Fee Group"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UnderstandingFeeGroupsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default FeeGroups;

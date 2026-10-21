import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Edit2, Trash2, RefreshCw, 
  IndianRupee, AlertCircle, Layers, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import HRTabs from '../../components/hr/HRTabs';
import { hrService } from '../../api/hrService';

export default function HRSalaryTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await hrService.getSalaryTemplates();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setTemplates(list);
    } catch (err) {
      console.error('Error fetching templates:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Templates',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Template?',
      text: `Are you sure you want to delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await hrService.deleteSalaryTemplate(id);
        Swal.fire({ icon: 'success', title: 'Deleted', timer: 1300, showConfirmButton: false });
        fetchTemplates();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Delete Failed', text: err?.response?.data?.message || err.message });
      }
    }
  };

  const filtered = templates.filter(t => 
    !searchQuery || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                Salary Structure Templates
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Standardize grade pay scales, allowance packages, statutory PF/ESI, and tax deductions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button 
              onClick={fetchTemplates}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => navigate('/hr/salary-templates/create')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Template
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <HRTabs />

        {/* Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
          <div className="flex-1 relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salary templates by title or grade..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <span className="text-xs font-bold text-slate-500">{templates.length} Pay Scales</span>
        </div>

        {/* Templates Grid */}
        <div>
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
              <span className="font-medium text-xs text-slate-400">Loading salary templates...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span className="font-bold text-slate-700 text-sm block">No Salary Templates Found</span>
              <span className="text-xs text-slate-400">Click "Create New Template" to add a pay structure.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((tmpl) => {
                const totalAllowances = (tmpl.allowances || []).reduce((acc, a) => acc + (a.amount || 0), 0);
                const totalDeductions = (tmpl.deductions || []).reduce((acc, d) => acc + (d.amount || 0), 0);

                return (
                  <div 
                    key={tmpl._id} 
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                            Grade Pay Scale
                          </span>
                          <h3 className="font-bold text-slate-800 text-base mt-1.5">{tmpl.name}</h3>
                          {tmpl.description && (
                            <p className="text-xs text-slate-400 mt-0.5">{tmpl.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Salary Math Box */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-400">Basic Pay:</span>
                          <span className="font-bold text-slate-800">₹{(tmpl.basicSalary || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-400">Total Allowances (DA, HRA...):</span>
                          <span className="font-bold text-emerald-600">+ ₹{totalAllowances.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-400">Total Deductions (PF, PT...):</span>
                          <span className="font-bold text-rose-600">- ₹{totalDeductions.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center text-sm font-black">
                          <span className="text-purple-700">Estimated Net Pay:</span>
                          <span className="text-purple-700">₹{(tmpl.netSalary || (tmpl.basicSalary + totalAllowances - totalDeductions)).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Allowances preview */}
                      {tmpl.allowances && tmpl.allowances.length > 0 && (
                        <div className="text-[11px] text-slate-500">
                          <strong className="text-slate-700">Allowances ({tmpl.allowances.length}): </strong>
                          {tmpl.allowances.map(a => `${a.name} (₹${a.amount})`).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => navigate(`/hr/salary-templates/edit/${tmpl._id}`)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Template
                      </button>
                      <button
                        onClick={() => handleDelete(tmpl._id, tmpl.name)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

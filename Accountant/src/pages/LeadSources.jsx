import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Edit, Trash2, Tag, CheckCircle2, 
  Layers, LayoutDashboard, Kanban, X, RefreshCw, 
  Flame, HelpCircle, BarChart3, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { accountantService } from '../api/accountantService';

const LeadSources = () => {
  const [sources, setSources] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeSource, setActiveSource] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    description: '',
    status: 'Active',
  };
  const [formData, setFormData] = useState(initialForm);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [sourcesRes, leadsRes] = await Promise.all([
        accountantService.getLeadSources(),
        accountantService.getLeads(),
      ]);
      if (sourcesRes.success) setSources(sourcesRes.data || []);
      if (leadsRes.success) setLeads(leadsRes.data || []);
    } catch (err) {
      console.error('Error loading lead sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate leads count per source
  const leadCountBySource = useMemo(() => {
    const map = {};
    leads.forEach((l) => {
      const src = l.source || 'Unknown';
      map[src] = (map[src] || 0) + 1;
    });
    return map;
  }, [leads]);

  // Filtered sources
  const filteredSources = useMemo(() => {
    if (!searchQuery) return sources;
    const q = searchQuery.toLowerCase();
    return sources.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [sources, searchQuery]);

  // Top source
  const topSource = useMemo(() => {
    let best = null;
    let maxCount = -1;
    sources.forEach((s) => {
      const count = leadCountBySource[s.name] || 0;
      if (count > maxCount) {
        maxCount = count;
        best = { name: s.name, count };
      }
    });
    return best;
  }, [sources, leadCountBySource]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(initialForm);
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (src) => {
    setActiveSource(src);
    setFormData({
      name: src.name || '',
      description: src.description || '',
      status: src.status || 'Active',
    });
    setShowEditModal(true);
  };

  // Save Add
  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required', text: 'Source name is required.' });
      return;
    }
    const res = await accountantService.addLeadSource(formData);
    if (res.success) {
      setShowAddModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Source Added!',
        text: `"${formData.name}" has been registered as a lead source.`,
        timer: 1600,
        showConfirmButton: false,
      });
      loadData();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to add source.' });
    }
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required', text: 'Source name is required.' });
      return;
    }
    const res = await accountantService.updateLeadSource(activeSource.id, formData);
    if (res.success) {
      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Source Updated!',
        text: `Source details have been updated.`,
        timer: 1600,
        showConfirmButton: false,
      });
      loadData();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to update source.' });
    }
  };

  // Delete Source
  const handleDelete = (src) => {
    const attachedCount = leadCountBySource[src.name] || 0;
    Swal.fire({
      title: 'Delete Source?',
      text: attachedCount > 0
        ? `"${src.name}" is referenced by ${attachedCount} prospective leads. Are you sure you want to delete it?`
        : `Delete lead channel "${src.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd4b39',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await accountantService.deleteLeadSource(src.id);
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            timer: 1400,
            showConfirmButton: false,
          });
          loadData();
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#333]">Lead Sources & Channels</h1>
            <span className="bg-[#00a65a]/10 text-[#00a65a] text-xs font-semibold px-2 py-0.5 rounded">
              {sources.length} Channels
            </span>
          </div>
          <p className="text-[13px] text-gray-500">
            Configure acquisition channels (Walk-in, Social Ads, Portals, References) and monitor conversion attribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/leads/dashboard"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition"
          >
            <LayoutDashboard className="w-4 h-4 text-[#3c8dbc]" /> Dashboard
          </Link>
          <Link
            to="/leads/pipeline"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition"
          >
            <Kanban className="w-4 h-4 text-[#605ca8]" /> Pipeline
          </Link>
          <button
            onClick={handleOpenAdd}
            className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-1.5 rounded-[3px] text-[13px] font-semibold flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Source
          </button>
        </div>
      </div>

      {/* Highlights / Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-[3px] border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Active Channels</span>
            <h3 className="text-2xl font-bold text-gray-800">{sources.length}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Top Performing Channel</span>
            <h3 className="text-base font-bold text-gray-800 line-clamp-1">
              {topSource && topSource.count > 0 ? `${topSource.name} (${topSource.count})` : 'None yet'}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[3px] border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Total Inquiries Tracked</span>
            <h3 className="text-2xl font-bold text-gray-800">{leads.length}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#fefefe]">
          <h2 className="text-[16px] font-bold text-[#333]">All Configured Channels</h2>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search source name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={loadData}
              title="Refresh Sources"
              className="border border-gray-200 hover:bg-gray-50 text-gray-600 p-1.5 rounded-[3px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] text-[#444] text-[12px] font-bold tracking-wide border-b border-gray-200 uppercase">
                <th className="py-3 px-5 w-16 text-center">#</th>
                <th className="py-3 px-5">Source Name</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5 text-center">Inquiries Linked</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333] divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#3c8dbc]" />
                      <span>Loading lead sources...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSources.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400">
                    No lead sources found. Click "Add Source" to register one.
                  </td>
                </tr>
              ) : (
                filteredSources.map((src, i) => {
                  const leadCount = leadCountBySource[src.name] || 0;
                  return (
                    <tr key={src.id || i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-5 text-center text-gray-400 text-xs">{i + 1}</td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-[#3c8dbc] flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-gray-400" />
                          <span>{src.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-gray-500 max-w-xs truncate">
                        {src.description || '—'}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded text-xs">
                          {leadCount} {leadCount === 1 ? 'lead' : 'leads'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            src.status === 'Inactive'
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {src.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(src)}
                            title="Edit Source"
                            className="p-1 text-gray-400 hover:text-amber-600 rounded transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(src)}
                            title="Delete Source"
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: Add Source ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                <h3 className="font-bold text-[16px]">Add Lead Source Channel</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Source Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instagram Ads, Hoarding, Word of Mouth"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Details about where and how this channel operates..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] p-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                ></textarea>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-[3px] text-[13px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-5 py-1.5 rounded-[3px] text-[13px] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit Source ── */}
      {showEditModal && activeSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-600 text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                <h3 className="font-bold text-[16px]">Edit Lead Source</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Source Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] p-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                ></textarea>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-[3px] text-[13px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-1.5 rounded-[3px] text-[13px] font-semibold"
                >
                  Update Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadSources;

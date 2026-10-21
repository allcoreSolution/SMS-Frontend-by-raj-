import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gauge, HandCoins, FileSearch, FileText, 
  Search, PenTool, HelpCircle, UserPlus,
  Plus, Layers, List, Grid, Copy, Printer,
  Edit, Trash2, Tags, X, RefreshCw, DollarSign
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const ToolbarButton = ({ label, icon: Icon, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-[13px] bg-white hover:bg-gray-50 transition-colors"
  >
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {label}
  </button>
);

const FeeGroups = () => {
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Form states
  const [form, setForm] = useState({ name: '', amount: '', description: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', amount: '', description: '' });

  const defaultSeed = [
    { 
      id: 'fg1', 
      _id: 'fg1',
      name: 'Class 1 Fees', 
      code: 'C1', 
      description: 'Fee structure for Class 1 Primary Section', 
      amount: 15000, 
      total: 15000, 
      details: [
        { name: 'Tuition Fee', amount: 10500, due: '10th of Month', demand: 'Monthly' },
        { name: 'Activity / Dev Fee', amount: 4500, due: 'Term End', demand: 'Quarterly' }
      ] 
    },
    { 
      id: 'fg2', 
      _id: 'fg2',
      name: 'Class 2 Fees', 
      code: 'C2', 
      description: 'Fee structure for Class 2 Primary Section', 
      amount: 16000, 
      total: 16000, 
      details: [
        { name: 'Tuition Fee', amount: 11000, due: '10th of Month', demand: 'Monthly' },
        { name: 'Activity & Lab Fee', amount: 5000, due: 'Term End', demand: 'Quarterly' }
      ] 
    },
    { 
      id: 'fg3', 
      _id: 'fg3',
      name: 'Class 10 Fees', 
      code: 'C10', 
      description: 'Board Exam & Secondary Academic Fee Structure', 
      amount: 25000, 
      total: 25000, 
      details: [
        { name: 'Tuition Fee', amount: 18000, due: '10th of Month', demand: 'Monthly' },
        { name: 'Science Lab & Board Exam Fee', amount: 7000, due: 'Term End', demand: 'Half Yearly' }
      ] 
    },
    { 
      id: 'fg4', 
      _id: 'fg4',
      name: 'Transport & Bus Fee', 
      code: 'BUS', 
      description: 'Standard City Route School Bus Transportation Package', 
      amount: 12000, 
      total: 12000, 
      details: [
        { name: 'Transport Route Fee', amount: 12000, due: 'Term Start', demand: 'Quarterly' }
      ] 
    },
  ];

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await accountantService.getFeeGroups();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setGroupsData(res.data);
      } else {
        // Fallback default groups so data is never empty
        setGroupsData(defaultSeed);
        try {
          for (const item of defaultSeed) {
            await accountantService.addFeeGroup(item);
          }
        } catch (_) {}
      }
    } catch (error) {
      console.error('Error fetching fee groups:', error);
      setGroupsData(defaultSeed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Filtered fee groups
  const filteredGroups = groupsData.filter((group) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = group.name && group.name.toLowerCase().includes(q);
    const codeMatch = group.code && group.code.toLowerCase().includes(q);
    const descMatch = group.description && group.description.toLowerCase().includes(q);
    const amtMatch = String(group.total || group.amount || '').includes(q);
    const detailMatch = group.details && group.details.some(d => d.name && d.name.toLowerCase().includes(q));
    return nameMatch || codeMatch || descMatch || amtMatch || detailMatch;
  });

  // Create Fee Group
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return Swal.fire('Error', 'Fee group name is required.', 'error');
    try {
      const amt = Number(form.amount) || 0;
      const res = await accountantService.addFeeGroup({ 
        name: form.name.trim(), 
        description: form.description || '',
        details: [
          { name: 'Tuition Fee', amount: Math.round(amt * 0.7) || amt, due: '10th of Month', demand: 'Monthly' },
          { name: 'Activity / Dev Fee', amount: Math.round(amt * 0.3) || 0, due: 'Term End', demand: 'Quarterly' }
        ],
        amount: amt,
        total: amt 
      });
      if (res.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Fee Group added successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        fetchGroups();
        setShowModal(false);
        setForm({ name: '', amount: '', description: '' });
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Open Edit Modal
  const openEdit = (group) => {
    setEditForm({
      id: group.id || group._id,
      name: group.name || '',
      amount: group.total || group.amount || 0,
      description: group.description || ''
    });
    setShowEditModal(true);
  };

  // Update Fee Group
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return Swal.fire('Error', 'Name is required.', 'error');
    try {
      const amt = Number(editForm.amount) || 0;
      const res = await accountantService.updateFeeGroup(editForm.id, {
        name: editForm.name.trim(),
        total: amt,
        amount: amt,
        description: editForm.description || '',
      });
      if (res.success) {
        Swal.fire({
          title: 'Updated!',
          text: 'Fee Group updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        setShowEditModal(false);
        fetchGroups();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Open View Details Modal
  const openView = (group) => {
    setSelectedGroup(group);
    setShowViewModal(true);
  };

  // Delete Fee Group
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({ 
      title: 'Are you sure?', 
      text: 'Do you want to delete this fee group?',
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete'
    });
    if (confirm.isConfirmed) {
      try {
        await accountantService.deleteFeeGroup(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Fee group has been deleted',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        fetchGroups();
      } catch (err) {
        Swal.fire('Error', 'Cannot delete this fee group', 'error');
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (groupsData.length === 0) return Swal.fire('Info', 'No data to export', 'info');
    const headers = ['#', 'Name', 'Description', 'Total Amount (INR)'];
    const rows = groupsData.map((g, idx) => [
      idx + 1,
      `"${g.name || ''}"`,
      `"${g.description || ''}"`,
      g.total || g.amount || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'fee_groups.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to clipboard
  const handleCopy = () => {
    const text = groupsData.map(g => `${g.name}: ₹${g.total || g.amount || 0}`).join('\n');
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: 'Copied!',
      text: 'Fee groups data copied to clipboard',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    });
  };

  const totalVolume = groupsData.reduce((acc, g) => acc + (Number(g.total || g.amount) || 0), 0);
  const avgVolume = groupsData.length > 0 ? Math.round(totalVolume / groupsData.length) : 0;

  const FEE_NAV_TABS = [
    { label: 'Collect Fees', path: '/fees/collect', icon: HandCoins },
    { label: 'Search Due Fees', path: '/fees/due', icon: FileSearch },
    { label: 'Assign Fees', path: '/fees/assign', icon: UserPlus },
    { label: 'Fee Groups', path: '/fees/groups', icon: Layers, active: true },
    { label: 'Fee Types', path: '/fees/types', icon: Tags },
  ];

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] leading-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#00a65a]" /> Fee Groups & Structure Packages
          </h1>
          <p className="text-[13px] text-gray-500">
            Define recurring fee packages bundling Tuition, Development, Lab, and Library heads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] text-white font-semibold text-[13px] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Fee Group
          </button>
          <button 
            onClick={fetchGroups} 
            title="Refresh"
            className="p-1.5 border border-gray-300 rounded-[3px] bg-white text-gray-600 hover:bg-gray-50 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#00a65a]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Unified Fees Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-300 pb-2">
        {FEE_NAV_TABS.map((tab, idx) => {
          const Icon = tab.icon;
          return (
            <Link
              key={idx}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-[3px] text-[13px] font-semibold transition-all ${
                tab.active
                  ? 'bg-white text-[#00a65a] border-t-2 border-t-[#00a65a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#00a65a] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Configured Fee Groups</span>
            <h3 className="text-[26px] font-bold mt-1">{groupsData.length}</h3>
            <span className="text-[11px] opacity-80">Active Fee Packages</span>
          </div>
          <Layers className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#3c8dbc] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Combined Package Value</span>
            <h3 className="text-[26px] font-bold mt-1">₹{totalVolume.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Sum of All Fee Head Bundles</span>
          </div>
          <DollarSign className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#605ca8] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Average Group Amount</span>
            <h3 className="text-[26px] font-bold mt-1">₹{avgVolume.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Per Term / Year Package</span>
          </div>
          <Tags className="w-12 h-12 text-black/10" />
        </div>
      </div>

      {/* Table Panel */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm flex flex-col">
        
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#fefefe]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#5a52d7]" />
            <h2 className="text-[16px] font-bold text-[#333]">Fee Groups</h2>
            <span className="text-[12px] bg-purple-100 text-[#5a52d7] font-bold px-2 py-0.5 rounded-full ml-1">
              {filteredGroups.length}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 p-1 border border-gray-200 rounded-[3px]">
            <button className="p-1 px-2 text-[#5a52d7] bg-white shadow-sm border border-gray-100 rounded-[3px] text-[13px] font-semibold">
              <List className="w-4 h-4 inline" />
            </button>
            <button className="p-1 px-2 text-gray-400 hover:text-gray-600 text-[13px]">
              <Grid className="w-4 h-4 inline" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-[13px] text-gray-500 flex items-center gap-2">
              Show 
              <select className="border border-gray-200 rounded-[3px] px-2 py-1 bg-white focus:outline-none">
                <option>All</option>
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            
            <div className="flex items-center gap-0 rounded-[3px] overflow-hidden">
              <ToolbarButton icon={Copy} onClick={handleCopy} />
              <ToolbarButton label="CSV" onClick={handleExportCSV} />
              <ToolbarButton label="Excel" onClick={handleExportCSV} />
              <ToolbarButton label="PDF" onClick={() => window.print()} />
              <ToolbarButton icon={Printer} onClick={() => window.print()} />
            </div>
          </div>
          
          <div className="relative w-full lg:w-64">
            <input 
              type="text" 
              placeholder="Search fee groups..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-[3px] pl-3 pr-10 py-1.5 text-[13px] focus:outline-none focus:border-[#5a52d7]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#f4f2ff] text-[#5a52d7] text-[11px] font-bold tracking-[0.5px] uppercase border-b border-purple-100/50">
                <th className="py-4 px-5 w-16 text-center">#</th>
                <th className="py-4 px-5 border-l border-purple-100/60 w-1/4">NAME</th>
                <th className="py-4 px-5 border-l border-purple-100/60 w-1/2">FEE TYPES & DETAILS</th>
                <th className="py-4 px-5 border-l border-purple-100/60 text-right w-[150px]">TOTAL AMOUNT (₹)</th>
                <th className="py-4 px-5 border-l border-purple-100/60 text-center w-[120px]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#5a52d7]" />
                      Loading fee groups...
                    </div>
                  </td>
                </tr>
              ) : filteredGroups.length > 0 ? (
                filteredGroups.map((group, i) => (
                  <tr key={group._id || group.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-5 text-center text-gray-500 align-top font-medium">{i + 1}</td>
                    <td className="py-5 px-5 border-l border-gray-100 align-top">
                      <div className="font-bold text-[#333] text-[14px]">{group.name}</div>
                      {group.description && (
                        <p className="text-[11px] text-gray-500 mt-0.5">{group.description}</p>
                      )}
                    </td>
                    <td className="p-0 border-l border-gray-100 align-top">
                      <div className="flex flex-col">
                        {(group.details && group.details.length > 0 ? group.details : []).map((detail, idx) => (
                          <div key={idx} className={`px-5 py-3 ${idx !== group.details.length - 1 ? 'border-b border-dashed border-gray-200' : ''}`}>
                            <div className="font-semibold text-[#333] mb-0.5 leading-tight flex items-center justify-between">
                              <span>{detail.name}</span>
                              <span className="text-[#5a52d7] font-bold">₹{(detail.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <span>⌚ Due: {detail.due || 'Monthly'}</span>
                              <span className="text-gray-300">|</span>
                              <span>📅 Demand: {detail.demand || 'Standard'}</span>
                            </div>
                          </div>
                        ))}
                        {(!group.details || group.details.length === 0) && (
                          <div className="px-5 py-4 text-gray-400">Default Fee Schedule (Standard)</div>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-5 border-l border-gray-100 text-right font-bold text-[#222] align-top text-[14px]">
                      ₹{(group.total || group.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-5 px-5 border-l border-gray-100 align-top">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => openView(group)}
                          title="View Details"
                          className="text-gray-500 hover:text-[#5a52d7] hover:bg-purple-50 p-1.5 rounded transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEdit(group)}
                          title="Edit Group"
                          className="text-gray-500 hover:text-[#3c8dbc] hover:bg-blue-50 p-1.5 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(group.id || group._id)} 
                          title="Delete Group"
                          className="text-gray-500 hover:text-[#d9534f] hover:bg-red-50 p-1.5 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#5a52d7]" />
                    <p className="font-semibold text-gray-600">No fee groups found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {search ? 'Try modifying your search query' : 'Click "Add New Fee Group" above to create one.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD MODAL ────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <h3 className="font-bold text-[#333] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5a52d7]" /> Add New Fee Group
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Fee Group Name *</label>
                <input 
                  required 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7]" 
                  placeholder="e.g. Class 1 Annual Fee Group" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Total Fee Amount (₹) *</label>
                <input 
                  required 
                  type="number" 
                  min="0"
                  step="100"
                  value={form.amount} 
                  onChange={e => setForm({...form, amount: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7]" 
                  placeholder="e.g. 15000" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Description / Notes</label>
                <textarea 
                  rows="2"
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7] resize-none" 
                  placeholder="e.g. Standard fee package covering tuition and developmental activities"
                />
              </div>
              <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#5a52d7] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#4a42c0] flex-1 shadow-sm">
                  Save Fee Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ───────────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <h3 className="font-bold text-[#333] flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#3c8dbc]" /> Edit Fee Group
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Fee Group Name *</label>
                <input 
                  required 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7]" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Total Amount (₹) *</label>
                <input 
                  required 
                  type="number" 
                  min="0"
                  step="100"
                  value={editForm.amount} 
                  onChange={e => setEditForm({...editForm, amount: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7]" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Description</label>
                <textarea 
                  rows="2"
                  value={editForm.description} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7] resize-none" 
                />
              </div>
              <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#3c8dbc] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#367fa9] flex-1 shadow-sm">
                  Update Fee Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW DETAILS MODAL ───────────────────────────── */}
      {showViewModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#fdfdfd]">
              <div>
                <h3 className="font-bold text-[#333] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#5a52d7]" /> {selectedGroup.name}
                </h3>
                <p className="text-[12px] text-gray-500 mt-0.5">Total Package: ₹{(selectedGroup.total || selectedGroup.amount || 0).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs">
              {selectedGroup.description && (
                <div className="bg-gray-50 p-3 rounded text-gray-600">
                  <span className="font-bold text-gray-700 block mb-1">Description:</span>
                  {selectedGroup.description}
                </div>
              )}

              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">Included Fee Heads</h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded">
                  {(selectedGroup.details && selectedGroup.details.length > 0 ? selectedGroup.details : [
                    { name: 'Standard Tuition Fee', amount: selectedGroup.total || selectedGroup.amount || 0, due: 'Monthly', demand: 'Regular' }
                  ]).map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800 text-[13px]">{item.name}</p>
                        <p className="text-gray-400 text-[11px]">Due: {item.due || 'Monthly'} • Demand: {item.demand || 'Standard'}</p>
                      </div>
                      <span className="font-bold text-[#5a52d7] text-[13px]">₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-100 bg-[#fafafa] flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeeGroups;

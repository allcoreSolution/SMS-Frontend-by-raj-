import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gauge, HandCoins, FileSearch, UserPlus, Layers, Tags,
  Plus, Tag, List, Grid, Copy, Printer,
  Edit, Trash2, Download, HelpCircle,
  Search, RefreshCw, X, PenTool
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

const FeeTypes = () => {
  const [typesData, setTypesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Forms
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', code: '', description: '' });

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await accountantService.getFeeTypes();
      if (res && res.success && Array.isArray(res.data)) {
        setTypesData(res.data || []);
      } else {
        setTypesData([]);
      }
    } catch (error) {
      console.error('Error fetching fee types:', error);
      setTypesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Filtered fee types
  const filteredTypes = typesData.filter((type) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const name = (type.feeType || type.name || '').toLowerCase();
    const code = (type.feeCode || type.code || '').toLowerCase();
    const desc = (type.description || '').toLowerCase();
    return name.includes(q) || code.includes(q) || desc.includes(q);
  });

  // Auto-generate code suggestion from name
  const handleNameChange = (val, isEdit = false) => {
    if (isEdit) {
      setEditForm(prev => ({
        ...prev,
        name: val,
        code: prev.code || val.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)
      }));
    } else {
      setForm(prev => ({
        ...prev,
        name: val,
        code: prev.code ? prev.code : val.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)
      }));
    }
  };

  // Create Fee Type
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return Swal.fire('Error', 'Fee Type Name is required.', 'error');
    try {
      const res = await accountantService.addFeeType({ 
        feeType: form.name.trim(), 
        feeCode: form.code.trim().toUpperCase() || form.name.slice(0, 2).toUpperCase(), 
        description: form.description.trim() 
      });
      if (res.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Fee Type added successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        fetchTypes();
        setShowModal(false);
        setForm({ name: '', code: '', description: '' });
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Open Edit Modal
  const openEdit = (type) => {
    setEditForm({
      id: type.id || type._id,
      name: type.feeType || type.name || '',
      code: type.feeCode || type.code || '',
      description: type.description || ''
    });
    setShowEditModal(true);
  };

  // Update Fee Type
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return Swal.fire('Error', 'Fee Type Name is required.', 'error');
    try {
      const res = await accountantService.updateFeeType(editForm.id, {
        feeType: editForm.name.trim(),
        name: editForm.name.trim(),
        feeCode: editForm.code.trim().toUpperCase(),
        code: editForm.code.trim().toUpperCase(),
        description: editForm.description.trim()
      });
      if (res.success) {
        Swal.fire({
          title: 'Updated!',
          text: 'Fee Type updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        setShowEditModal(false);
        fetchTypes();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  // Delete Fee Type
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({ 
      title: 'Are you sure?', 
      text: 'Do you want to delete this fee type?',
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete'
    });
    if (confirm.isConfirmed) {
      try {
        await accountantService.deleteFeeType(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Fee type has been deleted',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        fetchTypes();
      } catch (err) {
        Swal.fire('Error', 'Cannot delete this fee type', 'error');
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (typesData.length === 0) return Swal.fire('Info', 'No fee types to export', 'info');
    const headers = ['#', 'Fee Type', 'Fee Code', 'Description'];
    const rows = typesData.map((t, idx) => [
      idx + 1,
      `"${t.feeType || t.name || ''}"`,
      `"${t.feeCode || t.code || ''}"`,
      `"${t.description || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'fee_types.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Sample Import Template
  const handleDownloadTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Fee Type Name,Fee Code,Description\nTuition Fee,TF,Monthly standard tuition\nTransport Fee,TR,Bus and conveyance charges\nExam Fee,EX,Term examination fee\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'fee_types_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Swal.fire({
      title: 'Template Downloaded',
      text: 'Sample CSV template downloaded successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Copy to clipboard
  const handleCopy = () => {
    const text = typesData.map(t => `${t.feeType || t.name} (${t.feeCode || t.code || 'N/A'}) - ${t.description || 'No description'}`).join('\n');
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: 'Copied!',
      text: 'Fee types copied to clipboard',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    });
  };

  const FEE_NAV_TABS = [
    { label: 'Collect Fees', path: '/fees/collect', icon: HandCoins },
    { label: 'Search Due Fees', path: '/fees/due', icon: FileSearch },
    { label: 'Assign Fees', path: '/fees/assign', icon: UserPlus },
    { label: 'Fee Groups', path: '/fees/groups', icon: Layers },
    { label: 'Fee Types', path: '/fees/types', icon: Tags, active: true },
  ];

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] leading-tight flex items-center gap-2">
            <Tags className="w-6 h-6 text-[#f39c12]" /> Fee Types & Head Categories
          </h1>
          <p className="text-[13px] text-gray-500">
            Configure distinct fee heads (Tuition, Transport, Exams, Library, Activity, Sports).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-[3px] bg-[#f39c12] hover:bg-[#e08e0b] text-white font-semibold text-[13px] shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Fee Type
          </button>
          <button 
            onClick={fetchTypes} 
            title="Refresh"
            className="p-1.5 border border-gray-300 rounded-[3px] bg-white text-gray-600 hover:bg-gray-50 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#f39c12]' : ''}`} />
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
                  ? 'bg-white text-[#f39c12] border-t-2 border-t-[#f39c12] shadow-xs'
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
        <div className="bg-[#f39c12] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Configured Fee Types</span>
            <h3 className="text-[26px] font-bold mt-1">{typesData.length}</h3>
            <span className="text-[11px] opacity-80">Distinct Ledger Categories</span>
          </div>
          <Tags className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#00a65a] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Active Fee Heads</span>
            <h3 className="text-[26px] font-bold mt-1">{typesData.length}</h3>
            <span className="text-[11px] opacity-80">Used in Groups & Billing</span>
          </div>
          <Tag className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#3c8dbc] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Fee Codes Generated</span>
            <h3 className="text-[26px] font-bold mt-1">{typesData.filter(t => t.feeCode || t.code).length}</h3>
            <span className="text-[11px] opacity-80">Shortcode Billing Identifiers</span>
          </div>
          <Layers className="w-12 h-12 text-black/10" />
        </div>
      </div>

      {/* Action Sub-Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#333]">All Fee Head Categories</h2>
          <p className="text-xs text-gray-500">Configure distinct fee heads (Tuition, Transport, Exams, Library, Activity).</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-[3px] bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" /> Download Template
          </button>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] bg-[#f39c12] hover:bg-[#e08e0b] text-white font-semibold text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Fee Type
          </button>
        </div>
      </div>

      {/* Table Panel */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm flex flex-col">
        
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#fefefe]">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#5a52d7]" />
            <h2 className="text-[16px] font-bold text-[#333]">All Fee Types</h2>
            <span className="text-[12px] bg-purple-100 text-[#5a52d7] font-bold px-2 py-0.5 rounded-full ml-1">
              {filteredTypes.length}
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
              placeholder="Search fee types..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-[3px] pl-3 pr-10 py-1.5 text-[13px] focus:outline-none focus:border-[#5a52d7]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#f4f2ff] text-[#5a52d7] text-[11px] font-bold tracking-[0.5px] uppercase border-b border-purple-100/50">
                <th className="py-4 px-5 w-16 text-center">#</th>
                <th className="py-4 px-5 border-l border-purple-100/60 w-1/3">NAME</th>
                <th className="py-4 px-5 border-l border-purple-100/60 w-1/4">FEE CODE</th>
                <th className="py-4 px-5 border-l border-purple-100/60">DESCRIPTION</th>
                <th className="py-4 px-5 border-l border-purple-100/60 text-center w-[120px]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#5a52d7]" />
                      Loading fee types...
                    </div>
                  </td>
                </tr>
              ) : filteredTypes.length > 0 ? (
                filteredTypes.map((type, i) => (
                  <tr key={type._id || type.id || i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-5 text-center text-gray-500 font-medium">{i + 1}</td>
                    <td className="py-4 px-5 border-l border-gray-100 font-bold text-gray-800 text-[14px]">
                      {type.feeType || type.name}
                    </td>
                    <td className="py-4 px-5 border-l border-gray-100 text-gray-600">
                      {type.feeCode || type.code ? (
                        <span className="bg-[#eff2ff] text-[#5a52d7] font-bold px-2.5 py-1 rounded-[3px] text-[11px] uppercase tracking-wider border border-purple-100">
                          {type.feeCode || type.code}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-4 px-5 border-l border-gray-100 text-gray-500 font-normal">
                      {type.description || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-4 px-5 border-l border-gray-100 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => openEdit(type)}
                          title="Edit Fee Type"
                          className="text-gray-500 hover:text-[#3c8dbc] hover:bg-blue-50 p-1.5 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(type.id || type._id)} 
                          title="Delete Fee Type"
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
                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#5a52d7]" />
                    <p className="font-semibold text-gray-600">No fee types found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {search ? 'Try modifying your search query' : 'Click "Add New Fee Type" above to configure your first fee head.'}
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
                <Tag className="w-4 h-4 text-[#5a52d7]" /> Add New Fee Type
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Fee Type Name *</label>
                <input 
                  required 
                  type="text" 
                  value={form.name} 
                  onChange={e => handleNameChange(e.target.value, false)} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7]" 
                  placeholder="e.g. Tuition Fee, Sports Fee, Bus Conveyance" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Fee Code</label>
                <input 
                  type="text" 
                  value={form.code} 
                  onChange={e => setForm({...form, code: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7] uppercase" 
                  placeholder="e.g. TF, SF, BUS" 
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Short abbreviation for receipts & challans.</span>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7] resize-none" 
                  rows={2} 
                  placeholder="Briefly describe what this fee covers..."
                />
              </div>
              <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#5a52d7] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#4a42c0] flex-1 shadow-sm">
                  Save Fee Type
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
                <Edit className="w-4 h-4 text-[#3c8dbc]" /> Edit Fee Type
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4"/>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 flex flex-col gap-4 text-sm">
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Fee Type Name *</label>
                <input 
                  required 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7]" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Fee Code</label>
                <input 
                  type="text" 
                  value={editForm.code} 
                  onChange={e => setEditForm({...editForm, code: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7] uppercase" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Description</label>
                <textarea 
                  value={editForm.description} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})} 
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] focus:outline-none focus:border-[#5a52d7] resize-none" 
                  rows={2} 
                />
              </div>
              <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 text-gray-600 text-[13px] font-semibold rounded-[3px] hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#3c8dbc] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#367fa9] flex-1 shadow-sm">
                  Update Fee Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeeTypes;

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Search, Edit2, Trash2, RefreshCw, 
  Users, CheckCircle2, X, Download, Printer, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import HRTabs from '../../components/hr/HRTabs';
import { hrService } from '../../api/hrService';
import { exportToCSV, exportToExcel, printTable } from '../../utils/exportUtils';

export default function HRDesignations() {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'Academic',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchDesignations();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await hrService.getDepartments();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setDepartments(list);
    } catch (err) {
      console.warn('Could not load departments', err);
    }
  };

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const res = await hrService.getDesignations();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setDesignations(list);
    } catch (err) {
      console.error('Error fetching designations:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Designations',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      code: '',
      department: departments[0]?.name || 'Academic',
      description: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (desig) => {
    setIsEditing(true);
    setCurrentId(desig._id);
    setFormData({
      name: desig.name,
      code: desig.code || '',
      department: desig.department || 'Academic',
      description: desig.description || '',
      status: desig.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Name Required', text: 'Please enter designation title' });
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await hrService.updateDesignation(currentId, formData);
        Swal.fire({ icon: 'success', title: 'Updated Successfully', timer: 1400, showConfirmButton: false });
      } else {
        await hrService.createDesignation(formData);
        Swal.fire({ icon: 'success', title: 'Designation Created', timer: 1400, showConfirmButton: false });
      }
      setIsModalOpen(false);
      fetchDesignations();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Designation?',
      text: `Are you sure you want to delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await hrService.deleteDesignation(id);
        Swal.fire({ icon: 'success', title: 'Deleted', timer: 1300, showConfirmButton: false });
        fetchDesignations();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err?.response?.data?.message || err.message,
          confirmButtonColor: '#7c3aed'
        });
      }
    }
  };

  const filtered = designations.filter(d => 
    !searchQuery || 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.code && d.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d.department && d.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportHeaders = ['name', 'code', 'department', 'staffCount', 'status'];
  const handleCSV = () => exportToCSV(exportHeaders, filtered, 'designations.csv');
  const handleExcel = () => exportToExcel(exportHeaders, filtered, 'designations.xls');
  const handlePrint = () => printTable('Designations Directory', exportHeaders, filtered);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                Staff Designations & Roles
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Maintain official employment titles, hierarchy rankings, and role descriptors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button 
              onClick={handleCSV}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button 
              onClick={handlePrint}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={handleOpenAdd}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Designation
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <HRTabs />

        {/* Filter and Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
          <div className="flex-1 relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designations by title, department, or code..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">{designations.length} Designations</span>
            <button 
              onClick={fetchDesignations}
              className="p-2 text-slate-400 hover:text-purple-600 rounded-lg cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Designations Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">Designation Title</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4 text-center">Staff Count</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-14 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                        <span className="font-medium text-xs">Loading designations...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-14 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <span className="font-semibold text-slate-700 text-sm">No Designations Found</span>
                        <span className="text-xs text-slate-400">Click "Add Designation" to define a new title.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((desig, idx) => (
                    <tr key={desig._id || idx} className="hover:bg-slate-50/75 transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-4 px-4 font-bold text-slate-800">
                        {desig.name}
                        {desig.description && (
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">{desig.description}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-purple-600">
                        <span className="px-2 py-0.5 bg-purple-50 rounded-md text-[10px]">
                          {desig.code || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {desig.department || 'General'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{desig.staffCount || 0}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {desig.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(desig)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Designation"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(desig._id, desig.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Designation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ===================== ADD / EDIT MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-200">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {isEditing ? 'Edit Designation' : 'Add New Designation'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Record staff designation details</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Designation Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Senior PGT Mathematics, Lab Assistant"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Code</label>
                  <input 
                    type="text"
                    placeholder="e.g. PGT-MATH"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {departments.map((d, i) => (
                      <option key={d._id || i} value={d.name}>{d.name}</option>
                    ))}
                    <option value="Academic">Academic</option>
                    <option value="Administration">Administration</option>
                    <option value="Science & Math">Science & Math</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Role Description</label>
                <textarea 
                  rows="2"
                  placeholder="Responsibilities and scope for this designation..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{saving ? 'Saving...' : 'Save Designation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

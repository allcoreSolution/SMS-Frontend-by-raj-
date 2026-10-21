import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  Tags, Plus, List, Grid as GridIcon, Download, Search, 
  Trash2, Edit, Save, X, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../../api/examService';

export default function OfflineExamTypes() {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newType, setNewType] = useState({ name: '', abbreviation: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await examService.getExamTypes();
      if (res.success) {
        setTypes(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load exam types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newType.name.trim() || !newType.abbreviation.trim()) {
      return Swal.fire('Error', 'Name and abbreviation are required', 'warning');
    }

    try {
      setSaving(true);
      const res = await examService.createExamType(newType);
      if (res.success) {
        Swal.fire({
          title: 'Exam Type Added!',
          text: `"${newType.name}" registered.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setIsModalOpen(false);
        setNewType({ name: '', abbreviation: '', description: '' });
        fetchTypes();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add exam type', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Exam Type?',
      text: `Remove "${name}" category?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await examService.deleteExamType(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Exam type removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          setTypes(prev => prev.filter(t => (t._id || t.id) !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete exam type', 'error');
      }
    }
  };

  const filteredTypes = types.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.abbreviation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Exam Types Configuration</h1>
            <p className="text-xs text-slate-500 mt-1">
              Categorize assessments (Term Exams, Unit Tests, Annual, Mock Boards)
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Exam Type
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exam type by name or abbreviation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            {filteredTypes.length} Types Defined
          </span>
        </div>

        {/* Types Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Loading exam types...</p>
            </div>
          ) : filteredTypes.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Tags className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Exam Types Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Define evaluation categories like Unit Test, Half-Yearly, or Board Exam.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Category Name</th>
                    <th className="py-3.5 px-4">Abbreviation</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTypes.map((t) => {
                    const typeId = t._id || t.id;
                    return (
                      <tr key={typeId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800 text-xs">
                          {t.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold rounded-lg text-xs border border-indigo-200">
                            {t.abbreviation}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {t.description || 'Standard evaluation category'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(typeId, t.name)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete Type"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Add Type Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Tags className="w-4 h-4 text-indigo-600" /> New Exam Type
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Pre-Board Examination"
                  value={newType.name}
                  onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Abbreviation / Code *</label>
                <input
                  type="text"
                  placeholder="e.g. PB"
                  value={newType.abbreviation}
                  onChange={(e) => setNewType({ ...newType, abbreviation: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Notes on exam weightage or format..."
                  value={newType.description}
                  onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  {saving ? 'Saving...' : 'Add Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

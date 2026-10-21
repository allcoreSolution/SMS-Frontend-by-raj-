import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tags, PlusCircle, Search, Download, Trash2, 
  Edit, RefreshCw, FileText, CheckCircle2, XCircle, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import AccountsTabs from '../../components/accounts/AccountsTabs';
import { accountsService } from '../../api/accountsService';

const ExpenseHeads = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingHead, setEditingHead] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', status: 'Active' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchHeads();
  }, []);

  const fetchHeads = async () => {
    try {
      setLoading(true);
      const res = await accountsService.getExpenseHeads();
      setHeads(res.data || res || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Expense Head?',
      text: `Are you sure you want to delete category "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e11d48'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await accountsService.deleteExpenseHead(id);
      if (res && res.success) {
        Swal.fire('Deleted!', 'Expense head removed.', 'success');
        setHeads(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to delete head', 'error');
    }
  };

  const handleOpenEdit = (head) => {
    setEditingHead(head);
    setEditForm({
      name: head.name || '',
      description: head.description || '',
      status: head.status || 'Active'
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await accountsService.updateExpenseHead(editingHead._id, editForm);
      if (res && res.success) {
        Swal.fire('Updated!', 'Expense head updated successfully', 'success');
        setEditingHead(null);
        await fetchHeads();
      }
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error', 'Failed to update expense head', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredHeads = useMemo(() => {
    return heads.filter(h => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        (h.name || '').toLowerCase().includes(q) ||
        (h.description || '').toLowerCase().includes(q)
      );
    });
  }, [heads, searchTerm]);

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <Tags className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Expense Heads &amp; Cost Centers</h1>
            <p className="text-xs text-slate-500">Categories for classifying operational and capital expenditures</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/accounts/expense-heads/add')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Add Expense Head
        </button>
      </div>

      {/* Tabs */}
      <AccountsTabs />

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden mb-6">
        
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tags className="w-4 h-4 text-rose-600" /> Expense Heads Registry
            </h2>
            <p className="text-xs text-slate-500">Configured expenditure categories for institutional budgeting</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search head name..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
            <button 
              onClick={fetchHeads}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xs"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Expense Head Name</th>
                <th className="py-3 px-4">Description / Scope</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
                    <span>Loading expense heads...</span>
                  </td>
                </tr>
              ) : filteredHeads.length > 0 ? (
                filteredHeads.map((head, i) => (
                  <tr key={head._id || i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                      {i + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {head.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {head.description || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        head.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {head.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(head)}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(head._id, head.name)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <Tags className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No expense heads found</p>
                    <p className="text-xs text-slate-400 mt-1">Create a new expense category above.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-500">
          Showing {filteredHeads.length} active expense categories
        </div>

      </div>

      {/* Edit Modal */}
      {editingHead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">Edit Expense Head</span>
              <button onClick={() => setEditingHead(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Head Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingHead(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/20"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpenseHeads;

import React, { useState, useEffect } from 'react';
import { Home, Plus, Edit2, Trash2, Users, RefreshCw, X, Sparkles, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const StudentHouses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    description: '',
    headStudent: ''
  });

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const res = await studentService.getHouses();
      setHouses(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch houses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleOpenAdd = () => {
    setEditingHouse(null);
    setFormData({ name: '', color: '#3b82f6', description: '', headStudent: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (house) => {
    setEditingHouse(house);
    setFormData({
      name: house.name,
      color: house.color || '#3b82f6',
      description: house.description || '',
      headStudent: house.headStudent || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete House?',
      text: `Are you sure you want to delete ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        await studentService.deleteHouse(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'House removed successfully.',
          icon: 'success',
          customClass: { popup: 'rounded-2xl' }
        });
        fetchHouses();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Validation Error', 'House name is required.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      if (editingHouse) {
        await studentService.updateHouse(editingHouse._id, formData);
        Swal.fire('Updated', 'House details updated.', 'success');
      } else {
        await studentService.createHouse(formData);
        Swal.fire('Created', 'New house added.', 'success');
      }
      setIsModalOpen(false);
      fetchHouses();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalMembers = houses.reduce((acc, h) => acc + (h.students || 0), 0);

  return (
    <div className="p-6 max-w-[1400px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Student Houses & Factions</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Co-Curricular Teams
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Houses for intramural athletics, sports tournaments, debates, and annual points trophy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New House
          </button>
        </div>
      </div>

      <StudentsTabs />

      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Active Houses: <strong>{houses.length}</strong> • Total Enrolled Members: <strong>{totalMembers} Students</strong></span>
        </div>
        <button onClick={fetchHouses} className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Houses Grid Cards */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading house rosters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {houses.map(house => (
            <div 
              key={house._id} 
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              style={{ borderTop: `4px solid ${house.color || '#3b82f6'}` }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: house.color || '#3b82f6' }} />
                    <h3 className="font-bold text-slate-900 text-base">{house.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {house.status || 'Active'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {house.description || 'Inter-house tournament and sports team.'}
                </p>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Members:</span>
                    <span className="font-bold text-slate-900">{house.students || 0} Students</span>
                  </div>
                  {house.headStudent && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">House Captain:</span>
                      <span className="font-semibold text-slate-800">{house.headStudent}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(house)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(house._id, house.name)}
                  className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl transition-colors"
                  title="Delete House"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit House Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">{editingHouse ? 'Edit House' : 'Create New House'}</h3>
                <p className="text-xs text-indigo-200">House profile for points and competitions</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">House Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Red Phoenix, Green Dragon"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">House Captain / Leader</label>
                <input
                  type="text"
                  placeholder="e.g. Vihaan Gupta (Class X)"
                  value={formData.headStudent}
                  onChange={(e) => setFormData(prev => ({ ...prev, headStudent: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description / Motto</label>
                <textarea
                  rows={2}
                  placeholder="Courage, wisdom and spirit..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingHouse ? 'Update House' : 'Save House'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentHouses;

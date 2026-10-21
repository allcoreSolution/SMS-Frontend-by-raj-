import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  Award, Plus, Search, Trash2, X, Save, 
  CheckCircle2, TrendingUp, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../../api/examService';

export default function ManageGrades() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newGrade, setNewGrade] = useState({
    name: '',
    minPercentage: 0,
    maxPercentage: 100,
    gradePoint: 10,
    description: ''
  });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const res = await examService.getExamGrades();
      if (res.success) {
        setGrades(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load grades:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newGrade.name.trim()) {
      return Swal.fire('Error', 'Grade name is required (e.g. A1)', 'warning');
    }

    try {
      setSaving(true);
      const res = await examService.createExamGrade(newGrade);
      if (res.success) {
        Swal.fire({
          title: 'Grade Added!',
          text: `Grade "${newGrade.name}" registered.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setIsModalOpen(false);
        setNewGrade({ name: '', minPercentage: 0, maxPercentage: 100, gradePoint: 10, description: '' });
        fetchGrades();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add grade scale', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Grade Scale?',
      text: `Remove Grade "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await examService.deleteExamGrade(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Grade removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          setGrades(prev => prev.filter(g => (g._id || g.id) !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete grade', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manage Grading Scale</h1>
            <p className="text-xs text-slate-500 mt-1">
              Percentage boundaries, Grade Points (GPA), and performance qualitative descriptors
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Grade
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Grades Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Loading grading system...</p>
            </div>
          ) : grades.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Grades Configured</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Setup grading boundaries to calculate report card grades automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Grade</th>
                    <th className="py-3.5 px-4">Percentage Range</th>
                    <th className="py-3.5 px-4">Grade Point</th>
                    <th className="py-3.5 px-4">Performance Description</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grades.map((g) => {
                    const gradeId = g._id || g.id;
                    return (
                      <tr key={gradeId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center">
                            {g.name}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 text-xs">
                          {g.minPercentage}% — {g.maxPercentage}%
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 bg-slate-100 rounded-md font-mono font-bold text-slate-700 text-xs">
                            {g.gradePoint || 10}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {g.description || 'Standard academic performance'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(gradeId, g.name)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete Grade"
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

      {/* Add Grade Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" /> New Grade Scale
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Grade Symbol *</label>
                <input
                  type="text"
                  placeholder="e.g. A1, A2, B1"
                  value={newGrade.name}
                  onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Min % *</label>
                  <input
                    type="number"
                    value={newGrade.minPercentage}
                    onChange={(e) => setNewGrade({ ...newGrade, minPercentage: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Max % *</label>
                  <input
                    type="number"
                    value={newGrade.maxPercentage}
                    onChange={(e) => setNewGrade({ ...newGrade, maxPercentage: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Grade Point (GPA)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newGrade.gradePoint}
                  onChange={(e) => setNewGrade({ ...newGrade, gradePoint: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Performance Descriptor</label>
                <input
                  type="text"
                  placeholder="e.g. Outstanding / Very Good"
                  value={newGrade.description}
                  onChange={(e) => setNewGrade({ ...newGrade, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
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
                  {saving ? 'Saving...' : 'Add Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

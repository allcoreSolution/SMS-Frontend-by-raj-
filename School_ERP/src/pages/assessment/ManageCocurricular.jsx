import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  Star, Plus, Trash2, X, Save, AlertCircle, 
  Palette, Music, Activity, HeartHandshake, Laptop
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../../api/examService';

export default function ManageCocurricular() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newArea, setNewArea] = useState({ name: '', category: 'Visual & Performing Arts', description: '' });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await examService.getCocurricularAreas();
      if (res.success) {
        setAreas(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load cocurricular areas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newArea.name.trim()) {
      return Swal.fire('Error', 'Area title is required', 'warning');
    }

    try {
      setSaving(true);
      const res = await examService.createCocurricularArea(newArea);
      if (res.success) {
        Swal.fire({
          title: 'Area Added!',
          text: `"${newArea.name}" added to assessment schema.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setIsModalOpen(false);
        setNewArea({ name: '', category: 'Visual & Performing Arts', description: '' });
        fetchAreas();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to add cocurricular area', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Area?',
      text: `Remove "${name}" from co-scholastic evaluations?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await examService.deleteCocurricularArea(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Area removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          setAreas(prev => prev.filter(a => (a._id || a.id) !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete area', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Cocurricular & Co-Scholastic Areas</h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure non-academic evaluation parameters (Arts, Sports, Discipline, Life Skills)
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Cocurricular Area
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Areas Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Loading cocurricular areas...</p>
            </div>
          ) : areas.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Cocurricular Areas Configured</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Add non-scholastic criteria to evaluate student sports, arts, and character conduct.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Area / Skill Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {areas.map((area) => {
                    const areaId = area._id || area.id;
                    return (
                      <tr key={areaId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800 text-xs flex items-center gap-2.5">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Star className="w-4 h-4" />
                          </div>
                          {area.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-md font-semibold text-slate-700 text-xs">
                            {area.category || 'General Skill'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {area.description || 'Evaluation on 3-point grade scale'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(areaId, area.name)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                            title="Delete Area"
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-600" /> New Cocurricular Skill
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Area / Activity Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Physical Fitness & Athletics"
                  value={newArea.name}
                  onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                <select
                  value={newArea.category}
                  onChange={(e) => setNewArea({ ...newArea, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="Visual & Performing Arts">Visual & Performing Arts</option>
                  <option value="Physical Education">Physical Education & Sports</option>
                  <option value="Life Skills">Life Skills & Ethics</option>
                  <option value="Vocational & Digital">Vocational & Digital Literacy</option>
                  <option value="Discipline & Values">Discipline & Attendance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Grading rubrics or observable metrics..."
                  value={newArea.description}
                  onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Add Area'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

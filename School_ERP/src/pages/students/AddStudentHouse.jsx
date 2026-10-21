import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Lightbulb, ArrowLeft, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const AddStudentHouse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    description: '',
    headStudent: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Validation Error', 'House Name is required.', 'warning');
      return;
    }

    try {
      setLoading(true);
      await studentService.createHouse(formData);
      await Swal.fire({
        title: 'House Created!',
        text: `${formData.name} has been added to school houses.`,
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-2xl' }
      });
      navigate('/students/houses');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Student House</h1>
          <p className="text-xs text-slate-500 mt-1">Create a new faction for sports days and inter-house competitions.</p>
        </div>
        <button
          onClick={() => navigate('/students/houses')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Houses
        </button>
      </div>

      <StudentsTabs />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">House Details</h2>
          </div>

          <div className="space-y-4">
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
                placeholder="e.g. Vihaan Gupta (Grade X)"
                value={formData.headStudent}
                onChange={(e) => setFormData(prev => ({ ...prev, headStudent: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description / Motto</label>
              <textarea
                rows={3}
                placeholder="Courage, valor and sportsmanship..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {loading ? 'Creating...' : 'Save House'}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Lightbulb className="w-5 h-5 text-indigo-600" /> About Houses
          </div>
          <div className="space-y-3 text-xs text-indigo-950/80 leading-relaxed">
            <p>• Houses group students across all grades for sports days and academic bees.</p>
            <p>• Students can be assigned to houses during admission or in the student list.</p>
          </div>
        </div>

      </form>

    </div>
  );
};

export default AddStudentHouse;

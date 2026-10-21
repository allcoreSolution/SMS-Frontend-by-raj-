import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tags, Lightbulb, ArrowLeft, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const AddStudentCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Validation Error', 'Category Name is required.', 'warning');
      return;
    }

    try {
      setLoading(true);
      await studentService.createCategory(formData);
      await Swal.fire({
        title: 'Category Created!',
        text: `${formData.name} has been added to student categories.`,
        icon: 'success',
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-2xl' }
      });
      navigate('/students/categories');
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
          <h1 className="text-2xl font-bold text-slate-900">Add Student Category</h1>
          <p className="text-xs text-slate-500 mt-1">Official classification category for admissions and quotas.</p>
        </div>
        <button
          onClick={() => navigate('/students/categories')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </button>
      </div>

      <StudentsTabs />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Tags className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Category Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category Name *</label>
              <input
                type="text"
                placeholder="e.g. General, OBC, SC, ST"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Code</label>
              <input
                type="text"
                placeholder="e.g. GEN, OBC, SC"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description / Statutory Guidance</label>
              <textarea
                rows={3}
                placeholder="Quota terms and reservation guidelines..."
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
              {loading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-6 space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Lightbulb className="w-5 h-5 text-indigo-600" /> Statutory Categories
          </div>
          <div className="space-y-3 text-xs text-indigo-950/80 leading-relaxed">
            <p>• Used to generate mandatory state education department reports and affirmative compliance audits.</p>
          </div>
        </div>

      </form>

    </div>
  );
};

export default AddStudentCategory;

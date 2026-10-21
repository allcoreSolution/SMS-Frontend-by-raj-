import React, { useState } from 'react';
import { LayoutGrid, Save, ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AddNewSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sectionName: '',
    capacity: 40,
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sectionName.trim()) {
      Swal.fire({
        title: 'Section Name Required',
        text: 'Please enter a section title (e.g. A, B, Rose, or Blue).',
        icon: 'warning',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await academicService.createSection({
        ...formData,
        capacity: Number(formData.capacity) || 40
      });

      if (res.success) {
        await Swal.fire({
          title: 'Section Created!',
          text: `Section "${formData.sectionName}" has been successfully added.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/academics/sections');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to create section',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/academics/sections')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sections
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Add New Academic Section
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create a section division to group students within grade levels.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Section Information</h2>
              <p className="text-[11px] text-slate-500">Provide section division and maximum capacity</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section Name / Identifier <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sectionName"
                value={formData.sectionName}
                onChange={handleChange}
                placeholder="e.g. A, B, C, Rose, Lotus"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Maximum Student Capacity
              </label>
              <input
                type="number"
                name="capacity"
                min="5"
                max="200"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default student seating threshold per section.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/academics/sections')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {submitting ? 'Creating...' : 'Create Section'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 text-xs text-indigo-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-indigo-700 text-sm">
              <Info className="w-4 h-4" /> Section Reusability
            </div>
            <p className="leading-relaxed text-indigo-900/80">
              Sections are universal divisions (e.g. A, B, C) that can be attached to any class grade level in your school.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewSection;

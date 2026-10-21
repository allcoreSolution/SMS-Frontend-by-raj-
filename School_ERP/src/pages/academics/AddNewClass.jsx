import React, { useState, useEffect } from 'react';
import { LayoutGrid, Save, ArrowLeft, Users, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AddNewClass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    className: '',
    numericValue: 1,
    sections: [],
    classTeacher: '',
    status: 'active'
  });
  const [availableSections, setAvailableSections] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrerequisites();
  }, []);

  const fetchPrerequisites = async () => {
    try {
      setLoading(true);
      const [secRes, teachRes] = await Promise.all([
        academicService.getSections(),
        academicService.getTeachers()
      ]);
      if (secRes.success) setAvailableSections(secRes.data || []);
      if (teachRes.success) setAvailableTeachers(teachRes.data || []);
    } catch (err) {
      console.error('Failed to load prerequisites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionToggle = (sectionId) => {
    setFormData(prev => {
      const exists = prev.sections.includes(sectionId);
      return {
        ...prev,
        sections: exists 
          ? prev.sections.filter(id => id !== sectionId)
          : [...prev.sections, sectionId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.className.trim()) {
      Swal.fire({
        title: 'Class Name Required',
        text: 'Please enter a name for the class (e.g. Class XI or Nursery).',
        icon: 'warning',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await academicService.createClass({
        ...formData,
        numericValue: Number(formData.numericValue) || 1,
        classTeacher: formData.classTeacher || null
      });

      if (res.success) {
        await Swal.fire({
          title: 'Class Created!',
          text: `Class "${formData.className}" has been successfully added to the curriculum.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/academics/classes');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to create academic class',
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
            onClick={() => navigate('/academics/classes')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Classes
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Add New Academic Class
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Define a grade level, configure order index, and attach section divisions.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Class Details</h2>
              <p className="text-[11px] text-slate-500">Class specifications and coordinator assignment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="e.g. Class XI or Grade 1"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Numeric Order / Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="numericValue"
                  min="0"
                  max="50"
                  value={formData.numericValue}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">Used for automatic sorting and progression logic (e.g. 1, 2, 10, 11).</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Class Coordinator / Head Teacher
              </label>
              <select
                name="classTeacher"
                value={formData.classTeacher}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white font-medium text-slate-700"
              >
                <option value="">-- Select Faculty Coordinator --</option>
                {availableTeachers.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.fullName} ({t.designation || 'Teacher'})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">The lead coordinator oversees all sections and syllabus for this grade.</p>
            </div>

            {/* Sections Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Attach Initial Sections
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableSections.map(sec => {
                  const isSelected = formData.sections.includes(sec._id);
                  return (
                    <button
                      key={sec._id}
                      type="button"
                      onClick={() => handleSectionToggle(sec._id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isSelected 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      Section {sec.sectionName}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">Select all sections that belong to this class. You can add or modify sections anytime.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/academics/classes')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {submitting ? 'Creating...' : 'Save Class'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Box */}
        <div className="space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 text-xs text-indigo-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-indigo-700 text-sm">
              <Info className="w-4 h-4" /> Grade Configuration
            </div>
            <p className="leading-relaxed text-indigo-900/80">
              Each class created here will immediately be available for subject assignments, timetable scheduling, and student admission.
            </p>
            <p className="leading-relaxed text-indigo-900/80">
              Numeric value is critical for sequential year-end rollover (e.g. Class I [1] → Class II [2]).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewClass;

import React, { useState } from 'react';
import { Book, Save, ArrowLeft, Info, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { academicService } from '../../api/academicService';

const AddNewSubject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    subjectType: 'theory',
    isElective: false,
    creditHours: 4,
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subjectName.trim() || !formData.subjectCode.trim()) {
      Swal.fire({
        title: 'Missing Fields',
        text: 'Please enter both Subject Name and Subject Code.',
        icon: 'warning',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await academicService.createSubject({
        ...formData,
        creditHours: Number(formData.creditHours) || 4
      });

      if (res.success) {
        await Swal.fire({
          title: 'Subject Created!',
          text: `Subject "${formData.subjectName}" (${formData.subjectCode}) has been added to the syllabus.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/academics/subjects');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to create subject',
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
            onClick={() => navigate('/academics/subjects')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Subjects
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Add New Curriculum Subject
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Register a core compulsory or elective subject with credit evaluations.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Subject Details</h2>
              <p className="text-[11px] text-slate-500">Provide official subject title, syllabus code, and grading format</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  placeholder="e.g. Physics, Economics, Sanskrit"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Subject Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subjectCode"
                  value={formData.subjectCode}
                  onChange={handleChange}
                  placeholder="e.g. PHY101 or SKT201"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Evaluation Format
                </label>
                <select
                  name="subjectType"
                  value={formData.subjectType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white text-slate-700 font-medium"
                >
                  <option value="theory">Theory Examination Only</option>
                  <option value="practical">Practical / Lab Only</option>
                  <option value="both">Theory + Practical Combined</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Credit Hours / Units
                </label>
                <input
                  type="number"
                  name="creditHours"
                  min="1"
                  max="10"
                  value={formData.creditHours}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isElective"
                  checked={formData.isElective}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Mark as Optional / Elective Subject
                </span>
              </label>
              <p className="text-[11px] text-slate-500 ml-6.5 mt-1">
                If checked, students will individually choose this subject via the <strong>Assign Electives</strong> tool.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/academics/subjects')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {submitting ? 'Creating...' : 'Save Subject'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 text-xs text-indigo-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-indigo-700 text-sm">
              <Info className="w-4 h-4" /> Subject Assignment Flow
            </div>
            <p className="leading-relaxed text-indigo-900/80">
              After creating a subject, navigate to <strong>Assign Subjects</strong> to enable it for specific classes.
            </p>
            <p className="leading-relaxed text-indigo-900/80">
              Timetable slots and report cards will draw directly from these defined subjects and evaluation types.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewSubject;

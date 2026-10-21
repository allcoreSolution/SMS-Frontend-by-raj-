import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Wand2, Calendar, Plus, Save, BookOpen, Clock, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { examService } from '../../api/examService';
import { academicService } from '../../api/academicService';

export default function QuickExamSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [types, setTypes] = useState([]);

  const [formData, setFormData] = useState({
    examName: '',
    examType: 'Term 1 Exam',
    session: '2026-2027',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'Scheduled',
    academicClass: '',
    description: ''
  });

  useEffect(() => {
    academicService.getClasses().then(res => setClasses(res.data || [])).catch(console.error);
    examService.getExamTypes().then(res => setTypes(res.data || [])).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.examName.trim()) {
      return Swal.fire('Error', 'Please enter examination title', 'warning');
    }

    try {
      setLoading(true);
      const res = await examService.createExam(formData);
      if (res.success) {
        await Swal.fire({
          title: 'Exam Created!',
          text: `"${formData.examName}" scheduled successfully.`,
          icon: 'success',
          confirmButtonColor: '#6366F1',
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/offline-exams/manage');
      } else {
        Swal.fire('Error', res.message || 'Failed to create exam', 'error');
      }
    } catch (err) {
      console.error('Failed to create exam:', err);
      Swal.fire('Error', 'An error occurred while creating examination', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">Quick Exam Setup</h2>
              <p className="text-xs text-slate-400">Configure new exam session & schedules</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/offline-exams/manage')}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Exam Title <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              name="examName"
              placeholder="e.g. Half-Yearly Examination 2026-2027"
              value={formData.examName}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Exam Type
              </label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              >
                {types.length > 0 ? (
                  types.map(t => <option key={t._id} value={t.name}>{t.name}</option>)
                ) : (
                  <>
                    <option value="Term 1 Exam">Term 1 Exam</option>
                    <option value="Half-Yearly Exam">Half-Yearly Exam</option>
                    <option value="Unit Test">Unit Test</option>
                    <option value="Annual Examination">Annual Examination</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Academic Session
              </label>
              <input
                type="text"
                name="session"
                placeholder="2026-2027"
                value={formData.session}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Class (Optional Focus)
              </label>
              <select
                name="academicClass"
                value={formData.academicClass}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              >
                <option value="">All Applicable Classes</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.className}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description / Instructions
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="Instructions for invigilators, students or datesheet details..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-none"
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/offline-exams/manage')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Examination'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

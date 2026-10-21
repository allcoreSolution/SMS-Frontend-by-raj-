import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Search, Edit2, Trash2, RefreshCw, 
  CheckCircle2, X, AlertCircle, Award
} from 'lucide-react';
import Swal from 'sweetalert2';
import HRTabs from '../../components/hr/HRTabs';
import { hrService } from '../../api/hrService';

export default function HRAppraisalCriteria() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Instructional Skills',
    maxScore: 10,
    weightage: 25,
    description: ''
  });

  useEffect(() => {
    fetchCriteria();
  }, []);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const res = await hrService.getAppraisalCriteria();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setCriteria(list);
    } catch (err) {
      console.error('Error fetching criteria:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Name Required', text: 'Please enter criterion name' });
      return;
    }

    try {
      setSubmitting(true);
      await hrService.createAppraisalCriterion(formData);
      Swal.fire({ icon: 'success', title: 'Criterion Added', timer: 1400, showConfirmButton: false });
      setIsModalOpen(false);
      fetchCriteria();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: err?.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                Appraisal Evaluation Criteria
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Standardize rubric parameters, scoring weights, and competency domains
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button 
              onClick={fetchCriteria}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Criterion
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <HRTabs />

        {/* Criteria Grid */}
        <div>
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
              <span className="font-medium text-xs text-slate-400">Loading criteria rubrics...</span>
            </div>
          ) : criteria.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span className="font-bold text-slate-700 text-sm block">No Criteria Configured</span>
              <span className="text-xs text-slate-400">Click "Add Criterion" to define parameters.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {criteria.map((c) => (
                <div 
                  key={c._id} 
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3 hover:border-purple-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      {c.category}
                    </span>
                    <span className="text-xs font-black text-purple-700">
                      {c.weightage}% Wt.
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm">{c.name}</h3>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Score:</span>
                      <span className="font-bold text-slate-800">{c.maxScore} Pts</span>
                    </div>
                    {c.description && (
                      <p className="text-[11px] text-slate-400 mt-1">{c.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-200">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">New Criterion</h3>
                  <p className="text-[11px] text-slate-500">Define rubric and weightage</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Criterion Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Pedagogical Delivery, Student Mentorship"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="Instructional Skills">Instructional Skills</option>
                  <option value="Classroom Management">Classroom Management</option>
                  <option value="Professional Conduct">Professional Conduct</option>
                  <option value="Institutional Contribution">Institutional Contribution</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Score (Pts)</label>
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({...formData, maxScore: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Weightage (%)</label>
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    value={formData.weightage}
                    onChange={(e) => setFormData({...formData, weightage: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Save Criterion</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Filter, Eye, Copy, Trash2, 
  Search, X, CheckCircle2, Clock, Calendar, 
  AlertCircle, ChevronRight, Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';
import lessonPlanService, { CLASSES_LIST } from '../../api/lessonPlanService';

export default function LessonPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');

  // Preview Modal
  const [previewPlan, setPreviewPlan] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await lessonPlanService.getLessonPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = async () => {
    setLoading(true);
    try {
      const filtered = await lessonPlanService.getLessonPlans({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        className: classFilter !== 'All' ? classFilter : undefined,
        search: searchQuery || undefined
      });
      setPlans(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setSearchQuery('');
    setStatusFilter('All');
    setClassFilter('All');
    setLoading(true);
    const data = await lessonPlanService.getLessonPlans();
    setPlans(data);
    setLoading(false);
  };

  const handleDuplicate = async (id) => {
    try {
      const cloned = await lessonPlanService.duplicateLessonPlan(id);
      if (cloned) {
        alert('Lesson plan duplicated as draft!');
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await lessonPlanService.deleteLessonPlan(deletingId);
      setDeletingId(null);
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">Draft</span>;
      case 'Pending HOD':
      case 'Pending Review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Pending HOD</span>;
      case 'Pending Principal':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">Pending Principal</span>;
      case 'Approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'Needs Revision':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">Needs Revision</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <LessonPlannerNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-5">
        
        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                placeholder="Search plan by title, topic, or teacher..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="w-40">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Pending HOD">Pending HOD</option>
                <option value="Pending Principal">Pending Principal</option>
                <option value="Approved">Approved</option>
                <option value="Needs Revision">Needs Revision</option>
              </select>
            </div>

            <div className="w-44">
              <select 
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Classes</option>
                {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button 
              onClick={handleApplyFilter}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>

            {(searchQuery || statusFilter !== 'All' || classFilter !== 'All') && (
              <button 
                onClick={handleResetFilters}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-medium flex items-center gap-1 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>

          <button 
            onClick={() => navigate('/lesson-planner/new')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> New Plan
          </button>
        </div>

        {/* Plans Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Curriculum Lesson Plans</h2>
              <p className="text-xs text-slate-500 mt-0.5">Comprehensive repository of weekly teacher plans and instructional units.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {plans.length} Total Plans
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Plan Title</th>
                  <th className="px-5 py-3.5">Class / Subject</th>
                  <th className="px-5 py-3.5">Assigned Teacher</th>
                  <th className="px-5 py-3.5">Schedule Period</th>
                  <th className="px-5 py-3.5 text-center">Periods</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                      Loading curriculum plans...
                    </td>
                  </tr>
                ) : plans.length > 0 ? (
                  plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div 
                          onClick={() => setPreviewPlan(plan)}
                          className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer flex items-center gap-1.5"
                        >
                          {plan.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {plan.chapters && plan.chapters[0] ? plan.chapters[0] : 'Curriculum Unit'}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{plan.className}</div>
                        <div className="text-[11px] text-slate-500">{plan.subjectName}</div>
                      </td>

                      <td className="px-5 py-3.5 font-medium text-slate-700">
                        {plan.teacherName}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600">
                        {plan.weekLabel || `${plan.startDate} — ${plan.endDate}`}
                      </td>

                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">
                        {plan.periods || 4}
                      </td>

                      <td className="px-5 py-3.5">
                        {getStatusBadge(plan.status)}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setPreviewPlan(plan)}
                            title="Inspect Details"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button 
                            onClick={() => handleDuplicate(plan.id)}
                            title="Duplicate Plan"
                            className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            onClick={() => setDeletingId(plan.id)}
                            title="Delete Plan"
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600">No lesson plans found matching criteria.</p>
                      <button
                        onClick={() => navigate('/lesson-planner/new')}
                        className="mt-3 px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                      >
                        Create New Lesson Plan
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Plan Preview Modal */}
      {previewPlan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                  Lesson Plan Detail
                </span>
                <h3 className="text-base font-bold text-slate-900">{previewPlan.title}</h3>
              </div>
              <button 
                onClick={() => setPreviewPlan(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Teacher</span>
                  <span className="font-semibold text-slate-800">{previewPlan.teacherName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Class & Subject</span>
                  <span className="font-semibold text-slate-800">{previewPlan.className} · {previewPlan.subjectName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                  <span className="mt-0.5 inline-block">{getStatusBadge(previewPlan.status)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Learning Objectives</h4>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed text-slate-800">
                  {previewPlan.objectives}
                </p>
              </div>

              {previewPlan.chapters && previewPlan.chapters.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Chapters / Units</h4>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                    {previewPlan.chapters.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              {previewPlan.teachingMethods && previewPlan.teachingMethods.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Teaching Methods & Aids</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewPlan.teachingMethods.map(m => (
                      <span key={m} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-[11px] font-medium">
                        {m}
                      </span>
                    ))}
                    {previewPlan.teachingAids?.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-200 text-[11px] font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {previewPlan.homework && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Homework / Assignments</h4>
                  <p className="text-slate-700 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
                    {previewPlan.homework}
                  </p>
                </div>
              )}

              {previewPlan.reviewNotes && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">HOD Review Notes</h4>
                  <p className="text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-200/50">
                    {previewPlan.reviewNotes}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
              <button 
                onClick={() => setPreviewPlan(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Delete this lesson plan?</h3>
            <p className="text-xs text-slate-500 mt-1">This will permanently delete the plan from the directory.</p>
            <div className="mt-5 flex justify-center gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

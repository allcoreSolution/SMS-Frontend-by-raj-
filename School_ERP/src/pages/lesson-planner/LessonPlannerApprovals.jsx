import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, CheckCircle2, Eye, Check, X, 
  Inbox, Sparkles, AlertCircle, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';
import lessonPlanService, { CLASSES_LIST } from '../../api/lessonPlanService';

export default function LessonPlannerApprovals() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [inspectPlan, setInspectPlan] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const allPlans = await lessonPlanService.getLessonPlans();
      const queue = allPlans.filter(p => p.status === 'Pending Principal');
      setPlans(queue);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredPlans.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleApproveSingle = async (planId) => {
    try {
      await lessonPlanService.finalApprovePlan(planId);
      setPlans(prev => prev.filter(p => p.id !== planId));
      setSelectedIds(prev => prev.filter(i => i !== planId));
      alert('Lesson plan approved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveBulk = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one lesson plan to approve.');
      return;
    }
    try {
      await lessonPlanService.bulkApprovePlans(selectedIds);
      setPlans(prev => prev.filter(p => !selectedIds.includes(p.id)));
      alert(`Approved ${selectedIds.length} lesson plan(s) successfully!`);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPlans = plans.filter(p => {
    if (classFilter === 'All') return true;
    return p.className && p.className.toLowerCase().includes(classFilter.toLowerCase());
  });

  const allSelected = filteredPlans.length > 0 && selectedIds.length === filteredPlans.length;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <LessonPlannerNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Principal Final Approval Authority</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  Step 2 of 2
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Executive sign-off on department-endorsed weekly lesson plans. Approved plans are published to teacher dashboards and student portals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {selectedIds.length > 0 && (
              <button 
                onClick={handleApproveBulk}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Approve Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Approvals Table Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Plans Awaiting Final Sign-off</h3>
              <p className="text-xs text-slate-500 mt-0.5">All plans in this list have passed preliminary HOD scrutiny.</p>
            </div>

            <div className="w-48">
              <select 
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Classes</option>
                {CLASSES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5 w-12 text-center">
                    <input 
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-3.5">Plan Title</th>
                  <th className="px-5 py-3.5">Teacher</th>
                  <th className="px-5 py-3.5">Class / Subject</th>
                  <th className="px-5 py-3.5">Target Week</th>
                  <th className="px-5 py-3.5 text-center">Periods</th>
                  <th className="px-5 py-3.5 text-right">Approval Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-400">
                      Loading approvals queue...
                    </td>
                  </tr>
                ) : filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => {
                    const isSelected = selectedIds.includes(plan.id);
                    return (
                      <tr 
                        key={plan.id}
                        className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="px-5 py-3.5 text-center">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(plan.id)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        <td className="px-5 py-3.5">
                          <div 
                            onClick={() => setInspectPlan(plan)}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                          >
                            {plan.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {plan.chapters && plan.chapters[0] ? plan.chapters[0] : 'Instructional Unit'}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 font-medium text-slate-700">
                          {plan.teacherName}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{plan.className}</div>
                          <div className="text-[11px] text-slate-500">{plan.subjectName}</div>
                        </td>

                        <td className="px-5 py-3.5 text-slate-600">
                          {plan.weekLabel || `${plan.startDate} — ${plan.endDate}`}
                        </td>

                        <td className="px-5 py-3.5 text-center font-bold text-slate-800">
                          {plan.periods || 4}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => setInspectPlan(plan)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>

                            <button 
                              onClick={() => handleApproveSingle(plan.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Sign Off</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Approvals queue is clear</p>
                        <p className="text-xs text-slate-400 mt-0.5">No lesson plans currently require principal final sign-off.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredPlans.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {selectedIds.length} of {filteredPlans.length} plans selected
              </span>
              {selectedIds.length > 0 && (
                <button 
                  onClick={handleApproveBulk}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Approve Selected Plans
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Inspect Plan Modal */}
      {inspectPlan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                  Principal Plan Verification
                </span>
                <h3 className="text-base font-bold text-slate-900">{inspectPlan.title}</h3>
              </div>
              <button 
                onClick={() => setInspectPlan(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Teacher</span>
                  <span className="font-semibold text-slate-800">{inspectPlan.teacherName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Class & Subject</span>
                  <span className="font-semibold text-slate-800">{inspectPlan.className} · {inspectPlan.subjectName}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Learning Objectives</h4>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed text-slate-800">
                  {inspectPlan.objectives}
                </p>
              </div>

              {inspectPlan.reviewNotes && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">HOD Endorsement Remarks</h4>
                  <p className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-amber-900 leading-relaxed">
                    {inspectPlan.reviewNotes}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
              <button 
                onClick={() => setInspectPlan(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  const id = inspectPlan.id;
                  setInspectPlan(null);
                  handleApproveSingle(id);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

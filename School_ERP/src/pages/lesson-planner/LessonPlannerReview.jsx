import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Eye, Check, X, 
  Clock, AlertCircle, MessageSquare, ArrowRight, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';
import lessonPlanService from '../../api/lessonPlanService';

export default function LessonPlannerReview() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [inspectPlan, setInspectPlan] = useState(null);
  const [revisionModalPlan, setRevisionModalPlan] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const allPlans = await lessonPlanService.getLessonPlans();
      // Filter plans needing HOD review
      const queue = allPlans.filter(p => p.status === 'Pending HOD' || p.status === 'Pending Review');
      setPlans(queue);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (planId) => {
    try {
      await lessonPlanService.reviewPlan(planId, 'Pending Principal', 'HOD Approved. Recommended for Principal sign-off.');
      setPlans(prev => prev.filter(p => p.id !== planId));
      alert('Plan approved by HOD and forwarded to Principal for final sign-off!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturnRevision = async () => {
    if (!revisionModalPlan) return;
    try {
      await lessonPlanService.reviewPlan(revisionModalPlan.id, 'Needs Revision', revisionNotes || 'Please revise objectives and resubmit.');
      setPlans(prev => prev.filter(p => p.id !== revisionModalPlan.id));
      setRevisionModalPlan(null);
      setRevisionNotes('');
      alert('Plan returned to teacher for necessary revisions.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <LessonPlannerNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Head of Department (HOD) Review Desk</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                  Step 1 of 2
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted lesson plans for curriculum compliance, textbook alignment, and academic rigor before sending to Principal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-slate-500">
            <span className="font-bold text-slate-900">{plans.length}</span> plans awaiting review
          </div>
        </div>

        {/* Queue Table Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800">Pending Review Queue</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {plans.length} In Queue
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Lesson Plan</th>
                  <th className="px-5 py-3.5">Teacher</th>
                  <th className="px-5 py-3.5">Class / Subject</th>
                  <th className="px-5 py-3.5">Target Week</th>
                  <th className="px-5 py-3.5 text-center">Periods</th>
                  <th className="px-5 py-3.5 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                      Loading HOD review queue...
                    </td>
                  </tr>
                ) : plans.length > 0 ? (
                  plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div 
                          onClick={() => setInspectPlan(plan)}
                          className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                          {plan.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {plan.chapters && plan.chapters[0] ? plan.chapters[0] : 'Curriculum Unit'}
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
                            title="Inspect Details"
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button 
                            onClick={() => handleApprove(plan.id)}
                            title="Approve & Send to Principal"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>

                          <button 
                            onClick={() => {
                              setRevisionModalPlan(plan);
                              setRevisionNotes('');
                            }}
                            title="Return for Revision"
                            className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Return</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">All caught up!</p>
                        <p className="text-xs text-slate-400 mt-0.5">There are no lesson plans currently awaiting HOD review.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Inspect Plan Modal */}
      {inspectPlan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-0.5">
                  HOD Plan Review
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Class / Subject</span>
                  <span className="font-semibold text-slate-800">{inspectPlan.className} · {inspectPlan.subjectName}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Learning Objectives</h4>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed text-slate-800">
                  {inspectPlan.objectives}
                </p>
              </div>

              {inspectPlan.teachingMethods && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Teaching Methods</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectPlan.teachingMethods.map(m => (
                      <span key={m} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-[11px] font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {inspectPlan.homework && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Homework</h4>
                  <p className="p-2.5 bg-amber-50/50 border border-amber-200/50 rounded-xl text-slate-700">
                    {inspectPlan.homework}
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
                  handleApprove(id);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Approve as HOD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {revisionModalPlan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Return for Revision</h3>
              <button 
                onClick={() => setRevisionModalPlan(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-xs text-slate-600">
                Provide feedback to <span className="font-bold text-slate-800">{revisionModalPlan.teacherName}</span> explaining what modifications are needed.
              </p>
              <textarea 
                rows="4"
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="e.g. Please add more real-world problem examples and clarify the homework questions..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
              <button 
                onClick={() => setRevisionModalPlan(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleReturnRevision}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

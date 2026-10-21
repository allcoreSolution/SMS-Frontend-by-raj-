import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, PenTool, Hourglass, CheckCircle2, 
  RefreshCcw, Calendar, AlertTriangle, FileText, Plus, 
  ArrowRight, Users, CheckSquare, Sparkles, Eye, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';
import lessonPlanService from '../../api/lessonPlanService';

export default function LessonPlannerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlans: 0,
    drafts: 0,
    pendingHOD: 0,
    pendingPrincipal: 0,
    approved: 0,
    needsRevision: 0,
    overallCoveragePct: 0,
    recentPlans: []
  });

  const [previewPlan, setPreviewPlan] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await lessonPlanService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">Draft</span>;
      case 'Pending HOD':
      case 'Pending Review':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Pending HOD</span>;
      case 'Pending Principal':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">Pending Principal</span>;
      case 'Approved':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'Needs Revision':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">Needs Revision</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <LessonPlannerNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="p-1 rounded-md bg-white/20 backdrop-blur-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Academic Session 2026-2027
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Curriculum & Lesson Planning Desk</h2>
              <p className="text-xs text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
                Streamline weekly pedagogical plans, coordinate department HOD reviews, facilitate principal approvals, and reconcile syllabus topic completion rates.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/lesson-planner/new')}
                className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-md transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" /> New Plan
              </button>
              <button
                onClick={() => navigate('/lesson-planner/review')}
                className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-xs transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" /> Review Queue
              </button>
            </div>
          </div>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Plans</span>
              <ClipboardList className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{loading ? '...' : stats.totalPlans}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active curriculum plans</div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drafts</span>
              <PenTool className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-700 tracking-tight">{loading ? '...' : stats.drafts}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Unsubmitted drafts</div>
          </div>

          <div className="bg-white border border-amber-200/80 bg-amber-50/20 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending HOD</span>
              <Hourglass className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 tracking-tight">{loading ? '...' : stats.pendingHOD}</div>
            <div className="text-[11px] text-amber-600/80 mt-0.5">Awaiting HOD review</div>
          </div>

          <div className="bg-white border border-blue-200/80 bg-blue-50/20 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Pending Principal</span>
              <CheckSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-blue-600 tracking-tight">{loading ? '...' : stats.pendingPrincipal}</div>
            <div className="text-[11px] text-blue-600/80 mt-0.5">Final sign-off queue</div>
          </div>

          <div className="bg-white border border-emerald-200/80 bg-emerald-50/20 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Approved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">{loading ? '...' : stats.approved}</div>
            <div className="text-[11px] text-emerald-600/80 mt-0.5">Live classroom plans</div>
          </div>

          <div className="bg-white border border-rose-200/80 bg-rose-50/20 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Needs Revision</span>
              <RefreshCcw className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600 tracking-tight">{loading ? '...' : stats.needsRevision}</div>
            <div className="text-[11px] text-rose-600/80 mt-0.5">Returned to teachers</div>
          </div>
        </div>

        {/* Main Content: Left Column Plans + Right Column Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Lesson Plans (2 Columns) */}
          <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Recent Lesson Plans</h3>
              </div>
              <button 
                onClick={() => navigate('/lesson-planner/plans')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                View all plans <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Plan / Subject</th>
                    <th className="px-5 py-3">Teacher</th>
                    <th className="px-5 py-3">Target Week</th>
                    <th className="px-5 py-3 text-center">Periods</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {stats.recentPlans.length > 0 ? (
                    stats.recentPlans.map((plan) => (
                      <tr 
                        key={plan.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          plan.status === 'Pending Principal' ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div 
                            onClick={() => setPreviewPlan(plan)}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                          >
                            {plan.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {plan.className} · {plan.subjectName}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 font-medium text-slate-700">
                          {plan.teacherName}
                        </td>

                        <td className="px-5 py-3.5 text-slate-500">
                          {plan.weekLabel || plan.startDate}
                        </td>

                        <td className="px-5 py-3.5 text-center font-semibold text-slate-800">
                          {plan.periods || 4}
                        </td>

                        <td className="px-5 py-3.5">
                          {getStatusBadge(plan.status)}
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <button 
                            onClick={() => setPreviewPlan(plan)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Inspect Lesson Plan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                        No recent lesson plans found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column Action Cards */}
          <div className="space-y-6">
            
            {/* Awaiting Final Approval Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Awaiting Final Approval</h3>
                <CheckSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div className="p-6 text-center space-y-2">
                <div className="text-4xl font-extrabold text-blue-600 tracking-tight">
                  {stats.pendingPrincipal}
                </div>
                <p className="text-xs text-slate-500">
                  {stats.pendingPrincipal === 1 ? '1 plan requires' : `${stats.pendingPrincipal} plans require`} principal sign-off
                </p>
                <button 
                  onClick={() => navigate('/lesson-planner/approvals')}
                  className="mt-2 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Open Approvals Desk
                </button>
              </div>
            </div>

            {/* Syllabus Coverage Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Curriculum Reconciliation</h3>
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="p-6 text-center space-y-3">
                <div className="text-4xl font-extrabold text-emerald-600 tracking-tight">
                  {stats.overallCoveragePct}%
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.overallCoveragePct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Syllabus topics covered vs. planned for current academic term.
                </p>

                <button 
                  onClick={() => navigate('/lesson-planner/coverage')}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Track Syllabus Coverage
                </button>
              </div>
            </div>

            {/* Quick Creation Shortcut */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/60 rounded-2xl p-5 space-y-2">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Need to plan next week?</h4>
              <p className="text-xs text-indigo-700/80 leading-relaxed">
                Define objectives, select chapter topics from syllabus, attach worksheets, and send to your HOD in minutes.
              </p>
              <button 
                onClick={() => navigate('/lesson-planner/new')}
                className="mt-1 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Lesson Plan
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Plan Details Preview Modal */}
      {previewPlan && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-slate-200 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                  Lesson Plan Details
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

              {previewPlan.topicsList && previewPlan.topicsList.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">Syllabus Topics Checklist</h4>
                  <div className="space-y-1.5">
                    {previewPlan.topicsList.map((t, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <span>{t.text}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Covered' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewPlan.homework && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Homework / Assignments</h4>
                  <p className="text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
                    {previewPlan.homework}
                  </p>
                </div>
              )}

              {previewPlan.reviewNotes && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Review Notes</h4>
                  <p className="text-slate-600 bg-blue-50/50 p-3 rounded-xl border border-blue-200/50">
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

    </div>
  );
}

import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, CheckSquare, BarChart2, Settings, HelpCircle, 
  Plus, Lightbulb, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles,
  ChevronDown, ChevronUp, ShieldCheck, Clock, BookmarkCheck, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonPlannerNavHeader from './LessonPlannerNavHeader';

export default function LessonPlannerGuide() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'Plan Weekly Curriculum',
      role: 'Subject Teacher',
      desc: 'Select class, subject, and week. Pick syllabus topics from CBSE/ICSE curriculum, specify learning objectives, teaching aids, pedagogical methods, and homework tasks.',
      color: 'from-blue-500 to-indigo-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      step: '02',
      title: 'Save Draft or Submit',
      role: 'Subject Teacher',
      desc: 'Save ongoing preparation as a Draft anytime. Once ready, click "Submit for HOD Review" to lock the plan into the institutional review workflow.',
      color: 'from-sky-500 to-cyan-600',
      badge: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
      step: '03',
      title: 'Department Head Review',
      role: 'HOD / Lead Educator',
      desc: 'Department Head verifies pedagogical rigor, syllabus pace, and assessment alignment. Approves forwarding to Principal or returns with specific constructive notes.',
      color: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      step: '04',
      title: 'Principal Sign-Off',
      role: 'Principal / Academic Admin',
      desc: 'Final administrative sign-off on curriculum coverage. Supports 1-click single inspection or multi-select bulk approvals for weekly schedules.',
      color: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      step: '05',
      title: 'Execute & Reconcile',
      role: 'Classroom Delivery',
      desc: 'Conduct classroom lessons using planned aids. End-of-week coverage reconciliation allows teachers to mark topics Covered, Partial, or Not Covered.',
      color: 'from-purple-500 to-violet-600',
      badge: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      step: '06',
      title: 'Analytics & Audit Report',
      role: 'Academic Inspection',
      desc: 'Automated completion percentages and topic breakdown by class, teacher, and subject. Instantly export to CSV or print for CBSE inspection records.',
      color: 'from-rose-500 to-pink-600',
      badge: 'bg-rose-50 text-rose-700 border-rose-200'
    }
  ];

  const faqs = [
    {
      q: 'How does Lesson Planning differ from Classwork & Daily Logbooks?',
      a: 'A Lesson Plan is a proactive pedagogical roadmap created before the teaching week starts detailing what concepts will be introduced, instructional materials needed, and homework planned. Classwork/Logbook is the retrospective log of what was actually taught day-by-day. In School ERP, marking topics "Covered" in the planner reconciles directly with the logbook.'
    },
    {
      q: 'Can a teacher edit a lesson plan after submitting it for review?',
      a: 'Once submitted, a lesson plan is locked to preserve institutional audit integrity. If revisions are required, the HOD or Principal can return the plan with notes ("Needs Revision"), unlocking it for the teacher to make updates and resubmit.'
    },
    {
      q: 'Is the Head of Department (HOD) review step mandatory?',
      a: 'The HOD review tier can be enabled or disabled in Lesson Planner > Settings. If your institution does not have designated department heads, submitted plans bypass HOD review and flow directly into the Principal Approval queue.'
    },
    {
      q: 'How does syllabus coverage tracking work?',
      a: 'Each lesson plan includes syllabus topics. In the "Coverage" tab, educators or coordinators can click to mark topics as "Covered" (100%), "Partial" (50%), or "Not Covered" (0%). The system calculates live coverage percentages and displays alerts for lagging units.'
    },
    {
      q: 'Can previous lesson plans be duplicated for future weeks?',
      a: 'Yes! In the Lesson Plans list, click the clone button on any plan. This creates a duplicate draft preserving your teaching methods, instructional aids, and general structure, allowing you to simply adjust the target week and specific syllabus topics.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Sticky Navigation Header */}
      <LessonPlannerNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-blue-100 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Comprehensive Educator Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Master the Lesson Planner Workflow
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Design structured weekly learning plans, route submissions through departmental approval tiers, reconcile syllabus coverage with logbooks, and generate audit-ready academic reports.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/lesson-planner/new')}
                className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create New Plan
              </button>
              <button
                onClick={() => navigate('/lesson-planner/coverage')}
                className="px-5 py-2.5 bg-blue-600/60 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Track Coverage
              </button>
              <button
                onClick={() => navigate('/lesson-planner/plans')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Browse Plans
              </button>
            </div>
          </div>

          <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
            <Award className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* 6-Step Weekly Flow */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> End-to-End Lesson Planning Cycle
              </h2>
              <p className="text-xs text-slate-500">From preliminary draft preparation through classroom delivery and syllabus reconciliation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflowSteps.map((ws, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-slate-300 tracking-wider">
                      {ws.step}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${ws.badge}`}>
                      {ws.role}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">{ws.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{ws.desc}</p>
                </div>
                <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${ws.color}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 3-Column Feature Matrix & Role Responsibilities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Roles & Permissions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Users className="w-4 h-4 text-blue-600" /> Stakeholder Responsibilities
            </h3>

            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-blue-900">Subject Teachers</h4>
                  <span className="text-[10px] bg-blue-200/60 text-blue-800 px-2 py-0.5 rounded-md font-semibold">Author</span>
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Plan allotted classes, assemble homework and teaching aids, submit for approval, resolve revision feedback, and track end-of-week topic coverage.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-amber-900">Heads of Department (HOD)</h4>
                  <span className="text-[10px] bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded-md font-semibold">Reviewer</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Evaluate departmental curriculum plans, verify pedagogical depth, endorse forward to Principal, or request targeted revisions with review notes.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-emerald-900">Principal & Admin</h4>
                  <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">Sign-off</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Final authorization on institution schedules, bulk approvals, school-wide syllabus coverage reporting, and configuration of institutional policies.
                </p>
              </div>
            </div>
          </div>

          {/* Status Glossary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Plan Statuses & Flow
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg shrink-0 mt-0.5">
                  Draft
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">In Preparation</h5>
                  <p className="text-[11px] text-slate-500">Editable by the creator anytime. Not yet routed to reviewers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="px-2.5 py-1 bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold rounded-lg shrink-0 mt-0.5">
                  Pending HOD
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Awaiting Dept Head</h5>
                  <p className="text-[11px] text-slate-500">Locked for editing; sitting in HOD Review tab for pedagogical sign-off.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 border border-indigo-200 text-[10px] font-bold rounded-lg shrink-0 mt-0.5">
                  Pending Principal
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Final Admin Queue</h5>
                  <p className="text-[11px] text-slate-500">Vetted by HOD; waiting for Principal sign-off in Approvals tab.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-lg shrink-0 mt-0.5">
                  Approved
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Signed & Active</h5>
                  <p className="text-[11px] text-slate-500">Authorized for classroom instruction; active in Coverage tracking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold rounded-lg shrink-0 mt-0.5">
                  Needs Revision
                </span>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Returned with Notes</h5>
                  <p className="text-[11px] text-slate-500">Review notes attached; unlocked for teacher to rectify and resubmit.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus Coverage Reconciliation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookmarkCheck className="w-4 h-4 text-purple-600" /> Coverage Metrics
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-800">Covered (100% Weight)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Topic fully taught and assessed as planned. Immediately logs into classroom progress registers.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-800">Partial (50% Weight)</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Concept introduced or partially covered. Carried over to next week's lesson plan with review notes.
                </p>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-rose-800">Not Covered (0% Weight)</span>
                  <span className="text-xs font-bold text-rose-700">Missed</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Unaddressed due to timetable adjustments or unexpected events. Automatically flags in chronic non-coverage reports.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">Pending</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Scheduled</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Awaiting educator reconciliation at the conclusion of the teaching week.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Pro-Tips Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 shadow-sm flex items-start gap-4">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Educator Productivity Pro-Tip
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Save time on weekly planning by using the <strong>"Clone to Next Week"</strong> action on any approved plan. It duplicates your core teaching aids, pedagogical methods, and class structure into a new draft so you only need to swap the upcoming syllabus topics!
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500">Quick answers to common questions about lesson plans and institutional compliance.</p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i}
                  className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 py-4 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

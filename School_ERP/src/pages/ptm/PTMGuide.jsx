import React from 'react';
import { 
  Calendar, Users, ClipboardList, 
  HelpCircle, Check, MessageSquare, ShieldCheck, 
  Sparkles, ArrowRight, BookOpen, Send, PhoneCall
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PTMNavHeader from './PTMNavHeader';

export default function PTMGuide() {
  const navigate = useNavigate();

  const workflowSteps = [
    {
      step: '01',
      title: 'Schedule Session',
      desc: 'Admin/Teacher creates PTM event with title, date, start/end time, mode (In person / Online / Hybrid) and scope (Whole school or specific class).',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      step: '02',
      title: 'Compile Roster',
      desc: 'System automatically compiles student directory entries and snapshots guardian contacts to prepare the live attendance sheet.',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      step: '03',
      title: 'Broadcast Invites',
      desc: 'Send personalized WhatsApp and SMS invitations directly to guardians with meeting schedule, time slot, and location.',
      icon: Send,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      step: '04',
      title: 'Mark Attendance',
      desc: 'On meeting day, teachers record guardian presence in real time (Present, Absent, or Late) with quick 1-click controls.',
      icon: Check,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      step: '05',
      title: 'Record Remarks',
      desc: 'Write specific academic observations, strengths, conduct feedback, and assign consultation slot times per student.',
      icon: ClipboardList,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200'
    },
    {
      step: '06',
      title: 'Action Plans',
      desc: 'Flag students requiring teacher follow-ups. Track remediation goals and log guardian commitments till closure.',
      icon: MessageSquare,
      color: 'bg-rose-50 text-rose-600 border-rose-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      <PTMNavHeader />

      <div className="p-6 max-w-[1400px] mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-7 text-white shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-3 backdrop-blur-xs">
              <BookOpen className="w-3.5 h-3.5 text-blue-300" />
              Standard Operating Guide
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Parent-Teacher Meeting Master Workflow</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Step-by-step guidance on organizing school-wide parent meetings, streamlining guardian communications, recording evaluations, and monitoring student intervention plans.
            </p>
          </div>
        </div>

        {/* Workflow Steps Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">The 6-Stage PTM Lifecycle</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                      STAGE {s.step}
                    </span>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${s.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{s.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roles & Capabilities Matrix */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden space-y-4">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <span className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs font-bold">2</span>
            <h3 className="text-sm font-bold text-slate-900">User Permissions & Role Capabilities</h3>
          </div>

          <div className="p-6 pt-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3 rounded-l-xl">Operation / Feature</th>
                  <th className="px-6 py-3 text-center">School Admin</th>
                  <th className="px-6 py-3 text-center rounded-r-xl">Class / Subject Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">Schedule School-wide & Class PTMs</td>
                  <td className="px-6 py-3.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="px-6 py-3.5 text-center text-slate-400">View Only</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">Broadcast WhatsApp & SMS Invitations</td>
                  <td className="px-6 py-3.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="px-6 py-3.5 text-center text-slate-400">View Status</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">Mark Guardian Attendance</td>
                  <td className="px-6 py-3.5 text-center text-emerald-600 font-bold">All Classes</td>
                  <td className="px-6 py-3.5 text-center text-blue-600 font-bold">Assigned Classes</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">Write Student Remarks & Feedback</td>
                  <td className="px-6 py-3.5 text-center text-emerald-600 font-bold">All Classes</td>
                  <td className="px-6 py-3.5 text-center text-blue-600 font-bold">Assigned Classes</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">Manage Follow-ups & Action Items</td>
                  <td className="px-6 py-3.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="px-6 py-3.5 text-center text-blue-600 font-bold">Assigned Tasks</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">Export CSV & Print Consultation Reports</td>
                  <td className="px-6 py-3.5 text-center text-emerald-600 font-bold">Full Access</td>
                  <td className="px-6 py-3.5 text-center text-blue-600 font-bold">Assigned Classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Practices & Key Insights */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">3</span>
            <h3 className="text-sm font-bold text-slate-900">Best Practices for Productive PTMs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Flexible Scope:</span>
              <p>You can schedule sessions for a specific section, an entire grade, or whole-school simultaneously.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Non-Destructive Synchronization:</span>
              <p>Syncing the roster will never overwrite existing remarks or attendance statuses already marked by teachers.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Slot Allocation:</span>
              <p>For high-volume meetings, assign 10-15 minute time slots per student to minimize parent waiting times.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block text-xs">Action Plan Tracking:</span>
              <p>Always flag students who require remedial attention so the system tracks follow-up dates and assignees.</p>
            </div>
          </div>
        </div>

        {/* Quick Launch CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Ready to schedule your next Parent-Teacher Meeting?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Start creating sessions, inviting guardians, and tracking feedback immediately.</p>
          </div>
          <button
            onClick={() => navigate('/ptm/schedule')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            Schedule Meeting <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

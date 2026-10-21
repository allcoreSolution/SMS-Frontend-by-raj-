import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CalendarCheck, Calculator, CheckCircle, 
  ArrowRight, Sparkles, CheckCircle2, UserPlus, 
  CreditCard, Star, Building, Briefcase, HelpCircle
} from 'lucide-react';
import HRTabs from '../../components/hr/HRTabs';

export default function HRGuide() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Staff Directory & Onboarding",
      desc: "Enroll teaching faculty and non-teaching personnel, assign designations, departments, biometric IDs, bank account numbers, and emergency contact details.",
      actionText: "Open Staff Directory",
      actionPath: "/hr/staff",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      tips: [
        "Create Departments and Designations before onboarding new staff.",
        "Store scanned ID proofs, degrees, and teacher certifications in the documents tab.",
        "Generate printable Staff Identity Cards with employee QR codes."
      ]
    },
    {
      title: "2. Staff Attendance & Biometrics",
      desc: "Record daily punch-in/punch-out timings, track half-days and overtime, or sync automatically with IoT biometric fingerprint and facial recognition turnstiles.",
      actionText: "Mark Staff Attendance",
      actionPath: "/hr/attendance",
      icon: CalendarCheck,
      color: "from-emerald-500 to-teal-600",
      tips: [
        "Quick Batch Attendance lets HR mark all staff Present in 1 click.",
        "Automatic integration with monthly payroll deductions for unapproved absences.",
        "Export monthly attendance registers for compliance reporting."
      ]
    },
    {
      title: "3. Leave Management & Approvals",
      desc: "Define custom leave policies (Casual Leave, Sick Leave, Maternity Leave, Earned Leave) and review staff leave applications with approval/rejection workflows.",
      actionText: "Approve Leaves",
      actionPath: "/hr/approve-leave",
      icon: CheckCircle,
      color: "from-amber-500 to-orange-600",
      tips: [
        "Leave quota balances auto-decrement upon approval.",
        "Substitute teacher alerts can be triggered when a teacher takes leave.",
        "Carry-forward and encashment settings configured per session."
      ]
    },
    {
      title: "4. Payroll, Salary Templates & Payslips",
      desc: "Set up tiered salary structures with Basic Pay, DA, HRA, Provident Fund, ESI, Professional Tax, and generate monthly payslips with bulk disbursement sheets.",
      actionText: "Run Payroll",
      actionPath: "/hr/payroll",
      icon: Calculator,
      color: "from-purple-500 to-violet-600",
      tips: [
        "Assign pre-built Salary Templates to save time during onboarding.",
        "Automatic deduction calculation based on monthly attendance days.",
        "Direct export of bank NEFT/RTGS batch transfer spreadsheets."
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto min-h-screen bg-[#f8fafc] font-sans">
      <div className="mb-4">
        <HRTabs />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-100">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Human Resources & Payroll Guide</h1>
              <p className="text-xs text-slate-500">Standard procedures, guidelines, and workflows for staff recruitment, attendance, leave approval, and payroll.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/hr/dashboard')}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              HR Dashboard
            </button>
            <button 
              onClick={() => navigate('/hr/staff/new')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              + Add New Staff
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${sec.color} text-white flex items-center justify-center shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">{sec.title}</h2>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{sec.desc}</p>
                <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Key Procedures
                  </p>
                  <ul className="space-y-1.5">
                    {sec.tips.map((tip, tIdx) => (
                      <li key={tIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button 
                onClick={() => navigate(sec.actionPath)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>{sec.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

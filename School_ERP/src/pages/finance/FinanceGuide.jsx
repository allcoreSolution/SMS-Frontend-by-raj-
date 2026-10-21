import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, HandCoins, ArrowRightLeft, FileSearch, ShieldCheck, 
  Receipt, FileText, ArrowRight, BookOpen, Sparkles, Landmark, 
  HelpCircle, CreditCard, PieChart, CheckCircle2
} from 'lucide-react';
import FinanceTabs from '../../components/finance/FinanceTabs';

export default function FinanceGuide() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Collecting Student Fees",
      desc: "Instant search by student admission number or student name, calculate quarterly or monthly fee dues, and generate instant printable fee receipts with custom Challan numbers.",
      actionText: "Open Collect Fees",
      actionPath: "/finance/collect",
      icon: HandCoins,
      color: "from-emerald-500 to-teal-600",
      tips: [
        "Use partial payments if a parent wants to pay in installments.",
        "Automatic SMS & WhatsApp receipt confirmations are dispatched instantly.",
        "Receipts can be printed directly in Thermal 80mm or A4 layout."
      ]
    },
    {
      title: "2. Setting Up Fee Structures & Groups",
      desc: "Configure Fee Groups (e.g., Nursery-UKG, Primary, High School) and associate specific Fee Types like Tuition Fee, Transport, Computer Lab, and Library.",
      actionText: "Manage Fee Groups",
      actionPath: "/finance/groups",
      icon: Wallet,
      color: "from-indigo-500 to-violet-600",
      tips: [
        "Create standard fee types in Fee Types before grouping them.",
        "Assign fee groups to entire classes or individual students with 1 click.",
        "Configure custom sibling and merit discount slabs."
      ]
    },
    {
      title: "3. Searching Dues & Generating Demand Slips",
      desc: "Quickly identify outstanding unpaid fees across any class or section, print Batch Due Slips, and track carry-forward arrears.",
      actionText: "Search Due Fees",
      actionPath: "/finance/search-due-fees",
      icon: FileSearch,
      color: "from-amber-500 to-orange-600",
      tips: [
        "Filter by class, section, or fee group to export CSV rosters.",
        "Generate and distribute monthly fee challans for bank deposits.",
        "Monitor carry-forward balances across academic year rollovers."
      ]
    },
    {
      title: "4. Audit Trail & Financial Reports",
      desc: "Comprehensive transaction history, online payment gateway reconciliations, and tamper-evident fee collection audit trails.",
      actionText: "View All Transactions",
      actionPath: "/finance/transactions",
      icon: Landmark,
      color: "from-blue-500 to-cyan-600",
      tips: [
        "Reconcile daily counter cash with the Cash-in-Hand report.",
        "Review deleted or revised receipts in the Fee Data Audit module.",
        "Export audited statement for statutory chartered accountants."
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto min-h-screen bg-[#f8fafc] font-sans">
      <FinanceTabs />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Finance & Fee Operations Guide</h1>
              <p className="text-xs text-slate-500">Standard operating procedures, best practices, and fast shortcuts for fee clerks and accountants.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/finance/dashboard')}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Fee Dashboard
            </button>
            <button 
              onClick={() => navigate('/finance/collect')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              + Collect Fee
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
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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

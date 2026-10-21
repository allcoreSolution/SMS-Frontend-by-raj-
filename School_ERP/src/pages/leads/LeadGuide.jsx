import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Columns, Bell, Layers, Book, CheckCircle, 
  Smartphone, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Zap
} from 'lucide-react';
import LeadHeader from './LeadHeader';

const LeadGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <LeadHeader activeTab="guide" />

      <div className="p-6 sm:p-8 w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Title Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5F52FF]">
            <Book className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-850 tracking-tight">Lead Management Guidebook</h2>
            <p className="text-xs text-slate-500 font-medium">Standard operating procedures for managing inquiries & maximizing student conversion</p>
          </div>
        </div>

        {/* Card 1: Pipeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-100">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-850">1. Master the Pipeline Board</h3>
                <p className="text-xs text-slate-500">Visual Kanban flow from enquiry arrival to admission</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-600 leading-relaxed space-y-3">
              <p>
                The Pipeline Board is your admission control center. Instead of sorting through spreadsheets or physical ledgers, you drag and drop candidate enquiries across customizable stages (e.g., <strong>New Enquiry</strong> &rarr; <strong>Contacted</strong> &rarr; <strong>Application Received</strong>).
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700 font-medium">
                <li><strong className="text-slate-900">Drag & Drop:</strong> Easily grab cards and move them into the next column as conversations progress.</li>
                <li><strong className="text-slate-900">One-Click Contact:</strong> Click the phone or WhatsApp icons on cards to initiate quick calls without dialing manually.</li>
                <li><strong className="text-slate-900">Retain Lost Reasons:</strong> If a family moves away or declines, drag them to <em>"Lost / Rejected"</em> instead of deleting. This preserves demographic conversion data for future marketing analysis.</li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => navigate('/leads/pipeline')}
                className="px-4 py-2 bg-[#5F52FF] hover:bg-[#4E41E6] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
              >
                Go to Pipeline Board <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Follow-ups */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-100">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-850">2. Track Every Follow-Up Task</h3>
                <p className="text-xs text-slate-500">Never let a prospective student fall through the cracks</p>
              </div>
            </div>
            
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-900 font-semibold mb-4 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-[#5F52FF] shrink-0 mt-0.5" />
              <span>
                <strong>Golden Rule:</strong> Inquiries contacted within 24 hours of arrival are 400% more likely to enroll. Set a designated follow-up reminder for every active inquiry so today's critical tasks stay front and center.
              </span>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-3">
              <p>Key follow-up action types supported:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-bold">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-800">Phone Calls</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-800">Campus Tours</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-800">Counselling Visits</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-800">Fee Breakdowns</div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => navigate('/leads/follow-ups')}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                Open Follow-up Inbox <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: 1-Click Admit */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-100">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-850">3. 1-Click Seamless Student Admission</h3>
                <p className="text-xs text-slate-500">Zero re-typing transition from Lead to Enrolled Student</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-600 leading-relaxed space-y-3">
              <p>
                Once a candidate clears documents verification or parent counselling, clicking <strong>"1-Click Admit & Enroll"</strong> automatically carries their student profile, guardian details, and verified documents into the central ERP roster.
              </p>
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-900 space-y-1.5 font-medium">
                <div className="flex items-center gap-2 font-bold"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Automated Provisioning:</div>
                <p className="text-[11px]">&bull; Creates institutional student record and assigns roll number.</p>
                <p className="text-[11px]">&bull; Generates parent & student portal mobile login credentials.</p>
                <p className="text-[11px]">&bull; Posts admission fee challan directly to finance collection.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                type="button"
                onClick={() => navigate('/leads/pipeline')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" /> Try Pipeline Board Now
              </button>
              <button 
                type="button"
                onClick={() => navigate('/front-office/admission-enquiries')}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#5F52FF]" /> Front Office Enquiries
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeadGuide;

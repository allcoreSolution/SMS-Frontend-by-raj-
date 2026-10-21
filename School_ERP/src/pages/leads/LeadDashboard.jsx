import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, BarChart2, Users, Bell, Layers, Book, Columns, Edit3, 
  Settings, UserPlus, FileText, Smartphone, CheckCircle, Search, LayoutDashboard,
  ArrowRight, Phone, Sparkles, Filter, CheckCircle2, ChevronRight
} from 'lucide-react';
import LeadHeader from './LeadHeader';
import LeadDetailsModal from './LeadDetailsModal';
import NewLeadModal from './NewLeadModal';
import leadService from '../../api/leadService';

const LeadDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes] = await Promise.all([
        leadService.getStats(),
        leadService.getLeads()
      ]);

      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }
      if (leadsRes && leadsRes.data) {
        setRecentLeads(leadsRes.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load lead dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const total = stats?.total ?? recentLeads.length;
  const converted = stats?.converted ?? 0;
  const conversionRate = stats?.conversionRate ?? 0;
  const openLeads = stats?.open ?? 0;
  const newThisMonth = stats?.newThisMonth ?? recentLeads.length;

  const funnelStages = [
    { name: 'New Enquiry', color: 'bg-slate-500', barBg: 'bg-slate-500' },
    { name: 'Contacted / Qualified', color: 'bg-blue-500', barBg: 'bg-blue-500' },
    { name: 'Application Received', color: 'bg-purple-500', barBg: 'bg-purple-500' },
    { name: 'Document Verification', color: 'bg-fuchsia-500', barBg: 'bg-fuchsia-500' },
    { name: 'Entrance Test', color: 'bg-amber-500', barBg: 'bg-amber-500' },
    { name: 'Counselling / Interview', color: 'bg-pink-500', barBg: 'bg-pink-500' },
    { name: 'Offer / Selected', color: 'bg-cyan-500', barBg: 'bg-cyan-500' },
    { name: 'Enrolled', color: 'bg-emerald-500', barBg: 'bg-emerald-500' },
    { name: 'Lost / Rejected', color: 'bg-rose-500', barBg: 'bg-rose-500' },
  ];

  // Count leads per stage
  const stageCounts = stats?.stageCounts || {};
  const sourceCounts = stats?.sourceCounts || {};

  // Step counts for 4-step guide
  const step1Count = stageCounts['New Enquiry'] || 0;
  const step2Count = (stageCounts['Contacted / Qualified'] || 0) + (stageCounts['Application Received'] || 0);
  const step3Count = (stageCounts['Document Verification'] || 0) + (stageCounts['Entrance Test'] || 0) + (stageCounts['Counselling / Interview'] || 0);
  const step4Count = (stageCounts['Offer / Selected'] || 0) + (stageCounts['Enrolled'] || 0);

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <LeadHeader 
        activeTab="dashboard" 
        onLeadCreated={fetchDashboardData}
        stats={stats}
        onRefresh={fetchDashboardData}
      />

      <div className="p-6 sm:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-[#5F52FF]/15 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#5F52FF]"></div>
              </div> 
              Total Inquiries
            </h3>
            <p className="text-2xl sm:text-3xl font-black text-slate-850 mt-2">{total}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Across all campaigns</p>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div> 
              Enrolled (Won)
            </h3>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{converted}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Converted to students</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div> 
              Conversion Rate
            </h3>
            <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">{conversionRate}%</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Enquiry to admission</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div> 
              Open Pipeline
            </h3>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{openLeads}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Actively being worked</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-4 h-4 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                </div> 
                New This Month
              </h3>
              <p className="text-2xl sm:text-3xl font-black text-purple-600 mt-2">{newThisMonth}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/leads/pipeline')}
              className="mt-2 text-[11px] font-bold text-[#5F52FF] hover:underline flex items-center gap-1"
            >
              Go to Pipeline <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Charts & Sources Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Admission Funnel */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#5F52FF]" /> Admission Pipeline Funnel
              </h2>
              <button
                type="button"
                onClick={() => navigate('/leads/pipeline')}
                className="text-xs font-bold text-[#5F52FF] hover:underline flex items-center gap-1"
              >
                Work Pipeline <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-5 sm:p-6 space-y-3.5">
              {funnelStages.map((stage, i) => {
                const count = stageCounts[stage.name] || 0;
                const percent = total > 0 ? Math.round((count / total) * 100) : 0;

                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-40 sm:w-44 flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`}></div>
                      <span className="truncate">{stage.name}</span>
                    </div>

                    <div className="flex-1 bg-slate-100 rounded-xl h-6 relative overflow-hidden flex items-center px-2.5">
                      <div 
                        className={`absolute top-0 left-0 h-full ${stage.barBg} transition-all duration-500 rounded-l-xl ${count === total && total > 0 ? 'rounded-r-xl' : ''}`} 
                        style={{ width: `${Math.max(percent, count > 0 ? 8 : 0)}%` }}
                      ></div>
                      <span className="relative text-[11px] font-black text-white z-10 drop-shadow-xs">
                        {count > 0 ? count : ''}
                      </span>
                    </div>

                    <div className="w-12 text-right text-xs font-bold text-slate-400 shrink-0">
                      {percent}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Sources Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#5F52FF]" /> Lead Sources
              </h2>
              <button
                type="button"
                onClick={() => navigate('/leads/sources-stages')}
                className="text-xs font-bold text-[#5F52FF] hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {Object.keys(sourceCounts).length > 0 ? (
                  Object.entries(sourceCounts).map(([src, count], idx) => {
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">{src}</span>
                          <span className="font-extrabold text-[#5F52FF]">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#5F52FF] to-indigo-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No lead sources recorded yet.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Top performing channel:</span>
                  <strong className="text-slate-800">
                    {Object.keys(sourceCounts)[0] || 'Website'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Inquiries Quick Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5F52FF]" /> Recent Inquiries
            </h2>
            <button
              type="button"
              onClick={() => navigate('/leads/all')}
              className="text-xs font-bold text-[#5F52FF] hover:underline flex items-center gap-1"
            >
              View All ({recentLeads.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Parent Phone</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <tr 
                    key={lead._id || lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {lead.studentName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      {lead.targetClass || lead.cls || lead.class}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {lead.contactNumber || lead.phone}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-[#5F52FF] font-bold text-[10px]">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {lead.stage || lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {lead.contactNumber && (
                        <a
                          href={`tel:${lead.contactNumber}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4-Step Journey Guide Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#5F52FF]" /> From Enquiry to Admitted Student
            </h2>
            <button 
              type="button"
              onClick={() => navigate('/leads/guide')}
              className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 transition"
            >
              <Book className="w-3.5 h-3.5 text-[#5F52FF]" /> Read the full guide
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Every enquiry is captured once and travels this path. Nothing is re-typed on the way — the child is admitted from what was already collected.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="text-[10px] font-black text-slate-400 mb-2 tracking-wider">STEP 1</div>
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center mb-3">
                  <UserPlus className="w-4 h-4 text-slate-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  Enquiries Arrive 
                  <span className="bg-indigo-100 text-[#5F52FF] text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {step1Count} here
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  Captured through website, walk-ins, phone or advertisements into one centralized dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/leads/all')}
                  className="text-[11px] font-bold text-[#5F52FF] hover:underline flex items-center gap-1"
                >
                  View inquiries <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <div className="text-[10px] font-black text-indigo-400 mb-2 tracking-wider">STEP 2</div>
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-indigo-200 flex items-center justify-center mb-3">
                  <LayoutDashboard className="w-4 h-4 text-[#5F52FF]" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  You Work the Lead 
                  <span className="bg-indigo-100 text-[#5F52FF] text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {step2Count} here
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  Drag cards across stages, log calls, WhatsApp follow-ups, and campus visit tasks.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/leads/pipeline')}
                  className="text-[11px] font-bold text-[#5F52FF] hover:underline flex items-center gap-1"
                >
                  Open pipeline <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="text-[10px] font-black text-purple-400 mb-2 tracking-wider">STEP 3</div>
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-purple-200 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  Application Fills Up 
                  <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {step3Count} here
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  Documents verified, entrance test scores recorded, and counselling recommendation added.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/leads/sources-stages')}
                  className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1"
                >
                  Configure stages <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="text-[10px] font-black text-emerald-400 mb-2 tracking-wider">STEP 4</div>
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-emerald-200 flex items-center justify-center mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  One-Click Admit 
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {step4Count} here
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  When ready, confirm section & roll no. The child becomes an official student instantly.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/leads/pipeline')}
                  className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  Try in Pipeline <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* What One-Click Creates Highlight */}
            <div className="border border-emerald-200 bg-emerald-50/70 rounded-2xl p-4.5">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" /> 
                One-Click Admission seamlessly provisions:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-semibold text-emerald-800">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Student Profile</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Class Roster</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Parent Portal Login</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Verified Documents</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Fee Category Assigned</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Admission Challan</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> SMS / Email Notice</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Sibling Auto-link</div>
              </div>
            </div>

          </div>

          {/* Quick Nav Footer Bar */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap gap-3">
            <button 
              type="button"
              onClick={() => navigate('/leads/pipeline')}
              className="bg-[#5F52FF] hover:bg-[#4E41E6] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-2 transition"
            >
              <Columns className="w-4 h-4" /> Open Pipeline Board
            </button>
            <button 
              type="button"
              onClick={() => navigate('/leads/all')}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition"
            >
              <Search className="w-4 h-4 text-slate-500" /> All Leads Directory
            </button>
            <button 
              type="button"
              onClick={() => navigate('/leads/follow-ups')}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition"
            >
              <Bell className="w-4 h-4 text-slate-500" /> Follow-ups Inbox
            </button>
            <button 
              type="button"
              onClick={() => navigate('/leads/sources-stages')}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-2 transition"
            >
              <Settings className="w-4 h-4 text-slate-500" /> Configure Stages & Sources
            </button>
          </div>
        </div>

      </div>

      {/* Details Modal */}
      <LeadDetailsModal 
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        onLeadUpdated={fetchDashboardData}
        onLeadDeleted={fetchDashboardData}
      />

    </div>
  );
};

export default LeadDashboard;

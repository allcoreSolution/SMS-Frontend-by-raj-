import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, Phone, Mail, MoreHorizontal, Download, 
  Trash2, Edit3, CheckCircle, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import LeadHeader from './LeadHeader';
import LeadDetailsModal from './LeadDetailsModal';
import NewLeadModal from './NewLeadModal';
import leadService from '../../api/leadService';

const STAGE_COLORS = {
  'New Enquiry': 'bg-slate-100 text-slate-700 border-slate-200',
  'Contacted / Qualified': 'bg-blue-100 text-blue-700 border-blue-200',
  'Application Received': 'bg-purple-100 text-purple-700 border-purple-200',
  'Document Verification': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'Entrance Test': 'bg-amber-100 text-amber-700 border-amber-200',
  'Counselling / Interview': 'bg-pink-100 text-pink-700 border-pink-200',
  'Offer / Selected': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Enrolled': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Lost / Rejected': 'bg-rose-100 text-rose-700 border-rose-200',
};

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');

  const [selectedLead, setSelectedLead] = useState(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadService.getLeads();
      if (res && res.data) {
        setLeads(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const student = (lead.studentName || '').toLowerCase();
    const parent = (lead.parentName || lead.guardian || '').toLowerCase();
    const phone = (lead.contactNumber || lead.phone || '').toLowerCase();
    const email = (lead.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesQuery = !query || student.includes(query) || parent.includes(query) || phone.includes(query) || email.includes(query);
    const matchesStage = stageFilter === 'All' || (lead.stage || lead.status) === stageFilter;
    const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
    const matchesClass = classFilter === 'All' || (lead.targetClass || lead.cls || lead.class) === classFilter;

    return matchesQuery && matchesStage && matchesSource && matchesClass;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleStageChange = async (leadId, newStage) => {
    try {
      setLeads(prev => prev.map(l => (l._id === leadId ? { ...l, stage: newStage, status: newStage } : l)));
      await leadService.updateLead(leadId, { stage: newStage, status: newStage });
    } catch (err) {
      console.error('Failed to change stage:', err);
      fetchLeads();
    }
  };

  const handleConvertLead = async (lead) => {
    if (!window.confirm(`Convert candidate ${lead.studentName} to an Admitted Student?`)) return;
    try {
      const res = await leadService.convertLead(lead._id);
      if (res && res.data) {
        setLeads(prev => prev.map(l => l._id === lead._id ? res.data : l));
        alert(`${lead.studentName} admitted successfully!`);
      }
    } catch (err) {
      console.error('Convert failed:', err);
    }
  };

  const handleDeleteLead = async (leadId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete lead: ${studentName}?`)) return;
    try {
      await leadService.deleteLead(leadId);
      setLeads(prev => prev.filter(l => l._id !== leadId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Student Name', 'Parent Name', 'Class', 'Phone', 'Email', 'Source', 'Stage', 'Score'];
    const rows = filteredLeads.map(l => [
      `"${l.studentName || ''}"`,
      `"${l.parentName || l.guardian || ''}"`,
      `"${l.targetClass || l.cls || l.class || ''}"`,
      `"${l.contactNumber || l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.source || ''}"`,
      `"${l.stage || l.status || ''}"`,
      `"${l.score || 50}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics summary
  const totalCount = leads.length;
  const enrolledCount = leads.filter(l => (l.stage === 'Enrolled' || l.status === 'Enrolled')).length;
  const openCount = totalCount - enrolledCount - leads.filter(l => (l.stage === 'Lost / Rejected' || l.status === 'Lost / Rejected')).length;
  const conversionRate = totalCount > 0 ? Math.round((enrolledCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-y-auto">
      
      {/* Header */}
      <LeadHeader 
        activeTab="all" 
        onLeadCreated={(newLead) => setLeads(prev => [newLead, ...prev])}
        stats={{ total: leads.length }}
        onRefresh={fetchLeads}
      />

      <div className="p-6 sm:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* KPI Mini Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Inquiries</span>
            <div className="text-2xl font-black text-slate-800 mt-1">{totalCount}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Active Pipeline</span>
            <div className="text-2xl font-black text-[#5F52FF] mt-1">{openCount}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Enrolled Students</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{enrolledCount}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Conversion Rate</span>
            <div className="text-2xl font-black text-indigo-700 mt-1">{conversionRate}%</div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
          
          {/* Table Filters & Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-3 flex-1 min-w-[280px] max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads by name, phone, parent or email..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20 focus:border-[#5F52FF] bg-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Stage Filter */}
              <select
                value={stageFilter}
                onChange={(e) => { setStageFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20"
              >
                <option value="All">All Stages</option>
                <option value="New Enquiry">New Enquiry</option>
                <option value="Contacted / Qualified">Contacted / Qualified</option>
                <option value="Application Received">Application Received</option>
                <option value="Document Verification">Document Verification</option>
                <option value="Entrance Test">Entrance Test</option>
                <option value="Counselling / Interview">Counselling / Interview</option>
                <option value="Offer / Selected">Offer / Selected</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Lost / Rejected">Lost / Rejected</option>
              </select>

              {/* Source Filter */}
              <select
                value={sourceFilter}
                onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20"
              >
                <option value="All">All Sources</option>
                <option value="Website">Website</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Facebook">Facebook</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Referral">Referral</option>
                <option value="Phone">Phone</option>
              </select>

              {/* Export Button */}
              <button
                type="button"
                onClick={exportCSV}
                className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
                title="Export as CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Parent / Contact</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead) => {
                    const currentStage = lead.stage || lead.status || 'New Enquiry';
                    const cleanPhone = (lead.contactNumber || lead.phone || '').replace(/[^0-9]/g, '');

                    return (
                      <tr 
                        key={lead._id || lead.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => setSelectedLead(lead)}
                      >
                        {/* Candidate Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5F52FF]/20 to-indigo-100 text-[#5F52FF] font-bold flex items-center justify-center text-xs shrink-0">
                              {(lead.studentName || 'L')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 group-hover:text-[#5F52FF] transition text-[13px]">
                                {lead.studentName}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Added {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recently'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Class */}
                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                            {lead.targetClass || lead.cls || lead.class || 'N/A'}
                          </span>
                        </td>

                        {/* Parent & Phone */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">
                            {lead.parentName || lead.guardian || 'Guardian'}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{lead.contactNumber || lead.phone || 'No phone'}</span>
                          </div>
                        </td>

                        {/* Source */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-[#5F52FF] font-bold text-[11px] border border-indigo-100">
                            {lead.source || 'Website'}
                          </span>
                        </td>

                        {/* Stage Selector Inline */}
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={currentStage}
                            onChange={(e) => handleStageChange(lead._id, e.target.value)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20 ${
                              STAGE_COLORS[currentStage] || 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="New Enquiry">New Enquiry</option>
                            <option value="Contacted / Qualified">Contacted / Qualified</option>
                            <option value="Application Received">Application Received</option>
                            <option value="Document Verification">Document Verification</option>
                            <option value="Entrance Test">Entrance Test</option>
                            <option value="Counselling / Interview">Counselling / Interview</option>
                            <option value="Offer / Selected">Offer / Selected</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Lost / Rejected">Lost / Rejected</option>
                          </select>
                        </td>

                        {/* Score */}
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                            (lead.score || 50) >= 80 ? 'bg-emerald-50 text-emerald-700' :
                            (lead.score || 50) >= 60 ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {lead.score || 50}%
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {lead.contactNumber && (
                              <a
                                href={`tel:${lead.contactNumber}`}
                                title={`Call ${lead.studentName}`}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {currentStage !== 'Enrolled' && (
                              <button
                                type="button"
                                onClick={() => handleConvertLead(lead)}
                                title="1-Click Admit & Enroll"
                                className="p-1.5 rounded-lg bg-indigo-50 text-[#5F52FF] hover:bg-indigo-100 transition"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedLead(lead)}
                              title="Edit / View Details"
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead._id, lead.studentName)}
                              title="Delete Lead"
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Users className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-semibold text-xs text-slate-600">No leads match your criteria</p>
                        <p className="text-[11px] text-slate-400">Try modifying your search or filter settings.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/30">
            <div>
              Showing <strong className="text-slate-800">{filteredLeads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
              <strong className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</strong> of{' '}
              <strong className="text-slate-800">{filteredLeads.length}</strong> leads
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                    currentPage === i + 1
                      ? 'bg-[#5F52FF] text-white shadow-2xs'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Lead Details Modal */}
      <LeadDetailsModal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        onLeadUpdated={(updated) => setLeads(prev => prev.map(l => l._id === updated._id ? updated : l))}
        onLeadDeleted={(deletedId) => setLeads(prev => prev.filter(l => l._id !== deletedId))}
      />

    </div>
  );
};

export default AllLeads;

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Book, Phone, Mail, User, ChevronRight, ChevronLeft, 
  Sparkles, CheckCircle, Calendar, MessageSquare, AlertCircle, ArrowRight
} from 'lucide-react';
import LeadHeader from './LeadHeader';
import LeadDetailsModal from './LeadDetailsModal';
import NewLeadModal from './NewLeadModal';
import leadService from '../../api/leadService';

const DEFAULT_STAGES = [
  { id: 'New Enquiry', name: 'New Enquiry', color: 'bg-slate-500', headerBg: 'border-slate-400' },
  { id: 'Contacted / Qualified', name: 'Contacted / Qualified', color: 'bg-blue-500', headerBg: 'border-blue-400' },
  { id: 'Application Received', name: 'Application Received', color: 'bg-purple-500', headerBg: 'border-purple-400' },
  { id: 'Document Verification', name: 'Document Verification', color: 'bg-fuchsia-500', headerBg: 'border-fuchsia-400' },
  { id: 'Entrance Test', name: 'Entrance Test', color: 'bg-amber-500', headerBg: 'border-amber-400' },
  { id: 'Counselling / Interview', name: 'Counselling / Interview', color: 'bg-pink-500', headerBg: 'border-pink-400' },
  { id: 'Offer / Selected', name: 'Offer / Selected', color: 'bg-cyan-500', headerBg: 'border-cyan-400' },
  { id: 'Enrolled', name: 'Enrolled (Won)', color: 'bg-emerald-500', headerBg: 'border-emerald-400' },
  { id: 'Lost / Rejected', name: 'Lost / Rejected', color: 'bg-rose-500', headerBg: 'border-rose-400' }
];

const PipelineBoard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [newLeadStage, setNewLeadStage] = useState('New Enquiry');
  const [draggedLeadId, setDraggedLeadId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

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

  // Filter leads by search and class
  const filteredLeads = leads.filter(lead => {
    const student = (lead.studentName || '').toLowerCase();
    const parent = (lead.parentName || lead.guardian || '').toLowerCase();
    const phone = (lead.contactNumber || lead.phone || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesQuery = !query || student.includes(query) || parent.includes(query) || phone.includes(query);
    const matchesClass = selectedClass === 'All' || (lead.targetClass || lead.cls || lead.class) === selectedClass;

    return matchesQuery && matchesClass;
  });

  // Drag and Drop handlers
  const handleDragStart = (e, leadId) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (!leadId) return;

    // Optimistically update
    const targetLead = leads.find(l => l._id === leadId || l.id === leadId);
    if (!targetLead || (targetLead.stage || targetLead.status) === targetStage) return;

    setLeads(prev => prev.map(l => {
      if (l._id === leadId || l.id === leadId) {
        return { ...l, stage: targetStage, status: targetStage };
      }
      return l;
    }));

    try {
      await leadService.updateLead(leadId, { stage: targetStage, status: targetStage });
    } catch (err) {
      console.error('Failed to move stage:', err);
      fetchLeads(); // rollback on failure
    } finally {
      setDraggedLeadId(null);
    }
  };

  // Move stage via button
  const moveLeadStage = async (lead, direction) => {
    const currentStageName = lead.stage || lead.status || 'New Enquiry';
    const currentIndex = DEFAULT_STAGES.findIndex(s => s.id === currentStageName);
    if (currentIndex === -1) return;

    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= DEFAULT_STAGES.length) return;

    const newStage = DEFAULT_STAGES[newIndex].id;

    setLeads(prev => prev.map(l => {
      if (l._id === lead._id) {
        return { ...l, stage: newStage, status: newStage };
      }
      return l;
    }));

    try {
      await leadService.updateLead(lead._id, { stage: newStage, status: newStage });
    } catch (err) {
      console.error('Failed to move stage:', err);
      fetchLeads();
    }
  };

  const handleLeadCreated = (newLead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  const handleLeadUpdated = (updatedLead) => {
    setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l));
    if (selectedLead && selectedLead._id === updatedLead._id) {
      setSelectedLead(updatedLead);
    }
  };

  const handleLeadDeleted = (deletedId) => {
    setLeads(prev => prev.filter(l => l._id !== deletedId));
    setSelectedLead(null);
  };

  const openNewLeadAtStage = (stageName) => {
    setNewLeadStage(stageName);
    setIsNewLeadOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f6f8] overflow-hidden">
      
      {/* Header */}
      <LeadHeader 
        activeTab="pipeline" 
        onLeadCreated={handleLeadCreated}
        stats={{ total: leads.length }}
        onRefresh={fetchLeads}
      />

      {/* Filter & Search Bar */}
      <div className="px-6 sm:px-8 py-3 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, parent, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20 focus:border-[#5F52FF] bg-slate-50/50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-2.5 py-1 text-xs font-bold border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5F52FF]/20 text-slate-700"
            >
              <option value="All">All Classes ({leads.length})</option>
              {['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 9', 'Grade 10'].map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            Showing <strong className="text-slate-800">{filteredLeads.length}</strong> leads
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 select-none bg-slate-100/60">
        <div className="flex gap-4.5 h-full min-w-max pb-2">
          {DEFAULT_STAGES.map((col, index) => {
            const colLeads = filteredLeads.filter(l => (l.stage || l.status) === col.id);
            const isDropTarget = dragOverStage === col.id;

            return (
              <div 
                key={col.id} 
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-76 sm:w-80 shrink-0 flex flex-col h-full rounded-2xl transition-all duration-200 border ${
                  isDropTarget 
                    ? 'border-[#5F52FF] bg-indigo-50/50 shadow-md ring-2 ring-[#5F52FF]/20' 
                    : 'border-slate-200/80 bg-slate-50 shadow-2xs'
                }`}
              >
                {/* Column Header */}
                <div className={`p-3.5 bg-white rounded-t-2xl border-b border-slate-200 flex justify-between items-center shrink-0 border-t-3 ${col.headerBg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                    <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                      {col.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {colLeads.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => openNewLeadAtStage(col.id)}
                      title={`Add lead to ${col.name}`}
                      className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Column Body / Cards List */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {colLeads.length > 0 ? (
                    colLeads.map(lead => {
                      const isDraggingThis = draggedLeadId === lead._id;
                      const cleanPhone = (lead.contactNumber || lead.phone || '').replace(/[^0-9]/g, '');

                      return (
                        <div
                          key={lead._id || lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead._id || lead.id)}
                          onClick={() => setSelectedLead(lead)}
                          className={`bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer relative group ${
                            isDraggingThis ? 'opacity-40 scale-95 border-dashed border-[#5F52FF]' : ''
                          }`}
                        >
                          {/* Card Top: Student Name & Score */}
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <h4 className="font-bold text-xs sm:text-[13px] text-slate-800 group-hover:text-[#5F52FF] transition flex items-center gap-1.5">
                              {lead.studentName}
                            </h4>
                            {lead.score && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md shrink-0 ${
                                lead.score >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                lead.score >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {lead.score}%
                              </span>
                            )}
                          </div>

                          {/* Guardian & Target Class */}
                          <div className="text-[11px] text-slate-500 font-medium mb-2.5 flex items-center gap-2">
                            <span>Guardian: <strong className="text-slate-700">{lead.parentName || lead.guardian || 'Parent'}</strong></span>
                            <span>·</span>
                            <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                              {lead.targetClass || lead.cls || lead.class}
                            </span>
                          </div>

                          {/* Contact Info & Source */}
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                            <div className="flex items-center gap-2 text-slate-600 font-semibold">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                                {lead.source || 'Website'}
                              </span>
                            </div>

                            {/* Action icons */}
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {lead.contactNumber && (
                                <a
                                  href={`tel:${lead.contactNumber}`}
                                  title="Call"
                                  className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                              )}
                              
                              {/* Stage shifter arrows */}
                              {index > 0 && (
                                <button
                                  type="button"
                                  title="Move to previous stage"
                                  onClick={() => moveLeadStage(lead, -1)}
                                  className="w-5 h-5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {index < DEFAULT_STAGES.length - 1 && (
                                <button
                                  type="button"
                                  title="Move to next stage"
                                  onClick={() => moveLeadStage(lead, 1)}
                                  className="w-5 h-5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Follow-up reminder pill if present */}
                          {lead.followUpDate && (
                            <div className="mt-2 text-[10px] text-indigo-700 bg-indigo-50/70 p-1 rounded-lg flex items-center gap-1 font-semibold">
                              <Calendar className="w-3 h-3 text-[#5F52FF]" />
                              <span>{lead.followUpTitle || 'Follow-up'}: {new Date(lead.followUpDate).toLocaleDateString()}</span>
                            </div>
                          )}

                        </div>
                      );
                    })
                  ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-xl bg-white/50">
                      <p className="text-xs text-slate-400 font-medium mb-2">No leads in this stage</p>
                      <button
                        type="button"
                        onClick={() => openNewLeadAtStage(col.id)}
                        className="text-[11px] font-bold text-[#5F52FF] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Lead Here
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Details Modal */}
      <LeadDetailsModal 
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        onLeadUpdated={handleLeadUpdated}
        onLeadDeleted={handleLeadDeleted}
      />

      {/* New Lead Modal */}
      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        defaultStage={newLeadStage}
        onLeadCreated={handleLeadCreated}
      />

    </div>
  );
};

export default PipelineBoard;

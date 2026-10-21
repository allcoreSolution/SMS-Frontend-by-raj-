import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Edit, Trash2, Eye, X, Phone, Mail, 
  ArrowRight, ArrowLeft, MoveRight, User, Calendar, 
  RefreshCw, Kanban, LayoutDashboard, Tag, Filter, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { accountantService } from '../api/accountantService';

const PIPELINE_COLUMNS = [
  { id: 'New', title: 'New Leads', color: 'border-t-[#f39c12]', badgeColor: 'bg-[#f39c12] text-white', accent: '#f39c12' },
  { id: 'Following Up', title: 'Following Up', color: 'border-t-[#3c8dbc]', badgeColor: 'bg-[#3c8dbc] text-white', accent: '#3c8dbc' },
  { id: 'Application Sent', title: 'Application Sent', color: 'border-t-[#605ca8]', badgeColor: 'bg-[#605ca8] text-white', accent: '#605ca8' },
  { id: 'Converted', title: 'Converted', color: 'border-t-[#00a65a]', badgeColor: 'bg-[#00a65a] text-white', accent: '#00a65a' },
];

const STAGE_ORDER = ['New', 'Following Up', 'Application Sent', 'Converted'];

const LeadPipeline = () => {
  const [leads, setLeads] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeLead, setActiveLead] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    phone: '',
    email: '',
    source: 'Direct Enquiry',
    status: 'New',
    grade: 'Class 1',
    priority: 'Medium',
    assignedTo: 'Admission Desk',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  };
  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsRes, sourcesRes] = await Promise.all([
        accountantService.getLeads(),
        accountantService.getLeadSources(),
      ]);
      if (leadsRes.success) setLeads(leadsRes.data || []);
      if (sourcesRes.success) setSources(sourcesRes.data || []);
    } catch (err) {
      console.error('Error loading pipeline data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.phone && item.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.grade && item.grade.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSource =
        selectedSource === 'All' || (item.source || '').toLowerCase() === selectedSource.toLowerCase();

      return matchesSearch && matchesSource;
    });
  }, [leads, searchQuery, selectedSource]);

  // Handle stage move (Next / Previous)
  const handleMoveStage = async (lead, direction) => {
    const currentIndex = STAGE_ORDER.indexOf(lead.status);
    if (currentIndex === -1) return;

    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= STAGE_ORDER.length) return;

    const nextStatus = STAGE_ORDER[nextIndex];
    const res = await accountantService.updateLeadStatus(lead.id, nextStatus);
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l))
      );
      if (activeLead && activeLead.id === lead.id) {
        setActiveLead((prev) => ({ ...prev, status: nextStatus }));
      }
    }
  };

  // Move directly to target stage
  const handleDirectMove = async (leadId, targetStage) => {
    const res = await accountantService.updateLeadStatus(leadId, targetStage);
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: targetStage } : l))
      );
    }
  };

  // Open Add modal with preset status
  const handleOpenAddForStage = (stageId = 'New') => {
    setFormData({
      ...initialForm,
      status: stageId,
      source: sources[0]?.name || 'Direct Enquiry',
    });
    setShowAddModal(true);
  };

  // Open Edit modal
  const handleOpenEdit = (lead) => {
    setActiveLead(lead);
    setFormData({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      source: lead.source || (sources[0]?.name || 'Direct Enquiry'),
      status: lead.status || 'New',
      grade: lead.grade || 'Class 1',
      priority: lead.priority || 'Medium',
      assignedTo: lead.assignedTo || 'Admission Desk',
      notes: lead.notes || '',
      date: lead.date || new Date().toISOString().split('T')[0],
    });
    setShowEditModal(true);
  };

  // Open View modal
  const handleOpenView = (lead) => {
    setActiveLead(lead);
    setShowViewModal(true);
  };

  // Save Add
  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required Field', text: 'Please enter lead name.' });
      return;
    }
    const res = await accountantService.addLead(formData);
    if (res.success) {
      setShowAddModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Lead Added!',
        text: `Created pipeline card for "${formData.name}".`,
        timer: 1600,
        showConfirmButton: false,
      });
      loadData();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to add card.' });
    }
  };

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required Field', text: 'Please enter lead name.' });
      return;
    }
    const res = await accountantService.updateLead(activeLead.id, formData);
    if (res.success) {
      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Lead card has been updated.',
        timer: 1600,
        showConfirmButton: false,
      });
      loadData();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to update.' });
    }
  };

  // Delete card
  const handleDelete = (lead) => {
    Swal.fire({
      title: 'Remove Card?',
      text: `Delete inquiry card for "${lead.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd4b39',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await accountantService.deleteLead(lead.id);
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            timer: 1400,
            showConfirmButton: false,
          });
          loadData();
          if (showViewModal) setShowViewModal(false);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#333]">Lead Pipeline Board</h1>
            <span className="bg-[#605ca8]/10 text-[#605ca8] text-xs font-semibold px-2 py-0.5 rounded">
              Kanban View
            </span>
          </div>
          <p className="text-[13px] text-gray-500">
            Track inquiries through admission stages and transition them forward.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/leads/dashboard"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition"
          >
            <LayoutDashboard className="w-4 h-4 text-[#3c8dbc]" /> Table View
          </Link>
          <Link
            to="/leads/sources"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition"
          >
            <Tag className="w-4 h-4 text-[#00a65a]" /> Sources
          </Link>
          <button
            onClick={() => handleOpenAddForStage('New')}
            className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-1.5 rounded-[3px] text-[13px] font-semibold flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Lead Card
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-grow max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search cards by name, grade, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Filter className="w-3.5 h-3.5 text-gray-400" /> Source:
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="border border-gray-200 rounded px-2 py-1 text-xs bg-white text-[#333] focus:outline-none focus:border-[#3c8dbc]"
            >
              <option value="All">All Sources</option>
              {sources.map((s) => (
                <option key={s.id || s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadData}
            title="Refresh Board"
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 p-1.5 rounded-[3px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {PIPELINE_COLUMNS.map((col, colIdx) => {
          const colCards = filteredLeads.filter(
            (l) => (l.status || '').toLowerCase() === col.id.toLowerCase()
          );

          return (
            <div
              key={col.id}
              className={`bg-[#f9fafc] rounded-[3px] border border-gray-200 border-t-[3px] ${col.color} flex flex-col shadow-sm min-h-[500px] max-h-[80vh] overflow-hidden`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-gray-200 font-bold text-[14px] text-[#444] bg-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <span>{col.title}</span>
                  <span className="text-xs font-semibold px-2 py-0.2 rounded-full bg-gray-100 text-gray-600">
                    {colCards.length}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenAddForStage(col.id)}
                  title={`Add Card to ${col.title}`}
                  className="p-1 hover:bg-gray-100 text-gray-500 hover:text-[#3c8dbc] rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Cards Scroll Area */}
              <div className="p-2.5 flex-grow overflow-y-auto space-y-2.5 custom-scrollbar">
                {colCards.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded text-gray-400 text-xs">
                    No leads in this stage
                  </div>
                ) : (
                  colCards.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white p-3 rounded-[3px] shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow transition-all group border-l-4"
                      style={{ borderLeftColor: col.accent }}
                    >
                      {/* Top Card Bar */}
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <span
                          onClick={() => handleOpenView(lead)}
                          className="font-bold text-[14px] text-[#333] hover:text-[#3c8dbc] cursor-pointer line-clamp-1"
                        >
                          {lead.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            title="Edit"
                            className="p-0.5 text-gray-400 hover:text-amber-600 rounded"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead)}
                            title="Delete"
                            className="p-0.5 text-gray-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Grade & Source Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          {lead.grade || 'General'}
                        </span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {lead.source || 'Direct'}
                        </span>
                        {lead.priority === 'High' && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                            High Priority
                          </span>
                        )}
                      </div>

                      {/* Contact Preview */}
                      <div className="text-[11px] text-gray-500 space-y-0.5 mb-2.5">
                        {lead.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.assignedTo && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <User className="w-3 h-3" />
                            <span>{lead.assignedTo}</span>
                          </div>
                        )}
                      </div>

                      {/* Stage Transition Controls */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        {/* Prev Arrow */}
                        {colIdx > 0 ? (
                          <button
                            onClick={() => handleMoveStage(lead, 'prev')}
                            title={`Move back to ${PIPELINE_COLUMNS[colIdx - 1].title}`}
                            className="text-gray-500 hover:text-gray-800 p-1 hover:bg-gray-100 rounded flex items-center gap-0.5 text-[11px]"
                          >
                            <ArrowLeft className="w-3 h-3" /> Back
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-300">Initial</span>
                        )}

                        {/* Quick View Button */}
                        <button
                          onClick={() => handleOpenView(lead)}
                          className="text-[#3c8dbc] hover:underline text-[11px] font-semibold"
                        >
                          View Details
                        </button>

                        {/* Next Arrow */}
                        {colIdx < PIPELINE_COLUMNS.length - 1 ? (
                          <button
                            onClick={() => handleMoveStage(lead, 'next')}
                            title={`Advance to ${PIPELINE_COLUMNS[colIdx + 1].title}`}
                            className="text-[#3c8dbc] hover:text-[#367fa9] p-1 hover:bg-blue-50 rounded flex items-center gap-0.5 text-[11px] font-semibold"
                          >
                            Advance <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3" /> Won
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Add Card Button */}
              <div
                onClick={() => handleOpenAddForStage(col.id)}
                className="p-2.5 text-center text-gray-500 hover:text-gray-800 hover:bg-white cursor-pointer text-[12px] font-semibold border-t border-gray-200 transition-colors shrink-0 flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Card to {col.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL: Add Lead ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Kanban className="w-5 h-5" />
                <h3 className="font-bold text-[16px]">Add Card to Pipeline</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Student / Parent Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yashvardhan Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Target Class / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Class 6"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9811223344"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. parent@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="New">New Leads</option>
                    <option value="Following Up">Following Up</option>
                    <option value="Application Sent">Application Sent</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Lead Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                  >
                    {sources.map((s) => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    {sources.length === 0 && <option value="Direct Enquiry">Direct Enquiry</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Assigned Counselor / Staff
                </label>
                <input
                  type="text"
                  placeholder="e.g. Admission Desk"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Inquiry Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="Parent requested callback, fee inquiry..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] p-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-[3px] text-[13px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-5 py-1.5 rounded-[3px] text-[13px] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit Lead ── */}
      {showEditModal && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-600 text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                <h3 className="font-bold text-[16px]">Edit Card — {activeLead.name}</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Student / Parent Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Target Class / Grade
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="New">New Leads</option>
                    <option value="Following Up">Following Up</option>
                    <option value="Application Sent">Application Sent</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Inquiry Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] p-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-[3px] text-[13px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-1.5 rounded-[3px] text-[13px] font-semibold"
                >
                  Update Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: View Lead Details ── */}
      {showViewModal && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px]">{activeLead.name}</h3>
                <p className="text-xs text-gray-300">Grade: {activeLead.grade || 'General Inquiry'}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 block">Current Stage</span>
                  <span className="font-bold text-gray-800 mt-0.5 inline-block">{activeLead.status}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Channel Source</span>
                  <span className="font-semibold text-gray-700 mt-0.5 inline-block">{activeLead.source}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Inquiry Date</span>
                  <span className="text-gray-600 mt-0.5 inline-block">{activeLead.date || '—'}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Phone Number:</span>
                  <span className="font-semibold text-[#3c8dbc]">{activeLead.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Email Address:</span>
                  <span className="font-semibold text-gray-700">{activeLead.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Assigned Counselor:</span>
                  <span className="font-semibold text-gray-700">{activeLead.assignedTo || 'Front Desk'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-600 block mb-1">Remarks & Notes:</span>
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-gray-700 whitespace-pre-wrap">
                  {activeLead.notes || 'No remarks recorded.'}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleDelete(activeLead)}
                  className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleOpenEdit(activeLead);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadPipeline;

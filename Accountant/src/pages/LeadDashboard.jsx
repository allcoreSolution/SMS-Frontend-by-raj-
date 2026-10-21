import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Filter, PhoneCall, CheckCircle, Search, Edit, Trash2, 
  Plus, Eye, X, Mail, Phone, Calendar, BookOpen, User, 
  RefreshCw, FileDown, Kanban, Tag, ArrowUpDown, ChevronRight,
  Clock, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { accountantService } from '../api/accountantService';

const STATUS_COLORS = {
  'New': 'bg-[#f39c12] text-white',
  'Following Up': 'bg-[#3c8dbc] text-white',
  'Application Sent': 'bg-[#605ca8] text-white',
  'Converted': 'bg-[#00a65a] text-white',
  'Lost': 'bg-[#dd4b39] text-white',
};

const PRIORITY_BADGES = {
  'High': 'bg-red-50 text-red-600 border border-red-200',
  'Medium': 'bg-amber-50 text-amber-600 border border-amber-200',
  'Low': 'bg-blue-50 text-blue-600 border border-blue-200',
};

const LeadDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Modals state
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

  // Load data
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
      console.error('Error loading leads:', err);
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
        (item.grade && item.grade.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || (item.status || '').toLowerCase() === statusFilter.toLowerCase();
      const matchesSource = sourceFilter === 'All' || (item.source || '').toLowerCase() === sourceFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter((l) => l.status === 'New').length;
    const followingUp = leads.filter((l) => l.status === 'Following Up').length;
    const converted = leads.filter((l) => l.status === 'Converted').length;
    return { total, newLeads, followingUp, converted };
  }, [leads]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      source: sources.length > 0 ? sources[0].name : 'Direct Enquiry',
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
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

  // Open View Modal
  const handleOpenView = (lead) => {
    setActiveLead(lead);
    setShowViewModal(true);
  };

  // Save Add Lead
  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required Field', text: 'Please enter the lead name.' });
      return;
    }

    const res = await accountantService.addLead(formData);
    if (res.success) {
      setShowAddModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Lead Added!',
        text: `Prospective student inquiry for "${formData.name}" has been recorded.`,
        timer: 1800,
        showConfirmButton: false,
      });
      loadData();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to add lead.' });
    }
  };

  // Save Edit Lead
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required Field', text: 'Please enter the lead name.' });
      return;
    }

    const res = await accountantService.updateLead(activeLead.id, formData);
    if (res.success) {
      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Lead Updated!',
        text: `Lead information for "${formData.name}" has been updated.`,
        timer: 1800,
        showConfirmButton: false,
      });
      loadData();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to update lead.' });
    }
  };

  // Quick Status Change
  const handleQuickStatusChange = async (leadId, newStatus) => {
    const res = await accountantService.updateLeadStatus(leadId, newStatus);
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      if (activeLead && activeLead.id === leadId) {
        setActiveLead((prev) => ({ ...prev, status: newStatus }));
      }
    }
  };

  // Delete Lead
  const handleDelete = (lead) => {
    Swal.fire({
      title: 'Delete Lead?',
      text: `Are you sure you want to remove inquiry for "${lead.name}"? This action cannot be undone.`,
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
            text: 'Lead record has been removed.',
            timer: 1500,
            showConfirmButton: false,
          });
          loadData();
          if (showViewModal) setShowViewModal(false);
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete lead.' });
        }
      }
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      Swal.fire({ icon: 'info', title: 'No Data', text: 'There are no leads to export.' });
      return;
    }
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Grade', 'Source', 'Status', 'Priority', 'Assigned To', 'Date', 'Notes'];
    const rows = filteredLeads.map((l) => [
      `"${l.id || ''}"`,
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.grade || ''}"`,
      `"${l.source || ''}"`,
      `"${l.status || ''}"`,
      `"${l.priority || ''}"`,
      `"${l.assignedTo || ''}"`,
      `"${l.date || ''}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#333]">Lead Dashboard</h1>
            <span className="bg-[#3c8dbc]/10 text-[#3c8dbc] text-xs font-semibold px-2 py-0.5 rounded">
              {leads.length} Records
            </span>
          </div>
          <p className="text-[13px] text-gray-500">
            Overview and central inquiry desk for all prospective student admissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/leads/pipeline"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition"
          >
            <Kanban className="w-4 h-4 text-[#605ca8]" /> Pipeline Board
          </Link>
          <Link
            to="/leads/sources"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition"
          >
            <Tag className="w-4 h-4 text-[#00a65a]" /> Sources & Channels
          </Link>
          <button
            onClick={handleExportCSV}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-[3px] text-[13px] font-medium flex items-center gap-1.5 shadow-sm transition"
            title="Export CSV"
          >
            <FileDown className="w-4 h-4 text-[#3c8dbc]" /> Export CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-1.5 rounded-[3px] text-[13px] font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: 'Total Leads', val: metrics.total, color: 'bg-[#3c8dbc]', icon: Users, filter: 'All' },
          { title: 'New Inquiries', val: metrics.newLeads, color: 'bg-[#f39c12]', icon: Filter, filter: 'New' },
          { title: 'To Follow Up', val: metrics.followingUp, color: 'bg-[#00c0ef]', icon: PhoneCall, filter: 'Following Up' },
          { title: 'Converted Admissions', val: metrics.converted, color: 'bg-[#00a65a]', icon: CheckCircle, filter: 'Converted' },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => setStatusFilter(item.filter)}
            className={`${item.color} text-white rounded-[3px] p-4 relative overflow-hidden shadow-sm h-[110px] flex items-center cursor-pointer transform hover:scale-[1.01] transition-all`}
          >
            <div className="relative z-10 w-full">
              <h3 className="text-[32px] font-bold leading-none mb-1">{item.val}</h3>
              <p className="text-[13px] font-medium opacity-90">{item.title}</p>
              <span className="text-[10px] opacity-75 inline-block mt-1">Click to filter</span>
            </div>
            <item.icon className="absolute -right-2 -bottom-2 w-20 h-20 text-black/10 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-[#fefefe]">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#333]">All Lead Inquiries</h2>
            <span className="text-xs text-gray-400">({filteredLeads.length} matching)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by name, phone, class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-[3px] px-2.5 py-1.5 text-[13px] text-[#444] bg-white focus:outline-none focus:border-[#3c8dbc]"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Following Up">Following Up</option>
              <option value="Application Sent">Application Sent</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="border border-gray-200 rounded-[3px] px-2.5 py-1.5 text-[13px] text-[#444] bg-white focus:outline-none focus:border-[#3c8dbc]"
            >
              <option value="All">All Sources</option>
              {sources.map((s) => (
                <option key={s.id || s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Reset Filter Button */}
            {(searchQuery || statusFilter !== 'All' || sourceFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setSourceFilter('All');
                }}
                className="text-xs text-[#dd4b39] hover:underline px-2 py-1 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}

            <button
              onClick={loadData}
              title="Refresh"
              className="border border-gray-200 hover:bg-gray-50 text-gray-600 p-1.5 rounded-[3px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] text-[#444] text-[12px] font-bold tracking-wide border-b border-gray-200 uppercase">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Lead Name & Target Class</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status / Stage</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333] divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#3c8dbc]" />
                      <span>Loading prospective inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-12 h-12 text-gray-300" />
                      <p className="text-base font-semibold text-gray-600">No leads found</p>
                      <p className="text-xs text-gray-400">
                        {searchQuery || statusFilter !== 'All' || sourceFilter !== 'All'
                          ? 'Try adjusting your search query or filters.'
                          : 'Get started by creating your first prospective student inquiry.'}
                      </p>
                      <button
                        onClick={handleOpenAdd}
                        className="mt-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add New Lead
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, idx) => (
                  <tr key={lead.id || idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-gray-400 text-xs">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span
                          onClick={() => handleOpenView(lead)}
                          className="font-semibold text-[#3c8dbc] hover:underline cursor-pointer flex items-center gap-1.5"
                        >
                          {lead.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-medium">
                            {lead.grade || 'General'}
                          </span>
                          {lead.assignedTo && (
                            <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                              <User className="w-3 h-3 inline" /> {lead.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-xs">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-gray-700 hover:text-[#3c8dbc] flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-gray-400" /> {lead.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No phone</span>
                        )}
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-gray-500 hover:text-[#3c8dbc] flex items-center gap-1 mt-0.5"
                          >
                            <Mail className="w-3 h-3 text-gray-400" /> {lead.email}
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {lead.source || 'Direct Enquiry'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          PRIORITY_BADGES[lead.priority] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {lead.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => handleQuickStatusChange(lead.id, e.target.value)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded cursor-pointer border-0 shadow-xs focus:ring-1 focus:ring-offset-1 ${
                          STATUS_COLORS[lead.status] || 'bg-gray-500 text-white'
                        }`}
                      >
                        <option value="New" className="bg-white text-black">New</option>
                        <option value="Following Up" className="bg-white text-black">Following Up</option>
                        <option value="Application Sent" className="bg-white text-black">Application Sent</option>
                        <option value="Converted" className="bg-white text-black">Converted</option>
                        <option value="Lost" className="bg-white text-black">Lost</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {lead.date || '—'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenView(lead)}
                          title="View Details"
                          className="p-1 text-gray-500 hover:text-[#3c8dbc] hover:bg-gray-100 rounded transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(lead)}
                          title="Edit Lead"
                          className="p-1 text-gray-500 hover:text-amber-600 hover:bg-gray-100 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          title="Delete Lead"
                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: Add Lead ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h3 className="font-bold text-[16px]">Add New Prospective Lead</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
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
                    placeholder="e.g. Aryan Malhotra"
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
                    placeholder="e.g. Class 1, Nursery, KG"
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
                    placeholder="e.g. 9876543210"
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

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Initial Stage / Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="New">New</option>
                    <option value="Following Up">Following Up</option>
                    <option value="Application Sent">Application Sent</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Inquiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Counselor / Assigned Staff
                </label>
                <input
                  type="text"
                  placeholder="e.g. Admission Desk or Staff Name"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Discussion / Inquiry Remarks
                </label>
                <textarea
                  rows="3"
                  placeholder="Details regarding curriculum inquiry, transport needs, past schooling, parent notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] p-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-[3px] text-[13px] font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-5 py-1.5 rounded-[3px] text-[13px] font-semibold flex items-center gap-1 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" /> Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit Lead ── */}
      {showEditModal && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-600 text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                <h3 className="font-bold text-[16px]">Edit Lead — {activeLead.name}</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white/80 hover:text-white"
              >
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
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
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Status / Stage
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="New">New</option>
                    <option value="Following Up">Following Up</option>
                    <option value="Application Sent">Application Sent</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Inquiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Counselor / Assigned Staff
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Discussion / Inquiry Remarks
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] p-2 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-[3px] text-[13px] font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-1.5 rounded-[3px] text-[13px] font-semibold flex items-center gap-1 shadow-sm transition"
                >
                  Update Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: View Lead Details ── */}
      {showViewModal && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-800 text-white px-5 py-3.5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[16px] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#3c8dbc]" />
                  {activeLead.name}
                </h3>
                <p className="text-xs text-gray-300">Target: {activeLead.grade || 'General Admission'}</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Quick Status Bar */}
              <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-500 block">Current Stage</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-semibold inline-block mt-0.5 ${STATUS_COLORS[activeLead.status]}`}>
                    {activeLead.status}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Priority</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold inline-block mt-0.5 ${PRIORITY_BADGES[activeLead.priority] || 'bg-gray-100'}`}>
                    {activeLead.priority || 'Medium'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Inquiry Date</span>
                  <span className="text-xs font-semibold text-gray-700 inline-block mt-0.5">
                    {activeLead.date || '—'}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 text-xs flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
                  </span>
                  {activeLead.phone ? (
                    <a href={`tel:${activeLead.phone}`} className="font-semibold text-[#3c8dbc] hover:underline">
                      {activeLead.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic text-xs">Not provided</span>
                  )}
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 text-xs flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Email
                  </span>
                  {activeLead.email ? (
                    <a href={`mailto:${activeLead.email}`} className="font-semibold text-[#3c8dbc] hover:underline">
                      {activeLead.email}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic text-xs">Not provided</span>
                  )}
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 text-xs flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> Lead Source
                  </span>
                  <span className="font-semibold text-gray-700">
                    {activeLead.source || 'Direct Enquiry'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500 text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" /> Counselor
                  </span>
                  <span className="font-semibold text-gray-700">
                    {activeLead.assignedTo || 'Front Desk'}
                  </span>
                </div>
              </div>

              {/* Discussion Notes */}
              <div>
                <span className="text-xs font-semibold text-gray-600 block mb-1">
                  Inquiry Notes & Discussion Log
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-gray-700 whitespace-pre-wrap min-h-[60px]">
                  {activeLead.notes || 'No remarks added yet for this inquiry.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleDelete(activeLead)}
                  className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Lead
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleOpenEdit(activeLead);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-[3px] text-xs font-semibold"
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

export default LeadDashboard;

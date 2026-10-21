import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import {
  LifeBuoy, Plus, ArrowRight, ArrowLeft, Edit, Info, Paperclip, Send,
  CornerDownRight, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  Search, Filter, Phone, MessageSquare, ExternalLink, RefreshCw,
  Check, X, FileText, ChevronDown, User, Sparkles, HelpCircle,
  Headset, AlertCircle, Building, Mail, Layers, Award,
  MoreVertical, Trash2, Eye, RotateCcw
} from 'lucide-react';
import supportService from '../api/supportService';
import HelpCenterNav from './help-center/HelpCenterNav';

// Format helper
const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const getPriorityBadge = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
    case 'critical':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
        dot: 'bg-rose-500 animate-ping',
        label: 'Urgent'
      };
    case 'high':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
        dot: 'bg-amber-500',
        label: 'High Priority'
      };
    case 'normal':
    case 'medium':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
        dot: 'bg-blue-500',
        label: 'Normal'
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-600 border-slate-200 ring-slate-500/20',
        dot: 'bg-slate-400',
        label: 'Low Priority'
      };
  }
};

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'Open'
      };
    case 'in progress':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        label: 'In Progress'
      };
    case 'resolved':
      return {
        bg: 'bg-emerald-50 text-emerald-700 bord er-emerald-200',
        label: 'Resolved'
      };
    case 'closed':
      return {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        label: 'Closed'
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        label: status || 'Open'
      };
  }
};

// ==========================================
// 1. TICKET LIST COMPONENT
// ==========================================
const TicketList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Close dropdown on window click
  useEffect(() => {
    const handleWindowClick = () => setOpenDropdownId(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab !== 'All') params.status = activeTab;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await supportService.getTickets(params);
      if (res && res.success) {
        setTickets(res.data || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load support tickets:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleSeedData = async () => {
    try {
      setIsRefreshing(true);
      await supportService.seedTickets();
      await fetchTickets();
    } catch (err) {
      console.error('Failed to seed demo data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleQuickStatus = async (e, ticketId, newStatus) => {
    e.stopPropagation();
    setOpenDropdownId(null);
    try {
      const res = await supportService.updateStatus(ticketId, newStatus);
      if (res && res.success) {
        setTickets(prev => prev.map(t => (t._id === ticketId || t.ticketCode === ticketId) ? { ...t, status: newStatus } : t));
        fetchTickets();
      }
    } catch (err) {
      console.error('Quick status update failed:', err);
    }
  };

  const handleQuickDelete = async (e, ticketId) => {
    e.stopPropagation();
    setOpenDropdownId(null);
    if (!window.confirm('Are you sure you want to delete this support ticket?')) return;
    try {
      const res = await supportService.deleteTicket(ticketId);
      if (res && res.success) {
        setTickets(prev => prev.filter(t => t._id !== ticketId && t.ticketCode !== ticketId));
        fetchTickets();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const tabs = [
    { name: 'All', count: stats.total },
    { name: 'Open', count: stats.open },
    { name: 'In Progress', count: stats.inProgress },
    { name: 'Resolved', count: stats.resolved },
    { name: 'Closed', count: stats.closed }
  ];

  const categories = [
    'All',
    'Technical Issue',
    'Billing & Subscription',
    'Academics & CBC',
    'Hardware & Biometrics',
    'Attendance & Timetable',
    'General Enquiry'
  ];

  return (
    <div className="bg-slate-50/70 min-h-screen w-full pb-20 font-sans text-slate-800">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-0">
        <HelpCenterNav counts={{ tickets: stats.total }} onRefresh={fetchTickets} loading={loading} />
      </div>

      {/* Top Hero Banner */}
      <div className="bg-white border-b border-slate-200/80 px-6 md:px-12 py-8 shadow-xs">
        <div className="max-w-[1600px] mx-auto w-full">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
                <Headset className="w-3.5 h-3.5 text-indigo-600" />
                <span>24/7 Platform Technical Assistance & Help Desk</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                Support & Ticket Center
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Raise queries, report bugs, request custom reports, or contact assigned hardware engineers. Real-time updates and full audit logs are preserved for your institution.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleSeedData}
                disabled={isRefreshing}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                title="Reset or refresh sample tickets"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Demo Data'}</span>
              </button>
              <button
                onClick={() => navigate('/contact-support/new')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-bold rounded-xl flex items-center gap-2 text-xs shadow-sm hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>New Ticket</span>
              </button>
            </div>
          </div>

          {/* Quick Support Channels Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-indigo-900/70 uppercase tracking-wider">Priority Hotline</p>
                <p className="text-xs font-bold text-slate-900 truncate">+91 98765 43210</p>
                <p className="text-[10px] text-slate-500">Mon - Sat (8 AM - 8 PM IST)</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-emerald-900/70 uppercase tracking-wider">WhatsApp Engineer</p>
                <p className="text-xs font-bold text-slate-900 truncate">+91 98765 43211</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Active Now • Instant Chat</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-blue-900/70 uppercase tracking-wider">Direct Email Desk</p>
                <p className="text-xs font-bold text-slate-900 truncate">support@schoolerp.io</p>
                <p className="text-[10px] text-slate-500">&lt; 30 min response time</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-purple-900/70 uppercase tracking-wider">AI Instant Guide</p>
                <Link to="/help-center/ai-chatbot" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
                  <span>Open Help Center</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <p className="text-[10px] text-slate-500">200+ Guides & Walkthroughs</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 md:px-12 max-w-[1600px] mx-auto w-full mt-8 space-y-6">

        {/* Filter Controls & Tabs Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                  >
                    <span>{tab.name}</span>
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Category Select */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder='Search tickets by reference code ("TKT-1008"), subject, or details...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  fetchTickets();
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </form>

        </div>

        {/* Tickets List Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">

          {/* Loading Skeleton */}
          {loading && (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-400">Loading support tickets...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && tickets.length === 0 && (
            <div className="p-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <LifeBuoy className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No support tickets found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  {searchQuery || activeTab !== 'All'
                    ? 'No queries matched your search criteria. Try clearing the filter or search bar.'
                    : 'Everything is running smoothly! If you ever face an issue, click below to open a ticket.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/contact-support/new')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 transition-colors"
                >
                  Create New Ticket
                </button>
                <button
                  onClick={handleSeedData}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Load Sample Tickets
                </button>
              </div>
            </div>
          )}

          {/* Real Semantic Table with Strict Column Alignment */}
          {!loading && tickets.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1150px]">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                    <th className="py-3.5 px-5 w-[140px]">Reference / Date</th>
                    <th className="py-3.5 px-4 min-w-[280px]">Ticket Overview & Subject</th>
                    <th className="py-3.5 px-4 w-[160px]">Category</th>
                    <th className="py-3.5 px-4 w-[130px]">Priority</th>
                    <th className="py-3.5 px-4 w-[220px]">Contact / Submitter</th>
                    <th className="py-3.5 px-4 w-[160px]">Status / Assigned</th>
                    <th className="py-3.5 px-5 w-[140px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tickets.map((t) => {
                    const pBadge = getPriorityBadge(t.priority);
                    const sBadge = getStatusBadge(t.status);
                    const repliesCount = t.replies?.length || 0;
                    const ticketKey = t._id || t.ticketCode;
                    const isMenuOpen = openDropdownId === ticketKey;

                    return (
                      <tr
                        key={ticketKey}
                        onClick={() => navigate(`/contact-support/${ticketKey}`)}
                        className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        {/* 1. Reference & Date */}
                        <td className="py-4 px-5 align-top whitespace-nowrap">
                          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/80 inline-block">
                            {t.ticketCode || 'TKT-PENDING'}
                          </span>
                          <div className="text-[11px] text-slate-400 font-medium mt-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{formatDate(t.createdAt)}</span>
                          </div>
                        </td>

                        {/* 2. Ticket Overview & Subject */}
                        <td className="py-4 px-4 align-top">
                          <div className="pr-3">
                            <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-1 mb-1">
                              {t.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {t.description}
                            </p>
                            <div className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                              <MessageSquare className="w-3 h-3 text-slate-400" />
                              <span>{repliesCount} {repliesCount === 1 ? 'message' : 'messages'}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Category */}
                        <td className="py-4 px-4 align-top whitespace-nowrap">
                          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80 inline-block">
                            {t.category || 'General'}
                          </span>
                        </td>

                        {/* 4. Priority */}
                        <td className="py-4 px-4 align-top whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${pBadge.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${pBadge.dot}`} />
                            <span>{pBadge.label}</span>
                          </span>
                        </td>

                        {/* 5. Contact / Submitter (Cleanly arranged & formatted with icons) */}
                        <td className="py-4 px-4 align-top">
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[190px]">{t.contactName || 'School Administrator'}</span>
                            </div>
                            {t.contactPhone && (
                              <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{t.contactPhone}</span>
                              </div>
                            )}
                            {t.contactEmail && (
                              <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1.5 truncate max-w-[190px]">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{t.contactEmail}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 6. Status & Assigned */}
                        <td className="py-4 px-4 align-top whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-xs font-bold ${sBadge.bg} mb-1`}>
                            {sBadge.label}
                          </span>
                          {t.assignedAgent?.name && (
                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <span>Agent:</span>
                              <span className="font-semibold text-slate-700">{t.assignedAgent.name}</span>
                            </p>
                          )}
                        </td>

                        {/* 7. Actions */}
                        <td className="py-4 px-5 align-top text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5 relative">
                            {/* Primary View / Open Action Button */}
                            <button
                              onClick={() => navigate(`/contact-support/${ticketKey}`)}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs group-hover:bg-indigo-600 group-hover:text-white cursor-pointer"
                              title="Open ticket conversation"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            {/* Secondary Action Dropdown Trigger */}
                            <button
                              onClick={() => setOpenDropdownId(isMenuOpen ? null : ticketKey)}
                              className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                              title="Quick status & options"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Floating Action Dropdown Menu */}
                            {isMenuOpen && (
                              <div
                                className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 text-xs font-medium text-slate-700 text-left animate-in fade-in duration-150"
                              >
                                <button
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    navigate(`/contact-support/${ticketKey}`);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>View Discussion</span>
                                </button>

                                {t.status !== 'Resolved' && (
                                  <button
                                    onClick={(e) => handleQuickStatus(e, ticketKey, 'Resolved')}
                                    className="w-full px-3.5 py-2 text-left hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer transition-colors"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Mark as Resolved</span>
                                  </button>
                                )}

                                {t.status !== 'Closed' && (
                                  <button
                                    onClick={(e) => handleQuickStatus(e, ticketKey, 'Closed')}
                                    className="w-full px-3.5 py-2 text-left hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 cursor-pointer transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Close Ticket</span>
                                  </button>
                                )}

                                {(t.status === 'Resolved' || t.status === 'Closed') && (
                                  <button
                                    onClick={(e) => handleQuickStatus(e, ticketKey, 'Open')}
                                    className="w-full px-3.5 py-2 text-left hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 cursor-pointer transition-colors"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Reopen Ticket</span>
                                  </button>
                                )}

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  onClick={(e) => handleQuickDelete(e, ticketKey)}
                                  className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Delete Ticket</span>
                                </button>
                              </div>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// ==========================================
// 2. CREATE TICKET COMPONENT
// ==========================================
const CreateTicket = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Issue',
    priority: 'Normal',
    contactName: 'School Administrator',
    contactEmail: 'admin@apexinstitute.edu.in',
    contactPhone: '+91 98765 43210',
    description: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5 MB limit.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMsg('Please enter both a ticket subject and a detailed description.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        attachmentUrl: selectedFile ? `uploads/support/${selectedFile.name}` : ''
      };

      const res = await supportService.createTicket(payload);
      if (res && res.success) {
        navigate(`/contact-support/${res.data?._id || res.data?.ticketCode || ''}`);
      } else {
        navigate('/contact-support');
      }
    } catch (err) {
      console.error('Error submitting ticket:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit ticket. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/70 min-h-screen w-full pb-20 font-sans text-slate-800">

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-6 md:px-12 py-6 shadow-xs">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/contact-support')}
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight">New Support Ticket</h1>
              <p className="text-xs text-slate-500 mt-0.5">Submit an issue or inquiry — platform engineers respond within 30 minutes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Form Card (2 Columns on Desktop) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <Edit className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ticket Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Subject / Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Biometric device in West Block not pushing morning punches"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Department Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Billing & Subscription">Billing & Subscription</option>
                    <option value="Academics & CBC">Academics & CBC</option>
                    <option value="Hardware & Biometrics">Hardware & Biometrics</option>
                    <option value="Attendance & Timetable">Attendance & Timetable</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Severity / Priority <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white outline-none focus:border-indigo-500"
                  >
                    <option value="Normal">Normal (Routine inquiries, questions)</option>
                    <option value="High">High (Key feature blocked)</option>
                    <option value="Urgent">Urgent (Campus outage, financial block)</option>
                    <option value="Low">Low (Cosmetic, minor adjustments)</option>
                  </select>
                </div>
              </div>

              {/* Submitter Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Contact Person</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Email for Updates</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Direct Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold bg-white"
                  />
                </div>
              </div>

              {/* Message Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Detailed Description & Steps to Reproduce <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="6"
                  placeholder="Explain what happened, what you expected, the affected class/student/device IP, and error messages if any..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y"
                  required
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Attach Screenshot or Error Document <span className="text-slate-400 font-normal">(Optional, max 5 MB)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2">
                    <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf,.xlsx,.csv,.txt"
                    />
                  </label>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedFile ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)` : 'No file chosen'}
                  </span>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/contact-support')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-indigo-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Right Tips & SLA Card */}
          <div className="space-y-6">

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 mb-3">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Support SLAs</h3>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                  <span><strong className="text-slate-800">Urgent Tickets:</strong> 15-minute response SLA. Assigned directly to on-call infrastructure lead.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <span><strong className="text-slate-800">High Priority:</strong> 1-hour resolution target for core module blocking workflows.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span><strong className="text-slate-800">Normal Queries:</strong> Handled within same business day with live status notifications.</span>
                </li>
              </ul>
            </div>

            <div className="bg-indigo-50/70 rounded-3xl border border-indigo-100 p-6 text-xs text-indigo-950 space-y-2">
              <h4 className="font-extrabold flex items-center gap-1.5 text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Tip for Fastest Resolution</span>
              </h4>
              <p className="leading-relaxed text-indigo-900/80">
                Attaching a screenshot of the error dialog or student admission ID reduces troubleshooting iterations by over 70%.
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

// ==========================================
// 3. TICKET DETAIL COMPONENT
// ==========================================
const TicketDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const res = await supportService.getTicketById(id);
      if (res && res.success) {
        setTicket(res.data);
      }
    } catch (err) {
      console.error('Failed to load ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      setSendingReply(true);
      const res = await supportService.addReply(ticket._id || ticket.ticketCode, {
        sender: ticket.contactName || 'School Administrator',
        senderRole: 'Client',
        message: replyMessage.trim()
      });

      if (res && res.success) {
        setTicket(res.data);
        setReplyMessage('');
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
      alert('Could not post reply. Please check your network.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await supportService.updateStatus(ticket._id || ticket.ticketCode, newStatus);
      if (res && res.success) {
        setTicket(res.data);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ticket ${ticket.ticketCode}?`)) return;
    try {
      setStatusUpdating(true);
      await supportService.deleteTicket(ticket._id || ticket.ticketCode);
      navigate('/contact-support');
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      alert('Could not delete ticket.');
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50/70 min-h-screen w-full flex items-center justify-center p-12">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading ticket thread...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-slate-50/70 min-h-screen w-full flex items-center justify-center p-12">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Ticket Not Found</h2>
          <p className="text-xs text-slate-500">The requested support ticket does not exist or was deleted.</p>
          <button
            onClick={() => navigate('/contact-support')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  const pBadge = getPriorityBadge(ticket.priority);
  const sBadge = getStatusBadge(ticket.status);

  return (
    <div className="bg-slate-50/70 min-h-screen w-full pb-20 font-sans text-slate-800">

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-6 md:px-12 py-6 shadow-xs">
        <div className="max-w-[1500px] mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/contact-support')}
              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shrink-0 mt-0.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  {ticket.ticketCode}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${pBadge.bg}`}>
                  {pBadge.label}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${sBadge.bg}`}>
                  {sBadge.label}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight">
                {ticket.title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Opened {formatDate(ticket.createdAt)} by <span className="text-slate-600 font-semibold">{ticket.contactName}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons Suite */}
          <div className="flex items-center gap-2">
            {ticket.status !== 'Resolved' && (
              <button
                onClick={() => handleUpdateStatus('Resolved')}
                disabled={statusUpdating}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            )}
            {ticket.status !== 'Closed' && (
              <button
                onClick={() => handleUpdateStatus('Closed')}
                disabled={statusUpdating}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Close Ticket</span>
              </button>
            )}
            {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
              <button
                onClick={() => handleUpdateStatus('Open')}
                disabled={statusUpdating}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Ticket</span>
              </button>
            )}
            <button
              onClick={handleDeleteTicket}
              disabled={statusUpdating}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Delete ticket"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1500px] mx-auto w-full px-6 md:px-12 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Left Column: Timeline Conversation & Reply Box */}
          <div className="space-y-6">

            {/* Conversation Timeline Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Discussion Thread ({ticket.replies?.length || 0} messages)</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Category: <strong className="text-slate-700">{ticket.category}</strong>
                </span>
              </div>

              {/* Message Flow */}
              <div className="p-6 md:p-8 space-y-6">

                {ticket.replies?.map((msg, idx) => {
                  const isAgent = msg.senderRole === 'Support Agent' || msg.senderRole === 'SuperAdmin';
                  const isSystem = msg.senderRole === 'System';

                  if (isSystem) {
                    return (
                      <div key={idx} className="flex items-center justify-center my-4">
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          {msg.message} • {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    );
                  }

                  if (isAgent) {
                    // Left-aligned: Platform Support Engineer reply
                    return (
                      <div key={idx} className="flex items-start gap-3.5 max-w-[85%]">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-xs">
                          {msg.senderAvatar ? (
                            <img src={msg.senderAvatar} alt="Agent" className="w-full h-full rounded-xl object-cover" />
                          ) : (
                            'PS'
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{msg.sender}</span>
                            <span className="bg-indigo-100 text-indigo-700 font-extrabold text-[9px] uppercase px-1.5 py-0.2 rounded">
                              Verified Support
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">{formatDate(msg.timestamp)}</span>
                          </div>
                          <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-sm text-xs leading-relaxed shadow-2xs">
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Right-aligned: Client / School Admin message
                  return (
                    <div key={idx} className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1 pr-1">
                        <span className="text-[11px] text-slate-400 font-medium">{formatDate(msg.timestamp)}</span>
                        <span className="text-xs font-bold text-slate-900">{msg.sender}</span>
                      </div>
                      <div className="flex items-start justify-end gap-3 max-w-[85%]">
                        <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm text-xs leading-relaxed shadow-xs">
                          {msg.message}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                          S
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Reply Input Box Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <CornerDownRight className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Add a Reply</h3>
              </div>

              <form onSubmit={handleSendReply} className="p-6">
                <textarea
                  placeholder="Type your response to the platform engineering team..."
                  rows="4"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y"
                  required
                />

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach files directly or paste logs</span>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingReply || !replyMessage.trim()}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingReply ? 'Sending...' : 'Send Reply'}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column: Metadata & Assigned Agent Sidebar */}
          <div className="space-y-6">

            {/* Ticket Info Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                Ticket Metadata
              </h3>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Reference</p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{ticket.ticketCode}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Department</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{ticket.category}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Priority Level</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-bold mt-1 ${pBadge.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pBadge.dot}`} />
                  <span>{pBadge.label}</span>
                </span>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Status</p>
                <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-xs font-bold mt-1 ${sBadge.bg}`}>
                  {sBadge.label}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Last Activity</p>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">{formatDate(ticket.updatedAt)}</p>
              </div>
            </div>

            {/* Assigned Support Lead Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-100 mb-4">
                Assigned Support Lead
              </h3>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-sm overflow-hidden">
                  {ticket.assignedAgent?.avatar ? (
                    <img src={ticket.assignedAgent.avatar} alt="Agent" className="w-full h-full object-cover" />
                  ) : (
                    'PS'
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{ticket.assignedAgent?.name || 'Priya Sharma'}</h4>
                  <p className="text-[11px] text-indigo-600 font-semibold">{ticket.assignedAgent?.role || 'Platform Engineer'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">SLA: Response guaranteed</p>
                </div>
              </div>
            </div>

            {/* Submitter Institution & Contact Card */}
            <div className="bg-slate-50/90 rounded-3xl border border-slate-200/90 p-6 text-xs text-slate-700 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 text-slate-900 font-extrabold">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>Institution & Contact Info</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Institution / Campus</span>
                <span className="font-bold text-slate-900 text-xs">{ticket.schoolName || 'Apex International Academy'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Contact Person</span>
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ticket.contactName || 'School Administrator'}</span>
                </div>
              </div>

              {ticket.contactPhone && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Direct Phone</span>
                  <div className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ticket.contactPhone}</span>
                  </div>
                </div>
              )}

              {ticket.contactEmail && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Email for Notifications</span>
                  <div className="font-semibold text-slate-700 text-xs flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ticket.contactEmail}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

// ==========================================
// 4. MAIN ROUTER
// ==========================================
const ContactSupport = () => {
  return (
    <Routes>
      <Route path="/" element={<TicketList />} />
      <Route path="new" element={<CreateTicket />} />
      <Route path=":id" element={<TicketDetail />} />
    </Routes>
  );
};

export default ContactSupport;

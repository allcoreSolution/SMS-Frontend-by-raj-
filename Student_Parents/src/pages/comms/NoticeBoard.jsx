import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Megaphone, ArrowRight, Search, RefreshCw, 
  Calendar, AlertCircle, AlertTriangle, CheckCircle2, 
  Filter, FileText, Printer, Share2, X, Eye, 
  Sparkles, Layers, List, LayoutGrid, Download
} from 'lucide-react';
import { parentService } from '../../api/parentService';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'grid'

  // Selected Notice for reading modal
  const [activeNotice, setActiveNotice] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await parentService.getNotices();
      if (res?.success && Array.isArray(res.data)) {
        setNotices(res.data);
      } else {
        setNotices([]);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotices();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Open modal and increment view
  const handleOpenNotice = async (notice) => {
    setActiveNotice(notice);
    try {
      if (notice._id) {
        await parentService.getNoticeById(notice._id);
        // Increment viewsCount locally
        setNotices(prev => prev.map(n => n._id === notice._id ? { ...n, viewsCount: (n.viewsCount || 0) + 1 } : n));
      }
    } catch (e) {
      console.error('View tracking error:', e);
    }
  };

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter(n => {
      const matchPriority = selectedPriority === 'All' || n.priority?.toLowerCase() === selectedPriority.toLowerCase();
      const matchAudience = selectedAudience === 'All' || 
        n.targetAudience?.toLowerCase() === selectedAudience.toLowerCase() ||
        n.sentTo?.toLowerCase().includes(selectedAudience.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        n.title?.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q) ||
        n.noticeNumber?.toLowerCase().includes(q) ||
        n.createdByRole?.toLowerCase().includes(q);

      return matchPriority && matchAudience && matchSearch;
    });
  }, [notices, selectedPriority, selectedAudience, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = notices.length;
    const urgent = notices.filter(n => n.priority === 'Urgent').length;
    const high = notices.filter(n => n.priority === 'High').length;
    const parentCirculars = notices.filter(n => (n.targetAudience === 'Parent' || n.sentTo?.includes('Parent'))).length;

    return {
      total,
      urgent,
      high,
      parentCirculars
    };
  }, [notices]);

  // Helper: relative time calculation
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper: priority styling
  const getPriorityBadge = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
            <AlertCircle className="w-3 h-3" /> URGENT
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> HIGH PRIORITY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" /> REGULAR NOTICE
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-6 min-h-screen">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Official Notice Board & Circulars</h1>
          </div>
          <p className="text-[13px] text-gray-500 mt-1 pl-10">
            Official announcements, academic circulars, exam datesheets, and event bulletins for parents and students
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          title="Refresh Notices"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-colors w-max self-start md:self-auto pl-10 md:pl-3"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Board</span>
        </button>
      </div>

      {/* 2. KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Circulars</span>
            <span className="text-2xl font-black text-gray-800 leading-none">{stats.total}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Urgent Action</span>
            <span className="text-2xl font-black text-rose-600 leading-none">{stats.urgent}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">High Priority</span>
            <span className="text-2xl font-black text-amber-700 leading-none">{stats.high}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Parent Bulletins</span>
            <span className="text-2xl font-black text-emerald-600 leading-none">{stats.parentCirculars}</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 w-full">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars by title, reference number, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm text-gray-700 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* Priority Filter */}
          <div className="w-full sm:w-44">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm font-semibold text-gray-700 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Only</option>
              <option value="High">High Priority</option>
              <option value="Normal">Regular Notices</option>
            </select>
          </div>

          {/* Audience Filter */}
          <div className="w-full sm:w-44">
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm font-semibold text-gray-700 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Audiences</option>
              <option value="Parent">Parents Only</option>
              <option value="Student">Students</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-0.5 shrink-0">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              viewMode === 'timeline' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Timeline
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Grid Cards
          </button>
        </div>
      </div>

      {/* 4. Notices Display Feed */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-700">Loading notices and circulars...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl min-h-[360px] flex flex-col items-center justify-center p-8 text-center shadow-xs">
          <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-gray-800 mb-1">No circulars found</h2>
          <p className="text-xs text-gray-400 max-w-sm">
            No notices match your search keywords or selected priority filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedPriority('All'); setSelectedAudience('All'); }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        /* TIMELINE VIEW */
        <div className="relative pl-6 md:pl-10 border-l-2 border-indigo-200/80 space-y-8 my-6">
          {filteredNotices.map((notice, idx) => {
            const pubDate = notice.publishDate ? new Date(notice.publishDate) : new Date();
            const dateStr = pubDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
            const isUrgent = notice.priority === 'Urgent';

            return (
              <div key={notice._id || idx} className="relative group">
                {/* Timeline Node Icon */}
                <div className={`absolute -left-[35px] md:-left-[51px] top-4 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 ${
                  isUrgent ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'
                }`}>
                  <Megaphone className="w-3.5 h-3.5" />
                </div>

                {/* Date Pill over node */}
                <div className="mb-2">
                  <span className="bg-[#353A40] text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-xs">
                    {dateStr}
                  </span>
                </div>

                {/* Notice Box */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="p-5 space-y-3">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {getPriorityBadge(notice.priority)}
                        <span className="text-[11px] font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {notice.noticeNumber}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          Audience: <strong className="text-gray-700">{notice.sentTo || notice.targetAudience}</strong>
                        </span>
                      </div>

                      <span className="flex items-center gap-1 text-xs font-bold text-gray-400">
                        <Clock className="w-3.5 h-3.5" /> {getRelativeTime(notice.publishDate)}
                      </span>
                    </div>

                    {/* Notice Title */}
                    <h3
                      onClick={() => handleOpenNotice(notice)}
                      className="text-base font-bold text-gray-900 leading-snug hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {notice.title}
                    </h3>

                    {/* Notice Content excerpt */}
                    <p className="text-xs md:text-[13px] text-gray-600 leading-relaxed font-normal">
                      {notice.content}
                    </p>

                    {/* Department / Footer */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Issued By:</span>
                        <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-200 font-medium">
                          {notice.createdByRole || 'Principal Office'}
                        </span>
                        <span className="text-gray-400">• {notice.viewsCount || 0} views</span>
                      </div>

                      <button
                        onClick={() => handleOpenNotice(notice)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Read Circular</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.map((notice, idx) => {
            const pubDate = notice.publishDate ? new Date(notice.publishDate) : new Date();
            const dateStr = pubDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

            return (
              <div
                key={notice._id || idx}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {getPriorityBadge(notice.priority)}
                    <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {notice.noticeNumber}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenNotice(notice)}
                    className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer"
                  >
                    {notice.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{dateStr}</span>
                  </div>

                  <button
                    onClick={() => handleOpenNotice(notice)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Official Circular Reader Modal */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-gray-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                      REF: {activeNotice.noticeNumber}
                    </span>
                    {getPriorityBadge(activeNotice.priority)}
                  </div>
                  <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight leading-snug mt-2">
                    {activeNotice.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveNotice(null)}
                  className="text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Meta details strip */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Published: <strong className="text-gray-700">{new Date(activeNotice.publishDate || Date.now()).toLocaleDateString(undefined, { dateStyle: 'full' })}</strong>
                </span>
                <span>•</span>
                <span className="font-medium">
                  Issued By: <strong className="text-gray-700">{activeNotice.createdByRole || 'Principal Office'}</strong>
                </span>
                <span>•</span>
                <span className="font-medium">
                  For: <strong className="text-gray-700">{activeNotice.sentTo || activeNotice.targetAudience}</strong>
                </span>
              </div>
            </div>

            {/* Circular Body */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed space-y-4">
              <p className="whitespace-pre-line font-medium text-gray-800 leading-relaxed">
                {activeNotice.content}
              </p>
            </div>

            {/* Official Signature Seal */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs text-gray-500">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Authorized Dispatch</span>
                <span className="font-bold text-gray-800 text-xs">School Administrative Council</span>
                <p className="text-[11px] text-gray-400">Verified & Authenticated via School ERP Portal</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-4 h-4" /> Print Notice
                </button>
                <button
                  onClick={() => setActiveNotice(null)}
                  className="px-4 py-2 bg-[#353A40] hover:bg-[#23272b] text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
                >
                  Close Circular
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

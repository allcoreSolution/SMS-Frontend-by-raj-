import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, Plus, Layers, List, Grid, 
  FileText, Printer, Search, Edit, Trash2, 
  ChevronLeft, ChevronRight, Calendar, AlertCircle, 
  CheckCircle2, Clock, Users, Eye, X, Filter, Sparkles, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { communicateService } from '../api/communicateService';

export default function NoticeBoard() {
  const [isAdding, setIsAdding] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [selectedNoticeModal, setSelectedNoticeModal] = useState(null);

  // Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    sentTo: 'All (Entire School)',
    targetAudience: 'All',
    priority: 'Normal',
    publishDate: new Date().toISOString().split('T')[0],
    content: '',
    createdByRole: 'Principal Office'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await communicateService.getNotices();
      setNotices(res.data || []);
    } catch (err) {
      console.error('Failed to load notices:', err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNotice = async (e) => {
    e?.preventDefault();
    if (!newNotice.title.trim()) {
      Swal.fire('Title Required', 'Please enter a title for the announcement.', 'warning');
      return;
    }
    if (!newNotice.content.trim()) {
      Swal.fire('Content Required', 'Please provide the notice content.', 'warning');
      return;
    }

    try {
      await communicateService.createNotice(newNotice);
      Swal.fire({
        icon: 'success',
        title: 'Notice Published!',
        text: 'The announcement is now visible on student and parent notice boards.',
        confirmButtonColor: '#5542f6'
      });
      setIsAdding(false);
      setNewNotice({
        title: '',
        sentTo: 'All (Entire School)',
        targetAudience: 'All',
        priority: 'Normal',
        publishDate: new Date().toISOString().split('T')[0],
        content: '',
        createdByRole: 'Principal Office'
      });
      fetchNotices();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  const handleDeleteNotice = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Notice?',
      text: `Are you sure you want to remove "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await communicateService.deleteNotice(id);
        setNotices(prev => prev.filter(n => n._id !== id));
        Swal.fire('Deleted!', 'Notice removed successfully.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete notice.', 'error');
      }
    }
  };

  const filteredNotices = useMemo(() => {
    return notices.filter(n => {
      const matchesSearch = (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (n.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (n.noticeNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAudience = selectedAudience === 'All' || n.targetAudience === selectedAudience || (n.sentTo && n.sentTo.includes(selectedAudience));
      const matchesPriority = selectedPriority === 'All' || n.priority === selectedPriority;
      return matchesSearch && matchesAudience && matchesPriority;
    });
  }, [notices, searchQuery, selectedAudience, selectedPriority]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">URGENT</span>;
      case 'High':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">HIGH PRIORITY</span>;
      default:
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">NORMAL</span>;
    }
  };

  // ----------------- ADD NOTICE VIEW -----------------
  if (isAdding) {
    return (
      <div className="p-6 bg-[#f4f7fc] min-h-[calc(100vh-64px)] font-sans">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
              <Megaphone className="w-6 h-6 mr-2 text-[#5542f6]" /> Publish Official Announcement
            </h1>
            <p className="text-xs text-gray-500 mt-1">Publish a circular to the whole institution, specific classes, or parent channels</p>
          </div>
          <button 
            onClick={() => setIsAdding(false)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm"
          >
            Back to Notice Board
          </button>
        </div>

        <form onSubmit={handlePublishNotice} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Notice Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g., Annual Sports Day 2026 Participation & Rehearsal Schedule"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#5542f6]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Audience</label>
                  <select 
                    value={newNotice.targetAudience}
                    onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value, sentTo: e.target.value === 'All' ? 'All (Entire School)' : `All ${e.target.value}s` })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white focus:border-[#5542f6]"
                  >
                    <option value="All">All (Entire School)</option>
                    <option value="Parent">All Parents</option>
                    <option value="Teacher">Teaching & Staff</option>
                    <option value="Student">Students Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Priority Level</label>
                  <select 
                    value={newNotice.priority}
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white focus:border-[#5542f6]"
                  >
                    <option value="Normal">Normal Announcement</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent / Action Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Circular Content <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  rows={8}
                  placeholder="Write complete notice details, instructions, date schedules, and contact info..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-xs outline-none focus:border-[#5542f6] resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar: Meta & Action */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-gray-800 border-b border-gray-100 pb-2">Publishing Settings</h3>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Publish Date</label>
                <input 
                  type="date"
                  value={newNotice.publishDate}
                  onChange={(e) => setNewNotice({ ...newNotice, publishDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Issued Authority</label>
                <input 
                  type="text"
                  value={newNotice.createdByRole}
                  onChange={(e) => setNewNotice({ ...newNotice, createdByRole: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#5542f6] hover:bg-[#4533e4] text-white rounded-lg text-xs font-extrabold shadow-md shadow-indigo-100 transition-all flex items-center justify-center"
                >
                  <Megaphone className="w-4 h-4 mr-1.5" /> Publish Notice Now
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ----------------- MAIN NOTICE BOARD VIEW -----------------
  return (
    <div className="p-6 bg-[#f4f7fc] min-h-[calc(100vh-64px)] font-sans flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Institutional Notice Board</h1>
            <span className="bg-indigo-50 text-[#5542f6] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Official announcements, examination date sheets, holiday circulars, and institutional advisories.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchNotices}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 shadow-sm"
            title="Refresh Notices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-[#5542f6] text-white rounded-lg text-xs font-bold hover:bg-[#4533e4] transition-all shadow-md shadow-indigo-100"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add New Notice
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search circulars, title, number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#5542f6]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select 
              value={selectedAudience} 
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white"
            >
              <option value="All">All Audiences</option>
              <option value="Parent">Parents</option>
              <option value="Teacher">Faculty / Staff</option>
              <option value="Student">Students</option>
            </select>

            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg border text-xs ${viewMode === 'list' ? 'bg-indigo-50 border-indigo-200 text-[#5542f6]' : 'border-gray-200 text-gray-500'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg border text-xs ${viewMode === 'grid' ? 'bg-indigo-50 border-indigo-200 text-[#5542f6]' : 'border-gray-200 text-gray-500'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notices List / Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#5542f6]" />
          <p className="text-xs font-medium">Loading circulars and notices...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <Megaphone className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <h3 className="font-bold text-sm text-gray-700">No Notices Found</h3>
          <p className="text-xs text-gray-400 mt-1">Try modifying your search or publish a new notice announcement.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
              <tr>
                <th className="p-3">Ref No</th>
                <th className="p-3">Title & Announcement</th>
                <th className="p-3">Target</th>
                <th className="p-3">Publish Date</th>
                <th className="p-3">Priority</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNotices.map((notice) => (
                <tr key={notice._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#5542f6]">{notice.noticeNumber || 'NOT-2026'}</td>
                  <td className="p-3 max-w-md">
                    <div 
                      onClick={() => setSelectedNoticeModal(notice)}
                      className="font-extrabold text-gray-900 cursor-pointer hover:text-[#5542f6] transition-colors"
                    >
                      {notice.title}
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{notice.content}</p>
                  </td>
                  <td className="p-3">
                    <span className="bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {notice.sentTo || notice.targetAudience}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 font-medium">
                    {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="p-3">
                    {getPriorityBadge(notice.priority)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedNoticeModal(notice)}
                        className="p-1 text-gray-400 hover:text-[#5542f6]"
                        title="View Notice Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNotice(notice._id, notice.title)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <div 
              key={notice._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-[#5542f6]">{notice.noticeNumber}</span>
                  {getPriorityBadge(notice.priority)}
                </div>

                <h3 
                  onClick={() => setSelectedNoticeModal(notice)}
                  className="font-extrabold text-sm text-gray-900 cursor-pointer hover:text-[#5542f6] transition-colors line-clamp-2"
                >
                  {notice.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{notice.content}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-gray-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString('en-GB') : '-'}
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSelectedNoticeModal(notice)}
                    className="text-[#5542f6] font-bold text-xs hover:underline"
                  >
                    Read
                  </button>
                  <button 
                    onClick={() => handleDeleteNotice(notice._id, notice.title)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------- NOTICE VIEW MODAL ----------------- */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-[#5542f6]">{selectedNoticeModal.noticeNumber}</span>
                {getPriorityBadge(selectedNoticeModal.priority)}
              </div>
              <button 
                onClick={() => setSelectedNoticeModal(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-snug">{selectedNoticeModal.title}</h2>
              <div className="flex items-center space-x-4 text-[11px] text-gray-400 mt-1">
                <span>Audience: <b>{selectedNoticeModal.sentTo || selectedNoticeModal.targetAudience}</b></span>
                <span>Date: <b>{selectedNoticeModal.publishDate ? new Date(selectedNoticeModal.publishDate).toLocaleDateString('en-GB') : '-'}</b></span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed max-h-[300px] overflow-y-auto">
              {selectedNoticeModal.content}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
              <span className="text-gray-400">Issued By: <b>{selectedNoticeModal.createdByRole}</b></span>
              <button 
                onClick={() => setSelectedNoticeModal(null)}
                className="px-4 py-2 bg-[#5542f6] text-white rounded-lg font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

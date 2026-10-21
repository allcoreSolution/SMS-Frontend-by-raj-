import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Star,
  History,
  ChevronDown,
  Copy,
  FileText,
  Download,
  Printer,
  Columns,
  LayoutGrid,
  List,
  LibraryBig,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCw,
  Bookmark,
  Calendar,
  CreditCard,
  Plus,
  X,
  Send,
  Eye,
  Check,
  ShieldCheck,
  ExternalLink,
  BookMarked,
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import parentService from '../../api/parentService';

export default function Library({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [libraryData, setLibraryData] = useState(null);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeTab, setActiveTab] = useState('activeIssues'); // 'activeIssues' | 'history' | 'catalog' | 'requests'

  // Modals
  const [selectedBook, setSelectedBook] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({ title: '', author: '', category: 'Science & Physics', notes: '' });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(null);

  // Fine Payment Modal
  const [payFineModalOpen, setPayFineModalOpen] = useState(false);
  const [selectedFineIssue, setSelectedFineIssue] = useState(null);
  const [payingFine, setPayingFine] = useState(false);
  const [fineSuccess, setFineSuccess] = useState(null);

  // Renewal state
  const [renewingId, setRenewingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Library Card Modal
  const [cardModalOpen, setCardModalOpen] = useState(false);

  // Load library data
  const fetchLibraryData = async (isBackground = false) => {
    try {
      if (!isBackground) setRefreshing(true);
      const params = {};
      if (activeChild) params.studentId = activeChild;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await parentService.getLibraryData(params);
      if (res?.success && res.data) {
        setLibraryData(res.data);
        setError(null);
      } else {
        setError(res?.message || 'Failed to fetch library information');
      }
    } catch (err) {
      console.error('Error fetching library details:', err);
      setError('Unable to reach library server. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLibraryData(false);
  }, [activeChild, selectedCategory]);

  // Handle Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchLibraryData(false);
  };

  // Handle Book Reservation
  const handleReserveBook = async (book) => {
    try {
      setRefreshing(true);
      const res = await parentService.reserveBook({
        bookId: book._id,
        studentName: `${libraryData?.student?.name || 'Aarav Sharma'} (${libraryData?.student?.className || 'Class I-A'})`
      });
      if (res?.success) {
        setNotification({ type: 'success', message: res.message });
        setTimeout(() => setNotification(null), 5000);
        setSelectedBook(null);
        await fetchLibraryData(true);
      }
    } catch (err) {
      console.error('Reservation error:', err);
      setNotification({ type: 'error', message: 'Failed to reserve book. Please try again.' });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle Title Request submission
  const handleSubmitTitleRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.title.trim()) return;
    setRequestSubmitting(true);
    try {
      const res = await parentService.requestNewBook({
        title: requestForm.title,
        author: requestForm.author,
        category: requestForm.category,
        studentName: `${libraryData?.student?.name || 'Aarav Sharma'} (${libraryData?.student?.className || 'Class I-A'})`,
        notes: requestForm.notes
      });
      if (res?.success) {
        setRequestSuccess(res.message);
        setTimeout(() => {
          setRequestSuccess(null);
          setRequestModalOpen(false);
          setRequestForm({ title: '', author: '', category: 'Science & Physics', notes: '' });
        }, 3000);
        await fetchLibraryData(true);
      }
    } catch (err) {
      console.error('Title request error:', err);
    } finally {
      setRequestSubmitting(false);
    }
  };

  // Handle Book Renewal
  const handleRenewBook = async (issueId) => {
    try {
      setRenewingId(issueId);
      const res = await parentService.renewIssuedBook(issueId);
      if (res?.success) {
        setNotification({ type: 'success', message: res.message });
        setTimeout(() => setNotification(null), 5000);
        await fetchLibraryData(true);
      }
    } catch (err) {
      console.error('Renewal error:', err);
      setNotification({ type: 'error', message: 'Failed to renew book. Please contact librarian.' });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setRenewingId(null);
    }
  };

  // Handle Pay Fine
  const handlePayFine = async () => {
    if (!selectedFineIssue) return;
    setPayingFine(true);
    try {
      const res = await parentService.payLibraryFine(selectedFineIssue._id);
      if (res?.success) {
        setFineSuccess(res.message);
        setTimeout(() => {
          setFineSuccess(null);
          setPayFineModalOpen(false);
          setSelectedFineIssue(null);
        }, 3000);
        await fetchLibraryData(true);
      }
    } catch (err) {
      console.error('Fine payment error:', err);
    } finally {
      setPayingFine(false);
    }
  };

  if (loading && !libraryData) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto min-h-[600px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#353A40] border-t-indigo-600 rounded-none animate-spin mb-4"></div>
        <p className="text-gray-700 font-bold text-[15px]">Connecting to Central Library Catalog...</p>
        <p className="text-gray-400 text-[12px] mt-1">Retrieving Borrowed Books & Active Digital Memberships</p>
      </div>
    );
  }

  const { student, stats, activeIssues = [], borrowingHistory = [], catalogBooks = [], categories = [], myRequests = [] } = libraryData || {};

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto min-h-screen bg-[#f8f9fa] space-y-5">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`p-4 border text-[13px] font-semibold flex items-center justify-between shadow-sm transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-red-50 border-red-300 text-red-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-gray-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          TOP COMMAND HEADER & LIBRARY MEMBERSHIP CARD
          ========================================================================= */}
      <div className="bg-[#353A40] text-white p-5 md:p-6 rounded-none shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[20px] md:text-[22px] font-bold tracking-tight">
                  Central School Library
                </h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-extrabold uppercase tracking-wider">
                  Active Membership
                </span>
              </div>
              <p className="text-[12.5px] text-gray-300 mt-1 flex items-center gap-2 flex-wrap">
                <span>Member: <strong className="text-white">{student?.name || 'Aarav Sharma'}</strong> ({student?.className || 'Class I-A'})</span>
                <span className="text-gray-500">•</span>
                <span>Card No: <strong className="text-yellow-400 font-mono">{student?.libraryCard?.cardNumber || 'LIB-CARD-8841'}</strong></span>
                <span className="text-gray-500">•</span>
                <span>Borrow Limit: <strong className="text-gray-200">Max 3 Books (14 Days)</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            <button
              onClick={() => setCardModalOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-300" />
              <span>Digital Card</span>
            </button>

            <button
              onClick={() => setRequestModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Request New Book</span>
            </button>

            <button
              onClick={() => fetchLibraryData(false)}
              disabled={refreshing}
              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 text-[12px] font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>

        </div>

        {/* 4 Metrics Counter Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 p-3 text-center">
            <span className="text-[22px] font-extrabold tracking-tight font-mono text-white block leading-none">
              {stats?.issuedCount || 0}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1.5 block">
              Currently Issued
            </span>
          </div>

          <div className={`p-3 text-center border ${
            (stats?.overdueCount || 0) > 0 ? 'bg-red-500/20 border-red-500/40 text-red-200' : 'bg-white/5 border-white/10 text-white'
          }`}>
            <span className="text-[22px] font-extrabold tracking-tight font-mono text-white block leading-none">
              {stats?.overdueCount || 0}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold mt-1.5 block">
              Overdue Copies
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 text-center">
            <span className="text-[22px] font-extrabold tracking-tight font-mono text-emerald-400 block leading-none">
              {stats?.totalRead || 0}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1.5 block">
              Total Read / Returned
            </span>
          </div>

          <div className={`p-3 text-center border ${
            (stats?.totalFine || 0) > 0 ? 'bg-amber-500/20 border-amber-500/40' : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[22px] font-extrabold tracking-tight font-mono text-yellow-400 leading-none">
                ₹{stats?.totalFine || 0}
              </span>
              {(stats?.totalFine || 0) > 0 && activeIssues.find(i => i.fineAmount > 0) && (
                <button
                  onClick={() => {
                    const overdueIssue = activeIssues.find(i => i.fineAmount > 0);
                    setSelectedFineIssue(overdueIssue);
                    setPayFineModalOpen(true);
                  }}
                  className="px-2 py-0.5 bg-yellow-500 text-gray-950 text-[10px] font-extrabold uppercase hover:bg-yellow-400 transition-colors"
                >
                  Pay
                </button>
              )}
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1.5 block">
              Pending Library Fine
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEARCH BAR STRIP & CATEGORY FILTER
          ========================================================================= */}
      <div className="bg-white border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Category dropdown */}
        <div className="w-full md:w-[220px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] bg-white outline-none focus:border-indigo-500 font-medium text-gray-700"
          >
            <option value="All">All Categories ({catalogBooks.length})</option>
            {categories.map(cat => (
              <option key={cat._id || cat.name} value={cat.name}>
                {cat.name} ({cat.booksCount || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, publisher or ISBN..."
              className="w-full border border-gray-300 rounded-none pl-9 pr-4 py-2 text-[13px] outline-none focus:border-indigo-500 text-gray-700 placeholder-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* View mode toggle */}
        <div className="flex items-center border border-gray-300 p-0.5 self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-none transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-none transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          RECENTLY ADDED / FEATURED BOOKS CAROUSEL SHELF
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2 tracking-tight">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>Featured Library Titles & Textbooks</span>
          </h2>
          <span className="text-[12px] text-gray-500 font-medium">
            Showing {catalogBooks.length} available catalog items
          </span>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-3 -mx-1 px-1 custom-scrollbar">
          {catalogBooks.slice(0, 8).map(book => {
            const isAvail = (book.available || 0) > 0;
            return (
              <div
                key={book._id}
                onClick={() => setSelectedBook(book)}
                className="min-w-[180px] max-w-[180px] flex flex-col border border-gray-200 bg-white rounded-none hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Book Cover Image */}
                <div className="h-[210px] w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-[9px] font-mono px-1.5 py-0.5">
                    {book.shelfNumber || 'Wing A'}
                  </div>
                </div>

                {/* Book Details Info */}
                <div className="p-3 flex-1 flex flex-col justify-between border-t border-gray-100">
                  <div>
                    <h3 className="font-bold text-[13px] text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 truncate">{book.author}</p>
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wide text-purple-700 bg-purple-50 px-1.5 py-0.5 mt-1.5 inline-block border border-purple-100">
                      {book.category}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className={`font-bold px-1.5 py-0.5 text-[10px] ${
                      isAvail ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                    }`}>
                      {book.available}/{book.quantity} copies
                    </span>
                    <span className="text-indigo-600 font-bold group-hover:underline text-[11px] flex items-center">
                      View <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          BORROWING MANAGEMENT & CIRCULATION TABS
          ========================================================================= */}
      <div className="bg-white border border-gray-200 shadow-sm">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('activeIssues')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'activeIssues'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookMarked className="w-4 h-4 text-indigo-600" />
            <span>Currently Issued ({activeIssues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <History className="w-4 h-4 text-emerald-600" />
            <span>Borrowing History ({borrowingHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'catalog'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Full Catalog Directory ({catalogBooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'requests'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>My Book Requests ({myRequests.length})</span>
          </button>
        </div>

        {/* TAB 1: CURRENTLY ISSUED BOOKS TABLE & ACTIONS */}
        {activeTab === 'activeIssues' && (
          <div className="p-4 md:p-5">
            {activeIssues.length === 0 ? (
              <div className="py-16 text-center">
                <LibraryBig className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-[15px] text-gray-800">No active books currently borrowed</h3>
                <p className="text-[12.5px] text-gray-500 mt-1">Aarav has 3 borrowing slots available in the library.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeIssues.map((issue) => {
                    const isOverdue = issue.status === 'Overdue';
                    const book = issue.book || {};
                    const issueDateStr = issue.issueDate ? new Date(issue.issueDate).toLocaleDateString('en-GB') : '25-09-2026';
                    const dueDateStr = issue.dueDate ? new Date(issue.dueDate).toLocaleDateString('en-GB') : '11-10-2026';

                    return (
                      <div
                        key={issue._id}
                        className={`border p-4 flex flex-col justify-between transition-all ${
                          isOverdue ? 'bg-red-50/40 border-red-300 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${
                              isOverdue
                                ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}>
                              {isOverdue ? 'Overdue' : 'Active Borrowed'}
                            </span>

                            {issue.fineAmount > 0 && (
                              <span className="text-[11px] font-extrabold text-red-700 bg-red-100 px-2 py-0.5 border border-red-200">
                                Fine: ₹{issue.fineAmount}
                              </span>
                            )}
                          </div>

                          <div className="flex items-start gap-3 mt-3">
                            <img
                              src={book.coverUrl || 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400&auto=format&fit=crop&q=80'}
                              alt={book.title || 'Book Cover'}
                              className="w-14 h-20 object-cover border border-gray-300 flex-shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-[14px] text-gray-900 leading-snug line-clamp-2">
                                {book.title || issue.memberName || 'Library Book'}
                              </h4>
                              <p className="text-[11.5px] text-gray-500 mt-0.5">{book.author || 'Author'}</p>
                              <p className="text-[11px] text-gray-400 mt-1 font-mono">
                                {book.shelfNumber || 'Shelf S-01'} • {book.rackNumber || 'Rack 12'}
                              </p>
                            </div>
                          </div>

                          {/* Borrowing Timings */}
                          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-200/80 text-[11px]">
                            <div>
                              <span className="text-gray-400 block text-[9.5px] uppercase font-bold">Issued On</span>
                              <strong className="text-gray-800">{issueDateStr}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[9.5px] uppercase font-bold">Due Date</span>
                              <strong className={isOverdue ? 'text-red-700' : 'text-gray-900'}>{dueDateStr}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-gray-200/80 flex items-center gap-2">
                          <button
                            onClick={() => handleRenewBook(issue._id)}
                            disabled={renewingId === issue._id}
                            className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11.5px] font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <RotateCw className={`w-3.5 h-3.5 ${renewingId === issue._id ? 'animate-spin' : ''}`} />
                            <span>{renewingId === issue._id ? 'Renewing...' : 'Renew (+14 Days)'}</span>
                          </button>

                          {issue.fineAmount > 0 && (
                            <button
                              onClick={() => {
                                setSelectedFineIssue(issue);
                                setPayFineModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11.5px] font-bold transition-colors"
                            >
                              Pay Fine
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BORROWING HISTORY TABLE */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            {borrowingHistory.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-[13px]">
                No returned books found in history.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-200 text-[10.5px] font-extrabold uppercase text-gray-600 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Book Title & Author</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Issued Date</th>
                    <th className="px-4 py-3">Returned Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-[12.5px] text-gray-700">
                  {borrowingHistory.map((item, idx) => {
                    const book = item.book || {};
                    return (
                      <tr key={item._id || idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                            <div>
                              <strong className="text-gray-900 block leading-tight">{book.title || 'Library Title'}</strong>
                              <span className="text-[11px] text-gray-500">{book.author || 'Author'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 border">
                            {book.category || 'General'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {item.issueDate ? new Date(item.issueDate).toLocaleDateString('en-GB') : '01-08-2026'}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                          {item.returnDate ? new Date(item.returnDate).toLocaleDateString('en-GB') : '15-08-2026'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
                            Returned (OK)
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-gray-500">
                          {item.remarks || 'Returned on time'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: FULL CATALOG DIRECTORY */}
        {activeTab === 'catalog' && (
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {catalogBooks.map(book => (
                <div
                  key={book._id}
                  onClick={() => setSelectedBook(book)}
                  className="border border-gray-200 bg-white p-3.5 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'}
                      alt={book.title}
                      className="w-16 h-24 object-cover border border-gray-300 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-[13px] text-gray-900 leading-snug line-clamp-2" title={book.title}>
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{book.author}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-1">{book.isbn}</p>
                      <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1 py-0.5 mt-1 inline-block border border-purple-100">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-700">
                      {book.available} in stock
                    </span>
                    <button className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-bold">
                      View / Reserve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MY BOOK REQUESTS */}
        {activeTab === 'requests' && (
          <div className="p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-bold text-[13px] text-gray-800">
                Procurement & Reservation Inquiries for {student?.name || 'Aarav Sharma'}
              </span>
              <button
                onClick={() => setRequestModalOpen(true)}
                className="px-3 py-1 bg-indigo-600 text-white text-[11.5px] font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Request Title
              </button>
            </div>

            {myRequests.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-[13px]">
                No pending or approved title requests.
              </div>
            ) : (
              <div className="space-y-2.5">
                {myRequests.map((req, i) => (
                  <div key={req._id || i} className="p-3 bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[13.5px] text-gray-900">{req.title}</h4>
                      <p className="text-[11.5px] text-gray-500">By {req.author} • Requested on {new Date(req.requestDate || Date.now()).toLocaleDateString('en-GB')}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${
                      req.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : req.status === 'Procured'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* =========================================================================
          BOOK DETAILS & RESERVATION MODAL
          ========================================================================= */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[550px] w-full p-6 shadow-2xl border-t-4 border-indigo-600 relative">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={selectedBook.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'}
                alt={selectedBook.title}
                className="w-32 h-44 object-cover border border-gray-300 flex-shrink-0 mx-auto sm:mx-0 shadow-md"
              />

              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 border border-purple-100 inline-block">
                  {selectedBook.category}
                </span>

                <h3 className="text-[17px] font-bold text-gray-900 mt-1 leading-snug">
                  {selectedBook.title}
                </h3>
                <p className="text-[12.5px] text-gray-600 mt-0.5">Author: <strong className="text-gray-900">{selectedBook.author}</strong></p>
                <p className="text-[11.5px] text-gray-500">Publisher: {selectedBook.publisher || 'NCERT / Educational Press'}</p>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px] font-mono">
                  <div>
                    <span className="text-gray-400 block text-[9.5px] uppercase">Shelf & Rack</span>
                    <strong className="text-gray-800">{selectedBook.shelfNumber || 'Shelf S-01'} / {selectedBook.rackNumber || 'Rack 12'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9.5px] uppercase">Stock Available</span>
                    <strong className="text-emerald-700">{selectedBook.available} of {selectedBook.quantity} Copies</strong>
                  </div>
                </div>

                <p className="text-[12px] text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                  {selectedBook.description || 'Reference textbook cataloged under CBSE curriculum guidelines.'}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedBook(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-[12px] font-semibold hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => handleReserveBook(selectedBook)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold flex items-center gap-1.5 shadow"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Reserve Copy for Aarav</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REQUEST NEW TITLE MODAL
          ========================================================================= */}
      {requestModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[500px] w-full p-6 shadow-2xl border-t-4 border-indigo-600 relative">
            <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Request New Book Title
            </h3>
            <p className="text-[12px] text-gray-500 mt-1">
              Suggest a book for the School Library Procurement Committee to purchase for students.
            </p>

            {requestSuccess ? (
              <div className="my-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[13px] font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{requestSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitTitleRequest} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Book Title *</label>
                  <input
                    type="text"
                    value={requestForm.title}
                    onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-indigo-600"
                    placeholder="e.g. Artificial Intelligence: A Modern Approach"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Author / Publication</label>
                  <input
                    type="text"
                    value={requestForm.author}
                    onChange={(e) => setRequestForm({ ...requestForm, author: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-indigo-600"
                    placeholder="e.g. Stuart Russell & Peter Norvig"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={requestForm.category}
                    onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-indigo-600"
                  >
                    <option>Science & Physics</option>
                    <option>Mathematics</option>
                    <option>Computer Science & AI</option>
                    <option>Literature & Fiction</option>
                    <option>Social Sciences & History</option>
                    <option>General Knowledge & Biographies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Purpose / Course Subject</label>
                  <textarea
                    rows={3}
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-indigo-600"
                    placeholder="Needed for robotics project / board exam preparation..."
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="px-4 py-2 border text-[12px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold shadow"
                  >
                    {requestSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PAY FINE ONLINE MODAL
          ========================================================================= */}
      {payFineModalOpen && selectedFineIssue && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[440px] w-full p-6 shadow-2xl border-t-4 border-yellow-500 relative">
            <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-yellow-600" />
              Pay Overdue Library Fine
            </h3>
            <p className="text-[12.5px] text-gray-500 mt-1">
              Clear fine for <strong>{selectedFineIssue.book?.title || 'Borrowed Book'}</strong>.
            </p>

            {fineSuccess ? (
              <div className="my-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[13px] font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{fineSuccess}</span>
              </div>
            ) : (
              <div className="mt-4 space-y-3.5">
                <div className="bg-gray-50 p-3.5 border border-gray-200">
                  <div className="flex justify-between text-[13px] font-semibold text-gray-700">
                    <span>Overdue Penalty Rate:</span>
                    <span>₹5.00 / day</span>
                  </div>
                  <div className="flex justify-between text-[16px] font-extrabold text-red-600 mt-2 pt-2 border-t border-gray-200">
                    <span>Total Fine Amount:</span>
                    <span>₹{selectedFineIssue.fineAmount || 15}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-[11.5px]">
                  Payment will be processed instantly via School Fee Gateway (UPI / NetBanking) and update the library clearance register.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => setPayFineModalOpen(false)}
                    className="px-4 py-2 border text-[12px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayFine}
                    disabled={payingFine}
                    className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold text-[12px] shadow"
                  >
                    {payingFine ? 'Processing...' : `Pay ₹${selectedFineIssue.fineAmount || 15} Online`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          DIGITAL LIBRARY CARD MODAL
          ========================================================================= */}
      {cardModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[420px] w-full p-6 shadow-2xl border-t-4 border-indigo-600 relative">
            <button
              onClick={() => setCardModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Smart ID Card Mockup */}
            <div className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] text-white p-5 rounded-none shadow-xl border border-white/20 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-7 h-7 text-yellow-400" />
                  <div>
                    <h4 className="font-extrabold text-[14px] tracking-wide leading-tight">ALL CORE SOLUTIONS</h4>
                    <span className="text-[9px] uppercase tracking-widest text-indigo-200">Central Library Card</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-emerald-500 text-gray-950 px-2 py-0.5 font-extrabold">VERIFIED</span>
              </div>

              <div className="my-5 flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] uppercase text-indigo-300 font-semibold block">Cardholder Name</span>
                  <strong className="text-[16px] text-white tracking-wide">{student?.name || 'Aarav Sharma'}</strong>
                  <span className="text-[11.5px] text-gray-300 block">{student?.className || 'Class I-A'} • Roll #{student?.admissionNo || 'YIS-2024-101'}</span>
                </div>
                <div className="w-14 h-14 bg-white/10 border border-white/20 flex items-center justify-center font-mono font-bold text-[18px] text-yellow-400">
                  QR
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[10.5px] text-indigo-200 font-mono">
                <span>CARD: {student?.libraryCard?.cardNumber || 'LIB-CARD-8841'}</span>
                <span>EXP: 31/03/2027</span>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-gray-500 space-y-1">
              <p>• Card is non-transferable and valid across all school library branches.</p>
              <p>• Max 3 books can be checked out concurrently for up to 14 days.</p>
            </div>

            <div className="mt-5 pt-3 border-t flex justify-end">
              <button
                onClick={() => setCardModalOpen(false)}
                className="px-5 py-2 bg-gray-900 text-white font-bold text-[12px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

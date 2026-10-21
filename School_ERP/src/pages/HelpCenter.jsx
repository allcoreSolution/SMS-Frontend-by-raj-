import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Edit3, 
  Trash2, 
  FolderTree, 
  Sparkles, 
  Check, 
  X, 
  Clock, 
  Tag, 
  ArrowRight, 
  User, 
  Layers, 
  FileText, 
  HelpCircle,
  Share2,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import Swal from 'sweetalert2';
import { helpCenterService } from '../api/helpCenterService';
import HelpCenterNav from './help-center/HelpCenterNav';

export default function HelpCenter() {
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Reader Modal State
  const [readingArticle, setReadingArticle] = useState(null);

  // Create / Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    summary: '',
    content: '',
    author: 'ACS Support Team',
    status: 'Published',
    visibility: 'Public',
    tags: '',
    featured: false
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch live data from backend
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, catRes, artRes] = await Promise.all([
        helpCenterService.getStats().catch(() => ({ data: {} })),
        helpCenterService.getCategories().catch(() => ({ data: [] })),
        helpCenterService.getArticles().catch(() => ({ data: [] }))
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (catRes?.data) setCategories(catRes.data);
      if (artRes?.data) setArticles(artRes.data);
    } catch (err) {
      console.error('Failed to load help center data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        art.title?.toLowerCase().includes(q) ||
        art.summary?.toLowerCase().includes(q) ||
        art.content?.toLowerCase().includes(q) ||
        art.tags?.some((t) => t.toLowerCase().includes(q));

      const matchCat = selectedCategory === 'All' || art.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [articles, searchQuery, selectedCategory]);

  // Open Article Reader
  const handleOpenReader = async (art) => {
    setReadingArticle(art);
    try {
      // Trigger API to increment views and fetch latest
      const res = await helpCenterService.getArticleById(art._id);
      if (res?.data) {
        setReadingArticle(res.data);
        // update local list view count
        setArticles(prev => prev.map(a => a._id === art._id ? res.data : a));
      }
    } catch (err) {
      console.error('Error fetching article detail:', err);
    }
  };

  // Vote Article (Helpful / Unhelpful)
  const handleVote = async (articleId, voteType) => {
    try {
      const res = await helpCenterService.voteArticle(articleId, voteType);
      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Thank You!',
          text: 'Your feedback helps improve school documentation.',
          timer: 1600,
          showConfirmButton: false
        });

        if (readingArticle && readingArticle._id === articleId) {
          setReadingArticle(prev => ({
            ...prev,
            helpfulVotes: res.data.helpfulVotes,
            unhelpfulVotes: res.data.unhelpfulVotes
          }));
        }

        setArticles(prev => prev.map(a => a._id === articleId ? {
          ...a,
          helpfulVotes: res.data.helpfulVotes,
          unhelpfulVotes: res.data.unhelpfulVotes
        } : a));
      }
    } catch (err) {
      console.error('Failed to record vote:', err);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: categories[0]?.name || 'Getting Started',
      summary: '',
      content: '',
      author: 'ACS Support Team',
      status: 'Published',
      visibility: 'Public',
      tags: '',
      featured: false
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (art, e) => {
    e?.stopPropagation();
    setEditingArticle(art);
    setFormData({
      title: art.title || '',
      category: art.category || categories[0]?.name || 'Getting Started',
      summary: art.summary || '',
      content: art.content || '',
      author: art.author || 'ACS Support Team',
      status: art.status || 'Published',
      visibility: art.visibility || 'Public',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : '',
      featured: Boolean(art.featured)
    });
    setIsEditModalOpen(true);
  };

  // Delete Article
  const handleDeleteArticle = async (art, e) => {
    e?.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete Help Article?',
      text: `Are you sure you want to delete "${art.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const res = await helpCenterService.deleteArticle(art._id);
        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Article Deleted',
            timer: 1600,
            showConfirmButton: false
          });
          if (readingArticle?._id === art._id) setReadingArticle(null);
          fetchData();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err?.message || 'Failed to delete' });
      }
    }
  };

  // Form Submit (Create / Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Required Fields', text: 'Title and content are required.' });
      return;
    }

    try {
      setSubmitting(true);
      let res;
      if (editingArticle?._id) {
        res = await helpCenterService.updateArticle(editingArticle._id, formData);
      } else {
        res = await helpCenterService.createArticle(formData);
      }

      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: editingArticle ? 'Article Updated!' : 'Article Published!',
          timer: 1800,
          showConfirmButton: false
        });
        setIsEditModalOpen(false);
        fetchData();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.response?.data?.message || err.message || 'Operation failed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Navigation Header */}
      <HelpCenterNav
        counts={{
          articles: articles.length,
          categories: categories.length
        }}
        onRefresh={fetchData}
        loading={loading}
      />

      {/* HERO BANNER & SEARCH */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 p-8 sm:p-10 text-white shadow-xl shadow-blue-900/10 mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Institutional Documentation & Guides</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            How can we help you today?
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
            Search step-by-step guides, policy FAQs, video walkthroughs, and operational manuals across all School ERP modules.
          </p>

          {/* Search Bar inside Hero */}
          <div className="mt-6 relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. fee collection, attendance, marksheets, hostel, biometric)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-medium placeholder-slate-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ambient decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {stats.totalArticles || articles.length}
            </h3>
            <p className="text-xs font-semibold text-slate-500">Published Guides</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {stats.totalCategories || categories.length}
            </h3>
            <p className="text-xs font-semibold text-slate-500">Knowledge Categories</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {(stats.totalViews || 0).toLocaleString()}
            </h3>
            <p className="text-xs font-semibold text-slate-500">Article Reads</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {stats.totalHelpfulVotes || 0}
            </h3>
            <p className="text-xs font-semibold text-slate-500">Helpful Upvotes</p>
          </div>
        </div>
      </div>

      {/* CATEGORIES PILLS FILTER & ACTION */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Horizontal scrollable category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full flex-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({articles.length})
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === c.name
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{c.icon || '📖'}</span>
              <span>{c.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === c.name ? 'bg-white/20' : 'bg-slate-200'}`}>
                {c.articlesCount || 0}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Article</span>
        </button>
      </div>

      {/* ARTICLES GRID */}
      {loading ? (
        <div className="p-16 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading Knowledge Base articles from database...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">No Guides Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No articles matched your search query "${searchQuery}". Try different keywords.`
              : 'No articles currently published in this category.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            + Create New Guide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((art) => (
            <div
              key={art._id}
              onClick={() => handleOpenReader(art)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag & Actions */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {art.category}
                    </span>
                    {art.featured && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleOpenEdit(art, e)}
                      title="Edit Article"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteArticle(art, e)}
                      title="Delete Article"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {art.title}
                </h3>

                {/* Summary / Snippet */}
                <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.summary || art.content.substring(0, 140) + '...'}
                </p>

                {/* Tags if any */}
                {art.tags && art.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {art.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{art.views || 0}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{art.helpfulVotes || 0}</span>
                  </span>
                </div>

                <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          1. FULL ARTICLE READER MODAL
          ========================================== */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {readingArticle.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readingArticle.views} reads</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {readingArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setReadingArticle(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reader Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-sm text-slate-700 leading-relaxed font-sans">
              {readingArticle.summary && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-900 text-xs sm:text-sm font-medium">
                  {readingArticle.summary}
                </div>
              )}

              {/* Formatted Markdown-like text */}
              <div className="whitespace-pre-line prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm space-y-3">
                {readingArticle.content}
              </div>

              {/* Helpful Feedback Box */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Was this guide helpful?</h4>
                  <p className="text-[11px] text-slate-500">
                    {readingArticle.helpfulVotes || 0} users found this guide useful
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(readingArticle._id, 'helpful')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes ({readingArticle.helpfulVotes || 0})</span>
                  </button>
                  <button
                    onClick={() => handleVote(readingArticle._id, 'unhelpful')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[11px] text-slate-400">
                Author: {readingArticle.author || 'ACS Documentation Desk'}
              </span>
              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          2. CREATE / EDIT ARTICLE MODAL
          ========================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    {editingArticle ? 'Edit Knowledge Article' : 'Publish New Guide'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Compose institutional documentation & operational steps</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. How to Collect Fees & Print Instant Receipts"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all text-xs sm:text-sm"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Publish Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Summary / Overview</label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief one-sentence explanation of what this guide explains"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>

              {/* Content Body */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Detailed Article Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="9"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write clear instructions, steps, requirements, tips and notes here..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Tags & Featured */}
              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1.5">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g. fees, challan, receipt, payment"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <label htmlFor="featured" className="font-bold text-slate-700 cursor-pointer">
                    Pin as Featured
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingArticle ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

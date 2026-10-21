import React, { useState } from 'react';
import { Plus, Search, BookOpen, Edit, Trash2, Eye, ChevronRight, X, Save, AlertTriangle } from 'lucide-react';

const initKb = [
  { id: 1, category: 'Getting Started', icon: '🚀', articles: [
    { id: 11, title: 'How to register your school', views: 2340, status: 'Published', content: 'Step-by-step guide to register your school on the platform. Visit the registration page and fill in your school details...' },
    { id: 12, title: 'Setting up your first branch', views: 1890, status: 'Published', content: 'After registering your school, you can add branches from the Branch Management section...' },
    { id: 13, title: 'Adding students in bulk', views: 1560, status: 'Published', content: 'Use the bulk import feature to add multiple students at once using an Excel template...' },
  ]},
  { id: 2, category: 'Fee Management', icon: '💰', articles: [
    { id: 21, title: 'Creating fee types and groups', views: 3200, status: 'Published', content: 'Fee types define the different kinds of fees your school collects. Go to Finance > Fee Types to create them...' },
    { id: 22, title: 'Assigning fees to students', views: 2800, status: 'Published', content: 'Once fee types are created, you can assign them to individual students or entire classes...' },
    { id: 23, title: 'Generating fee challans', views: 2100, status: 'Published', content: 'Fee challans can be generated individually or in bulk from the Finance module...' },
    { id: 24, title: 'Online fee collection setup', views: 1700, status: 'Draft', content: 'To enable online fee collection, configure your payment gateway in Settings > Payment Gateway...' },
  ]},
  { id: 3, category: 'Attendance', icon: '📋', articles: [
    { id: 31, title: 'Taking daily attendance', views: 1900, status: 'Published', content: 'Daily attendance can be marked from the Attendance module. Select the class and date...' },
    { id: 32, title: 'QR code attendance setup', views: 1400, status: 'Published', content: 'QR code attendance allows students to mark their own attendance by scanning a QR code...' },
  ]},
  { id: 4, category: 'Reports & Analytics', icon: '📊', articles: [
    { id: 41, title: 'Generating student reports', views: 1200, status: 'Published', content: 'Student reports can be generated from the Reports module. Select the report type and date range...' },
    { id: 42, title: 'Finance report overview', views: 980, status: 'Published', content: 'The finance report gives a complete overview of all fee collections, pending dues, and expenses...' },
  ]},
];

const emptyArticle = { title: '', status: 'Published', content: '' };

const ArticleModal = ({ data, setData, onSave, onClose, title, saveLabel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
        <h2 className="font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Article Title</label>
          <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} placeholder="Article title..."
            className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
          <select value={data.status} onChange={e => setData({ ...data, status: e.target.value })}
            className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
            <option>Published</option><option>Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Content</label>
          <textarea value={data.content} onChange={e => setData({ ...data, content: e.target.value })} rows={6} placeholder="Write article content..."
            className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
        </div>
      </div>
      <div className="p-5 pt-0 flex gap-3">
        <button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
          <Save className="w-4 h-4" /> {saveLabel}
        </button>
        <button onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  </div>
);

export default function KnowledgeBase() {
  const [kb, setKb] = useState(initKb);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState([1]);
  const [viewArticle, setViewArticle] = useState(null);
  const [editArticle, setEditArticle] = useState(null);
  const [deleteArticle, setDeleteArticle] = useState(null);
  const [addArticleCatId, setAddArticleCatId] = useState(null);
  const [articleForm, setArticleForm] = useState(emptyArticle);
  const [showAddGlobal, setShowAddGlobal] = useState(false);
  const [globalForm, setGlobalForm] = useState({ ...emptyArticle, catId: 1 });

  const toggle = (id) => setExpanded(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);

  const totalArticles = kb.reduce((a, c) => a + c.articles.length, 0);
  const totalViews = kb.reduce((a, c) => a + c.articles.reduce((b, ar) => b + ar.views, 0), 0);

  const handleAddArticle = () => {
    setKb(prev => prev.map(cat => cat.id === addArticleCatId
      ? { ...cat, articles: [...cat.articles, { ...articleForm, id: Date.now(), views: 0 }] }
      : cat
    ));
    setAddArticleCatId(null);
    setArticleForm(emptyArticle);
  };

  const handleAddGlobal = () => {
    setKb(prev => prev.map(cat => cat.id === globalForm.catId
      ? { ...cat, articles: [...cat.articles, { title: globalForm.title, status: globalForm.status, content: globalForm.content, id: Date.now(), views: 0 }] }
      : cat
    ));
    setShowAddGlobal(false);
    setGlobalForm({ ...emptyArticle, catId: 1 });
  };

  const handleSaveEdit = () => {
    setKb(prev => prev.map(cat => ({
      ...cat,
      articles: cat.articles.map(a => a.id === editArticle.id ? editArticle : a),
    })));
    setEditArticle(null);
  };

  const handleDelete = () => {
    setKb(prev => prev.map(cat => ({
      ...cat,
      articles: cat.articles.filter(a => a.id !== deleteArticle.id),
    })));
    setDeleteArticle(null);
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Knowledge Base</h1>
          <p className="text-sm text-gray-500 mt-1">Help articles and documentation for schools</p>
        </div>
        <button onClick={() => { setGlobalForm({ ...emptyArticle, catId: kb[0]?.id || 1 }); setShowAddGlobal(true); }} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Categories', value: kb.length },
          { label: 'Total Articles', value: totalArticles },
          { label: 'Total Views', value: totalViews.toLocaleString() },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
          className="pl-9 pr-4 py-2 border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-full max-w-sm bg-white" />
      </div>

      <div className="space-y-3">
        {kb.map(cat => (
          <div key={cat.id} className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden">
            <button onClick={() => toggle(cat.id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div className="text-left">
                  <p className="font-bold text-gray-800">{cat.category}</p>
                  <p className="text-xs text-gray-500">{cat.articles.length} articles</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded.includes(cat.id) ? 'rotate-90' : ''}`} />
            </button>

            {expanded.includes(cat.id) && (
              <div className="border-t border-gray-100">
                {cat.articles
                  .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()))
                  .map(article => (
                    <div key={article.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <p className="flex-1 text-sm text-gray-700 font-medium">{article.title}</p>
                      <span className="text-xs text-gray-400">{article.views.toLocaleString()} views</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${article.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {article.status}
                      </span>
                      <div className="flex gap-1">
                        <button onClick={() => setViewArticle(article)} className="p-1 hover:bg-blue-50 rounded-none text-blue-400" title="View"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditArticle({ ...article })} className="p-1 hover:bg-green-50 rounded-none text-green-400" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteArticle(article)} className="p-1 hover:bg-red-50 rounded-none text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                <div className="px-4 py-2">
                  <button onClick={() => { setArticleForm(emptyArticle); setAddArticleCatId(cat.id); }} className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-semibold">
                    <Plus className="w-3.5 h-3.5" /> Add Article
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {viewArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-none mb-2 inline-block ${viewArticle.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{viewArticle.status}</span>
                <h2 className="font-bold text-gray-800 text-lg">{viewArticle.title}</h2>
                <p className="text-xs text-gray-400 mt-1">{viewArticle.views.toLocaleString()} views</p>
              </div>
              <button onClick={() => setViewArticle(null)} className="p-2 hover:bg-gray-100 rounded-none flex-shrink-0"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-700 leading-relaxed">{viewArticle.content}</p>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => { setViewArticle(null); setEditArticle({ ...viewArticle }); }} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Edit className="w-4 h-4" /> Edit Article
              </button>
              <button onClick={() => setViewArticle(null)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {addArticleCatId && <ArticleModal data={articleForm} setData={setArticleForm} onSave={handleAddArticle} onClose={() => setAddArticleCatId(null)} title="Add Article" saveLabel="Add Article" />}

      {/* GLOBAL NEW ARTICLE MODAL */}
      {showAddGlobal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-800">New Article</h2>
              <button onClick={() => setShowAddGlobal(false)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select value={globalForm.catId} onChange={e => setGlobalForm({ ...globalForm, catId: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {kb.map(c => <option key={c.id} value={c.id}>{c.icon} {c.category}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Article Title</label>
                <input value={globalForm.title} onChange={e => setGlobalForm({ ...globalForm, title: e.target.value })} placeholder="Article title..."
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select value={globalForm.status} onChange={e => setGlobalForm({ ...globalForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  <option>Published</option><option>Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Content</label>
                <textarea value={globalForm.content} onChange={e => setGlobalForm({ ...globalForm, content: e.target.value })} rows={6} placeholder="Write article content..."
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={handleAddGlobal} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Save className="w-4 h-4" /> Add Article
              </button>
              <button onClick={() => setShowAddGlobal(false)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {editArticle && <ArticleModal data={editArticle} setData={setEditArticle} onSave={handleSaveEdit} onClose={() => setEditArticle(null)} title="Edit Article" saveLabel="Save Changes" />}

      {deleteArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete Article?</h2>
            <p className="text-sm text-gray-500 mb-6">Delete <span className="font-semibold text-gray-700">"{deleteArticle.title}"</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteArticle(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

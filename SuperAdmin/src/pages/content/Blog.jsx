import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Tag, X, Save, AlertTriangle } from 'lucide-react';

const initPosts = [
  { id: 1, title: 'How to Set Up Fee Management in School ERP', category: 'Tutorial', status: 'Published', author: 'Rahul Sharma', date: 'Sep 01, 2024', views: 1240, content: 'Fee management is one of the most critical modules in any school ERP system. This guide walks you through the complete setup process...' },
  { id: 2, title: 'Top 10 Benefits of Digital Attendance', category: 'Tips', status: 'Published', author: 'Priya Singh', date: 'Aug 28, 2024', views: 980, content: 'Digital attendance systems have revolutionized how schools track student presence. Here are the top 10 benefits...' },
  { id: 3, title: 'New Feature: AI-Powered Report Cards', category: 'Updates', status: 'Published', author: 'Rahul Sharma', date: 'Aug 25, 2024', views: 756, content: 'We are excited to announce our new AI-powered report card generation feature...' },
  { id: 4, title: 'School ERP vs Traditional Management', category: 'Insights', status: 'Draft', author: 'Amit Kumar', date: 'Aug 22, 2024', views: 0, content: 'A detailed comparison between modern school ERP systems and traditional paper-based management...' },
  { id: 5, title: 'Parent App: Complete Guide for Schools', category: 'Tutorial', status: 'Published', author: 'Priya Singh', date: 'Aug 18, 2024', views: 1560, content: 'The parent app is a powerful tool that keeps parents connected with their child\'s school activities...' },
  { id: 6, title: 'Upcoming Features in Q4 2024', category: 'Updates', status: 'Draft', author: 'Rahul Sharma', date: 'Sep 01, 2024', views: 0, content: 'We have exciting features planned for Q4 2024 including biometric integration, AI analytics...' },
];

const categories = ['All', 'Tutorial', 'Tips', 'Updates', 'Insights'];
const authors = ['Rahul Sharma', 'Priya Singh', 'Amit Kumar'];
const emptyForm = { title: '', category: 'Tutorial', status: 'Draft', author: 'Rahul Sharma', content: '' };

const PostForm = ({ data, setData, onSave, onClose, title, saveLabel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
        <h2 className="font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
          <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} placeholder="Post title..."
            className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Category', key: 'category', options: ['Tutorial', 'Tips', 'Updates', 'Insights'] },
            { label: 'Status', key: 'status', options: ['Draft', 'Published'] },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
              <select value={data[f.key]} onChange={e => setData({ ...data, [f.key]: e.target.value })}
                className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Author</label>
          <select value={data.author} onChange={e => setData({ ...data, author: e.target.value })}
            className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
            {authors.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Content</label>
          <textarea value={data.content} onChange={e => setData({ ...data, content: e.target.value })} rows={6} placeholder="Write your post content..."
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

export default function Blog() {
  const [posts, setPosts] = useState(initPosts);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [filter, setFilter] = useState('All');
  const [viewPost, setViewPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'All' || p.category === cat;
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchCat && matchFilter;
  });

  const handleAdd = () => {
    setPosts(prev => [{ ...form, id: Date.now(), views: 0, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }, ...prev]);
    setShowAdd(false); setForm(emptyForm);
  };

  const handleSaveEdit = () => {
    setPosts(prev => prev.map(p => p.id === editPost.id ? editPost : p));
    setEditPost(null);
  };

  const handleDelete = () => {
    setPosts(prev => prev.filter(p => p.id !== deletePost.id));
    setDeletePost(null);
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">Manage blog posts and content</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowAdd(true); }} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Posts', value: posts.length },
          { label: 'Published', value: posts.filter(p => p.status === 'Published').length },
          { label: 'Drafts', value: posts.filter(p => p.status === 'Draft').length },
          { label: 'Total Views', value: posts.reduce((a, p) => a + p.views, 0).toLocaleString() },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1 rounded-none text-xs font-semibold transition-colors ${cat === c ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-48" />
            </div>
            {['All', 'Published', 'Draft'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-none text-xs font-semibold transition-colors ${filter === f ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Title', 'Category', 'Author', 'Status', 'Views', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800 max-w-xs"><p className="truncate">{p.title}</p></td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-none font-semibold w-max">
                      <Tag className="w-3 h-3" />{p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.author}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${p.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setViewPost(p)} className="p-1.5 hover:bg-blue-50 rounded-none text-blue-500" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => setEditPost({ ...p })} className="p-1.5 hover:bg-green-50 rounded-none text-green-500" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setDeletePost(p)} className="p-1.5 hover:bg-red-50 rounded-none text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-none font-semibold w-max"><Tag className="w-3 h-3" />{viewPost.category}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${viewPost.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{viewPost.status}</span>
                </div>
                <h2 className="font-bold text-gray-800 text-lg leading-tight">{viewPost.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{viewPost.author} · {viewPost.date} · {viewPost.views.toLocaleString()} views</p>
              </div>
              <button onClick={() => setViewPost(null)} className="p-2 hover:bg-gray-100 rounded-none flex-shrink-0"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-700 leading-relaxed">{viewPost.content}</p>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => { setViewPost(null); setEditPost({ ...viewPost }); }} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Edit className="w-4 h-4" /> Edit Post
              </button>
              <button onClick={() => setViewPost(null)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && <PostForm data={form} setData={setForm} onSave={handleAdd} onClose={() => setShowAdd(false)} title="New Blog Post" saveLabel="Publish Post" />}
      {editPost && <PostForm data={editPost} setData={setEditPost} onSave={handleSaveEdit} onClose={() => setEditPost(null)} title="Edit Post" saveLabel="Save Changes" />}

      {deletePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete Post?</h2>
            <p className="text-sm text-gray-500 mb-6">Delete <span className="font-semibold text-gray-700">"{deletePost.title}"</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePost(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  Lock, Plus, Edit, Trash2, LayoutList, LayoutGrid,
  FileText, FileSpreadsheet, Printer, Columns, Search,
  ChevronUp, ChevronDown, Folder
} from 'lucide-react';
import Swal from 'sweetalert2';

const ICON_COLORS = [
  'text-blue-500', 'text-purple-500', 'text-indigo-500',
  'text-green-500', 'text-orange-500', 'text-pink-500',
  'text-cyan-500', 'text-red-500', 'text-yellow-500',
];

const initCategories = [
  { id: 1, order: 1, name: 'Product Updates', slug: '/blog/category/product-updates', posts: 4, status: 'Active', iconColor: ICON_COLORS[0] },
  { id: 2, order: 2, name: 'AI & Technology', slug: '/blog/category/ai-technology', posts: 1, status: 'Active', iconColor: ICON_COLORS[1] },
  { id: 3, order: 3, name: 'Guides & Tutorials', slug: '/blog/category/guides-tutorials', posts: 2, status: 'Active', iconColor: ICON_COLORS[2] },
  { id: 4, order: 4, name: 'School Management', slug: '/blog/category/school-management', posts: 6, status: 'Active', iconColor: ICON_COLORS[4] },
  { id: 5, order: 5, name: 'Mobile App', slug: '/blog/category/mobile-app', posts: 1, status: 'Active', iconColor: ICON_COLORS[3] },
];

const PAGE_SIZES = [10, 25, 50, 100];

export default function BlogCategories() {
  const [categories, setCategories] = useState(initCategories);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Auto slug from name
  const handleNameChange = (val) => {
    setForm(f => ({
      ...f,
      name: val,
      slug: '/blog/category/' + val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  };

  // Open Add modal
  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', slug: '', description: '' });
    setFormError('');
    setShowModal(true);
  };

  // Open Edit modal
  const openEdit = (cat) => {
    setEditItem(cat);
    setForm({ name: cat.name, slug: cat.slug, description: '' });
    setFormError('');
    setShowModal(true);
  };

  // Save (Add or Edit)
  const handleSave = () => {
    if (!form.name.trim()) { setFormError('Category name is required.'); return; }
    if (!form.slug.trim()) { setFormError('Slug is required.'); return; }

    if (editItem) {
      setCategories(prev => prev.map(c =>
        c.id === editItem.id ? { ...c, name: form.name.trim(), slug: form.slug.trim() } : c
      ));
      showToast('Category updated successfully!');
    } else {
      const newCat = {
        id: Date.now(),
        order: categories.length + 1,
        name: form.name.trim(),
        slug: form.slug.trim(),
        posts: 0,
        status: 'Active',
        iconColor: ICON_COLORS[categories.length % ICON_COLORS.length],
      };
      setCategories(prev => [...prev, newCat]);
      showToast('Category added successfully!');
    }
    setShowModal(false);
  };

  // Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories(prev => prev.filter(c => c.id !== id));
        showToast('Category deleted.', 'error');
      }
    });
  };

  // Reorder
  const moveUp = (id) => {
    const idx = categories.findIndex(c => c.id === id);
    if (idx === 0) return;
    const reordered = [...categories];
    [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
    setCategories(reordered.map((c, i) => ({ ...c, order: i + 1 })));
  };

  const moveDown = (id) => {
    const idx = categories.findIndex(c => c.id === id);
    if (idx === categories.length - 1) return;
    const reordered = [...categories];
    [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
    setCategories(reordered.map((c, i) => ({ ...c, order: i + 1 })));
  };

  // Filter
  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const displayed = filtered.slice(startIndex, startIndex + pageSize);

  const handleExport = (type) => Swal.fire({ icon: 'info', text: `${type} export coming soon.`, confirmButtonColor: '#0891b2' });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-none text-sm font-semibold shadow-lg text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-none shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">{editItem ? 'Edit Category' : 'Add New Category'}</h2>
            {formError && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-none px-3 py-2 mb-3">{formError}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Product Updates"
                  className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-purple-400 font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">Auto-generated from name. Editable.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 rounded-none text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-[#6610f2] text-white rounded-none text-sm font-bold hover:bg-purple-700 transition-colors">
                {editItem ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">Group your public website articles</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#6610f2] text-white rounded-none hover:bg-purple-700 text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          Add Category
        </button>
      </div>
{/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-none shadow-sm">
        {/* Section Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="font-semibold text-gray-800 flex items-center gap-2 text-base">
            <Folder className="w-5 h-5 text-blue-500" /> All Categories
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-none ${viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}>
              <LayoutList className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-none ${viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-300 rounded-none px-2 py-1 text-sm focus:outline-none"
              >
                {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {[
              { label: 'CSV', icon: <FileText className="w-3 h-3" /> },
              { label: 'Excel', icon: <FileSpreadsheet className="w-3 h-3" /> },
              { label: 'PDF', icon: <FileText className="w-3 h-3" /> },
              { label: '', icon: <Printer className="w-3.5 h-3.5" /> },
            ].map((btn, i) => (
              <button key={i} onClick={() => handleExport(btn.label || 'Print')}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium border border-gray-300 bg-white rounded-none hover:bg-gray-100 text-gray-600 transition-colors">
                {btn.icon}{btn.label}
              </button>
            ))}
            <button onClick={() => Swal.fire({ icon: 'info', text: 'Column settings', confirmButtonColor: '#0891b2' })}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium border border-gray-300 bg-white rounded-none hover:bg-gray-100 text-gray-600 transition-colors">
              <Columns className="w-3 h-3" /> Columns ▾
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search categories..."
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-purple-400 w-48"
            />
          </div>
        </div>

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border-r border-gray-200 w-24">
                    ORDER <span className="text-gray-300 font-normal">⇅</span>
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border-r border-gray-200">
                    NAME <span className="text-gray-300 font-normal">⇅</span>
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border-r border-gray-200">
                    SLUG <span className="text-gray-300 font-normal">⇅</span>
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border-r border-gray-200 w-24 text-center">
                    POSTS <span className="text-gray-300 font-normal">⇅</span>
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase border-r border-gray-200 w-28">
                    STATUS <span className="text-gray-300 font-normal">⇅</span>
                  </th>
                  <th className="px-4 py-2.5 text-xs font-bold text-gray-600 uppercase text-right pr-4 w-24">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayed.length > 0 ? displayed.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-purple-50 transition-colors">
                    {/* Order */}
                    <td className="px-4 py-3 border-r border-gray-100">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600 w-5">{cat.order}</span>
                        <div className="flex flex-col">
                          <button onClick={() => moveUp(cat.id)} className="text-gray-300 hover:text-gray-600 leading-none" title="Move up">
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveDown(cat.id)} className="text-gray-300 hover:text-gray-600 leading-none" title="Move down">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                    {/* Name */}
                    <td className="px-4 py-3 border-r border-gray-100">
                      <div className="flex items-center gap-2">
                        <Folder className={`w-5 h-5 flex-shrink-0 ${cat.iconColor}`} />
                        <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                      </div>
                    </td>
                    {/* Slug */}
                    <td className="px-4 py-3 border-r border-gray-100">
                      <code className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-none font-mono">{cat.slug}</code>
                    </td>
                    {/* Posts */}
                    <td className="px-4 py-3 border-r border-gray-100 text-center">
                      <span className="text-sm font-semibold text-gray-700">{cat.posts}</span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3 border-r border-gray-100">
                      <span className="text-sm font-semibold text-green-600">{cat.status}</span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-1.5 rounded-none hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-none hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-400">
                      No matching categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayed.length > 0 ? displayed.map(cat => (
              <div key={cat.id} className="border border-gray-200 rounded-none p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Folder className={`w-6 h-6 ${cat.iconColor}`} />
                  <span className="font-bold text-gray-800 text-sm">{cat.name}</span>
                </div>
                <code className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-none font-mono block mb-3 truncate">{cat.slug}</code>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{cat.posts} posts</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat)} className="p-1 rounded-none hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1 rounded-none hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            )) : (
              <p className="col-span-4 text-center py-8 text-sm text-gray-400">No matching categories found.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {filtered.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-xs border border-gray-300 rounded-none bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >«</button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-none bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded-none ${currentPage === page ? 'bg-[#6610f2] text-white border-[#6610f2]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
              >{page}</button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-none bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >›</button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-xs border border-gray-300 rounded-none bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >»</button>
          </div>
        </div>
      </div>
    </div>
  );
}

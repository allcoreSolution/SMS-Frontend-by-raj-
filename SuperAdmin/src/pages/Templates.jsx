import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Wand2, Edit2, ZoomIn, FileText, QrCode, X, LayoutGrid } from 'lucide-react';
import Swal from 'sweetalert2';

const emptyForm = { title: '', tag: 'Certificate' };

export default function Templates() {
  const [activeTag, setActiveTag] = useState('All');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('sa_templates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sa_templates', JSON.stringify(templates));
  }, [templates]);

  const computedTags = useMemo(() => {
    const counts = {};
    templates.forEach((t) => {
      (t.tags || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    const tagsArr = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return [{ name: 'All', count: templates.length }, ...tagsArr];
  }, [templates]);

  const filtered = templates.filter((t) => {
    const matchTag = activeTag === 'All' || (t.tags || []).includes(activeTag);
    const matchSearch = !search || (t.title || '').toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return Swal.fire('Error', 'Template Title is required', 'error');
    const colors = ['red', 'blue', 'green', 'purple'];
    setTemplates((prev) => [
      {
        id: Date.now(),
        title: form.title.trim(),
        tags: [form.tag || 'Certificate'],
        type: form.tag === 'ID Card' ? 'placeholder' : 'report',
        color: colors[prev.length % colors.length],
      },
      ...prev,
    ]);
    setForm(emptyForm);
    setShowAdd(false);
    Swal.fire({ icon: 'success', title: 'Template created!', timer: 1200, showConfirmButton: false });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete template?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete',
    }).then((r) => {
      if (r.isConfirmed) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        setEditTemplate(null);
      }
    });
  };

  const DocumentPreview = ({ type, color }) => {
    if (type === 'placeholder') {
      return (
        <div className="w-full h-[280px] bg-gray-100 flex flex-col items-center justify-center p-4 border-b border-gray-100">
          <FileText className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-[10px] font-bold text-gray-600">[school_name]</p>
          <p className="text-[12px] font-extrabold text-gray-800 mt-3">[student_name]</p>
          <QrCode className="w-8 h-8 text-gray-500 mt-3 opacity-60" />
        </div>
      );
    }
    const border = { red: 'border-red-600', blue: 'border-blue-600', green: 'border-teal-600', purple: 'border-purple-600' };
    const text = { red: 'text-red-700', blue: 'text-blue-700', green: 'text-teal-700', purple: 'text-purple-700' };
    return (
      <div className={`w-full h-[280px] bg-white border ${border[color] || 'border-blue-600'} flex flex-col p-4 mx-auto max-w-[260px] my-2`}>
        <h4 className={`text-[11px] font-black text-center ${text[color] || 'text-blue-700'}`}>YOUR SCHOOL NAME</h4>
        <div className="flex-1 border border-dashed border-gray-200 bg-gray-50 mt-3 flex items-center justify-center">
          <FileText className="w-10 h-10 text-gray-300" />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1150px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Ready Templates</h1>
          <p className="text-[13px] font-medium text-gray-500">Certificates, ID cards & documents</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => { setForm(emptyForm); setShowAdd(true); }}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 font-bold text-[13px]">
            <Plus className="w-4 h-4" /> Add New Template
          </button>
          <button type="button" onClick={() => setShowCanvas(true)}
            className="flex items-center gap-2 bg-[#6366f1] hover:bg-indigo-600 text-white px-4 py-2 font-bold text-[13px]">
            <Wand2 className="w-4 h-4" /> Canvas Designer
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-6 mb-6">
        <div className="relative w-full mb-6">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 text-[13px] w-full text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366f1]" />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {computedTags.map((tag) => (
            <button type="button" key={tag.name} onClick={() => setActiveTag(tag.name)}
              className={`flex items-center gap-2 px-3 py-1.5 text-[12px] font-bold border ${activeTag === tag.name ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'bg-white border-gray-200 text-gray-600'}`}>
              {activeTag === tag.name && <LayoutGrid className="w-3.5 h-3.5" />}
              {tag.name}
              <span className={`px-2 py-0.5 text-[10px] ${activeTag === tag.name ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{tag.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((template) => (
          <div key={template.id} onClick={() => setEditTemplate(template)}
            className="bg-white border border-gray-200 overflow-hidden flex flex-col hover:shadow-md cursor-pointer">
            <DocumentPreview type={template.type} color={template.color} />
            <div className="p-4 border-t border-gray-100">
              <h3 className="font-extrabold text-[14px] truncate">{template.title}</h3>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">{(template.tags && template.tags[0]) || ''}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500">No templates yet. Click Add New Template.</div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg text-gray-800">Add New Template</h2>
              <button type="button" onClick={() => setShowAdd(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Template Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 2026 Sports Certificate"
                  className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366f1]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Category Tag</label>
                <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white">
                  <option value="Marksheet">Marksheet</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Fee Receipt">Fee Receipt</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[#6366f1] hover:bg-indigo-600 text-white py-2.5 text-[13px] font-bold">Create Template</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 border border-gray-200 text-[13px] font-bold text-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm shadow-2xl border-t-4 border-[#6366f1]">
            <div className="p-4 border-b"><h2 className="font-bold text-[15px]">Template</h2></div>
            <div className="p-6 text-center">
              <Edit2 className="w-7 h-7 text-indigo-600 mx-auto mb-3" />
              <p className="font-bold text-slate-800">{editTemplate.title}</p>
              <p className="text-[11px] text-slate-500 uppercase mt-1">{(editTemplate.tags && editTemplate.tags[0]) || ''}</p>
            </div>
            <div className="p-4 flex gap-3 border-t">
              <button type="button" onClick={() => handleDelete(editTemplate.id)} className="flex-1 py-2 bg-red-500 text-white text-[12px] font-bold">Delete</button>
              <button type="button" onClick={() => setEditTemplate(null)} className="flex-1 py-2 border border-gray-200 text-[12px] font-bold text-gray-600">Close</button>
            </div>
          </div>
        </div>
      )}

      {showCanvas && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 text-white w-full max-w-lg p-8 text-center">
            <Wand2 className="w-8 h-8 mx-auto mb-4 text-indigo-300" />
            <h2 className="text-xl font-bold mb-2">Canvas Designer Pro</h2>
            <p className="text-[13px] text-slate-300 mb-6">Visual editor coming soon. Template create/list already works.</p>
            <button type="button" onClick={() => setShowCanvas(false)} className="px-8 py-2.5 bg-indigo-500 font-bold text-[13px]">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
}

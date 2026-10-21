import React, { useState } from 'react';
import { LayoutTemplate, Star, Eye, CheckCircle, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';

const ALL_TEMPLATES = [
  { id: 1, name: 'Classic School', category: 'Education', desc: 'Clean, professional layout for K-12 schools with sidebar navigation.', popular: true, colors: ['#1e40af', '#ffffff', '#f8fafc'] },
  { id: 2, name: 'Modern University', category: 'Higher Ed', desc: 'Bold typography with large hero section for universities and colleges.', popular: true, colors: ['#7c3aed', '#ffffff', '#faf5ff'] },
  { id: 3, name: 'Montessori', category: 'Education', desc: 'Warm, child-friendly design with playful elements and vibrant colours.', popular: false, colors: ['#d97706', '#ffffff', '#fffbeb'] },
  { id: 4, name: 'Tech Academy', category: 'Technical', desc: 'Dark mode compatible, modern gradient style for technology institutes.', popular: false, colors: ['#0f172a', '#3b82f6', '#1e293b'] },
  { id: 5, name: 'Sports Institute', category: 'Sports', desc: 'High energy layout with bold imagery for sports academies.', popular: false, colors: ['#dc2626', '#ffffff', '#fef2f2'] },
  { id: 6, name: 'Music School', category: 'Arts', desc: 'Elegant layout emphasising events and calendar for performing arts schools.', popular: false, colors: ['#9333ea', '#ffffff', '#fdf4ff'] },
  { id: 7, name: 'Medical College', category: 'Higher Ed', desc: 'Professional, trust-building layout for medical and health sciences.', popular: false, colors: ['#059669', '#ffffff', '#ecfdf5'] },
  { id: 8, name: 'Language Institute', category: 'Education', desc: 'Multi-language support ready with clean minimalist design.', popular: false, colors: ['#0891b2', '#ffffff', '#ecfeff'] },
  { id: 9, name: 'Islamic School', category: 'Education', desc: 'Elegant Arabic-inspired design with RTL support.', popular: false, colors: ['#1c4532', '#ffffff', '#f0fdf4'] },
];

const CATEGORIES = ['All', 'Education', 'Higher Ed', 'Technical', 'Sports', 'Arts'];

export default function FullTemplates() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [applied, setApplied] = useState(1); // ID 1 is applied by default
  const [previewId, setPreviewId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = ALL_TEMPLATES.filter(t =>
    (category === 'All' || t.category === category) &&
    (t.name.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase()))
  );

  const handleApply = (t) => {
    if (applied === t.id) return;
    Swal.fire({
      title: 'Are you sure?',
      text: `Apply "${t.name}" template? This will replace the current template.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      confirmButtonText: 'Yes, apply it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setApplied(t.id);
        showToast(`✅ "${t.name}" template applied successfully!`);
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-none text-sm font-semibold shadow-lg">
          {toast}
        </div>
      )}

      {/* Preview Modal */}
      {previewId && (() => {
        const t = ALL_TEMPLATES.find(x => x.id === previewId);
        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewId(null)}>
            <div className="bg-white rounded-none shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="h-48 rounded-none mb-4 overflow-hidden" style={{ background: t.colors[2] }}>
                <div className="h-10 flex items-center px-4 gap-2" style={{ background: t.colors[0] }}>
                  <div className="w-16 h-2 rounded-none bg-white/40"></div>
                  <div className="w-10 h-2 rounded-none bg-white/30 ml-4"></div>
                  <div className="w-10 h-2 rounded-none bg-white/30"></div>
                  <div className="w-10 h-2 rounded-none bg-white/30"></div>
                </div>
                <div className="p-5">
                  <div className="h-4 rounded-none w-3/4 mb-2" style={{ background: t.colors[0] + '40' }}></div>
                  <div className="h-3 rounded-none w-1/2 mb-1" style={{ background: t.colors[0] + '25' }}></div>
                  <div className="h-3 rounded-none w-2/3 mb-4" style={{ background: t.colors[0] + '20' }}></div>
                  <div className="h-8 rounded-none w-28" style={{ background: t.colors[0] }}></div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{t.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{t.desc}</p>
              <div className="flex gap-2">
                <button onClick={() => setPreviewId(null)} className="flex-1 py-2 border border-gray-300 rounded-none text-sm font-medium hover:bg-gray-50">Close</button>
                <button
                  onClick={() => { handleApply(t); setPreviewId(null); }}
                  disabled={applied === t.id}
                  className={`flex-1 py-2 rounded-none text-sm font-bold transition-colors ${applied === t.id ? 'bg-gray-100 text-gray-400' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                >
                  {applied === t.id ? '✓ Applied' : 'Apply Template'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-7 h-7 text-indigo-600" /> Full Templates
          </h1>
          <p className="text-sm text-slate-500 mt-1">Apply a pre-built full site layout. All content remains editable after applying.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-none font-medium">
            Currently Active: <strong className="text-indigo-600">{ALL_TEMPLATES.find(t => t.id === applied)?.name}</strong>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search templates…"
            className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-none focus:outline-none focus:border-indigo-400 bg-white"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs font-bold rounded-none border transition-all ${category === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-300'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} templates</span>
      </div>

      {/* Templates Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <LayoutTemplate className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No templates match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <div
              key={t.id}
              className={`bg-white border rounded-none shadow-sm overflow-hidden transition-all hover:shadow-lg ${applied === t.id ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'}`}
            >
              {/* Template Preview */}
              <div className="h-40 relative" style={{ background: t.colors[2] }}>
                <div className="h-9 flex items-center px-4 gap-1.5" style={{ background: t.colors[0] }}>
                  <div className="w-14 h-2 rounded-none bg-white/40"></div>
                  <div className="w-8 h-2 rounded-none bg-white/30 ml-4"></div>
                  <div className="w-8 h-2 rounded-none bg-white/30"></div>
                  <div className="w-8 h-2 rounded-none bg-white/30"></div>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 rounded-none w-3/4" style={{ background: t.colors[0] + '35' }}></div>
                  <div className="h-2 rounded-none w-1/2" style={{ background: t.colors[0] + '20' }}></div>
                  <div className="h-7 rounded-none w-20 mt-1" style={{ background: t.colors[0] }}></div>
                </div>
                {/* Badges */}
                {t.popular && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-none">
                    <Star className="w-2.5 h-2.5" /> Popular
                  </div>
                )}
                {applied === t.id && (
                  <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center">
                    <span className="bg-white text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-none flex items-center gap-1.5 shadow-md">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Currently Active
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-none border border-slate-200 ml-2 flex-shrink-0">{t.category}</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t.desc}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewId(t.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-300 px-3 py-1.5 rounded-none hover:bg-slate-50 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => handleApply(t)}
                    disabled={applied === t.id}
                    className={`flex-1 text-xs font-bold px-3 py-1.5 rounded-none transition-all ${applied === t.id ? 'bg-indigo-50 text-indigo-400 border border-indigo-200 cursor-default' : 'bg-slate-800 text-white hover:bg-indigo-700'}`}
                  >
                    {applied === t.id ? '✓ Applied' : 'Apply Template'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

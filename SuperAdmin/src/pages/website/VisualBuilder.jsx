import React, { useState } from 'react';
import { GripVertical, Lock, Pencil, Trash2, ExternalLink, Ban, Plus, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const initSections = [
  { id: 1, title: 'Hero Slider', type: 'Hero (Image Carousel)', hash: '/#hero-slider', active: true },
  { id: 2, title: 'Explore {50+} Powerful Modules', type: 'Modules Showcase (50+ Grid)', hash: '/#explore-50-powerful-modules', active: true },
  { id: 3, title: 'Built for {Developers} & Entrepreneurs', type: 'Tech Showcase (Script Seller)', hash: '/#built-for-developers-entrepreneurs', active: true },
  { id: 4, title: 'Get In {Touch}', type: 'Contact Form (Tech Dark)', hash: '/#get-in-touch', active: true },
];

const SECTION_TYPES = [
  'Hero (Image Carousel)', 'Modules Showcase', 'Feature Grid', 'Pricing Table',
  'Testimonials', 'Contact Form', 'FAQ Section', 'CTA Banner', 'Stats Counter', 'Gallery'
];

export default function VisualBuilder() {
  const [sections, setSections] = useState(initSections);
  const [landingEnabled, setLandingEnabled] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSection, setNewSection] = useState({ title: '', type: SECTION_TYPES[0] });
  const [toast, setToast] = useState(null);
  const [dragId, setDragId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const toggleSection = (id) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showToast('Section visibility updated.');
  };

  const deleteSection = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this section?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setSections(prev => prev.filter(s => s.id !== id));
        showToast('Section deleted.', 'error');
      }
    });
  };

  const addSection = () => {
    if (!newSection.title.trim()) return;
    const slug = newSection.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setSections(prev => [...prev, {
      id: Date.now(),
      title: newSection.title.trim(),
      type: newSection.type,
      hash: `/#${slug}`,
      active: true,
    }]);
    setNewSection({ title: '', type: SECTION_TYPES[0] });
    setShowAddForm(false);
    showToast('New section added!');
  };

  // Drag reorder
  const onDragStart = (id) => setDragId(id);
  const onDragOver = (e, id) => {
    e.preventDefault();
    if (dragId === id) return;
    const from = sections.findIndex(s => s.id === dragId);
    const to = sections.findIndex(s => s.id === id);
    const reordered = [...sections];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setSections(reordered);
  };
  const onDragEnd = () => setDragId(null);

  const activeCount = sections.filter(s => s.active).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-none text-sm font-semibold shadow-lg text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
          <CheckCircle className="w-4 h-4" /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visual Builder</h1>
          <p className="text-sm text-gray-500 mt-1">Your landing page, block by block — drag to reorder, changes go live immediately</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Preview Site
          </button>
          <button
            onClick={() => { setLandingEnabled(e => !e); showToast(landingEnabled ? 'Landing page disabled.' : 'Landing page enabled.'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-sm font-medium border transition-colors ${landingEnabled ? 'bg-white border-red-200 text-red-500 hover:bg-red-50' : 'bg-green-600 border-green-600 text-white hover:bg-green-700'}`}
          >
            <Ban className="w-4 h-4" />
            {landingEnabled ? 'Disable Landing Page' : 'Enable Landing Page'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-none hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Section
          </button>
        </div>
      </div>
{/* Stats row */}
      <div className="flex items-center gap-3 mb-5 flex-wrap text-sm">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-none font-semibold">{sections.length} Total Sections</span>
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-none font-semibold">{activeCount} Active</span>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-none font-semibold">{sections.length - activeCount} Hidden</span>
        <span className={`px-3 py-1 rounded-none font-semibold ${landingEnabled ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          Landing Page: {landingEnabled ? '🟢 LIVE' : '🔴 DISABLED'}
        </span>
      </div>

      {/* Add Section Form */}
      {showAddForm && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-none p-4 mb-5">
          <h3 className="font-bold text-indigo-800 mb-3">Add New Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Section Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newSection.title}
                onChange={e => setNewSection(s => ({ ...s, title: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addSection()}
                placeholder="e.g. Testimonials"
                className="w-full border border-indigo-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Section Type</label>
              <select
                value={newSection.type}
                onChange={e => setNewSection(s => ({ ...s, type: e.target.value }))}
                className="w-full border border-indigo-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
              >
                {SECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={addSection} className="flex-1 py-2 bg-indigo-600 text-white rounded-none text-sm font-bold hover:bg-indigo-700 transition-colors">
                Add Section
              </button>
              <button onClick={() => setShowAddForm(false)} className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-none text-sm font-bold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-2">
        {sections.length === 0 && (
          <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-none">
            <p className="text-lg font-semibold mb-1">No sections yet</p>
            <p className="text-sm">Click "Add New Section" to start building your landing page.</p>
          </div>
        )}
        {sections.map((section, idx) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => onDragStart(section.id)}
            onDragOver={e => onDragOver(e, section.id)}
            onDragEnd={onDragEnd}
            className={`flex items-center justify-between bg-white border rounded-none p-4 shadow-sm hover:shadow-md transition-all cursor-move select-none ${dragId === section.id ? 'opacity-40 border-indigo-400 bg-indigo-50' : 'border-gray-200'} ${!section.active ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-xs font-bold">{idx + 1}</span>
                <GripVertical className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-[15px] font-semibold mb-1.5 ${section.active ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                  {section.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-none text-xs font-medium bg-indigo-50 text-indigo-600">{section.type}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-none text-xs font-medium bg-gray-100 text-gray-500 font-mono">{section.hash}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`relative w-10 h-6 rounded-none transition-colors focus:outline-none ${section.active ? 'bg-indigo-600' : 'bg-gray-300'}`}
                title={section.active ? 'Hide section' : 'Show section'}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-none shadow-sm transform transition-transform ${section.active ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-none transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-none transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

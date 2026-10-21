import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Eye, Save, Plus, Trash2, GripVertical, Monitor, Smartphone, Tablet, X } from 'lucide-react';

const defaultSections = [
  { id: 1, type: 'Hero', title: 'Hero Banner', visible: true, content: 'Main hero section with CTA' },
  { id: 2, type: 'Features', title: 'Features Section', visible: true, content: 'Platform features showcase' },
  { id: 3, type: 'Pricing', title: 'Pricing Plans', visible: true, content: 'Subscription plans display' },
  { id: 4, type: 'Testimonials', title: 'Testimonials', visible: true, content: 'School testimonials' },
  { id: 5, type: 'Stats', title: 'Platform Stats', visible: true, content: 'Schools, students, countries' },
  { id: 6, type: 'CTA', title: 'Call to Action', visible: true, content: 'Get started section' },
  { id: 7, type: 'Footer', title: 'Footer', visible: true, content: 'Links, social, copyright' },
];

const sectionColors = {
  Hero: 'bg-blue-50 border-blue-200 text-blue-700',
  Features: 'bg-purple-50 border-purple-200 text-purple-700',
  Pricing: 'bg-green-50 border-green-200 text-green-700',
  Testimonials: 'bg-orange-50 border-orange-200 text-orange-700',
  Stats: 'bg-teal-50 border-teal-200 text-teal-700',
  CTA: 'bg-red-50 border-red-200 text-red-700',
  Footer: 'bg-gray-50 border-gray-200 text-gray-700',
};

const LandingPage = () => {
  const [sections, setSections] = useState(defaultSections);
  const [preview, setPreview] = useState('desktop');
  const [settings, setSettings] = useState({ title: 'Multi School ERP', tagline: 'The Complete School Management Platform', primaryColor: '#f97316', font: 'Inter' });
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSection, setNewSection] = useState({ type: 'Custom', title: '', content: '' });

  const toggleVisible = (id) => setSections(s => s.map(x => x.id === id ? { ...x, visible: !x.visible } : x));
  const removeSection = (id) => setSections(s => s.filter(x => x.id !== id));
  const addSection = () => {
    if (!newSection.title.trim()) return;
    setSections(s => [...s, { id: Date.now(), ...newSection, visible: true }]);
    setShowAddSection(false);
    setNewSection({ type: 'Custom', title: '', content: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Landing Page</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your platform's public landing page</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-none text-sm font-semibold">
            Preview Live
          </button>
          <button type="button" onClick={() => { localStorage.setItem('sa_landing', JSON.stringify({ sections, settings })); Swal.fire({ icon: 'success', title: 'Landing page published!', timer: 1500, showConfirmButton: false }); }} className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2 text-sm font-bold">
            <Save className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Section Manager */}
        <div className="lg:col-span-2 space-y-4">
          {/* Page Settings */}
          <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Page Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Page Title', key: 'title' },
                { label: 'Tagline', key: 'tagline' },
                { label: 'Font Family', key: 'font' },
              ].map(f => (
                <div key={f.key} className={f.key === 'tagline' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input value={settings[f.key]} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.primaryColor} onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                    className="w-10 h-9 rounded-none border border-gray-200 cursor-pointer" />
                  <span className="text-sm text-gray-600 font-mono">{settings.primaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white rounded-none border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">Page Sections</h3>
              <button onClick={() => setShowAddSection(true)} className="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-none font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Section
              </button>
            </div>
            <div className="p-4 space-y-2">
              {sections.map(s => (
                <div key={s.id} className={`flex items-center gap-3 p-3 rounded-none border ${s.visible ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-grab flex-shrink-0" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none border ${sectionColors[s.type] || 'bg-gray-50 border-gray-200 text-gray-600'}`}>{s.type}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{s.title}</p>
                    <p className="text-xs text-gray-400">{s.content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleVisible(s.id)}
                      className={`text-xs px-2 py-1 rounded-none font-semibold transition-colors ${s.visible ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {s.visible ? 'Visible' : 'Hidden'}
                    </button>
                    <button onClick={() => removeSection(s.id)} className="p-1.5 hover:bg-red-50 rounded-none text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-700">Preview</h3>
              <div className="flex gap-1">
                {[{ key: 'desktop', icon: Monitor }, { key: 'tablet', icon: Tablet }, { key: 'mobile', icon: Smartphone }].map(v => (
                  <button key={v.key} onClick={() => setPreview(v.key)}
                    className={`p-1.5 rounded-none transition-colors ${preview === v.key ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}>
                    <v.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className={`border border-gray-200 rounded-none overflow-hidden mx-auto transition-all ${preview === 'mobile' ? 'w-40' : preview === 'tablet' ? 'w-56' : 'w-full'}`}>
              <div className="bg-gray-800 h-6 flex items-center px-2 gap-1">
                <div className="w-1.5 h-1.5 rounded-none bg-red-400" />
                <div className="w-1.5 h-1.5 rounded-none bg-yellow-400" />
                <div className="w-1.5 h-1.5 rounded-none bg-green-400" />
              </div>
              <div className="bg-white">
                {sections.filter(s => s.visible).map(s => (
                  <div key={s.id} className={`p-2 border-b border-gray-100 text-center ${sectionColors[s.type]?.split(' ')[0] || 'bg-gray-50'}`}>
                    <p className="text-[9px] font-bold text-gray-600">{s.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ADD SECTION MODAL */}
      {showAddSection && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-none shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Add Section</h2>
              <button onClick={() => setShowAddSection(false)} className="p-1.5 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Section Type</label>
                <select value={newSection.type} onChange={e => setNewSection(s => ({ ...s, type: e.target.value }))}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {['Hero', 'Features', 'Pricing', 'Testimonials', 'Stats', 'CTA', 'Footer', 'Custom'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Section Title</label>
                <input value={newSection.title} onChange={e => setNewSection(s => ({ ...s, title: e.target.value }))} placeholder="e.g. FAQ Section"
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <input value={newSection.content} onChange={e => setNewSection(s => ({ ...s, content: e.target.value }))} placeholder="Brief description..."
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAddSection(false)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={addSection} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-none text-sm font-semibold">Add Section</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

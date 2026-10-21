import React, { useState } from 'react';
import { Navigation, Plus, Trash2, GripVertical, Save, ChevronRight, CheckCircle, ExternalLink, Menu } from 'lucide-react';

const initNavItems = [
  { id: 1, label: 'Home', url: '/', target: '_self', children: [] },
  { id: 2, label: 'About', url: '/about', target: '_self', children: [
    { id: 21, label: 'Our Story', url: '/about/story', target: '_self' },
    { id: 22, label: 'Faculty', url: '/about/faculty', target: '_self' },
  ]},
  { id: 3, label: 'Admissions', url: '/admissions', target: '_self', children: [] },
  { id: 4, label: 'Academics', url: '/academics', target: '_self', children: [] },
  { id: 5, label: 'Contact', url: '/contact', target: '_self', children: [] },
];

const footerColumns = [
  { heading: 'Quick Links', items: ['Home', 'About', 'Admissions', 'Contact'] },
  { heading: 'Resources', items: ['Portal Login', 'Library', 'Calendar', 'Downloads'] },
  { heading: 'Contact', items: ['123 School St, City', '+91 98765 43210', 'info@school.edu'] },
];

export default function NavigationFooter() {
  const [navItems, setNavItems] = useState(initNavItems);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('nav');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const removeItem = (id) => setNavItems(prev => prev.filter(i => i.id !== id));

  return (
    <div className="p-6 lg:p-8 w-full bg-white min-h-screen font-sans text-slate-800">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-none text-sm font-semibold shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Navigation & Footer</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Configure the site-wide navigation menu and footer links for all school websites.</p>
        </div>
        <button onClick={() => showToast('Navigation saved!')} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-none text-sm font-bold transition-all shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {[{ key: 'nav', label: 'Navigation Menu' }, { key: 'footer', label: 'Footer' }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.key ? 'border-slate-800 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'nav' && (
        <div className="max-w-2xl space-y-6">
          <div className="border border-slate-300 rounded-none overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-slate-500" /> Menu Items
              </h2>
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-none hover:bg-slate-50 transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="divide-y divide-slate-200">
              {navItems.map(item => (
                <div key={item.id}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                        {item.children.length > 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-none border border-slate-200 uppercase">
                            {item.children.length} sub
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400">{item.url}</span>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-1.5 hover:bg-red-50 rounded-none text-slate-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.children.map(child => (
                    <div key={child.id} className="flex items-center gap-3 px-4 py-2.5 bg-slate-50/50 border-t border-slate-100">
                      <div className="w-4 flex-shrink-0"></div>
                      <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-slate-600">{child.label}</span>
                        <span className="text-xs font-mono text-slate-400 ml-2">{child.url}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-300 rounded-none overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-300 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Menu className="w-4 h-4 text-slate-500" /> Menu Settings
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-3 border-b border-slate-100">
                <p className="sm:w-48 text-sm font-semibold text-slate-700 shrink-0">Sticky Navigation</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-[22px] rounded-none bg-slate-800 flex items-center p-0.5 cursor-pointer">
                    <div className="w-[18px] h-[18px] bg-white rounded-none shadow-sm transform translate-x-[18px]" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Enabled</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-3">
                <p className="sm:w-48 text-sm font-semibold text-slate-700 shrink-0">Logo Position</p>
                <select className="border border-slate-200 rounded-none px-3 py-2 text-sm text-slate-700 focus:outline-none bg-white">
                  <option>Left</option>
                  <option>Center</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="max-w-4xl space-y-6">
          <div className="border border-slate-300 rounded-none overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-300 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800">Footer Columns</h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
              {footerColumns.map((col, ci) => (
                <div key={ci} className="border border-slate-200 rounded-none p-4">
                  <input
                    defaultValue={col.heading}
                    className="w-full text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 focus:outline-none focus:border-slate-400 bg-transparent"
                  />
                  <div className="space-y-2">
                    {col.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2">
                        <input
                          defaultValue={item}
                          className="flex-1 text-xs text-slate-600 border border-slate-200 rounded-none px-2 py-1.5 focus:outline-none focus:border-slate-400 bg-white"
                        />
                        <button className="p-1 hover:bg-red-50 rounded-none text-slate-300 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button className="w-full text-xs font-semibold text-slate-500 border border-dashed border-slate-200 rounded-none py-1.5 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-1">
                      <Plus className="w-3 h-3" /> Add Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-300 rounded-none overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-300 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-800">Footer Bottom Bar</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Copyright Text</label>
                <input defaultValue="© 2024 School ERP. All rights reserved." className="w-full border border-slate-200 rounded-none px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-400 bg-white" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

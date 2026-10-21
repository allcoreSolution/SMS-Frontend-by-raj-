import React, { useState } from 'react';
import { GripVertical, Trash2, ChevronDown, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

const INIT_MENU = [
  { id: 1, label: 'Home', url: 'https://multischoolv2.projectworlds.com', badge: null, visible: true },
  { id: 2, label: 'Features', url: 'https://multischoolv2.projectworlds.com/#', badge: null, visible: true },
  { id: 3, label: 'Pricing', url: '#pricing', badge: { text: 'dead link', type: 'warning' }, visible: true },
  { id: 4, label: 'Contact', url: '#contact', badge: { text: 'dead link', type: 'warning' }, visible: true },
  { id: 5, label: 'Start Trial', url: '/register', badge: { text: 'Button', type: 'info' }, visible: true },
  { id: 6, label: 'Blogs', url: 'https://multischoolv2.projectworlds.com/blog', badge: null, visible: true },
];

export default function WebsiteMenu() {
  const [items, setItems] = useState(INIT_MENU);
  const [activeTab, setActiveTab] = useState('menu');

  // Add form state
  const [form, setForm] = useState({ title: '', url: '', isCta: false, newTab: false });
  const [formError, setFormError] = useState('');

  // Toggle visibility
  const toggleVisible = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, visible: !item.visible } : item));
  };

  // Delete item
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Remove this menu item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(items.filter(item => item.id !== id));
      }
    });
  };

  // Add new item
  const handleAdd = () => {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (!form.url.trim()) { setFormError('URL is required.'); return; }
    setItems([...items, {
      id: Date.now(),
      label: form.title.trim(),
      url: form.url.trim(),
      badge: form.isCta ? { text: 'Button', type: 'info' } : null,
      visible: true,
    }]);
    setForm({ title: '', url: '', isCta: false, newTab: false });
    setFormError('');
  };

  const tabs = ['menu', 'footer', 'appearance'];
  const tabLabels = { menu: 'Menu Items', footer: 'Footer Columns', appearance: 'Appearance Settings' };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-[22px] font-medium text-gray-800 mb-4">Manage Front-End Menu</h1>

      {/* Container */}
      <div className="bg-white border-t-2 border-[#f97316] rounded-none shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-0 px-4 border-b border-gray-300">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-[#f97316] border-[#f97316]'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Menu Structure */}
          <div className="lg:col-span-2">
            <h3 className="text-gray-700 font-semibold mb-3 text-sm">Menu Structure (Drag to reorder)</h3>
            <div className="border border-gray-300 rounded-none overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-xs font-bold text-gray-700 border border-gray-300 text-left w-8"></th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-700 border border-gray-300 text-left">Label</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-700 border border-gray-300 text-left">URL</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-700 border border-gray-300 text-center w-24">Visible</th>
                    <th className="px-3 py-2 text-xs font-bold text-gray-700 border border-gray-300 text-center w-16">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-300 text-center">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab mx-auto" />
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                          {item.badge && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-none text-[10px] font-bold ${
                              item.badge.type === 'warning' ? 'bg-[#ffc107] text-gray-900' : 'bg-[#0d6efd] text-white'
                            }`}>
                              {item.badge.text}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 border border-gray-300">
                        <span className="text-xs text-gray-500 truncate block max-w-[200px]">{item.url}</span>
                      </td>
                      <td className="px-3 py-2 border border-gray-300 text-center">
                        <button
                          onClick={() => toggleVisible(item.id)}
                          className={`flex items-center gap-1 mx-auto text-xs px-2 py-1 rounded-none border font-medium transition-colors ${
                            item.visible
                              ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {item.visible ? '✓ Visible' : '✗ Hidden'}
                        </button>
                      </td>
                      <td className="px-3 py-2 border border-gray-300 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-7 h-7 bg-[#dc3545] text-white rounded-none flex items-center justify-center hover:bg-red-700 transition-colors mx-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-500 border border-gray-300">
                        No menu items yet. Add one from the right panel.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right - Add New Item */}
          <div>
            <div className="border border-gray-300 rounded-none overflow-hidden">
              <div className="bg-[#6c757d] text-white px-4 py-2 font-medium text-sm">Add New Item</div>
              <div className="p-4 space-y-3">
                {formError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-none px-3 py-2">{formError}</div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => { setForm(f => ({ ...f, title: e.target.value })); setFormError(''); }}
                    placeholder="e.g. Features"
                    className="w-full border border-gray-400 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">URL <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => { setForm(f => ({ ...f, url: e.target.value })); setFormError(''); }}
                    placeholder="https:// or /#section"
                    className="w-full border border-gray-400 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Landing sections: use <span className="text-red-400">/#anchor</span></p>
                </div>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isCta}
                      onChange={(e) => setForm(f => ({ ...f, isCta: e.target.checked }))}
                      className="rounded-none border-gray-300 accent-orange-500"
                    />
                    Display as CTA Button
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.newTab}
                      onChange={(e) => setForm(f => ({ ...f, newTab: e.target.checked }))}
                      className="rounded-none border-gray-300 accent-orange-500"
                    />
                    Open in new tab
                  </label>
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-2 bg-[#fd7e14] text-white py-2 rounded-none font-bold hover:bg-orange-600 transition-colors text-sm mt-2"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} />
                  Add Item
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="border border-gray-300 rounded-none overflow-hidden mt-4">
              <div className="bg-gray-700 text-white px-4 py-2 font-medium text-xs uppercase tracking-wide">Live Preview</div>
              <div className="bg-gray-800 p-3 flex flex-wrap gap-3">
                {items.filter(i => i.visible).map(item => (
                  <span key={item.id} className={`text-xs cursor-pointer ${
                    item.badge?.type === 'info'
                      ? 'bg-orange-500 text-white px-2 py-1 rounded-none'
                      : 'text-gray-300 hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

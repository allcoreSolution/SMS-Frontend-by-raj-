import React, { useState } from 'react';
import { Lock, CheckCircle, ExternalLink, Globe, RefreshCcw } from 'lucide-react';
import Swal from 'sweetalert2';

const initSitemapData = [
  { id: 1, type: 'Homepage', subtitle: 'homepage', enabled: true, prefix: '/', priority: '1.0', freq: 'Daily' },
  { id: 2, type: 'Blog Posts', subtitle: '', enabled: true, prefix: 'blog', priority: '0.8', freq: 'Daily' },
  { id: 3, type: 'Custom Pages', subtitle: '', enabled: true, prefix: '', placeholder: 'e.g. about', priority: '0.7', freq: 'Weekly' },
  { id: 4, type: 'School Directory', subtitle: '', enabled: false, prefix: 'schools', priority: '0.6', freq: 'Weekly' },
  { id: 5, type: 'Knowledge Base', subtitle: '', enabled: false, prefix: 'knowledge-base', priority: '0.5', freq: 'Weekly' },
];

export default function Sitemap() {
  const [items, setItems] = useState(initSitemapData);
  const [saved, setSaved] = useState(false);

  // Toggle enabled
  const toggleEnabled = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
    setSaved(false);
  };

  // Update prefix
  const updatePrefix = (id, val) => {
    setItems(items.map(item => item.id === id ? { ...item, prefix: val } : item));
    setSaved(false);
  };

  // Update priority
  const updatePriority = (id, val) => {
    setItems(items.map(item => item.id === id ? { ...item, priority: val } : item));
    setSaved(false);
  };

  // Update frequency
  const updateFreq = (id, val) => {
    setItems(items.map(item => item.id === id ? { ...item, freq: val } : item));
    setSaved(false);
  };

  // Save config
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <RefreshCcw className="w-6 h-6 text-gray-700" />
          <h1 className="text-[22px] font-medium text-gray-800">Sitemap Generator</h1>
        </div>
        <button
          onClick={() => Swal.fire({ icon: 'success', title: 'Success', text: 'XML Sitemap generated!', confirmButtonColor: '#0891b2' })}
          className="flex items-center gap-2 px-4 py-2 bg-[#28a745] text-white rounded-none hover:bg-green-700 text-sm font-bold transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          GENERATE XML NOW
        </button>
      </div>
{/* Success Toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-none p-3 mb-4 text-sm text-green-700">
          <CheckCircle className="w-4 h-4" />
          Configuration saved successfully!
        </div>
      )}

      {/* Sitemap Status */}
      <div className="bg-white border-t-2 border-orange-500 rounded-none shadow-sm p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            Sitemap Status
            <span className="bg-[#198754] text-white text-xs px-2 py-0.5 rounded-none font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Generated
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Last updated: 2 months ago</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-1 text-[#fd7e14] hover:text-orange-600 font-bold text-sm">
            <ExternalLink className="w-4 h-4" /> View XML
          </a>
          <a href="#" className="flex items-center gap-1 text-[#fd7e14] hover:text-orange-600 font-bold text-sm">
            <Globe className="w-4 h-4" /> Public URL
          </a>
        </div>
      </div>

      {/* Configuration Table */}
      <div className="bg-white border border-gray-300 rounded-none shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#343a40] text-white">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border border-gray-600">Content Type</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border border-gray-600 text-center w-20">Enable</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border border-gray-600">URL Prefix</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border border-gray-600 w-36">Priority (0.1–1.0)</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border border-gray-600 w-36">Change Freq</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                  <td className="px-4 py-3 border border-gray-300">
                    <p className="font-bold text-gray-800 text-sm">{item.type}</p>
                    {item.subtitle && <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>}
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleEnabled(item.id)}
                      className="w-4 h-4 cursor-pointer accent-orange-500"
                    />
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <input
                      type="text"
                      value={item.prefix}
                      onChange={(e) => updatePrefix(item.id, e.target.value)}
                      placeholder={item.placeholder || ''}
                      className="border border-gray-400 rounded-none px-3 py-1.5 text-sm w-full max-w-[220px] focus:outline-none focus:border-orange-400"
                    />
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <select
                      value={item.priority}
                      onChange={(e) => updatePriority(item.id, e.target.value)}
                      className="border border-gray-400 rounded-none px-2 py-1.5 text-sm w-full focus:outline-none focus:border-orange-400 bg-white"
                    >
                      {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <select
                      value={item.freq}
                      onChange={(e) => updateFreq(item.id, e.target.value)}
                      className="border border-gray-400 rounded-none px-2 py-1.5 text-sm w-full focus:outline-none focus:border-orange-400 bg-white"
                    >
                      {['Always', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Never'].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-[#0d6efd] hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-none shadow-sm transition-colors"
        >
          Save Configuration &amp; Generate
        </button>
      </div>
    </div>
  );
}

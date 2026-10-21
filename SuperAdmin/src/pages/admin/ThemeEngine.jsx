import React, { useState } from 'react';
import { Save, Palette, Check } from 'lucide-react';

const presets = [
  { name: 'Orange (Default)', primary: '#f97316', sidebar: '#2f3542', accent: '#ea580c' },
  { name: 'Blue Professional', primary: '#3b82f6', sidebar: '#1e3a5f', accent: '#2563eb' },
  { name: 'Purple Elegant', primary: '#8b5cf6', sidebar: '#2d1b69', accent: '#7c3aed' },
  { name: 'Green Fresh', primary: '#22c55e', sidebar: '#14532d', accent: '#16a34a' },
  { name: 'Red Bold', primary: '#ef4444', sidebar: '#450a0a', accent: '#dc2626' },
  { name: 'Teal Modern', primary: '#14b8a6', sidebar: '#042f2e', accent: '#0d9488' },
];

const ThemeEngine = () => {
  const [selected, setSelected] = useState(0);
  const [custom, setCustom] = useState({ primary: '#f97316', sidebar: '#2f3542', accent: '#ea580c', font: 'Inter', borderRadius: 'rounded-none' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Theme Engine</h1>
          <p className="text-sm text-gray-500 mt-1">Customize the platform's visual appearance</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold">
          <Save className="w-4 h-4" /> Apply Theme
        </button>
      </div>

      {/* Preset Themes */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-orange-500" />Preset Themes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {presets.map((p, i) => (
            <button key={i} onClick={() => { setSelected(i); setCustom(c => ({ ...c, primary: p.primary, sidebar: p.sidebar, accent: p.accent })); }}
              className={`relative rounded-none border-2 overflow-hidden transition-all hover:shadow-md ${selected === i ? 'border-orange-400 shadow-md' : 'border-gray-200'}`}>
              <div className="flex h-16">
                <div className="w-8 h-full" style={{ background: p.sidebar }} />
                <div className="flex-1 flex flex-col">
                  <div className="h-4" style={{ background: p.primary }} />
                  <div className="flex-1 bg-gray-50 p-1">
                    <div className="h-1.5 bg-gray-200 rounded-none mb-1" />
                    <div className="h-1.5 bg-gray-200 rounded-none w-3/4" />
                  </div>
                </div>
              </div>
              {selected === i && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-none flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              <p className="text-[9px] font-semibold text-gray-600 text-center py-1 bg-white border-t border-gray-100">{p.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Custom Colors</h3>
          <div className="space-y-4">
            {[
              { label: 'Primary Color', key: 'primary', desc: 'Buttons, active states, highlights' },
              { label: 'Sidebar Color', key: 'sidebar', desc: 'Navigation sidebar background' },
              { label: 'Accent Color', key: 'accent', desc: 'Hover states and secondary elements' },
            ].map(c => (
              <div key={c.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{c.label}</p>
                  <p className="text-xs text-gray-400">{c.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="color" value={custom[c.key]} onChange={e => setCustom(x => ({ ...x, [c.key]: e.target.value }))}
                    className="w-10 h-9 rounded-none border border-gray-200 cursor-pointer" />
                  <span className="text-xs font-mono text-gray-500 w-16">{custom[c.key]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-none border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Typography & Layout</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Font Family</label>
              <select value={custom.font} onChange={e => setCustom(x => ({ ...x, font: e.target.value }))}
                className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                {['Inter', 'Roboto', 'Poppins', 'Nunito', 'Open Sans', 'Lato'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Border Radius</label>
              <div className="flex gap-2">
                {[{ key: 'sharp', label: 'Sharp', class: 'rounded-none' }, { key: 'rounded-none', label: 'Rounded', class: 'rounded-none' }, { key: 'pill', label: 'Pill', class: 'rounded-none' }].map(r => (
                  <button key={r.key} onClick={() => setCustom(x => ({ ...x, borderRadius: r.key }))}
                    className={`flex-1 py-2 border text-xs font-semibold transition-colors ${custom.borderRadius === r.key ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} ${r.class}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">Live Preview</p>
            <div className="flex gap-2 flex-wrap">
              <button className="px-3 py-1.5 text-white text-xs font-semibold rounded-none" style={{ background: custom.primary }}>Primary Button</button>
              <button className="px-3 py-1.5 text-xs font-semibold rounded-none border" style={{ borderColor: custom.primary, color: custom.primary }}>Outline Button</button>
              <span className="px-2 py-0.5 text-white text-xs font-semibold rounded-none" style={{ background: custom.accent }}>Badge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeEngine;

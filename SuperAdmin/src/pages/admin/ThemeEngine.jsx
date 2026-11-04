import React, { useState } from 'react';
import { Save, Palette, Check, Sparkles, RefreshCw, Layout, Type } from 'lucide-react';
import Swal from 'sweetalert2';

const presets = [
  { name: 'Amber Glow (Default)', primary: '#f97316', sidebar: '#0f172a', accent: '#ea580c' },
  { name: 'Royal Blue Professional', primary: '#2563eb', sidebar: '#0f172a', accent: '#1d4ed8' },
  { name: 'Emerald Campus Fresh', primary: '#10b981', sidebar: '#064e28', accent: '#059669' },
  { name: 'Purple SaaS Sovereign', primary: '#8b5cf6', sidebar: '#1e1b4b', accent: '#7c3aed' },
  { name: 'Crimson Tech Red', primary: '#ef4444', sidebar: '#450a0a', accent: '#dc2626' },
  { name: 'Cyan Modern SaaS', primary: '#06b6d4', sidebar: '#083344', accent: '#0891b2' },
];

export default function ThemeEngine() {
  const [selected, setSelected] = useState(0);
  const [custom, setCustom] = useState({ 
    primary: '#f97316', 
    sidebar: '#0f172a', 
    accent: '#ea580c', 
    font: 'Inter', 
    borderRadius: 'rounded-xl' 
  });
  const [applying, setApplying] = useState(false);

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Theme Applied Successfully!',
        text: 'Platform visual variables synchronized.',
        showConfirmButton: false,
        timer: 1800
      });
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 max-w-[1250px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Theme & Brand Engine</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Style Configurator
            </span>
          </div>
          <p className="text-xs text-slate-500">Customize central branding colors, navigation sidebar themes, and typography</p>
        </div>

        <button 
          onClick={handleApply}
          disabled={applying}
          className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm shadow-orange-500/20 active:scale-95 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> 
          <span>{applying ? 'Applying...' : 'Apply Theme'}</span>
        </button>
      </div>

      {/* Preset Themes Grid */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4 sm:p-5 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3.5 flex items-center gap-2">
          <Palette className="w-4 h-4 text-orange-500" />
          Preset Brand Palettes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => { 
                setSelected(i); 
                setCustom(c => ({ ...c, primary: p.primary, sidebar: p.sidebar, accent: p.accent })); 
              }}
              className={`relative rounded-xl border-2 overflow-hidden transition-all hover:shadow-md cursor-pointer text-left ${
                selected === i ? 'border-orange-500 shadow-sm ring-2 ring-orange-500/10' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex h-14">
                <div className="w-7 h-full" style={{ background: p.sidebar }} />
                <div className="flex-1 flex flex-col">
                  <div className="h-3" style={{ background: p.primary }} />
                  <div className="flex-1 bg-slate-50 p-1.5 space-y-1">
                    <div className="h-1.5 bg-slate-200 rounded-full w-4/5" />
                    <div className="h-1.5 bg-slate-200 rounded-full w-3/5" />
                  </div>
                </div>
              </div>
              {selected === i && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <div className="p-1.5 bg-white border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-700 truncate">{p.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors & Typography Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        {/* Custom Colors */}
        <div className="lg:col-span-6 bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Custom Accent Hex Pickers
          </h3>
          <div className="space-y-3.5">
            {[
              { label: 'Primary Brand Color', key: 'primary', desc: 'Action buttons, active states, and focus rings' },
              { label: 'Sidebar Console Background', key: 'sidebar', desc: 'Main navigation sidebar background tint' },
              { label: 'Secondary Accent Color', key: 'accent', desc: 'Badges, highlights, and secondary elements' },
            ].map(c => (
              <div key={c.key} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
                <div className="pr-2">
                  <p className="text-xs font-bold text-slate-800">{c.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input 
                    type="color" 
                    value={custom[c.key]} 
                    onChange={e => setCustom(x => ({ ...x, [c.key]: e.target.value }))}
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5" 
                  />
                  <span className="text-xs font-mono text-slate-600 font-bold uppercase w-16">{custom[c.key]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography & Shape */}
        <div className="lg:col-span-6 bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-500" />
            Typography & Border Radius
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">System Font Family</label>
              <select 
                value={custom.font} 
                onChange={e => setCustom(x => ({ ...x, font: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-orange-500"
              >
                {['Inter (Modern Default)', 'Poppins (Geometric)', 'Roboto (Crisp Google)', 'Nunito (Rounded)', 'Open Sans'].map(f => (
                  <option key={f} value={f.split(' ')[0]}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Corner Radius Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'rounded-lg', label: 'Compact (8px)' },
                  { key: 'rounded-xl', label: 'Smooth (12px)' },
                  { key: 'rounded-2xl', label: 'Modern (16px)' }
                ].map(r => (
                  <button 
                    key={r.key} 
                    type="button"
                    onClick={() => setCustom(x => ({ ...x, borderRadius: r.key }))}
                    className={`py-2 px-2 text-xs font-bold border transition rounded-xl text-center cursor-pointer ${
                      custom.borderRadius === r.key 
                        ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-2xs' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

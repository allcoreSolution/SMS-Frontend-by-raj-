// Shared components for Settings pages
import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

export function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
        checked ? 'bg-orange-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function SaveBar({ label = 'Save Changes', note = 'Changes apply immediately across all portal nodes.' }) {
  const [saved, setSaved] = useState(false);
  const handle = () => { 
    setSaved(true); 
    setTimeout(() => setSaved(false), 2500); 
  };
  return (
    <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      <span className="text-xs text-slate-400 font-medium">{note}</span>
      <button
        onClick={handle}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 text-white ${
          saved 
            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200/50' 
            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-200/50'
        }`}
      >
        {saved ? <><Check className="w-3.5 h-3.5" /> Saved Successfully!</> : <><Save className="w-3.5 h-3.5" /> {label}</>}
      </button>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon, iconColor = 'text-orange-500', action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2 mb-1">
          {Icon && (
            <span className="p-2 bg-orange-50 rounded-xl">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </span>
          )}
          {title}
        </h1>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && (
        <div className="self-start sm:self-auto">
          {action}
        </div>
      )}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, icon: Icon, action }) {
  return (
    <div className="border-b border-slate-100 px-4 sm:px-5 py-3.5 flex items-center justify-between">
      <h3 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wide">
        {Icon && <Icon className="w-4 h-4 text-orange-500" />}
        {title}
      </h3>
      {action && <div>{action}</div>}
    </div>
  );
}

export function FieldRow({ label, children, hint }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-slate-200/80 rounded-2xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full border border-slate-200/80 rounded-2xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function ToggleRow({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <Toggle checked={checked} onChange={onChange} />
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-bold text-slate-800">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, iconBg = 'bg-orange-50', iconColor = 'text-orange-600', valueColor = 'text-slate-900' }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs text-slate-500 font-semibold">{label}</p>
        <p className={`text-xl sm:text-2xl font-black mt-1 ${valueColor}`}>{value}</p>
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

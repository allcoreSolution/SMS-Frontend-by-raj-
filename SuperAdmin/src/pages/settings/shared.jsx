// Shared components for Settings pages
import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

export function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-none-none transition-colors duration-200 flex-shrink-0 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-none-none bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

export function SaveBar({ label = 'Save Changes', note = 'Changes apply immediately.' }) {
  const [saved, setSaved] = useState(false);
  const handle = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return (
    <div className="border-t border-gray-100 bg-white px-6 py-3 flex items-center justify-between flex-shrink-0">
      <span className="text-xs text-gray-400">{note}</span>
      <button
        onClick={handle}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> {label}</>}
      </button>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon, iconColor = 'text-blue-600' }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
        {title}
      </h1>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, icon: Icon }) {
  return (
    <div className="border-b border-gray-100 px-5 py-3.5">
      <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        {title}
      </h3>
    </div>
  );
}

export function FieldRow({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors ${className}`}
      {...props}
    />
  );
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function ToggleRow({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <Toggle checked={checked} onChange={onChange} />
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, iconBg = 'bg-blue-50', iconColor = 'text-blue-600', valueColor = 'text-gray-900' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-none-none p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-none-none ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

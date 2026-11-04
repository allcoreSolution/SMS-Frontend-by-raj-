import React, { useState, useRef } from 'react';
import {
  Lock, Palette, Check, Moon, RefreshCw, X, Minus, Lock as LockIcon, CheckCircle2, Sliders, Layout, Monitor
} from 'lucide-react';
import Swal from 'sweetalert2';
import SettingsLayout from '../../components/SettingsLayout';

// Clean Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, label }) => (
  <div className="flex items-center justify-between py-1 cursor-pointer" onClick={() => onChange(!checked)}>
    <span className="text-xs font-medium text-slate-700">{label}</span>
    <div className={`relative w-9 h-5 rounded-xl transition-colors duration-200 ease-in-out flex-shrink-0 ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-xl bg-white shadow transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  </div>
);

// Custom Color Picker with Hex Input & Swatch
const ColorPickerField = ({ label, subtitle, value, onChange }) => {
  const pickerRef = useRef();
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl p-2 hover:border-slate-300 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
        <div
          onClick={() => pickerRef.current?.click()}
          className="w-7 h-7 rounded-xl border border-slate-300/80 shadow-xs cursor-pointer flex-shrink-0 relative overflow-hidden transition-transform hover:scale-105"
          style={{ backgroundColor: value }}
        >
          <input
            ref={pickerRef}
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 focus:outline-none uppercase"
          maxLength={7}
        />
      </div>
      {subtitle && <p className="text-[11px] font-normal text-slate-400 leading-tight">{subtitle}</p>}
    </div>
  );
};

export default function AppearanceSettings({ inSettingsCenter = false }) {
  const [demoBanner, setDemoBanner] = useState(false);
  const [brandingOpen, setBrandingOpen] = useState(true);

  // Global Branding Colors
  const [brandColors, setBrandColors] = useState({
    primary: '#F95700',
    secondary: '#38BDF8',
    consoleAccent: '#00875A'
  });

  // Sidebar Settings
  const [sidebarTheme, setSidebarTheme] = useState('Dark Professional (Charcoal)');
  const [sidebarAccent, setSidebarAccent] = useState('Orange');
  const [fixedSidebar, setFixedSidebar] = useState(true);
  const [sidebarMini, setSidebarMini] = useState(true);
  const [colorfulIcons, setColorfulIcons] = useState(true);

  // Navbar Settings
  const [navbarVariant, setNavbarVariant] = useState('Clean White');
  const [stickyNavbar, setStickyNavbar] = useState(true);

  // System Dark Mode
  const [systemDarkMode, setSystemDarkMode] = useState(false);

  // Theme Presets
  const [selectedPreset, setSelectedPreset] = useState('Default');
  const [customColors, setCustomColors] = useState({
    panelAccent: '#8B5CF6',
    sidebarBg: '#1E293B'
  });

  // Toast / Saved State
  const [savedToast, setSavedToast] = useState(false);
  const [brandingSaved, setBrandingSaved] = useState(false);

  const handleApplyGlobal = () => {
    setSavedToast(true);
    Swal.fire({
      icon: 'success',
      title: 'Aesthetic Changes Applied',
      text: 'Changes have been applied globally to the system.',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleSaveBranding = () => {
    setBrandingSaved(true);
    Swal.fire({
      icon: 'success',
      title: 'Branding Saved',
      text: 'Global UI branding preferences updated.',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => setBrandingSaved(false), 2000);
  };



  const mainContent = (
    <div className={`flex flex-col h-full font-sans transition-colors duration-300 ${systemDarkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-800'}`}>
        
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1150px] w-full mx-auto space-y-6">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${systemDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Master Theme & Aesthetic Customizer
              </h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Configure brand identities, navigation styling, and system-wide portal themes.
              </p>
            </div>
          </div>



          {/* Section 1: Global Frontend Branding */}
          <div className={`border rounded-xl overflow-hidden shadow-xs transition-colors ${systemDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200/90'}`}>
            <div className="p-4 px-6 border-b border-slate-100/80 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-bold text-slate-900">
                  Global Frontend Branding
                </h2>
              </div>
              <button onClick={() => setBrandingOpen(!brandingOpen)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {brandingOpen && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                
                {/* Primary Brand Color */}
                <ColorPickerField
                  label="Primary Brand Color"
                  subtitle="Main action color across the public site."
                  value={brandColors.primary}
                  onChange={val => setBrandColors(c => ({ ...c, primary: val }))}
                />

                {/* Secondary Accent Color */}
                <ColorPickerField
                  label="Secondary Accent Color"
                  subtitle="Used for secondary buttons & badges."
                  value={brandColors.secondary}
                  onChange={val => setBrandColors(c => ({ ...c, secondary: val }))}
                />

                {/* Platform Console Accent */}
                <ColorPickerField
                  label="Platform Console Accent"
                  subtitle="Superadmin dashboards accent color."
                  value={brandColors.consoleAccent}
                  onChange={val => setBrandColors(c => ({ ...c, consoleAccent: val }))}
                />

                {/* Save Brand Identity Button */}
                <div>
                  <button
                    onClick={handleSaveBranding}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LockIcon className="w-3.5 h-3.5 text-slate-400" />
                    {brandingSaved ? 'Saved Brand Identity!' : 'Save Brand Identity'}
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Section 2: Master Dashboard Aesthetics */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" /> Master Dashboard Aesthetics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sub-panel 1: Sidebar Design */}
              <div className={`border rounded-xl p-6 shadow-xs flex flex-col justify-between ${systemDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200/90'}`}>
                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Layout className="w-4 h-4 text-blue-500" /> Sidebar Design
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sidebar Theme</label>
                      <select
                        value={sidebarTheme}
                        onChange={e => setSidebarTheme(e.target.value)}
                        className="w-full border border-slate-200/80 rounded-2xl px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs cursor-pointer"
                      >
                        <option>Dark Professional (Charcoal)</option>
                        <option>Light Clean</option>
                        <option>Deep Navy</option>
                        <option>Slate Gray</option>
                        <option>Midnight Black</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sidebar Accent Color</label>
                      <select
                        value={sidebarAccent}
                        onChange={e => setSidebarAccent(e.target.value)}
                        className="w-full border border-slate-200/80 rounded-2xl px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs cursor-pointer"
                      >
                        <option>Orange</option>
                        <option>Blue</option>
                        <option>Purple</option>
                        <option>Teal</option>
                        <option>Emerald</option>
                        <option>Rose</option>
                      </select>
                    </div>

                    <div className="pt-2 space-y-3 border-t border-slate-100">
                      <ToggleSwitch checked={fixedSidebar} onChange={setFixedSidebar} label="Fixed Sidebar (Scroll content)" />
                      <ToggleSwitch checked={sidebarMini} onChange={setSidebarMini} label="Enable Sidebar Mini on Collapse" />
                      <ToggleSwitch checked={colorfulIcons} onChange={setColorfulIcons} label="Colorful Menu Category Icons" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-panel 2: Top Navbar Design */}
              <div className={`border rounded-xl p-6 shadow-xs flex flex-col justify-between ${systemDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200/90'}`}>
                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Monitor className="w-4 h-4 text-indigo-500" /> Top Navbar & Theme Mode
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Navbar Color Variant</label>
                      <select
                        value={navbarVariant}
                        onChange={e => setNavbarVariant(e.target.value)}
                        className="w-full border border-slate-200/80 rounded-2xl px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs cursor-pointer"
                      >
                        <option>Clean White</option>
                        <option>Dark Charcoal</option>
                        <option>Primary Gradient</option>
                        <option>Glassmorphism Transparent</option>
                      </select>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <ToggleSwitch checked={stickyNavbar} onChange={setStickyNavbar} label="Sticky Top Header Bar" />
                    </div>

                    {/* Dark Mode Card */}
                    <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center flex flex-col items-center justify-center space-y-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center shadow-xs">
                        <Moon className="w-4 h-4 fill-current" />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSystemDarkMode(!systemDarkMode)}
                          className={`relative w-10 h-5 rounded-xl transition-colors duration-200 ease-in-out cursor-pointer ${
                            systemDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-xl bg-white shadow transform transition-transform duration-200 ease-in-out ${
                              systemDarkMode ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="text-xs font-bold text-slate-900 tracking-wide">
                          System Dark Mode
                        </span>
                      </div>

                      <p className="text-[11px] font-normal text-slate-500">
                        Applies dark mode across all admin portals.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Sub-panel 3: Theme Presets */}
              <div className={`border rounded-xl p-6 shadow-xs flex flex-col justify-between ${systemDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200/90'}`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                    <Palette className="w-4 h-4 text-purple-500" /> Theme Presets
                  </h3>

                  {/* 4 Preset Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { name: 'Default', primary: '#F95700', bg: '#1E293B' },
                      { name: 'Ocean', primary: '#3B82F6', bg: '#0F172A' },
                      { name: 'Royal', primary: '#8B5CF6', bg: '#18181B' },
                      { name: 'Custom', primary: '#D946EF', bg: '#111827' },
                    ].map(preset => {
                      const isSelected = selectedPreset === preset.name;
                      return (
                        <div
                          key={preset.name}
                          onClick={() => setSelectedPreset(preset.name)}
                          className={`rounded-xl border overflow-hidden cursor-pointer transition-all ${
                            isSelected ? 'border-blue-500 shadow-sm ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="h-3.5" style={{ backgroundColor: preset.primary }} />
                          <div className="h-5" style={{ backgroundColor: preset.bg }} />
                          <div className="p-1.5 text-center bg-white text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1">
                            {preset.name}
                            {isSelected && <Check className="w-3 h-3 text-blue-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Colors sub-section */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">Custom Accent Override</h4>

                    <div className="grid grid-cols-2 gap-3">
                      <ColorPickerField
                        label="Panel Accent"
                        value={customColors.panelAccent}
                        onChange={val => setCustomColors(c => ({ ...c, panelAccent: val }))}
                      />
                      <ColorPickerField
                        label="Sidebar Bg"
                        value={customColors.sidebarBg}
                        onChange={val => setCustomColors(c => ({ ...c, sidebarBg: val }))}
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Action Footer Bar */}
        <div className={`border-t px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0 ${
          systemDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Changes are applied instantly to all SuperAdmins and School Admins.</span>
          </div>

          <button
            onClick={handleApplyGlobal}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
              savedToast ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {savedToast ? 'Aesthetic Changes Applied Globally!' : 'Apply Aesthetic Changes Globally'}
          </button>
        </div>

      </div>
  );

  return (
    <SettingsLayout activeTab="appearance">
      {mainContent}
    </SettingsLayout>
  );
}

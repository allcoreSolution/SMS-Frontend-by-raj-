import React, { useState, useEffect } from 'react';
import { LayoutGrid, Save, Check } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

const THEMES = [
  { id: 1, name: 'Classic Dashboard (Legacy)', bg: 'bg-blue-100', tag: '' },
  { id: 2, name: 'Action V2 (Clean)', bg: 'bg-white', tag: '' },
  { id: 3, name: 'Action V2 (Colorful)', bg: 'bg-blue-50', tag: '' },
  { id: 4, name: 'Action V3 (Smart Auto-Arrange) ✨', bg: 'bg-gray-50', tag: '' },
  { id: 5, name: 'Mac OS Style 🍎', bg: 'bg-slate-100', tag: '' },
  { id: 6, name: 'Futuristic Command Center 🚀', bg: 'bg-[#1e1e2f]', tag: '' },
  { id: 7, name: 'Analytics Pro (Light & Colorful)', bg: 'bg-blue-50', tag: '' },
  { id: 8, name: 'Executive Pro ✦', bg: 'bg-[#252530]', tag: '' },
  { id: 9, name: 'Executive Pro X ✦✦', bg: 'bg-[#181820]', tag: '' },
  { id: 10, name: 'Command Center (Warm ERP) 🟠', bg: 'bg-orange-50', tag: 'DEFAULT' },
];

export default function DashboardThemesSettings() {
  const [allowedIds, setAllowedIds] = useState(THEMES.map(t => t.id));
  const [defaultTheme, setDefaultTheme] = useState('Command Center (Warm ERP) 🟠');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getSetting('dashboard_themes').then(res => {
      if (res.success && res.data) {
        setAllowedIds(res.data.allowedIds || THEMES.map(t => t.id));
        setDefaultTheme(res.data.defaultTheme || 'Command Center (Warm ERP) 🟠');
      }
    }).catch(console.error);
  }, []);

  const handleSave = async () => { 
    try {
      await settingsService.saveSetting('dashboard_themes', { allowedIds, defaultTheme });
      setSaved(true); 
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your changes have been saved to the database successfully.',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => setSaved(false), 2500); 
    } catch (error) {
      Swal.fire('Error', 'Failed to save configuration: ' + error.message, 'error');
    }
  };

  const toggleAllowed = (id) => {
    setAllowedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <SettingsLayout activeTab="themes">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
              <LayoutGrid className="w-5 h-5 text-gray-600" /> Dashboard Theme Settings
            </h1>
          </div>

          {/* Allowed Themes */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Allowed Dashboard Themes</h3>
            <p className="text-xs text-gray-500 mb-4">
              Tick the dashboard styles schools may choose. Unticked themes are hidden from every school.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {THEMES.map(theme => {
                const isAllowed = allowedIds.includes(theme.id);
                return (
                  <div key={theme.id}
                    onClick={() => toggleAllowed(theme.id)}
                    className={`border-2 rounded-none-none overflow-hidden flex flex-col bg-white cursor-pointer transition-all ${isAllowed ? 'border-blue-500' : 'border-gray-200 opacity-60'}`}>
                    <div className={`h-20 w-full relative ${theme.bg} border-b border-gray-100 overflow-hidden`}>
                      <div className="absolute top-0 left-0 right-0 h-3 bg-white/20 border-b border-black/5 flex items-center px-1">
                        <div className="flex gap-0.5">
                          <div className="w-1.5 h-1.5 rounded-none-none bg-red-400" />
                          <div className="w-1.5 h-1.5 rounded-none-none bg-amber-400" />
                          <div className="w-1.5 h-1.5 rounded-none-none bg-green-400" />
                        </div>
                      </div>
                      <div className="flex p-1.5 pt-4 gap-1 h-full">
                        <div className="w-1/4 h-full bg-black/5 rounded-none-none" />
                        <div className="w-3/4 h-full flex flex-col gap-1">
                          <div className="h-4 w-full bg-black/5 rounded-none-none" />
                          <div className="flex gap-1 flex-1">
                            <div className="w-1/2 h-full bg-black/5 rounded-none-none" />
                            <div className="w-1/2 h-full bg-black/5 rounded-none-none" />
                          </div>
                        </div>
                      </div>
                      {theme.tag && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-none-none uppercase tracking-wider">
                          {theme.tag}
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 flex items-center justify-between bg-white">
                      <span className="text-xs font-medium text-gray-700 leading-tight">{theme.name}</span>
                      <div className={`w-4 h-4 rounded-none-none flex items-center justify-center flex-shrink-0 ml-2 ${isAllowed ? 'bg-blue-500' : 'bg-gray-200'}`}>
                        {isAllowed && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Default Theme */}
          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Default Theme for New Schools</h3>
            <p className="text-xs text-gray-500 mb-3">Applied automatically when a new school is created.</p>
            <select value={defaultTheme} onChange={e => setDefaultTheme(e.target.value)}
              className="w-full max-w-[1150px] border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
              {THEMES.map(t => <option key={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-end flex-shrink-0">
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Dashboard Settings</>}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}

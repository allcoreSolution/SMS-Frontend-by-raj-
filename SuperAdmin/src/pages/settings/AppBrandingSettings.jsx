import React, { useState, useEffect } from 'react';
import { Radio, Info, Save, Smartphone, Palette, Check } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

export default function AppBrandingSettings() {
  const [dynamicBranding, setDynamicBranding] = useState(true);
  const [appName, setAppName] = useState('Multi School ERP v3.6');
  const [colors, setColors] = useState({ primary: '#8b1c1c', secondary: '#d1241a', tertiary: '#d9a826', accent: '#ef4444' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getSetting('app_branding').then(res => {
      if (res.success && res.data) {
        setDynamicBranding(res.data.dynamicBranding ?? true);
        setAppName(res.data.appName || 'Multi School ERP v3.6');
        if (res.data.colors) setColors(res.data.colors);
      }
    }).catch(console.error);
  }, []);

  const handleSave = async () => { 
    try {
      await settingsService.saveSetting('app_branding', { dynamicBranding, appName, colors });
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

  return (
    <SettingsLayout activeTab="branding">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
              <Radio className="w-5 h-5 text-blue-600" strokeWidth={2.5} /> App Branding
            </h1>
            <p className="text-sm text-gray-500">White-label the parent, staff &amp; driver mobile apps with your own identity.</p>
          </div>

          {/* Mobile Identity */}
          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm mb-5 overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-400" /> Mobile Identity
              </h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="bg-gray-50 rounded-none-none p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Enable dynamic branding</p>
                  <p className="text-xs text-gray-500 mt-0.5">When off, apps use the built-in default brand.</p>
                </div>
                <button type="button" onClick={() => setDynamicBranding(v => !v)}
                  className={`relative w-9 h-5 rounded-none-none transition-colors duration-200 flex-shrink-0 focus:outline-none ${dynamicBranding ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-none-none bg-white shadow transition-transform duration-200 ${dynamicBranding ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  App Name <span className="text-gray-400 font-normal">(max 40 chars)</span>
                </label>
                <input value={appName} onChange={e => setAppName(e.target.value)} maxLength={40}
                  className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  App Logo <span className="text-gray-400 font-normal">(PNG/JPG, &lt; 2MB)</span>
                </label>
                <input type="file" accept=".png,.jpg,.jpeg"
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-none-none file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 border border-gray-200 rounded-none-none p-1 bg-white" />
              </div>
            </div>
          </div>

          {/* Brand Palette */}
          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-400" /> Brand Palette
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-4 gap-4 mb-4">
                {Object.entries(colors).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs font-semibold text-gray-700 mb-2 capitalize">{key}</p>
                    <div className="h-10 rounded-none-none border border-gray-200 cursor-pointer relative overflow-hidden hover:brightness-110 transition-all" style={{ backgroundColor: val }}>
                      <input type="color" value={val} onChange={e => setColors(c => ({ ...c, [key]: e.target.value }))}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                    </div>
                    <p className="text-xs font-mono text-gray-400 mt-1">{val}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-4">Colors drive buttons, headers and accents inside the mobile apps.</p>
              <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-none-none text-xs leading-relaxed flex gap-2">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  The Parent, Staff and Driver apps inherit these values. To give one app its own name, logo or colours, use <strong>Settings &gt; App Branding</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Info className="w-3.5 h-3.5" /> Apps refresh branding on next launch.
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Branding</>}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}

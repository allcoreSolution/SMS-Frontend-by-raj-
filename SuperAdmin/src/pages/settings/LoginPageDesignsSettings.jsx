import React, { useState, useEffect } from 'react';
import { Lock, Monitor, Save, Info, Eye, Check } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-none-none transition-colors duration-200 flex-shrink-0 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-none-none bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

export default function LoginPageDesignsSettings() {
  const [headline, setHeadline] = useState('Welcome to Multi School ERP');
  const [subtext, setSubtext] = useState('The all-in-one school management platform');
  const [bgType, setBgType] = useState('gradient');
  const [primaryColor, setPrimaryColor] = useState('#1d4ed8');
  const [accentColor, setAccentColor] = useState('#e8400c');
  const [showLogo, setShowLogo] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [layout, setLayout] = useState('split');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getSetting('login_page_designs').then(res => {
      if (res.success && res.data) {
        setHeadline(res.data.headline || 'Welcome to Multi School ERP');
        setSubtext(res.data.subtext || 'The all-in-one school management platform');
        setBgType(res.data.bgType || 'gradient');
        setPrimaryColor(res.data.primaryColor || '#1d4ed8');
        setAccentColor(res.data.accentColor || '#e8400c');
        setShowLogo(res.data.showLogo ?? true);
        setShowFeatures(res.data.showFeatures ?? true);
        setShowTestimonials(res.data.showTestimonials ?? false);
        setLayout(res.data.layout || 'split');
      }
    }).catch(console.error);
  }, []);

  const handleSave = async () => { 
    try {
      await settingsService.saveSetting('login_page_designs', {
        headline, subtext, bgType, primaryColor, accentColor, showLogo, showFeatures, showTestimonials, layout
      });
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
    <SettingsLayout activeTab="login-designs">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">
          
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
              <Monitor className="w-5 h-5 text-blue-600" /> Login Page Designs
            </h1>
            <p className="text-sm text-gray-500">Customize the public login page schools &amp; users see when accessing the platform.</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <h3 className="font-semibold text-gray-800 text-sm">Layout Style</h3>
                </div>
                <div className="p-4 grid grid-cols-3 gap-2">
                  {[{ id: 'split', label: 'Split Screen' }, { id: 'center', label: 'Centered' }, { id: 'fullbg', label: 'Full BG' }].map(l => (
                    <button key={l.id} onClick={() => setLayout(l.id)}
                      className={`py-2 rounded-none-none text-xs font-semibold border-2 transition-all ${layout === l.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <h3 className="font-semibold text-gray-800 text-sm">Text Content</h3>
                </div>
                <div className="p-5 space-y-4">
                  {[{ label: 'Headline', val: headline, set: setHeadline }, { label: 'Subtext', val: subtext, set: setSubtext }].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                      <input value={f.val} onChange={e => f.set(e.target.value)}
                        className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <h3 className="font-semibold text-gray-800 text-sm">Background</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Type</label>
                    <div className="flex gap-2">
                      {['gradient', 'solid', 'image'].map(t => (
                        <button key={t} onClick={() => setBgType(t)}
                          className={`flex-1 py-1.5 rounded-none-none text-xs font-semibold border capitalize transition-all ${bgType === t ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: 'Primary Color', val: primaryColor, set: setPrimaryColor }, { label: 'Accent Color', val: accentColor, set: setAccentColor }].map(c => (
                      <div key={c.label}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{c.label}</label>
                        <div className="h-9 rounded-none-none border border-gray-200 cursor-pointer relative overflow-hidden" style={{ backgroundColor: c.val }}>
                          <input type="color" value={c.val} onChange={e => c.set(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                        </div>
                      </div>
                    ))}
                  </div>
                  {bgType === 'image' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Background Image</label>
                      <input type="file" className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-none-none file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 border border-gray-200 rounded-none-none p-1 bg-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <h3 className="font-semibold text-gray-800 text-sm">Display Options</h3>
                </div>
                <div className="px-5 py-2">
                  {[
                    { label: 'Show Platform Logo', desc: 'Display logo on the login page.', val: showLogo, fn: setShowLogo },
                    { label: 'Show Feature Highlights', desc: 'Bullet points of platform features.', val: showFeatures, fn: setShowFeatures },
                    { label: 'Show Testimonials', desc: 'Display school testimonials/quotes.', val: showTestimonials, fn: setShowTestimonials },
                  ].map(({ label, desc, val, fn }) => (
                    <div key={label} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                      <Toggle checked={val} onChange={fn} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3.5 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm">Preview</h3>
                  <button className="flex items-center gap-1.5 text-xs text-blue-500 font-semibold hover:text-blue-600">
                    <Eye className="w-3.5 h-3.5" /> Full Preview
                  </button>
                </div>
                <div className="p-4">
                  <div className="rounded-none-none overflow-hidden border border-gray-100" style={{ height: 130, background: bgType === 'gradient' ? `linear-gradient(135deg, ${primaryColor}, ${accentColor})` : primaryColor }}>
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        {showLogo && <div className="w-7 h-7 rounded-none-none bg-white/20 mx-auto mb-2 flex items-center justify-center font-bold text-xs">M</div>}
                        <div className="text-xs font-bold leading-tight">{headline}</div>
                        <div className="text-xs opacity-75 mt-1">{subtext}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <h3 className="font-semibold text-gray-800 text-sm">Custom Assets</h3>
                </div>
                <div className="p-5 space-y-3">
                  {['Login Page Logo', 'Side Image / Illustration'].map(label => (
                    <div key={label}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                      <input type="file" className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-none-none file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 border border-gray-200 rounded-none-none p-1 bg-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400"><Info className="w-3.5 h-3.5" /> Applies to the public login page immediately.</div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Login Design</>}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}

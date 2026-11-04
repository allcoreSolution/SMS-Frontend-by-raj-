import React, { useState } from 'react';
import {
  Lock, Save, Pencil, LayoutGrid, CreditCard, RefreshCcw,
  Monitor, UserCheck, MessageCircle, Mail, Bell, Send,
  Wallet, BookOpen, Image, Globe, Settings, ChevronRight, CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';
import { useLanguage } from '../../i18n/LanguageContext';


// ─── Reusable Toggle ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors duration-200 shrink-0 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}>
      <div className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`} />
    </div>
  );
}

function SaveBar({ label = 'Save Changes', note = 'Changes apply immediately.', onSave }) {
  const [saved, setSaved] = useState(false);
  const handle = async () => { 
    if(onSave) await onSave();
    setSaved(true); 
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your changes have been saved successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => setSaved(false), 2500); 
  };
  return (
    <div className="border-t border-gray-200 bg-white px-8 py-3 flex items-center justify-between flex-shrink-0 shadow-[0_-2px_6px_rgba(0,0,0,0.04)]">
      <span className="text-[12px] text-gray-400">{note}</span>
      <button onClick={handle}
        className={`flex items-center gap-2 px-5 py-2 font-bold text-[13px] rounded-xl shadow transition-all text-white ${saved ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
        <Save className="w-3.5 h-3.5" /> {saved ? '✓ Saved!' : label}
      </button>
    </div>
  );
}

// ─── Panel: General & Branding ────────────────────────────────────────────────
function GeneralBrandingPanel() {
  const { lang: language, setLanguage } = useLanguage();
  const [siteName, setSiteName] = useState('Multi School ERP v3.6');
  const [country, setCountry] = useState('India (+91)');
  const [footer, setFooter] = useState('Projectworlds Multi School ERP v3.6');

  React.useEffect(() => {
    settingsService.getSetting('general').then(res => {
      if(res?.data) {
        setSiteName(res.data.siteName || '');
        setCountry(res.data.country || 'India (+91)');
        setFooter(res.data.footer || '');
      }
    }).catch(console.error);
  }, []);

  const handleSave = () => {
    return settingsService.saveSetting('general', { siteName, country, footer });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <Pencil className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">General &amp; Branding</span>
        </div>
        <div className="space-y-5 max-w-[1150px]">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Site Name</label>
              <input value={siteName} onChange={e => setSiteName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Platform Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                {['India (+91)', 'USA (+1)', 'UAE (+971)', 'UK (+44)', 'Canada (+1)', 'Australia (+61)'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Default Language</label>
              <select value={language} onChange={e => {
                setLanguage(e.target.value);
              }}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                {['English','Hindi','Marathi','Gujarati','Tamil','Telugu','Bengali'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Footer Text</label>
            <input value={footer} onChange={e => setFooter(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[{ label: 'Site Logo (PNG, JPG)', accept: '.png,.jpg', preview: 'bg-blue-600' },
              { label: 'Site Favicon (.ico, .png)', accept: '.ico,.png', preview: 'bg-orange-500' }].map(f => (
              <div key={f.label}>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">{f.label}</label>
                <div className={`mb-2 w-10 h-10 rounded-xl ${f.preview} flex items-center justify-center text-white text-xs font-black`}>M</div>
                <div className="flex">
                  <input readOnly placeholder="Choose a file..." className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-[12px] text-gray-400 bg-white focus:outline-none" />
                  <label className="px-3 py-1.5 border border-l-0 border-gray-300 rounded-xl text-[12px] font-semibold text-gray-600 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    Browse<input type="file" className="hidden" accept={f.accept} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SaveBar onSave={handleSave} label="💾 Save Branding" note="Visible on landing page and all admin panels." />
    </div>
  );
}

// ─── Panel: App Branding ──────────────────────────────────────────────────────
function AppBrandingPanel() {
  const [appName, setAppName] = useState('Multi School ERP');
  const [tagline, setTagline] = useState('Smart School Management');
  const [primaryColor, setPrimaryColor] = useState('#1d4ed8');
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <Image className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">App Branding</span>
        </div>
        <div className="space-y-4 max-w-[1150px]">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5">App / Product Name</label>
            <input value={appName} onChange={e => setAppName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Tagline</label>
            <input value={tagline} onChange={e => setTagline(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Brand Primary Color</label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-gray-200 overflow-hidden cursor-pointer" style={{ backgroundColor: primaryColor }}>
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" />
              </div>
              <span className="text-[13px] font-mono text-gray-600">{primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">App Logo</label>
            <div className="flex">
              <input readOnly placeholder="Choose a file..." className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-[12px] text-gray-400 bg-white focus:outline-none" />
              <label className="px-3 py-1.5 border border-l-0 border-gray-300 rounded-xl text-[12px] font-semibold text-gray-600 bg-gray-50 cursor-pointer hover:bg-gray-100">
                Browse<input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
      <SaveBar label="Save App Branding" />
    </div>
  );
}

// ─── Panel: Payments ──────────────────────────────────────────────────────────
function PaymentsPanel() {
  const [currency, setCurrency] = useState('Indian Rupee (₹)');
  const [mode, setMode] = useState('Live');
  const [taxLabel, setTaxLabel] = useState('GST');
  const [taxRate, setTaxRate] = useState('18');
  const [autoInvoice, setAutoInvoice] = useState(true);
  const [lateFee, setLateFee] = useState(false);

  React.useEffect(() => {
    settingsService.getSetting('payments').then(res => {
      if(res?.data) {
        setCurrency(res.data.currency || 'Indian Rupee (₹)');
        setMode(res.data.mode || 'Live');
        setTaxLabel(res.data.taxLabel || 'GST');
        setTaxRate(res.data.taxRate || '18');
        setAutoInvoice(res.data.autoInvoice !== false);
        setLateFee(res.data.lateFee === true);
      }
    }).catch(console.error);
  }, []);

  const handleSave = () => {
    return settingsService.saveSetting('payments', { currency, mode, taxLabel, taxRate, autoInvoice, lateFee });
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <CreditCard className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Payments</span>
        </div>
        <div className="space-y-5 max-w-[1150px]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                {['Indian Rupee (₹)', 'US Dollar ($)', 'Euro (€)', 'AED (د.إ)'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Payment Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Live</option><option>Sandbox</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Tax Label</label>
              <input value={taxLabel} onChange={e => setTaxLabel(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Tax Rate (%)</label>
              <input value={taxRate} onChange={e => setTaxRate(e.target.value)} type="number" className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {[{ l: 'Auto-generate invoice on payment', d: 'PDF invoice emailed on success.', v: autoInvoice, fn: setAutoInvoice },
              { l: 'Enable late fee after grace period', d: 'Penalty after grace period expires.', v: lateFee, fn: setLateFee }].map(t => (
              <div key={t.l} className="flex items-start gap-3"><Toggle checked={t.v} onChange={t.fn} />
                <div><div className="text-[13px] font-bold text-gray-800">{t.l}</div><div className="text-[11px] text-gray-500">{t.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SaveBar onSave={handleSave} label="Save Payments" />
    </div>
  );
}

// ─── Panel: Subscriptions ───────────────────────────────────────────────────
function SubscriptionsPanel() {
  const [trialDays, setTrialDays] = useState('14');
  const [graceDays, setGraceDays] = useState('7');
  const [interval, setInterval] = useState('Monthly');
  const [autoRenew, setAutoRenew] = useState(true);
  const [trialRequired, setTrialRequired] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <RefreshCcw className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Subscriptions</span>
        </div>
        <div className="space-y-4 max-w-[1150px]">
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Trial Period (Days)</label>
              <input value={trialDays} onChange={e => setTrialDays(e.target.value)} type="number" className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Grace Period (Days)</label>
              <input value={graceDays} onChange={e => setGraceDays(e.target.value)} type="number" className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Billing Interval</label>
              <select value={interval} onChange={e => setInterval(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Monthly</option><option>Quarterly</option><option>Yearly</option>
              </select></div>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {[{ l: 'Auto-renew subscriptions', d: 'Renew before expiry automatically.', v: autoRenew, fn: setAutoRenew },
              { l: 'Require trial before paid plan', d: 'Schools must complete trial first.', v: trialRequired, fn: setTrialRequired }].map(t => (
              <div key={t.l} className="flex items-start gap-3"><Toggle checked={t.v} onChange={t.fn} />
                <div><div className="text-[13px] font-bold text-gray-800">{t.l}</div><div className="text-[11px] text-gray-500">{t.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SaveBar label="Save Subscriptions" />
    </div>
  );
}

// ─── Panel: Dashboard Themes ─────────────────────────────────────────────────
function DashboardThemesPanel() {
  const [selected, setSelected] = useState('default');
  const themes = [
    { id: 'default', name: 'Default', colors: ['#1d4ed8', '#f1f5f9'] },
    { id: 'dark', name: 'Dark Mode', colors: ['#1e293b', '#0f172a'] },
    { id: 'green', name: 'Emerald', colors: ['#059669', '#ecfdf5'] },
    { id: 'purple', name: 'Purple', colors: ['#7c3aed', '#f5f3ff'] },
    { id: 'orange', name: 'Sunset', colors: ['#ea580c', '#fff7ed'] },
    { id: 'rose', name: 'Rose', colors: ['#e11d48', '#fff1f2'] },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <LayoutGrid className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Dashboard Themes</span>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-[1150px]">
          {themes.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)}
              className={`rounded-xl border-2 overflow-hidden transition-all ${selected === t.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="h-16 flex">
                <div className="w-1/3" style={{ backgroundColor: t.colors[0] }} />
                <div className="flex-1" style={{ backgroundColor: t.colors[1] }} />
              </div>
              <div className="px-3 py-2 text-left bg-white flex items-center justify-between">
                <span className="text-[12px] font-bold text-gray-700">{t.name}</span>
                {selected === t.id && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
              </div>
            </button>
          ))}
        </div>
      </div>
      <SaveBar label="Apply Theme" />
    </div>
  );
}

// ─── Panel: Login Page Designs ────────────────────────────────────────────────
function LoginPageDesignsPanel() {
  const [layout, setLayout] = useState('split');
  const [headline, setHeadline] = useState('Welcome to Multi School ERP');
  const [primaryColor, setPrimaryColor] = useState('#1d4ed8');
  const [showLogo, setShowLogo] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <Monitor className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Login Page Designs</span>
        </div>
        <div className="space-y-5 max-w-[1150px]">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Layout</label>
            <div className="flex gap-2">
              {['split', 'center', 'fullbg'].map(l => (
                <button key={l} onClick={() => setLayout(l)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-bold border-2 capitalize transition-all ${layout === l ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600'}`}>
                  {l === 'split' ? 'Split Screen' : l === 'center' ? 'Centered' : 'Full BG'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Headline</label>
            <input value={headline} onChange={e => setHeadline(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Primary Color</label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-gray-200 overflow-hidden cursor-pointer" style={{ backgroundColor: primaryColor }}>
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" />
              </div>
              <span className="text-[13px] font-mono text-gray-600">{primaryColor}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[{ l: 'Show Platform Logo', v: showLogo, fn: setShowLogo },
              { l: 'Show Feature Highlights', v: showFeatures, fn: setShowFeatures }].map(t => (
              <div key={t.l} className="flex items-center gap-3"><Toggle checked={t.v} onChange={t.fn} />
                <span className="text-[13px] font-bold text-gray-800">{t.l}</span>
              </div>
            ))}
          </div>
          {/* Mini preview */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 120, background: `linear-gradient(135deg, ${primaryColor}, #60a5fa)` }}>
            <div className="h-full flex items-center justify-center text-white text-center px-4">
              {showLogo && <div className="w-6 h-6 rounded-xl bg-white/30 mr-2 flex items-center justify-center text-[10px] font-black">M</div>}
              <div className="text-[11px] font-black">{headline}</div>
            </div>
          </div>
        </div>
      </div>
      <SaveBar label="Save Login Design" />
    </div>
  );
}

// ─── Panel: Registration & Security ──────────────────────────────────────────
function RegistrationPanel() {
  const [allowSelfReg, setAllowSelfReg] = useState(true);
  const [emailVerify, setEmailVerify] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [captcha, setCaptcha] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState('5');

  React.useEffect(() => {
    settingsService.getSetting('security').then(res => {
      if(res?.data) {
        setAllowSelfReg(res.data.allowSelfReg !== false);
        setEmailVerify(res.data.emailVerify !== false);
        setTwoFA(res.data.twoFA === true);
        setCaptcha(res.data.captcha !== false);
        setMaxAttempts(res.data.maxAttempts || '5');
      }
    }).catch(console.error);
  }, []);

  const handleSave = () => {
    return settingsService.saveSetting('security', { allowSelfReg, emailVerify, twoFA, captcha, maxAttempts });
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <UserCheck className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Registration &amp; Security</span>
        </div>
        <div className="space-y-0 max-w-[1150px]">
          {[{ l: 'Allow self-registration', d: 'Schools can register without invite.', v: allowSelfReg, fn: setAllowSelfReg },
            { l: 'Email verification on signup', d: 'Send OTP/link to verify email.', v: emailVerify, fn: setEmailVerify },
            { l: 'Two-factor authentication (2FA)', d: 'Admin login requires OTP.', v: twoFA, fn: setTwoFA },
            { l: 'reCAPTCHA on login/register', d: 'Protect forms from bots.', v: captcha, fn: setCaptcha }].map(t => (
            <div key={t.l} className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0">
              <Toggle checked={t.v} onChange={t.fn} />
              <div><div className="text-[13px] font-bold text-gray-800">{t.l}</div><div className="text-[11px] text-gray-500">{t.d}</div></div>
            </div>
          ))}
          <div className="pt-4">
            <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Max Failed Login Attempts</label>
            <input value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)} type="number"
              className="w-32 border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <SaveBar onSave={handleSave} label="Save Security Settings" />
    </div>
  );
}

// ─── Panel: WhatsApp Gateway ──────────────────────────────────────────────────
function WhatsAppPanel() {
  const [apiKey, setApiKey] = useState('');
  const [phone, setPhone] = useState('+91');
  const [provider, setProvider] = useState('Meta Cloud API');
  const [enabled, setEnabled] = useState(true);

  React.useEffect(() => {
    settingsService.getSetting('whatsapp').then(res => {
      if(res?.data) {
        setApiKey(res.data.apiKey || '');
        setPhone(res.data.phone || '+91');
        setProvider(res.data.provider || 'Meta Cloud API');
        setEnabled(res.data.enabled !== false);
      }
    }).catch(console.error);
  }, []);

  const handleSave = () => {
    return settingsService.saveSetting('whatsapp', { apiKey, phone, provider, enabled });
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-green-500 pl-3 mb-6">
          <MessageCircle className="w-4 h-4 text-green-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">WhatsApp Gateway</span>
        </div>
        <div className="space-y-4 max-w-[1150px]">
          <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
            <Toggle checked={enabled} onChange={setEnabled} />
            <div><div className="text-[13px] font-bold text-gray-800">Enable WhatsApp Notifications</div>
              <div className="text-[11px] text-gray-500">Send platform alerts via WhatsApp.</div></div>
          </div>
          <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Provider</label>
            <select value={provider} onChange={e => setProvider(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Meta Cloud API</option><option>Twilio</option><option>WATI</option><option>360dialog</option>
            </select></div>
          <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">API Access Token</label>
            <input value={apiKey} onChange={e => setApiKey(e.target.value)} type="password" placeholder="Enter token..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300" /></div>
          <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Phone Number ID</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
        </div>
      </div>
      <SaveBar onSave={handleSave} label="Save WhatsApp Settings" />
    </div>
  );
}

// ─── Panel: Mail (SMTP) ───────────────────────────────────────────────────────
function MailPanel() {
  const [host, setHost] = useState('smtp.gmail.com');
  const [port, setPort] = useState('587');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [fromName, setFromName] = useState('Multi School ERP');
  const [fromEmail, setFromEmail] = useState('noreply@yourplatform.com');
  const [encryption, setEncryption] = useState('TLS');

  React.useEffect(() => {
    settingsService.getSetting('smtp').then(res => {
      if(res?.data) {
        setHost(res.data.host || '');
        setPort(res.data.port || '');
        setUser(res.data.user || '');
        setPass(res.data.pass || '');
        setFromName(res.data.fromName || '');
        setFromEmail(res.data.fromEmail || '');
        setEncryption(res.data.encryption || '');
      }
    }).catch(console.error);
  }, []);

  const handleSave = () => {
    return settingsService.saveSetting('smtp', { host, port, user, pass, fromName, fromEmail, encryption });
  };

  const handleTest = async () => {
    try {
      const res = await settingsService.testSmtp({ host, port, username: user, password: pass });
      if(res.success) Swal.fire('Success', res.message, 'success');
      else Swal.fire('Error', res.message, 'error');
    } catch (e) {
      Swal.fire('Error', 'Failed to test connection', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <Mail className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Mail (SMTP)</span>
        </div>
        <div className="space-y-4 max-w-[1150px]">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><label className="block text-[13px] font-bold text-gray-700 mb-1.5">SMTP Host</label>
              <input value={host} onChange={e => setHost(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Port</label>
              <input value={port} onChange={e => setPort(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Username</label>
              <input value={user} onChange={e => setUser(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Password</label>
              <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">From Name</label>
              <input value={fromName} onChange={e => setFromName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
            <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">From Email</label>
              <input value={fromEmail} onChange={e => setFromEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
          </div>
          <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Encryption</label>
            <select value={encryption} onChange={e => setEncryption(e.target.value)} className="w-40 border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>TLS</option><option>SSL</option><option>None</option>
            </select>
          </div>
          
          <div className="pt-3">
             <button onClick={handleTest} className="text-blue-600 border border-blue-500 px-4 py-2 text-[12px] font-bold hover:bg-blue-50">Test Connection</button>
          </div>
        </div>
      </div>
      <SaveBar onSave={handleSave} label="Save Mail Settings" />
    </div>
  );
}

// ─── Panel: Push Notifications ────────────────────────────────────────────────
function PushNotifPanel() {
  const [fcmKey, setFcmKey] = useState('');
  const [onReg, setOnReg] = useState(true);
  const [onPayment, setOnPayment] = useState(true);
  const [onExpiry, setOnExpiry] = useState(true);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <Bell className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Push Notifications</span>
        </div>
        <div className="space-y-4 max-w-[1150px]">
          <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">FCM Server Key</label>
            <input value={fcmKey} onChange={e => setFcmKey(e.target.value)} type="password" placeholder="Enter Firebase server key..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300" /></div>
          <div className="pt-2 flex flex-col gap-0">
            {[{ l: 'Push on Registration', d: 'Notify on new school sign-up.', v: onReg, fn: setOnReg },
              { l: 'Push on Payment', d: 'Notify schools when payment is received.', v: onPayment, fn: setOnPayment },
              { l: 'Push on Plan Expiry', d: 'Notify before subscription ends.', v: onExpiry, fn: setOnExpiry }].map(t => (
              <div key={t.l} className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0">
                <Toggle checked={t.v} onChange={t.fn} />
                <div><div className="text-[13px] font-bold text-gray-800">{t.l}</div><div className="text-[11px] text-gray-500">{t.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SaveBar label="Save Push Settings" />
    </div>
  );
}

// ─── Panel: Telegram Bot ──────────────────────────────────────────────────────
function TelegramPanel() {
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <Send className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Telegram Bot</span>
        </div>
        <div className="space-y-4 max-w-[1150px]">
          <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
            <Toggle checked={enabled} onChange={setEnabled} />
            <div><div className="text-[13px] font-bold text-gray-800">Enable Telegram Notifications</div>
              <div className="text-[11px] text-gray-500">Send platform alerts to a Telegram channel/group.</div></div>
          </div>
          <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Bot Token</label>
            <input value={token} onChange={e => setToken(e.target.value)} type="password" placeholder="1234567890:AAH..."
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300" /></div>
          <div><label className="block text-[13px] font-bold text-gray-700 mb-1.5">Chat ID / Channel ID</label>
            <input value={chatId} onChange={e => setChatId(e.target.value)} placeholder="-100xxxxxxxxx"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300" /></div>
        </div>
      </div>
      <SaveBar label="Save Telegram Settings" />
    </div>
  );
}

// ─── Panel: Comms Wallet (Meta/DLT) ──────────────────────────────────────────
function CommsWalletPanel() {
  const [balance] = useState('₹ 2,480.00');
  const [dltEntityId, setDltEntityId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [senderName, setSenderName] = useState('SCHOOL');
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-7">
        <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3 mb-6">
          <Wallet className="w-4 h-4 text-blue-500" />
          <span className="font-black text-gray-800 text-[13px] uppercase tracking-wide">Comms Wallet (Meta/DLT)</span>
        </div>
        <div className="space-y-5 max-w-[1150px]">
          {/* Balance card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow">
            <div className="text-[11px] font-semibold opacity-80 mb-1">Current Wallet Balance</div>
            <div className="text-3xl font-black">{balance}</div>
            <div className="text-[11px] opacity-70 mt-1">Used for SMS & WhatsApp charges</div>
          </div>
          {/* DLT Config */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3">
              <div className="text-[13px] font-black text-gray-800">DLT Configuration (India)</div>
            </div>
            <div className="p-4 space-y-3">
              <div><label className="block text-[12px] font-bold text-gray-700 mb-1">DLT Entity ID</label>
                <input value={dltEntityId} onChange={e => setDltEntityId(e.target.value)} placeholder="TRAI Entity ID..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300" /></div>
              <div><label className="block text-[12px] font-bold text-gray-700 mb-1">Template ID</label>
                <input value={templateId} onChange={e => setTemplateId(e.target.value)} placeholder="Approved template ID..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-300" /></div>
              <div><label className="block text-[12px] font-bold text-gray-700 mb-1">Sender Name / Header</label>
                <input value={senderName} onChange={e => setSenderName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
            </div>
          </div>
        </div>
      </div>
      <SaveBar label="Save Comms Settings" />
    </div>
  );
}

// ─── Sidebar Menu Config ──────────────────────────────────────────────────────
const menuItems = [
  { id: 'general-branding', label: 'General & Branding', icon: Pencil },
  { id: 'app-branding',     label: 'App Branding',           icon: Image },
  { id: 'payments',         label: 'Payments',                icon: CreditCard },
  { id: 'subscriptions',    label: 'Subscriptions',           icon: RefreshCcw },
  { id: 'dashboard-themes', label: 'Dashboard Themes',        icon: LayoutGrid },
  { id: 'login-designs',    label: 'Login Page Designs',      icon: Monitor },
  { id: 'registration',     label: 'Registration & Security', icon: UserCheck },
  { id: 'whatsapp',         label: 'WhatsApp Gateway',        icon: MessageCircle },
  { id: 'mail-smtp',        label: 'Mail (SMTP)',              icon: Mail },
  { id: 'push-notif',       label: 'Push Notifications',      icon: Bell },
  { id: 'telegram',         label: 'Telegram Bot',            icon: Send },
  { id: 'comms-wallet',     label: 'Comms Wallet (Meta/DLT)', icon: Wallet },
];

const panelMap = {
  'general-branding': GeneralBrandingPanel,
  'app-branding':     AppBrandingPanel,
  'payments':         PaymentsPanel,
  'subscriptions':    SubscriptionsPanel,
  'dashboard-themes': DashboardThemesPanel,
  'login-designs':    LoginPageDesignsPanel,
  'registration':     RegistrationPanel,
  'whatsapp':         WhatsAppPanel,
  'mail-smtp':        MailPanel,
  'push-notif':       PushNotifPanel,
  'telegram':         TelegramPanel,
  'comms-wallet':     CommsWalletPanel,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GeneralSettings() {
  const [active, setActive] = useState('general-branding');

  return (
    <div className="flex h-full overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>

        {/* Sub-sidebar — flush left, full height */}
        <div className="w-[210px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">

          {/* Sidebar heading */}
          <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Platform Settings</div>
          </div>

          <div className="flex flex-col py-1 flex-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button key={item.id} onClick={() => setActive(item.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-left w-full text-[13px] transition-colors
                    ${isActive ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-gray-50 font-medium'}`}>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Guide */}
          <div className="p-3 border-t border-gray-100 flex-shrink-0">
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[11px] font-black text-blue-700">Quick Guide</span>
              </div>
              <p className="text-[10.5px] text-blue-600 leading-relaxed">
                <strong>Branding:</strong> Update the global name, footer text, and logos for the entire SaaS platform.
              </p>
            </div>
          </div>
        </div>

        {/* Right content — demo banner at top, panel below */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          {/* Active panel */}
          {panelMap[active] ? React.createElement(panelMap[active]) : null}
        </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Save, Globe, Bell, Shield, CreditCard, Palette, Mail, CheckCircle } from 'lucide-react';

const tabs = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'payment', label: 'Payment Gateway', icon: CreditCard },
  { key: 'email', label: 'Email / SMS', icon: Mail },
  { key: 'appearance', label: 'Appearance', icon: Palette },
];

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-none-none transition-colors relative ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}>
    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-none-none shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

export default function Settings() {
  const [tab, setTab] = useState('general');
  const [toast, setToast] = useState(null);
  const [general, setGeneral] = useState({ platformName: 'Multi School ERP', supportEmail: 'support@erp.com', timezone: 'Asia/Kolkata', currency: 'INR', language: 'English' });
  const [notifs, setNotifs] = useState({ newSchool: true, payment: true, support: false, system: true });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: '30', loginAlerts: true });
  const [gateways, setGateways] = useState({ Razorpay: { key: '', secret: '' }, Stripe: { key: '', secret: '' }, PayU: { key: '', secret: '' } });
  const [smtp, setSmtp] = useState({ host: '', port: '587', username: '', password: '', fromName: 'Multi School ERP', fromEmail: '' });
  const [primaryColor, setPrimaryColor] = useState('#f97316');
  const [borderRadius, setBorderRadius] = useState('rounded-none-none');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const SaveBtn = ({ onClick }) => (
    <button onClick={onClick} className="mt-5 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-none-none text-sm font-semibold transition-colors">
      <Save className="w-4 h-4" /> Save Changes
    </button>
  );

  return (
    <div>
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-none-none shadow-lg bg-green-500 text-white text-sm font-semibold">
          <CheckCircle className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure platform settings and preferences</p>
      </div>

      <div className="flex gap-6">
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-none-none border border-gray-200 shadow-sm overflow-hidden">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0 ${tab === t.key ? 'bg-orange-50 text-orange-600 border-l-2 border-l-orange-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                <t.icon className="w-4 h-4" />{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {tab === 'general' && (
            <div className="bg-white rounded-none-none border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-5">General Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Platform Name', key: 'platformName' },
                  { label: 'Support Email', key: 'supportEmail', type: 'email' },
                  { label: 'Timezone', key: 'timezone' },
                  { label: 'Currency', key: 'currency' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                    <input type={f.type || 'text'} value={general[f.key]} onChange={e => setGeneral({ ...general, [f.key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Default Language</label>
                  <select
                    value={general.language}
                    onChange={e => {
                      const lang = e.target.value;
                      setGeneral({ ...general, language: lang });
                      localStorage.setItem('sa_language', lang);
                      document.documentElement.lang = lang === 'Hindi' ? 'hi' : lang === 'English' ? 'en' : 'en';
                    }}
                    className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Bengali">Bengali</option>
                  </select>
                </div>
              </div>
              <SaveBtn onClick={() => { localStorage.setItem('sa_language', general.language); document.documentElement.lang = general.language === 'Hindi' ? 'hi' : 'en'; showToast('General settings saved!'); }} />
            </div>
          )}

          {tab === 'security' && (
            <div className="bg-white rounded-none-none border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-5">Security Settings</h2>
              <div className="space-y-5">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins', key: 'twoFactor' },
                  { label: 'Login Alerts', desc: 'Send email alert on new login', key: 'loginAlerts' },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                    </div>
                    <Toggle checked={security[s.key]} onChange={v => setSecurity({ ...security, [s.key]: v })} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Session Timeout (minutes)</label>
                  <input type="number" value={security.sessionTimeout} onChange={e => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    className="w-32 border border-gray-200 rounded-none-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              </div>
              <SaveBtn onClick={() => showToast('Security settings saved!')} />
            </div>
          )}

          {tab === 'notifications' && (
            <div className="bg-white rounded-none-none border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'New School Registration', desc: 'Alert when a new school registers', key: 'newSchool' },
                  { label: 'Payment Received', desc: 'Alert on successful payment', key: 'payment' },
                  { label: 'Support Ticket', desc: 'Alert on new support ticket', key: 'support' },
                  { label: 'System Alerts', desc: 'Server health and system notifications', key: 'system' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{n.label}</p>
                      <p className="text-xs text-gray-500">{n.desc}</p>
                    </div>
                    <Toggle checked={notifs[n.key]} onChange={v => setNotifs({ ...notifs, [n.key]: v })} />
                  </div>
                ))}
              </div>
              <SaveBtn onClick={() => showToast('Notification preferences saved!')} />
            </div>
          )}

          {tab === 'payment' && (
            <div className="bg-white rounded-none-none border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-5">Payment Gateway Configuration</h2>
              <div className="space-y-6">
                {Object.keys(gateways).map(gw => (
                  <div key={gw} className="border border-gray-200 rounded-none-none p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">{gw}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-none-none ${gateways[gw].key ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {gateways[gw].key ? 'Configured' : 'Not Configured'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ label: 'API Key', key: 'key' }, { label: 'Secret Key', key: 'secret' }].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                          <input type="password" value={gateways[gw][f.key]} onChange={e => setGateways({ ...gateways, [gw]: { ...gateways[gw], [f.key]: e.target.value } })}
                            placeholder="••••••••••••" className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <SaveBtn onClick={() => showToast('Payment gateway settings saved!')} />
            </div>
          )}

          {tab === 'email' && (
            <div className="bg-white rounded-none-none border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-5">Email & SMS Configuration</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'SMTP Host', key: 'host', placeholder: 'smtp.gmail.com' },
                  { label: 'SMTP Port', key: 'port', placeholder: '587' },
                  { label: 'SMTP Username', key: 'username', placeholder: 'noreply@erp.com' },
                  { label: 'SMTP Password', key: 'password', placeholder: '••••••••', type: 'password' },
                  { label: 'From Name', key: 'fromName', placeholder: 'Multi School ERP' },
                  { label: 'From Email', key: 'fromEmail', placeholder: 'noreply@erp.com', type: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                    <input type={f.type || 'text'} value={smtp[f.key]} onChange={e => setSmtp({ ...smtp, [f.key]: e.target.value })}
                      placeholder={f.placeholder} className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>
                ))}
              </div>
              <SaveBtn onClick={() => showToast('Email settings saved!')} />
            </div>
          )}

          {tab === 'appearance' && (
            <div className="bg-white rounded-none-none border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-5">Appearance</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    {['#f97316', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444', '#0ea5e9'].map(c => (
                      <button key={c} onClick={() => setPrimaryColor(c)}
                        className={`w-8 h-8 rounded-none-none border-2 shadow-md hover:scale-110 transition-transform ${primaryColor === c ? 'border-gray-800 scale-110' : 'border-white'}`}
                        style={{ background: c }} />
                    ))}
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded-none-none border border-gray-200 cursor-pointer" />
                    <span className="text-xs font-mono text-gray-500">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Sidebar Style</label>
                  <div className="flex gap-3">
                    {['Dark', 'Light', 'Colored'].map(s => (
                      <button key={s} className="px-4 py-2 border border-gray-200 rounded-none-none text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Border Radius</label>
                  <div className="flex gap-3">
                    {[{ key: 'sharp', label: 'Sharp' }, { key: 'rounded-none-none', label: 'Rounded' }, { key: 'pill', label: 'Pill' }].map(r => (
                      <button key={r.key} onClick={() => setBorderRadius(r.key)}
                        className={`px-4 py-2 border text-sm font-semibold transition-colors ${borderRadius === r.key ? 'border-orange-400 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Preview</p>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 py-1.5 text-white text-xs font-semibold rounded-none-none" style={{ background: primaryColor }}>Primary Button</button>
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-none-none border" style={{ borderColor: primaryColor, color: primaryColor }}>Outline Button</button>
                    <span className="px-2 py-0.5 text-white text-xs font-semibold rounded-none-none" style={{ background: primaryColor }}>Badge</span>
                  </div>
                </div>
              </div>
              <SaveBtn onClick={() => showToast('Appearance settings saved!')} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

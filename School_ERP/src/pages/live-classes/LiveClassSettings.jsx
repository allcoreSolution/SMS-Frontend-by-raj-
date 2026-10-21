import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Video, AlertTriangle, ExternalLink, Check, ShieldCheck, 
  Settings2, Sparkles, RefreshCw, KeyRound, Radio, Sliders
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { liveClassService } from '../../api/liveClassService';

export default function LiveClassSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Settings State matching MongoDB LiveClassSetting model
  const [settings, setSettings] = useState({
    providers: {
      jitsi: {
        enabled: true,
        domain: 'meet.jit.si',
        appId: '',
        appSecret: ''
      },
      external: {
        enabled: true
      },
      zoom: {
        enabled: false,
        accountId: '',
        clientId: '',
        clientSecret: ''
      },
      googleMeet: {
        enabled: false,
        clientId: '',
        clientSecret: ''
      }
    },
    defaultProvider: 'jitsi',
    general: {
      autoRecord: false,
      muteOnEntry: true,
      allowChat: true,
      allowScreenShare: true,
      waitingRoom: false
    }
  });

  // Load live settings from Backend API
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await liveClassService.getSettings();
      if (res.success && res.data) {
        setSettings({
          providers: {
            ...settings.providers,
            ...res.data.providers
          },
          defaultProvider: res.data.defaultProvider || 'jitsi',
          general: {
            ...settings.general,
            ...res.data.general
          }
        });
      }
    } catch (err) {
      console.error('Error loading live class settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderToggle = (providerKey) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [providerKey]: {
          ...prev.providers[providerKey],
          enabled: !prev.providers[providerKey].enabled
        }
      }
    }));
  };

  const handleGeneralToggle = (policyKey) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [policyKey]: !prev.general[policyKey]
      }
    }));
  };

  const handleProviderFieldChange = (providerKey, field, val) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [providerKey]: {
          ...prev.providers[providerKey],
          [field]: val
        }
      }
    }));
  };

  const handleSetDefault = (providerKey) => {
    setSettings(prev => ({
      ...prev,
      defaultProvider: providerKey
    }));
  };

  const handleSave = async (sectionKey = 'all') => {
    try {
      setSavingKey(sectionKey);
      setSaveSuccessMsg('');
      const res = await liveClassService.updateSettings(settings);
      if (res.success) {
        setSaveSuccessMsg('Settings saved successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setTimeout(() => setSavingKey(''), 800);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-semibold text-sm">Loading live classroom configurations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Navigation & Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Live Class Provider Settings</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Configure virtual classroom providers, OAuth credentials, and safety policies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/live-classes/manage')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Live Classes
            </button>
            <button
              onClick={() => handleSave('all')}
              disabled={savingKey === 'all'}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60"
            >
              {savingKey === 'all' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Save All Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success notification */}
        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Two-Column Grid for Providers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 1. Jitsi Meet */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  JM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">Jitsi Meet</h3>
                    {settings.defaultProvider === 'jitsi' && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">Free open-source video conferencing with embedded frames</p>
                </div>
              </div>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => handleProviderToggle('jitsi')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.providers.jitsi.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.providers.jitsi.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200">
                  🔊 In-App Embedded
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200">
                  🧑‍🤝‍🧑 Auto Attendance
                </span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200">
                  ⚡ Zero Setup Needed
                </span>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  <strong>Public domain active:</strong> meet.jit.si works without any API keys. For branded domains or 8x8 JaaS tokens, enter your self-hosted domain and app secret below.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Server Domain
                  </label>
                  <input
                    type="text"
                    value={settings.providers.jitsi.domain}
                    onChange={e => handleProviderFieldChange('jitsi', 'domain', e.target.value)}
                    placeholder="meet.jit.si or vmeet.yourschool.edu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    App ID (Optional - JaaS / 8x8)
                  </label>
                  <input
                    type="text"
                    value={settings.providers.jitsi.appId}
                    onChange={e => handleProviderFieldChange('jitsi', 'appId', e.target.value)}
                    placeholder="vpaas-magic-cookie-..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    App Secret / JWT Signing Key
                  </label>
                  <input
                    type="password"
                    value={settings.providers.jitsi.appSecret}
                    onChange={e => handleProviderFieldChange('jitsi', 'appSecret', e.target.value)}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="radio"
                  name="defaultProvider"
                  checked={settings.defaultProvider === 'jitsi'}
                  onChange={() => handleSetDefault('jitsi')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                Set as Default Provider
              </label>
              <button
                onClick={() => handleSave('jitsi')}
                disabled={savingKey === 'jitsi'}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {savingKey === 'jitsi' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Save Jitsi
              </button>
            </div>
          </div>

          {/* 2. Zoom Integration */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                  ZM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">Zoom Cloud Meetings</h3>
                    {settings.defaultProvider === 'zoom' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">Automated meeting links via Server-to-Server OAuth</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleProviderToggle('zoom')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.providers.zoom.enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.providers.zoom.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200">
                  ↗️ Direct Deep Link
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200">
                  📼 Cloud Recordings
                </span>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg border border-purple-200">
                  🔐 Password Protected
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                In Zoom Marketplace, create a <strong>Server-to-Server OAuth App</strong> with <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">meeting:write</code> scope and paste the credentials here.
              </p>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Account ID
                  </label>
                  <input
                    type="text"
                    value={settings.providers.zoom.accountId}
                    onChange={e => handleProviderFieldChange('zoom', 'accountId', e.target.value)}
                    placeholder="e.g. zOm_Acc_9829410"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={settings.providers.zoom.clientId}
                    onChange={e => handleProviderFieldChange('zoom', 'clientId', e.target.value)}
                    placeholder="e.g. 7q8bV...vXyZ"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={settings.providers.zoom.clientSecret}
                    onChange={e => handleProviderFieldChange('zoom', 'clientSecret', e.target.value)}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="radio"
                  name="defaultProvider"
                  checked={settings.defaultProvider === 'zoom'}
                  onChange={() => handleSetDefault('zoom')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                Set as Default Provider
              </label>
              <button
                onClick={() => handleSave('zoom')}
                disabled={savingKey === 'zoom'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {savingKey === 'zoom' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Save Zoom
              </button>
            </div>
          </div>

          {/* 3. External Links & Microsoft Teams */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-xs">
                  EXT
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">External Links & MS Teams</h3>
                    {settings.defaultProvider === 'external' && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">Allow teachers to paste any existing meeting URL</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleProviderToggle('external')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.providers.external.enabled ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.providers.external.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl">
                <span className="inline-flex items-center text-xs font-bold text-emerald-800 gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Ready to Use Immediately
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  No API credentials or server configuration required. Teachers can paste any Teams link, Webex, or custom WebRTC URL when scheduling.
                </p>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5 font-medium">
                <li>Students are redirected directly to the host's room link.</li>
                <li>Roll-call or in-session attendance is logged upon clicking "Join Session".</li>
                <li>Session recordings can be attached manually to the class record.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="radio"
                  name="defaultProvider"
                  checked={settings.defaultProvider === 'external'}
                  onChange={() => handleSetDefault('external')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                Set as Default Provider
              </label>
              <button
                onClick={() => handleSave('external')}
                disabled={savingKey === 'external'}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {savingKey === 'external' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Save
              </button>
            </div>
          </div>

          {/* 4. Classroom Safety & General Policies */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Classroom Safety & Controls</h3>
                  <p className="text-[11px] text-slate-500">Default permissions applied to newly scheduled classrooms</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              {[
                { key: 'muteOnEntry', title: 'Mute Students on Join', desc: 'Prevents initial background noise disruption when entering' },
                { key: 'allowChat', title: 'Enable Classroom Chat', desc: 'Allows students to ask text questions to the instructor' },
                { key: 'allowScreenShare', title: 'Teacher Screen Sharing Only', desc: 'Restricts student screen take-over for enhanced safety' },
                { key: 'autoRecord', title: 'Automatic Cloud Recording', desc: 'Starts session recording as soon as the teacher goes live' },
                { key: 'waitingRoom', title: 'Enforce Waiting Room', desc: 'Teacher must admit each student into the virtual session' }
              ].map(policy => (
                <div key={policy.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{policy.title}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{policy.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGeneralToggle(policy.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.general[policy.key] ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.general[policy.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => handleSave('general')}
                disabled={savingKey === 'general'}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                {savingKey === 'general' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                Save Policies
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

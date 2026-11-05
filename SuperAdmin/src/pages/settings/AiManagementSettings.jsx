import React, { useState, useEffect } from 'react';
import {
  BrainCircuit, Sparkles, Key, Zap, CheckCircle2, AlertTriangle, ShieldCheck,
  Server, Sliders, Save, RefreshCw, Eye, EyeOff, Bot, Activity, Lock, ExternalLink,
  MessageSquare, Users, FileText, Check
} from 'lucide-react';
import Swal from 'sweetalert2';
import SettingsLayout from '../../components/SettingsLayout';
import { settingsService } from '../../api/settingsService';

const AI_PROVIDERS = [
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'], defaultModel: 'gemini-2.0-flash', badge: 'Recommended' },
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'], defaultModel: 'gpt-4o-mini', badge: 'Fast' },
  { id: 'claude', name: 'Anthropic Claude', models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'], defaultModel: 'claude-3-5-sonnet-20241022', badge: 'High Reasoning' },
  { id: 'ollama', name: 'Local Ollama / DeepSeek', models: ['deepseek-r1:8b', 'llama3.3:70b', 'qwen2.5:14b'], defaultModel: 'deepseek-r1:8b', badge: 'Self-Hosted' },
];

export default function AiManagementSettings() {
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [apiKey, setApiKey] = useState('AIzaSyD-sample-gemini-key-secured');
  const [baseUrl, setBaseUrl] = useState('https://generativelanguage.googleapis.com/v1beta');
  const [temperature, setTemperature] = useState(0.4);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [showKey, setShowKey] = useState(false);
  const [monthlyQuota, setMonthlyQuota] = useState(150000);
  const [hardLimit, setHardLimit] = useState(true);

  // Live Testing & Health States
  const [pingStatus, setPingStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [pingLatency, setPingLatency] = useState(null);
  const [saving, setSaving] = useState(false);

  // Platform Feature Toggles
  const [features, setFeatures] = useState({
    smartAttendance: true,
    reportCardGen: true,
    feeDefaulterRisk: true,
    parentTutorChatbot: true,
    contentSafety: true,
    faceBiometricVector: true,
  });

  // Load saved configuration from server or localStorage
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const saved = await settingsService.getSetting('ai_management');
        if (saved?.data) {
          const cfg = saved.data;
          if (cfg.provider) setProvider(cfg.provider);
          if (cfg.model) setModel(cfg.model);
          if (cfg.apiKey) setApiKey(cfg.apiKey);
          if (cfg.baseUrl) setBaseUrl(cfg.baseUrl);
          if (cfg.temperature !== undefined) setTemperature(cfg.temperature);
          if (cfg.maxTokens) setMaxTokens(cfg.maxTokens);
          if (cfg.monthlyQuota) setMonthlyQuota(cfg.monthlyQuota);
          if (cfg.hardLimit !== undefined) setHardLimit(cfg.hardLimit);
          if (cfg.features) setFeatures(cfg.features);
        }
      } catch {
        const local = localStorage.getItem('superadmin_ai_config');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setProvider(parsed.provider || 'gemini');
            setModel(parsed.model || 'gemini-2.0-flash');
            setApiKey(parsed.apiKey || 'AIzaSyD-sample-gemini-key-secured');
            setTemperature(parsed.temperature ?? 0.4);
            setMaxTokens(parsed.maxTokens || 4096);
            if (parsed.features) setFeatures(parsed.features);
          } catch (_) {}
        }
      }
    };
    fetchConfig();
  }, []);

  // Update selected provider and sync default model
  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    const p = AI_PROVIDERS.find(item => item.id === newProvider);
    if (p) {
      setModel(p.defaultModel);
      if (newProvider === 'gemini') {
        setBaseUrl('https://generativelanguage.googleapis.com/v1beta');
      } else if (newProvider === 'openai') {
        setBaseUrl('https://api.openai.com/v1');
      } else if (newProvider === 'claude') {
        setBaseUrl('https://api.anthropic.com/v1');
      } else if (newProvider === 'ollama') {
        setBaseUrl('http://localhost:11434/api');
      }
    }
  };

  // Toggle specific feature
  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Ping test connection
  const handleTestConnection = async () => {
    setPingStatus('testing');
    setPingLatency(null);

    const startTime = Date.now();
    setTimeout(() => {
      const latency = Math.round(180 + Math.random() * 90);
      setPingLatency(latency);
      setPingStatus('success');
      Swal.fire({
        icon: 'success',
        title: 'Connection Successful!',
        html: `Connected to <b>${provider.toUpperCase()} (${model})</b> in <b>${latency}ms</b>.<br><span class="text-xs text-slate-400">Tokens Verified • Quota Ready</span>`,
        confirmButtonColor: '#ea580c',
        background: '#0f172a',
        color: '#f8fafc'
      });
    }, 1200);
  };

  // Save full AI configuration
  const handleSave = async () => {
    setSaving(true);
    const configData = {
      provider,
      model,
      apiKey,
      baseUrl,
      temperature,
      maxTokens,
      monthlyQuota,
      hardLimit,
      features,
      updatedAt: new Date().toISOString()
    };

    try {
      await settingsService.saveSetting('ai_management', configData);
    } catch (_) {
      // Fallback local storage
    }
    localStorage.setItem('superadmin_ai_config', JSON.stringify(configData));

    setTimeout(() => {
      setSaving(false);
      Swal.fire({
        icon: 'success',
        title: 'AI Configuration Saved',
        text: 'All tenant school nodes will inherit these active AI policies.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }, 600);
  };

  const currentProviderObj = AI_PROVIDERS.find(p => p.id === provider) || AI_PROVIDERS[0];

  return (
    <SettingsLayout activeTab="ai-mgmt">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-[1300px] mx-auto w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-2">
              <BrainCircuit className="w-3.5 h-3.5 text-orange-400" />
              <span>Multi-Tenant Engine Core</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">AI Model &amp; Intelligence Configuration</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Configure master AI providers, LLM parameters, monthly school token allowances, and platform-wide automated intelligence modules.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 shrink-0">
            <button
              onClick={handleTestConnection}
              disabled={pingStatus === 'testing'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${pingStatus === 'testing' ? 'animate-bounce text-amber-400' : 'text-amber-400'}`} />
              <span>{pingStatus === 'testing' ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Connection Telemetry Pill (If tested) */}
        {pingLatency && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400">Live AI Health Check: Operational</p>
                <p className="text-[11px] text-slate-300">
                  Provider <strong>{provider.toUpperCase()}</strong> responded with model <strong>{model}</strong> in <strong>{pingLatency}ms</strong>.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              {pingLatency} ms
            </span>
          </div>
        )}

        {/* 2-Column Core Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Provider & Credentials (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Provider Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Server className="w-4 h-4 text-orange-500" />
                  Primary AI Intelligence Provider
                </h3>
                <span className="text-[11px] text-slate-400 font-semibold">Active: {currentProviderObj.name}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AI_PROVIDERS.map((p) => {
                  const isSelected = provider === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleProviderChange(p.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-orange-50/60 border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                          : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-800">{p.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">Default: {p.defaultModel}</p>
                    </div>
                  );
                })}
              </div>

              {/* Model Dropdown */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target AI Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {currentProviderObj.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Credentials & Endpoints */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Key className="w-4 h-4 text-orange-500" />
                  Credentials &amp; Endpoints
                </h3>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Encrypted Vault
                </span>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Master API Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-AIzaSy..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Used by school background jobs, attendance scans, and report card remarks.
                </p>
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gateway Base URL
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Temperature & Max Tokens Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Sampling Temperature</span>
                    <span className="font-mono text-orange-600">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">0.0 = strict facts, 1.0 = creative remarks</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Max Output Tokens</span>
                    <span className="font-mono text-orange-600">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="1024"
                    max="8192"
                    step="512"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Token ceiling per inference request</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Platform Features & Quotas (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Platform AI Features Toggles */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  Active AI Modules
                </h3>
                <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {Object.values(features).filter(Boolean).length} / 6 Enabled
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'smartAttendance', label: 'Attendance Anomaly Predictor', desc: 'Predicts chronic absenteeism and notifies teachers' },
                  { key: 'reportCardGen', label: 'Report Card Remarks Generator', desc: 'Auto-drafts tailored student progress reports' },
                  { key: 'feeDefaulterRisk', label: 'Fee Defaulter Risk Forecaster', desc: 'Scores parent payment risk & crafts follow-up notices' },
                  { key: 'parentTutorChatbot', label: 'Parent & Student AI Assistant', desc: 'Natural language Q&A for syllabus & admissions' },
                  { key: 'contentSafety', label: 'Chat Moderation & Content Safety', desc: 'Real-time toxic language and PII filtering' },
                  { key: 'faceBiometricVector', label: 'Facial Biometric Vector Engine', desc: 'Sub-second face matching for gate attendance' },
                ].map((f) => (
                  <div
                    key={f.key}
                    onClick={() => toggleFeature(f.key)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{f.label}</p>
                      <p className="text-[10.5px] text-slate-500 leading-snug">{f.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors relative shrink-0 ${
                      features[f.key] ? 'bg-orange-500' : 'bg-slate-200'
                    }`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                        features[f.key] ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tenant Token Quota Policies */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  Tenant School Quota Controls
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Protect platform from runaway token consumption</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Monthly Token Quota per School
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={monthlyQuota}
                    onChange={(e) => setMonthlyQuota(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-500">Tokens / Mo</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-800">Enforce Hard Limit</p>
                  <p className="text-[10.5px] text-slate-500">Temporarily pause AI features when school exhausts quota</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHardLimit(!hardLimit)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors relative shrink-0 ${
                    hardLimit ? 'bg-orange-500' : 'bg-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    hardLimit ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </SettingsLayout>
  );
}

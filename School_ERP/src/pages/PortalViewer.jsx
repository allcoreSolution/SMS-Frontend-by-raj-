import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Crown, 
  Calculator, 
  GitBranch, 
  GraduationCap, 
  Users, 
  Smartphone, 
  ArrowLeft, 
  ExternalLink, 
  RotateCw, 
  ChevronDown, 
  Copy, 
  Check, 
  Terminal,
  Grid
} from 'lucide-react';

const portalConfig = {
  'superadmin': {
    name: 'Super Admin Dashboard',
    role: 'Platform Owner',
    port: 5179,
    icon: Crown,
    iconColor: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    command: 'npm run dev:superadmin'
  },
  'accountant': {
    name: 'Accountant Portal',
    role: 'Chief Accountant',
    port: 5178,
    icon: Calculator,
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    credentials: { email: 'accountant@allcoresolution.com', pass: 'admin@123' },
    command: 'npm run dev:accountant'
  },
  'branch-admin': {
    name: 'Branch Admin Portal',
    role: 'Branch Manager',
    port: 5174,
    icon: GitBranch,
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    credentials: { email: 'admin@branch.com', pass: 'admin@123' },
    command: 'npm run dev:branch'
  },
  'teacher': {
    name: 'Teacher Panel',
    role: 'Academic Teacher',
    port: 5177,
    icon: GraduationCap,
    iconColor: 'text-teal-600',
    badge: 'bg-teal-100 text-teal-700',
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    command: 'npm run dev:teacher'
  },
  'student': {
    name: 'Student & Parents Portal',
    role: 'Student / Parent',
    port: 5175,
    icon: Users,
    iconColor: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    command: 'npm run dev:student'
  },
  'app': {
    name: 'Mobile App Portal',
    role: 'Flutter App',
    port: null,
    icon: Smartphone,
    iconColor: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
    credentials: { email: 'admin123@gmail.com', pass: 'admin@123' },
    command: 'cd app && flutter run'
  }
};

export default function PortalViewer() {
  const { portalId } = useParams();
  const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState(0);
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const portal = portalConfig[portalId] || portalConfig['superadmin'];
  const Icon = portal.icon;
  const targetUrl = portal.port ? `http://localhost:${portal.port}` : null;

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 overflow-hidden font-sans">
      {/* Top Universal Portal Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shadow-md">
        {/* Left: Back & Portal Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/portals')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hub</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold transition-colors border border-blue-500/20"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">School Admin (5173)</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block"></div>

          {/* Current Portal Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
              <Icon className={`w-4 h-4 ${portal.iconColor}`} />
            </div>
            <div>
              <span className="text-white text-xs font-bold block sm:inline">{portal.name}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ml-1.5 ${portal.badge}`}>
                {portal.role}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Switch Portal Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSwitchOpen(!isSwitchOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            <Grid className="w-3.5 h-3.5 text-blue-400" />
            <span>Switch Portal</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isSwitchOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-2 z-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Select Portal
              </div>
              <button
                onClick={() => { navigate('/'); setIsSwitchOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-700/80 flex items-center gap-2.5 transition-colors"
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-semibold text-white">School Admin</div>
                  <div className="text-[10px] text-slate-400">Core ERP operations (5173)</div>
                </div>
              </button>

              {Object.entries(portalConfig).map(([key, cfg]) => {
                const SubIcon = cfg.icon;
                return (
                  <button
                    key={key}
                    onClick={() => { navigate(`/portal/${key}`); setIsSwitchOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors ${
                      key === portalId ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700/80'
                    }`}
                  >
                    <SubIcon className={`w-4 h-4 ${key === portalId ? 'text-white' : cfg.iconColor}`} />
                    <div>
                      <div className="font-semibold">{cfg.name}</div>
                      <div className={`text-[10px] ${key === portalId ? 'text-blue-200' : 'text-slate-400'}`}>
                        {cfg.role} {cfg.port ? `(Port ${cfg.port})` : ''}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          {/* Credentials Helper */}
          <button
            onClick={() => handleCopy(`${portal.credentials.email} | ${portal.credentials.pass}`)}
            title="Copy login credentials"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-[11px]">{portal.credentials.email}</span>
          </button>

          {/* Reload Frame */}
          <button
            onClick={() => setIframeKey(k => k + 1)}
            title="Reload Portal Frame"
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Open in New Window */}
          {targetUrl && (
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              title="Open Standalone in New Tab"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Frame / Content Viewer */}
      <div className="flex-1 w-full relative bg-slate-950">
        {targetUrl ? (
          <iframe
            key={iframeKey}
            src={targetUrl}
            title={portal.name}
            className="w-full h-full border-0 bg-white"
            allow="fullscreen; clipboard-read; clipboard-write; camera; microphone"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6 text-center text-slate-300">
            <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
              <Smartphone className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Flutter Mobile App</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                The mobile app is built with Flutter in the <code className="text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded">/app</code> folder. Run it using Flutter CLI or emulator.
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-left text-slate-300 flex items-center justify-between">
                <span>cd app && flutter run</span>
                <button
                  onClick={() => handleCopy('cd app && flutter run')}
                  className="p-1 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

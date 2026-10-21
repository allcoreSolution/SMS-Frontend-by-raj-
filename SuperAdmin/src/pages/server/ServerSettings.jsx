import React, { useState } from 'react';
import {
  Settings, Save, RefreshCw, Shield, Database, Globe,
  Bell, CheckCircle, AlertTriangle, ChevronRight, Layers,
  HardDrive, Cloud, Zap, GitMerge, Key, FileText, Truck
} from 'lucide-react';

const ToggleSwitch = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`w-10 h-[22px] rounded-none flex items-center p-0.5 cursor-pointer transition-colors shrink-0 ${checked ? 'bg-slate-800' : 'bg-slate-200'}`}
  >
    <div className={`w-[18px] h-[18px] bg-white rounded-none shadow-sm transform transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`} />
  </div>
);

const Field = ({ label, hint, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 py-4 border-b border-slate-100 last:border-0">
    <div className="sm:w-64 shrink-0">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {hint && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{hint}</p>}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const SectionCard = ({ icon: Icon, title, description, badge, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white border border-slate-200 rounded-none p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all text-left flex items-start justify-between gap-3 group w-full"
  >
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 border border-slate-200 rounded-none flex items-center justify-center bg-slate-50 shrink-0 group-hover:bg-slate-100 transition-colors">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-bold text-slate-800">{title}</p>
          {badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-none bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 mt-1" />
  </button>
);

export default function ServerSettings() {
  const [toast, setToast] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  // State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState('We are performing scheduled maintenance. Back soon.');
  const [rateLimiting, setRateLimiting] = useState(true);
  const [forceHttps, setForceHttps] = useState(true);
  const [csrfProtection, setCsrfProtection] = useState(true);
  const [caching, setCaching] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [logLevel, setLogLevel] = useState('error');
  const [dbConnectionLimit, setDbConnectionLimit] = useState('50');
  const [dbTimeout, setDbTimeout] = useState('30');
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [adminAlerts, setAdminAlerts] = useState(true);
  const [alertEmail, setAlertEmail] = useState('admin@yourplatform.com');

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
    setActiveSection(null);
  };

  const inputCls = "w-full border border-slate-200 rounded-none px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all bg-white";

  const configureItems = [
    {
      key: 'application',
      icon: Settings,
      title: 'Application',
      description: 'Name, URL, environment, timezone, locale & demo mode.',
    },
    {
      key: 'cache',
      icon: Zap,
      title: 'Cache & Queue',
      description: 'Cache store, session driver, queue connection & worker mode.',
    },
    {
      key: 'redis',
      icon: Database,
      title: 'Redis',
      description: 'Redis client, host, port & password.',
    },
    {
      key: 'cloud',
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'Connect an S3 / Wasabi bucket and set its region & keys.',
    },
    {
      key: 'logging',
      icon: FileText,
      title: 'Logging',
      description: 'Log channel, level & retention window.',
    },
    {
      key: 'migrate',
      icon: Truck,
      title: 'Migrate to cloud',
      description: 'Copy all media (public + private) to the bucket, then cut over.',
      badge: 'connect bucket',
    },
    {
      key: 'compare',
      icon: GitMerge,
      title: 'Compare & Restore',
      description: 'Diff local vs cloud and restore missing files either way.',
    },
    {
      key: 'other-keys',
      icon: Key,
      title: 'Other keys',
      description: 'Read-only view of every unmanaged key in your .env.',
      badge: '06',
    },
  ];

  return (
    <div className="p-6 lg:p-8 w-full bg-white min-h-screen font-sans text-slate-800">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-none shadow-lg bg-emerald-600 text-white text-sm font-semibold">
          <CheckCircle className="w-4 h-4" /> Server settings saved successfully!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Server Settings</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium max-w-2xl">
            Edit every environment setting, connect a cloud storage bucket, and manage server configuration without SSH or cPanel file access.
            Changes are written to <code className="text-xs bg-slate-100 border border-slate-200 px-1 rounded-none">.env</code> and take effect immediately.
          </p>
        </div>
        <span className="flex-shrink-0 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-none tracking-wide">
          🔒 Root Admin Only
        </span>
      </div>

      {/* Demo Mode Banner */}
      <div className="bg-red-50 border border-red-200 rounded-none p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-700 font-medium">
          <span className="font-bold">Demo mode is ON</span> — server settings are read-only. Saving, testing connections, reverting and media migration
          are disabled for security (demo logins must not change server configuration). To leave demo mode, set{' '}
          <code className="text-xs bg-red-100 px-1 rounded-none">APP_ENV=production</code> directly in the{' '}
          <code className="text-xs bg-red-100 px-1 rounded-none">.env</code> file on the server — it cannot be changed from here, otherwise a demo visitor
          could simply switch it off.
        </p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-none p-4 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-none flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Media served from</p>
            <p className="text-sm font-bold text-slate-800">Local disk</p>
          </div>
        </div>
        <div className="bg-white border border-emerald-200 rounded-none p-4 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 border border-emerald-200 rounded-none flex items-center justify-center shrink-0">
            <Cloud className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Cloud storage</p>
            <p className="text-sm font-bold text-emerald-700">Available</p>
          </div>
        </div>
        <div className="bg-white border border-emerald-200 rounded-none p-4 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 border border-emerald-200 rounded-none flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Redis</p>
            <p className="text-sm font-bold text-emerald-700">Available</p>
          </div>
        </div>
        <div className="bg-white border border-amber-200 rounded-none p-4 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-50 border border-amber-200 rounded-none flex items-center justify-center shrink-0">
            <Key className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">.env file</p>
            <p className="text-sm font-bold text-amber-700">Writable</p>
          </div>
        </div>
      </div>

      {/* Configure Section Grid */}
      {!activeSection && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Configure</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {configureItems.map(item => (
              <SectionCard
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                badge={item.badge}
                onClick={() => setActiveSection(item.key)}
              />
            ))}
          </div>

          {/* Revert Last Change */}
          <div className="flex items-center gap-3 pt-2">
            <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white px-4 py-2 rounded-none transition-all shadow-sm">
              <RefreshCw className="w-3.5 h-3.5" /> Revert last change (.env.backup)
            </button>
          </div>
        </>
      )}

      {/* Inline Detail Panel — shown when a section is clicked */}
      {activeSection && (
        <div className="border border-slate-300 rounded-none overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 capitalize flex items-center gap-2">
              {configureItems.find(i => i.key === activeSection)?.icon &&
                React.createElement(configureItems.find(i => i.key === activeSection).icon, { className: 'w-4 h-4 text-slate-500' })
              }
              {configureItems.find(i => i.key === activeSection)?.title}
            </h2>
            <button onClick={() => setActiveSection(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-none hover:bg-white transition-all">
              ← Back
            </button>
          </div>

          <div className="p-6 bg-white">
            {activeSection === 'application' && (
              <div className="space-y-0">
                <Field label="Maintenance Mode" hint="Puts the entire platform into maintenance. All school portals will become inaccessible.">
                  <div className="flex items-center gap-3">
                    <ToggleSwitch checked={maintenanceMode} onChange={setMaintenanceMode} />
                    <span className={`text-xs font-bold ${maintenanceMode ? 'text-orange-600' : 'text-slate-400'}`}>
                      {maintenanceMode ? 'ACTIVE — Platform is offline' : 'Inactive'}
                    </span>
                  </div>
                </Field>
                <Field label="Maintenance Message" hint="Displayed to users during maintenance.">
                  <textarea value={maintenanceMsg} onChange={e => setMaintenanceMsg(e.target.value)} rows={2} className={inputCls + ' resize-none'} />
                </Field>
                <Field label="Force HTTPS" hint="Redirect all HTTP requests to HTTPS.">
                  <ToggleSwitch checked={forceHttps} onChange={setForceHttps} />
                </Field>
                <Field label="CSRF Protection" hint="Protect API endpoints from cross-site request forgery.">
                  <ToggleSwitch checked={csrfProtection} onChange={setCsrfProtection} />
                </Field>
              </div>
            )}

            {activeSection === 'cache' && (
              <div className="space-y-0">
                <Field label="Response Caching" hint="Cache API responses to improve speed and reduce DB load.">
                  <ToggleSwitch checked={caching} onChange={setCaching} />
                </Field>
                <Field label="Debug Mode" hint="Outputs verbose logs. Disable in production.">
                  <div className="flex items-center gap-3">
                    <ToggleSwitch checked={debugMode} onChange={setDebugMode} />
                    {debugMode && <span className="text-xs text-red-600 font-bold">⚠ Not recommended in production</span>}
                  </div>
                </Field>
                <Field label="Log Level" hint="Set the minimum severity level to capture in logs.">
                  <select value={logLevel} onChange={e => setLogLevel(e.target.value)} className={inputCls}>
                    <option value="debug">Debug (verbose)</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error only</option>
                  </select>
                </Field>
              </div>
            )}

            {activeSection === 'redis' && (
              <div className="space-y-0">
                <Field label="Max Connection Limit" hint="Maximum concurrent database connections allowed.">
                  <input type="number" value={dbConnectionLimit} onChange={e => setDbConnectionLimit(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Query Timeout (seconds)" hint="Abort database queries that exceed this duration.">
                  <input type="number" value={dbTimeout} onChange={e => setDbTimeout(e.target.value)} className={inputCls} />
                </Field>
              </div>
            )}

            {activeSection === 'logging' && (
              <div className="space-y-0">
                <Field label="Server Alert Emails" hint="Get notified when server metrics hit critical thresholds.">
                  <ToggleSwitch checked={adminAlerts} onChange={setAdminAlerts} />
                </Field>
                {adminAlerts && (
                  <Field label="Alert Email Address" hint="Recipient for all server health alerts.">
                    <input type="email" value={alertEmail} onChange={e => setAlertEmail(e.target.value)} className={inputCls} />
                  </Field>
                )}
                <Field label="Automatic Backups" hint="Schedule regular database snapshots.">
                  <ToggleSwitch checked={autoBackup} onChange={setAutoBackup} />
                </Field>
                {autoBackup && (
                  <Field label="Backup Frequency" hint="How often automatic backups should run.">
                    <select value={backupFrequency} onChange={e => setBackupFrequency(e.target.value)} className={inputCls}>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </Field>
                )}
              </div>
            )}

            {!['application', 'cache', 'redis', 'logging'].includes(activeSection) && (
              <div className="py-10 text-center">
                <div className="w-12 h-12 border border-slate-200 rounded-none flex items-center justify-center mx-auto mb-4 bg-slate-50">
                  {React.createElement(configureItems.find(i => i.key === activeSection)?.icon || Settings, { className: 'w-5 h-5 text-slate-400' })}
                </div>
                <p className="text-sm font-bold text-slate-700 mb-1">{configureItems.find(i => i.key === activeSection)?.title}</p>
                <p className="text-xs text-slate-400 font-medium">{configureItems.find(i => i.key === activeSection)?.description}</p>
                <p className="text-xs text-slate-400 mt-4">Configuration for this section is coming soon.</p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-5 mt-4 border-t border-slate-100">
              <button onClick={handleSave} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-none text-sm font-bold transition-all shadow-sm">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

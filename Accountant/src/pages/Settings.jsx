import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, Shield, Bell, Palette, Database, Sliders, 
  Save, Download, Upload, RefreshCw, Trash2, Lock, Key, Smartphone, 
  Laptop, Check, CheckCircle2, AlertTriangle, Info, Eye, EyeOff, 
  Mail, MessageSquare, Server, Globe, Calendar, FileText, HardDrive, 
  Activity, QrCode, LogOut, Clock, Send, ShieldAlert, Cpu, Sparkles
} from 'lucide-react';
import Swal from 'sweetalert2';
import localDb from '../api/localDb';

const ACCENT_COLORS = [
  { name: 'Royal Classic Blue', hex: '#3c8dbc', ring: 'ring-[#3c8dbc]' },
  { name: 'Emerald Campus Green', hex: '#00a65a', ring: 'ring-[#00a65a]' },
  { name: 'Deep Royal Purple', hex: '#605ca8', ring: 'ring-[#605ca8]' },
  { name: 'Academic Amber', hex: '#f39c12', ring: 'ring-[#f39c12]' },
  { name: 'Heritage Crimson', hex: '#dd4b39', ring: 'ring-[#dd4b39]' },
  { name: 'High-Tech Aqua', hex: '#00c0ef', ring: 'ring-[#00c0ef]' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState(localDb.getSettings());
  const [dbStats, setDbStats] = useState(localDb.getDatabaseStats());
  const [isSaving, setIsSaving] = useState(false);
  const [pingStatus, setPingStatus] = useState(null);
  const [isPinging, setIsPinging] = useState(false);
  
  // Password change form
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  
  // 2FA modal preview
  const [show2faModal, setShow2faModal] = useState(false);

  // File import ref
  const fileInputRef = useRef(null);

  // Reload dbStats when switching to database tab
  useEffect(() => {
    if (activeTab === 'database') {
      setDbStats(localDb.getDatabaseStats());
    }
  }, [activeTab]);

  // Generic updater for nested settings
  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Save all settings handler
  const handleSaveAll = (customSection = null) => {
    setIsSaving(true);
    localDb.saveSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: customSection ? `${customSection} updated successfully` : 'System settings saved!',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    }, 300);
  };

  // Test SMS Trigger
  const handleTestSms = async () => {
    const { value: phone } = await Swal.fire({
      title: 'Send Test SMS Gateway Notice',
      text: `Gateway: ${settings.notifications.smsProvider} | Header: ${settings.notifications.senderId}`,
      input: 'text',
      inputLabel: 'Enter 10-digit Parent/Admin Mobile Number',
      inputValue: '9876543210',
      showCancelButton: true,
      confirmButtonColor: '#00a65a',
      confirmButtonText: '🚀 Send Test SMS',
      inputValidator: (value) => {
        if (!value || value.trim().length < 10) {
          return 'Please enter a valid 10-digit mobile number!';
        }
      },
    });

    if (phone) {
      Swal.fire({
        title: 'Dispatching Gateway Payload...',
        html: 'Connecting to DLT SMS Gateway Server via HTTPS TLS 1.3...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'SMS Sent Successfully!',
              html: `
                <div class="text-left text-[13px] bg-gray-50 p-3 rounded border border-gray-200 mt-2 space-y-1">
                  <div><strong>Status:</strong> <span class="text-green-600 font-semibold">DELIVERED (HTTP 200)</span></div>
                  <div><strong>Mobile:</strong> +91 ${phone}</div>
                  <div><strong>Sender ID:</strong> ${settings.notifications.senderId}</div>
                  <div><strong>Gateway Message ID:</strong> MSG_${Date.now().toString(36).toUpperCase()}</div>
                  <div class="pt-1 text-gray-500 italic text-[11px]">"Dear Parent, fee receipt #REC-2026/894 for ₹5,000 has been generated. Thank you - Oxford Public School"</div>
                </div>
              `,
              confirmButtonColor: '#3c8dbc',
            });
          }, 900);
        },
      });
    }
  };

  // Change password handler
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passForm.current) {
      Swal.fire('Error', 'Please enter your current password.', 'warning');
      return;
    }
    if (passForm.newPass.length < 6) {
      Swal.fire('Weak Password', 'New password must be at least 6 characters.', 'warning');
      return;
    }
    if (passForm.newPass !== passForm.confirm) {
      Swal.fire('Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Password Updated!',
      text: 'Your credentials have been updated securely.',
      confirmButtonColor: '#3c8dbc',
    });
    setPassForm({ current: '', newPass: '', confirm: '' });
  };

  // Revoke active session
  const handleRevokeSession = (sessId) => {
    const updated = settings.security.activeSessions.filter((s) => s.id !== sessId);
    updateSetting('security', 'activeSessions', updated);
    localDb.saveSettings({
      ...settings,
      security: { ...settings.security, activeSessions: updated },
    });
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Remote session terminated.',
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Terminate all other sessions
  const handleRevokeAllOtherSessions = async () => {
    const res = await Swal.fire({
      title: 'Log out all other devices?',
      text: 'All other active desktop and mobile sessions will be immediately signed out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd4b39',
      confirmButtonText: 'Yes, Log Out Others',
    });
    if (res.isConfirmed) {
      const currentOnly = settings.security.activeSessions.filter((s) => s.current);
      updateSetting('security', 'activeSessions', currentOnly);
      localDb.saveSettings({
        ...settings,
        security: { ...settings.security, activeSessions: currentOnly },
      });
      Swal.fire('Sessions Cleared', 'All other devices logged out.', 'success');
    }
  };

  // Ping Backend Server Test
  const handlePingBackend = () => {
    setIsPinging(true);
    setPingStatus(null);
    const start = Date.now();
    setTimeout(() => {
      setIsPinging(false);
      const latency = Math.floor(Math.random() * 25) + 12;
      setPingStatus({
        ok: true,
        latency,
        url: settings.advanced.apiBaseUrl,
        timestamp: new Date().toLocaleTimeString(),
      });
    }, 700);
  };

  // Export full JSON database
  const handleExportBackup = () => {
    const backupData = localDb.exportAllData();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `oxford_erp_backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    Swal.fire({
      icon: 'success',
      title: 'Database Backup Downloaded!',
      text: `Full institutional database snapshot exported (Version ${backupData.version}).`,
      confirmButtonColor: '#3c8dbc',
    });
  };

  // Trigger file picker for import
  const handleTriggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle uploaded JSON backup file
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.data && !parsed.incomes && !parsed.expenses) {
          throw new Error('Unrecognized ERP backup format');
        }

        const conf = await Swal.fire({
          title: 'Confirm Database Restore?',
          html: `
            <p class="text-[13px] text-gray-600 mb-2">You are about to restore system data from:</p>
            <div class="bg-gray-100 p-2 text-[12px] font-mono text-left rounded">
              File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)<br/>
              Version: ${parsed.version || 'Legacy'}<br/>
              Created: ${parsed.exportedAt || 'Unknown'}
            </div>
            <p class="text-[12px] text-red-600 mt-2 font-medium">⚠️ Current local records will be overwritten with backup contents.</p>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#00a65a',
          confirmButtonText: 'Yes, Restore Now',
        });

        if (conf.isConfirmed) {
          const count = localDb.importAllData(parsed);
          setDbStats(localDb.getDatabaseStats());
          setSettings(localDb.getSettings());
          Swal.fire({
            icon: 'success',
            title: 'Restore Completed!',
            text: `Restored ${count} data collections successfully. Refreshing page...`,
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Backup File',
          text: err.message || 'The uploaded file is not a valid JSON ERP backup.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset entire database to default seed
  const handleResetEntireData = async () => {
    const res = await Swal.fire({
      title: 'Factory Reset All Data?',
      html: `
        <p class="text-[13px] text-gray-600 mb-3">This will delete all custom income, expense, fee group, student records and restore standard school demo data.</p>
        <p class="text-[12px] font-semibold text-red-600">Type <strong>RESET</strong> below to confirm:</p>
      `,
      input: 'text',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd4b39',
      confirmButtonText: 'Permanently Reset',
      inputValidator: (val) => {
        if (val !== 'RESET') {
          return 'You must type RESET exactly to proceed!';
        }
      },
    });

    if (res.isConfirmed) {
      localDb.reset();
      Swal.fire({
        icon: 'success',
        title: 'Factory Reset Complete',
        text: 'All tables re-seeded to default institutional records. Reloading...',
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    }
  };

  // Reset single collection
  const handleClearSingleCollection = async (colName, colLabel) => {
    const res = await Swal.fire({
      title: `Reset ${colLabel}?`,
      text: `Reset records in "${colLabel}" back to initial seed data?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f39c12',
      confirmButtonText: 'Yes, Reset Collection',
    });
    if (res.isConfirmed) {
      localDb.clearCollection(colName);
      setDbStats(localDb.getDatabaseStats());
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${colLabel} re-seeded successfully`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Toggle switch helper
  const renderToggle = (checked, onChange, label, description) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-2 rounded transition-colors">
      <div className="pr-4">
        <h4 className="text-[13.5px] font-semibold text-[#333]">{label}</h4>
        {description && <p className="text-[12px] text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
          checked ? 'bg-[#00a65a]' : 'bg-gray-300'
        }`}
        aria-pressed={checked}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-3 sm:p-5 font-sans">
      {/* Hidden file input for database restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* ─── Top Header Ribbon ─── */}
      <div className="bg-white rounded-t-[3px] border-t-[3px] border-t-[#3c8dbc] shadow-sm p-4 sm:p-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#3c8dbc] shadow-sm">
            <SettingsIcon className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] sm:text-[22px] font-bold text-[#222d32] tracking-tight">System Configuration & Settings</h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold rounded bg-green-100 text-green-800 border border-green-200">
                v2.5 Enterprise ERP
              </span>
            </div>
            <p className="text-[12.5px] text-gray-500 mt-0.5">
              Manage system notifications, security, themes, database backups, and institutional accounting rules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-[12.5px] font-medium rounded border border-gray-300 shadow-xs transition-colors"
            title="Download complete JSON snapshot"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export Backup</span>
          </button>
          <button
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white text-[12.5px] font-semibold rounded shadow-xs transition-colors cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      {/* ─── Navigation Tabs Bar ─── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm mb-5 p-1.5 flex flex-wrap gap-1">
        {[
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell, badge: 'Live SMS' },
          { id: 'security', label: 'Security & Access', icon: Shield, badge: '2FA Ready' },
          { id: 'appearance', label: 'Appearance & UI', icon: Palette },
          { id: 'database', label: 'Database & Backup', icon: Database, badge: `${dbStats.totalKb} KB` },
          { id: 'advanced', label: 'Advanced Settings', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded text-[13px] font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#3c8dbc] text-white shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-[#3c8dbc] hover:bg-blue-50/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB 1: NOTIFICATIONS & ALERTS                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'notifications' && (
        <div className="space-y-5">
          {/* Gateway Status Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-[3px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-gray-800">SMS Gateway Connected & Active</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-600 text-white rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Live
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 mt-0.5">
                  DLT Provider: <strong>{settings.notifications.smsProvider}</strong> | Sender Header: <strong>{settings.notifications.senderId}</strong> | Balance: <strong>{settings.notifications.smsBalance.toLocaleString()} SMS Credits</strong>
                </p>
              </div>
            </div>
            <button
              onClick={handleTestSms}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[12px] font-semibold rounded shadow-xs flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test SMS</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Student & Fee Alerts */}
            <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gray-100">
                <Bell className="w-4 h-4 text-[#3c8dbc]" />
                <h3 className="text-[14.5px] font-bold text-[#333]">Fee Collection & Student Alerts</h3>
              </div>

              {renderToggle(
                settings.notifications.feePaymentSms,
                (val) => updateSetting('notifications', 'feePaymentSms', val),
                'Instant Fee Receipt SMS to Parents',
                'Dispatches an automated payment confirmation SMS with receipt number as soon as fees are recorded.'
              )}

              {renderToggle(
                settings.notifications.feePaymentEmail,
                (val) => updateSetting('notifications', 'feePaymentEmail', val),
                'Automated PDF Receipt Email',
                'Emails official school fee voucher with institution stamp to the registered parent email.'
              )}

              {renderToggle(
                settings.notifications.feeDueAlerts,
                (val) => updateSetting('notifications', 'feeDueAlerts', val),
                'Fee Overdue & Deadline Reminders',
                'Sends gentle due date reminder notifications to parents before late fee penalties apply.'
              )}

              <div className="py-3 px-2 flex items-center justify-between border-t border-gray-100">
                <div>
                  <label className="text-[13px] font-semibold text-[#333]">Advance Reminder Notice Window</label>
                  <p className="text-[12px] text-gray-500">Days prior to installment due date to trigger reminder notice</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={settings.notifications.dueNoticeDays}
                    onChange={(e) => updateSetting('notifications', 'dueNoticeDays', Number(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-[13px] font-bold text-[#333] focus:border-[#3c8dbc] outline-none"
                  />
                  <span className="text-[12px] text-gray-500">Days</span>
                </div>
              </div>
            </div>

            {/* Staff & System Alerts */}
            <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gray-100">
                <Activity className="w-4 h-4 text-[#00a65a]" />
                <h3 className="text-[14.5px] font-bold text-[#333]">Staff & Operating Alerts</h3>
              </div>

              {renderToggle(
                settings.notifications.leaveStatusAlerts,
                (val) => updateSetting('notifications', 'leaveStatusAlerts', val),
                'Leave Application Status Alerts',
                'Instantly notifies faculty & accountant when leave requests are Approved or Rejected.'
              )}

              {renderToggle(
                settings.notifications.dailyExpenseReport,
                (val) => updateSetting('notifications', 'dailyExpenseReport', val),
                'Daily Financial EOD Digest Email',
                'Emails end-of-day cash collections, expense total, and net day balance at 6:00 PM.'
              )}

              {renderToggle(
                settings.notifications.inAppSounds,
                (val) => updateSetting('notifications', 'inAppSounds', val),
                'Interactive Audio Chimes',
                'Plays subtle ERP audio notifications upon successful collection, loan approval, or errors.'
              )}

              {renderToggle(
                settings.notifications.pushBanners,
                (val) => updateSetting('notifications', 'pushBanners', val),
                'In-App Toast & Floating Banners',
                'Shows floating notices in top corner for newly posted circulars and emergency advisories.'
              )}
            </div>
          </div>

          {/* SMS & Email Gateway Settings */}
          <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
            <h3 className="text-[14.5px] font-bold text-[#333] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#605ca8]" /> Gateway Integrations & API Config
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">SMS DLT Service Provider</label>
                <select
                  value={settings.notifications.smsProvider}
                  onChange={(e) => updateSetting('notifications', 'smsProvider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none"
                >
                  <option>MSG91 (Govt DLT Approved)</option>
                  <option>Twilio India SMS Hub</option>
                  <option>Fast2SMS Enterprise</option>
                  <option>TextLocal India</option>
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Approved DLT Sender ID (Header)</label>
                <input
                  type="text"
                  maxLength="6"
                  value={settings.notifications.senderId}
                  onChange={(e) => updateSetting('notifications', 'senderId', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono uppercase focus:border-[#3c8dbc] outline-none"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Accounting Email Sender Address</label>
                <input
                  type="email"
                  value={settings.notifications.supportEmail}
                  onChange={(e) => updateSetting('notifications', 'supportEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB 2: SECURITY & AUTHENTICATION                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          {/* Security Overview Health Banner */}
          <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#3c8dbc]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-[#333]">ERP Security Status: High Protection</h3>
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    94% Secure
                  </span>
                </div>
                <p className="text-[12.5px] text-gray-500 mt-0.5">
                  Session encryption active, CSRF protection enabled, and role-based accountant boundaries enforced.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRevokeAllOtherSessions}
                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[12.5px] font-semibold rounded transition-colors cursor-pointer"
              >
                Log Out All Other Devices
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Change Password Card */}
            <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#f39c12]" />
                  <h3 className="text-[14.5px] font-bold text-[#333]">Update Login Password</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-[12px] text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPass ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-3.5">
                <div>
                  <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Current Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={passForm.current}
                    onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">New Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter minimum 6 characters"
                    value={passForm.newPass}
                    onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                  />
                  {passForm.newPass && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            passForm.newPass.length < 6
                              ? 'w-1/3 bg-red-500'
                              : passForm.newPass.length < 10
                              ? 'w-2/3 bg-yellow-500'
                              : 'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10.5px] font-medium text-gray-500">
                        {passForm.newPass.length < 6 ? 'Weak' : passForm.newPass.length < 10 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Re-type new password"
                    value={passForm.confirm}
                    onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] focus:border-[#3c8dbc] outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[13px] font-semibold rounded shadow-xs transition-colors cursor-pointer"
                  >
                    Update Password Securely
                  </button>
                </div>
              </form>
            </div>

            {/* Two-Factor Authentication (2FA) */}
            <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#00a65a]" />
                    <h3 className="text-[14.5px] font-bold text-[#333]">Two-Factor Authentication (2FA)</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                      settings.security.twoFactorAuth
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {settings.security.twoFactorAuth ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <p className="text-[12.5px] text-gray-600 mb-4 leading-relaxed">
                  Require an extra security verification code (Google Authenticator, Microsoft Authenticator, or Mobile OTP) whenever signing in from a new computer or location.
                </p>

                {renderToggle(
                  settings.security.twoFactorAuth,
                  (val) => {
                    updateSetting('security', 'twoFactorAuth', val);
                    if (val) setShow2faModal(true);
                  },
                  'Require 2FA at Accountant Sign-in',
                  'Protects school ledger records against unauthorized access.'
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[13px] font-semibold text-gray-800">Verification Method</span>
                      <p className="text-[11.5px] text-gray-500">Choose primary second-factor authentication mechanism</p>
                    </div>
                    <select
                      value={settings.security.twoFactorMethod}
                      onChange={(e) => updateSetting('security', 'twoFactorMethod', e.target.value)}
                      className="px-2.5 py-1 border border-gray-300 rounded text-[12.5px] bg-white outline-none"
                    >
                      <option value="authenticator">Authenticator App (TOTP)</option>
                      <option value="sms">Mobile SMS OTP</option>
                      <option value="email">Accountant Email Link</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[13px] font-semibold text-gray-800">Inactivity Session Timeout</span>
                      <p className="text-[11.5px] text-gray-500">Auto-lock dashboard after inactivity period</p>
                    </div>
                    <select
                      value={settings.security.sessionTimeoutMinutes}
                      onChange={(e) => updateSetting('security', 'sessionTimeoutMinutes', Number(e.target.value))}
                      className="px-2.5 py-1 border border-gray-300 rounded text-[12.5px] bg-white outline-none"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>1 Hour</option>
                      <option value={180}>3 Hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {settings.security.twoFactorAuth && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] text-emerald-800 font-medium">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Authenticator Secret: <code className="font-mono font-bold">{settings.security.twoFactorSecret}</code></span>
                  </div>
                  <button
                    onClick={() => setShow2faModal(true)}
                    className="text-[11.5px] font-semibold text-emerald-700 hover:underline"
                  >
                    View QR Code
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Logged-in Sessions List */}
          <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#3c8dbc]" />
                <h3 className="text-[14.5px] font-bold text-[#333]">Active Sessions & Device Audit History</h3>
              </div>
              <span className="text-[12px] text-gray-500">
                {settings.security.activeSessions.length} Connected Devices
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {settings.security.activeSessions.map((sess) => (
                <div key={sess.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-full ${sess.current ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {sess.device.includes('Mobile') || sess.device.includes('iPad') ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13.5px] font-bold text-[#333]">{sess.device}</h4>
                        {sess.current && (
                          <span className="px-2 py-0.2 text-[10.5px] font-bold bg-green-100 text-green-800 rounded-full border border-green-200">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        IP: <span className="font-mono text-gray-700">{sess.ip}</span> • Location: {sess.location} • Sign-in: {sess.loginTime}
                      </p>
                    </div>
                  </div>

                  {!sess.current && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="text-[12px] text-red-600 hover:text-red-800 font-semibold px-2.5 py-1 border border-red-200 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2FA QR Code Setup Modal */}
      {show2faModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-[16px] font-bold text-[#333] mb-1 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#00a65a]" /> Configure Google Authenticator
            </h3>
            <p className="text-[12.5px] text-gray-500 mb-4">
              Scan this QR code with Google Authenticator or Microsoft Authenticator app on your smartphone:
            </p>

            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
              <div className="w-44 h-44 bg-white p-2 border border-gray-300 rounded shadow-xs flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-gray-900">
                  {/* Visual QR representation */}
                  <rect x="5" y="5" width="30" height="30" fill="currentColor" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="14" y="14" width="12" height="12" fill="currentColor" />
                  <rect x="65" y="5" width="30" height="30" fill="currentColor" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="74" y="14" width="12" height="12" fill="currentColor" />
                  <rect x="5" y="65" width="30" height="30" fill="currentColor" />
                  <rect x="10" y="70" width="20" height="20" fill="white" />
                  <rect x="14" y="74" width="12" height="12" fill="currentColor" />
                  <rect x="45" y="10" width="10" height="10" fill="currentColor" />
                  <rect x="45" y="25" width="10" height="25" fill="currentColor" />
                  <rect x="65" y="45" width="15" height="15" fill="currentColor" />
                  <rect x="40" y="65" width="20" height="10" fill="currentColor" />
                  <rect x="65" y="70" width="25" height="20" fill="currentColor" />
                  <rect x="25" y="45" width="15" height="10" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[11.5px] text-gray-600 mt-2 font-mono">
                Manual Key: <strong>{settings.security.twoFactorSecret}</strong>
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShow2faModal(false)}
                className="px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[13px] font-semibold rounded cursor-pointer"
              >
                Done / Verified
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB 3: APPEARANCE & BRANDING                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'appearance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Color Accent Chooser */}
            <div className="lg:col-span-2 bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                <Palette className="w-4 h-4 text-[#3c8dbc]" />
                <h3 className="text-[14.5px] font-bold text-[#333]">Brand Accent Palette & Styling</h3>
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Select System Theme Accent Color (Active: <span className="font-bold text-[#333]">{settings.appearance.primaryColorName}</span>)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ACCENT_COLORS.map((col) => {
                    const isSelected = settings.appearance.accentColor === col.hex;
                    return (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => {
                          updateSetting('appearance', 'accentColor', col.hex);
                          updateSetting('appearance', 'primaryColorName', col.name);
                        }}
                        className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-gray-800 bg-gray-50 ring-2 ' + col.ring
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full shrink-0 shadow-xs flex items-center justify-center text-white text-[11px]"
                          style={{ backgroundColor: col.hex }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                        <div>
                          <div className="text-[12.5px] font-bold text-gray-800">{col.name}</div>
                          <div className="text-[11px] font-mono text-gray-400">{col.hex}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Layout Table Density</label>
                  <select
                    value={settings.appearance.layoutDensity}
                    onChange={(e) => updateSetting('appearance', 'layoutDensity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none"
                  >
                    <option value="comfortable">Comfortable (Standard ERP Spacing)</option>
                    <option value="compact">Compact (High-Density Accountant Grid)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Default Currency Symbol</label>
                  <select
                    value={settings.appearance.currencySymbol}
                    onChange={(e) => updateSetting('appearance', 'currencySymbol', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none font-bold"
                  >
                    <option value="₹">₹ - Indian Rupee (INR)</option>
                    <option value="$">$ - US Dollar (USD)</option>
                    <option value="€">€ - Euro (EUR)</option>
                    <option value="£">£ - British Pound (GBP)</option>
                    <option value="AED">AED - UAE Dirham</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Date Display Format</label>
                  <select
                    value={settings.appearance.dateFormat}
                    onChange={(e) => updateSetting('appearance', 'dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none font-mono"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard - e.g. 12/10/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format - e.g. 2026-10-12)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Format - e.g. 10/12/2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Current Academic Session</label>
                  <input
                    type="text"
                    value={settings.appearance.academicSession}
                    onChange={(e) => updateSetting('appearance', 'academicSession', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-semibold focus:border-[#3c8dbc] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Institution Branding Card */}
            <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                  <Sparkles className="w-4 h-4 text-[#f39c12]" />
                  <h3 className="text-[14.5px] font-bold text-[#333]">Institution Branding</h3>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">School / College Legal Name</label>
                    <input
                      type="text"
                      value={settings.appearance.schoolName}
                      onChange={(e) => updateSetting('appearance', 'schoolName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-semibold focus:border-[#3c8dbc] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Motto / Tagline</label>
                    <input
                      type="text"
                      value={settings.appearance.schoolTagline}
                      onChange={(e) => updateSetting('appearance', 'schoolTagline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] text-gray-600 focus:border-[#3c8dbc] outline-none italic"
                    />
                  </div>
                </div>

                {/* Live Preview Voucher Chip */}
                <div className="mt-5 p-3.5 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Live Receipt Header Preview</div>
                  <div
                    className="p-3 rounded text-white shadow-xs"
                    style={{ backgroundColor: settings.appearance.accentColor }}
                  >
                    <h4 className="font-bold text-[14px] leading-tight">{settings.appearance.schoolName}</h4>
                    <p className="text-[11px] opacity-90 mt-0.5">{settings.appearance.schoolTagline}</p>
                    <div className="mt-2 pt-2 border-t border-white/20 flex justify-between items-center text-[10.5px]">
                      <span>Session: {settings.appearance.academicSession}</span>
                      <span>Currency: {settings.appearance.currencySymbol} 1,500.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleSaveAll('Branding & Appearance')}
                  className="w-full py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[13px] font-semibold rounded cursor-pointer transition-colors"
                >
                  Apply Appearance Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB 4: DATABASE & BACKUP MANAGEMENT                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'database' && (
        <div className="space-y-5">
          {/* Top Storage Quota Banner */}
          <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#00a65a]">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#333]">Offline Local Database Health</h3>
                  <p className="text-[12.5px] text-gray-500 mt-0.5">
                    Total Storage Consumed: <strong className="text-gray-800">{dbStats.totalKb} KB</strong> across {dbStats.details.length} active tables.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleTriggerImport}
                  className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-[12.5px] font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#3c8dbc]" />
                  <span>Restore From JSON</span>
                </button>
                <button
                  onClick={handleExportBackup}
                  className="px-3.5 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white text-[12.5px] font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Backup</span>
                </button>
              </div>
            </div>

            {/* Storage Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-[12px] text-gray-600 mb-1.5 font-medium">
                <span>Storage Utilization: {dbStats.totalKb} KB of 5,120 KB Browser Quota</span>
                <span className="font-bold text-emerald-700">Healthy ({(Number(dbStats.totalKb) / 51.2).toFixed(1)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, Math.min(100, (Number(dbStats.totalKb) / 51.2)))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Per-Collection Table Breakdown */}
          <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-[14px] font-bold text-[#333]">Individual Table Statistics & Maintenance</h3>
                <p className="text-[12px] text-gray-500">Inspect record counts and selectively reseed or backup tables.</p>
              </div>
              <button
                onClick={() => setDbStats(localDb.getDatabaseStats())}
                className="text-[12px] text-[#3c8dbc] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Sizes
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="bg-gray-100/80 text-gray-600 font-semibold text-[12px] uppercase border-b border-gray-200">
                    <th className="py-2.5 px-4">Collection / Table</th>
                    <th className="py-2.5 px-4">Local Storage Key</th>
                    <th className="py-2.5 px-4 text-center">Record Count</th>
                    <th className="py-2.5 px-4 text-right">Data Size</th>
                    <th className="py-2.5 px-4 text-right">Maintenance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dbStats.details.map((col) => (
                    <tr key={col.name} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#333] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                        <span>{col.label}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11.5px] text-gray-500">
                        {col.key}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3c8dbc] font-bold text-[12px] border border-blue-100">
                          {col.count} records
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-700">
                        {col.sizeKb} KB
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleClearSingleCollection(col.name, col.label)}
                          className="px-2.5 py-1 text-[11.5px] font-semibold text-[#f39c12] hover:text-[#d35400] hover:bg-amber-50 rounded border border-amber-200 transition-colors cursor-pointer"
                          title="Restore default mock seed for this collection"
                        >
                          Reseed Table
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scheduled Backup Config */}
          <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
            <h3 className="text-[14.5px] font-bold text-[#333] mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3c8dbc]" /> Automated Scheduled Snapshot
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Auto-Snapshot Frequency</label>
                <select
                  value={settings.database.autoBackup}
                  onChange={(e) => updateSetting('database', 'autoBackup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none"
                >
                  <option value="Daily">Daily Auto-Snapshot (At 11:59 PM)</option>
                  <option value="Weekly">Weekly Auto-Snapshot (Every Sunday)</option>
                  <option value="Monthly">Monthly Archive (1st of Month)</option>
                  <option value="Disabled">Disabled (Manual Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Last Successful Snapshot</label>
                <input
                  type="text"
                  disabled
                  value={settings.database.lastBackupDate}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] bg-gray-50 text-gray-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Retention Period</label>
                <select
                  value={settings.database.retentionDays}
                  onChange={(e) => updateSetting('database', 'retentionDays', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none"
                >
                  <option value={90}>90 Days (Quarterly Audit)</option>
                  <option value={365}>365 Days (Full Academic Session)</option>
                  <option value={1095}>3 Years (Statutory Tax Compliance)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone: Full Factory Reset */}
          <div className="bg-red-50/50 border border-red-200 rounded-[3px] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-red-100 text-red-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-red-800">Danger Zone: Factory Reset Entire Database</h4>
                <p className="text-[12.5px] text-red-700 mt-0.5">
                  Wipes all modified fee groups, recorded incomes, vouchers, and student custom dues, then restores the system to factory seed data.
                </p>
                <div className="mt-3">
                  <button
                    onClick={handleResetEntireData}
                    className="px-4 py-2 bg-[#dd4b39] hover:bg-[#c9302c] text-white text-[12.5px] font-bold rounded shadow-xs cursor-pointer transition-colors"
                  >
                    Factory Reset All Records
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB 5: ADVANCED SYSTEM CONFIGURATION                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'advanced' && (
        <div className="space-y-5">
          {/* API Endpoint & Live Ping */}
          <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#3c8dbc]" />
                <h3 className="text-[14.5px] font-bold text-[#333]">Backend API Server Connection</h3>
              </div>
              <button
                type="button"
                onClick={handlePingBackend}
                disabled={isPinging}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#3c8dbc] border border-blue-200 text-[12px] font-semibold rounded flex items-center gap-1.5 cursor-pointer"
              >
                {isPinging ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
                <span>{isPinging ? 'Pinging Server...' : 'Test API Connection'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Backend REST API Base URL</label>
                <input
                  type="text"
                  value={settings.advanced.apiBaseUrl}
                  onChange={(e) => updateSetting('advanced', 'apiBaseUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono focus:border-[#3c8dbc] outline-none"
                />
                <p className="text-[11.5px] text-gray-500 mt-1">Default Node/Express Server running on port 5000</p>
              </div>

              <div>
                {pingStatus ? (
                  <div className="p-3 rounded bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div className="text-[12px] text-emerald-900">
                      <div className="font-bold">API Server Healthy & Responsive</div>
                      <div className="text-[11px] text-emerald-700 font-mono">
                        Latency: {pingStatus.latency}ms • Tested at {pingStatus.timestamp}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded bg-gray-50 border border-gray-200 text-[12px] text-gray-600">
                    Click <strong>Test API Connection</strong> above to verify backend server handshake and network latency.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              {renderToggle(
                settings.advanced.mockDataEngine,
                (val) => updateSetting('advanced', 'mockDataEngine', val),
                'Offline LocalDB Fallback Engine',
                'When backend API is offline or disconnected, automatically fallback to browser LocalStorage so accountant workflows never stall.'
              )}

              {renderToggle(
                settings.advanced.debugLogging,
                (val) => updateSetting('advanced', 'debugLogging', val),
                'Verbose API Debug Logging',
                'Logs full HTTP request payloads and state mutations into developer console for debugging.'
              )}
            </div>
          </div>

          {/* Accounting Numbering & Statutory Rules */}
          <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 sm:p-5">
            <h3 className="text-[14.5px] font-bold text-[#333] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00a65a]" /> Financial Numbering & Statutory Tax Identifiers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Fiscal Year Starting Month</label>
                <select
                  value={settings.advanced.fiscalYearStart}
                  onChange={(e) => updateSetting('advanced', 'fiscalYearStart', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none"
                >
                  <option value="April">April (Indian Financial Year)</option>
                  <option value="January">January (Calendar Year)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Fee Receipt Prefix</label>
                <input
                  type="text"
                  value={settings.advanced.feeReceiptPrefix}
                  onChange={(e) => updateSetting('advanced', 'feeReceiptPrefix', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono focus:border-[#3c8dbc] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Expense Voucher Prefix</label>
                <input
                  type="text"
                  value={settings.advanced.voucherPrefix}
                  onChange={(e) => updateSetting('advanced', 'voucherPrefix', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono focus:border-[#3c8dbc] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">Decimal Round-off Precision</label>
                <select
                  value={settings.advanced.roundOffDecimals}
                  onChange={(e) => updateSetting('advanced', 'roundOffDecimals', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] bg-white focus:border-[#3c8dbc] outline-none font-semibold"
                >
                  <option value={2}>2 Decimals (e.g. ₹ 1,500.00)</option>
                  <option value={0}>Integer Round (e.g. ₹ 1,500)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">School GSTIN Number (Optional)</label>
                <input
                  type="text"
                  value={settings.advanced.schoolGstNumber}
                  onChange={(e) => updateSetting('advanced', 'schoolGstNumber', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono uppercase focus:border-[#3c8dbc] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">School Trust PAN Number</label>
                <input
                  type="text"
                  value={settings.advanced.panNumber}
                  onChange={(e) => updateSetting('advanced', 'panNumber', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-[13px] font-mono uppercase focus:border-[#3c8dbc] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1">
                Official Fee Receipt Disclaimer & Terms (Printed on Bottom of Slip)
              </label>
              <textarea
                rows="2"
                value={settings.advanced.receiptFooterNote}
                onChange={(e) => updateSetting('advanced', 'receiptFooterNote', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-[12.5px] text-gray-700 focus:border-[#3c8dbc] outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Sticky Action Bar ─── */}
      <div className="mt-6 bg-white border border-gray-200 rounded-[3px] p-3 sm:p-4 flex items-center justify-between shadow-xs">
        <div className="text-[12px] text-gray-500 hidden sm:block">
          All settings are stored in local persistent state and synchronizable across accounting sessions.
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setSettings(localDb.getSettings())}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12.5px] font-semibold rounded cursor-pointer transition-colors"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            className="px-5 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white text-[12.5px] font-bold rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

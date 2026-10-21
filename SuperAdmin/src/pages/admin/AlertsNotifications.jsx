import React, { useState } from 'react';
import { Bell, Plus, Edit, Trash2, Send, X, Save, AlertTriangle } from 'lucide-react';

const initAlerts = [
  { id: 1, title: 'Server CPU High', message: 'CPU usage exceeded 80%', type: 'System', severity: 'High', sent: 'Sep 01, 10:15 AM', recipients: 'Super Admin' },
  { id: 2, title: 'New School Registered', message: 'Ali Public School has registered', type: 'Platform', severity: 'Info', sent: 'Aug 31, 09:30 AM', recipients: 'All Admins' },
  { id: 3, title: 'Payment Failed', message: 'Payment failed for Green Valley School', type: 'Billing', severity: 'Medium', sent: 'Aug 30, 02:45 PM', recipients: 'Finance Team' },
  { id: 4, title: 'Backup Failed', message: 'Scheduled backup did not complete', type: 'System', severity: 'High', sent: 'Aug 29, 02:05 AM', recipients: 'Super Admin' },
  { id: 5, title: 'Subscription Expiring', message: '12 schools expire in 7 days', type: 'Billing', severity: 'Medium', sent: 'Aug 28, 08:00 AM', recipients: 'Sales Team' },
];

const initTemplates = [
  { id: 1, name: 'New School Welcome', trigger: 'On school registration', channel: 'Email + SMS', active: true },
  { id: 2, name: 'Payment Confirmation', trigger: 'On successful payment', channel: 'Email', active: true },
  { id: 3, name: 'Subscription Expiry (7 days)', trigger: '7 days before expiry', channel: 'Email + SMS', active: true },
  { id: 4, name: 'Subscription Expiry (1 day)', trigger: '1 day before expiry', channel: 'SMS', active: true },
  { id: 5, name: 'Server Alert', trigger: 'CPU/RAM > 80%', channel: 'Email', active: false },
];

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-none transition-colors relative flex-shrink-0 ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}>
    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-none shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

const severityColor = (s) => {
  if (s === 'High') return 'bg-red-50 text-red-600';
  if (s === 'Medium') return 'bg-orange-50 text-orange-600';
  return 'bg-blue-50 text-blue-600';
};

const emptyAlert = { title: '', message: '', type: 'System', severity: 'High', recipients: 'Super Admin' };
const emptyTemplate = { name: '', trigger: '', channel: 'Email' };

export default function AlertsNotifications() {
  const [tab, setTab] = useState('log');
  const [alerts, setAlerts] = useState(initAlerts);
  const [templates, setTemplates] = useState(initTemplates);
  const [tmplState, setTmplState] = useState(initTemplates.reduce((a, t) => ({ ...a, [t.id]: t.active }), {}));

  const [showSendAlert, setShowSendAlert] = useState(false);
  const [alertForm, setAlertForm] = useState(emptyAlert);

  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [deleteTemplate, setDeleteTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState(emptyTemplate);

  const handleSendAlert = () => {
    const newAlert = { ...alertForm, id: Date.now(), sent: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) };
    setAlerts(prev => [newAlert, ...prev]);
    setShowSendAlert(false);
    setAlertForm(emptyAlert);
  };

  const handleAddTemplate = () => {
    setTemplates(prev => [...prev, { ...templateForm, id: Date.now(), active: true }]);
    setTmplState(s => ({ ...s, [Date.now()]: true }));
    setShowAddTemplate(false);
    setTemplateForm(emptyTemplate);
  };

  const handleSaveTemplate = () => {
    setTemplates(prev => prev.map(t => t.id === editTemplate.id ? editTemplate : t));
    setEditTemplate(null);
  };

  const handleDeleteTemplate = () => {
    setTemplates(prev => prev.filter(t => t.id !== deleteTemplate.id));
    setDeleteTemplate(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alerts & Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform alerts and notification templates</p>
        </div>
        <button onClick={() => setShowSendAlert(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold">
          <Send className="w-4 h-4" /> Send Alert
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ key: 'log', label: 'Alert Log' }, { key: 'templates', label: 'Notification Templates' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-none text-sm font-semibold transition-colors ${tab === t.key ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="bg-white rounded-none border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Title', 'Message', 'Type', 'Severity', 'Sent At', 'Recipients'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{a.title}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{a.message}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-none font-semibold">{a.type}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${severityColor(a.severity)}`}>{a.severity}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.sent}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{a.recipients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'templates' && (
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700">Notification Templates</h3>
            <button onClick={() => { setTemplateForm(emptyTemplate); setShowAddTemplate(true); }} className="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-none font-semibold">
              <Plus className="w-3.5 h-3.5" /> New Template
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {templates.map(t => (
              <div key={t.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Trigger: {t.trigger}</p>
                  <p className="text-xs text-gray-400">Channel: {t.channel}</p>
                </div>
                <Toggle checked={tmplState[t.id] ?? t.active} onChange={v => setTmplState(s => ({ ...s, [t.id]: v }))} />
                <div className="flex gap-2">
                  <button onClick={() => setEditTemplate({ ...t })} className="p-1.5 hover:bg-green-50 rounded-none text-green-500"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteTemplate(t)} className="p-1.5 hover:bg-red-50 rounded-none text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEND ALERT MODAL */}
      {showSendAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Send Alert</h2>
              <button onClick={() => setShowSendAlert(false)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[{ label: 'Title', key: 'title', placeholder: 'Alert title' }, { label: 'Message', key: 'message', placeholder: 'Alert message' }, { label: 'Recipients', key: 'recipients', placeholder: 'e.g. Super Admin, All Admins' }].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input value={alertForm[f.key]} onChange={e => setAlertForm({ ...alertForm, [f.key]: e.target.value })} placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Type', key: 'type', options: ['System', 'Platform', 'Billing', 'Security'] }, { label: 'Severity', key: 'severity', options: ['High', 'Medium', 'Info'] }].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                    <select value={alertForm[f.key]} onChange={e => setAlertForm({ ...alertForm, [f.key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={handleSendAlert} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Send className="w-4 h-4" /> Send Alert
              </button>
              <button onClick={() => setShowSendAlert(false)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TEMPLATE MODAL */}
      {showAddTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">New Template</h2>
              <button onClick={() => setShowAddTemplate(false)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[{ label: 'Template Name', key: 'name', placeholder: 'e.g. Welcome Email' }, { label: 'Trigger', key: 'trigger', placeholder: 'e.g. On registration' }].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input value={templateForm[f.key]} onChange={e => setTemplateForm({ ...templateForm, [f.key]: e.target.value })} placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Channel</label>
                <select value={templateForm.channel} onChange={e => setTemplateForm({ ...templateForm, channel: e.target.value })}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {['Email', 'SMS', 'Email + SMS', 'WhatsApp', 'Push Notification'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={handleAddTemplate} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add Template
              </button>
              <button onClick={() => setShowAddTemplate(false)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Edit Template</h2>
              <button onClick={() => setEditTemplate(null)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[{ label: 'Template Name', key: 'name' }, { label: 'Trigger', key: 'trigger' }].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input value={editTemplate[f.key]} onChange={e => setEditTemplate({ ...editTemplate, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Channel</label>
                <select value={editTemplate.channel} onChange={e => setEditTemplate({ ...editTemplate, channel: e.target.value })}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {['Email', 'SMS', 'Email + SMS', 'WhatsApp', 'Push Notification'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={handleSaveTemplate} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button onClick={() => setEditTemplate(null)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE TEMPLATE MODAL */}
      {deleteTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete Template?</h2>
            <p className="text-sm text-gray-500 mb-6">Delete <span className="font-semibold text-gray-700">{deleteTemplate.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTemplate(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDeleteTemplate} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

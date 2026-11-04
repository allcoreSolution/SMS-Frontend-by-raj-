import React, { useState } from 'react';
import { 
  Bell, Plus, Edit, Trash2, Send, X, Save, AlertTriangle, 
  CheckCircle2, Clock, ShieldAlert, Sparkles, Filter, Smartphone, 
  Mail, MessageSquare, Info, ChevronRight 
} from 'lucide-react';
import Swal from 'sweetalert2';

const initAlerts = [
  { id: 1, title: 'Server Maintenance Scheduled', message: 'Core database cluster upgrade tonight at 02:00 AM IST.', type: 'System', severity: 'Medium', recipients: 'All Administrators', sent: 'Nov 04, 04:30 PM' },
  { id: 2, title: 'Commercial License Lead Influx', message: 'High volume of ₹10K source code purchase requests recorded from landing page.', type: 'Commercial', severity: 'Low', recipients: 'Super Admin, Sales', sent: 'Nov 04, 02:15 PM' },
  { id: 3, title: 'SSL Certificate Auto-Renewed', message: 'Platform domain certificates renewed successfully for next 90 days.', type: 'Security', severity: 'Low', recipients: 'DevOps & SuperAdmin', sent: 'Nov 03, 11:00 AM' },
];

const initTemplates = [
  { id: 1, name: 'New School Welcome', trigger: 'On school registration', channel: 'Email + SMS', active: true },
  { id: 2, name: 'Payment Confirmation', trigger: 'On successful payment', channel: 'Email', active: true },
  { id: 3, name: 'Subscription Expiry (7 days)', trigger: '7 days before expiry', channel: 'Email + SMS', active: true },
  { id: 4, name: 'Subscription Expiry (1 day)', trigger: '1 day before expiry', channel: 'SMS', active: true },
  { id: 5, name: 'Server Health Alert', trigger: 'CPU / RAM > 85%', channel: 'Email + Push', active: false },
];

const Toggle = ({ checked, onChange }) => (
  <button 
    type="button" 
    onClick={() => onChange(!checked)} 
    className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer p-0.5 ${
      checked ? 'bg-orange-500' : 'bg-slate-200'
    }`}
  >
    <span className={`block w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${
      checked ? 'translate-x-4.5' : 'translate-x-0'
    }`} />
  </button>
);

const severityBadge = (s) => {
  if (s === 'High') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (s === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-blue-50 text-blue-700 border-blue-200';
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

  const handleSendAlert = (e) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.message) {
      return Swal.fire('Required', 'Please fill Title and Message.', 'warning');
    }
    const newAlert = { 
      ...alertForm, 
      id: Date.now(), 
      sent: new Date().toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    };
    setAlerts(prev => [newAlert, ...prev]);
    setShowSendAlert(false);
    setAlertForm(emptyAlert);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Alert broadcasted successfully!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!templateForm.name || !templateForm.trigger) {
      return Swal.fire('Required', 'Please fill Template Name and Trigger.', 'warning');
    }
    const id = Date.now();
    setTemplates(prev => [...prev, { ...templateForm, id, active: true }]);
    setTmplState(s => ({ ...s, [id]: true }));
    setShowAddTemplate(false);
    setTemplateForm(emptyTemplate);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Notification template created!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    setTemplates(prev => prev.map(t => t.id === editTemplate.id ? editTemplate : t));
    setEditTemplate(null);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Template updated!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  const handleDeleteTemplate = () => {
    setTemplates(prev => prev.filter(t => t.id !== deleteTemplate.id));
    setDeleteTemplate(null);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Template removed.',
      showConfirmButton: false,
      timer: 1800
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 max-w-[1250px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Alerts & Notifications</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Admin Hub
            </span>
          </div>
          <p className="text-xs text-slate-500">Manage real-time broadcast alerts, security warnings, and automated dispatch templates</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {tab === 'templates' && (
            <button 
              onClick={() => setShowAddTemplate(true)}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Template</span>
            </button>
          )}

          <button 
            onClick={() => setShowSendAlert(true)} 
            className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm shadow-orange-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 stroke-[2.5]" /> 
            <span>Send Alert</span>
          </button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 border-b border-slate-100 mb-6 pb-2">
        {[
          { key: 'log', label: 'Alert Log', icon: Bell, count: alerts.length },
          { key: 'templates', label: 'Notification Templates', icon: Mail, count: templates.length }
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button 
              key={t.key} 
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                active 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>{t.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${active ? 'bg-slate-800 text-orange-300' : 'bg-slate-200 text-slate-600'}`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ALERT LOG */}
      {tab === 'log' && (
        <div>
          {/* Mobile Cards for Alerts */}
          <div className="sm:hidden space-y-3 mb-4">
            {alerts.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-slate-400">No alerts broadcasted yet.</div>
            ) : (
              alerts.map(a => (
                <div key={a.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-xs">{a.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${severityBadge(a.severity)}`}>
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{a.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-200/60 font-medium">
                    <span>Recipients: {a.recipients}</span>
                    <span>{a.sent}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table for Alerts */}
          <div className="hidden sm:block overflow-x-auto pb-4">
            <table className="w-full text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                  <th className="text-left px-3.5 py-3 border-x border-slate-200">Alert Title</th>
                  <th className="text-left px-3.5 py-3 border-x border-slate-200">Message</th>
                  <th className="text-left px-3.5 py-3 border-x border-slate-200 w-24">Type</th>
                  <th className="text-center px-3.5 py-3 border-x border-slate-200 w-24">Severity</th>
                  <th className="text-left px-3.5 py-3 border-x border-slate-200 w-36">Sent At</th>
                  <th className="text-left px-3.5 py-3 border-x border-slate-200 w-36">Recipients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-slate-400 font-bold">No broadcast alerts recorded.</td>
                  </tr>
                ) : (
                  alerts.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/70 transition-colors bg-white">
                      <td className="px-3.5 py-3 border-x border-slate-200 font-bold text-slate-900">
                        {a.title}
                      </td>
                      <td className="px-3.5 py-3 border-x border-slate-200 text-slate-600">
                        {a.message}
                      </td>
                      <td className="px-3.5 py-3 border-x border-slate-200">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {a.type}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 border-x border-slate-200 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityBadge(a.severity)}`}>
                          {a.severity}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 border-x border-slate-200 text-slate-500 whitespace-nowrap">
                        {a.sent}
                      </td>
                      <td className="px-3.5 py-3 border-x border-slate-200 text-slate-700 font-medium">
                        {a.recipients}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATION TEMPLATES */}
      {tab === 'templates' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {templates.map(tmpl => (
              <div key={tmpl.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 hover:border-slate-300 transition space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{tmpl.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{tmpl.trigger}</p>
                  </div>
                  <Toggle 
                    checked={tmplState[tmpl.id] ?? tmpl.active} 
                    onChange={val => setTmplState(s => ({ ...s, [tmpl.id]: val }))} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                    Channel: {tmpl.channel}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditTemplate(tmpl)}
                      className="p-1 text-slate-500 hover:text-orange-600 bg-white border border-slate-200 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTemplate(tmpl)}
                      className="p-1 text-rose-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: SEND ALERT */}
      {showSendAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Broadcast Platform Alert</h3>
              </div>
              <button onClick={() => setShowSendAlert(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendAlert} className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Alert Title *</label>
                <input
                  type="text"
                  required
                  value={alertForm.title}
                  onChange={e => setAlertForm({ ...alertForm, title: e.target.value })}
                  placeholder="e.g. Scheduled System Maintenance"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message Content *</label>
                <textarea
                  rows={3}
                  required
                  value={alertForm.message}
                  onChange={e => setAlertForm({ ...alertForm, message: e.target.value })}
                  placeholder="Type alert details..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Severity</label>
                  <select
                    value={alertForm.severity}
                    onChange={e => setAlertForm({ ...alertForm, severity: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="Low">Low Severity</option>
                    <option value="Medium">Medium Severity</option>
                    <option value="High">High Severity (Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Recipients</label>
                  <select
                    value={alertForm.recipients}
                    onChange={e => setAlertForm({ ...alertForm, recipients: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="Super Admin">Super Admin Only</option>
                    <option value="All Administrators">All School Administrators</option>
                    <option value="DevOps & SuperAdmin">DevOps & Technical Staff</option>
                    <option value="All Platform Users">Global (All Users)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Broadcast Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendAlert(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TEMPLATE */}
      {(showAddTemplate || editTemplate) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {editTemplate ? 'Edit Notification Template' : 'New Notification Template'}
              </h3>
              <button 
                onClick={() => { setShowAddTemplate(false); setEditTemplate(null); }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editTemplate ? handleSaveTemplate : handleAddTemplate} className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={editTemplate ? editTemplate.name : templateForm.name}
                  onChange={e => {
                    const val = e.target.value;
                    if (editTemplate) setEditTemplate({ ...editTemplate, name: val });
                    else setTemplateForm({ ...templateForm, name: val });
                  }}
                  placeholder="e.g. Student Birthday Wish"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Trigger Event *</label>
                <input
                  type="text"
                  required
                  value={editTemplate ? editTemplate.trigger : templateForm.trigger}
                  onChange={e => {
                    const val = e.target.value;
                    if (editTemplate) setEditTemplate({ ...editTemplate, trigger: val });
                    else setTemplateForm({ ...templateForm, trigger: val });
                  }}
                  placeholder="e.g. On student enrollment"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Delivery Channel</label>
                <select
                  value={editTemplate ? editTemplate.channel : templateForm.channel}
                  onChange={e => {
                    const val = e.target.value;
                    if (editTemplate) setEditTemplate({ ...editTemplate, channel: val });
                    else setTemplateForm({ ...templateForm, channel: val });
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Email + SMS">Email + SMS</option>
                  <option value="WhatsApp">WhatsApp Gateway</option>
                  <option value="Push Notification">Push Notification</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Template
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddTemplate(false); setEditTemplate(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE TEMPLATE */}
      {deleteTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 text-center border border-slate-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Delete Template?</h3>
            <p className="text-xs text-slate-500 mb-5">
              Remove notification template <strong className="text-slate-800">{deleteTemplate.name}</strong>?
            </p>
            <div className="flex gap-2.5">
              <button 
                onClick={() => setDeleteTemplate(null)} 
                className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteTemplate} 
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

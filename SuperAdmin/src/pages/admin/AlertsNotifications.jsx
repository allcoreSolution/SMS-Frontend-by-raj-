import React, { useState, useEffect } from 'react';
import { 
  Bell, Plus, Edit, Trash2, Send, X, Save, AlertTriangle, 
  CheckCircle2, Clock, ShieldAlert, Sparkles, Filter, Smartphone, 
  Mail, MessageSquare, Info, ChevronRight, RefreshCw, Radio
} from 'lucide-react';
import Swal from 'sweetalert2';
import { superAdminService } from '../../api/superAdminService';

const defaultTemplates = [
  { id: 'tmpl-1', name: 'New School Welcome', trigger: 'On school registration', channel: 'Email + SMS', active: true },
  { id: 'tmpl-2', name: 'Payment Confirmation', trigger: 'On successful payment', channel: 'Email', active: true },
  { id: 'tmpl-3', name: 'Subscription Expiry (7 days)', trigger: '7 days before expiry', channel: 'Email + SMS', active: true },
  { id: 'tmpl-4', name: 'Subscription Expiry (1 day)', trigger: '1 day before expiry', channel: 'WhatsApp + SMS', active: true },
  { id: 'tmpl-5', name: 'Emergency Server Maintenance', trigger: 'Core database cluster patch', channel: 'Email + Push', active: false },
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
  if (s === 'Urgent' || s === 'High') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (s === 'Medium' || s === 'warning') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-blue-50 text-blue-700 border-blue-200';
};

const audienceLabel = (target) => {
  switch (String(target || '').toLowerCase()) {
    case 'schools': return 'All School Admins';
    case 'staff': return 'Faculty & Staff';
    case 'students': return 'Students & Parents';
    default: return 'Global (All Portals)';
  }
};

const emptyAlert = { 
  title: '', 
  message: '', 
  type: 'info', 
  priority: 'High', 
  targetAudience: 'all' 
};

const emptyTemplate = { name: '', trigger: '', channel: 'Email' };

export default function AlertsNotifications() {
  const [tab, setTab] = useState('log');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Template state backed by localStorage
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('sa_notification_templates');
      return saved ? JSON.parse(saved) : defaultTemplates;
    } catch {
      return defaultTemplates;
    }
  });

  const [tmplState, setTmplState] = useState(() => {
    try {
      const saved = localStorage.getItem('sa_notification_templates');
      const list = saved ? JSON.parse(saved) : defaultTemplates;
      return list.reduce((a, t) => ({ ...a, [t.id]: t.active }), {});
    } catch {
      return defaultTemplates.reduce((a, t) => ({ ...a, [t.id]: t.active }), {});
    }
  });

  const [showSendAlert, setShowSendAlert] = useState(false);
  const [alertForm, setAlertForm] = useState(emptyAlert);

  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [deleteTemplate, setDeleteTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState(emptyTemplate);

  // Fetch real broadcast announcements from backend
  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const res = await superAdminService.getBroadcasts(false);
      if (res && res.success) {
        setAlerts(res.data || []);
      } else if (Array.isArray(res)) {
        setAlerts(res);
      }
    } catch (err) {
      console.warn('Broadcasts fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  // Save templates to localStorage whenever modified
  const updateTemplatesAndStore = (newTemplates) => {
    setTemplates(newTemplates);
    try {
      localStorage.setItem('sa_notification_templates', JSON.stringify(newTemplates));
    } catch (err) {
      console.warn('Failed to save templates to storage:', err);
    }
  };

  const handleToggleBroadcastStatus = async (alertItem) => {
    try {
      const res = await superAdminService.toggleBroadcast(alertItem._id);
      if (res && res.success) {
        setAlerts(prev => prev.map(a => a._id === alertItem._id ? { ...a, isActive: !a.isActive } : a));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Alert ${!alertItem.isActive ? 'activated' : 'deactivated'}`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || err.message, 'error');
    }
  };

  const handleDeleteBroadcast = async (alertItem) => {
    const result = await Swal.fire({
      title: 'Delete Alert?',
      text: `Remove broadcast "${alertItem.title}" from the platform database?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await superAdminService.deleteBroadcast(alertItem._id);
        setAlerts(prev => prev.filter(a => a._id !== alertItem._id));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Broadcast deleted from database',
          showConfirmButton: false,
          timer: 1800
        });
      } catch (err) {
        Swal.fire('Error', err?.response?.data?.message || err.message, 'error');
      }
    }
  };

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.message) {
      return Swal.fire('Required', 'Please fill Title and Message.', 'warning');
    }

    try {
      setSubmitting(true);
      const payload = {
        title: alertForm.title.trim(),
        message: alertForm.message.trim(),
        type: alertForm.type.toLowerCase(),
        priority: alertForm.priority,
        targetAudience: alertForm.targetAudience.toLowerCase()
      };

      const res = await superAdminService.createBroadcast(payload);
      if (res && res.success) {
        setShowSendAlert(false);
        setAlertForm(emptyAlert);
        await fetchBroadcasts();
        Swal.fire({
          icon: 'success',
          title: 'Broadcast Published Live!',
          text: 'The alert has been saved to the database and broadcasted across all portal dashboards.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(res?.message || 'Failed to broadcast alert');
      }
    } catch (err) {
      Swal.fire('Broadcast Error', err?.response?.data?.message || err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (!templateForm.name || !templateForm.trigger) {
      return Swal.fire('Required', 'Please fill Template Name and Trigger.', 'warning');
    }
    const id = `tmpl-${Date.now()}`;
    const updated = [...templates, { ...templateForm, id, active: true }];
    updateTemplatesAndStore(updated);
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
    const updated = templates.map(t => t.id === editTemplate.id ? editTemplate : t);
    updateTemplatesAndStore(updated);
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
    const updated = templates.filter(t => t.id !== deleteTemplate.id);
    updateTemplatesAndStore(updated);
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

  const handleToggleTemplateState = (tmplId, val) => {
    setTmplState(s => ({ ...s, [tmplId]: val }));
    const updated = templates.map(t => t.id === tmplId ? { ...t, active: val } : t);
    updateTemplatesAndStore(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 max-w-[1250px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Alerts & Broadcasts</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live MongoDB Sync
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Publish real-time system alerts, school notices, and manage automated dispatch triggers across all portal panels
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {tab === 'log' && (
            <button 
              onClick={fetchBroadcasts} 
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
              title="Refresh alerts from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

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
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 border-b border-slate-100 mb-6 pb-2">
        {[
          { key: 'log', label: 'Broadcast Log (Database)', icon: Bell, count: alerts.length },
          { key: 'templates', label: 'Automated Event Triggers', icon: Mail, count: templates.length }
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
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-7 h-7 text-orange-500 animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading live broadcast alerts from MongoDB...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Radio className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No broadcast alerts found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Click "Broadcast Alert" above to dispatch a global announcement to school administrators and users.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Cards for Alerts */}
              <div className="sm:hidden space-y-3 mb-4">
                {alerts.map(a => (
                  <div key={a._id || a.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{a.title}</h4>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${severityBadge(a.priority || a.severity)}`}>
                          {a.priority || a.severity || 'Normal'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                          {a.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {a._id && (
                          <button 
                            onClick={() => handleDeleteBroadcast(a)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600">{a.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-200/60 font-medium">
                      <span>Audience: {audienceLabel(a.targetAudience || a.recipients)}</span>
                      <span>{a.createdAt ? new Date(a.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (a.sent || 'Just now')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table for Alerts */}
              <div className="hidden sm:block overflow-x-auto pb-4">
                <table className="w-full text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      <th className="text-left px-3.5 py-3 border-x border-slate-200">Alert Title & Details</th>
                      <th className="text-left px-3.5 py-3 border-x border-slate-200 w-28">Audience</th>
                      <th className="text-center px-3.5 py-3 border-x border-slate-200 w-24">Priority</th>
                      <th className="text-center px-3.5 py-3 border-x border-slate-200 w-24">Status</th>
                      <th className="text-left px-3.5 py-3 border-x border-slate-200 w-36">Sent At</th>
                      <th className="text-center px-3.5 py-3 border-x border-slate-200 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alerts.map(a => (
                      <tr key={a._id || a.id} className="hover:bg-slate-50/70 transition-colors bg-white">
                        <td className="px-3.5 py-3 border-x border-slate-200">
                          <div className="font-bold text-slate-900 text-xs mb-0.5">{a.title}</div>
                          <div className="text-[11px] text-slate-600 line-clamp-2">{a.message}</div>
                          {a.createdBy && (
                            <div className="text-[9px] font-mono text-slate-400 mt-1">By: {a.createdBy}</div>
                          )}
                        </td>
                        <td className="px-3.5 py-3 border-x border-slate-200">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {audienceLabel(a.targetAudience || a.recipients)}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 border-x border-slate-200 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityBadge(a.priority || a.severity)}`}>
                            {a.priority || a.severity || 'Normal'}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 border-x border-slate-200 text-center">
                          {a._id ? (
                            <button
                              onClick={() => handleToggleBroadcastStatus(a)}
                              className={`cursor-pointer inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                                a.isActive 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                              title="Click to toggle active status"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${a.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              {a.isActive ? 'Active' : 'Inactive'}
                            </button>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-3 border-x border-slate-200 text-slate-500 whitespace-nowrap text-[11px]">
                          {a.createdAt 
                            ? new Date(a.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : (a.sent || 'Just now')}
                        </td>
                        <td className="px-3.5 py-3 border-x border-slate-200 text-center">
                          {a._id ? (
                            <button
                              onClick={() => handleDeleteBroadcast(a)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete from database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">System</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
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
                    onChange={val => handleToggleTemplateState(tmpl.id, val)} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                    Channel: {tmpl.channel}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditTemplate(tmpl)}
                      className="p-1 text-slate-500 hover:text-orange-600 bg-white border border-slate-200 rounded-lg transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTemplate(tmpl)}
                      className="p-1 text-rose-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg transition cursor-pointer"
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

      {/* MODAL: BROADCAST ALERT */}
      {showSendAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Broadcast Live Announcement</h3>
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
                  placeholder="e.g. Scheduled Core Database Upgrade Tonight"
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
                  placeholder="Type broadcast message that will appear on tenant portals..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={alertForm.priority}
                    onChange={e => setAlertForm({ ...alertForm, priority: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Red Alert)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Audience</label>
                  <select
                    value={alertForm.targetAudience}
                    onChange={e => setAlertForm({ ...alertForm, targetAudience: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="all">Global (All Users & Schools)</option>
                    <option value="schools">School Administrators Only</option>
                    <option value="staff">Staff & Faculty Only</option>
                    <option value="students">Students & Parents Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> 
                  <span>{submitting ? 'Broadcasting...' : 'Broadcast to Portals'}</span>
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
                {editTemplate ? 'Edit Notification Trigger' : 'New Notification Trigger'}
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
                <label className="block text-slate-700 font-bold mb-1">Trigger Event Name *</label>
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
                <label className="block text-slate-700 font-bold mb-1">Trigger Condition *</label>
                <input
                  type="text"
                  required
                  value={editTemplate ? editTemplate.trigger : templateForm.trigger}
                  onChange={e => {
                    const val = e.target.value;
                    if (editTemplate) setEditTemplate({ ...editTemplate, trigger: val });
                    else setTemplateForm({ ...templateForm, trigger: val });
                  }}
                  placeholder="e.g. On student enrollment confirmation"
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
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="WhatsApp + SMS">WhatsApp + SMS</option>
                  <option value="Email + SMS">Email + SMS</option>
                  <option value="Push Notification">Push Notification</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2.5">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Trigger
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
            <h3 className="font-bold text-slate-900 text-base mb-1">Delete Trigger?</h3>
            <p className="text-xs text-slate-500 mb-5">
              Remove notification trigger <strong className="text-slate-800">{deleteTemplate.name}</strong>?
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

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Power, AlertTriangle, CheckCircle, Info, ShieldAlert, X } from 'lucide-react';
import { superAdminService } from '../api/superAdminService';
import Swal from 'sweetalert2';

export default function BroadcastModal({ isOpen, onClose }) {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'Normal',
    targetAudience: 'all',
    actionUrl: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadBroadcasts();
    }
  }, [isOpen]);

  const loadBroadcasts = async () => {
    try {
      setLoading(true);
      const res = await superAdminService.getBroadcasts(false);
      if (res.success) {
        setBroadcasts(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      return Swal.fire('Missing Details', 'Please fill title and message', 'warning');
    }
    try {
      const res = await superAdminService.createBroadcast(formData);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Broadcast Published!',
          text: 'The announcement is now visible across portals.',
          timer: 2000,
          showConfirmButton: false
        });
        setFormData({ title: '', message: '', type: 'info', priority: 'Normal', targetAudience: 'all', actionUrl: '' });
        setShowAddForm(false);
        loadBroadcasts();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await superAdminService.toggleBroadcast(id);
      if (res.success) {
        loadBroadcasts();
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Broadcast Alert?',
      text: 'This alert will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444'
    });
    if (confirm.isConfirmed) {
      try {
        await superAdminService.deleteBroadcast(id);
        loadBroadcasts();
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Global Broadcast Emergency Center</h2>
              <p className="text-[11px] text-slate-400">Broadcast live banner alerts across all school tenant portals</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">Active Platform Announcements ({broadcasts.length})</p>
            <button
              onClick={() => setShowAddForm(prev => !prev)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel New Alert' : 'New Broadcast Alert'}</span>
            </button>
          </div>

          {/* New Broadcast Form */}
          {showAddForm && (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Create Live Alert Banner</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Cloud Maintenance Tonight at 11:00 PM IST"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Broadcast Message *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter detailed notice to display on the top announcement banner..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Banner Style</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="danger">Emergency (Red)</option>
                    <option value="success">Success (Green)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent / Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value="all">All Portals (Global)</option>
                    <option value="schools">School Admins</option>
                    <option value="staff">Teachers & Staff</option>
                    <option value="students">Students & Parents</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer"
                >
                  Publish Broadcast Alert
                </button>
              </div>
            </form>
          )}

          {/* Broadcasts List */}
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading alerts...</div>
          ) : broadcasts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-xs font-semibold">No broadcast announcements posted yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click 'New Broadcast Alert' above to send a platform-wide banner</p>
            </div>
          ) : (
            <div className="space-y-2">
              {broadcasts.map(bc => {
                const colorMap = {
                  info: 'border-blue-200 bg-blue-50/60 text-blue-900',
                  warning: 'border-amber-200 bg-amber-50/60 text-amber-900',
                  danger: 'border-rose-200 bg-rose-50/60 text-rose-900',
                  success: 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                };
                return (
                  <div
                    key={bc._id}
                    className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${colorMap[bc.type] || colorMap.info}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${bc.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                          {bc.isActive ? 'LIVE ACTIVE' : 'DISABLED'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{bc.priority} Priority · {bc.targetAudience}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-950">{bc.title}</h4>
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">{bc.message}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Created by {bc.createdBy} · {new Date(bc.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggle(bc._id)}
                        className={`p-1.5 rounded-xl border cursor-pointer transition-colors ${bc.isActive ? 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800' : 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-700'}`}
                        title={bc.isActive ? 'Turn Off Alert' : 'Turn On Alert'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bc._id)}
                        className="p-1.5 rounded-xl border border-rose-200 bg-rose-100 hover:bg-rose-200 text-rose-700 cursor-pointer transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>ALL CORE SOLUTION Broadcast Dispatcher</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

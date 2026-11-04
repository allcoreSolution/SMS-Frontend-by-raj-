import React, { useState } from 'react';
import { 
  Bell, CheckCircle, Trash2, UserPlus, DollarSign, 
  AlertCircle, LogIn, Settings, Check, X, Sparkles, 
  ShieldCheck, Clock, ShoppingBag 
} from 'lucide-react';
import Swal from 'sweetalert2';

const INIT_NOTIFS = [
  { id: 1, type: 'register', title: 'New School Registration Request', message: 'Modern International Academy requested platform tenant onboarding.', time: '10 mins ago', read: false },
  { id: 2, type: 'license', title: 'Commercial Source Code Purchase', message: '₹10,000 Full Source Code package enquiry received from landing web.', time: '35 mins ago', read: false },
  { id: 3, type: 'payment', title: 'Subscription Payment Verified', message: 'Amity School renewed their Standard Annual Plan (₹24,000 received).', time: '2 hours ago', read: false },
  { id: 4, type: 'alert', title: 'Security Health Pass', message: 'Routine automated SSL certificate check completed without error.', time: '5 hours ago', read: true },
  { id: 5, type: 'login', title: 'SuperAdmin Session Authenticated', message: 'Master console access granted from IP 127.0.0.1.', time: 'Today, 09:00 AM', read: true },
];

const TYPE_CONFIG = {
  register: { icon: UserPlus, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: 'Registration' },
  license:  { icon: ShoppingBag, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'License' },
  payment:  { icon: DollarSign, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: 'Payment' },
  alert:    { icon: AlertCircle, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', label: 'Alert' },
  login:    { icon: LogIn, bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', label: 'Login' },
  system:   { icon: Settings, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'System' },
};

const TABS = ['All', 'Unread', 'Registration', 'License', 'Payment', 'Alert'];

export default function Notifications() {
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [activeTab, setActiveTab] = useState('All');

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    return TYPE_CONFIG[n.type]?.label === activeTab;
  });

  const markRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'All marked as read', showConfirmButton: false, timer: 1500 });
  };

  const deleteNotif = (id) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifs([]);
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Inbox cleared', showConfirmButton: false, timer: 1500 });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 max-w-[1250px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Notifications Inbox</h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">Live platform alerts, registration webhooks, and billing events</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs active:scale-95 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark all read</span>
            </button>
          )}

          {notifs.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear inbox</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-6">
        {[
          { label: 'Total Alerts', value: notifs.length, color: 'text-slate-900', bg: 'bg-slate-50' },
          { label: 'Unread', value: unreadCount, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Registrations', value: notifs.filter(n => n.type === 'register').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'License Leads', value: notifs.filter(n => n.type === 'license').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Payments', value: notifs.filter(n => n.type === 'payment').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl border border-slate-200/80 p-3 text-center`}>
            <p className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto scrollbar-none pb-1">
        {TABS.map(tab => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                active 
                  ? 'bg-slate-900 text-white shadow-2xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Inbox is empty</h4>
            <p className="text-xs text-slate-400 mt-0.5">All platform notifications have been addressed.</p>
          </div>
        ) : (
          filtered.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  n.read 
                    ? 'bg-white border-slate-200/70 hover:bg-slate-50/50' 
                    : 'bg-orange-50/20 border-orange-200/60 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${cfg.bg} ${cfg.text} border ${cfg.border} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-xs ${n.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      {n.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(n.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

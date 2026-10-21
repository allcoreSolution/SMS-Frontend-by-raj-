import React, { useState } from 'react';
import { Bell, CheckCircle, Trash2, UserPlus, DollarSign, AlertCircle, LogIn, Settings, Check, X } from 'lucide-react';

const INIT_NOTIFS = [
  { id: 1,  type: 'register', title: 'New school registered',       desc: 'Ali Public School joined the platform',              time: '5 min ago',   read: false },
  { id: 2,  type: 'payment',  title: 'Payment received',            desc: '₹4,999 from Montessori School — Premium plan',       time: '1 hour ago',  read: false },
  { id: 3,  type: 'alert',    title: 'Server CPU alert',            desc: 'CPU usage spiked to 78% on production server',       time: '2 hours ago', read: false },
  { id: 4,  type: 'login',    title: 'New admin login',             desc: 'School admin logged in from new device — Oxford',    time: '3 hours ago', read: true  },
  { id: 5,  type: 'payment',  title: 'Payment received',            desc: '₹2,499 from St. Mary Convent — Standard plan',       time: '5 hours ago', read: true  },
  { id: 6,  type: 'register', title: 'New school registered',       desc: 'Sunrise Public School joined the platform',          time: '1 day ago',   read: true  },
  { id: 7,  type: 'alert',    title: 'Support ticket raised',       desc: 'Green Valley — Report card not generating',          time: '1 day ago',   read: true  },
  { id: 8,  type: 'system',   title: 'System update available',     desc: 'Platform v2.4.1 is ready to install',                time: '2 days ago',  read: true  },
  { id: 9,  type: 'payment',  title: 'Payment failed',              desc: '₹999 from Sunrise School — card declined',           time: '2 days ago',  read: true  },
  { id: 10, type: 'login',    title: 'Super Admin login',           desc: 'You logged in from Chrome on Windows',               time: '3 days ago',  read: true  },
  { id: 11, type: 'register', title: 'New school registered',       desc: 'Green Valley School joined the platform',            time: '4 days ago',  read: true  },
  { id: 12, type: 'system',   title: 'Backup completed',            desc: 'Daily database backup completed successfully',       time: '4 days ago',  read: true  },
];

const TYPE_CONFIG = {
  register: { icon: UserPlus,    bg: 'bg-blue-100',   color: 'text-blue-600',   label: 'Registration' },
  payment:  { icon: DollarSign,  bg: 'bg-green-100',  color: 'text-green-600',  label: 'Payment'      },
  alert:    { icon: AlertCircle, bg: 'bg-red-100',    color: 'text-red-500',    label: 'Alert'        },
  login:    { icon: LogIn,       bg: 'bg-purple-100', color: 'text-purple-600', label: 'Login'        },
  system:   { icon: Settings,    bg: 'bg-gray-100',   color: 'text-gray-600',   label: 'System'       },
};

const TABS = ['All', 'Unread', 'Registration', 'Payment', 'Alert', 'System'];

export default function Notifications() {
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [activeTab, setActiveTab] = useState('All');
  const [deleteId, setDeleteId] = useState(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    return TYPE_CONFIG[n.type]?.label === activeTab;
  });

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id) => { setNotifs(prev => prev.filter(n => n.id !== id)); setDeleteId(null); };
  const clearAll = () => setNotifs([]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-none text-sm font-semibold transition-colors">
              <Check className="w-4 h-4" /> Mark all read
            </button>
          )}
          {notifs.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 border border-red-100 hover:bg-red-50 text-red-500 px-4 py-2 rounded-none text-sm font-semibold transition-colors">
              <Trash2 className="w-4 h-4" /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total',        value: notifs.length,                                          color: 'text-gray-800'   },
          { label: 'Unread',       value: notifs.filter(n => !n.read).length,                     color: 'text-red-500'    },
          { label: 'Registrations',value: notifs.filter(n => n.type === 'register').length,       color: 'text-blue-600'   },
          { label: 'Payments',     value: notifs.filter(n => n.type === 'payment').length,        color: 'text-green-600'  },
          { label: 'Alerts',       value: notifs.filter(n => n.type === 'alert').length,          color: 'text-orange-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-none text-xs font-semibold transition-colors ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {tab}
            {tab === 'Unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-none">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-none flex items-center justify-center mb-3">
              <Bell className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filtered.map(n => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              return (
                <li
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${!n.read ? 'bg-orange-50/40' : ''}`}>

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-none ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-none bg-orange-500 flex-shrink-0" />}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-none ml-auto flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{n.desc}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        title="Mark as read"
                        className="p-1.5 hover:bg-green-50 rounded-none text-green-500 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteId(n.id)}
                      title="Delete"
                      className="p-1.5 hover:bg-red-50 rounded-none text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete Notification?</h2>
            <p className="text-sm text-gray-500 mb-6">This notification will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteNotif(deleteId)} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

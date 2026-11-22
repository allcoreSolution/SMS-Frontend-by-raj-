import React, { useState, useEffect } from 'react';
import { User, DollarSign, UserPlus, AlertCircle, LogIn, Maximize2, Activity } from 'lucide-react';

import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

const TYPE_CONFIG = {
  login:    { icon: LogIn,     bg: 'bg-purple-50 text-purple-600 border border-purple-200' },
  register: { icon: UserPlus,  bg: 'bg-blue-50 text-blue-600 border border-blue-200' },
  payment:  { icon: DollarSign,bg: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  alert:    { icon: AlertCircle,bg:'bg-rose-50 text-rose-500 border border-rose-200' },
};

const formatTime = (minsAgo) => {
  if (minsAgo < 1) return 'just now';
  if (minsAgo < 60) return `${minsAgo}m ago`;
  const h = Math.floor(minsAgo / 60);
  const m = minsAgo % 60;
  return m > 0 ? `${h}h ${m}m ago` : `${h}h ago`;
};

const LiveActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await tenantService.getTenants();
      if(res.data) {
         const acts = toArray(res).map(t => {
            const msAgo = Date.now() - new Date(t.createdAt).getTime();
            return {
              action: 'New school registered',
              user: t.schoolName,
              type: 'register',
              minsAgo: Math.floor(msAgo / 60000)
            };
         });
         setActivities(acts.sort((a,b) => a.minsAgo - b.minsAgo));
      }
    } catch(err) {
      console.error(err);
    }
  };

  // Every minute, increment all minsAgo by 1 to simulate live time passing
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => prev.map(a => ({ ...a, minsAgo: a.minsAgo + 1 })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-full overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">Live Activity Stream</h2>
            <span className="flex items-center gap-1.5 text-[9.5px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Registrations, payments &amp; audits</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
          <Activity className="w-4 h-4 text-amber-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 h-[440px]">
        <ul className="space-y-2">
          {activities.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xs text-slate-400 font-medium pb-10">No recent activity</div>
          ) : activities.map((item, idx) => {
            const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.register;
            const Icon = cfg.icon;
            return (
              <li key={idx} className="flex items-start p-3 bg-slate-50/50 hover:bg-amber-50/30 rounded-2xl transition-all border border-slate-100/80 hover:border-amber-200">
                <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 leading-tight">{item.action}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{item.user}</p>
                </div>
                <div className="text-[9.5px] text-slate-400 font-bold ml-2 flex-shrink-0 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                  {formatTime(item.minsAgo)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LiveActivity;

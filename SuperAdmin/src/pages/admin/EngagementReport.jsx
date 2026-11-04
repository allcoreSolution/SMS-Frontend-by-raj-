import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Activity, Clock, Award, Building2, Layers } from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

const weeklyEngagement = [
  { day: 'Mon', sessions: 1240, avgTime: 18 }, { day: 'Tue', sessions: 1180, avgTime: 16 },
  { day: 'Wed', sessions: 1350, avgTime: 20 }, { day: 'Thu', sessions: 1290, avgTime: 19 },
  { day: 'Fri', sessions: 1100, avgTime: 15 }, { day: 'Sat', sessions: 620, avgTime: 12 },
  { day: 'Sun', sessions: 280, avgTime: 8 },
];

const moduleUsage = [
  { module: 'Fee Collections & Gateways', usage: 96, color: 'bg-emerald-500' },
  { module: 'Student Attendance & GPS Bus', usage: 89, color: 'bg-blue-500' },
  { module: 'Academic Reports & Report Cards', usage: 82, color: 'bg-indigo-500' },
  { module: 'Staff & Payroll Ledger', usage: 68, color: 'bg-orange-500' },
  { module: 'Admissions & CRM Inquiries', usage: 58, color: 'bg-purple-500' },
  { module: 'Hostel & Library Circulation', usage: 35, color: 'bg-slate-400' },
];

export default function EngagementReport() {
  const [metric, setMetric] = useState('sessions');
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    tenantService.getTenants().then(res => {
      const list = toArray(res);
      setSchools(list.map((s, idx) => ({
        name: s.schoolName,
        sessions: 1200 - idx * 240,
        avgTime: `${16 - idx * 2}m`,
        score: Math.max(75, 96 - idx * 6)
      })));
    }).catch(() => {});
  }, []);

  const handleExport = () => {
    const headers = ['Day', 'Sessions', 'Avg Time (Minutes)'];
    const rows = weeklyEngagement.map(w => [`"${w.day}"`, w.sessions, w.avgTime]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `engagement_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Engagement report exported', showConfirmButton: false, timer: 1500 });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 max-w-[1250px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Platform Engagement Report</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Weekly Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500">Platform session retention, active school participation, and module utilization metrics</p>
        </div>

        <button 
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition shadow-2xs active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Analytics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Sessions (Week)', value: '8,060', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Institutions', value: `${schools.length || 2} Online`, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Session Duration', value: '17.2 min', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Platform Health Score', value: '94/100', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-3.5 sm:p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{k.value}</p>
                <p className="text-[11px] text-slate-500 font-medium truncate">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Engagement Chart */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4 sm:p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Daily Session Trends</h3>
          <div className="flex gap-1.5 self-start sm:self-auto">
            {[{ key: 'sessions', label: 'Total Sessions' }, { key: 'avgTime', label: 'Avg Time (min)' }].map(m => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  metric === m.key 
                    ? 'bg-slate-900 text-white shadow-2xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-44 sm:h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyEngagement} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                itemStyle={{ color: '#f97316' }}
              />
              <Bar dataKey={metric} fill="#f97316" radius={[4, 4, 0, 0]} name={metric === 'sessions' ? 'Sessions' : 'Minutes'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Most Engaged Schools & Module Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Most Engaged Schools */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-500" />
            Top Active Institutes
          </h3>
          <div className="divide-y divide-slate-200/60">
            {schools.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading campus telemetry...</div>
            ) : (
              schools.map((s, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-500">{s.sessions} sessions · {s.avgTime} avg</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {s.score}/100
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Module Usage Breakdown */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            Feature & Module Utilization Rate
          </h3>
          <div className="space-y-3">
            {moduleUsage.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800 font-semibold">{m.module}</span>
                  <span className="text-slate-500 font-bold">{m.usage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${m.usage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

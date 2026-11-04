import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Key, Monitor, Smartphone, Globe, ShieldCheck, CheckCircle2, XCircle, Search, Laptop } from 'lucide-react';
import Swal from 'sweetalert2';

const hourlyData = [
  { hour: '6AM', logins: 12 }, { hour: '7AM', logins: 45 }, { hour: '8AM', logins: 120 },
  { hour: '9AM', logins: 180 }, { hour: '10AM', logins: 160 }, { hour: '11AM', logins: 140 },
  { hour: '12PM', logins: 90 }, { hour: '1PM', logins: 75 }, { hour: '2PM', logins: 110 },
  { hour: '3PM', logins: 130 }, { hour: '4PM', logins: 100 }, { hour: '5PM', logins: 60 },
  { hour: '6PM', logins: 30 }, { hour: '7PM', logins: 15 },
];

const logs = [
  { id: 1, user: 'Super Admin', role: 'Superadmin', ip: '127.0.0.1', device: 'Desktop', browser: 'Chrome', location: 'New Delhi, IN', time: 'Today, 04:30 PM', status: 'Success' },
  { id: 2, user: 'allcore@gmail.com', role: 'School Admin', ip: '103.21.58.12', device: 'Mobile', browser: 'Chrome', location: 'Delhi, IN', time: 'Today, 03:15 PM', status: 'Success' },
  { id: 3, user: 'amityschool@gmail.com', role: 'School Admin', ip: '49.36.12.88', device: 'Desktop', browser: 'Firefox', location: 'Noida, IN', time: 'Today, 02:47 PM', status: 'Success' },
  { id: 4, user: 'unknown-root', role: '—', ip: '185.220.101.5', device: 'Desktop', browser: 'Safari', location: 'Frankfurt, DE', time: 'Today, 01:20 PM', status: 'Failed' },
  { id: 5, user: 'teacher.rohit@school.com', role: 'Teacher', ip: '122.161.45.9', device: 'Mobile', browser: 'Android App', location: 'Bengaluru, IN', time: 'Today, 11:05 AM', status: 'Success' },
  { id: 6, user: 'accountant@school.com', role: 'Accountant', ip: '103.21.58.15', device: 'Desktop', browser: 'Edge', location: 'Mumbai, IN', time: 'Today, 09:12 AM', status: 'Success' },
];

export default function LoginReport() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => {
    const matchFilter = filter === 'All' || l.status === filter;
    const matchSearch = !search.trim() || 
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.ip.toLowerCase().includes(search.toLowerCase()) ||
      l.role.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleExport = () => {
    const headers = ['User', 'Role', 'IP Address', 'Device', 'Browser', 'Location', 'Time', 'Status'];
    const rows = filtered.map(l => [
      `"${l.user}"`, `"${l.role}"`, `"${l.ip}"`, `"${l.device}"`, `"${l.browser}"`, `"${l.location}"`, `"${l.time}"`, `"${l.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `login_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Exported login report CSV', showConfirmButton: false, timer: 1500 });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 max-w-[1250px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Login Telemetry & Reports</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Live Audits
            </span>
          </div>
          <p className="text-xs text-slate-500">Real-time session access logs, client IP geolocation, and failure attempts</p>
        </div>

        <button 
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition shadow-2xs active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Logins Today', value: '1,247', icon: Key, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Unique Users', value: '438', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Mobile Device Share', value: '64%', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Failed Attempts', value: '1', icon: Monitor, color: 'text-rose-500', bg: 'bg-rose-50' },
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

      {/* Hourly Chart Card */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Login Volume By Hour (Today)</h3>
          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
            Peak: 09:00 AM
          </span>
        </div>
        <div className="h-44 sm:h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                itemStyle={{ color: '#f97316' }}
              />
              <Bar dataKey="logins" fill="#f97316" radius={[4, 4, 0, 0]} name="Logins" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-4 items-center">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search username, role or IP address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 shadow-2xs"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-1.5 justify-start sm:justify-end">
          {['All', 'Success', 'Failed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === f 
                  ? 'bg-slate-900 text-white shadow-2xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE CARD VIEW (< 640px) */}
      <div className="sm:hidden space-y-2.5 mb-4">
        {filtered.map(l => (
          <div key={l.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{l.user}</h4>
                <p className="text-[11px] text-slate-500">{l.role} • {l.location}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                l.status === 'Success' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {l.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 font-mono text-slate-600">
              <span>{l.ip}</span>
              <span className="font-sans text-slate-400 text-[10px]">{l.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto pb-4">
        <table className="w-full text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <th className="text-left px-3.5 py-3 border-x border-slate-200">User Identity</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Role</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200 font-mono">IP Address</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Device / Browser</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Location</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Time</th>
              <th className="text-center px-3.5 py-3 border-x border-slate-200">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(l => (
              <tr key={l.id} className="hover:bg-slate-50/70 transition-colors bg-white">
                <td className="px-3.5 py-2.5 border-x border-slate-200 font-bold text-slate-900">
                  {l.user}
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 text-slate-600 font-medium">
                  {l.role}
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 font-mono text-blue-600">
                  {l.ip}
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 text-slate-600">
                  {l.device} • {l.browser}
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 text-slate-600">
                  {l.location}
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 text-slate-500 whitespace-nowrap">
                  {l.time}
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    l.status === 'Success' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Key, Monitor, Smartphone, Globe } from 'lucide-react';

const hourlyData = [
  { hour: '6AM', logins: 12 }, { hour: '7AM', logins: 45 }, { hour: '8AM', logins: 120 },
  { hour: '9AM', logins: 180 }, { hour: '10AM', logins: 160 }, { hour: '11AM', logins: 140 },
  { hour: '12PM', logins: 90 }, { hour: '1PM', logins: 75 }, { hour: '2PM', logins: 110 },
  { hour: '3PM', logins: 130 }, { hour: '4PM', logins: 100 }, { hour: '5PM', logins: 60 },
  { hour: '6PM', logins: 30 }, { hour: '7PM', logins: 15 },
];

const logs = [
  { id: 1, user: 'Super Admin', role: 'Superadmin', ip: '192.168.1.1', device: 'Desktop', browser: 'Chrome', location: 'Mumbai, IN', time: 'Sep 01, 10:00 AM', status: 'Success' },
  { id: 2, user: 'schoolAdmin', role: 'School Admin', ip: '103.21.58.12', device: 'Mobile', browser: 'Safari', location: 'Delhi, IN', time: 'Sep 01, 09:30 AM', status: 'Success' },
  { id: 3, user: 'branchAdmin', role: 'Branch Admin', ip: '49.36.12.88', device: 'Desktop', browser: 'Firefox', location: 'Pune, IN', time: 'Sep 01, 08:47 AM', status: 'Success' },
  { id: 4, user: 'unknown', role: '—', ip: '185.220.101.5', device: 'Desktop', browser: 'Chrome', location: 'Unknown', time: 'Sep 01, 08:20 AM', status: 'Failed' },
  { id: 5, user: 'schoolAdmin', role: 'School Admin', ip: '103.21.58.12', device: 'Mobile', browser: 'Chrome', location: 'Delhi, IN', time: 'Sep 01, 08:02 AM', status: 'Success' },
  { id: 6, user: 'teacher01', role: 'Teacher', ip: '122.161.45.9', device: 'Mobile', browser: 'Safari', location: 'Bangalore, IN', time: 'Sep 01, 07:55 AM', status: 'Success' },
];

const LoginReport = () => {
  const [filter, setFilter] = useState('All');

  const filtered = logs.filter(l => filter === 'All' || l.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Login Report</h1>
          <p className="text-sm text-gray-500 mt-1">Track all login activity across the platform</p>
        </div>
        <button className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-none text-sm font-semibold">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Logins Today', value: '1,247', icon: Key, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Unique Users', value: '438', icon: Globe, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Mobile Logins', value: '62%', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Failed Attempts', value: '3', icon: Monitor, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-none ${k.bg} flex items-center justify-center`}>
              <k.icon className={`w-5 h-5 ${k.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{k.value}</p>
              <p className="text-xs text-gray-500">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-none border border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Login Activity by Hour (Today)</h3>
        </div>
        <div className="p-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip />
              <Bar dataKey="logins" fill="#f97316" radius={[3, 3, 0, 0]} name="Logins" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">Login Logs</h3>
          <div className="flex gap-2">
            {['All', 'Success', 'Failed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-none text-xs font-semibold transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['User', 'Role', 'IP Address', 'Device', 'Location', 'Time', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{l.user}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{l.role}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{l.ip}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      {l.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                      {l.device}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{l.location}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{l.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${l.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginReport;

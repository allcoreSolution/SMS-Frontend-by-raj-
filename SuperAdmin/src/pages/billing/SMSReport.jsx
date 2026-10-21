import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

const dailyData = [
  { day: 'Mon', sent: 1200, delivered: 1150, failed: 50 },
  { day: 'Tue', sent: 980, delivered: 940, failed: 40 },
  { day: 'Wed', sent: 1450, delivered: 1400, failed: 50 },
  { day: 'Thu', sent: 1100, delivered: 1060, failed: 40 },
  { day: 'Fri', sent: 1300, delivered: 1250, failed: 50 },
  { day: 'Sat', sent: 600, delivered: 580, failed: 20 },
  { day: 'Sun', sent: 200, delivered: 195, failed: 5 },
];

const logs = [
  { id: 1, school: 'Montessori School', type: 'Fee Reminder', phone: '+91 98765 XXXXX', status: 'Delivered', time: '10:30 AM', cost: '₹0.20' },
  { id: 2, school: 'SSVP School', type: 'Attendance Alert', phone: '+91 87654 XXXXX', status: 'Delivered', time: '09:15 AM', cost: '₹0.20' },
  { id: 3, school: 'Green Valley', type: 'Exam Notice', phone: '+91 76543 XXXXX', status: 'Failed', time: '08:45 AM', cost: '₹0.00' },
  { id: 4, school: 'Oxford International', type: 'Fee Reminder', phone: '+91 65432 XXXXX', status: 'Pending', time: '08:00 AM', cost: '₹0.20' },
  { id: 5, school: 'Sunrise School', type: 'Holiday Notice', phone: '+91 54321 XXXXX', status: 'Delivered', time: '07:30 AM', cost: '₹0.20' },
];

const statusBadge = (s) => {
  if (s === 'Delivered') return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-none text-xs font-semibold"><CheckCircle className="w-3 h-3" />Delivered</span>;
  if (s === 'Failed') return <span className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-0.5 rounded-none text-xs font-semibold"><XCircle className="w-3 h-3" />Failed</span>;
  return <span className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded-none text-xs font-semibold"><Clock className="w-3 h-3" />Pending</span>;
};

const SMSReport = () => {
  const [filter, setFilter] = useState('All');

  const filtered = logs.filter(l => filter === 'All' || l.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SMS Report</h1>
          <p className="text-sm text-gray-500 mt-1">SMS delivery analytics and logs</p>
        </div>
        <button className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-none text-sm font-semibold">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sent (Month)', value: '6,830', color: 'text-blue-600' },
          { label: 'Delivered', value: '6,575', color: 'text-green-600' },
          { label: 'Failed', value: '255', color: 'text-red-500' },
          { label: 'Delivery Rate', value: '96.3%', color: 'text-orange-500' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Daily SMS Volume (This Week)</h3>
        </div>
        <div className="p-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip />
              <Bar dataKey="delivered" fill="#22c55e" radius={[3, 3, 0, 0]} name="Delivered" stackId="a" />
              <Bar dataKey="failed" fill="#fca5a5" radius={[3, 3, 0, 0]} name="Failed" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">SMS Logs</h3>
          <div className="flex gap-2">
            {['All', 'Delivered', 'Failed', 'Pending'].map(f => (
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
                {['School', 'Type', 'Phone', 'Status', 'Time', 'Cost'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{l.school}</td>
                  <td className="px-4 py-3 text-gray-600">{l.type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{l.phone}</td>
                  <td className="px-4 py-3">{statusBadge(l.status)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{l.time}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{l.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SMSReport;

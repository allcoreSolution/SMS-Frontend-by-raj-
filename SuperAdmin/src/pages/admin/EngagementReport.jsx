import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Activity, Clock } from 'lucide-react';

const weeklyEngagement = [
  { day: 'Mon', sessions: 1240, avgTime: 18 }, { day: 'Tue', sessions: 1180, avgTime: 16 },
  { day: 'Wed', sessions: 1350, avgTime: 20 }, { day: 'Thu', sessions: 1290, avgTime: 19 },
  { day: 'Fri', sessions: 1100, avgTime: 15 }, { day: 'Sat', sessions: 620, avgTime: 12 },
  { day: 'Sun', sessions: 280, avgTime: 8 },
];

const topSchools = [
  { name: 'Montessori School', sessions: 4820, avgTime: '22 min', score: 94 },
  { name: 'Oxford International', sessions: 4210, avgTime: '20 min', score: 91 },
  { name: 'SSVP School', sessions: 3890, avgTime: '18 min', score: 88 },
  { name: 'St. Mary Convent', sessions: 3240, avgTime: '17 min', score: 84 },
  { name: 'Green Valley', sessions: 2980, avgTime: '15 min', score: 79 },
];

const moduleUsage = [
  { module: 'Fee Module', usage: 95 }, { module: 'Attendance', usage: 88 },
  { module: 'Reports', usage: 76 }, { module: 'HR/Payroll', usage: 62 },
  { module: 'Transport', usage: 45 }, { module: 'Hostel', usage: 30 },
];

const EngagementReport = () => {
  const [metric, setMetric] = useState('sessions');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Engagement Report</h1>
          <p className="text-sm text-gray-500 mt-1">Platform usage and engagement analytics</p>
        </div>
        <button className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-none text-sm font-semibold">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sessions (Week)', value: '8,060', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Schools', value: '420', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Session Time', value: '15.4 min', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Engagement Score', value: '83/100', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
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
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">Weekly Engagement</h3>
          <div className="flex gap-2">
            {[{ key: 'sessions', label: 'Sessions' }, { key: 'avgTime', label: 'Avg Time (min)' }].map(m => (
              <button key={m.key} onClick={() => setMetric(m.key)}
                className={`px-3 py-1 rounded-none text-xs font-semibold transition-colors ${metric === m.key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyEngagement}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip />
              <Bar dataKey={metric} fill="#f97316" radius={[3, 3, 0, 0]} name={metric === 'sessions' ? 'Sessions' : 'Avg Time (min)'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Schools */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Most Engaged Schools</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {topSchools.map((s, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
                <span className="w-6 h-6 rounded-none bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.sessions.toLocaleString()} sessions · {s.avgTime} avg</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${s.score >= 90 ? 'text-green-600' : s.score >= 80 ? 'text-orange-500' : 'text-red-500'}`}>{s.score}</p>
                  <p className="text-[10px] text-gray-400">score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Usage */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Module Usage Rate</h3>
          </div>
          <div className="p-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} unit="%" />
                <YAxis dataKey="module" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} width={80} />
                <Tooltip />
                <Bar dataKey="usage" fill="#f97316" radius={[0, 4, 4, 0]} name="Usage %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementReport;

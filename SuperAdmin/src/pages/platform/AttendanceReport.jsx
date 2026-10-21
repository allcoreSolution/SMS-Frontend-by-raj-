import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', present: 92, absent: 8 },
  { day: 'Tue', present: 88, absent: 12 },
  { day: 'Wed', present: 95, absent: 5 },
  { day: 'Thu', present: 90, absent: 10 },
  { day: 'Fri', present: 85, absent: 15 },
  { day: 'Sat', present: 70, absent: 30 },
];

const monthlyTrend = [
  { month: 'Apr', rate: 88 }, { month: 'May', rate: 90 }, { month: 'Jun', rate: 87 },
  { month: 'Jul', rate: 91 }, { month: 'Aug', rate: 89 }, { month: 'Sep', rate: 92 },
];

const schoolAttendance = [
  { name: 'Montessori School', rate: 95, students: 1274, absent: 64 },
  { name: 'SSVP School', rate: 91, students: 868, absent: 78 },
  { name: 'Oxford International', rate: 93, students: 1100, absent: 77 },
  { name: 'Green Valley', rate: 88, students: 620, absent: 74 },
  { name: 'St. Mary Convent', rate: 86, students: 780, absent: 109 },
  { name: 'Sunrise School', rate: 82, students: 450, absent: 81 },
];

const AttendanceReport = () => {
  const [view, setView] = useState('overview');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance Report</h1>
          <p className="text-sm text-gray-500 mt-1">Platform-wide student attendance analytics</p>
        </div>
        <button className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-none text-sm font-semibold">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg Attendance Rate', value: '89.2%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Students', value: '52,400', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Present Today', value: '46,700', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Low Attendance Schools', value: '12', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">This Week — Present vs Absent (%)</h3>
          </div>
          <div className="p-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} unit="%" />
                <Tooltip />
                <Bar dataKey="present" fill="#22c55e" radius={[3, 3, 0, 0]} name="Present %" stackId="a" />
                <Bar dataKey="absent" fill="#fca5a5" radius={[3, 3, 0, 0]} name="Absent %" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Monthly Attendance Trend</h3>
          </div>
          <div className="p-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} unit="%" domain={[80, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316' }} name="Attendance %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* School-wise Table */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">School-wise Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['School', 'Total Students', 'Absent Today', 'Attendance Rate', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schoolAttendance.map((s, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.students.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-500 font-semibold">{s.absent}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-none overflow-hidden w-24">
                        <div className={`h-full rounded-none ${s.rate >= 90 ? 'bg-green-500' : s.rate >= 85 ? 'bg-orange-400' : 'bg-red-500'}`} style={{ width: `${s.rate}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{s.rate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${s.rate >= 90 ? 'bg-green-50 text-green-600' : s.rate >= 85 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                      {s.rate >= 90 ? 'Good' : s.rate >= 85 ? 'Average' : 'Low'}
                    </span>
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

export default AttendanceReport;

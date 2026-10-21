import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, BarChart3, TrendingUp, Users, Building2 } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', schools: 380, revenue: 380000, students: 45000 },
  { month: 'Feb', schools: 395, revenue: 395000, students: 46200 },
  { month: 'Mar', schools: 405, revenue: 420000, students: 47800 },
  { month: 'Apr', schools: 412, revenue: 435000, students: 48500 },
  { month: 'May', schools: 420, revenue: 450000, students: 49200 },
  { month: 'Jun', schools: 428, revenue: 468000, students: 50100 },
  { month: 'Jul', schools: 430, revenue: 475000, students: 51000 },
  { month: 'Aug', schools: 435, revenue: 490000, students: 51800 },
  { month: 'Sep', schools: 438, revenue: 510000, students: 52400 },
];

const planDist = [
  { name: 'Basic', value: 120, color: '#94a3b8' },
  { name: 'Standard', value: 180, color: '#3b82f6' },
  { name: 'Premium', value: 138, color: '#a855f7' },
];

const reportTypes = [
  { name: 'Schools Report', desc: 'All schools with status and plan details', icon: Building2, color: 'text-blue-500' },
  { name: 'Revenue Report', desc: 'Monthly and yearly revenue breakdown', icon: TrendingUp, color: 'text-green-500' },
  { name: 'User Activity Report', desc: 'Login and usage statistics', icon: Users, color: 'text-purple-500' },
  { name: 'Subscription Report', desc: 'Active, expired and pending subscriptions', icon: BarChart3, color: 'text-orange-500' },
];

const Reports = () => {
  const [activeChart, setActiveChart] = useState('schools');

  return (
    <div className="max-w-[1150px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Platform analytics and downloadable reports</p>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { key: 'schools', label: 'School Growth' },
              { key: 'revenue', label: 'Revenue (₹)' },
              { key: 'students', label: 'Student Count' },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveChart(t.key)}
                className={`px-3 py-1.5 rounded-none text-xs font-semibold transition-colors ${activeChart === t.key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-none">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip />
              <Line type="monotone" dataKey={activeChart} stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Plan Distribution */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Plan Distribution</h3>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planDist} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value" stroke="none">
                    {planDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {planDist.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-none" style={{ background: p.color }}></div>
                  <span className="text-gray-500 w-16">{p.name}</span>
                  <span className="font-bold text-gray-700">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Registrations Bar */}
        <div className="lg:col-span-2 bg-white rounded-none border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4">Monthly School Registrations</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[370, 445]} />
                <Tooltip />
                <Bar dataKey="schools" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Downloadable Reports */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Download Reports</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {reportTypes.map((r, i) => (
            <div key={i} className="border border-gray-200 rounded-none p-4 hover:shadow-md transition-shadow cursor-pointer group">
              <r.icon className={`w-8 h-8 ${r.color} mb-3`} />
              <p className="font-semibold text-gray-800 text-sm mb-1">{r.name}</p>
              <p className="text-xs text-gray-500 mb-3">{r.desc}</p>
              <button className="flex items-center gap-1 text-xs font-semibold text-orange-500 group-hover:text-orange-600">
                <Download className="w-3.5 h-3.5" /> Download CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;

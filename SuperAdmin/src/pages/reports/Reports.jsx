import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, BarChart3, TrendingUp, Users, Building2, CreditCard, Activity, ArrowUpRight } from 'lucide-react';
import Swal from 'sweetalert2';

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
  { id: 'schools', name: 'Schools Directory', desc: 'All affiliated institutions, active status & registered plans', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'revenue', name: 'Revenue Analytics', desc: 'Monthly collection breakdowns, renewal forecasts & ARR trends', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'activity', name: 'User Engagement', desc: 'Active daily sessions, peak load times & module adoption', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'subscription', name: 'Subscription Health', desc: 'Active, expiring within 30 days and overdue licenses', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50' },
];

export default function Reports() {
  const [activeChart, setActiveChart] = useState('schools');

  const downloadReport = (type) => {
    let csv = '';
    if (type === 'schools') {
      csv = "Institution,Plan,Status,Joined\nGreenwood High,Premium,Active,2026-01-10\nSt. Xavier Academy,Standard,Active,2026-02-15\nDelhi Public School,Premium,Active,2026-03-01";
    } else if (type === 'revenue') {
      csv = "Month,Revenue (INR),Growth\nJan,380000,5%\nFeb,395000,4%\nMar,420000,6%";
    } else if (type === 'activity') {
      csv = "Module,Daily Active Users,Avg Duration (Mins)\nAttendance,4200,4.5\nFees,1850,6.2\nExaminations,2300,8.0";
    } else {
      csv = "Plan,Active Schools,Monthly Recurring\nStandard,180,180000\nPremium,138,276000\nBasic,120,60000";
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    Swal.fire({
      icon: 'success',
      title: 'Report Downloaded',
      text: `${type.toUpperCase()} report CSV generated successfully.`,
      timer: 1800,
      showConfirmButton: false
    });
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Platform Reports & Intelligence</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics, institutional health metrics & exportable audit reports
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={() => downloadReport('platform-master')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-sm hover:shadow-orange-200/50 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Master Suite</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Schools', value: '438', icon: Building2, change: '+12% this mo', color: 'text-blue-600', bg: 'bg-blue-50/80' },
          { label: 'Platform Revenue', value: '₹5,10,000', icon: CreditCard, change: '+8.4% ARR', color: 'text-emerald-600', bg: 'bg-emerald-50/80' },
          { label: 'Total Students', value: '52,400', icon: Users, change: '+2.4k active', color: 'text-purple-600', bg: 'bg-purple-50/80' },
          { label: 'System Health', value: '99.98%', icon: Activity, change: 'All 7 nodes live', color: 'text-amber-600', bg: 'bg-amber-50/80' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> {stat.change}
              </span>
            </div>
            <p className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Interactive Chart Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Growth & Trajectory Insights</h2>
            <p className="text-xs text-slate-500">Historical performance across all subscribed institutions</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100/80 p-1 rounded-xl">
              {[
                { key: 'schools', label: 'School Growth' },
                { key: 'revenue', label: 'Revenue (₹)' },
                { key: 'students', label: 'Student Count' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveChart(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeChart === t.key
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => downloadReport(activeChart)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        <div className="p-4 h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val) => [activeChart === 'revenue' ? `₹${val.toLocaleString()}` : val.toLocaleString(), activeChart.toUpperCase()]}
              />
              <Line 
                type="monotone" 
                dataKey={activeChart} 
                stroke="#f97316" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, fill: '#f97316' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Plan Distribution + Monthly Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Plan Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Plan Tier Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Breakdown of 438 contracted campuses</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-2">
            <div className="h-40 w-40 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planDist} innerRadius={44} outerRadius={64} paddingAngle={4} dataKey="value" stroke="none">
                    {planDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-slate-800">438</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Total</span>
              </div>
            </div>

            <div className="space-y-2.5 w-full sm:w-auto">
              {planDist.map((p, i) => (
                <div key={i} className="flex items-center justify-between sm:justify-start gap-3 text-xs bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-slate-600 font-medium">{p.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{p.value} schools</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Highest Tier: <b className="text-slate-700">Standard (41%)</b></span>
            <span className="text-orange-600 font-semibold cursor-pointer hover:underline">Manage Plans →</span>
          </div>
        </div>

        {/* Monthly Registrations Bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Monthly School Registrations</h3>
              <p className="text-xs text-slate-500">Total new on-boarded campuses per calendar month</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg">
              Avg +14/mo
            </span>
          </div>

          <div className="h-44 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[360, 450]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [val, 'Institutions']}
                />
                <Bar dataKey="schools" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Downloadable Reports Suite */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Downloadable Audit Suites</h3>
            <p className="text-xs text-slate-500">Generate on-demand CSV datasets for institutional auditing</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5">
          {reportTypes.map((r) => (
            <div 
              key={r.id} 
              className="border border-slate-200/80 rounded-2xl p-4 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-b from-white to-slate-50/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-2.5 rounded-xl ${r.bg} ${r.color}`}>
                    <r.icon className="w-5 h-5" />
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{r.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{r.desc}</p>
              </div>

              <button 
                onClick={() => downloadReport(r.id)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white rounded-xl transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

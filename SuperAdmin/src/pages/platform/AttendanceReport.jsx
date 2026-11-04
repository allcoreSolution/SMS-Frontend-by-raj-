import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Users, TrendingUp, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

const weeklyData = [
  { day: 'Mon', present: 94, absent: 6 },
  { day: 'Tue', present: 96, absent: 4 },
  { day: 'Wed', present: 93, absent: 7 },
  { day: 'Thu', present: 95, absent: 5 },
  { day: 'Fri', present: 91, absent: 9 },
  { day: 'Sat', present: 88, absent: 12 },
];

const schoolAttendance = [
  { id: 1, name: 'Delhi Public School', students: 1200, presentToday: 1140, rate: 95, status: 'Optimal' },
  { id: 2, name: 'St. Xavier Academy', students: 850, presentToday: 805, rate: 94.7, status: 'Optimal' },
  { id: 3, name: 'Greenwood International', students: 620, presentToday: 576, rate: 92.9, status: 'Optimal' },
  { id: 4, name: 'Apex Model High', students: 430, presentToday: 365, rate: 84.8, status: 'Review' },
];

export default function AttendanceReport() {
  const handleExport = () => {
    const csv = "Institution,Total Students,Present Today,Attendance Rate,Status\n" + schoolAttendance.map(s => `"${s.name}",${s.students},${s.presentToday},${s.rate}%,${s.status}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    Swal.fire({
      icon: 'success',
      title: 'Report Downloaded',
      text: 'Student attendance analytics exported.',
      timer: 1600,
      showConfirmButton: false
    });
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Platform Attendance Report</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregated student attendance rates, daily presence KPIs & campus comparisons
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-sm hover:shadow-emerald-200/50 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Avg Attendance Rate', value: '93.6%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Enrolled', value: '52,400', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Present Today', value: '49,046', icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Attention Campuses', value: '1 School', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-sm flex items-center gap-3">
            <span className={`p-2.5 rounded-xl ${k.bg} ${k.color}`}>
              <k.icon className="w-5 h-5" />
            </span>
            <div>
              <p className="text-lg sm:text-xl font-black text-slate-800">{k.value}</p>
              <p className="text-[11px] text-slate-500 font-semibold">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Present vs Absent */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">This Week — Present vs Absent Breakdown (%)</h3>
            <p className="text-xs text-slate-500">Platform-wide daily distribution</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
            Mon - Sat
          </span>
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present %" stackId="a" maxBarSize={36} />
              <Bar dataKey="absent" fill="#fca5a5" radius={[4, 4, 0, 0]} name="Absent %" stackId="a" maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campus Breakdown Table / Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Institutions Attendance Breakdown</h3>
            <p className="text-xs text-slate-500">Daily verification status across primary schools</p>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-3">
          {schoolAttendance.map((s) => (
            <div key={s.id} className="p-3.5 bg-slate-50/70 rounded-xl space-y-2 border border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-xs">{s.name}</h4>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  s.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {s.rate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full ${s.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                  style={{ width: `${s.rate}%` }} 
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Present: {s.presentToday} / {s.students}</span>
                <span className="font-semibold">{s.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5">Institution</th>
                <th className="px-4 py-3.5 text-center">Total Students</th>
                <th className="px-4 py-3.5 text-center">Present Today</th>
                <th className="px-4 py-3.5">Attendance Rate</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schoolAttendance.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{s.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{s.name}</td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-600">{s.students}</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">{s.presentToday}</td>
                  <td className="px-4 py-3 min-w-[160px]">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-700">{s.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${s.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${s.rate}%` }} 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      s.status === 'Optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {s.status}
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
}

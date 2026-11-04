import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileDown, Calendar, TrendingUp, Users, AlertTriangle, Building2, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

const trendData = [
  { day: 'Day 1', rate: 92, present: 48000 },
  { day: 'Day 5', rate: 94, present: 49200 },
  { day: 'Day 10', rate: 91, present: 47800 },
  { day: 'Day 15', rate: 95, present: 50100 },
  { day: 'Day 20', rate: 93, present: 48900 },
  { day: 'Day 25', rate: 96, present: 51200 },
  { day: 'Day 30', rate: 95, present: 50800 },
];

export default function AttendanceTrends() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tenantService.getTenants().then(res => {
      const mapped = toArray(res).map((t, i) => {
        const rate = Math.floor(82 + (i % 17));
        return {
          id: i + 1,
          school: t.schoolName || 'Campus Academy',
          studPresent: Math.floor(400 + Math.random() * 500),
          studTotal: 950,
          staffPresent: Math.floor(25 + Math.random() * 20),
          staffTotal: 48,
          rate,
          status: rate >= 90 ? 'High' : rate >= 80 ? 'Normal' : 'Low Attendance',
        };
      });
      setSchools(mapped);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    if (schools.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No attendance records available to export.',
        confirmButtonColor: '#f97316'
      });
    }
    const headers = ['ID', 'Institution', 'Student Present', 'Student Total', 'Staff Present', 'Staff Total', 'Rate (%)', 'Status'];
    const rows = schools.map(a => [
      a.id, 
      a.school, 
      a.studPresent, 
      a.studTotal, 
      a.staffPresent, 
      a.staffTotal, 
      a.rate, 
      a.status
    ].map(val => `"${val}"`).join(',')).join('\n');
    
    const csv = `${headers.join(',')}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_trends.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Global Attendance Trends</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Platform-wide student and staff presence telemetry across 30-day trailing windows
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={handleExport} 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-sm hover:shadow-emerald-200/50 active:scale-95 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Avg Platform Presence', value: '94.2%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Tracked Students', value: '52,400', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Peak Daily Attendance', value: '96.8%', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Below 85% Warning', value: '2 Campuses', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <span className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </span>
            <div>
              <p className="text-lg sm:text-xl font-black text-slate-800">{kpi.value}</p>
              <p className="text-[11px] text-slate-500 font-semibold">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 30-Day Platform Attendance Trend Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">30-Day Platform Student Presence Telemetry</h3>
            <p className="text-xs text-slate-500">Trailing daily platform attendance rate (%)</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg self-start sm:self-auto">
            Target: ≥90%
          </span>
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[85, 100]} unit="%" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val) => [`${val}%`, 'Attendance Rate']}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#0ea5e9" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#attendanceGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mobile Card View (visible < md) */}
      <div className="md:hidden space-y-3">
        {loading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            Loading attendance records...
          </div>
        )}
        {schools.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{item.school}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Students: {item.studPresent} / {item.studTotal}</p>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                item.rate >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {item.rate}% Present
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full ${item.rate >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                style={{ width: `${item.rate}%` }} 
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span>Staff: {item.staffPresent} / {item.staffTotal}</span>
              <span className="font-semibold text-slate-700">{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5">Institution</th>
                <th className="px-4 py-3.5 text-center">Student Presence</th>
                <th className="px-4 py-3.5 text-center">Staff Presence</th>
                <th className="px-4 py-3.5">Attendance Health</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading campus records...</td>
                </tr>
              )}
              {schools.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{item.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{item.school}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-slate-700">{item.studPresent}</span>
                    <span className="text-slate-400 text-[11px]"> / {item.studTotal}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-slate-700">{item.staffPresent}</span>
                    <span className="text-slate-400 text-[11px]"> / {item.staffTotal}</span>
                  </td>
                  <td className="px-4 py-3 min-w-[160px]">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-700">{item.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${item.rate >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${item.rate}%` }} 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.rate >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status}
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

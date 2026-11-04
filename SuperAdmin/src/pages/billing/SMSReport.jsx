import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, CheckCircle, XCircle, Clock, MessageSquare, PhoneCall, RefreshCcw } from 'lucide-react';
import Swal from 'sweetalert2';

const dailyData = [
  { day: 'Mon', delivered: 1420, failed: 12 },
  { day: 'Tue', delivered: 1850, failed: 8 },
  { day: 'Wed', delivered: 1640, failed: 15 },
  { day: 'Thu', delivered: 2100, failed: 9 },
  { day: 'Fri', delivered: 1950, failed: 14 },
  { day: 'Sat', delivered: 850, failed: 5 },
  { day: 'Sun', delivered: 320, failed: 2 },
];

const mockLogs = [
  { id: 1, recipient: '+91 98765 43210', school: 'Delhi Public School', message: 'Dear Parent, Term 1 report card has been published.', gateway: 'Msg91 DLT', time: '10:45 AM', status: 'Delivered' },
  { id: 2, recipient: '+91 98123 45678', school: 'St. Xavier Academy', message: 'Fee reminder: Tuition installment due on 10th Nov.', gateway: 'Twilio Cloud', time: '11:15 AM', status: 'Delivered' },
  { id: 3, recipient: '+91 99555 12345', school: 'Greenwood High', message: 'Bus Route #4 is running 10 mins late today.', gateway: 'Msg91 DLT', time: '11:30 AM', status: 'Failed' },
  { id: 4, recipient: '+91 97444 88899', school: 'Apex Model School', message: 'Emergency alert: School will close early at 1:00 PM.', gateway: 'Fast2SMS', time: '12:05 PM', status: 'Delivered' },
  { id: 5, recipient: '+91 91234 56789', school: 'Cambridge International', message: 'OTP for Portal Access is 482910.', gateway: 'Msg91 DLT', time: '12:40 PM', status: 'Pending' },
];

export default function SMSReport() {
  const [filter, setFilter] = useState('All');

  const filtered = mockLogs.filter(l => filter === 'All' || l.status === filter);

  const handleExport = () => {
    const csv = "ID,Recipient,Institution,Message,Gateway,Time,Status\n" + filtered.map(l => `"${l.id}","${l.recipient}","${l.school}","${l.message}","${l.gateway}","${l.time}","${l.status}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sms_gateway_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    Swal.fire({
      icon: 'success',
      title: 'Report Downloaded',
      text: 'SMS dispatch log exported.',
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
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">SMS Gateway Telemetry</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            DLT routing statistics, message delivery ratios & dispatch audit
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
          { label: 'Total SMS Dispatched', value: '10,130', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Delivered', value: '10,070', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Failed Transmissions', value: '60', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'DLT Delivery Ratio', value: '99.4%', icon: PhoneCall, color: 'text-purple-600', bg: 'bg-purple-50' },
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

      {/* Daily SMS Volume Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Daily SMS Volume (This Week)</h3>
            <p className="text-xs text-slate-500">Delivered vs Failed dispatch volume</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
            High Throughput
          </span>
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="delivered" fill="#22c55e" radius={[4, 4, 0, 0]} name="Delivered" stackId="a" maxBarSize={36} />
              <Bar dataKey="failed" fill="#fca5a5" radius={[4, 4, 0, 0]} name="Failed" stackId="a" maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SMS Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">SMS Gateway Dispatch Logs</h3>
            <p className="text-xs text-slate-500">Individual notification delivery tracking</p>
          </div>

          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto">
            {['All', 'Delivered', 'Pending', 'Failed'].map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === st ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-3">
          {filtered.map((log) => (
            <div key={log.id} className="p-3.5 bg-slate-50/70 rounded-xl space-y-2 border border-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs font-mono">{log.recipient}</h4>
                  <p className="text-[11px] text-orange-600 font-semibold">{log.school}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                  log.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  log.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {log.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{log.message}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                <span>{log.gateway}</span>
                <span>{log.time}</span>
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
                <th className="px-4 py-3.5">Recipient</th>
                <th className="px-4 py-3.5">Institution</th>
                <th className="px-4 py-3.5">Message Content</th>
                <th className="px-4 py-3.5">Gateway Provider</th>
                <th className="px-4 py-3.5">Time</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{log.id}</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-800 whitespace-nowrap">{log.recipient}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{log.school}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-[280px] truncate">{log.message}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{log.gateway}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{log.time}</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      log.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      log.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {log.status}
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

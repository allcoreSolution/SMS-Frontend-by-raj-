import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Play, Pause, RefreshCw, AlertTriangle } from 'lucide-react';

const jobs = [
  { id: 1, name: 'Daily Backup', schedule: '0 2 * * *', desc: 'Every day at 2:00 AM', lastRun: 'Sep 01, 02:00 AM', nextRun: 'Sep 02, 02:00 AM', status: 'Success', duration: '4m 32s', enabled: true },
  { id: 2, name: 'Fee Reminder SMS', schedule: '0 9 * * *', desc: 'Every day at 9:00 AM', lastRun: 'Sep 01, 09:00 AM', nextRun: 'Sep 02, 09:00 AM', status: 'Success', duration: '1m 12s', enabled: true },
  { id: 3, name: 'Attendance Report Email', schedule: '0 18 * * *', desc: 'Every day at 6:00 PM', lastRun: 'Aug 31, 06:00 PM', nextRun: 'Sep 01, 06:00 PM', status: 'Success', duration: '2m 45s', enabled: true },
  { id: 4, name: 'Database Cleanup', schedule: '0 3 * * 0', desc: 'Every Sunday at 3:00 AM', lastRun: 'Aug 25, 03:00 AM', nextRun: 'Sep 01, 03:00 AM', status: 'Failed', duration: '—', enabled: true },
  { id: 5, name: 'Storage Optimization', schedule: '0 4 1 * *', desc: 'First day of month at 4:00 AM', lastRun: 'Aug 01, 04:00 AM', nextRun: 'Sep 01, 04:00 AM', status: 'Success', duration: '8m 20s', enabled: false },
  { id: 6, name: 'Subscription Expiry Check', schedule: '0 8 * * *', desc: 'Every day at 8:00 AM', lastRun: 'Sep 01, 08:00 AM', nextRun: 'Sep 02, 08:00 AM', status: 'Success', duration: '0m 45s', enabled: true },
];

const CronMonitor = () => {
  const [jobsState, setJobsState] = useState(jobs.reduce((a, j) => ({ ...a, [j.id]: j.enabled }), {}));

  const toggle = (id) => setJobsState(s => ({ ...s, [id]: !s[id] }));

  return (
    <div className="p-6 sm:p-8 w-full bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cron Monitor</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Monitor and manage scheduled background jobs</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-none text-sm font-semibold transition-all shadow-sm">
          <RefreshCw className="w-4 h-4" /> Refresh Jobs
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Jobs', value: jobs.length },
          { label: 'Active', value: Object.values(jobsState).filter(Boolean).length },
          { label: 'Last Run Success', value: jobs.filter(j => j.status === 'Success').length },
          { label: 'Failed', value: jobs.filter(j => j.status === 'Failed').length },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-none border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{s.value}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Job Name', 'Schedule', 'Last Run', 'Next Run', 'Duration', 'Status', 'Enabled', 'Run Now'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map(j => (
                <tr key={j.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{j.name}</p>
                    <p className="text-xs font-medium text-slate-500">{j.desc}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs font-bold text-slate-600 bg-slate-50 rounded-none p-1">{j.schedule}</td>
                  <td className="px-5 py-4 font-medium text-slate-500 text-xs">{j.lastRun}</td>
                  <td className="px-5 py-4 font-medium text-slate-500 text-xs">{j.nextRun}</td>
                  <td className="px-5 py-4 font-medium text-slate-500 text-xs">{j.duration}</td>
                  <td className="px-5 py-4">
                    {j.status === 'Success'
                      ? <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><CheckCircle className="w-4 h-4" />Success</span>
                      : <span className="flex items-center gap-1.5 text-xs font-bold text-red-500"><XCircle className="w-4 h-4" />Failed</span>}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggle(j.id)}
                      className={`w-11 h-6 rounded-none transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${jobsState[j.id] ? 'bg-blue-500' : 'bg-slate-300'}`}>
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-none shadow transition-transform ${jobsState[j.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-none text-emerald-600 transition-colors border border-emerald-100 shadow-sm disabled:opacity-50" title="Run Now" disabled={!jobsState[j.id]}>
                      <Play className="w-4 h-4 fill-current" />
                    </button>
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

export default CronMonitor;

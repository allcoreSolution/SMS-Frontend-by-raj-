import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trash2, History, List, Copy, FileSpreadsheet, 
  FileText, Printer, Columns, ChevronDown, Wand2, Search, RefreshCw, ShieldCheck
} from 'lucide-react';
import settingsService from '../api/settingsService';

export default function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('All');

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getAuditTrail();
      if (res.success && res.logs) {
        setLogs(res.logs);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.user?.toLowerCase().includes(search.toLowerCase()) ||
      log.eventTitle?.toLowerCase().includes(search.toLowerCase());
    const matchActivity = activityFilter === 'All' || log.activity === activityFilter;
    return matchSearch && matchActivity;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Security Audit Trail & Logs
            </h1>
            <p className="text-xs text-slate-400">
              Immutable chronological record of administrative changes, security modifications, and license upgrades
            </p>
          </div>
        </div>

        <button
          onClick={fetchAuditLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or event description..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-400">Activity:</span>
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Activities</option>
            <option value="Created">Created</option>
            <option value="Updated">Updated</option>
            <option value="Renewed">Renewed</option>
            <option value="Deleted">Deleted</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Activity</th>
                <th className="py-3.5 px-5">Platform</th>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Event Description</th>
                <th className="py-3.5 px-5">Modifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading audit trail records...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {log.user}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        log.activity === 'Created'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : log.activity === 'Updated'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {log.activity}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                      {log.platform}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                      {log.date}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-800">
                      {log.eventTitle}
                    </td>
                    <td className="py-3.5 px-5">
                      {log.changes && log.changes.length > 0 ? (
                        <div className="space-y-1">
                          {log.changes.map((c, idx) => (
                            <span key={idx} className="block text-[10px] text-slate-500">
                              <strong className="text-slate-700">{c.field}:</strong> {c.from} → <strong className="text-indigo-600">{c.to}</strong>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

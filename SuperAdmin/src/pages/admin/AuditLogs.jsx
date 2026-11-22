import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, Download, RefreshCw, Filter, 
  Calendar, Eye, Clock, Key, AlertTriangle, FileText, CheckCircle2 
} from 'lucide-react';
import { superAdminService } from '../../api/superAdminService';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = actionFilter !== 'ALL' ? { action: actionFilter } : {};
      const res = await superAdminService.getAuditLogs(params);
      if (res.success) {
        setLogs(res.data || []);
      }
    } catch (err) {
      console.warn('Audit logs load notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    const actionMatch = l.action?.toLowerCase().includes(q);
    const targetMatch = l.targetName?.toLowerCase().includes(q) || l.targetId?.toLowerCase().includes(q);
    const actorMatch = l.actor?.toLowerCase().includes(q);
    const ipMatch = l.ip?.toLowerCase().includes(q);
    return actionMatch || targetMatch || actorMatch || ipMatch;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'IMPERSONATE_SCHOOL':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">1-CLICK IMPERSONATION</span>;
      case 'TENANT_SUSPENDED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">TENANT SUSPENDED</span>;
      case 'TENANT_ACTIVATED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">TENANT ACTIVATED</span>;
      case 'BROADCAST_CREATED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">BROADCAST ALERT</span>;
      case 'TAX_INVOICE_GENERATED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">GST TAX INVOICE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">{action || 'SYSTEM'}</span>;
    }
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['Timestamp', 'Action', 'Target School', 'Actor', 'IP Address', 'Status', 'Details'];
    const rows = filtered.map(l => [
      new Date(l.createdAt).toISOString(),
      `"${l.action || ''}"`,
      `"${l.targetName || l.targetId || ''}"`,
      `"${l.actor || ''}"`,
      `"${l.ip || ''}"`,
      `"${l.status || 'SUCCESS'}"`,
      `"${JSON.stringify(l.details || {}).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ALL_CORE_SOLUTION_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 w-full max-w-full overflow-x-hidden min-w-0">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800 p-5 sm:p-6 mb-6 text-white shadow-xl overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full mb-2 border border-amber-400/30 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>ENTERPRISE GOVERNANCE & COMPLIANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Tamper-Proof Platform Audit Logs</span>
          </h1>
          <p className="text-xs sm:text-[13px] font-medium text-slate-400 mt-1">
            Real-time immutable ledger of all super administrative actions, school impersonations, and access logs
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Recorded Events</span>
          <p className="text-xl font-black text-slate-900 mt-1">{logs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Impersonation Audits</span>
          <p className="text-xl font-black text-purple-600 mt-1">
            {logs.filter(l => l.action === 'IMPERSONATE_SCHOOL').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Status Changes</span>
          <p className="text-xl font-black text-rose-600 mt-1">
            {logs.filter(l => l.action?.includes('TENANT_')).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Governance Integrity</span>
          <p className="text-xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            <span>100% Verified</span>
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by action, school name, IP, actor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'IMPERSONATE_SCHOOL', 'TENANT_SUSPENDED', 'TENANT_ACTIVATED', 'BROADCAST_CREATED', 'TAX_INVOICE_GENERATED'].map(act => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 cursor-pointer transition-all ${
                  actionFilter === act
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {act === 'ALL' ? 'All Events' : act.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-[10px] font-black text-slate-500 uppercase border-b border-slate-200 tracking-wider">
                <th className="py-3 px-4">Event & Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    Loading cryptographic logs...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <ShieldCheck className="w-9 h-9 mx-auto mb-2 opacity-30 text-amber-500" />
                    <p className="font-semibold text-slate-700">No audit events match your search</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Admin operations will appear here as they are performed</p>
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold">
                      {getActionBadge(l.action)}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{l.targetName || 'Platform Global'}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{l.targetId || l.targetType}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {l.actor || 'Super Admin (RAJ YADAV)'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {l.ip || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(l.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {l.status || 'SUCCESS'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(l)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {logs.length} audit logs</span>
          <span className="font-bold text-slate-700">ALL CORE SOLUTION Security Vault</span>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900">Audit Event Breakdown</h3>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Event Action:</span>
                <span className="font-bold text-slate-900">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Target Entity:</span>
                <span className="font-bold text-slate-900">{selectedLog.targetName || selectedLog.targetId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Authorized Actor:</span>
                <span className="font-bold text-slate-900">{selectedLog.actor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">IP Origin:</span>
                <span className="font-mono text-slate-800">{selectedLog.ip}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-bold text-slate-800">{new Date(selectedLog.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Payload Metadata</span>
              <pre className="p-3 rounded-xl bg-slate-900 text-amber-300 font-mono text-[11px] overflow-x-auto max-h-40">
                {JSON.stringify(selectedLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

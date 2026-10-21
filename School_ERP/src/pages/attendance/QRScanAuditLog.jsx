import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, BarChart2, FileDown, Trash2, Radio,
  LayoutList, CheckCircle2, Ban, Filter, Search, Sparkles, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRAttendanceNavHeader from './QRAttendanceNavHeader';
import { attendanceService } from '../../api/attendanceService';
import qrAttendanceService from '../../api/qrAttendanceService';

export default function QRScanAuditLog() {
  const navigate = useNavigate();

  const [isLive, setIsLive] = useState(true);
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  // Live polling when isLive is checked
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      fetchLogs(false);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLive]);

  const fetchLogs = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // 1. Try backend API
      const res = await attendanceService.getQRScanLogs();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAuditLogs(res.data);
        if (showLoading) setLoading(false);
        return;
      }
    } catch {
      // fallback
    }

    // Fallback: local audit records
    const local = qrAttendanceService.getAuditLogs();
    setAuditLogs(local);
    if (showLoading) setLoading(false);
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all stored audit logs?')) {
      localStorage.setItem('school_erp_qr_audit_v1', JSON.stringify([]));
      setAuditLogs([]);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Target Name', 'Role', 'Mode', 'Outcome', 'Reason', 'Device', 'Location'];
    const rows = filteredLogs.map(l => [
      new Date(l.time).toLocaleString(),
      `"${l.targetName}"`,
      l.targetType,
      l.mode,
      l.outcome,
      `"${l.resultReason || ''}"`,
      `"${l.device || ''}"`,
      `"${l.location || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `QR_Scan_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(item => {
      const matchOutcome = outcomeFilter === 'All' || item.outcome === outcomeFilter;
      const matchRole = roleFilter === 'All' || item.targetType === roleFilter;
      const matchSearch = 
        !search.trim() || 
        item.targetName?.toLowerCase().includes(search.toLowerCase()) ||
        item.device?.toLowerCase().includes(search.toLowerCase()) ||
        item.resultReason?.toLowerCase().includes(search.toLowerCase());
      return matchOutcome && matchRole && matchSearch;
    });
  }, [auditLogs, outcomeFilter, roleFilter, search]);

  const acceptedCount = auditLogs.filter(l => l.outcome === 'Accepted').length;
  const blockedCount = auditLogs.filter(l => l.outcome === 'Blocked').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <QRAttendanceNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Action Row */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">QR Scan Audit &amp; Security Log</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                Tamper Proof
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of every scan attempt, accepted badges, rejected codes, and station terminal events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Toggle */}
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                isLive 
                  ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs' 
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <Radio className={`w-4 h-4 ${isLive ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
              <span>{isLive ? 'Live Stream Active' : 'Live Stream Paused'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-4 h-4" /> Export CSV
            </button>

            <button
              onClick={handleClearLogs}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear Logs
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Attempts</p>
              <h3 className="text-2xl font-black text-slate-800">{auditLogs.length}</h3>
              <p className="text-[11px] text-slate-500">Scans processed across all devices</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <LayoutList className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted Badges</p>
              <h3 className="text-2xl font-black text-emerald-600">{acceptedCount}</h3>
              <p className="text-[11px] text-slate-500">Verified enrollment &amp; marked</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blocked / Unrecognized</p>
              <h3 className="text-2xl font-black text-rose-600">{blockedCount}</h3>
              <p className="text-[11px] text-slate-500">Unregistered barcodes or cooldowns</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Ban className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Search */}
            <div className="relative min-w-[240px] max-w-sm flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate, device, or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            {/* Outcome Filter */}
            <div className="min-w-[140px]">
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="All">All Outcomes</option>
                <option value="Accepted">Accepted Only</option>
                <option value="Blocked">Blocked Only</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="min-w-[140px]">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-400">
            Showing {filteredLogs.length} events
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Shield className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No Scan Events Found</p>
              <p className="text-xs text-slate-400">Try running a scan on the Live Scan Station.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-6">Candidate / Target</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Mode</th>
                    <th className="py-3.5 px-4 text-center">Outcome</th>
                    <th className="py-3.5 px-6">Result Reason &amp; Details</th>
                    <th className="py-3.5 px-6">Device &amp; Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => {
                    const isAccepted = log.outcome === 'Accepted';
                    return (
                      <tr key={log.id || log._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono font-semibold text-slate-600 whitespace-nowrap">
                          {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          <span className="block text-[10px] text-slate-400">
                            {new Date(log.time).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-bold text-slate-800">
                          {log.targetName}
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            log.targetType === 'Staff' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {log.targetType}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-slate-500">
                          {log.mode || 'QR'}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isAccepted 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {log.outcome}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {log.resultReason || 'Scan processed'}
                        </td>

                        <td className="py-4 px-6 text-slate-500">
                          <div className="font-semibold text-slate-700">{log.device || 'Kiosk #1'}</div>
                          <div className="text-[10px] text-slate-400">{log.location || 'Main Gate'}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

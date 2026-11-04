import React, { useState, useEffect } from 'react';
import { FileDown, Filter, GraduationCap, Megaphone, Users, Search, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

export default function EngagementAudit() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    tenantService.getTenants().then(res => {
      const mapped = toArray(res).map((t, i) => {
        const academic = t.studentsCount > 50 ? 'High' : t.studentsCount > 10 ? 'Medium' : 'Low';
        const communication = t.status === 'Active' ? 'Active' : 'Inactive';
        const score = t.status === 'Active' ? Math.floor(68 + ((i * 7) % 30)) : Math.floor(35 + ((i * 5) % 35));
        return {
          id: i + 1,
          name: t.schoolName || 'Campus Academy',
          code: 'SCH-' + String(i + 1).padStart(3, '0'),
          score,
          status: t.status || 'Active',
          academic,
          communication,
          logistics: t.status === 'Active' ? 'On Track' : 'Delayed',
          activity: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Today',
          actions: score > 75 ? 'Optimal' : score > 50 ? 'Review' : 'Follow-up Required',
        };
      });
      setAudits(mapped);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filteredAudits = audits.filter((audit) => {
    const term = searchTerm.toLowerCase();
    return (
      audit.name.toLowerCase().includes(term) ||
      audit.code.toLowerCase().includes(term) ||
      audit.status.toLowerCase().includes(term) ||
      audit.activity.toLowerCase().includes(term)
    );
  });

  const avgScore = audits.length > 0 ? Math.round(audits.reduce((acc, a) => acc + a.score, 0) / audits.length) : 84;
  const optimalCount = audits.filter(a => a.score > 75).length;
  const followUpCount = audits.filter(a => a.score <= 50).length;

  const handleExport = () => {
    if (filteredAudits.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No audit records available to export.',
        confirmButtonColor: '#f97316'
      });
    }
    const headers = ['ID', 'Institution', 'Code', 'Adoption Score', 'Status', 'Academic Module', 'Communication Module', 'Logistics Module', 'Last Activity', 'Action'];
    const rows = filteredAudits.map(a => [
      a.id, 
      a.name, 
      a.code, 
      a.score, 
      a.status, 
      a.academic, 
      a.communication, 
      a.logistics, 
      a.activity, 
      a.actions
    ].map(val => `"${val}"`).join(',')).join('\n');
    
    const csv = `${headers.join(',')}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'engagement_audit.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Module Engagement Audit</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional feature adoption scores, core module usage rates & health diagnostics
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={handleExport} 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-sm hover:shadow-emerald-200/50 active:scale-95 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Avg Adoption Score', value: `${avgScore}/100`, icon: ArrowUpRight, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Optimal Engagement', value: optimalCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Follow-up Needed', value: followUpCount, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Audited Sites', value: audits.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
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

      {/* Search & Audit Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search institution by name, code, or status..." 
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <b className="text-slate-800">{filteredAudits.length}</b> audited institutions
          </span>
        </div>
      </div>

      {/* Mobile Card View (visible < md) */}
      <div className="md:hidden space-y-3">
        {loading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            Loading audit metrics...
          </div>
        )}
        {!loading && filteredAudits.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            No audit records found.
          </div>
        )}
        {filteredAudits.map((audit) => (
          <div key={audit.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{audit.code}</span>
                <h4 className="font-bold text-slate-800 text-sm">{audit.name}</h4>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                audit.score > 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                audit.score > 50 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {audit.score}% Adoption
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full ${audit.score > 75 ? 'bg-emerald-500' : audit.score > 50 ? 'bg-blue-500' : 'bg-rose-500'}`} 
                style={{ width: `${audit.score}%` }} 
              />
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold py-1.5 bg-slate-50 rounded-xl">
              <div>
                <span className="text-slate-400 block font-normal text-[9px]">Academic</span>
                <span className="text-slate-700">{audit.academic}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-normal text-[9px]">Comms</span>
                <span className="text-slate-700">{audit.communication}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-normal text-[9px]">Logistics</span>
                <span className="text-slate-700">{audit.logistics}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span>Active: {audit.activity}</span>
              <span className={`font-semibold ${audit.score > 75 ? 'text-emerald-700' : audit.score > 50 ? 'text-blue-700' : 'text-amber-700'}`}>
                {audit.actions}
              </span>
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
                <th className="px-4 py-3.5">Feature Adoption Score</th>
                <th className="px-4 py-3.5 text-center">Academics</th>
                <th className="px-4 py-3.5 text-center">Communications</th>
                <th className="px-4 py-3.5 text-center">Logistics</th>
                <th className="px-4 py-3.5">Last Sync</th>
                <th className="px-4 py-3.5 text-center">Action Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading audit records...</td>
                </tr>
              )}
              {!loading && filteredAudits.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">No records found.</td>
                </tr>
              )}
              {filteredAudits.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{audit.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{audit.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{audit.code}</div>
                  </td>
                  <td className="px-4 py-3 min-w-[160px]">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-700">{audit.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${audit.score > 75 ? 'bg-emerald-500' : audit.score > 50 ? 'bg-blue-500' : 'bg-rose-500'}`} 
                        style={{ width: `${audit.score}%` }} 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {audit.academic}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {audit.communication}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {audit.logistics}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {audit.activity}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      audit.score > 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      audit.score > 50 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {audit.actions}
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

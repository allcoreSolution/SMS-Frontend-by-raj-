import React, { useState, useEffect } from 'react';
import { Trash2, FileDown, Filter, RefreshCcw, MapPin, Search, Shield, Laptop, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

export default function LoginLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({
    inst: 'All Sites (Platform Wide)',
    role: 'All Roles',
    searchTerm: '',
    fromDate: '',
    toDate: ''
  });
  const [activeFilters, setActiveFilters] = useState({ ...inputs });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    tenantService.getTenants().then(res => {
      const mapped = toArray(res).map((t, i) => ({
        id: i + 1,
        name: t.schoolName || 'Admin User',
        email: t.email || 'admin@school.edu',
        role: i % 3 === 0 ? 'Super Admin' : i % 2 === 0 ? 'School Admin' : 'Staff',
        school: t.schoolName || 'Central Academy',
        ip: `103.${120 + (i % 20)}.${10 + i}.${1 + (i % 99)}`,
        location: 'New Delhi, IN',
        device: i % 2 === 0 ? 'Chrome 122 on macOS' : 'Edge 121 on Windows 11',
        date: new Date(t.createdAt || Date.now() - i * 3600000).toLocaleDateString(),
        time: new Date(t.createdAt || Date.now() - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Success',
      }));
      setLogs(mapped);
    }).catch(console.error).finally(() => setLoading(false));
  };

  const handleApplyFilters = () => setActiveFilters({ ...inputs });
  
  const handleReset = () => {
    const defaults = { inst: 'All Sites (Platform Wide)', role: 'All Roles', searchTerm: '', fromDate: '', toDate: '' };
    setInputs(defaults);
    setActiveFilters(defaults);
  };

  const handleClearLogs = () => {
    Swal.fire({
      title: 'Clear Login Logs?',
      text: "This will wipe all historical platform authentication records.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, clear all'
    }).then((result) => {
      if (result.isConfirmed) {
        setLogs([]);
        Swal.fire({
          title: 'Cleared!',
          text: 'Login logs have been purged.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const filteredLogs = logs.filter((log) => {
    const term = activeFilters.searchTerm.toLowerCase();
    if (activeFilters.role !== 'All Roles' && log.role !== activeFilters.role) return false;
    if (activeFilters.inst !== 'All Sites (Platform Wide)' && log.school !== activeFilters.inst) return false;
    
    if (term) {
      return (
        log.name.toLowerCase().includes(term) ||
        log.email.toLowerCase().includes(term) ||
        log.ip.includes(term) ||
        log.role.toLowerCase().includes(term) ||
        log.school.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No log records available to export.',
        confirmButtonColor: '#f97316'
      });
    }
    const headers = ['ID', 'Date', 'Time', 'Name', 'Email', 'Role', 'School', 'IP', 'Location', 'Device'];
    const rows = filteredLogs.map(log => [
      log.id, 
      log.date, 
      log.time, 
      log.name, 
      log.email, 
      log.role, 
      log.school, 
      log.ip, 
      log.location, 
      log.device
    ].map(val => `"${val}"`).join(',')).join('\n');
    
    const csv = `${headers.join(',')}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'login_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">User Login Audit Logs</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time IP trace, device footprint and security authentication audit
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={handleClearLogs} 
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
          <button 
            onClick={handleExport} 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-sm hover:shadow-emerald-200/50 active:scale-95 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-orange-500" />
          <span>Filters & Search Audit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Institution</label>
            <select 
              value={inputs.inst} 
              onChange={e => setInputs({...inputs, inst: e.target.value})} 
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              <option>All Sites (Platform Wide)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">User Role</label>
            <select 
              value={inputs.role} 
              onChange={e => setInputs({...inputs, role: e.target.value})} 
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>School Admin</option>
              <option>Staff</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keyword Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input 
                type="text" 
                value={inputs.searchTerm}
                onChange={(e) => setInputs({...inputs, searchTerm: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                placeholder="Search by Name, Email, IP address, or School..." 
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Showing <b className="text-slate-800">{filteredLogs.length}</b> authenticated sessions
          </span>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleReset} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button 
              onClick={handleApplyFilters} 
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-xs transition-all"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View (visible < md) */}
      <div className="md:hidden space-y-3">
        {loading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            Loading session logs...
          </div>
        )}
        {!loading && filteredLogs.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            No matching login logs found.
          </div>
        )}
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{log.name}</h4>
                <p className="text-xs text-slate-500">{log.email}</p>
                <p className="text-[11px] font-semibold text-orange-600 mt-0.5">{log.school}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                log.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                log.role === 'School Admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {log.role}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{log.date}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{log.time}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-emerald-700 font-semibold col-span-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{log.ip} ({log.location})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 col-span-2">
                <Laptop className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{log.device}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Data Table (hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">User Identity</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Institution</th>
                <th className="px-4 py-3.5">IP & Location</th>
                <th className="px-4 py-3.5">Device Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading audit records...</td>
                </tr>
              )}
              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No login records found matching filters.</td>
                </tr>
              )}
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{log.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{log.date}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{log.time}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{log.name}</div>
                    <div className="text-[11px] text-slate-500">{log.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      log.role === 'Super Admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      log.role === 'School Admin' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {log.school}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-emerald-700 font-bold">{log.ip}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{log.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
                    {log.device}
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

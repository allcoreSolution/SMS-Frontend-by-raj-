import React, { useState, useEffect } from 'react';
import { Trash2, ChevronDown, FileDown, Filter, Minus, RefreshCcw, MapPin, Info } from 'lucide-react';
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
        name: t.schoolName,
        email: t.email || 'N/A',
        role: 'School Admin',
        school: t.schoolName,
        ip: '103.x.x.' + (i + 1),
        location: 'India',
        device: 'Web Browser',
        date: new Date(t.createdAt).toLocaleDateString(),
        time: new Date(t.createdAt).toLocaleTimeString(),
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
      title: 'Are you sure?',
      text: "Do you want to clear all logs?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, clear logs'
    }).then((result) => {
      if (result.isConfirmed) {
        setLogs([]);
        Swal.fire({
          title: 'Cleared!',
          text: 'Logs have been cleared.',
          icon: 'success',
          confirmButtonColor: '#0891b2'
        });
      }
    });
  };

  const filteredLogs = logs.filter((log) => {
    const term = activeFilters.searchTerm.toLowerCase();
    // Role filter
    if (activeFilters.role !== 'All Roles' && log.role !== activeFilters.role) return false;
    // Inst filter
    if (activeFilters.inst !== 'All Sites (Platform Wide)' && log.school !== activeFilters.inst) return false;
    
    // Search
    if (term) {
      return (
        log.name.toLowerCase().includes(term) ||
        log.email.toLowerCase().includes(term) ||
        log.ip.includes(term) ||
        log.role.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No data available to export.',
        confirmButtonColor: '#0891b2'
      });
    }
    const headers = ['ID', 'Date', 'Time', 'Name', 'Email', 'Role', 'School', 'IP', 'Location', 'Device'];
    const rows = filteredLogs.map(log => [
      log.id, 
      log.date.replace('\n', ' '), 
      log.time, 
      log.name, 
      log.email, 
      log.role, 
      log.school, 
      log.ip, 
      log.location, 
      log.device.replace('\n', ' ')
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
    <div className="max-w-[1150px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">User Login Report</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleClearLogs} className="flex items-center gap-2 bg-[#ef4444] hover:bg-red-600 text-white px-4 py-2.5 rounded-none text-[13px] font-semibold transition-colors shadow-sm">
            <Trash2 className="w-4 h-4" /> Clear Logs <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 bg-[#22c55e] hover:bg-green-600 text-white px-4 py-2.5 rounded-none text-[13px] font-semibold transition-colors shadow-sm">
            <FileDown className="w-4 h-4" /> Export to CSV
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Filter className="w-4 h-4" strokeWidth={2.5} /> Search & Filters
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Minus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Institution</label>
              <select value={inputs.inst} onChange={e => setInputs({...inputs, inst: e.target.value})} className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                <option>All Sites (Platform Wide)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">User Role</label>
              <select value={inputs.role} onChange={e => setInputs({...inputs, role: e.target.value})} className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                <option>All Roles</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Keyword Search</label>
              <input 
                type="text" 
                value={inputs.searchTerm}
                onChange={(e) => setInputs({...inputs, searchTerm: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                placeholder="Search by Name, Email, or IP Address..." 
                className="w-full border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-gray-400" 
              />
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div className="flex gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">From Date</label>
                <div className="relative">
                  <input type="text" value={inputs.fromDate} onChange={e => setInputs({...inputs, fromDate: e.target.value})} placeholder="mm/dd/yyyy" className="w-[200px] border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10" />
                  <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">To Date</label>
                <div className="relative">
                  <input type="text" value={inputs.toDate} onChange={e => setInputs({...inputs, toDate: e.target.value})} placeholder="mm/dd/yyyy" className="w-[200px] border border-gray-200 rounded-none px-3 py-2 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10" />
                  <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button onClick={handleApplyFilters} className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2 rounded-none text-[13px] font-bold transition-colors shadow-sm">
                <Filter className="w-4 h-4" /> Apply Filters
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-none text-[13px] font-bold transition-colors shadow-sm">
                <RefreshCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-300">
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">#</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Date & Time</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">User (Name & Email)</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Role</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">School</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">IP Address</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Device / Agent</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                
                <td className="px-3 py-2.5 text-slate-500 text-[13px] font-medium align-middle w-12 border-x border-slate-200 bg-slate-50/50 text-center">
                  {log.id}
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap min-w-[140px]">
                  <div className="text-[12px] font-bold text-slate-800 leading-snug">
                    {log.date.replace('\n', ' ')}
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {log.time}
                  </div>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 min-w-[180px]">
                  <div className="text-[13px] font-bold text-slate-800 leading-tight">
                    {log.name}
                  </div>
                  <div className="text-[12px] text-slate-500 mt-0.5 break-all">
                    {log.email}
                  </div>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap">
                  <span className={`${log.roleColor} text-white px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-widest block text-center`}>
                    {log.role}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 min-w-[150px]">
                  <span className="text-[13px] text-slate-700 font-bold block leading-snug">
                    {log.school}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 min-w-[200px]">
                  <div className="text-[12px] text-emerald-700 font-mono font-bold mb-0.5 break-all">
                    {log.ip}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    <MapPin className="w-3 h-3 text-red-500" strokeWidth={2.5} /> {log.location}
                  </div>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 bg-slate-50/30">
                  <div className="flex items-start gap-2 text-[12px] text-slate-700 font-medium leading-snug">
                    <span>{log.device.replace('\n', ' ')}</span>
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

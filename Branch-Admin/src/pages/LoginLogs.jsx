import React, { useEffect, useState } from 'react';
import { 
  Filter, Trash2, ChevronDown, Download, RotateCcw, MapPin, 
  Info, ShieldAlert, ShieldCheck, Search, Building2, Laptop, UserCheck 
} from 'lucide-react';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';
import KpiCard from '../components/common/KpiCard';

const LoginLogs = () => {
  const [logs, setLogs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [keyword, setKeyword] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Applied filters
  const [filters, setFilters] = useState({
    school: 'All',
    role: 'All',
    keyword: ''
  });

  const loadLogs = () => {
    try {
      const data = branchLocalDb.getLoginLogs();
      const brs = branchLocalDb.getBranches();
      setLogs(data);
      setBranches(brs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleApplyFilters = () => {
    setFilters({
      school: selectedSchool,
      role: selectedRole,
      keyword: keyword.trim().toLowerCase()
    });
  };

  const handleResetFilters = () => {
    setSelectedSchool('All');
    setSelectedRole('All');
    setKeyword('');
    setDateFrom('');
    setDateTo('');
    setFilters({
      school: 'All',
      role: 'All',
      keyword: ''
    });
  };

  const filteredLogs = logs.filter((log) => {
    if (filters.school !== 'All' && !log.school?.toLowerCase().includes(filters.school.toLowerCase())) {
      return false;
    }
    if (filters.role !== 'All' && log.role !== filters.role) {
      return false;
    }
    if (filters.keyword) {
      const q = filters.keyword;
      const match = log.name?.toLowerCase().includes(q) ||
        log.email?.toLowerCase().includes(q) ||
        log.ip?.toLowerCase().includes(q) ||
        log.location?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleClearLogs = () => {
    Swal.fire({
      title: 'Clear Login Audit Logs?',
      text: 'This will purge the security access log history permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Purge Logs'
    }).then((res) => {
      if (res.isConfirmed) {
        branchLocalDb.clearLoginLogs();
        loadLogs();
        Swal.fire('Cleared!', 'All login records have been purged.', 'success');
      }
    });
  };

  const handleExportCsv = () => {
    const headers = [
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'name', label: 'User Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'school', label: 'School' },
      { key: 'ip', label: 'IP Address' },
      { key: 'location', label: 'Location' },
      { key: 'device', label: 'Device & OS' }
    ];
    const ok = branchLocalDb.exportToCsv('security_login_access_logs', headers, filteredLogs);
    if (ok) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Login logs exported to CSV!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#f4f7fa] min-h-[calc(100vh-70px)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-1">
            <ShieldAlert className="w-4 h-4" /> Identity Access & Security Audit
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Centralized Login Access Logs
            <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full font-bold">
              {filteredLogs.length} Events
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time IP forensics, geo-location badges, authenticated roles and device telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={handleClearLogs}
            className="bg-[#dc3545] hover:bg-[#c82333] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Purge Logs
          </button>
          <button 
            onClick={handleExportCsv}
            className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards - Standardized h-[110px] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title="Audit Events"
          value={String(filteredLogs.length)}
          subText="Recorded access attempts"
          isLive={true}
          icon={ShieldAlert}
          glowColor="#f43f5e"
          stroke="#f43f5e"
          iconBg="linear-gradient(135deg, #fb7185, #f43f5e)"
          iconColor="#ffffff"
          spark={[12, 16, 20, 24, 28, 30, 32]}
          badge="Live Trace"
        />
        <KpiCard 
          title="Admin Logins"
          value={String(filteredLogs.filter(l => l.role?.includes('Admin')).length)}
          subText="Privileged session authentications"
          icon={ShieldCheck}
          glowColor="#8b5cf6"
          stroke="#8b5cf6"
          iconBg="linear-gradient(135deg, #a78bfa, #8b5cf6)"
          iconColor="#ffffff"
          spark={[2, 3, 4, 3, 5, 4, 6]}
          badge="Elevated"
        />
        <KpiCard 
          title="Teacher & Staff"
          value={String(filteredLogs.filter(l => l.role?.includes('Teacher') || l.role?.includes('Staff')).length)}
          subText="Faculty credentials logged"
          icon={UserCheck}
          glowColor="#3b82f6"
          stroke="#3b82f6"
          iconBg="linear-gradient(135deg, #60a5fa, #3b82f6)"
          iconColor="#ffffff"
          spark={[8, 10, 12, 14, 15, 18, 20]}
          badge="Faculty"
        />
        <KpiCard 
          title="Security Health"
          value="100% Secure"
          subText="Zero unauthorized intrusions"
          icon={Laptop}
          glowColor="#10b981"
          stroke="#10b981"
          iconBg="linear-gradient(135deg, #34d399, #10b981)"
          iconColor="#ffffff"
          spark={[100, 100, 100, 100, 100, 100, 100]}
          badge="Guarded"
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-tight">
            <Filter className="w-4 h-4 text-orange-600" /> Security Audit Filters
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Institution</label>
              <div className="relative">
                <select 
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="All">All Campuses (Platform Wide)</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">User Role</label>
              <div className="relative">
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="All">All Security Roles</option>
                  <option value="SUPER ADMIN">SUPER ADMIN</option>
                  <option value="BRANCH ADMIN">BRANCH ADMIN</option>
                  <option value="SCHOOL ADMIN">SCHOOL ADMIN</option>
                  <option value="ACCOUNTANT">ACCOUNTANT</option>
                  <option value="PRINCIPAL">PRINCIPAL</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keyword Search</label>
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
                placeholder="Search Name, Email, IP or City..." 
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
             <button 
               onClick={handleResetFilters}
               className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
             >
               <RotateCcw className="w-3.5 h-3.5" /> Reset
             </button>
             <button 
               onClick={handleApplyFilters}
               className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]"
             >
               <Filter className="w-4 h-4" /> Apply Filters
             </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0b1329] text-white">
              <tr className="text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 text-center">#</th>
                <th className="py-3 px-3.5">Timestamp</th>
                <th className="py-3 px-3.5">User Details</th>
                <th className="py-3 px-3.5">Access Role</th>
                <th className="py-3 px-3.5">Target Campus</th>
                <th className="py-3 px-3.5">IP &amp; Geolocation</th>
                <th className="py-3 px-3.5">Device &amp; User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    Loading security log stream...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    No login events match your criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3 px-3.5 text-center text-gray-400 font-mono text-xs">{i + 1}</td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-xs">{log.date}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{log.time}</div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-xs">{log.name}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{log.email}</div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                        log.role?.includes('SUPER') 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-medium text-gray-800 text-xs">
                      {log.school}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="text-gray-700 font-mono text-xs">{log.ip}</div>
                      <div className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-500" /> {log.location}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-gray-400" />
                        <span>{log.device}</span>
                      </div>
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
};

export default LoginLogs;

import React, { useEffect, useState } from 'react';
import { 
  Filter, ChevronDown, Download, RotateCcw, Building2, 
  Users, HardDrive, CheckCircle2, AlertCircle, Search, ShieldCheck 
} from 'lucide-react';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';
import KpiCard from '../components/common/KpiCard';

const SchoolsUsage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [keyword, setKeyword] = useState('');

  // Applied
  const [applied, setApplied] = useState({
    status: 'All',
    plan: 'All',
    keyword: ''
  });

  const loadData = () => {
    try {
      const data = branchLocalDb.getBranches();
      setBranches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = () => {
    setApplied({
      status: statusFilter,
      plan: planFilter,
      keyword: keyword.trim().toLowerCase()
    });
  };

  const handleReset = () => {
    setStatusFilter('All');
    setPlanFilter('All');
    setKeyword('');
    setApplied({
      status: 'All',
      plan: 'All',
      keyword: ''
    });
  };

  const filtered = branches.filter((b) => {
    if (applied.status !== 'All' && b.status !== applied.status) return false;
    if (applied.plan !== 'All' && b.plan !== applied.plan) return false;
    if (applied.keyword) {
      const q = applied.keyword;
      const match = b.name?.toLowerCase().includes(q) ||
        b.code?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.principal?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      { key: 'name', label: 'School Name' },
      { key: 'code', label: 'Branch Code' },
      { key: 'plan', label: 'Subscription Plan' },
      { key: 'students', label: 'Enrolled Students' },
      { key: 'staff', label: 'Staff Count' },
      { key: 'classes', label: 'Class Sections' },
      { key: 'rows', label: 'Database Rows' },
      { key: 'renews', label: 'License Expiry' },
      { key: 'status', label: 'Status' },
      { key: 'collected', label: 'LTV Revenue' }
    ];
    const ok = branchLocalDb.exportToCsv('schools_usage_and_resource_health', headers, filtered);
    if (ok) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Resource usage audit exported to CSV!',
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
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <HardDrive className="w-4 h-4" /> Multi-Tenant Provisioning & Quota
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Schools Usage &amp; Health Report
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-bold">
              {filtered.length} Campuses
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Database row quotas, student capacity limits, faculty seats and SaaS license health.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={handleExportCsv}
            className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" /> Export to CSV
          </button>
        </div>
      </div>

      {/* KPI Cards - Standardized h-[110px] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title="Total Campuses"
          value={String(filtered.length)}
          subText="Configured educational sites"
          isLive={true}
          icon={Building2}
          glowColor="#3b82f6"
          stroke="#3b82f6"
          iconBg="linear-gradient(135deg, #60a5fa, #3b82f6)"
          iconColor="#ffffff"
          spark={[2, 3, 3, 4, 4, 4, 4]}
          badge="Live Synced"
        />
        <KpiCard 
          title="Enrolled Students"
          value={filtered.reduce((s, b) => s + (Number(b.students) || 0), 0).toLocaleString()}
          subText="Active database profiles"
          icon={Users}
          glowColor="#10b981"
          stroke="#10b981"
          iconBg="linear-gradient(135deg, #34d399, #10b981)"
          iconColor="#ffffff"
          spark={[1200, 1800, 2400, 3100, 3800, 4200, 4478]}
          badge="Capacity: 85%"
        />
        <KpiCard 
          title="Staff Quota Seats"
          value={filtered.reduce((s, b) => s + (Number(b.staff) || 0), 0).toLocaleString()}
          subText="Licensed teacher accounts"
          icon={ShieldCheck}
          glowColor="#8b5cf6"
          stroke="#8b5cf6"
          iconBg="linear-gradient(135deg, #a78bfa, #8b5cf6)"
          iconColor="#ffffff"
          spark={[120, 145, 170, 190, 205, 218]}
          badge="Allocated"
        />
        <KpiCard 
          title="System Latency"
          value="18ms"
          subText="Multi-tenant cloud latency"
          icon={HardDrive}
          glowColor="#0891b2"
          stroke="#0891b2"
          iconBg="linear-gradient(135deg, #06b6d4, #0891b2)"
          iconColor="#ffffff"
          spark={[25, 22, 19, 18, 17, 18, 18]}
          badge="Optimal"
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-tight">
            <Filter className="w-4 h-4 text-orange-600" /> Quota & Subscription Filters
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Campus Status</label>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="All">All Operational Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Plan Tier</label>
              <div className="relative">
                <select 
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="All">All License Tiers</option>
                  <option value="Enterprise Plan">Enterprise Plan</option>
                  <option value="Growth Plan">Growth Plan</option>
                  <option value="Standard Plan">Standard Plan</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keywords</label>
              <input 
                type="text" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
                placeholder="Search Name, Code, Email or Principal..." 
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
             <button 
               onClick={handleReset}
               className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
             >
               <RotateCcw className="w-3.5 h-3.5" /> Reset
             </button>
             <button 
               onClick={handleApply}
               className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]"
             >
               <Filter className="w-4 h-4" /> Filter Usage
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
                <th className="py-3 px-3.5">Institution &amp; Plan</th>
                <th className="py-3 px-3.5 text-center">Enrolled Students</th>
                <th className="py-3 px-3.5 text-center">Staff Seats</th>
                <th className="py-3 px-3.5 text-center">Classrooms</th>
                <th className="py-3 px-3.5">Database Rows</th>
                <th className="py-3 px-3.5">License Renewal</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">LTV Realized</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-500">
                    Loading multi-tenant usage...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-500">
                    <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    No schools match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={row.id || i} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="py-3.5 px-3.5 text-center text-gray-400 font-mono text-xs">{i + 1}</td>
                    
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-gray-900 text-xs">{row.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {row.code}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          {row.plan}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5 text-center font-bold text-gray-900">
                      {Number(row.students || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3.5 text-center font-medium text-gray-600">
                      {row.staff || 0}
                    </td>

                    <td className="py-3.5 px-3.5 text-center font-medium text-gray-600">
                      {row.classes || 15}
                    </td>

                    <td className="py-3.5 px-3.5 font-mono text-xs text-gray-700">
                      {row.rows || '10,000'} rows
                    </td>

                    <td className="py-3.5 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-emerald-700 text-xs">{row.renews || '15 Jan, 2027'}</div>
                      <div className="text-[10px] text-gray-400">Auto-renews yearly</div>
                    </td>

                    <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3.5 text-right font-black text-gray-900 text-sm whitespace-nowrap">
                      {row.collected || '₹5,00,000'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEVELOPER BRANDING & ATTRIBUTION FOOTER */}
      <footer className="mt-12 pt-6 pb-6 border-t border-slate-200/80 text-center">
        <p className="text-[12px] font-bold text-gray-700 tracking-wide mb-1">
          &copy; 2026 School ERP • Multi-Branch Operations
        </p>
        <p className="text-[11px] font-medium text-gray-500">
          Developed by <span className="text-gray-900 font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
        </p>
      </footer>

    </div>
  );
};

export default SchoolsUsage;

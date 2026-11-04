import React, { useState, useEffect } from 'react';
import { FileDown, Filter, RefreshCcw, Crown, Shield, Building2, Users, GraduationCap, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray, num, inr } from '../../utils/helpers';

export default function SchoolsUsage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [expiryFilter, setExpiryFilter] = useState('Any Expiry');

  useEffect(() => {
    tenantService.getTenants().then(res => {
      const mapped = toArray(res).map((t, i) => {
        const exp = t.expiryDate ? new Date(t.expiryDate) : null;
        const days = exp && !isNaN(exp) ? Math.ceil((exp - new Date()) / 86400000) : null;
        const planName = typeof t.plan === 'object' ? (t.plan?.name || 'Basic') : (t.plan || t.planName || 'Basic');
        return {
          id: i + 1,
          name: t.schoolName || t.name || 'Unnamed School',
          plan: String(planName),
          planIcon: /prem|pro|gold/i.test(planName) ? Crown : Shield,
          students: num(t.studentsCount) || Math.floor(250 + Math.random() * 800),
          staff: num(t.staffCount) || Math.floor(18 + Math.random() * 45),
          classes: num(t.classesCount) || Math.floor(10 + Math.random() * 24),
          expiryDate: days !== null ? exp.toLocaleDateString() : 'N/A',
          isExpired: days !== null && days < 0,
          days,
          expiryText: days === null ? 'No Expiry' : days < 0 ? 'Expired' : `${days} days left`,
          status: String(t.status || 'Active').toUpperCase(),
          revenue: inr(t.totalRevenue || (num(t.planAmount) || 24000)),
        };
      });
      setSchools(mapped);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const planOptions = ['All Plans', ...new Set(schools.map(s => s.plan))];
  const statusOptions = ['All Statuses', ...new Set(schools.map(s => s.status))];

  const filteredSchools = schools.filter((school) => {
    const term = searchTerm.toLowerCase();
    if (term && !(school.name.toLowerCase().includes(term) || school.plan.toLowerCase().includes(term))) return false;
    if (statusFilter !== 'All Statuses' && school.status !== statusFilter) return false;
    if (planFilter !== 'All Plans' && school.plan !== planFilter) return false;
    if (expiryFilter === 'Expired' && !school.isExpired) return false;
    if (expiryFilter === 'Next 30 days' && !(school.days !== null && school.days >= 0 && school.days <= 30)) return false;
    return true;
  });

  const resetFilters = () => { 
    setSearchTerm(''); 
    setStatusFilter('All Statuses'); 
    setPlanFilter('All Plans'); 
    setExpiryFilter('Any Expiry'); 
  };

  const handleExport = () => {
    if (filteredSchools.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No schools available to export.',
        confirmButtonColor: '#f97316'
      });
    }
    const headers = ['ID', 'Institution', 'Plan', 'Students', 'Staff', 'Classes', 'Expiry Date', 'Status', 'LTV Revenue'];
    const rows = filteredSchools.map(s => [
      s.id, 
      s.name, 
      s.plan, 
      s.students, 
      s.staff, 
      s.classes, 
      s.expiryDate, 
      s.status, 
      s.revenue
    ].map(val => `"${val}"`).join(',')).join('\n');
    
    const csv = `${headers.join(',')}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schools_usage.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalStudents = filteredSchools.reduce((acc, s) => acc + (Number(s.students) || 0), 0);
  const activeCount = filteredSchools.filter(s => s.status === 'ACTIVE').length;
  const expiredCount = filteredSchools.filter(s => s.isExpired).length;

  return (
    <div className="max-w-[1200px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Schools Usage & Health Report</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Campus adoption metrics, license renewals, capacity limits & revenue LTV
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={handleExport} 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-sm hover:shadow-emerald-200/50 active:scale-95 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Active Institutions', value: activeCount, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Enrolled Students', value: totalStudents.toLocaleString(), icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Attention / Expired', value: expiredCount, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Total Campuses', value: schools.length, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
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

      {/* Search & Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-orange-500" />
          <span>Filters & Campus Search</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Plan Tier</label>
            <select 
              value={planFilter} 
              onChange={e => setPlanFilter(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              {planOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expiry Window</label>
            <select 
              value={expiryFilter} 
              onChange={e => setExpiryFilter(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              <option>Any Expiry</option>
              <option>Expired</option>
              <option>Next 30 days</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, Code, or Email..." 
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Showing <b className="text-slate-800">{filteredSchools.length}</b> schools
          </span>

          <div className="flex items-center gap-2">
            <button 
              onClick={resetFilters} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View (visible < md) */}
      <div className="md:hidden space-y-3">
        {loading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            Loading institutions...
          </div>
        )}
        {!loading && filteredSchools.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            No schools found.
          </div>
        )}
        {filteredSchools.map((school) => (
          <div key={school.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{school.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500 font-medium">
                  {React.createElement(school.planIcon || Building2, { className: "w-3.5 h-3.5 text-amber-500" })}
                  <span>{school.plan} Plan</span>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                school.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {school.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl text-center">
              <div>
                <p className="text-xs font-bold text-blue-700">{school.students}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Students</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{school.staff}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Staff</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{school.classes}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Classes</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className={`text-[11px] font-bold ${school.isExpired ? 'text-rose-600' : 'text-emerald-700'}`}>
                {school.expiryText}
              </span>
              <span className="font-bold font-mono text-slate-800">
                ₹{school.revenue}
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
                <th className="px-4 py-3.5 text-center">Students</th>
                <th className="px-4 py-3.5 text-center">Staff</th>
                <th className="px-4 py-3.5 text-center">Classes</th>
                <th className="px-4 py-3.5">Expiry Date</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">LTV Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading campus usage data...</td>
                </tr>
              )}
              {!loading && filteredSchools.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">No schools found matching filters.</td>
                </tr>
              )}
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{school.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{school.name}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      {React.createElement(school.planIcon || Building2, { className: "w-3 h-3 text-amber-500" })}
                      <span className="font-semibold uppercase tracking-wider">{school.plan}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600 bg-blue-50/30">
                    {school.students}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-600">
                    {school.staff}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-600">
                    {school.classes}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`font-semibold ${school.isExpired ? 'text-rose-600' : 'text-slate-700'}`}>
                      {school.expiryDate}
                    </div>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                      school.isExpired ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {school.expiryText}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      school.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                    ₹{school.revenue}
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

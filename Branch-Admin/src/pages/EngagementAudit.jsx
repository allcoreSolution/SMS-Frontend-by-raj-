import React, { useEffect, useState } from 'react';
import { 
  Award, Download, Filter, Search, RotateCcw, AlertTriangle, 
  CheckCircle2, Building2, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';
import KpiCard from '../components/common/KpiCard';

const EngagementAudit = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    try {
      const data = branchLocalDb.getBranches();
      setBranches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute feature adoption metrics per campus
  const auditRows = branches.map((b, i) => {
    const isMain = b.code === 'YUG-MAIN' || b.name.includes('Yug');
    const isMedium = b.plan === 'Enterprise Plan';

    const academic = isMain ? 48 : isMedium ? 32 : 14;
    const communications = isMain ? 35 : isMedium ? 20 : 6;
    const logistics = isMain ? 28 : isMedium ? 18 : 8;
    const totalActions = (academic + communications + logistics) * 12;

    let tier = 'ADVANCED';
    let statusClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    let activity = 'High Frequency';
    let activityColor = 'text-emerald-600';

    if (!isMain && !isMedium) {
      tier = 'BASIC';
      statusClass = 'bg-gray-100 text-gray-700 border-gray-200';
      activity = 'Moderate';
      activityColor = 'text-amber-600';
    } else if (!isMain && isMedium) {
      tier = 'INTERMEDIATE';
      statusClass = 'bg-blue-100 text-blue-800 border-blue-200';
      activity = 'Active Daily';
      activityColor = 'text-blue-600';
    }

    return {
      id: `${i + 1}.`,
      school: b.name,
      code: b.code,
      tier,
      statusClass,
      academic,
      communications,
      logistics,
      totalActions: `${totalActions.toLocaleString()} ops/mo`,
      activity,
      activityColor
    };
  });

  const filtered = auditRows.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    return !q || r.school.toLowerCase().includes(q) || r.code.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleExportCsv = () => {
    const headers = [
      { key: 'school', label: 'School Name' },
      { key: 'code', label: 'Branch Code' },
      { key: 'tier', label: 'Adoption Tier' },
      { key: 'academic', label: 'Academic Events' },
      { key: 'communications', label: 'Communications Events' },
      { key: 'logistics', label: 'Logistics Events' },
      { key: 'totalActions', label: 'Monthly Operations' },
      { key: 'activity', label: 'Activity Index' }
    ];
    const ok = branchLocalDb.exportToCsv('module_feature_engagement_audit', headers, filtered);
    if (ok) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Feature adoption audit exported to CSV!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#f4f7fa] min-h-[calc(100vh-70px)] flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <Sparkles className="w-4 h-4" /> Feature Utilization Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Module Engagement &amp; Feature Adoption Audit
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cross-branch telemetry assessing module depth (LMS, fee collection, parent alerts, transport).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={handleExportCsv}
            className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" /> Export Audit CSV
          </button>
        </div>
      </div>

      {/* KPI Cards - Standardized h-[110px] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title="Avg. Adoption Score"
          value="92.4%"
          subText="Across all operational schools"
          isLive={true}
          icon={Sparkles}
          glowColor="#8b5cf6"
          stroke="#8b5cf6"
          iconBg="linear-gradient(135deg, #a78bfa, #8b5cf6)"
          iconColor="#ffffff"
          spark={[82, 85, 88, 90, 91, 92, 94]}
          badge="High Adoption"
        />
        <KpiCard 
          title="LMS & Attendance"
          value="96.8%"
          subText="Core curriculum active"
          icon={CheckCircle2}
          glowColor="#10b981"
          stroke="#10b981"
          iconBg="linear-gradient(135deg, #34d399, #10b981)"
          iconColor="#ffffff"
          spark={[90, 92, 94, 95, 96, 97, 97]}
          badge="Max Depth"
        />
        <KpiCard 
          title="Parent App Active"
          value="88.5%"
          subText="Parent mobile portal logins"
          icon={Award}
          glowColor="#3b82f6"
          stroke="#3b82f6"
          iconBg="linear-gradient(135deg, #60a5fa, #3b82f6)"
          iconColor="#ffffff"
          spark={[78, 80, 82, 85, 86, 88, 89]}
          badge="Mobile"
        />
        <KpiCard 
          title="Campuses Audited"
          value={String(branches.length || 4)}
          subText="Real-time telemetry audit"
          icon={Building2}
          glowColor="#f97316"
          stroke="#f97316"
          iconBg="linear-gradient(135deg, #fb923c, #f97316)"
          iconColor="#ffffff"
          spark={[3, 3, 4, 4, 4, 4, 4]}
          badge="100% Synced"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 flex-1 flex flex-col overflow-hidden">
        
        {/* Card Header & Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0b1329] uppercase tracking-tight">
            <Award className="w-4 h-4 text-purple-600" /> Platform Feature Depth Matrix
          </div>
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-[10px] text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search school name..."
              className="w-full pl-9 pr-3.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0b1329] text-white">
              <tr className="text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 text-center">#</th>
                <th className="py-3 px-3.5">Campus Name</th>
                <th className="py-3 px-3.5 text-center">Adoption Tier</th>
                <th className="py-3 px-3.5 text-center">Academic (LMS)</th>
                <th className="py-3 px-3.5 text-center">Communications</th>
                <th className="py-3 px-3.5 text-center">Logistics</th>
                <th className="py-3 px-3.5 text-right">Activity Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {currentRows.map((row, i) => (
                <tr key={i} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-3.5 text-center text-gray-400 font-mono text-xs">{row.id}</td>
                  
                  <td className="py-3.5 px-3.5">
                    <div className="font-bold text-gray-900 text-xs">{row.school}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{row.code}</div>
                  </td>

                  <td className="py-3.5 px-3.5 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${row.statusClass}`}>
                      {row.tier}
                    </span>
                  </td>

                  <td className="py-3.5 px-3.5 text-center font-bold text-gray-800">
                    {row.academic} modules
                  </td>

                  <td className="py-3.5 px-3.5 text-center font-medium text-gray-600">
                    {row.communications} channels
                  </td>

                  <td className="py-3.5 px-3.5 text-center font-medium text-gray-600">
                    {row.logistics} services
                  </td>

                  <td className="py-3.5 px-3.5 text-right">
                    <div className={`font-bold text-xs ${row.activityColor}`}>{row.activity}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{row.totalActions}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4 mt-auto">
          <div className="text-xs text-gray-500 font-medium">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} institutions
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <button 
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-white disabled:opacity-40 font-medium transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <span className="px-3 py-1 bg-purple-600 text-white rounded-lg font-bold">
              {page} / {totalPages}
            </span>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-white disabled:opacity-40 font-medium transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom KPI Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-center uppercase tracking-wider text-[11px] font-bold p-2">
        <div className="p-4">
           <div className="text-xl text-emerald-600 font-black mb-0.5">2</div>
           <div className="text-gray-500">Power Campuses</div>
        </div>
        <div className="p-4">
           <div className="text-xl text-blue-600 font-black mb-0.5">2</div>
           <div className="text-gray-500">Active Daily</div>
        </div>
        <div className="p-4">
           <div className="text-xl text-indigo-600 font-black mb-0.5">1</div>
           <div className="text-gray-500">In Onboarding</div>
        </div>
        <div className="p-4">
           <div className="text-xl text-emerald-600 font-black mb-0.5">0</div>
           <div className="text-gray-500">Risk of Churn</div>
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

export default EngagementAudit;

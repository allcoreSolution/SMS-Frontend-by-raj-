import React from 'react';
import {
  Package,
  IndianRupee,
  TrendingDown,
  Wrench,
  Users,
  ChevronRight,
  Plus,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const STATUS_COLORS = {
  Active: '#10b981',
  Assigned: '#3b82f6',
  'In Maintenance': '#f59e0b',
  Disposed: '#64748b'
};

const PIE_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function AssetOverviewTab({
  stats = {},
  onNavigateTab,
  onOpenRegister,
  onOpenIssue,
  onOpenMaintenance,
  onOpenCategory
}) {
  const {
    totalAssets = 0,
    totalOriginalCost = 0,
    totalCurrentValue = 0,
    totalDepreciation = 0,
    assignedAssetsCount = 0,
    inMaintenanceCount = 0,
    disposedCount = 0,
    categoryBreakdown = [],
    statusCounts = {},
    recentAssets = [],
    recentAllocations = [],
    recentMaintenances = [],
    recentAudits = []
  } = stats;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const statusPieData = [
    { name: 'Active / Available', value: statusCounts.Active || 0, color: '#10b981' },
    { name: 'Assigned to Staff', value: statusCounts.Assigned || assignedAssetsCount || 0, color: '#3b82f6' },
    { name: 'In Maintenance', value: statusCounts.InMaintenance || inMaintenanceCount || 0, color: '#f59e0b' },
    { name: 'Disposed / Retired', value: statusCounts.Disposed || disposedCount || 0, color: '#94a3b8' }
  ].filter(d => d.value > 0);

  // Fallback if empty
  const chartCategoryData = categoryBreakdown.length > 0 ? categoryBreakdown.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 14) + '...' : c.name,
    originalCost: c.cost || 0,
    currentValue: c.value || 0,
    count: c.count || 0
  })) : [
    { name: 'IT Equipment', originalCost: 450000, currentValue: 360000, count: 6 },
    { name: 'Smart Class & AV', originalCost: 320000, currentValue: 270000, count: 4 },
    { name: 'Lab Apparatus', originalCost: 180000, currentValue: 150000, count: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assets */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-5 text-white shadow-lg shadow-indigo-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-indigo-100 uppercase tracking-wider">Total Fixed Assets</p>
              <h3 className="text-3xl font-extrabold mt-1">{totalAssets}</h3>
              <p className="text-xs text-indigo-200 mt-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Tracked across all wings
              </p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('register')}
            className="mt-4 w-full flex items-center justify-between text-xs font-semibold py-1.5 px-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            <span>View Asset Register</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Acquisition Cost */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-5 text-white shadow-lg shadow-emerald-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Acquisition Value</p>
              <h3 className="text-2xl font-extrabold mt-1">{formatCurrency(totalOriginalCost)}</h3>
              <p className="text-xs text-emerald-200 mt-1">Total historical purchase cost</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('reports')}
            className="mt-4 w-full flex items-center justify-between text-xs font-semibold py-1.5 px-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            <span>Audit & Valuation Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Book Value */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 p-5 text-white shadow-lg shadow-cyan-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-cyan-100 uppercase tracking-wider">Current Book Value</p>
              <h3 className="text-2xl font-extrabold mt-1">{formatCurrency(totalCurrentValue)}</h3>
              <p className="text-xs text-cyan-200 mt-1">
                Depreciation: <span className="font-semibold text-amber-200">-{formatCurrency(totalDepreciation)}</span>
              </p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('depreciation')}
            className="mt-4 w-full flex items-center justify-between text-xs font-semibold py-1.5 px-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            <span>View Depreciation Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Operations (Allocations & Maintenance) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-5 text-white shadow-lg shadow-amber-500/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-amber-100 uppercase tracking-wider">Operation Status</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-extrabold">{assignedAssetsCount}</span>
                <span className="text-xs font-medium text-amber-200">Allocated</span>
                <span className="text-2xl font-extrabold ml-1">·</span>
                <span className="text-3xl font-extrabold">{inMaintenanceCount}</span>
                <span className="text-xs font-medium text-amber-200">Repairs</span>
              </div>
              <p className="text-xs text-amber-100 mt-1">Staff custody & active service</p>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onNavigateTab('assignments')}
              className="flex-1 flex items-center justify-center text-xs font-semibold py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              Custody Log
            </button>
            <button
              onClick={() => onNavigateTab('maintenance')}
              className="flex-1 flex items-center justify-center text-xs font-semibold py-1.5 px-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTION SHORTCUTS */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
          <span className="text-sm font-bold text-slate-800">Quick Actions</span>
          <span className="text-xs text-slate-500 hidden sm:inline">| Fast register, allocate and service fixed assets</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Register Asset
          </button>
          <button
            onClick={onOpenIssue}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Users className="w-4 h-4" /> Issue to Staff
          </button>
          <button
            onClick={onOpenMaintenance}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Wrench className="w-4 h-4" /> Schedule Service
          </button>
          <button
            onClick={onOpenCategory}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* 3. RECHARTS CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Cost vs Book Value BarChart */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Category Valuation & Net Value (₹)</h3>
              <p className="text-xs text-slate-500">Historical Purchase Cost vs Current Written-Down Value</p>
            </div>
            <button
              onClick={() => onNavigateTab('categories')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              All Categories <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartCategoryData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="originalCost" name="Original Cost" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={22} />
                <Bar dataKey="currentValue" name="Current Value" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Status Distribution Donut */}
        <div className="lg:col-span-4 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Asset Status Distribution</h3>
              <span className="text-xs font-bold text-slate-500">{totalAssets} Assets</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} Assets`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {statusPieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY & MAINTENANCE DUE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Maintenance & Services */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Maintenance & Repair Work</h3>
                <p className="text-xs text-slate-500">Active and upcoming service logs</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('maintenance')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentMaintenances.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              All equipment is operating smoothly with 0 open maintenance tickets.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMaintenances.map((mnt) => (
                <div
                  key={mnt._id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {mnt.assetCode}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{mnt.assetName}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">{mnt.issueDescription}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span>Tech: <strong className="text-slate-700">{mnt.technician || mnt.vendor || 'Authorized Service'}</strong></span>
                      <span>·</span>
                      <span>Cost: <strong className="text-slate-700">{formatCurrency(mnt.cost)}</strong></span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      mnt.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    }`}
                  >
                    {mnt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Custody & Allocations Feed */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Active Staff Custody</h3>
                <p className="text-xs text-slate-500">Recent asset handovers & assignments</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('assignments')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Custody Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentAllocations.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No assets currently checked out.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAllocations.map((alloc) => (
                <div
                  key={alloc._id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {alloc.assetCode}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{alloc.assetName}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <span className="text-slate-500">Holder:</span>
                      <span className="font-bold text-slate-800">{alloc.staffName}</span>
                      <span className="text-slate-400">({alloc.department || 'Staff'})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Issued: {new Date(alloc.issueDate).toLocaleDateString('en-IN')}</span>
                      {alloc.expectedReturnDate && (
                        <span>· Due: {new Date(alloc.expectedReturnDate).toLocaleDateString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {alloc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
